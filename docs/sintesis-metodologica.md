# El contagio de las palabras, medido: síntesis metodológica del IRA

**Ricardo Grisales Ramírez · julio de 2026**
Documento de síntesis entre la evidencia empírica acumulada por el IRA Index
(43 análisis: corpus curado + series diarias automatizadas) y el marco teórico
del TFG *El contagio de las palabras* (UCM, 2024). Base empírica:
`docs/auditoria-metodologia.md`.

---

## 1. Lo que la evidencia confirma

### 1.1 El encuadre afectivo es transversal, no local (Lakoff)

El hallazgo estadístico central del corpus — los siete parámetros del IRA
correlacionan entre sí con una media de r = 0.89 y se comportan como una sola
dimensión latente (α = 0.98; un primer componente explica ~91% de la varianza)
— admite dos lecturas, y la primera es teórica: **es exactamente lo que la
lingüística cognitiva predice**. Si las metáforas estructuran el pensamiento
(Lakoff & Johnson, 1980) y no son ornamento local, un discurso que encuadra la
política como guerra no puede, a la vez, sostener pronombres porosos, validar
el disenso o convocar cooperación: el dominio fuente contamina todos los
niveles de la elección lingüística. El "cuadrado ideológico" de Van Dijk opera
igual: maximizar lo negativo del otro arrastra simultáneamente la deixis (el
"ellos" amenazante), la polaridad moral y el vector de acción. La
unidimensionalidad empírica del IRA es coherente con la tesis del contagio:
la postura afectiva de un discurso es un *sistema*, no una suma de rasgos
independientes. Trump y Putin no puntúan bajo en un parámetro y alto en otro;
puntúan bajo *en todo*, porque el marco bélico-inmunitario es totalizante.

### 1.2 La coherencia afectiva es un rasgo del hablante, no del día (Damasio, Wodak)

La prueba intra-figura rompe el espejismo de redundancia total: dentro de la
serie diaria de Sheinbaum (n=15), la correlación media entre parámetros cae a
0.57, y el parámetro que se independiza es precisamente P7 (engagement
dialógico / coherencia afectiva), con correlaciones de 0.28–0.37 frente al
resto. Su varianza día a día es mínima (SD 0.24, la menor de los siete). La
lectura teórica es directa: la autenticidad afectiva que P7 operacionaliza
(Damasio: el receptor detecta somáticamente la incoherencia; Wodak: la
consistencia entre lo que el discurso dice y hace) **no depende del contenido
de la jornada sino de la firma retórica del hablante en un género dado**. Los
otros parámetros respiran con la agenda del día — la polaridad moral
(dicotomía) es la más sensible al contenido (SD diaria 0.91) —; la coherencia
es estructural. El dato empírico valida la distinción conceptual entre P5
(qué dice el discurso sobre el desacuerdo) y P7 (cómo lo dice), que la
revisión metodológica había defendido contra la tentación de fusionarlos.

### 1.3 El género discursivo condiciona el nivel y la estabilidad (Van Dijk, Charaudeau)

Las dos series diarias con volumen dibujan un contraste nítido: la mañanera de
Sheinbaum — género ritualizado, pedagógico, con turnos de prensa — produce un
IRA estable (7.13 ± 0.58); los discursos de Milei — actos partidarios,
ceremonias patrióticas, foros ideológicos — oscilan el triple (3.81 ± 1.43,
rango 2.20–5.34). El modelo de contexto de Van Dijk (2008) y el contrato
comunicativo de Charaudeau anticipan esto: el género no es un envoltorio
neutro sino un regulador de lo decible afectivamente. Sánchez lo exhibe
dentro de su propio corpus: 6.55 ante la Asamblea General de la ONU, 5.08 en
la Cumbre Progresista de Barcelona — el mismo hablante estrecha el "nosotros"
y agudiza la dicotomía cuando el auditorio es la tribu y no la comunidad
internacional (deixis como posicionamiento: Chilton). Para la serie
histórica esto obliga a una cautela: **comparar IRAs entre figuras es
comparar también géneros**; la señal limpia está en la evolución intra-figura
e intra-género.

### 1.4 La mediación periodística comprime el espectro afectivo

Los cinco medios analizados ocupan la franja 3.2–6.8 sin tocar los extremos
que sí alcanzan los políticos (1.6–7.8). Ni el medio más polarizante (RT,
3.23) desciende al suelo de Putin (1.58), ni el más empático (Público, 6.77)
alcanza el techo de Ardern (7.77). Es consistente con la hipótesis de la
mediación editorial: el género informativo amortigua la carga afectiva
directa incluso cuando el posicionamiento ideológico es marcado. Con n=10 es
tendencia preliminar, pero estable en las dos generaciones de análisis.

## 2. Lo que la evidencia matiza

### 2.1 El radar de siete ejes promete más independencia de la que hay

Si siete medidas comparten el 90% de su varianza a nivel de corpus, presentar
el IRA como batería multidimensional exagera visualmente la información
disponible entre figuras. Los datos sugieren una reformulación honesta: el
IRA es **un índice unidimensional de resonancia afectiva con siete lentes
analíticas cualitativas**. Las lentes no sobran — sus descripciones, citas y
anotaciones son donde vive el análisis crítico del discurso —, pero sus
*scores* solo se separan al mirar la evolución de una misma figura. El radar
tiene sentido pleno en la vista diaria/intra-figura; entre figuras, la
diferencia de perfil es casi solo diferencia de nivel.

### 2.2 El evaluador es parte del instrumento (mono-método)

Todos los scores provienen del mismo evaluador LLM. Parte de la
unidimensionalidad puede ser "halo" del evaluador — un juicio global que
arrastra los siete scores — y no propiedad del discurso. Dos hechos acotan
esta sospecha sin eliminarla: (a) el halo se rompe parcialmente intra-figura
(r̄ 0.57), cosa que un sesgo de evaluador puro no explicaría bien; (b) el
re-análisis del corpus con la metodología revisada desplazó los niveles
absolutos (Ardern 9.07 → 7.78) pero **preservó el orden** de las figuras, lo
que sugiere fiabilidad ordinal aun con inestabilidad cardinal. La
consecuencia metodológica es clara y va al programa de trabajo: submuestra
codificada por humanos con la misma rúbrica, y reporte de la concordancia
humano-máquina antes de cualquier uso académico fuerte de los valores
absolutos.

### 2.3 La unidad de análisis real es "la apertura del discurso"

El pipeline trunca cada texto a 8.000 caracteres (~1.300 palabras). Para una
mañanera de dos horas, el IRA diario mide la apertura, no el todo. Defendible
(la apertura es donde el hablante fija el marco: Lakoff 2004 — quien elige el
marco gana el debate antes de empezar), pero debe declararse como decisión de
diseño y no como accidente técnico.

## 3. Lo que abre preguntas nuevas

1. **¿Qué mediría un octavo parámetro ortogonal?** El P8 eliminado replicaba
   el bloque redundante. Los datos piden lo contrario: dimensiones que NO
   correlacionen r>0.9 con la resonancia global — complejidad argumentativa,
   especificidad referencial (¿nombra políticas o esencias?), ratio
   aserción/argumento —, algunas medibles sin LLM, lo que además atacaría el
   problema del mono-método por diseño.
2. **¿Es la volatilidad una variable de interés en sí misma?** La SD diaria de
   Milei triplica la de Sheinbaum. Una "varianza afectiva" por figura —
   cuánto oscila su registro según el auditorio — podría ser tan informativa
   como el nivel medio: la estabilidad de Sheinbaum y el bandazo de Sánchez
   entre ONU y Barcelona describen estrategias retóricas distintas que el
   promedio aplana.
3. **¿Detecta la serie temporal los quiebres políticos?** Con las series de
   Sánchez y (eventualmente) las figuras colombianas tras el cambio de
   gobierno de agosto de 2026, el instrumento queda posicionado para su test
   más interesante: si los quiebres institucionales (elecciones, crisis,
   transiciones) dejan firma medible en la resonancia afectiva del discurso
   — el experimento natural que el TFG solo podía postular.

---

*Datos y scripts reproducibles: `scripts/audit-methodology.mjs`,
`docs/auditoria-metodologia.md`. Serie diaria: tabla `daily_analyses`,
pipeline `api/cron/daily-all.js`.*
