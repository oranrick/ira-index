Vamos a aplicar el rediseño visual de IRA (Índice de Resonancia Afectiva). Todo lo que necesitas está en la carpeta `ira-rediseno/` de la raíz del repo:

- `referencia/especificacion.md`: la especificación completa. Léela entera antes de empezar.
- `brand/`: logo y favicons ya listos.
- `codigo/`: `tokens.css`, `escala.js`, `Destellos.jsx` + `Destellos.css` e `IraLogo.jsx`, para incorporar al proyecto.
- `referencia/*.dc.html`: las mesas del diseño, para consultar medidas y textos exactos. Usan una sintaxis de plantillas propia; no las copies tal cual.

Reglas:
1. Trabaja en una rama nueva, `rediseno-visual`. No hagas merge a main ni despliegues a producción; yo reviso antes.
2. Es un cambio solo visual. No toques la lógica de análisis, los prompts de la API de Anthropic, los cron jobs, el esquema de Supabase ni la autenticación. Si algo del diseño exige cambiar alguno de ellos, para y pregúntame.
3. Adapta los archivos de `codigo/` a cómo está montado el proyecto (estructura de carpetas, CSS o Tailwind, etc.), pero respeta los valores de color, tipografía y espaciado.
4. Regla de diseño fija: el color de la escala nunca aparece sin la cifra al lado.

Antes de editar nada:
- Explora el repo y dime cómo está organizado el frontend: páginas, componentes, estilos, rutas, cómo se cargan los discursos analizados y cómo funcionan ahora el registro y el inicio de sesión.
- Propón un plan por fases con los archivos que vas a tocar en cada una, y espera mi visto bueno.

Fases (un commit por fase, y `npm run build` sin errores al final de cada una):
1. Base: `tokens.css`, fuentes de Google (Space Grotesk 400/500/700, Sora 400/500, JetBrains Mono 400/500), tema oscuro global.
2. Marca: logo Señal en la navegación con "Índice de Resonancia Afectiva" al lado, favicons e iconos en `index.html` y `public/`, y título y descripción de la página.
3. Componentes: botones, etiqueta de puntuación, indicador de escala y tarjeta de discurso, usando `escala.js`. Sustituye los equivalentes actuales en toda la web.
4. Portada: navegación (Clasificación, Discursos, Metodología, Iniciar sesión, Crear cuenta), titular, texto con enlaces a metodología y ventanas modales de neurociencia, lingüística y psicoanálisis, botones, escala compacta y panel de discursos de ejemplo con rotación. El panel debe usar discursos reales de la base de datos; si los datos actuales no marcan qué palabras son polarizantes o empáticas, dímelo y lo resolvemos aparte.
5. Fondo con destellos en toda la web y repaso final: accesibilidad (contraste, foco visible, 44 px, `prefers-reduced-motion`) y vista en móvil.

Al terminar cada fase, resúmeme en pocas líneas qué cambió y qué tengo que mirar en `npm run dev`.
