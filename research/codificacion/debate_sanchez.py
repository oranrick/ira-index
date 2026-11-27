"""Codificación de Pedro Sánchez · debate a cuatro RTVE, 26-nov-2026.
Manuales: P1 v1.2 (cambios acordados en ESTADO.md), P2 v1.0, P3 v0.1, P5 v0.1, P6 v0.1.
Criterios propios del debate: ver codificacion/CRITERIOS.md.
"""
from comun import guardar

ID = "debate-rtve-2026-sanchez"

# ── P1 · referencias: {n: (categoría, nota)} ─────────────────────────────────────────────
Y = ("Y", "")
R2 = ("2R", "segunda persona dirigida a un rival del debate: no es interpelación al público, no puntúa")
def I(n=""): return ("I", n or "nosotros institucional: el Gobierno")
def G(n=""): return ("G", n)
def U(n=""): return ("U", n)
def GC(n): return ("GC", n)

P1 = {
    1: Y, 2: I(), 3: R2, 4: Y, 5: I(), 6: G("nuestra propuesta (el partido)"), 7: G("necesitamos un parlamento más fuerte"),
    8: GC("«por eso», tras el tapón de Feijóo, Abascal y Junts (oración anterior)"),
    9: GC("frente a los gobiernos autonómicos que boicotean la ley"), 10: GC("frente al PP y Vox"),
    11: GC("frente al PP y Vox"), 12: I(), 13: I(), 14: I("cifras de gestión comparadas con Rajoy"), 15: I(),
    16: Y, 17: Y, 18: Y, 19: Y, 20: GC("la ley de vivienda que se niegan a aplicar el PP y Vox"),
    21: ("S", "los presentes en el debate"), 22: GC("nosotros frente al PP y Vox"), 23: GC("nosotros frente al PP y Vox"),
    24: ("F", "ellos"), 25: GC("frente a la presidenta de la Comunidad de Madrid"), 26: Y, 27: Y, 28: R2, 29: Y,
    30: ("F", "ellos"), 31: Y, 32: Y, 33: U("buena noticia para el país"), 34: Y, 35: Y, 36: U(), 37: I(),
    38: U("podemos revalorizar las pensiones (el país)"), 39: U(), 40: Y, 41: Y,
    42: GC("los votantes frente a «el de las tijeras y el de la motosierra»"), 43: GC("ídem"), 44: I("con nosotros (el Gobierno) crece"),
    45: G("posición del partido"), 46: G("posición del partido"), 47: I(), 48: I(), 49: Y,
    50: GC("no sabemos la posición de Feijóo"), 51: GC("lo que estamos viviendo: los bulos de la ultraderecha (oraciones contiguas)"),
    52: R2, 53: R2, 54: R2, 55: Y, 56: Y, 57: Y, 58: Y, 59: U(), 60: I(), 61: Y, 62: Y, 63: U(),
    64: ("A", "«los hemos despachado»: transcripción dudosa"), 65: U("en lo que llevamos de siglo"), 66: I(),
    67: G("lo que entendemos (el partido)"), 68: Y, 69: R2, 70: Y, 71: Y, 72: Y, 73: Y, 74: Y, 75: Y, 76: Y,
    77: Y, 78: Y, 79: Y, 80: Y, 81: Y, 82: Y, 83: Y, 84: Y, 85: Y, 86: Y, 87: Y, 88: U(), 89: U("las crisis que hemos tenido que sufrir"),
    90: I(), 91: Y, 92: Y, 93: I("lo que tenemos que hacer es invertir (el Gobierno)"), 94: U(),
    95: GC("frente a «ustedes están poniendo en cuestión el sistema de pensiones»"), 96: R2, 97: Y,
    98: U("«para que lo blindemos entre todos»: incluye a los rivales"), 99: Y, 100: Y,
    101: G("el partido ante su corrupción"), 102: G(), 103: G(), 104: G(), 105: G(), 106: Y, 107: Y, 108: Y, 109: Y, 110: Y,
    111: Y, 112: Y, 113: GC("el PP y Vox como amenaza para nuestro país"), 114: Y, 115: R2,
    116: GC("nosotros condenamos frente a Abascal"), 117: GC("ídem"), 118: GC("ídem"), 119: R2, 120: Y, 121: Y,
    122: GC("recortes de derechos que atribuye a Abascal"), 123: ("S", "los presentes"), 124: Y, 125: Y,
    126: GC("evitar los escaños del PP y Vox (oración anterior)"), 127: Y, 128: Y, 129: Y, 130: Y, 131: R2, 132: Y,
    133: R2, 134: R2, 135: R2, 136: Y, 137: Y, 138: GC("el programa del PP y Vox contra derechos en nuestro país"),
    139: Y, 140: Y, 141: GC("hemos reconocido los resultados, frente a Feijóo y Abascal"), 142: Y, 143: Y, 144: R2,
    145: Y, 146: Y, 147: Y, 148: Y,
}
def AUD(o, forma, cat, ctx, nota):
    return {"oracion": str(o), "forma": forma, "lema": forma.lower(), "tipo": "verbo" if forma[0].isupper() or forma.endswith("n") else "pronombre",
            "persona": "2", "numero": "pl", "contexto": ctx, "categoria": cat,
            "nota": "omisión del extractor (el «ustedes» al público concuerda en 3.ª persona), añadida a mano; " + nota}

ANADIDAS = [
    AUD(51, "Fíjense", "2I", "Fíjense, la inflación en España antes de la guerra de Irán estaba por debajo del 3% y después de la guerra de Irán está por encima del 4,5%.", "al público, sin atacar a nadie en la oración"),
    AUD(88, "les", "2I", "Un tratamiento de cáncer cuesta 50,000 € y yo les pregunto a la clase media trabajadora de nuestro país, ¿quién puede pagarse esas cantidades de dinero?", "al público"),
    AUD(112, "les", "2C", "Eso le digo de todas formas a los telespectadores, que tanto las familias como los ciudadanos en su conjunto pagarán esos recortes y por tanto yo lo que les digo es que es un inmenso error.", "a los telespectadores, para atacar el programa de Feijóo y Abascal (oración anterior)"),
    AUD(145, "Fíjense", "2I", "Fíjense los telespectadores, porque la ONG Amnistacional ha hecho un informe, un estudio de todos y cada uno de los programas de los cuatro partidos que estamos aquí presentes.", "a los telespectadores"),
    {"oracion": "86", "forma": "competimos", "lema": "competir", "tipo": "verbo", "persona": "1", "numero": "pl",
     "contexto": "En definitiva, competimos en calidad y no en precariedad, que es lo que proponía el señor Feijó cuando cuando gobernaba Galicia.",
     "categoria": "GC", "nota": "omisión del extractor, añadida a mano; frente al modelo de Feijóo en Galicia"},
    {"oracion": "50", "forma": "hacernos", "lema": "nosotros", "tipo": "pronombre", "persona": "1", "numero": "pl",
     "contexto": "Eh, para hacernos una idea, es el doble doble que en Italia que está gobernado por la ultraderecha, que la vida está cara, sin duda alguna.",
     "categoria": "U", "nota": "omisión del extractor (clítico pospuesto), añadida a mano; «para hacernos una idea»: marcador del discurso, no se construye frente a nadie"},
]

# ── P1 · eventos de frontera ─────────────────────────────────────────────────────────────
def C(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="C", marca=marca, blanco=blanco, nota=nota)
def A(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="A", marca=marca, blanco=blanco, nota=nota)

P1_EV = [
    C(1, "no merecen gobernar España", "C4 expulsión de la comunidad", "Vox",
      "niega la legitimidad para gobernar (P3 manda la legitimidad a P1); no es conducta violenta: no hay excepción"),
    C(27, "Nosotros queremos que la vivienda sea un derecho y el Partido Popular y Vox quieren que sea un objeto de especulación", "C1 contraposición", "PP y Vox"),
    C(47, "Si queremos una economía que continúe avanzando como está haciendo la economía española o queremos una economía que involucione de la mano del de las tijeras y el de la motosierra", "C1 contraposición", "Feijóo y Abascal",
      "«o nosotros o ellos» con forma de elección (P6 manda este caso a P1)"),
    C(86, "competimos en calidad y no en precariedad, que es lo que proponía el señor Feijó", "C1 contraposición", "Feijóo"),
    C(133, "Eso es mucho más de lo que hace el señor Feijóo y el señor Abascal", "C1 contraposición", "Feijóo y Abascal"),
    C(134, "El PSOE lo que está haciendo es expulsar la corrupción aparentemente lo que hace el Partido Popular es comprar esa corrupción", "C1 contraposición", "PP"),
    C(138, "el Partido Popular y Vox representan una auténtica amenaza a los derechos y las libertades de muchísimos colectivos en nuestro país", "C5 amenaza dirigida al nosotros", "PP y Vox"),
    C(142, "En todo caso nosotros lo hacemos, esperamos a ver exactamente usted que dice", "C1 contraposición", "Abascal"),
    C(162, "el Partido Socialista siempre a lo largo de la historia democrática hemos reconocido los resultados electorales y yo estoy escuchando al señor Feijóo y al señor Avascal hablar de pucherazo", "C1 contraposición", "Feijóo y Abascal"),
    C(166, "Porque el Partido Socialista sí lo va a hacer.", "C1 contraposición", "Feijóo"),
]

# ── P2 · eventos metafóricos ─────────────────────────────────────────────────────────────
def M(o, frag, dom, blanco, tipo_b, humano, res, nota="", reglas="", tipo="convencional", exc="no"):
    return dict(oracion=o, fragmento=frag, dominio=dom, tipo=tipo, blanco=blanco, tipo_blanco=tipo_b, humano=humano,
                reglas=reglas, une="no", excepcion=exc, resultado=res, nota=nota)

P2 = [
    M(11, "ese tapón a la regulación y a la protección", "MAQ", "Feijóo, Abascal y Junts", "personas", "sí", "N",
      "imagen-acusación con ancla: bloqueo de la regulación en el Parlamento, agentes nombrados", "ancla"),
    M(14, "están actuando como el perro del hortelano", "OTR", "PP y Vox", "personas", "sí", "N",
      "refrán; imagen-acusación con ancla en la oración contigua (no protegen ni dejan proteger con la ley de vivienda)", "ancla"),
    M(37, "van a echar humos en esta noche", "OTR", "los verificadores", "personas (terceros)", "sí", "N", "hipérbole sobre terceros, sin rival como blanco"),
    M(41, "llenar la hucha de las pensiones", "COM", "el fondo de pensiones", "política", "no", "N"),
    M(41, "robustecer el estado del bienestar", "CUI", "el estado del bienestar", "política", "no", "N"),
    M(42, "no hacer un giro de 180º", "VIA", "la política económica", "política", "no", "N"),
    M(43, "con la motosierra de 112,000 millones de euros al año", "MAQ", "el recorte propuesto", "política", "no", "N"),
    M(45, "esa motosierra", "MAQ", "la política de Milei", "política", "no", "N"),
    M(47, "una economía que continúe avanzando", "VIA", "la economía", "meta", "no", "N"),
    M(47, "de la mano del de las tijeras y el de la motosierra", "MAQ", "Feijóo y Abascal", "personas", "sí", "N",
      "apodo por la herramienta del recorte; imagen-acusación con ancla en los recortes propuestos (112.000 millones)", "ancla"),
    M(60, "disfrazados de Robin Hood", "OTR", "Feijóo y Abascal", "personas", "sí", "N",
      "imagen-acusación con ancla: las votaciones nombradas en la misma oración", "ancla"),
    M(65, "meter un tajo al gasto público", "MAQ", "el gasto público", "política", "no", "N"),
    M(111, "yo me partí la cara ante Trump", "GUE", "Trump (gobierno extranjero)", "personas (terceros)", "sí", "N", "agonista: negociación diplomática"),
    M(128, "blindarlo en la Constitución española", "INM", "el sistema público de pensiones", "política", "no", "N",
      "«blindar» protege una política; el pacto «entre todos» lo recoge P6 (C1)"),
    M(134, "expulsar la corrupción", "INM", "la corrupción", "problema", "no", "N"),
    M(147, "es ir hacia atrás", "VIA", "el rumbo del país", "meta", "no", "N"),
]

# ── P3 · juicios sobre el otro ───────────────────────────────────────────────────────────
def J(o, frag, blanco, signo, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, signo=signo, codigo=codigo, nota=nota)

P3 = [
    J(1, "no reconoce la violencia de género", "Vox", "A", "A", "posición pública identificable"),
    J(3, "él lo que está haciendo es pactar con la ultraderecha en los gobiernos autonómicos", "Feijóo", "A", "A", "pactos de gobierno identificables"),
    J(4, "pocas soluciones ofrece el señor Feijóo como siempre", "Feijóo", "D", "D1", "capacidad con extensión («como siempre»)"),
    J(13, "gobiernos autonómicos abiertamente que están boicoteando la ley estatal de vivienda", "gobiernos del PP y Vox", "A", "A", "no aplicar una ley nombrada"),
    J(15, "Ni protegen ni dejan ni dejan que protejamos", "PP y Vox", "A", "A", "ámbito: la ley de vivienda (oración anterior)"),
    J(21, "que se niegan a aplicar en las comunidades autónomas y en los ayuntamientos gobernados por el Partido Popular y por Vox", "PP y Vox", "A", "A"),
    J(27, "el Partido Popular y Vox quieren que sea un objeto de especulación para que hagan negocio", "PP y Vox", "D", "D5", "imputa un móvil (hacer negocio) sin acto identificable"),
    J(29, "Pues los de siempre y también ellos", "«los de siempre» y el PP", "D", "D5", "acusación generalizada de hacer negocio con la vivienda"),
    J(29, "la presidenta de la Comunidad de Madrid pagar con dinero público con 7 millones de euros un aticazo", "Ayuso", "A", "A", "acto identificable"),
    J(34, "es que tiene miedo a pasar como pasó Casado a la historia del Partido Popular", "Feijóo", "A", "A", "atado a un acto: no pedir la dimisión de Ayuso"),
    J(37, "los verificadores con el señor Feijóo y el señor Avascal van a echar humos en esta noche", "Feijóo y Abascal", "D", "D5", "acusación general de mentir, sin dicho concreto"),
    J(38, "No deja de ser llamativo que se queje la derecha, la ultraderecha", "PP y Vox", "A", "A", "ancla en la oración siguiente (boicot y votaciones)"),
    J(39, "si lo que han hecho ha sido boicotear una ley que funciona", "PP y Vox", "A", "A", "votaciones nombradas"),
    J(52, "la guerra de Irán, que por cierto apoya el señor Ab y también el señor Feijó", "Abascal y Feijóo", "A", "A", "posición pública identificable"),
    J(60, "cuando realmente en el parlamento han votado en contra de revalorizar las pensiones conforme al IPC", "Feijóo y Abascal", "A", "A", "votaciones nombradas"),
    J(61, "es la hipocresía de dos partidos políticos que no han pensado en el bien común", "PP y Vox", "A", "A", "etiqueta con su ancla en la oración contigua (las votaciones)"),
    J(62, "Han votado contra la gente, señora Vascal.", "Vox", "A", "A", "votaciones"),
    J(63, "Han votado contra la gente.", "Vox", "A", "A", "votaciones"),
    J(64, "que disfruta en su chalet.", "Abascal", "A", "A", "acto: cobrar el bono social térmico"),
    J(65, "quiere cargarse el ingreso mínimo vital y por supuesto quiere congelar el salario mínimo interprofesional", "Abascal", "A", "A", "posiciones y propuesta de recorte nombradas"),
    J(66, "Si es que no saben ni de lo que hablan.", "Vox", "A", "A", "capacidad atada a la propuesta de recorte de la oración anterior"),
    J(67, "Es que no saben ni de lo que hablan.", "Vox", "A", "A", "repetición, mismo ámbito"),
    J(69, "Lo único que ha aportado la ultraderecha a este país", "la ultraderecha", "D", "D5", "«lo único... insultos, mentiras, bulos»: extensión"),
    J(69, "con el eh por supuesto calor y el aplauso del señor Fijó", "Feijóo", "D", "D5", "complicidad sin acto identificable"),
    J(72, "usted por la cara está cobrando el social", "Abascal", "A", "A", "acto: cobrar el bono social térmico"),
    J(73, "es mentira que usted está cobrando el bon social térmico", "Abascal", "A", "A", "repetición del acto"),
    J(74, "Pero si votó en contra de las familias numerosas esta misma semana.", "Abascal", "A", "A", "votación con fecha"),
    J(75, "vota en contra para los demás, pero lo quiere para sí mismo", "Abascal", "A", "A", "votación"),
    J(76, "Menuda hipocresía.", "Abascal", "A", "A", "etiqueta con ancla en la oración contigua"),
    J(86, "que es lo que proponía el señor Feijó cuando cuando gobernaba Galicia", "Feijóo", "A", "A", "gestión nombrada"),
    J(91, "que están proponiendo recortes en el estado del bienestar, que allí donde gobiernan está recortando y privatizando la sanidad", "Abascal y Feijóo", "A", "A"),
    J(98, "el el dolor se acompaña, no se hace campaña con él", "Abascal", "A", "A", "ancla en la oración contigua: no respetar el luto del accidente"),
    J(99, "Fue lamentable que usted no respetara el luto del accidente ferroviario de ODA", "Abascal", "A", "A"),
    J(117, "recortó el presupuesto del servicio de salud gallego, recortó el número de de camas hospitalarias", "Feijóo", "A", "A", "gestión nombrada"),
    J(126, "machismo es este, señor Feijo", "Feijóo", "A", "A", "etiqueta atada al acto contiguo («usted calladita»)"),
    J(127, "lo que lo que hizo Mariano Rajoy al frente del gobierno, que la bajó a un -65%", "Rajoy", "A", "A"),
    J(128, "dado que ustedes están poniendo en cuestión eh el sistema público de pensiones", "Abascal y Feijóo", "A", "A", "declaraciones citadas antes (sistema mixto, «petado»)"),
    J(133, "que tienen 42 42 casos de corrupción abiertos", "Feijóo y Abascal", "A", "A", "cifra"),
    J(134, "lo que hace el Partido Popular es comprar esa corrupción, sino que le pregunten a Coldo García", "PP", "A", "A", "nombra personas concretas: episodio identificable"),
    J(136, "están desmantelando todas las instituciones de lucha contra la corrupción", "Feijóo y Abascal", "D", "D5", "extensión («todas»)"),
    J(139, "están imponiendo una censura franquista a la cultura", "PP y Vox", "D", "D4",
      "comparación con un régimen deslegitimado; hay ancla (Zaragoza), pero el estigma va en la etiqueta"),
    J(140, "Han anunciado su intención de recortar derechos a todo el mundo.", "PP y Vox", "D", "D5", "extensión («a todo el mundo»)"),
    J(142, "pero su intención es recortar los derechos de las mujeres", "Abascal", "A", "A", "ancla en la oración contigua (gasto superfluo en violencia de género)"),
    J(144, "También recortar los derechos de los trabajadores, de los sindicatos, de los migrantes", "Abascal", "A", "A", "programa nombrado"),
    J(146, "los programas del Partido Popular y de Vox contienen al menos 57 retrocesos en derechos humanos", "PP y Vox", "A", "A", "informe y cifra"),
    J(149, "como lo hizo también el señor Rajoy a las puertas de las elecciones del año 2011", "Rajoy", "A", "A"),
    J(150, "que se metió un tajo de 9000 millones de euros a la educación pública y la sanidad pública y estaba gobernando el señor Rajoy", "Rajoy", "A", "A"),
    J(158, "Su sede está financiada con dinero B.", "PP", "A", "A", "sentencia identificable"),
    J(159, "que su sede está financiado", "PP", "A", "A", "repetición"),
    J(161, "el programa del Partido Popular y de Vox contiene 57 medidas que vulneran", "PP y Vox", "A", "A", "informe y cifra"),
]

# ── P5 · la palabra del otro ─────────────────────────────────────────────────────────────
def V(o, frag, voz, codigo, nota=""): return dict(oracion=o, fragmento=frag, voz=voz, codigo=codigo, nota=nota)

P5 = [
    V(4, "sobre los insultos, los bulos, los reproches", "Feijóo", "B", "niega el contenido («bulos»)"),
    V(19, "los ataques personales, señora Vascal, al reality", "Abascal", "Z2", "manda lo dicho al «reality» sin responderlo"),
    V(30, "yo le he escuchado decir, hombre, tampoco es para tanto", "Feijóo", "B", "cita y responde"),
    V(35, "Mucho bulo, mucha mentira.", "Abascal", "B", "niega el contenido; responde con datos en la oración siguiente"),
    V(43, "lo que propone el señor Avascal y Vox es un recorde", "Abascal", "B", "cita la propuesta y la responde en la oración siguiente"),
    V(57, "el señor Feijóo lo que dice es esto lo externalizamos", "Feijóo", "B"),
    V(61, "esto no es un bulo", "Abascal", "B", "niega la acusación de bulo"),
    V(72, "Es que usted dice que el ingreso mínimo vital hay que cargarse", "Abascal", "B", "responde a «es un bulo»"),
    V(73, "es mentira que usted está cobrando el bon social térmico", "Abascal", "B", "responde a «no mienta»"),
    V(77, "se a otro perro con ese hueso", "Abascal", "Z1", "locución: trata lo dicho como excusa, sin responderlo"),
    V(78, "las matemáticas del señor Feijóo son como su nivel de inglés", "Feijóo", "Z2", "ridiculiza las cifras sin responderlas"),
    V(98, "Mucho bulo, mucho mucha mentira, mucho insulto", "Abascal", "B", "niega el contenido"),
    V(100, "el señor Absascal propone un sistema mixto", "Abascal", "B", "responde en la oración siguiente («no se va a privatizar»)"),
    V(100, "el Partido Popular por boca de su portavoz ha dicho que el sistema público de pensiones está petado", "PP", "B", "responde en la oración siguiente"),
    V(111, "Meter miedo a los pensionistas diciendo que que poco menos no se va a poder sostener el sistema público de pensiones", "las derechas", "Z1",
      "ataca el móvil de lo dicho (meter miedo)"),
    V(115, "Pero eso no significa nada señor Feijóo", "Feijóo", "B", "responde a «ha vuelto a ganar Juanma Moreno»"),
    V(117, "No solamente da da miedo su discurso, sino que da pena", "Abascal", "Z2", "descalifica el discurso y pasa a otra cosa sin responderlo"),
    V(143, "Tilan de gastus superfluo eh en las políticas de violencia de género", "Abascal", "B"),
    V(149, "esto es un cuento que se ha inventado el señor Feijó", "Feijóo", "B",
      "responde al contenido (cuentas auditadas); el móvil atribuido acompaña a la respuesta: B (regla del «y tú más»)"),
    V(154, "Pero con quién viajaba usted de vacaciones, señor Feijóo.", "Feijóo", "Z1",
      "«y tú más» que sustituye a la respuesta (con «¿Pero me está hablando usted?», oración contigua)"),
    V(156, "Los militantes y está avalado por el Tribunal de Cuentas.", "Feijóo", "B", "responde quién pagó las primarias"),
    V(159, "Pero que lo estoy diciendo y que está avalado por el Tribunal de Cuentas", "Feijóo", "B"),
    V(161, "reconocer el trabajo de Amnistía Internacional", "Abascal", "B", "responde a la descalificación de Amnistía"),
    V(162, "yo estoy escuchando al señor Feijóo y al señor Avascal hablar de pucherazo", "Feijóo y Abascal", "B", "responde con la pregunta de la oración 164"),
]

# ── P6 · lo que pide hacer ───────────────────────────────────────────────────────────────
def X(o, frag, blanco, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, codigo=codigo, nota=nota)

P6 = [
    X(7, "Exige el compromiso de todas las formaciones políticas, de todos los gobiernos", "todos los partidos", "C1", "apelación al compromiso de todos"),
    X(9, "construir más, dos, rehabilitar más y tres, proteger mejor a la gente", "", "N-prog"),
    X(10, "necesitamos un parlamento mucho más fuerte desde el punto de vista progresista", "", "N-mov"),
    X(11, "para sortear ese tapón a la regulación", "Feijóo, Abascal y Junts", "R", "superarlos con mayoría parlamentaria"),
    X(12, "necesitamos más formaciones progresistas, más presencia progresista en el próximo parlamento", "", "N-mov"),
    X(13, "necesitamos sortear a gobiernos autonómicos", "gobiernos del PP y Vox", "R"),
    X(33, "¿Por qué no le exige la dimisión a la señora Yuso?", "Ayuso", "R", "pide una dimisión"),
    X(46, "esta también es una pregunta que hay que responder el próximo domingo con el voto", "", "N-mov"),
    X(95, "nuestra intención no es aminorar el ritmo, es continuar aumentándolo", "", "N-prog"),
    X(101, "no se va a privatizar", "", "N-prog"),
    X(109, "quiero dejarlo en el año 2030", "", "N-prog"),
    X(114, "Mientras gobierne el Partido Socialista, el sistema público de pensiones está garantizado", "", "N-prog"),
    X(115, "tendrá que asumir la responsabilidad", "Juanma Moreno / PP", "R", "responsabilidad política por la crisis de cribados"),
    X(126, "un poco de respeto, ¿no?", "Feijóo", "C3", "freno a la hostilidad"),
    X(126, "lo que tenemos que hacer es invertir mucho más en el sistema ferroviario", "", "N-prog"),
    X(128, "ofrezco un gran pacto también para que lo blindemos entre todos", "PP y Vox incluidos", "C1"),
    X(129, "Destinar el 7% del producto interior bruto a la sanidad pública", "", "N-prog"),
    X(141, "usted puede condenar de manera rotunda la violencia de género", "Abascal", "R", "le pide una condena"),
    X(148, "esto es algo que tenemos que evitar en las próximas elecciones", "PP y Vox", "R", "en las urnas"),
    X(164, "¿usted va a reconocer el resultado electoral el próximo 29 de noviembre?", "Feijóo", "R", "le pide aceptar el resultado"),
    X(168, "le estoy preguntando, ¿a reconocer electoral, ¿sí o no?", "Feijóo", "R", "repetición"),
]

if __name__ == "__main__":
    guardar(ID, P1, ANADIDAS, P1_EV, P2, P3, P5, P6)
