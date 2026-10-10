# research/ · Metodología 2.0 del IRA

Carpeta de investigación del Índice de Resonancia Afectiva: manuales de codificación,
scripts, datos codificados y fichas. No forma parte de la web (está en `.vercelignore`).

**Principio de diseño.** El manual es la fuente única: lo usan los codificadores humanos,
es la instrucción de la IA y es la base de la página de metodología. **La IA nunca pone la
nota**: clasifica cada fenómeno con el manual, y las fórmulas calculan.

```
manual/P1.md          manual de codificación de P1 (v1.1)
scripts/extraer_p1.py   paso 1: extracción determinista de referencias (spaCy)
scripts/calcular_p1.py  paso 4: fórmulas y ficha desglosada
scripts/exportar_web_p1.py  datos de la página /metodologia/p1
datos/p1/             tablas codificadas: <id>_referencias.csv y <id>_eventos.csv
fichas/p1/            ficha de P1 de cada discurso
textos/               transcripciones en texto plano (copiadas de src/data/speeches.js)
```

## Instalar el entorno

Versiones fijadas en `requirements.txt` (spaCy 3.8.16 y `es_core_news_md` 3.8.0).
Probado con Python 3.14.

```bash
python -m venv research/.venv
research/.venv/Scripts/python -m pip install -r research/requirements.txt   # Windows
# research/.venv/bin/python -m pip install -r research/requirements.txt     # macOS / Linux
```

En los ejemplos siguientes, `py` es el Python del entorno (`research/.venv/Scripts/python`
o `research/.venv/bin/python`) y los comandos se lanzan desde `research/`.

## Analizar un discurso

1. **Extraer** (código). Una fila por referencia a personas, con su oración:
   ```bash
   py scripts/extraer_p1.py textos/<id>.txt datos/p1/<id>_referencias.csv
   ```
2. **Revisar la extracción** (humano, unos 5 minutos). Marcar los errores con `X` y añadir
   a mano las omisiones (ver sección 3 del manual).
3. **Clasificar** (humano o IA). Rellenar la columna `categoria` de cada referencia
   (secciones 4 y 5 del manual) y anotar los eventos de frontera en `datos/p1/<id>_eventos.csv`
   (sección 6).
4. **Calcular** (código). El cuarto argumento es el título de la ficha:
   ```bash
   py scripts/calcular_p1.py datos/p1/<id>_referencias.csv datos/p1/<id>_eventos.csv fichas/p1/<id>.md "Título de la ficha"
   ```

Comprobación de reproducibilidad con los dos discursos de ejemplo:

```bash
py scripts/calcular_p1.py datos/p1/sanchez-barcelona-2026_referencias.csv datos/p1/sanchez-barcelona-2026_eventos.csv fichas/p1/sanchez-barcelona-2026.md "Sánchez · Cumbre Progresista, Barcelona 2026"
py scripts/calcular_p1.py datos/p1/sanchez-onu-2024_referencias.csv datos/p1/sanchez-onu-2024_eventos.csv fichas/p1/sanchez-onu-2024.md "Sánchez · Asamblea General de la ONU 2024"
```

`git diff` no debe mostrar cambios. El extractor saca 22 referencias en la ONU y 80 en
Barcelona; las tablas codificadas tienen 23 y 82 filas porque la revisión humana añadió las
omisiones del extractor.

## Actualizar la página de la web

La página `/metodologia/p1` no calcula nada: solo lee `src/data/metodologia/p1.json`.
Si cambia un dato, se regenera el JSON (desde `research/`):

```bash
py scripts/exportar_web_p1.py
```
