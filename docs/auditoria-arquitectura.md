# Auditoría de arquitectura — IRA Index

**Fecha:** 24 de julio de 2026
**Alcance:** frontend (src/), API serverless (api/), motor IRA, pipeline de crons, Supabase.
**Carácter:** solo diagnóstico — ningún cambio estructural implementado sin confirmación.

---

## 1. Seguridad

### 🔴 P0 — RLS de `analyses` permite escritura anónima (verificado)
Con la clave publishable (pública por diseño, embebida en el bundle del
frontend) se puede hacer **UPDATE** sobre cualquier fila de `analyses`
(verificado empíricamente: `PATCH` → 204) e **INSERT** (así funciona
`api/analyze.js` hoy). Cualquier visitante puede corromper el corpus curado
que la app muestra como fuente de verdad (los scores re-analizados de Trump,
Ardern, Mujica, etc.).

`daily_analyses` sí está bien protegida (INSERT anónimo → 401, RLS activa).

**Arreglo (Supabase dashboard, ~10 min):** eliminar las policies de
INSERT/UPDATE para `anon` en `analyses`; los scripts de mantenimiento ya
pueden usar `SUPABASE_SERVICE_ROLE_KEY` (como hace `reweight-daily.js`).
Requiere el cambio del punto 2 para que `analyze.js` no se rompa.

### 🔴 P0 — `api/analyze.js` sin autenticación + contamina la tabla curada
1. No verifica sesión: cualquiera puede invocar análisis completos con Sonnet
   (6.000 max_tokens) a coste del propietario. El frontend exige login, pero
   la API no lo comprueba (`add-speech.js` sí lo hace bien — usar el mismo
   patrón).
2. Peor: persiste cada texto analizado en **`analyses`** (la tabla del corpus
   curado) con `entity` y `speech_id` null. Las 2 filas huérfanas actuales
   (una es un discurso de Gandhi) vienen de ahí. Los análisis de usuarios
   deberían ir a `user_analyses` (existe para eso) o no persistirse.

### 🟡 P2 — `api/quick-analyze.js` sin rate limiting
Acotado (≤400 chars, Haiku, 150 tokens) pero abierto. Riesgo de coste bajo;
un rate limit por IP (Upstash/Vercel KV) o un captcha invisible bastaría.

### ✅ Correcto
- `.env.local` en .gitignore y nunca commiteado; claves privadas fuera del repo.
- Crons con CRON_SECRET en default-deny (si la env var falta → 401).
- `add-speech.js` valida el token de sesión contra Supabase antes de operar.

---

## 2. Integridad de datos

### 🟠 P1 — Dos generaciones de análisis conviviendo
9 de 22 discursos del corpus tienen valores re-analizados en `analyses`
(generación vigente, la que muestra la app) mientras `speeches.js` conserva
la generación anterior con diferencias de hasta 1.7 puntos de IRA (Ardern
Christchurch 9.07 → 7.78). Todo lo derivado (auditoría, corpus de calibración
del motor) ya se alineó con la generación de la DB, pero la decisión de fondo
— cuál es canónica, y si conviene re-analizar los 13 discursos restantes para
unificar — es del autor. Detalle en `docs/auditoria-metodologia.md` §1 y §7.

### 🟡 P2 — Datos muertos o legacy en `ENTITIES` (App.jsx)
- `score` hardcodeado por entidad nunca se muestra (siempre lo recalcula
  `enrichedEntities` desde Supabase) y quedó en la ponderación vieja.
- `params.proyeccion` (P8 eliminado) sigue en todas las fichas, y
  `paramTexts.proyeccion` contiene prosa curada bilingüe. La ficha muestra
  "8 parámetros" mientras los análisis nuevos muestran 7. Decisión del autor:
  retirar P8 de las fichas (perdiendo esa prosa) o marcarlo como legacy.
- 2 filas `entity=null` en `analyses` (ver P0 de analyze.js) — limpiar tras
  el arreglo.

---

## 3. Deuda técnica

### 🟡 P2 — `App.jsx` monolítico (~2.400 líneas)
Mezcla datos (ENTITIES con prosa bilingüe completa, ~40% del archivo),
utilidades, componentes y rutas. Extraer `ENTITIES` a `src/data/entities.js`
sería el primer corte natural (mecánico, sin riesgo funcional).

### 🟡 P2 — Duplicación de constantes de parámetros
El mapa nombre↔clave y los colores/etiquetas de parámetros existen en 4
sitios que ya divergieron una vez (App.jsx `PARAM_KEY_MAP`, PatternsPage
`NAME2KEY`, `scripts/audit-methodology.mjs`, y el prompt de quick-analyze
que duplica la metodología del motor). Unificar en `src/data/params.js` +
hacer que quick-analyze derive su prompt del motor compartido.

### 🟢 P3 — Higiene de `scripts/`
Conviven migraciones one-off ya ejecutadas (reweight-*, translate-*) con
herramientas vigentes (audit-methodology, test-daily-all) sin distinción.
`reanalyze-updated.js` y `translations-output.json` están sin commitear.
`reweight-params.js` lleva la URL y la clave hardcodeadas en vez de env vars.
Sugerencia: `scripts/migrations/` (histórico) vs `scripts/` (vigente).

---

## 4. Rendimiento

- 🟡 **Bundle principal 456 KB** (gzip 147 KB): `speeches.js` (217 KB de
  fuente) viaja en el chunk inicial. Lazy-load del corpus (solo lo necesitan
  las vistas de discurso) recortaría el primer paint.
- 🟡 **`EntityDetailPage` trae `select=*` de `daily_analyses`**: descarga
  texto completo y segments de TODAS las filas de la entidad. Con el pipeline
  a 4 figuras esto crece ~120 filas/mes. Seleccionar columnas para la lista y
  pedir el detalle al abrir.
- 🟢 Fotos de entidades nuevas (Rufián/Bukele/Kast) usan favicons de Google
  a 128px — baja calidad y dependencia externa.
- ✅ Code-splitting de vendors (recharts, supabase, hcaptcha) ya configurado.
  Caché de assets correcta en vercel.json.

---

## 5. Pipeline diario

- 🟠 P1 — **Sin alertas de fallo**: los errores por fuente quedan en el body
  del 200 y en logs de Vercel que nadie mira. Con que una regex deje de
  matchear, la serie se corta en silencio (pasó semanas sin filas de Milei
  sin que nadie lo notara — era legítimo, pero nadie podía saberlo sin mirar
  la DB). Propuesta mínima: si un adaptador da error N días seguidos,
  insertar una fila de estado o mandar un email (Resend tiene free tier).
- 🟡 P2 — **`MAX_CHARS = 8000` trunca los discursos largos**: una mañanera
  de 2h queda reducida a sus primeros ~1.300 palabras. El IRA diario de
  Sheinbaum mide en realidad "la apertura de la mañanera". Es una decisión
  metodológica (coste vs cobertura): subir el límite, o muestrear
  inicio/medio/final.
- 🟡 P2 — `JSON.parse` sobre la salida del modelo sin reintento: una
  respuesta malformada pierde el día para esa fuente (se recupera al día
  siguiente por dedup, pero un retry barato lo evitaría).
- ✅ Dispatcher consolidado con presupuesto de tiempo, dedup por URL,
  default-deny y doble pasada diaria (13:00/20:00 UTC).

---

## 6. Propuesta priorizada

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| P0-1 | Cerrar RLS de `analyses` (dashboard Supabase) | 10 min | Crítico: integridad del corpus |
| P0-2 | Auth de sesión en `analyze.js` (patrón de add-speech) + persistir en `user_analyses`, no en `analyses` | 1 h | Crítico: coste + contaminación |
| P1-1 | Decidir corpus canónico y sincronizar `speeches.js` ↔ `analyses` | decisión + 1 h | Consistencia de todo lo publicado |
| P1-2 | Alerta simple de fallos de cron | 1–2 h | Continuidad de las series |
| P2-1 | Extraer ENTITIES y constantes de parámetros a `src/data/` | 2–3 h | Mantenibilidad |
| P2-2 | Resolver P8 en fichas (mostrar 7 o marcar legacy) | decisión + 1 h | Coherencia metodológica visible |
| P2-3 | Rate limit en quick-analyze; retry de JSON; select de columnas en EntityDetail | 2 h | Robustez/coste |
| P3 | Higiene de scripts, lazy-load del corpus, fotos propias | según hueco | Calidad de vida |

Ninguno de estos cambios está implementado (mandato de la fase: solo
diagnóstico). P0-1 y P0-2 son los únicos que recomendaría no posponer.
