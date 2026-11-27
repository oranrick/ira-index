# Debate a cuatro (RTVE, 26-nov-2026) · Criterios de codificación

Decisiones tomadas al codificar las cuatro piezas que los manuales no resuelven del todo. Valen igual para las cuatro candidaturas. Las marcadas con **⚑** cambian la nota de alguien y conviene que el autor las revise antes de publicar.

Manuales: P1 v1.1 con los cambios de v1.2 acordados en `ESTADO.md` · P2 v1.0 · P3 v0.1 · P5 v0.1 · P6 v0.1. P4 y P7 no tienen manual: no se codifican y no hay nota IRA agregada.

## Material

- Una pieza por candidatura (`textos/debate-rtve-2026-<slug>.txt`) con todas sus intervenciones de los cuatro bloques, en orden. Texto tal cual de la transcripción revisada por el autor (subtítulos automáticos de YouTube, con sus correcciones). No se corrige ninguna palabra.
- La segmentación en oraciones es la de spaCy (`es_core_news_md`). A veces une dos turnos en una oración; cuando eso cambia una decisión, la nota de la fila lo dice.
- Tramos con transcripción dudosa que no se codifican: Abascal 170 («Catalancaaba de dar un golpe»), Colau 152-153 («tanto necesita el señor Sánchez, señor Colón»). En P1, las referencias dudosas van como `A` (ambiguo).
- Codificador único (Claude). No hay fiabilidad entre codificadores.

## P1 · Frontera del nosotros

**Referencias**
- **`2R`, categoría nueva.** La segunda persona dirigida a un rival del debate («usted», «ustedes» a la cara) no es interpelación al público: no puntúa. Se cuenta en la ficha. Sin esta regla, Feijóo tendría 82 referencias de interpelación «contra alguien».
- **El «ustedes» al público concuerda en tercera persona** («Fíjense», «Pueden estar tranquilos», «Les aseguro») y el extractor no lo ve. Se añade a mano: `2I`, o `2C` si la oración ataca a alguien.
- **Clíticos pospuestos** («callándonos», «quedarnos», «hacernos») y verbos que el extractor no vio («batallamos», «competimos»): se añaden a mano con la misma regla que el resto.
- Categorías del nosotros: Gobierno → `I`; partido → `G`; país → `U`; frente a un otro identificable en la oración o en la anterior → `GC`; cita o voz que el hablante pone en boca de otros → `X`; los presentes en el debate → `S`.
- **Políticas sin agente no hacen `GC`** («las políticas de los últimos años», «las que se han estado aplicando»): el perdedor tiene que estar en el texto (regla 1 del manual).
- **Una medida sobre un grupo no lo convierte en el otro del nosotros** («queremos eliminar las subvenciones a los sindicatos», «el dinero que sacamos a los ricos»): `G`. Lo recoge P6.
- El nosotros irónico contra un rival («nos quedamos con la curiosidad de cómo lo haría») es `GC`.

**Eventos de frontera**
- `C1` cuando la oración opone de forma explícita el nosotros (o «los españoles», «los nuestros») a otro identificable. Las acusaciones de daño sin esa estructura («este gobierno ha desprotegido a…») son P3, no `C5`.
- «O nosotros o ellos» con forma de elección electoral → P1 `C1` (P6 manda este caso a P1), no `X6`.
- **⚑ Negar la legitimidad para gobernar o para estar en el debate → `C4`.** «No merecen gobernar España» (Sánchez), «nadie puede ser presidente si no garantiza…» y «yo sería incapaz de venir aquí en su situación procesal» (Feijóo), «no debería estar de pie en este debate», «cómo se atreve a venir aquí» (Abascal). La de Feijóo, 212, estaba en P3 como `A` y pasó a P1 para tratarla igual que las de Abascal.
- Excepción democrática (`CP`) aplicada dos veces: «no tendría que estar aquí después de haber asaltado RTVE» (Abascal, 166: conducta contra un medio público) y «nos están matando a las mujeres por violencia machista» (Colau, 90: los agresores). No condenar la violencia no es conducta violenta: «un partido que no condena la violencia machista y nos pone en peligro» (Colau, 3) es `C5` normal.
- La solidaridad con una persona del otro lado sin evaluarla es `A5` («su esposa tiene toda mi solidaridad», Colau, 168-169).

## P2 · Marco metafórico

- Imagen-acusación con la prueba del ancla de P3; imagen-acción con la prueba de las reglas; ANI e INM contra personas polarizan siempre («el gran buitre… a mi izquierda», «hay que barrer todo este asalto»).
- **«Regalar»**: es literal si no hay contrapartida (sanidad o ayudas sin pago, cooperación al desarrollo) y es imagen si recae sobre algo que se vende o se contrata («regalar el suelo a los especuladores», «regalando a sus amiguetes de la sanidad privada»).
- «Importar violadores» es imagen (personas como mercancía); «importar machismo» no (el diccionario recoge importar costumbres).
- Literales, no imagen (van a P3): «mafia» (acepción 3 del DLE), «enemigo de los trabajadores», «callarnos». Muertas, no cuentan: «disparar los precios», «tirar la toalla», «llenarse la boca», «cojear del mismo pie», «atajar de raíz», «condenar a» una situación.

## P3 · Polaridad moral

- El ancla vale en la oración o en la contigua. Las personas nombradas cuentan como episodio identificable (el Peugeot, Koldo, Ábalos, Mazón).
- Los cuantificadores totalizadores («siempre», «todo», «en todo», «ningún tipo») → `D5`. «Hasta cuatro veces» acota el «siempre».
- **⚑ Sanción criminal anclada solo en políticas → `D2`.** «La mafia que ha entregado el poder al separatismo» (Abascal, 55-56) o llamar «corrupción» y «robo» a partidas de cooperación legales (161): las políticas no anclan un delito. Es el mismo criterio que la «censura franquista» de Sánchez (`D4` aunque haya ancla).
- **Inmigrantes como causa de la escasez → `D6`**, por el caso resuelto del manual («desde que llegaron no hay trabajo»): «los precios de la vivienda se deciden en los puertos» (Abascal, 13) y «hay menos casas, menos médicos… para los españoles» (121). El blanco humano sale de la oración anterior.
- Los hechos narrados contra una persona se tratan como acto y pasan la prueba del ancla (`A` si la pasan). Cuando una réplica cita al otro y responde con un acto suyo, la cita va a P5 y el acto a P3.
- Las palabras citadas de otro no son juicio del hablante (Ana Garrido sobre el PP; Ayuso llamando «garrapatas» a los maestros, que se codifica como acto de Ayuso).
- Ironía clara se codifica; la ficha la lista.

## P5 · Apertura al disenso

- Burla que acompaña a una respuesta al contenido → `B`. «Y tú más» que sustituye a la respuesta → `Z1`; «¿de verdad se cree que puede venir aquí a dar lecciones?» es el caso resuelto del manual.
- Descalificar una fuente por quién la paga o por su sesgo → `Z1` («organizaciones mantenidas con dinero público… o de Soros», «siempre cojean del mismo lado»).
- Negarse a discutir lo que el otro plantea → `Z3` («no voy a hablar de lo que quieren cuando ellos lo ordenen»).
- Conceder un punto concreto atribuido al otro → `V2` (Colau: el 4 % de Barcelona, la gravedad de los accidentes, que el PSOE apartó a los implicados; Feijóo: «Yo también» a la felicitación a Hernández de Cos).
- La voz de la moderadora no cuenta: solo la de quien piensa distinto.
- Las repeticiones en oraciones distintas cuentan cada vez (el manual lo dice). Afecta sobre todo a las cadenas de «es un bulo» y de «buena gestión».

## P6 · Llamada a la acción

- «Un poco de respeto» y «cambia de registro» → `C3`. «Usted calladita» → `X3`.
- Exigencias dentro de las reglas → `R`: dimitir, dar explicaciones, condenar algo, reconocer el resultado, que se pregunte al otro.
- Grupos definidos por su conducta y tratados por la vía legal → `R` (corruptos, corruptores, agresores a la cárcel).
- Medidas fiscales o de gasto sobre un grupo → `R` («subir los impuestos a los ricos», «impuestos disuasorios para las fortunas extranjeras», expropiar a los fondos buitre, quitar subvenciones). No excluyen de ningún derecho.
- Proponer a otro partido un acuerdo de gobierno o un pacto → `C1`.
- «Remigración» → `X1` (caso resuelto del manual).
- **⚑ «Prioridad nacional» en ayudas, vivienda protegida, ingreso mínimo y sanidad («solo para españoles») → `X1`.** El manual (4.2) dice que una medida sobre un grupo definido por su origen es `X1`. Se lee como sacar al otro de la comunidad de derechos. Si se codificara como `R`, el P6 de Abascal pasaría de 4,7 a 5,7.
- **⚑ «Comprométanse. Vamos a dejarlo en un 50 %» (Abascal, 64-65) → `C1` + `C2`.** Es una oferta de acuerdo a los rivales, aunque la oración siguiente la convierte en ataque. P6 codifica la forma; el posible cebo es asunto de P7, que no existe. Sin estos dos eventos, su P6 bajaría a 3,8. Con los dos cambios a la vez (sin la oferta y con la prioridad nacional como `R`), quedaría en 5,0.

## Límites que se ven en este debate

1. **El alcance de P1 solo cuenta la primera persona del plural.** Un discurso cuyo grupo propio son «los españoles» en tercera persona, y cuya exclusión va en medidas, no baja el alcance: esas marcas van a P6 (`X1`) y a la permeabilidad. Por eso el P1 de Abascal (5,2) sale por encima del de Sánchez (4,4). Es una pregunta para P1 v2: ¿debe el alcance mirar también el grupo nombrado en tercera persona?
2. **La interpelación con el mínimo de 3 casos salta entre 0 y 10.** Abascal tiene 3 de 3 inclusivas («pueden estar tranquilos»), Feijóo 0 de 3, y ese indicador pesa el 22 %. Sin su interpelación, el P1 de Abascal sería 3,8.
3. P2 apenas puntúa: casi todas las imágenes de Sánchez, Feijóo y Colau tienen ancla o blanco no humano. Solo Abascal llega al mínimo.
4. Los márgenes de P3, P5 y P6 son provisionales: sus manuales aún no fijan margen. Se usa la misma beta que en P2, con el neutro a mitad (`scripts/calcular_signo.py`).
5. Debate, no discurso: el formato premia la réplica rápida. Las notas no son comparables sin más con las de un mitin o una intervención institucional.

## Propuestas para los manuales

- P1: añadir `2R` y la regla del «ustedes» en tercera persona. Revisar el mínimo de la interpelación.
- P2: añadir a la jurisprudencia la regla de «regalar» y la de «importar».
- P3: añadir la sanción criminal anclada solo en políticas como caso resuelto (`D2`).
- P6: decidir si la «prioridad nacional» es `X1` o `R`, y añadirla a los casos resueltos.
