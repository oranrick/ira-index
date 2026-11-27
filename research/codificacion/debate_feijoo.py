"""Codificación de Alberto Núñez Feijóo · debate a cuatro RTVE, 26-nov-2026.
Manuales: P1 v1.2 (cambios acordados en ESTADO.md), P2 v1.0, P3 v0.1, P5 v0.1, P6 v0.1.
Criterios propios del debate: ver codificacion/CRITERIOS.md.
"""
from comun import guardar

ID = "debate-rtve-2026-feijoo"

Y = ("Y", "")
R2 = ("2R", "segunda persona dirigida a un rival del debate: no es interpelación al público, no puntúa")
X = ("X", "error de extracción")
S = ("S", "los presentes en el debate")
def U(n=""): return ("U", n)
def G(n=""): return ("G", n)
def GC(n): return ("GC", n)

P1 = {
    1: Y, 2: Y, 3: ("X", "«nuestra prioridad» dentro de un titular de Sánchez que cita: no es nosotros del hablante"), 4: Y, 5: S, 6: R2,
    7: Y, 8: Y, 9: Y, 10: Y, 11: Y, 12: R2, 13: GC("«nos intentaron vender los decretos»: el Gobierno contra nosotros"),
    14: R2, 15: Y, 16: R2, 17: ("F", "ellas (terceras personas)"), 18: R2, 19: U("nuestra historia"), 20: R2, 21: Y, 22: Y, 23: Y,
    24: R2, 25: Y, 26: Y, 27: Y, 28: Y, 29: R2, 30: R2, 31: Y, 32: Y, 33: Y, 34: Y, 35: R2, 36: R2, 37: R2, 38: Y,
    39: ("X", "«ocupas» es sustantivo"), 40: Y, 41: U("o defendemos a inquilinos y propietarios"),
    42: ("X", "«Mire» es imperativo de usted, no primera persona"), 43: R2, 44: R2, 45: Y, 46: Y, 47: R2,
    48: GC("«la nuestra no», frente al gobierno progresista"), 49: GC("sigue la contraposición de la oración anterior"),
    50: GC("haremos lo contrario de lo que hizo Colau en Barcelona"), 51: Y, 52: Y, 53: R2, 54: Y, 55: Y,
    56: GC("hemos perdido 8 años, tras «mucha hipocresía» del Gobierno (oración anterior)"),
    57: GC("o nosotros o el gobierno progresista"), 58: GC("ídem"), 59: GC("ídem"), 60: Y, 61: R2, 62: Y, 63: Y, 64: Y, 65: Y, 66: Y,
    67: U("nuestro país"), 68: R2, 69: R2, 70: S, 71: R2, 72: R2, 73: R2, 74: R2, 75: R2, 76: U("llevamos 18 meses con inflación"),
    77: Y, 78: R2, 79: R2, 80: R2, 81: R2, 82: U("vamos camino de dos Españas"), 83: ("F", "ellos (los que no llegan)"), 84: Y, 85: S,
    86: Y, 87: Y, 88: R2, 89: Y, 90: R2, 91: R2, 92: Y, 93: Y, 94: S, 95: R2, 96: Y, 97: Y, 98: R2, 99: G("nuestros compromisos (el partido)"),
    100: Y, 101: GC("las vamos a subir, «ya sé que les molesta»"), 102: R2, 103: R2, 104: Y, 105: Y, 106: Y, 107: Y, 108: R2,
    109: Y, 110: Y, 111: Y, 112: R2, 113: G("programa"), 114: G("programa"), 115: R2, 116: Y, 117: R2, 118: R2, 119: Y, 120: Y,
    121: Y, 122: Y, 123: R2, 124: R2, 125: R2, 126: Y, 127: R2, 128: R2, 129: R2, 130: R2, 131: R2, 132: R2, 133: Y,
    134: ("X", "dentro de la frase del sumario que cita"), 135: ("X", "ídem"), 136: GC("ironía: el gobierno progresista que ha gobernado nuestro país"),
    137: Y, 138: Y, 139: Y, 140: R2, 141: R2, 142: Y, 143: Y, 144: Y, 145: Y, 146: GC("lo que hemos visto de Colau y Sánchez"), 147: GC("ídem"),
    148: Y, 149: Y, 150: G("programa"), 151: G("programa"), 152: ("F", "ellos"), 153: Y, 154: Y, 155: Y, 156: R2,
    157: G("lo que tenemos que hacer en educación"), 158: R2, 159: Y, 160: Y, 161: Y, 162: Y, 163: Y, 164: Y, 165: R2,
    166: Y, 167: Y, 168: Y, 169: Y, 170: Y, 171: Y, 172: Y, 173: ("X", "«sepa» es tercera persona"), 174: Y, 175: Y, 176: Y, 177: Y, 178: Y,
    179: R2, 180: R2, 181: Y, 182: Y, 183: Y, 184: Y, 185: R2, 186: Y, 187: R2, 188: R2, 189: R2, 190: Y, 191: Y, 192: R2,
    193: ("A", "«les dimos»: transcripción dudosa"), 194: R2, 195: R2, 196: R2, 197: Y, 198: Y, 199: S, 200: R2, 201: Y, 202: R2,
    203: Y, 204: Y, 205: Y, 206: Y, 207: Y, 208: GC("ironía: nos tenemos que creer que usted es un ingenuo"), 209: GC("ídem"),
    210: R2, 211: R2, 212: R2, 213: R2, 214: R2, 215: ("2R", "imperativo de usted dirigido a Sánchez (el extractor lo marcó como 1.ª)"),
    216: R2, 217: ("2R", "imperativo de usted dirigido a Sánchez"), 218: R2, 219: R2, 220: Y, 221: R2, 222: R2, 223: Y, 224: Y, 225: Y,
    226: R2, 227: Y, 228: ("S", "o usted o yo vamos a presidir: los dos candidatos"), 229: R2, 230: Y, 231: Y, 232: Y, 233: Y, 234: Y,
    235: Y, 236: Y, 237: R2, 238: R2, 239: Y, 240: Y, 241: Y, 242: Y, 243: Y,
}

def AUD(o, forma, cat, ctx, nota):
    return {"oracion": str(o), "forma": forma, "lema": forma.lower(), "tipo": "verbo" if forma != "Les" else "pronombre",
            "persona": "2", "numero": "pl", "contexto": ctx, "categoria": cat,
            "nota": "omisión del extractor (el «ustedes» al público concuerda en 3.ª persona), añadida a mano; " + nota}

_C73 = "Mire, cojan la factura de la luz, el ticket de el ticket del súper, el ticket de la gasolinera y y comprobarán la la compra ha subido un 43%, señor Colau, la política progresista."
ANADIDAS = [
    AUD(73, "cojan", "2C", _C73, "al público, para atacar «la política progresista»"),
    AUD(73, "comprobarán", "2C", _C73, "ídem"),
    AUD(242, "Les", "2C", "Les aseguro que España se merece un gobierno decente y yo pongo mis 30 años de gestión a disposición de la decencia en la política.",
        "al público; «un gobierno decente» deja como indecente al actual (bloque de corrupción)"),
]

def C(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="C", marca=marca, blanco=blanco, nota=nota)

P1_EV = [
    C(28, "el PP lo que propone son 1 millón de viviendas y ustedes están hablando de 1 millón de excusas", "C1 contraposición", "Gobierno"),
    C(52, "Pues la nuestra no.", "C1 contraposición", "gobierno progresista"),
    C(54, "haciendo exactamente lo contrario de lo que ha hecho usted en Barcelona", "C1 contraposición", "Colau"),
    C(61, "O hacemos un millón de viviendas y le bajamos los impuestos a los jóvenes o si no seguiremos con el gobierno progresisto durante 8 años más", "C1 contraposición", "gobierno progresista",
      "«o nosotros o ellos» con forma de elección (P6 manda este caso a P1)"),
    C(115, "A mí me gustan las cuentas, a ustedes les gustan los cuentas.", "C1 contraposición", "Sánchez y su Gobierno"),
    C(150, "ya se han puesto de acuerdo", "C2 bloque homogéneo", "Colau y Sánchez", "funde a dos rivales en un solo bloque"),
    C(170, "nadie puede ser presidente del gobierno si no garantiza que un español se suba a un tren tranquilo", "C4 expulsión de la comunidad", "Sánchez",
      "niega la legitimidad para gobernar, por el contexto de los accidentes de tren; no es conducta violenta"),
    C(212, "Yo sería incapaz de venir aquí si estoy en su situación procesal.", "C4 expulsión de la comunidad", "Sánchez",
      "le niega la legitimidad para estar en el debate (como «cómo se atreve a venir aquí» de Abascal); la situación procesal no es conducta violenta"),
]

def M(o, frag, dom, blanco, tipo_b, humano, res, nota="", reglas="", tipo="convencional", exc="no"):
    return dict(oracion=o, fragmento=frag, dominio=dom, tipo=tipo, blanco=blanco, tipo_blanco=tipo_b, humano=humano,
                reglas=reglas, une="no", excepcion=exc, resultado=res, nota=nota)

P2 = [
    M(14, "nos intentaron vender los decretos", "COM", "el Gobierno", "personas", "sí", "N",
      "imagen-acusación con ancla: los decretos Maricarmen, identificables", "ancla"),
    M(68, "voy a recortar todo tipo de indecencia y de corrupción", "MAQ", "la corrupción", "problema", "no", "N"),
    M(91, "vamos camino de dos Españas", "VIA", "el país", "meta", "no", "N"),
    M(150, "esta interpretación", "OTR", "Colau y Sánchez", "personas", "sí", "N",
      "el debate como teatro; imagen-acusación con ancla: sus intervenciones en el debate", "ancla"),
    M(155, "Vamos a mantener blindado la conservación y mantenimiento red de alta velocidad", "INM", "el mantenimiento ferroviario", "política", "no", "N"),
    M(173, "España necesita ponerse a funcionar", "MAQ", "el país", "meta", "no", "N"),
    M(176, "España necesita ponerse a funcionar", "MAQ", "el país", "meta", "no", "N"),
    M(181, "las colacas que usted dirigía", "OTR", "Sánchez", "personas", "sí", "N",
      "«cloacas»; imagen-acusación con ancla: la jueza que investigaba a su hermano", "ancla"),
    M(214, "que tiene un imán para la corrupción", "MAQ", "Sánchez", "personas", "sí", "P",
      "imagen-acusación sin ancla: atracción de corruptos «siempre», sin acto identificable", "sin ancla", "viva"),
    M(226, "le subo la puesta", "DEP", "Sánchez", "personas", "sí", "N", "apuesta: agonista, conserva las reglas", "agonista"),
]

def J(o, frag, blanco, signo, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, signo=signo, codigo=codigo, nota=nota)

P3 = [
    J(6, "Creo que los españoles no se van a dejar engañar otra vez.", "Sánchez", "A", "A", "engaño atado a los dos titulares citados"),
    J(10, "del pudor con el que usted utilizó el fallecimiento de Maric Carmen", "Sánchez", "A", "A"),
    J(11, "durante todos los días de su mandato, la media de desaucios fueron 90 diarios", "Sánchez", "A", "A", "gestión y cifra"),
    J(12, "convocar elecciones con esa excusa es una falta de ética", "Sánchez", "A", "A", "juicio atado a un acto"),
    J(13, "usted ha convocado elecciones para parar los sumarios judiciales que le están investigando", "Sánchez", "A", "A", "acto identificable; el móvil acompaña al acto"),
    J(15, "a con ellas les pagaban la hipoteca y les y les pusieron un piso, es decir, con las mordidas del dinero público", "entorno de Sánchez (caso Ábalos)", "A", "A", "nombra personas concretas"),
    J(17, "corrupción de todo tipo.", "Gobierno", "D", "D5", "extensión («de todo tipo»)"),
    J(18, "Con ustedes, para tener una casa hay que heredarla, ocuparla o salir en los sumarios.", "Gobierno", "D", "D5", "generalización irónica de corrupción"),
    J(25, "sabe lo que dijo una ministra de su gobierno hace unos días", "ministra del Gobierno", "A", "A", "declaración identificable (las «cuatro bofetadas»)"),
    J(26, "además me ha llamado en ergúmeno", "Sánchez", "A", "A"),
    J(32, "otra vez ha vuelto a engañar a los españoles", "Sánchez", "A", "A", "ancla: página 244 del programa de 2023"),
    J(43, "Ustedes no protegen al inquilino.", "Gobierno", "A", "A", "ámbito: política de vivienda"),
    J(44, "Ustedes consideran que el inquilino es un sospechoso.", "Gobierno", "A", "A", "ámbito: política de vivienda"),
    J(45, "En Barcelona, en Barcelona aplicaron en su receta menos pisos.", "Colau", "A", "A", "gestión nombrada"),
    J(49, "Esa es su propuesta de vivienda, señor Colau.", "Colau", "D", "D5", "le atribuye defender la ocupación sin acto identificable"),
    J(50, "Esa es su propuesta, señor Sánchez.", "Sánchez", "D", "D5", "ídem"),
    J(51, "Este es el gobierno progresista que lo ocupe la vivienda de forma ilegal a una persona.", "gobierno progresista", "D", "D5", "ídem"),
    J(58, "¿De verdad que le van a seguir tomando el pelo a la gent?", "Colau y Sánchez", "D", "D5", "acusación de engaño sin acto (como «que no os engañen»)"),
    J(59, "muchas promesas, mucha hipocresía y pocas casas", "Gobierno", "A", "A", "etiqueta con ancla en la gestión de vivienda («pocas casas»)"),
    J(65, "Es una pena que usted le criticase tanto cuando era gobernador del Banco de España", "Sánchez", "A", "A"),
    J(71, "Zapatero negaba la crisis", "Zapatero", "A", "A"),
    J(84, "Porque los impuestos ustedes no han subido.", "Gobierno", "A", "A", "ironía clara; cifra de presión fiscal en la oración siguiente"),
    J(87, "ustedes lo que se está cargando es a la clase media", "Gobierno", "A", "A", "ámbito: política fiscal"),
    J(88, "Desde que ustedes gobiernan, el 3% de la gente cuando llegaron al gobierno se consigaba de clase baja o pobre", "Gobierno", "A", "A", "gestión y cifra"),
    J(100, "pero realmente es usted un tertuliano, señor Sánchez", "Sánchez", "D", "D1", "rasgo sin ancla"),
    J(103, "ustedes cada vez que un español intenta lo machacan", "Gobierno", "D", "D5", "extensión («cada vez que»)"),
    J(104, "Lo machacan impuestos.", "Gobierno", "A", "A", "ámbito: impuestos"),
    J(109, "menudo saqueo hecho con los autónomos en el último Consejo de Ministros", "Gobierno", "A", "A", "decisión con fecha"),
    J(113, "usted ha sido el único presidente del gobierno de la democracia que no ha sido capaz de presentar el presupuesto", "Sánchez", "A", "A", "capacidad atada a una gestión"),
    J(122, "116 muertos en menos de un año y ni palabra.", "Colau", "A", "A"),
    J(124, "¿por qué ustedes hallan un sistema de seguridad que tuvo 170 fallos en los dos últimos años?", "Gobierno", "A", "A"),
    J(125, "¿Qué hizo usted después de la tragedia de Adam para evitarla de Toledo?", "Sánchez", "A", "A"),
    J(126, "¿por qué no hizo caso usted a las incidencias que los maquinistas apuntaban en los partes?", "Sánchez", "A", "A"),
    J(127, "usted o Moncloa filtró los audios del maquinista muerto", "Sánchez", "A", "A"),
    J(128, "¿debería usted respetar a las víctimas?", "Sánchez", "A", "A", "atado a la filtración de la oración anterior"),
    J(130, "que se pone a bailar para celebrar este este disparate", "Colau", "A", "A", "acto identificable"),
    J(131, "este es el gobierno más machista de la democracia", "Gobierno", "D", "D2", "sanción sin ancla en la oración ni en la contigua"),
    J(132, "Mujeres como mercancía.", "Gobierno", "A", "A", "ancla en el sumario que lee a continuación"),
    J(153, "Ni una respuesta, ni una disculpas y a bailar.", "Gobierno", "A", "A"),
    J(156, "al frente habrá ingenieros que sepan, eh, no twitteros", "responsables actuales de transportes", "D", "D1", "rasgo sin ancla"),
    J(157, "Ellos se burlan y bailan.", "Gobierno", "D", "D5", "acusación generalizada de burla"),
    J(160, "son los peores hospitales gestionados de España, los que gestiona la ministra de sanidad", "ministra de Sanidad", "A", "A", "gestión nombrada"),
    J(171, "no salir huyendo de Pipporta", "Sánchez", "A", "A", "acto identificable"),
    J(181, "como le mandó desde las colacas que usted dirigía a la jueza que investigaba su hermano", "Sánchez", "A", "A"),
    J(190, "del saqueo que ha producido al presupuesto de los españoles", "Sánchez", "A", "A", "gestión nombrada: el presupuesto"),
    J(194, "usted le ha asesorado en los debates Coldo Ávalos, Cerdán y ahora Zapatero", "Sánchez", "A", "A", "nombra personas concretas"),
    J(196, "un 1% que cobró el señor Zapatero", "Zapatero", "A", "A"),
    J(197, "¿por qué se rescató Plus Ultra y no rescató usted a los autónomos?", "Sánchez", "A", "A"),
    J(207, "Le importa un pimiento pedir al señor Zapatero que devuelva la comisión", "Sánchez", "A", "A", "atado a su falta de respuesta"),
    J(210, "ustedes se apoyan entre sí o se están encubriendo", "Sánchez y Colau", "D", "D5", "acusación de encubrimiento sin acto"),
    J(213, "nos tenemos que creer que usted es un ingenuo", "Sánchez", "D", "D5", "ironía clara: complicidad sin acto"),
    J(214, "Los corruptos se iban siempre con usted", "Sánchez", "D", "D5", "extensión («siempre»)"),
    J(216, "¿Qué vieron en usted los corruptos?", "Sánchez", "D", "D5", "insinuación sin acto"),
    J(217, "¿Qué vieron en usted los corruptos?", "Sánchez", "D", "D5", "repetición"),
    J(218, "cuando uno atrae a tantos corruptos", "Sánchez", "D", "D5", "insinuación sin acto"),
    J(219, "sigue sin responder quién le pagó las primarias", "Sánchez", "A", "A"),
    J(225, "entienda que no quiere hablar usted de corrupción", "Sánchez", "A", "A", "atado a su cambio de tema"),
]

def V(o, frag, voz, codigo, nota=""): return dict(oracion=o, fragmento=frag, voz=voz, codigo=codigo, nota=nota)

P5 = [
    V(4, "La vivienda va a ser nuestra prioridad a la próxima legislatura.", "Sánchez", "B", "cita sus titulares y los responde con el balance de vivienda"),
    V(24, "a mí me dice y a mí me dice que tiene que venir el gobierno progresista", "Colau", "B"),
    V(28, "ustedes están hablando de 1 millón de excusas", "Gobierno", "Z2", "llama «excusas» a lo dicho sin responderlo"),
    V(29, "Pero usted quiere presentarse a candidato a la presidencia de la Comunidad Autónoma de Madrid.", "Sánchez", "Z2", "responde con una burla a la pregunta sobre Ayuso"),
    V(55, "El problema de la vivienda en Galicia era el problema número 16", "Colau", "B"),
    V(56, "Nueve de cada 10 casas en España son de pequeños propietarios.", "Colau", "B", "responde a los fondos buitre y a la ocupación"),
    V(63, "Yo también.", "Sánchez", "V2", "se suma a la felicitación de Sánchez a Hernández de Cos"),
    V(65, "la señora Colau ha dicho que Yolanda Díaz es una excelente vicepresidenta y por qué le han sustituido", "Colau", "B"),
    V(69, "la gente debe estar indignada escuchándoles hablar", "Sánchez y Colau", "Z2", "descalifica lo dicho sin responderlo (con la 70)"),
    V(71, "Sánchez niega que España esté por encima en el incremento de precios", "Sánchez", "B"),
    V(77, "Dice usted que la pizza de Luna Rosa, perdóneme, es cojonuda.", "Sánchez", "B", "responde con la subida del precio"),
    V(87, "ahora han hablado ustedes de los malvados ricos", "Gobierno", "B", "parafrasea con burla, pero responde al contenido"),
    V(92, "Pero si esto se aprueba por real decreto, no se aprueba por ley.", "Colau", "B"),
    V(93, "Claro que estoy a favor de subir el salario medio", "Colau", "B"),
    V(96, "que ustedes manejen a los sindicatos no significa que yo maneja a la patronal", "Colau", "B", "«y tú más» que acompaña a una respuesta"),
    V(112, "Debe ser su tesis doctoral, señor Sánchez.", "Sánchez", "Z2", "ridiculiza que presuma de economía sin responder"),
    V(116, "el señor Sánchez dice que sabe mucho de economía y no ha sido capaz de presentar un solo presupuesto", "Sánchez", "B"),
    V(121, "Los servicios públicos que usted critica son sus servicios públicos", "Colau", "B", "responde; «topicazos» acompaña a la respuesta"),
    V(148, "Mayoría absoluta en la Comunidad de Madrid se lo reencía.", "Colau", "B"),
    V(149, "yo creo que un poco mejor que la de Cataluña", "Colau", "B", "sobre la sanidad de Madrid"),
    V(149, "Allí hubo dimisiones, en el gobierno de España, ni una", "Colau", "B", "sobre los cribados de Andalucía"),
    V(149, "otra vez con la chuleta", "Sánchez", "Z2", "se burla de que lea sus notas y no responde al balance de Galicia"),
    V(150, "han ensayado muy bien estas intervenciones previamente", "Colau y Sánchez", "Z1", "descalifica sus críticas por cómo se habrían preparado"),
    V(163, "el señor Sánchez y la señora Colau vienen a presumir de educación", "Sánchez y Colau", "B", "responde con el informe PISA"),
    V(166, "ustedes lo que intentan es meter miedo", "Sánchez y Colau", "Z1", "ataca el móvil de lo dicho"),
    V(169, "No me van a dar lecciones de defensa de los servicios públicos porque llevo 30 años gestionando servicios públicos.", "Sánchez y Colau", "B"),
    V(174, "no manipule, no manipule", "Sánchez", "B", "con la 175 («no tengo nada que ver»): responde al contenido"),
    V(183, "Cuidado que viene el PP, cuidado que viene Feijó.", "Gobierno", "B", "cita su lema de campaña y lo responde"),
    V(201, "habla usted de que usted ha gobernado 8 años en Barcelona y no la han encontrado nada", "Colau", "B", "responde con su propia trayectoria"),
    V(204, "¿Qué tendrá que ver la corrupción con la muerte?", "Abascal", "B", "rebate que «la corrupción mata»"),
    V(223, "no se ponga usted aquí a bailar o a escribir una carta de amor", "Sánchez", "Z2", "se burla de la respuesta sin rebatirla"),
    V(231, "prueba de que lo reconozco que le estoy diciendo que o usted o yo vamos a presidir el gobierno", "Sánchez", "B", "responde si reconocerá el resultado"),
]

def A6(o, frag, blanco, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, codigo=codigo, nota=nota)

P6 = [
    A6(20, "Modificación de la ley del suelo, modificación de la ley de propiedad horizontal", "", "N-prog"),
    A6(21, "Combatir el miedo de los propietarios", "", "N-prog"),
    A6(33, "O defendemos a los inquilinos y a los propietarios a la vez o no hay nada que hacer.", "", "N-prog", "disyuntiva sobre una política, sin blanco humano"),
    A6(68, "voy a recortar, asesores, altos cargos", "", "N-prog"),
    A6(101, "el Partido Popular lo que propone es que sea vitalicio", "", "N-prog"),
    A6(110, "las vamos a subir de acuerdo con el IPC anualmente", "", "N-prog"),
    A6(114, "Yo presentaré un presupuesto en primavera", "", "N-prog"),
    A6(143, "¿Usted le ha pedido explicación a la ministra de Igualdad?", "ministra de Igualdad", "R", "pedir explicaciones (directiva indirecta)"),
    A6(145, "usted le ha pedido explicación de por qué la Fiscalía Europea está investigando", "ministra de Igualdad", "R"),
    A6(154, "Vamos a hacer una auditoría palmo a palmo del corredor Andalucía", "", "N-prog"),
    A6(159, "agresores a la cárcel", "agresores", "R", "grupo definido por su conducta, por vía penal"),
    A6(164, "lo que hay que hacer es más autoridad para el profesor", "", "N-prog"),
    A6(171, "y usted calladita", "Colau", "X3", "le pide que calle"),
    A6(178, "yo voy a nombrar a gente que sepa", "", "N-prog"),
    A6(187, "voy a ir contra los corruptos y se le acaba el chollo a los corruptos", "corruptos", "R", "grupo definido por su conducta"),
    A6(190, "voy a hacer una auditoría de arriba abajo de lo que usted ha gastado", "Sánchez", "R"),
    A6(200, "¿Le va a pedir usted al señor Zapatero que devuelva la comisión que cobró de Plus Ultra?", "Zapatero", "R"),
    A6(207, "pedir al señor Zapatero que devuelva la comisión por el rescate de Plusultra", "Zapatero", "R", "repetición"),
    A6(220, "dígaselo a la Cámara", "Sánchez", "R"),
    A6(221, "Dígaselo.", "Sánchez", "R", "repetición"),
    A6(222, "Pero dígaselo.", "Sánchez", "R", "repetición"),
    A6(224, "Explique sus primarias, explique la trama y deje de tapar la corrupción", "Sánchez", "R"),
    A6(228, "Asume usted la responsabilidad uno, de dimitir después de las elecciones", "Sánchez", "R", "dimitir si pierde"),
    A6(229, "Renuncia usted yo.", "Sánchez", "R", "repetición"),
    A6(231, "usted va a dimitir y va a dejar el aforamiento, ¿sí o no?", "Sánchez", "R", "repetición"),
    A6(234, "el gobierno responderá de la corrupción de los que nombre", "", "N-prog"),
    A6(236, "Yo no voy a indultar a ningún político condenado por corrupción.", "", "N-prog"),
    A6(237, "Los corruptos van a devolver lo robado", "corruptos", "R", "grupo definido por su conducta"),
    A6(237, "quien quiera gobernar España tendrá que explicar quién le financian las primarias en su partido", "Sánchez", "R"),
    A6(238, "Los jueces van a elegir otra vez a los jueces.", "", "N-prog"),
    A6(240, "En el Tribunal Constitucional no habrá ningún ministro ni ningún alto cargo del gobierno", "", "N-prog"),
    A6(241, "¿usted cree que Zapatero debe devolver la comisión de Plus Ultra o no?", "Zapatero", "R", "repetición"),
    A6(242, "yo pongo mis 30 años de gestión a disposición de la decencia en la política", "", "N-mov"),
]

if __name__ == "__main__":
    guardar(ID, P1, ANADIDAS, P1_EV, P2, P3, P5, P6)
