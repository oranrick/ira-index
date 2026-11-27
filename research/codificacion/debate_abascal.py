"""Codificación de Santiago Abascal · debate a cuatro RTVE, 26-nov-2026.
Manuales: P1 v1.2 (cambios acordados en ESTADO.md), P2 v1.0, P3 v0.1, P5 v0.1, P6 v0.1.
Criterios propios del debate: ver codificacion/CRITERIOS.md.
"""
from comun import guardar

ID = "debate-rtve-2026-abascal"

# ── P1 · referencias: {n: (categoría, nota)} ─────────────────────────────────────────────
Y = ("Y", "")
R2 = ("2R", "segunda persona dirigida a un rival del debate: no es interpelación al público, no puntúa")
S = ("S", "los presentes en el debate")
def U(n=""): return ("U", n)
def G(n=""): return ("G", n)
def GC(n): return ("GC", n)
CITA = ("X", "voz que el hablante pone en boca de «los españoles de clases medias» (cita figurada): no es nosotros del hablante")

P1 = {
    1: Y, 2: Y, 3: Y, 4: Y, 5: ("F", "ellos (Colau y Sánchez)"), 6: Y, 7: Y, 8: Y,
    9: GC("«todos sabemos» cómo trataba a las mujeres la «banda» del Peugeot de Sánchez"),
    10: R2, 11: Y, 12: Y, 13: S,
    14: U("«el resultado es el que tenemos»: el país; el «pensaban» de la oración anterior no tiene sujeto explícito"),
    15: Y, 16: Y, 17: Y, 18: Y, 19: S, 20: S, 21: R2, 22: Y,
    23: ("2R", "imperativo de usted dirigido a un rival (el extractor lo marcó como 1.ª)"), 24: R2,
    25: GC("«si nos ha traído aquí o si pretende seguir callándonos»: Vox frente a Sánchez"),
    26: S, 27: S, 28: Y, 29: S, 30: S, 31: S, 32: Y, 33: Y, 34: Y,
    35: S, 36: GC("nos va a verificar la gente, frente a Sánchez (que lo llama bulo)"), 37: Y, 38: Y,
    39: GC("somos nosotros los que decimos la verdad, frente a Sánchez"), 40: GC("ídem"), 41: GC("ídem"),
    42: Y, 43: Y, 44: Y, 45: Y, 46: Y, 47: Y, 48: CITA, 49: CITA, 50: CITA,
    51: U("«queremos a los nuestros de vuelta»: los españoles emigrados"), 52: U("los nuestros: los españoles emigrados"),
    53: GC("«nos prometen un futuro verde»: las políticas que aprueban PSOE y PP"),
    54: GC("hemos votado contra la mafia que representa Sánchez"), 55: GC("ídem"),
    56: G("los gobiernos autonómicos de los que forma parte Vox"), 57: G("ídem"), 58: G("ídem"),
    59: Y, 60: Y, 61: Y, 62: Y, 63: G("programa del partido"), 64: G("programa del partido"),
    65: Y, 66: S, 67: S, 68: ("S", "«vamos a dejarlo en un 50 %»: oferta a los rivales del debate (P6 la recoge)"),
    69: R2, 70: R2, 71: Y, 72: Y, 73: Y, 74: Y, 75: R2, 76: ("2R", "imperativo dirigido a Sánchez"),
    77: G("votaciones del partido"), 78: G("votaciones del partido"), 79: G("propuesta del partido"),
    80: Y, 81: Y, 82: Y, 83: Y, 84: R2, 85: Y, 86: Y, 87: S, 88: S, 89: Y, 90: Y, 91: Y,
    92: U("estamos ante el mayor avance tecnológico"), 93: U("no podemos quedarnos atrás (el país)"), 94: U("el país"),
    95: U("«las políticas de los últimos años»: sin agente nombrado (regla 1)"), 96: U("ídem"),
    97: U("el país"), 98: Y, 99: Y, 100: U("vamos muy tarde «por las políticas que se han estado aplicando»: sin agente"),
    101: U("el país"), 102: U("nuestro país"), 103: Y, 104: Y,
    105: GC("las redes que nos protegían, destruidas por el Gobierno de Sánchez (oraciones 93-95)"),
    106: GC("ídem"), 107: GC("ídem"), 108: GC("ídem"),
    109: GC("lo que tenemos enfrente: lo que dejó el Gobierno (oración anterior)"), 110: GC("ídem"),
    111: Y, 112: S, 113: R2, 114: S, 115: U("hemos tenido un apagón (el país)"),
    116: GC("los que nos protegen a todos, desprotegidos por «este gobierno» (misma oración)"),
    117: R2, 118: ("X", "voz que atribuye al Gobierno («me da igual que sean turistas»)"),
    119: G("Vox en el gobierno de Extremadura"), 120: G("ídem"), 121: Y, 122: Y, 123: R2, 124: Y, 125: Y, 126: Y,
    127: Y, 128: Y, 129: Y, 130: Y, 131: Y, 132: R2, 133: R2, 134: Y,
    135: GC("«los nuestros, el propio pueblo», frente a «los demás» y a Sánchez"), 136: Y, 137: Y, 138: Y, 139: Y, 140: Y,
    141: S, 142: GC("«ya sabemos para qué»: insinuación contra Sánchez por el uso de Correos"), 143: Y, 144: Y,
}


def AUD(o, forma, cat, ctx, nota):
    return {"oracion": str(o), "forma": forma, "lema": forma.lower(), "tipo": "verbo", "persona": "2", "numero": "pl",
            "contexto": ctx, "categoria": cat,
            "nota": "omisión del extractor (el «ustedes» al público concuerda en 3.ª persona), añadida a mano; " + nota}


def ENC(o, forma, lema, cat, ctx, nota):
    return {"oracion": str(o), "forma": forma, "lema": lema, "tipo": "pronombre", "persona": "1", "numero": "pl",
            "contexto": ctx, "categoria": cat, "nota": "omisión del extractor (clítico pospuesto), añadida a mano; " + nota}


ANADIDAS = [
    ENC(23, "callándonos", "nosotros", "GC", "Si nos ha traído aquí o si pretende seguir callándonos en España, se está equivocando.",
        "Vox frente a Sánchez"),
    ENC(54, "poniéndonos", "nosotros", "GC",
        "poniéndonos en manos de China y criminalizando los motores de combustión",
        "las políticas que aprueban PSOE y PP (misma oración)"),
    ENC(84, "quedarnos", "nosotros", "U", "Estamos ante el mayor avance tecnológico de la historia de la humanidad, probablemente, y no podemos quedarnos atrás.", "el país"),
    ENC(85, "quedarnos", "nosotros", "U", "Y para no quedarnos atrás necesitamos agua, energía, minerales y tierras raras.", "el país"),
    ENC(88, "subirnos", "nosotros", "U", "Tenemos que subirnos al carro del futuro.", "el país"),
    ENC(127, "escucharnos", "nosotros", "S", "Los españoles seguro que quieren escucharnos sobre cómo hay que restaurar los servicios públicos que se han destruido.",
        "los candidatos del debate"),
    AUD(58, "Pueden", "2I", "Pueden estar tranquilos.", "al público, sin atacar a nadie en la oración"),
    AUD(60, "sepan", "2I", "Y quiero que sepan que yo no voy a participar en ningún gobierno que no haga eso.", "al público"),
    AUD(61, "Pueden", "2I", "Pueden estar seguros, pero les voy a hacer también aquí una propuesta a todos.",
        "al público; el «les» de la misma oración va a los rivales (2R, no se añade)"),
]

# ── P1 · eventos de frontera ─────────────────────────────────────────────────────────────
def C(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="C", marca=marca, blanco=blanco, nota=nota)
def CP(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="CP", marca=marca, blanco=blanco, nota=nota)

P1_EV = [
    C(23, "si pretende seguir callándonos en España, se está equivocando", "C5 amenaza dirigida al nosotros", "Sánchez"),
    C(37, "somos nosotros los que estamos diciendo la verdad", "C1 contraposición", "Sánchez", "frente a «bulos, bulos y bulos» de Sánchez"),
    C(47, "Desde que tú gobiernas a nosotros nos va peor", "C1 contraposición", "Sánchez",
      "voz que el hablante pone en boca de los españoles de clases medias y hace suya"),
    C(47, "Pero todos los españoles de clases medias, autónomos, trabajadores", "C1 contraposición", "los señores del IBEX",
      "«los poderosos» que «han ganado más con Pedro Sánchez» (oración anterior) frente a los españoles"),
    C(55, "Hemos votado efectivamente contra la mafia que representa el señor Sánchez", "C1 contraposición", "Sánchez"),
    C(56, "Hemos votado contra la mafia", "C1 contraposición", "Sánchez", "repetición en otra oración"),
    C(68, "para la casta política, para los sindicatos, patronales y ONGs a las que ustedes les dan órdenes, pero que no representan a los españoles",
      "C2 bloque homogéneo", "casta política, sindicatos, patronales y ONG", "un solo bloque mandado por los rivales y fuera de «los españoles»"),
    C(106, "hay 850.000 españoles esperando una operación y que solo en Madrid el año pasado se atendieron a 150.000 ilegales",
      "C1 contraposición", "inmigrantes en situación irregular"),
    C(122, "ustedes han regalado lo que es de los españoles a todo el mundo", "C1 contraposición", "«todo el mundo»: quienes no son españoles"),
    C(124, "me da igual que sean turistas o que sean ilegales, es un insulto", "C1 contraposición", "turistas e inmigrantes en situación irregular",
      "frente a «lo que es de los españoles» (oración anterior)"),
    C(146, "No sé ni cómo se atreve a estar todavía ahí de pie y en este debate.", "C4 expulsión de la comunidad", "Sánchez",
      "le niega la legitimidad para estar en el debate; el acto está en la oración anterior, no en esta: no hay excepción"),
    C(161, "regalar a los demás lo que se roba y se niega a los nuestros, al propio pueblo", "C1 contraposición",
      "«los demás»: los receptores extranjeros de la cooperación"),
    C(165, "Yo creo que el Sr. Sánchez no debería estar de pie en este debate", "C4 expulsión de la comunidad", "Sánchez",
      "por reírse de las víctimas de la dana: conducta concreta, pero no violenta ni antidemocrática"),
    CP(166, "No tendría que estar aquí después de haber asaltado Radio Televisión Española", "C4 expulsión de la comunidad", "Sánchez",
       "excepción democrática: conducta concreta contra un medio público (RTVE), agente acotado, sin extensión"),
    C(180, "No sé cómo se atreve a venir aquí y actuar de esa manera", "C4 expulsión de la comunidad", "Sánchez"),
]

# ── P2 · eventos metafóricos ─────────────────────────────────────────────────────────────
def M(o, frag, dom, blanco, tipo_b, humano, res, nota="", reglas="", tipo="convencional", exc="no"):
    return dict(oracion=o, fragmento=frag, dominio=dom, tipo=tipo, blanco=blanco, tipo_blanco=tipo_b, humano=humano,
                reglas=reglas, une="no", excepcion=exc, resultado=res, nota=nota)

P2 = [
    M(2, "se ha dedicado a importar violadores", "COM", "Sánchez", "personas", "sí", "P",
      "personas como mercancía; imagen-acusación sin ancla (no hay acto ni fecha; «se ha dedicado a»)", "sin ancla", "viva"),
    M(15, "El gran buitre que hay en España está justo a mi izquierda.", "ANI", "Sánchez", "personas", "sí", "P",
      "ANI contra una persona: polariza siempre (responde a los «fondos buitre» de Colau)", "ANI", "viva"),
    M(21, "para que le haga el juego sucio", "DEP", "Colau", "personas", "sí", "N",
      "imagen-acusación con ancla: la intervención de Colau en el debate (8:45)", "ancla"),
    M(33, "una especie de juegos del hambre", "OTR", "el mercado del alquiler", "problema", "no", "N", "ficción distópica"),
    M(41, "zancadillas a la construcción", "DEP", "la regulación", "política", "no", "N"),
    M(50, "algunos se han convertido en los recaderos de la patronal más egoísta", "OTR", "«algunos» (rivales sin nombrar)", "personas", "sí", "P",
      "imagen-acusación sin ancla: el agente es «algunos», sin acotar", "sin ancla", "viva"),
    M(54, "nos prometen un futuro verde, pero que es un futuro negro", "OTR", "el futuro económico", "meta", "no", "N", "color"),
    M(56, "la mafia que ha secuestrado las instituciones", "OTR", "el Gobierno", "personas", "sí", "P",
      "secuestro; imagen-acusación sin ancla (ninguna institución ni acto nombrado)", "sin ancla", "viva"),
    M(56, "que ha destruido las instituciones públicas", "CON", "el Gobierno", "personas", "sí", "P",
      "imagen-acusación sin ancla", "sin ancla"),
    M(87, "ir destruyendo poco a poco nuestra capacidad de producción de energía", "CON", "las políticas energéticas", "política", "no", "N",
      "sin agente humano nombrado"),
    M(88, "Tenemos que subirnos al carro del futuro.", "VIA", "el país", "meta", "no", "N"),
    M(95, "destruir todo lo que funcionaba", "CON", "Sánchez", "personas", "sí", "P",
      "imagen-acusación con extensión («todo»)", "extensión"),
    M(96, "Todas las redes que nos protegían, que protegían nuestra prosperidad, nuestra salud y nuestra seguridad, han sido destruidas", "CON",
      "el Gobierno (oraciones 93-95)", "personas", "sí", "P", "imagen-acusación con extensión («todas»)", "extensión"),
    M(99, "la destrucción de las redes que protegían a los españoles por parte de este gobierno", "CON", "el Gobierno", "personas", "sí", "N",
      "imagen-acusación con ancla: las redes se nombran en las oraciones contiguas (ferroviaria, 100)", "ancla"),
    M(100, "que era la joya de la corona para los españoles", "OTR", "la red ferroviaria", "política", "no", "N"),
    M(101, "Ahora la joya de la corona está en la sede", "OTR", "el PSOE de Sánchez", "personas", "sí", "P",
      "insinúa que el dinero está en Ferraz; imagen-acusación sin ancla", "sin ancla", "viva"),
    M(102, "son las joyas de José Luis Rodríguez Joyero, su mentor", "OTR", "Zapatero", "personas", "sí", "P",
      "apodo que sigue la imagen de las joyas; imagen-acusación sin ancla", "sin ancla", "viva"),
    M(105, "La red educativa también ha sido destruida", "CON", "el Gobierno", "personas", "sí", "N",
      "imagen-acusación con ancla: los peores datos en las comparativas internacionales (misma oración)", "ancla"),
    M(119, "los defensores de lo público que han destruido todo lo público", "CON", "Sánchez y Colau", "personas", "sí", "P",
      "imagen-acusación con extensión («todo»)", "extensión"),
    M(127, "los servicios públicos que se han destruido", "CON", "los servicios públicos", "política", "no", "N", "sin agente"),
    M(145, "por orden de una cloaca de Ferraz", "OTR", "el PSOE", "personas", "sí", "N",
      "«cloaca»; imagen-acusación con ancla: la jueza que investiga al hermano del presidente (como Feijóo, 181)", "ancla"),
    M(166, "después de haber asaltado Radio Televisión Española", "GUE", "Sánchez", "personas", "sí", "N",
      "imagen-acusación con ancla: RTVE, el día de la dana", "ancla"),
    M(169, "Señor Sánchez asaltó en el año 2019 las instituciones", "GUE", "Sánchez", "personas", "sí", "N",
      "imagen-acusación con ancla: 2019 y los pactos nombrados", "ancla"),
    M(175, "decidió asaltar el resto de las instituciones", "GUE", "Sánchez", "personas", "sí", "N",
      "imagen-acusación con ancla: las instituciones se nombran en la oración siguiente", "ancla"),
    M(178, "hay que barrer todo este asalto a las instituciones en España", "INM", "los nombrados en las instituciones", "personas", "sí", "P",
      "imagen-acción INM; el blanco humano sale del contexto (los cargos de las instituciones que enumera): INM contra personas polariza siempre",
      "INM", "viva"),
    M(179, "lo que ha intentado es asaltar el censo electoral con la ley de nietos", "GUE", "el Gobierno", "personas", "sí", "N",
      "imagen-acusación con ancla: la ley de nietos y la sentencia del Supremo", "ancla"),
]

# ── P3 · juicios sobre el otro ───────────────────────────────────────────────────────────
def J(o, frag, blanco, signo, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, signo=signo, codigo=codigo, nota=nota)

P3 = [
    J(2, "de un espacio político como el de la señora Colau, que se encargó de escarcelar a violadores en España", "el espacio político de Colau", "A", "A",
      "acto identificable (las excarcelaciones por la ley del «solo sí es sí»)"),
    J(2, "que ha multiplicado las agresiones sexuales a las mujeres por tres", "Sánchez", "D", "D6",
      "resultado negativo nombrado + blanco humano + culpa total; «importar violadores» va a P2"),
    J(2, "se rodeó en un peuyot de una banda de guarros que todos sabemos perfectamente cómo trataban a las mujeres", "los del Peugeot (Ábalos, Koldo, Cerdán)", "A", "A",
      "insulto con su ancla: episodio identificable (el Peugeot, su trato a las mujeres)"),
    J(12, "La vivienda se ha encarecido con el señor Sánchez un 74%", "Sánchez", "A", "A", "cifra"),
    J(13, "los precios de la vivienda, señores, se deciden en los puertos, en los aeropuertos y en las fronteras", "inmigrantes", "D", "D6",
      "chivo expiatorio: el precio de la vivienda atribuido entero a quienes llegan; el blanco humano sale de la oración anterior (el 52 % de los inquilinos son extranjeros)"),
    J(16, "es el presidente del gobierno que ha impulsado la inmigración masiva, que ha disparado los precios de la vivienda y que ha facilitado todos a los especuladores", "Sánchez", "D", "D5",
      "extensión («facilitado todo»)"),
    J(28, "Las regulaciones de la izquierda han hecho desaparecer la mitad de la oferta.", "la izquierda", "A", "A", "cifra; las regulaciones se nombran en la oración siguiente"),
    J(36, "Vidas completamente paradas por culpa de sus políticas.", "el Gobierno", "A", "A", "ámbito: las políticas de vivienda nombradas en la oración 29"),
    J(44, "este gobierno se ha convertido en un enemigo de los trabajadores", "el Gobierno", "A", "A",
      "«enemigo» en su sentido literal (contrario a); ámbito nombrado: la economía y los datos macroeconómicos"),
    J(50, "la patronal más egoísta", "la patronal", "D", "D1", "rasgo sin ancla"),
    J(55, "la mafia que representa el señor Sánchez", "Sánchez", "D", "D2", "sanción criminal sin acto que la ancle"),
    J(56, "contra la mafia que ha entregado el poder en España al separatismo y que ha abierto las fronteras de España", "Sánchez", "D", "D2",
      "«mafia»: los actos que siguen son políticas (pactos, fronteras), no anclan una sanción criminal (como la «censura franquista» de Sánchez)"),
    J(68, "porque en realidad no quieren eliminar ningún tipo de gasto que representa un estado de bienestar para la casta política", "los rivales del debate", "D", "D5",
      "imputa un móvil sin acto («en realidad no quieren»), con extensión («ningún tipo»)"),
    J(71, "no mienta", "Sánchez", "A", "A", "atado a un dicho identificable (lo que dijo del ingreso mínimo vital)"),
    J(97, "La red ferroviaria, gastándoselo en mordidas, en fulanas", "el Gobierno", "A", "A", "ámbito: la red ferroviaria (gestión nombrada)"),
    J(108, "que pagan esa sanidad y que ustedes han convertido en universal", "el Gobierno", "A", "A", "decisión identificable (sanidad universal)"),
    J(116, "A nadie le ha ocurrido a este señor porque andaba con las energías intermitentes", "Sánchez", "A", "A", "ámbito: el apagón"),
    J(117, "desprotegiendo a los que nos protegen a todos, negándoles la profesión de riesgo, negándoles la equiparación salarial", "el Gobierno", "A", "A",
      "decisiones identificables"),
    J(118, "Si hay españoles traicionados por este gobierno, esos han sido precisamente las mujeres.", "el Gobierno", "D", "D2",
      "«traicionados»: la oración contigua nombra medidas sobre policías, no un acto sobre las mujeres"),
    J(121, "Lo que pasa es que hay menos casas para los españoles, menos médicos y menos sanitarios, menos policías y guardias civiles y menos profesores.", "inmigrantes", "D", "D6",
      "caso resuelto del manual («desde que llegaron no hay trabajo»): el blanco son las 6.270.000 personas de la oración anterior"),
    J(122, "Porque ustedes han regalado lo que es de los españoles", "el Gobierno", "A", "A", "ámbito: el acceso a los servicios públicos"),
    J(123, "pero seguro que son muy tacaños con lo que es suyo", "el Gobierno", "D", "D1", "rasgo sin ancla"),
    J(126, "están financiando el capricho de Sánchez para promover la inmigración masiva en España", "Sánchez", "A", "A",
      "el móvil («capricho») acompaña a una gestión nombrada (la política migratoria), como Feijóo, 13"),
    J(131, "porque se lo gastan en cosas absolutamente indecentes", "el Gobierno", "D", "D5", "acusación sin acto («cosas»)"),
    J(134, "hay que sacar a los políticos y a los amigotes puteros", "cargos de ADIF y Renfe", "A", "A",
      "insulto con su ancla en la misma oración (ADIF y Renfe, el caso Koldo)"),
    J(134, "lo que ha hecho es subir la vivienda un 74%", "Sánchez", "A", "A", "cifra (la cita que responde va a P5)"),
    J(135, "Qué vergüenza.", "Sánchez", "A", "A", "etiqueta con ancla en la oración contigua (la vivienda, un 74 %)"),
    J(136, "de los pasajeros del Peuyot, que fueron los grandes amigotes de Pedro Sánchez y que hoy están todos en la cárcel o en el banquillo",
      "los del Peugeot y Sánchez", "A", "A", "episodio identificable; «todos» se refiere a un grupo cerrado"),
    J(137, "el señor Sánchez llegó como abanderado de la lucha contra la corrupción en una moción de censura presentada por José Luis Ávalos", "Sánchez", "A", "A",
      "ironía clara, atada a un acto (la moción de censura)"),
    J(138, "no han sido solo las mordidas, señor Sánchez, o las corruptelas", "Sánchez", "A", "A", "casos identificables (oración 136)"),
    J(139, "la corrupción de Sánchez ha matado españoles en las vías del tren, en el apagón, en la Dana", "Sánchez", "D", "D6",
      "chivo expiatorio: muertes de tres catástrofes atribuidas a su corrupción (culpa desmedida)"),
    J(142, "el señor Sánchez bailando antes y después", "Sánchez", "A", "A", "acto identificable (el baile)"),
    J(145, "La corrupción ha matado y ha intentado matar más, por ejemplo, a una juez a la que quisieron eliminar", "Sánchez y el PSOE", "D", "D6",
      "repite la culpa desmedida de la 139; el episodio de la jueza va con la misma marca"),
    J(151, "tiene usted algún juicio en Mozambique, están pagando algo", "Sánchez", "D", "D5", "insinuación sin acto (ironía clara)"),
    J(159, "nueve veces la ley Ela ante la que se resistieron y no quisieron financiar", "el Gobierno", "A", "A", "ley nombrada"),
    J(161, "Esto es una corrupción de la peor especie, señor Sánchez, porque no hay un acto más reprochable que regalar a los demás lo que se roba", "Sánchez", "D", "D2",
      "llama corrupción y robo a partidas de cooperación legales: la sanción no tiene un acto que la ancle"),
    J(165, "después de haberse reído hoy mismo de una forma absolutamente intolerable de las víctimas de la Dana", "Sánchez", "A", "A", "acto con fecha (hoy)"),
    J(168, "este señor ha degenerado la democracia en España", "Sánchez", "A", "A", "ancla en la oración siguiente (2019, pactos, amnistía)"),
    J(169, "mintiendo a los españoles y a sus propios votantes sobre sus pactos", "Sánchez", "A", "A", "declaraciones identificables"),
    J(172, "Ha mentido a los españoles de la manera más brutal.", "Sánchez", "A", "A", "ancla en la oración contigua (la amnistía)"),
    J(174, "un político que miente en todo", "Sánchez", "D", "D5", "extensión («en todo»)"),
    J(176, "Paradores para sus cosas, ADIF y Renfe, ya hemos hablado bastante y no hace falta decir para qué", "Sánchez", "D", "D5", "insinuación sin acto"),
    J(177, "Correos, ya sabemos también para qué.", "Sánchez", "D", "D5", "insinuación sin acto"),
    J(178, "el Tribunal de Cuentas para multar a Vox con multas que después anulaba el Tribunal Supremo", "el Gobierno", "A", "A", "decisiones identificables"),
    J(178, "en este caso con la ayuda del PP", "PP", "A", "A", "renovación del CGPJ y del Constitucional (identificable)"),
    J(179, "todas sus pretensiones de alterar el resultado de estas elecciones", "el Gobierno", "A", "A", "ancla: la ley de nietos y la sentencia del Supremo"),
    J(181, "No le da vergüenza.", "Sánchez", "A", "A", "ancla en las oraciones contiguas"),
]

# ── P5 · la palabra del otro ─────────────────────────────────────────────────────────────
def V(o, frag, voz, codigo, nota=""): return dict(oracion=o, fragmento=frag, voz=voz, codigo=codigo, nota=nota)

P5 = [
    V(1, "yo no voy a hablar de lo que la señora Colabo y el señor Sánchez quieren cuando ellos lo ordenen", "Colau y Sánchez", "Z3",
      "se niega a discutir lo que plantean (la violencia machista) y lo llama «orden»"),
    V(2, "Yo no voy a admitir ningún tipo de orden", "Colau y Sánchez", "Z1", "descalifica la crítica por quién la hace («de aquellos que...»)"),
    V(3, "tápense un poquito cuando hacen estas apelaciones", "Colau y Sánchez", "Z1",
      "«y tú más» que sustituye a la respuesta («el principal machismo... es el que ustedes han importado»)"),
    V(17, "He contestado, se queda satisfecha", "Colau", "Z2", "da por respondida, con burla, la aclaración de Colau sobre los fondos buitre"),
    V(20, "usted solo no es capaz de enfrentarse a mí, de discutir", "Sánchez", "Z1", "responde a la queja por los «ataques personales» atacando a quien la hace"),
    V(22, "hágaselo ofendido si quieres", "Colau", "Z2", "se burla de la protesta de Colau"),
    V(24, "estamos en estos momentos siguiendo su rollo", "Colau y Sánchez", "Z2", "«su rollo»"),
    V(37, "Bulos, bulos y bulos va a ser la palabra que el presidente del gobierno dice en este debate", "Sánchez", "B",
      "burla que acompaña a una negación del contenido («somos nosotros los que estamos diciendo la verdad»)"),
    V(43, "espero que el presidente del gobierno sepa defenderse de una manera distinta a decir bulo todo el rato", "Sánchez", "Z2",
      "ridiculiza la respuesta de Sánchez sin rebatirla"),
    V(55, "Hemos votado efectivamente", "Sánchez", "B", "admite las votaciones que le reprochan y las justifica"),
    V(56, "Hemos votado contra la mafia", "Sánchez", "B", "responde a «han votado contra la gente»"),
    V(57, "Pero es que no distingue ni siquiera el gasto político, el gasto superfluo", "Sánchez", "B", "responde a la acusación de recortes"),
    V(69, "Es un bulo.", "Sánchez", "B", "niega el contenido"),
    V(71, "Yo no he dicho que el ingreso mínimo vital hay que cargárselo", "Sánchez", "B"),
    V(72, "Eso es un bulo suyo.", "Sánchez", "B"),
    V(74, "Bulo el que acaba de esparcer usted aquí en estos momentos.", "Sánchez", "B", "responde a lo del bono social"),
    V(76, "nosotros no hemos votado nunca en contra de las familias numerosas", "Sánchez", "B"),
    V(79, "el señor Sánchez piensa que mi familia es la única que no debe cobrar la ayuda de familia numerosa", "Sánchez", "B",
      "reformula lo dicho y lo responde"),
    V(81, "no de tanta basurilla", "Sánchez", "Z2", "«basurilla»"),
    V(134, "usted dijo que esta iba a ser la legislatura de la vivienda, ahora dice que va a encargarse de las pensiones", "Sánchez", "B",
      "cita y responde con la subida de la vivienda"),
    V(147, "como a tantas organizaciones no gubernamentales mantenidas con dinero público de los españoles, de los europeos o de Soros", "Sánchez (informe de Amnistía)", "Z1",
      "descalifica la fuente por quién la paga («lo dicen porque les pagan»)"),
    V(148, "siempre cojean del mismo lado", "Amnistía Internacional y las ONG", "Z1", "descalifica la fuente por su sesgo"),
    V(164, "Le voy a contestar muy claramente.", "Colau", "Z1",
      "a la pregunta sobre Mazón responde atacando a Sánchez (oraciones 165-167): «y tú más» que sustituye a la respuesta"),
]

# ── P6 · lo que pide hacer ───────────────────────────────────────────────────────────────
def A6(o, frag, blanco, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, codigo=codigo, nota=nota)

P6 = [
    A6(40, "control de fronteras y remigración", "inmigrantes", "X1", "«remigración»: caso resuelto del manual (la medida se extiende a todos)"),
    A6(41, "bloques de vivienda de protección oficial con prioridad nacional para los españoles", "residentes extranjeros", "X1",
       "medida sobre un grupo definido por su origen (P6, 4.2); ver CRITERIOS.md"),
    A6(41, "menos burocracia, menos normativa", "", "N-prog"),
    A6(41, "impuestos cero para los jóvenes en la adquisición de la primera vivienda", "", "N-prog"),
    A6(41, "impuestos disuasorios para las fortunas extranjeras", "compradores extranjeros con grandes patrimonios", "R",
       "medida fiscal, por ley: no los excluye de ningún derecho (como «subir los impuestos a los ricos» de Colau)"),
    A6(44, "lo primero que tiene que hacer el próximo gobierno es no convertirse en un enemigo de los trabajadores", "", "N-prog"),
    A6(60, "yo no voy a participar en ningún gobierno que no haga eso", "", "N-prog"),
    A6(62, "nosotros queremos eliminar el 100% de las subvenciones a los partidos políticos, a las patronales, a los sindicatos y a las ONGs ideológicas",
       "partidos, patronales, sindicatos y ONG", "R", "medida presupuestaria contra organizaciones: no es ninguna de las cinco excluyentes"),
    A6(64, "Comprométanse.", "los rivales del debate", "C1", "pide a los rivales que se comprometan con la rebaja"),
    A6(65, "Vamos a dejarlo en un 50%.", "los rivales del debate", "C2", "propuesta mediadora (la mitad de lo que pide)"),
    A6(70, "Cambia de registro un poco.", "Sánchez", "C3", "freno al tono (como «un poco de respeto» de Sánchez)"),
    A6(73, "el ingreso mínimo vital, señor Sánchez, debe ser solo para los españoles", "residentes extranjeros", "X1", "medida sobre un grupo definido por su origen"),
    A6(78, "Queremos que sean más y que además extiendan al resto de las familias.", "", "N-prog"),
    A6(81, "lo que usted no puede hacer es discriminizar a nadie por sus ideas", "Sánchez", "R"),
    A6(98, "eso es lo que tenemos que arreglar en la siguiente legislatura", "", "N-prog"),
    A6(127, "cómo hay que restaurar los servicios públicos", "", "N-prog"),
    A6(128, "El dinero de los españoles tiene que ir para lo esencial.", "", "N-prog"),
    A6(131, "Hacen falta más inversiones en infraestructuras", "", "N-prog"),
    A6(132, "Hace falta defender la prioridad nacional en las ayudas sociales y la exclusividad nacional en el ingreso mínimo vital y por supuesto la asistencia sanitaria integral solo para españoles y para trabajadores legales",
       "residentes extranjeros", "X1", "medida sobre un grupo definido por su origen"),
    A6(133, "urgencias vitales para cualquier ser humano", "", "N-prog"),
    A6(134, "hay que sacar a los políticos y a los amigotes puteros donde tenían que estar los técnicos", "cargos de ADIF y Renfe", "R",
       "relevar cargos de empresas públicas: no los saca de la vida pública"),
    A6(134, "asegurar las pensiones", "", "N-prog"),
    A6(162, "puedo prometer a los españoles que esto con Vox se va a acabar", "", "N-prog", "la cooperación al desarrollo: una partida, no un grupo"),
    A6(167, "Así que por favor hágale preguntas a él.", "Sánchez", "R", "pide que se exijan respuestas a Sánchez"),
    A6(174, "asumir consecuencias", "Sánchez", "R", "responsabilidad política"),
]

if __name__ == "__main__":
    guardar(ID, P1, ANADIDAS, P1_EV, P2, P3, P5, P6)
