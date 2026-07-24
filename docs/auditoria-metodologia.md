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

| Parámetro | Peso | Media | SD | Min | Q25 | Mediana | Q75 | Max | CV |
|---|---|---|---|---|---|---|---|---|---|
| P1 pronominal | 20% | 6.32 | 2.10 | 1.5 | 5.50 | 7.2 | 7.80 | 9.5 | 0.33 |
| P2 metafora | 20% | 5.96 | 2.19 | 1.2 | 4.65 | 6.8 | 7.50 | 9.2 | 0.37 |
| P3 dicotomia | 10% | 5.29 | 2.09 | 1.0 | 3.90 | 5.5 | 7.10 | 8.2 | 0.40 |
| P4 tono | 20% | 6.28 | 2.10 | 1.5 | 5.25 | 7.0 | 7.60 | 9.5 | 0.33 |
| P5 disenso | 20% | 5.44 | 2.13 | 1.0 | 3.85 | 6.0 | 6.80 | 8.8 | 0.39 |
| P6 vector | 5% | 6.15 | 2.09 | 1.2 | 5.25 | 7.0 | 7.65 | 9.0 | 0.34 |
| P7 coherencia | 5% | 6.79 | 1.67 | 2.0 | 5.75 | 7.4 | 7.85 | 9.5 | 0.25 |

**Lecturas:**

- **[SÓLIDO]** Ningún parámetro es "plano": todos recorren casi la escala completa
  (rangos de 7–8 puntos) con SD ≈ 2. No hay parámetros muertos por falta de varianza.
- **[SÓLIDO]** `dicotomia` y `disenso` son los más discriminantes (CV 0.40 y 0.39) y
  los más "duros" (medias más bajas: 5.29 y 5.44): el motor concede menos puntos por
  defecto en polaridad moral y apertura al disenso.
- **[SÓLIDO]** `coherencia` es el más comprimido (SD 1.67, CV 0.25) y el más
  "generoso" (media 6.79, máximo Q25). El motor rara vez castiga la coherencia
  afectiva — ver §4 antes de concluir que sobra.

---

## 3. Redundancia global: los 7 parámetros miden una dimensión

Matriz de correlaciones de Pearson (n=43), resumen:

| | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|---|---|---|---|---|---|---|---|
| P1 pronominal | — | .94 | .92 | .97 | .87 | .98 | .88 |
| P2 metafora | | — | .92 | .97 | .91 | .95 | .89 |
| P3 dicotomia | | | — | .96 | .88 | .95 | .86 |
| P4 tono | | | | — | .90 | .98 | .89 |
| P5 disenso | | | | | — | .90 | .90 |
| P6 vector | | | | | | — | .89 |
| P7 coherencia | | | | | | | — |

- Correlación media inter-parámetro: **r̄ = 0.92** (rango 0.86–0.98)
- α de Cronbach: **0.988**
- Primer componente principal (estimado desde r̄): **≈ 93% de la varianza**

**[SÓLIDO]** A nivel de corpus completo, los 7 parámetros se comportan como **una
sola dimensión latente** medida siete veces. Como *escala* el IRA es
extraordinariamente consistente (α=0.99); como *batería de dimensiones
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
| r̄ inter-parámetro | 0.92 | **0.57** |
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
| P1 pronominal | 0.20 | 0.200 | .97 |
| P2 metafora | 0.20 | 0.208 | .98 |
| P3 dicotomia | 0.10 | 0.100 | .96 |
| P4 tono | 0.20 | 0.200 | .99 |
| P5 disenso | 0.20 | 0.203 | .94 |
| P6 vector | 0.05 | 0.050 | .98 |
| P7 coherencia | 0.05 | 0.040 | .92 |

**[SÓLIDO]** Los pesos efectivos coinciden casi exactamente con los nominales
(las SD son casi idénticas entre parámetros): la ponderación decidida en la
revisión metodológica se traduce fielmente al índice final. Ningún parámetro
domina en la sombra. `tono` es el mejor proxy individual del IRA completo (r=.99).

---

## 6. Perfiles por figura

| Figura | n | IRA medio | SD | Observación |
|---|---|---|---|---|
| Ardern | 2 | 8.99 | — | techo del corpus |
| Mujica | 1 | 8.74 | — | |
| Sheinbaum | 17 | 7.30 | 0.45 | serie diaria estable |
| Público | 2 | 6.77 | — | |
| Telemundo | 2 | 6.35 | — | |
| El País | 2 | 6.23 | — | |
| Sánchez | 3 | 6.05 | 0.84 | ONU 6.55 vs Barcelona 5.08: sensible al auditorio |
| Petro | 2 | 5.45 | — | |
| Milei | 5 | 3.81 | 1.43 | serie diaria volátil (2.20–5.34) |
| Fox News | 2 | 3.76 | — | |
| RT | 2 | 3.23 | — | |
| Trump | 2 | 1.95 | — | |
| Putin | 1 | 1.58 | — | suelo del corpus |

**[PRELIMINAR]** Contraste Sheinbaum/Milei en las series diarias: la mañanera
(género ritualizado, registro institucional) produce un IRA estable (SD 0.45);
los discursos de Milei (eventos heterogéneos: actos partidarios, ceremonias,
foros ideológicos) oscilan 3× más (SD 1.43). El género discursivo parece
condicionar tanto el nivel como la estabilidad del IRA. Con más figuras en el
pipeline diario (Sánchez desde hoy), esto será contrastable.

**[PRELIMINAR]** Medios vs. políticos: los medios ocupan la franja media
(3.2–6.8) sin tocar los extremos que sí alcanzan los políticos (1.6–9.0),
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
