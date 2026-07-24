# Auditoría estadística de la metodología IRA

**Fecha:** 24 de julio de 2026
**Datos:** todos los análisis disponibles con los 7 parámetros individuales.
**Script reproducible:** `node --env-file=.env.local scripts/audit-methodology.mjs`

---

## 1. Alcance y solidez de los datos

| Fuente | n | Composición |
|---|---|---|
| Corpus estático (`src/data/speeches.js`) | 22 | 12 discursos políticos (7 figuras) + 10 piezas de medios (5 medios) |
| `daily_analyses` (Supabase, cron) | 21 | Sheinbaum 15 · Milei 5 · Sánchez 1 |
| **Total** | **43** | |

**Procedencia (dos generaciones de análisis).** 9 de los 22 discursos estáticos
tienen una fila en la tabla `analyses` de Supabase producto de un **re-análisis
posterior** con la metodología vigente (script `reanalyze-updated.js`), con
scores sistemáticamente distintos de los de `speeches.js` (ej. Ardern
Christchurch: 9.07 estático vs 7.78 re-analizado; Mujica: 8.74 vs 7.43). **La
app muestra los valores re-analizados** (los prefiere vía `supabaseMap`), así
que esta auditoría hace lo mismo. `speeches.js` conserva la generación anterior
como fallback — la decisión sobre cuál es el corpus canónico está pendiente
(ver §7).

**Advertencia de solidez.** n=43 está justo en el umbral mínimo (~30–40) para
conclusiones estadísticas. Dos limitaciones estructurales adicionales:

1. **No independencia**: la mitad de la muestra son análisis diarios de solo
   3 figuras (15/21 de Sheinbaum). Los estadísticos globales mezclan varianza
   *entre figuras* y varianza *dentro de figuras*.
2. **Mono-método**: todos los scores provienen del mismo evaluador (motor IRA
   sobre Claude). Las correlaciones entre parámetros pueden estar infladas por
   "efecto halo" del evaluador, no solo por propiedades reales del discurso.

Cada hallazgo se marca como **[SÓLIDO]** (robusto a estas limitaciones) o
**[PRELIMINAR]** (necesita más datos o validación externa).

---

## 2. Distribución por parámetro (n=43)

| Parámetro | Peso | Media | SD | CV |
|---|---|---|---|---|
| P1 pronominal | 20% | 6.24 | 1.97 | 0.32 |
| P2 metafora | 20% | 5.74 | 2.00 | 0.35 |
| P3 dicotomia | 10% | 5.28 | 2.01 | 0.38 |
| P4 tono | 20% | 6.18 | 1.97 | 0.32 |
| P5 disenso | 20% | 5.13 | 2.02 | 0.40 |
| P6 vector | 5% | 6.01 | 2.05 | 0.34 |
| P7 coherencia | 5% | 6.55 | 1.71 | 0.26 |

**Lecturas:**

- **[SÓLIDO]** Ningún parámetro es "plano": todos recorren casi la escala completa
  con SD ≈ 2. No hay parámetros muertos por falta de varianza.
- **[SÓLIDO]** `disenso` y `dicotomia` son los más discriminantes (CV 0.40 y 0.38) y
  los más "duros" (medias más bajas: 5.13 y 5.28): el motor concede menos puntos por
  defecto en apertura al disenso y polaridad moral.
- **[SÓLIDO]** `coherencia` es el más comprimido (SD 1.71, CV 0.26) y el más
  "generoso" (media 6.55). El motor rara vez castiga la coherencia
  afectiva — ver §4 antes de concluir que sobra.

---

## 3. Redundancia global: los 7 parámetros miden una dimensión

Matriz de correlaciones de Pearson (n=43), resumen:

| | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|---|---|---|---|---|---|---|---|
| P1 pronominal | — | .92 | .93 | .96 | .81 | .97 | .81 |
| P2 metafora | | — | .92 | .96 | .89 | .93 | .85 |
| P3 dicotomia | | | — | .95 | .84 | .95 | .81 |
| P4 tono | | | | — | .85 | .97 | .85 |
| P5 disenso | | | | | — | .86 | .86 |
| P6 vector | | | | | | — | .86 |
| P7 coherencia | | | | | | | — |

- Correlación media inter-parámetro: **r̄ = 0.89** (rango 0.81–0.98)
- α de Cronbach: **0.983**
- Primer componente principal (estimado desde r̄): **≈ 91% de la varianza**

**[SÓLIDO]** A nivel de corpus completo, los 7 parámetros se comportan como **una
sola dimensión latente** medida siete veces. Como *escala* el IRA es
extraordinariamente consistente (α=0.98); como *batería de dimensiones
independientes*, no lo es: conocer un parámetro predice casi por completo los otros
seis.

**[PRELIMINAR]** Cuánto de esta redundancia es propiedad real del discurso (los
discursos empáticos lo son coherentemente en todo) y cuánto es halo del evaluador
LLM (juicio global que arrastra los siete scores) no puede separarse con estos
datos. Se necesitaría una submuestra codificada por humanos (ver §7).

---

## 4. La prueba intra-figura: el halo se rompe día a día

Si la redundancia fuera puro halo, debería mantenerse también dentro de una misma
figura. No ocurre. Correlaciones inter-parámetro **dentro de Sheinbaum**
(n=15 análisis diarios):

| Estadístico | Global (n=43) | Intra-Sheinbaum (n=15) |
|---|---|---|
| r̄ inter-parámetro | 0.89 | **0.57** |
| Par mínimo | .86 (P3×P7) | **.28 (P5×P7)** |
| Par máximo | .98 (P1×P6) | .87 (P2×P4) |

Pares menos correlacionados intra-figura — todos involucran a `coherencia`:
P5×P7=.28, P1×P7=.31, P2×P7=.35, P3×P7=.37. En Milei (n=5, muy preliminar) el
patrón se repite: P2×P7=.09, P1×P7=.12.

Variación día a día (SD intra-Sheinbaum): dicotomia 0.91 > metafora 0.66 >
disenso 0.62 > tono 0.43 > pronominal 0.32 > vector 0.30 > coherencia 0.24.

**Lecturas:**

- **[SÓLIDO dentro de su n]** Gran parte de la redundancia global es varianza
  *entre figuras*: Trump/Putin bajan en todo, Ardern/Mujica suben en todo. Día a
  día, los parámetros sí capturan variación parcialmente distinta (r̄=0.57).
- **[PRELIMINAR — el hallazgo más interesante de la auditoría]** `coherencia` (P7),
  el parámetro globalmente más débil (menor SD, menor correlación con el IRA), es
  el **más independiente** al nivel diario: mide algo que los otros seis no miden.
  Esto encaja con su definición teórica (autenticidad afectiva, Damasio): la
  coherencia es un rasgo del *hablante en el género discursivo*, no del contenido
  del día. Eliminarlo por las estadísticas globales habría sido un error.
- **[PRELIMINAR]** `pronominal` y `vector` casi no varían día a día en Sheinbaum
  (SD ≈ 0.3): funcionan como *firma estilística* estable de la figura, mientras
  `dicotomia` (SD 0.91) responde al contenido de cada jornada.

---

## 5. Contribución real de cada parámetro al IRA

Peso nominal vs. contribución efectiva a la varianza del IRA (peso × SD,
normalizado) y correlación con el IRA final:

| Parámetro | Peso nominal | Peso efectivo | r con IRA |
|---|---|---|---|
| P1 pronominal | 0.20 | 0.199 | .96 |
| P2 metafora | 0.20 | 0.202 | .98 |
| P3 dicotomia | 0.10 | 0.101 | .96 |
| P4 tono | 0.20 | 0.199 | .98 |
| P5 disenso | 0.20 | 0.204 | .92 |
| P6 vector | 0.05 | 0.051 | .98 |
| P7 coherencia | 0.05 | 0.043 | .89 |

**[SÓLIDO]** Los pesos efectivos coinciden casi exactamente con los nominales
(las SD son casi idénticas entre parámetros): la ponderación decidida en la
revisión metodológica se traduce fielmente al índice final. Ningún parámetro
domina en la sombra. `tono` es el mejor proxy individual del IRA completo (r=.99).

---

## 6. Perfiles por figura

Valores como los muestra la app (generación re-analizada donde existe):

| Figura | n | IRA medio | SD | Observación |
|---|---|---|---|---|
| Ardern | 2 | 7.77 | — | techo del corpus |
| Mujica | 1 | 7.43 | — | |
| Sheinbaum | 17 | 7.13 | 0.58 | serie diaria estable |
| Público | 2 | 6.77 | — | |
| Telemundo | 2 | 6.35 | — | |
| El País | 2 | 6.23 | — | |
| Sánchez | 3 | 6.05 | 0.84 | ONU 6.55 vs Barcelona 5.08: sensible al auditorio |
| Petro | 2 | 4.92 | — | |
| Milei | 5 | 3.81 | 1.43 | serie diaria volátil (2.20–5.34) |
| Fox News | 2 | 3.76 | — | |
| RT | 2 | 3.23 | — | |
| Trump | 2 | 2.36 | — | |
| Putin | 1 | 1.58 | — | suelo del corpus |

**[PRELIMINAR]** Contraste Sheinbaum/Milei en las series diarias: la mañanera
(género ritualizado, registro institucional) produce un IRA estable (SD 0.45);
los discursos de Milei (eventos heterogéneos: actos partidarios, ceremonias,
foros ideológicos) oscilan 3× más (SD 1.43). El género discursivo parece
condicionar tanto el nivel como la estabilidad del IRA. Con más figuras en el
pipeline diario (Sánchez desde hoy), esto será contrastable.

**[PRELIMINAR]** Medios vs. políticos: los medios ocupan la franja media
(3.2–6.8) sin tocar los extremos que sí alcanzan los políticos (1.6–7.8),
consistente con la mediación editorial del género periodístico.

---

## 7. Implicaciones y recomendaciones

1. **[Decisión del autor — pendiente]** Ningún parámetro es candidato claro a
   eliminación: el único sospechoso global (`coherencia`) resulta ser el más
   informativo al nivel intra-figura. La pregunta metodológica real no es "cuál
   sobra" sino **qué mide el IRA**: ¿un índice unidimensional con siete lentes
   cualitativas (posición defendible: α=0.99), o una batería multidimensional
   (posición que los datos globales no sostienen)? Esto afecta a cómo presentar
   el radar de parámetros y a cómo describir el instrumento en contextos
   académicos.
2. **[Decisión del autor — pendiente]** El P8 eliminado sigue "pendiente de
   reemplazar" (CLAUDE.md). Si se diseña un P8 nuevo, estos datos sugieren
   buscar **ortogonalidad**: un parámetro que no correlacione r>0.9 con el
   bloque existente (candidatos conceptuales: complejidad sintáctica,
   especificidad referencial, ratio afirmación/argumentación — medibles
   parcialmente sin LLM).
3. **Validación externa recomendada**: submuestra de ~10 discursos codificada
   por 2 evaluadores humanos con la rúbrica de CLAUDE.md para estimar cuánta
   redundancia es halo del evaluador LLM (comparar r̄ humano vs r̄ máquina).
4. **Sesgo de muestra diaria**: 15/21 análisis diarios son de Sheinbaum. Con
   Sánchez ya activo y el pipeline consolidado, la serie se equilibrará; hasta
   entonces, cualquier estadístico "global diario" es esencialmente un
   estadístico de Sheinbaum.
5. **[Decisión del autor — pendiente] Corpus canónico**: conviven dos
   generaciones de scores para los 9 discursos re-analizados (`speeches.js`
   vs tabla `analyses`; la app y esta auditoría usan la segunda). Hay que
   decidir cuál es la canónica y sincronizar la otra — o re-analizar los 13
   discursos restantes para unificar la generación en todo el corpus.
