# IRA · especificación del rediseño

Palabras guía: futurista, cercana, simple. Referencia estética: Linear (oscuro, minimalista, preciso). Tema único oscuro.

## Logo
- Wordmark "ira" en minúsculas, Space Grotesk Bold. El punto de la i es un anillo de resonancia salvia (#8DAA7E): punto macizo y dos ondas gruesas que se desvanecen (variante "Señal").
- Archivos: `brand/ira-logo-sobre-oscuro.svg` (letras ya convertidas en trazados, no depende de la fuente), `brand/ira-logo-sobre-claro.svg`.
- Favicon: solo el punto con sus ondas. `favicon.svg`, `favicon-16.png`, `favicon-32.png`; iconos de app con fondo Noche: `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`.
- En la barra de navegación: logo a 32 px seguido de "Índice de Resonancia Afectiva" en Sora 14 px, gris secundario, una línea, alineado a la izquierda.

## Color
Todos los valores en `codigo/tokens.css`.
- Base Dark Sunset: Noche #041414 (fondo), Nieve #FCFDFF (texto), Brasa #953A1B (marca, botón principal), Lacre #62130C (presionado), Oro #DCB149 (acento, foco, enlaces), Salvia #8DAA7E (empatía).
- Neutros: superficie #0A1E1E, elevada #112A2A, línea #1B3636, línea fuerte #2A4747, texto cita #D5DEDE, secundario #A9B8B8, tenue #7C8F8F.
- Escala 0 a 10: #8F1C17, #BE281A, #CB4021, #D7662A, #E59236, #EEA73D, #F4BC41, #DAB850, #C1B360, #A7AE6F, #8DAA7E. Texto encima: blanco de 0 a 2, Noche de 3 a 10.
- Regla: el color de la escala nunca aparece sin la cifra al lado. Las cifras van con coma decimal ("7,4").

## Tipografía (Google Fonts)
- Space Grotesk: títulos y logo. Título 500, 56 a 76 px, interlineado 1,02 a 1,07, -2 a -3 %. Subtítulo 400, 26/34.
- Sora: texto e interfaz. Texto 400, 17/28. Detalle 400, 13/20.
- JetBrains Mono: cifras y puntuaciones, 500, -4 %, cifras tabulares.

## Componentes
- **Botón principal**: fondo Brasa, texto Nieve, 48 px de alto (44 mínimo), radio 10. Presionado: Lacre. Foco: anillo Oro de 2 px.
- **Botón secundario**: transparente, borde #2A4747, texto Nieve.
- **Tarjeta de discurso**: superficie #0A1E1E, borde #1B3636, radio 18. Orador y cargo, fecha en mono, cita en Sora 20/32, puntuación grande en JetBrains Mono con el color de la escala y "/10" en tenue, barra de 11 segmentos (encendidos hasta la puntuación, el resto al 20 %), etiquetas "0 Polarizante" y "Empático 10", botón "Ver desglose".
- **Indicador de escala**: 11 casillas con su número dentro; la actual se eleva 4 px con anillo blanco.
- **Etiqueta de puntuación**: pastilla de 28 px con fondo de la escala y la cifra; o punto de color de 10 px más la cifra.

## Portada
- Fondo Noche con `<Destellos />` por toda la pantalla, detrás de todo.
- Navegación: logo con nombre · Clasificación · Discursos · Metodología · separador · Iniciar sesión · botón "Crear cuenta". (No usar la palabra "ranking".)
- Titular: "Cómo suena la política cuando escucha".
- Texto: "IRA es un índice de resonancia afectiva construido sobre una metodología que integra neurociencia, lingüística y psicoanálisis. Aquí se recogen discursos ya analizados y, con una cuenta, puedes analizar los tuyos con una IA que aplica esa misma metodología."
  - "metodología" enlaza a la página de metodología.
  - "neurociencia", "lingüística" y "psicoanálisis" son botones con aspecto de enlace (blanco, subrayado Oro) que abren una ventana modal con el ángulo de esa ciencia (textos abajo). Se cierra con X, clic fuera o Escape; foco atrapado dentro mientras está abierta.
- Botones: principal "Ver discursos analizados"; secundario "Crear cuenta para analizar". Debajo: "¿Ya tienes cuenta? Inicia sesión para analizar un discurso." Analizar requiere cuenta.
- Escala compacta de 0 a 10 con "Polarizante" y "Empático".
- A la derecha, panel vertical semitransparente (rgba(10,30,30,0.78) con desenfoque) con un discurso de ejemplo:
  - Arriba: País, Fecha, Persona, Discurso.
  - Tres fragmentos, cada uno con su etiqueta de puntuación. Las palabras polarizantes o empáticas brillan (halo rojo o salvia, ver tokens) y llevan una estrellita de cuatro puntas que titila.
  - Abajo: puntuación global del discurso y leyenda de las dos estrellas.
  - Rota entre discursos cada 7 s con fundido; flechas anterior/siguiente, puntos y contador "1 / 3". Al pulsar se reinicia el temporizador. Sin rotación con "reducir movimiento".
  - Debe alimentarse con discursos reales ya analizados de la base de datos (la marca de qué palabras son polarizantes o empáticas sale del análisis).

### Textos de las ventanas de ciencias

**Neurociencia · Cómo resuena un discurso en quien lo escucha**
Comprender a otra persona es, en parte, simularla: al escuchar, recreamos de forma encarnada sus emociones e intenciones. Desde la teoría de la variedad intersubjetiva de Vittorio Gallese, IRA entiende que un discurso empático amplía ese espacio compartido entre quien habla y quien escucha, y que uno polarizante lo estrecha hasta dividirlo en un nosotros y un ellos.
Qué observa IRA: lenguaje que invita a ponerse en el lugar del otro (empático) · apelaciones al miedo, la amenaza o la deshumanización (polarizante) · cuánto espacio deja el discurso para que el oyente se reconozca.
Referencia: Gallese.

**Lingüística · Las palabras como marcos**
Las metáforas no adornan el discurso: organizan cómo pensamos la política. Con la teoría de la metáfora conceptual de George Lakoff y el análisis crítico del discurso de Teun van Dijk, IRA estudia cómo un discurso construye grupos, a quién legitima y a quién deja fuera.
Qué observa IRA: metáforas bélicas o sanitarias aplicadas a personas o rivales (polarizante) · dicotomías del tipo nosotros contra ellos (polarizante) · pronombres y fórmulas que incluyen a quien piensa distinto (empático).
Referencias: Lakoff, Van Dijk.

**Psicoanálisis · Lo que el discurso moviliza por debajo** (borrador, pendiente de revisar por Rick)
El discurso político no solo informa: moviliza deseos, miedos e identificaciones. La mirada psicoanalítica atiende a cómo se construye la figura del enemigo, a cómo se proyecta el malestar sobre otro y a si quien habla ofrece contención o alimenta la angustia de su audiencia.
Qué observa IRA: construcción de un enemigo sobre el que se proyecta el malestar (polarizante) · gestos de contención, reconocimiento y reparación (empático) · identificaciones que el discurso propone al oyente.
Referencias: [autores de referencia].

## Accesibilidad
- Contraste AA en todo el texto. Objetivos táctiles de 44 px mínimo.
- Botones reales para acciones, enlaces reales para navegar.
- Animaciones desactivadas con `prefers-reduced-motion`.
- Funciona a ancho de móvil: la navegación se pliega, el panel de ejemplo pasa debajo del titular.

## Archivos de referencia
`referencia/1-logo.dc.html` a `5-portada.dc.html` son las mesas del diseño en HTML. Usan una sintaxis de plantillas propia (`{{…}}`, `<sc-for>`, `<sc-if>`, `<x-dc>`): sirven para leer medidas, colores y textos exactos, no para copiarlas tal cual.
