"""Codificación de Ada Colau · debate a cuatro RTVE, 26-nov-2026.
Manuales: P1 v1.2 (cambios acordados en ESTADO.md), P2 v1.0, P3 v0.1, P5 v0.1, P6 v0.1.
Criterios propios del debate: ver codificacion/CRITERIOS.md.
"""
from comun import guardar

ID = "debate-rtve-2026-colau"

# ── P1 · referencias: {n: (categoría, nota)} ─────────────────────────────────────────────
Y = ("Y", "")
R2 = ("2R", "segunda persona dirigida a un rival del debate: no es interpelación al público, no puntúa")
S = ("S", "los presentes en el debate")
def U(n=""): return ("U", n)
def G(n=""): return ("G", n)
def GC(n): return ("GC", n)

P1 = {
    1: Y, 2: Y, 3: Y, 4: Y, 5: Y, 6: GC("las mujeres, frente a «un partido que no condena la violencia machista» (Vox)"),
    7: Y, 8: Y, 9: Y, 10: Y, 11: Y, 12: Y, 13: Y, 14: Y, 15: Y, 16: Y,
    17: GC("la burbuja que vivimos, «estafa» del gobierno del PP y la banca (misma oración)"),
    18: Y, 19: Y, 20: Y, 21: Y, 22: Y, 23: Y,
    24: GC("«eso nos ha llevado donde estamos»: lo que hicieron el PSOE y la derecha (oración anterior)"), 25: GC("ídem"),
    26: U("que acabemos con la especulación: un problema, no personas"), 27: Y, 28: Y,
    29: G("reeditemos un gobierno progresista (con el PSOE); los fondos buitre son objeto de una medida, no el otro del nosotros"),
    30: R2, 31: Y, 32: Y, 33: Y, 34: U("necesitamos más (en vivienda)"), 35: Y, 36: G("si hay un gobierno progresista, bajemos los alquileres"),
    37: R2, 38: R2, 39: GC("ironía: «nos quedamos con la curiosidad» de cómo lo haría Feijóo"), 40: GC("ídem"),
    41: GC("ironía: «no nos puede dar una pista», a Feijóo"), 42: Y, 43: Y, 44: Y, 45: R2, 46: Y, 47: Y,
    48: G("si podemos contar con un gobierno progresista: se dirige a Sánchez como socio; el «usted» de la misma oración es otro turno (Feijóo)"),
    49: Y, 50: Y, 51: Y, 52: Y, 53: Y, 54: GC("de la derecha no esperamos nada"), 55: R2, 56: Y, 57: Y, 58: Y,
    59: G("su gobierno municipal en Barcelona"), 60: G("ídem"), 61: G("ídem"), 62: G("ídem"),
    63: R2, 64: R2, 65: R2, 66: R2, 67: R2, 68: Y,
    69: GC("«no lo vamos a permitir»: el recorte que propone Vox (oración anterior)"), 70: G("vamos a impulsar un gobierno progresista"),
    71: G("vamos a reivindicar lo hecho"), 72: Y, 73: U("hoy tenemos 3 millones de empleados más (el país)"),
    74: G("orgullo de lo hecho por sus ministerios"), 75: Y, 76: G("ídem"), 77: Y, 78: S, 79: G("posición del partido"), 80: G("ídem"),
    81: GC("la medida que planteamos, frente a «los señores de la derecha y de la extrema derecha»"), 82: GC("ídem"), 83: GC("ídem"),
    84: G("«el dinero que sacamos a los ricos»: los ricos son objeto de una medida fiscal, no el otro del nosotros (como las subvenciones de Abascal)"),
    85: Y, 86: GC("ironía: «le hemos convencido», a Feijóo"), 87: R2,
    88: G("«con algunos podríamos estar de acuerdo»: acercamiento a las propuestas de Feijóo"), 89: G("su programa"), 90: G("su programa"),
    91: G("aclara su propuesta"), 92: R2, 93: Y, 94: Y, 95: S, 96: Y, 97: Y, 98: Y,
    99: G("vimos que asumías nuestra propuesta: tono positivo hacia Sánchez"), 100: R2, 101: R2, 102: G("ídem"), 103: G("ídem"),
    104: ("2R", "«llevabais»: vosotros (el PSOE); el extractor lo marcó como 1.ª"), 105: G("nos parece muy bien"),
    106: GC("«nosotros decimos que no», frente al plan del PSOE (oración anterior)"), 107: GC("ídem"), 108: Y,
    109: U("tenemos una gran oportunidad en España"), 110: G("posición del partido"), 111: S,
    112: G("las mujeres, frente a la violencia machista (un problema)"), 113: S,
    114: G("excepción democrática: «nos están matando» se dice de los agresores, por su conducta violenta; a Abascal se le pide una condena (P6)"),
    115: ("X", "«eh» es una interjección"), 116: Y, 117: Y, 118: G("nuestra propuesta"), 119: R2,
    120: G("«necesitamos que de las campañas pasemos al BOE»: el futuro gobierno progresista, Sánchez incluido"), 121: G("ídem"),
    122: Y, 123: G("Frente Amplio"), 124: G("ídem"), 125: G("ídem"), 126: R2,
    127: S, 128: R2, 129: R2, 130: R2, 131: R2, 132: Y,
    133: GC("«nuestros niños y niñas», frente a Ayuso (misma oración)"), 134: R2, 135: S,
    136: GC("ironía: «se lo decimos a las mujeres» de los cribados, frente a la gestión del PP en Andalucía"), 137: R2, 138: Y, 139: Y,
    140: G("lo que dijimos tras los accidentes"), 141: U("los trenes que necesitamos en este país"), 142: Y, 143: Y, 144: R2, 145: R2, 146: R2,
    147: S, 148: S, 149: Y, 150: Y, 151: Y, 152: Y,
    153: GC("corrupción cero en mi partido, frente a lo que dijo Sánchez (oración anterior)"),
    154: GC("«no hemos gobernado décadas como en el caso de sus partidos»"), 155: GC("ídem"), 156: Y, 157: Y,
    158: Y, 159: Y, 160: Y, 161: Y, 162: Y, 163: Y, 164: Y, 165: Y,
    166: G("«no todos somos iguales»: el perdedor (los corruptos) no está en la oración ni en la anterior (regla 1)"), 167: Y,
    168: G("programa"), 169: G("programa"), 170: G("nuestra propuesta"), 171: Y, 172: Y, 173: R2, 174: Y, 175: Y,
    176: GC("«que nos contara algo sobre su corrupción», a Feijóo"), 177: R2, 178: Y, 179: Y, 180: Y, 181: Y, 182: R2, 183: S,
    184: Y, 185: Y, 186: Y, 187: Y, 188: Y, 189: Y, 190: Y, 191: Y, 192: Y, 193: Y, 194: Y, 195: Y,
    196: G("nuestras fuerzas políticas"), 197: G("ídem"), 198: Y, 199: Y, 200: Y, 201: Y, 202: G("programa"), 203: Y,
}


def ENC(o, forma, lema, cat, ctx, nota):
    return {"oracion": str(o), "forma": forma, "lema": lema, "tipo": "verbo" if lema != "nosotros" else "pronombre", "persona": "1", "numero": "pl",
            "contexto": ctx, "categoria": cat, "nota": "omisión del extractor, añadida a mano; " + nota}


ANADIDAS = [
    ENC(31, "quedarnos", "nosotros", "G",
        "si hay un gobierno progresista bajemos los alquileres de gobierno progresista un congreso de no quedarnos con lo que hay más allá",
        "clítico pospuesto; el futuro gobierno progresista"),
    ENC(96, "batallamos", "batallar", "G", "nosotros las medidas que proponemos luego las batallamos y conseguimos que no se queden en palabras",
        "Frente Amplio"),
    {"oracion": "135", "forma": "Les", "lema": "les", "tipo": "pronombre", "persona": "2", "numero": "pl",
     "contexto": "Les aseguro que me lo han mirado todo, me han buscado cualquier cosa, me han puesto 20 querellas falsas los distintos lobis económicos, fondos buitra, etcétera.",
     "categoria": "2C",
     "nota": "omisión del extractor (el «ustedes» al público concuerda en 3.ª persona), añadida a mano; al público, para atacar a los lobis de las «querellas falsas»"},
]

# ── P1 · eventos de frontera ─────────────────────────────────────────────────────────────
def C(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="C", marca=marca, blanco=blanco, nota=nota)
def A(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="A", marca=marca, blanco=blanco, nota=nota)
def CP(o, texto, marca, blanco, nota=""): return dict(oracion=o, texto=texto, tipo="CP", marca=marca, blanco=blanco, nota=nota)

P1_EV = [
    C(3, "un partido que no condena la violencia machista y que por tanto nos pone en peligro a las mujeres", "C5 amenaza dirigida al nosotros", "Vox",
      "no condenar la violencia no es conducta violenta: no hay excepción"),
    C(39, "de la derecha no esperamos nada", "C3 irreversibilidad", "la derecha"),
    C(65, "es algo que no comparten los señores de la derecha y de la extrema derecha", "C1 contraposición", "la derecha y la extrema derecha"),
    C(85, "Nosotros decimos que no, que hay que ir a recaudar más 10,000 millones.", "C1 contraposición", "PSOE",
      "frente al plan del PSOE (oración anterior); contraposición de programa, como «la nuestra no» de Feijóo"),
    CP(90, "porque nos están matando a las mujeres de este país por violencia machista", "C5 amenaza dirigida al nosotros", "agresores machistas",
       "excepción democrática: conducta violenta, el agente son los agresores, sin extensión"),
    C(134, "no hemos gobernado décadas como en el caso de sus partidos", "C1 contraposición", "PSOE y PP"),
    A(168, "desde luego su esposa tiene toda mi solidaridad", "A5 humanizar a alguien del otro lado", "Begoña Gómez (esposa de Sánchez)",
      "solidaridad con una persona del entorno de un rival, sin evaluarla"),
    A(169, "tiene toda mi solidaridad en eso", "A5 humanizar a alguien del otro lado", "Begoña Gómez", "repetición en otra oración"),
]

# ── P2 · eventos metafóricos ─────────────────────────────────────────────────────────────
def M(o, frag, dom, blanco, tipo_b, humano, res, nota="", reglas="", tipo="convencional", exc="no"):
    return dict(oracion=o, fragmento=frag, dominio=dom, tipo=tipo, blanco=blanco, tipo_blanco=tipo_b, humano=humano,
                reglas=reglas, une="no", excepcion=exc, resultado=res, nota=nota)

P2 = [
    M(10, "regalar las viviendas y el suelo a los especuladores", "COM", "la derecha", "personas", "sí", "P",
      "«regalar» lo que se vende: imagen-acusación con extensión («siempre es la misma»)", "extensión"),
    M(51, "ha hundido la economía", "OTR", "Milei", "personas (terceros)", "sí", "N",
      "imagen-acusación con ancla: la recesión técnica anunciada hoy", "ancla"),
    M(52, "desmantelar los servicios públicos y las pensiones de este país", "MAQ", "el recorte propuesto", "política", "no", "N"),
    M(75, "hay un agujero en su argumentación", "OTR", "el argumento de Feijóo", "idea", "no", "N"),
    M(96, "luego las batallamos", "GUE", "las medidas propias", "política", "no", "N"),
    M(102, "que la [risas] señora está regalando a sus amiguetes de la sanidad privada", "COM", "Ayuso", "personas", "sí", "N",
      "«regalar» lo que se contrata; imagen-acusación con ancla: la privatización de la sanidad de Madrid (gestión nombrada)", "ancla"),
    M(120, "que acaban de hundir la economía y las pensiones", "OTR", "Milei", "personas (terceros)", "sí", "N",
      "imagen-acusación con ancla: la recesión argentina (oración 51)", "ancla"),
    M(174, "que dinamita la democracia", "GUE", "la cultura bipartidista de PP y PSOE", "personas", "sí", "N",
      "imagen-acusación con ancla: las puertas giratorias (exministros en consejos de administración)", "ancla"),
]

# ── P3 · juicios sobre el otro ───────────────────────────────────────────────────────────
def J(o, frag, blanco, signo, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, signo=signo, codigo=codigo, nota=nota)

P3 = [
    J(3, "le agradezco que haya condenado la violencia machista", "Feijóo", "R", "R1", "juicio positivo sobre un acto del rival"),
    J(3, "un partido que no condena la violencia machista", "Vox", "A", "A", "posición pública identificable"),
    J(7, "he visto muchos gobiernos del Partido Popular y [carraspeo] del Partido Socialista", "gobiernos del PP y del PSOE", "A", "A",
      "ámbito: la vivienda («el problema no se ha resuelto», oración siguiente)"),
    J(9, "de la derecha, la verdad es que ya no espero nada porque ya sé cuál es su receta y ya sé que ha fracasado", "la derecha", "A", "A",
      "ámbito: la política de vivienda"),
    J(11, "una auténtica estafa que se perpetró entre el gobierno del Partido Popular y la banca de este país", "gobierno del PP y la banca", "A", "A",
      "etiqueta con su ancla (la burbuja de 2007)"),
    J(16, "el Partido Socialista demasiadas veces ha coincidido con la derecha en que estaba bien mercantilizar la vivienda", "PSOE", "A", "A",
      "ámbito: vivienda; declaración citada de Ábalos"),
    J(22, "fondos buitre y de grandes propietarios que están subiendo los alquileres y están desauciando a miles de personas", "fondos buitre", "A", "A", "cifra"),
    J(25, "que se insulte de la manera que lo hace usted, señoros", "Abascal", "A", "A", "«señoros» con su ancla: el insulto de la oración anterior del debate (8:38)"),
    J(35, "ya que es buen gestor, seguramente tiene idea", "Feijóo", "A", "A", "ironía clara; ancla en la oración siguiente (16 viviendas)"),
    J(36, "en sus últimos 4 años de mandato en Galicia hizo solo 16 viviendas protegidas", "Feijóo", "A", "A", "cifra"),
    J(48, "ustedes no proponen políticas de vivienda que ofrezcan soluciones a la gente para que no tenga que ocupar", "PP y Vox", "A", "A", "ámbito: vivienda"),
    J(49, "ustedes han votado contra los decretos, Maric Carmen", "PP y Vox", "A", "A", "votaciones"),
    J(50, "su portavoz Figaredo ha anunciado hoy un recorte del gasto público de 112,000 millones", "Vox", "A", "A", "anuncio con fecha y cifra"),
    J(50, "los recortes que hizo Rajoy con las consecuencias nefastas que tuvieron los servicios públicos", "Rajoy", "A", "A"),
    J(70, "¿por qué han votado siempre hasta cuatro veces en contra de la subida del salario mínimo interprofesional", "PP", "A", "A",
      "votaciones contadas («hasta cuatro veces»): el «siempre» queda acotado"),
    J(72, "se ha posicionado siempre a favor de la patronal y en contra de las subidas del salario mínimo", "Feijóo", "D", "D5", "extensión («siempre»)"),
    J(75, "chiringuitos como el de Esperanza Guerra que le pagaba usted más de 80", "Abascal", "A", "A", "pago identificable (persona nombrada)"),
    J(77, "A estos ustedes no les quieren subir los impuestos.", "PP", "A", "A", "posición identificable"),
    J(78, "en Madrid han bajado los impuestos a las grandes fortunas", "PP", "A", "A", "decisión identificable"),
    J(102, "sus amiguetes de la sanidad privada", "Ayuso", "A", "A", "etiqueta con ancla: la privatización de la sanidad de Madrid"),
    J(104, "¿Qué le parece que la señora Garrapatas Garrapatas les llama a los maestras y maestras de la pública?", "Ayuso", "A", "A",
      "declaración identificable: cita la palabra de Ayuso (transcripción dudosa del nombre)"),
    J(106, "que es una vergüenza que después de comprarse un ático con dinero público de más de 6 millones de euros, después de insultar a Marie Carmen", "Ayuso", "A", "A",
      "actos identificables"),
    J(109, "¿Qué le parece los cribados?", "gobierno andaluz del PP", "A", "A", "pregunta retórica clara; la crisis de cribados"),
    J(117, "el Partido Popular que usted preside aún mantiene Amazón con cargo público aforado", "Feijóo", "A", "A", "decisión identificable (Mazón)"),
    J(120, "evidentemente no van a garantizar las pensiones, sino que las van a privatizar y las van a poner en peligro", "Feijóo y Abascal", "D", "D5",
      "acusación sobre el futuro sin acto que la ancle"),
    J(122, "El líder de un partido que ha sido condenado por corrupción, que ha sido condenado como organización criminal", "PP", "A", "A", "sentencias"),
    J(123, "Un partido que pagó su sede con dinero negro, un partido que durante años ha estado repartiendo sobres", "PP", "A", "A", "casos identificables"),
    J(128, "A cargos y a familiares del PP.", "PP de Alicante", "A", "A", "adjudicación identificable"),
    J(129, "Corrupción y vivienda, todo junto, lo tienen todo.", "PP", "D", "D5", "extensión («lo tienen todo»)"),
    J(135, "me han puesto 20 querellas falsas los distintos lobis económicos, fondos buitra", "lobis económicos y fondos buitre", "A", "A",
      "querellas archivadas (oración siguiente)"),
    J(142, "grandes empresas que han pagado comisiones y que han participado de la corrupción luego salgan de rositas", "empresas corruptoras", "A", "A",
      "agente acotado por su acto"),
    J(148, "El partido con más condenas por corrupción.", "PP", "A", "A", "condenas"),
    J(150, "siguen siendo el partido político más corrupto de Europa", "PP", "A", "A", "etiqueta con su ancla en las oraciones contiguas (condenas)"),
    J(151, "lo han condenado por organización criminal", "PP", "A", "A", "sentencia"),
    J(160, "que ha hecho cero autocrítica", "Feijóo", "A", "A", "ámbito: los casos de corrupción de su partido"),
    J(163, "el Partido Popular es el partido que acumula más casos de corrupción", "PP", "A", "A"),
    J(164, "han habido casos graves de corrupción recientes de personas de su máxima confianza en el Partido Socialista", "PSOE", "A", "A", "casos identificables"),
    J(165, "Yo creo que eso ha decepcionado a mucha gente.", "PSOE", "A", "A", "ancla en la oración anterior"),
]

# ── P5 · la palabra del otro ─────────────────────────────────────────────────────────────
def V(o, frag, voz, codigo, nota=""): return dict(oracion=o, fragmento=frag, voz=voz, codigo=codigo, nota=nota)

P5 = [
    V(16, "como dijo el señor Ávalos, era un derecho, pero también un bien de mercado", "PSOE (Ábalos)", "B", "cita y responde («no se puede especular», oración 18)"),
    V(22, "Cuando habla de extranjeros, habla de los fondos buitre", "Abascal", "B", "responde con ironía a lo dicho sobre los extranjeros"),
    V(23, "Se refiere a los fondos buitre.", "Abascal", "B", "repetición"),
    V(24, "Está hablando de expropiar a los fondos buitre.", "Abascal", "B", "repetición"),
    V(26, "yo estoy de acuerdo con las críticas a las políticas de derechas, pero le he dicho, efectivamente la política de contención de precios en Barcelona ha tenido un efecto y ha bajado ligeramente un 4%",
      "Sánchez", "V2", "concede el dato de Sánchez (bajada del 4 %)"),
    V(27, "Pero no es suficiente porque esa ley se aprobó demasiado tarde", "Sánchez", "B"),
    V(28, "Sí, sí, pero ya son demasiado altos los precios en Barcelona", "Sánchez", "B"),
    V(33, "Porque primero dijo que lo haría usted, pero que luego dijo que no lo haría usted.", "Feijóo", "B"),
    V(37, "no sé cómo piensa usted hacer un millón de viviendas", "Feijóo", "B", "responde con el dato de la oración anterior"),
    V(39, "usted me hablaba de la ocupación", "Feijóo", "B", "responde con el dato de la oración 40"),
    V(42, "me ha hablado de Barcelona", "Feijóo", "B", "responde con los datos de Barcelona (oración 44)"),
    V(48, "Que ustedes utilizan mucho la palabra ocupación", "PP y Vox", "B"),
    V(49, "luego se llenan la la boca de la palabra ocupación", "PP y Vox", "B", "burla que acompaña a una respuesta (las votaciones)"),
    V(70, "si le preocupa tanto la nevera de los españoles", "Feijóo", "B", "cita y responde con las votaciones"),
    V(71, "¿Está a favor de las subidas del salario minimo?  ¿Ah si?", "Feijóo", "B", "pone en duda lo dicho y responde en la oración siguiente"),
    V(74, "Entonces lo celebro, le hemos convencido.", "Feijóo", "B", "ironía clara: no concede, insinúa un cambio de opinión"),
    V(75, "porque habla de ayudas, de reducciones de impuestos", "Feijóo", "B"),
    V(76, "Con algunos podríamos estar de acuerdo", "Feijóo", "V2", "concede parte de las rebajas y ayudas de Feijóo"),
    V(76, "porque dicen que están en contra de subir los impuestos a los rios", "Feijóo", "B"),
    V(79, "¿de dónde va a sacar el dinero para hacer esas medidas de las que habla?", "Feijóo", "B"),
    V(82, "me hizo ilusión cuando vimos que en campaña te animabas y asumías esta propuesta", "Sánchez", "V2", "celebra que Sánchez asuma la propuesta («nos parece muy bien», oración 83)"),
    V(84, "en el caso del Partido Socialista se plantea para recaudar 2000 millones", "PSOE", "B", "responde en la oración siguiente"),
    V(96, "usted le gusta mucho presumir de buena gestión", "Feijóo", "B", "burla que acompaña a una respuesta (Madrid, Andalucía, oraciones 99-110)"),
    V(113, "Yo estoy de acuerdo que en el tema de los trenes son gravísimos los dos accidentes", "Feijóo", "V2", "concede el punto de Feijóo sobre los trenes"),
    V(117, "¿cómo me puede hablar usted de buena gestión", "Feijóo", "B", "responde con Mazón"),
    V(118, "¿Cómo puede decir que eso es buena gestión?", "Feijóo", "B", "repetición"),
    V(121, "¿de verdad se cree que puede venir aquí a dar lecciones?", "Feijóo", "Z1",
      "caso resuelto del manual («ustedes no son quiénes para hablar de corrupción»): sustituye a la respuesta"),
    V(123, "¿de verdad cree que puede venir aquí a dar lecciones?", "Feijóo", "Z1", "repetición"),
    V(132, "Señor Sánchez, en eso discrepo.", "Sánchez", "B", "responde a «no existe la corrupción cero»"),
    V(160, "decencia del presidente del partido que tiene más casos de corrupción", "Feijóo", "B", "responde a su «decencia» con los casos"),
    V(161, "30 años de gestión.", "Feijóo", "Z2", "eco burlón de su frase, sin respuesta"),
    V(164, "es verdad que se les ha apartado de sus responsabilidades", "Sánchez", "V2", "concede que el PSOE apartó a los implicados"),
]

# ── P6 · lo que pide hacer ───────────────────────────────────────────────────────────────
def X(o, frag, blanco, codigo, nota=""): return dict(oracion=o, fragmento=frag, blanco=blanco, codigo=codigo, nota=nota)

P6 = [
    X(2, "Espero que quizá en la próxima intervención el representante de Vox va a condenar la violencia machista.", "Abascal", "R", "le pide una condena"),
    X(4, "Yo le he respetado su intervención, le he hecho una pregunta, después si quiere me contesta.", "Feijóo", "C3", "pide respeto del turno"),
    X(14, "hay que ser mucho más exigentes con el gobierno progresista", "Gobierno", "R"),
    X(20, "lo que le propongo, señor Sánchez, es que reeditemos un gobierno progresista", "Sánchez (PSOE)", "C1", "propone un acuerdo de gobierno a otro partido"),
    X(20, "bajar los alquileres", "", "N-prog"),
    X(20, "expropiar las viviendas de los fondos buitre para pasarlas al alquiler social", "fondos buitre", "R", "expropiación: procedimiento legal"),
    X(31, "yo le hecho una petición que es que en el al principio de la nueva legislatura, si hay un gobierno progresista bajemos los alquileres", "Sánchez (PSOE)", "C1",
      "pide un compromiso común al futuro socio"),
    X(35, "Pero no nos puede dar una pista de cómo va a hacer ese millón de viviendas", "Feijóo", "R", "pide explicaciones"),
    X(53, "Pero no lo vamos a permitir.", "", "N-prog", "frenar el recorte (una política)"),
    X(54, "Vamos a impulsar un gobierno progresista.", "", "N-mov"),
    X(55, "La gente va a ir a votar en masa", "", "N-mov"),
    X(64, "nosotros creemos que hay que atajar de raíz, cortando la especulación", "", "N-prog"),
    X(65, "subir los impuestos a los ricos", "los ricos", "R", "medida fiscal sobre un grupo definido por su renta, por ley"),
    X(68, "eso se hace subiendo los impuestos por arriba", "los ricos", "R", "repetición"),
    X(68, "facilitando la vida a los autónomos con una tarifa plana", "", "N-prog"),
    X(76, "estamos hablando de subirlos los impuestos a 260,000 personas que tienen fortunas de millones de euros", "los ricos", "R", "repetición"),
    X(85, "hay que ir a recaudar más 10,000 millones", "los ricos", "R", "repetición"),
    X(86, "creemos que hay que reorientar el modelo económico", "", "N-prog"),
    X(90, "esperar una vez más que el señor Avascal se decida a condenar la violencia machista", "Abascal", "R", "le pide una condena"),
    X(95, "nuestra propuesta es equipar la pensión mínima al salario mínimo interprofesional", "", "N-prog"),
    X(96, "ahora necesitamos que de las campañas pasemos al BOE", "Sánchez (PSOE)", "C1", "pide al futuro socio llevar la prestación al BOE"),
    X(106, "¿No cree que debería dimitir?", "Ayuso", "R", "pide una dimisión"),
    X(115, "hacer un pacto de estado, no politizar, sino hacer un pacto de estado para poner los trenes que necesitamos en este país", "todos los partidos", "C1",
      "pacto de Estado y freno a la politización"),
    X(137, "hay que ser exigentes para lograrla en general en el sistema político", "", "N-prog"),
    X(138, "quiero ser por positiva, es decir, no solo es el ITU más o quién tiene más o quién tiene menos", "", "C3", "propone salir del «y tú más»"),
    X(141, "no solo hay que ir a por los políticos corruptos", "políticos corruptos", "R", "grupo definido por su conducta, por vía legal"),
    X(141, "hay que ir a por los corruptores", "corruptores", "R", "ídem"),
    X(143, "Nuestra propuesta que los corruptores estén eh al menos 20 años sin poder trabajar con la administración pública.", "corruptores", "R",
      "sanción legal ligada a una conducta"),
    X(144, "proteger a las denunciantes de la corrupción", "", "N-prog"),
    X(154, "me gustaría que nos contara algo sobre su corrupción", "Feijóo", "R", "pide explicaciones"),
    X(155, "¿y usted va a acabar con el aforamiento del señor Mazón?", "Mazón", "R"),
    X(158, "¿Usted cree que el Mazón, señor Mazón, tiene que seguir en el Parlamento Valenciano aforado?", "Mazón", "R", "directiva indirecta clara"),
    X(159, "¿Cree que debe seguir ahí el señor Mazón?", "Mazón", "R", "repetición"),
    X(170, "hay que hacer el máximo esfuerzo para que eso no se repita jamás", "", "N-prog"),
    X(172, "Hemos propuesto que los corruptores, las empresas corruptoras estén 20 años como mínimo sin poder volver a trabajar con la administración pública.", "corruptores", "R", "repetición"),
    X(173, "Otra propuesta es la protección real y efectiva con recursos de las denunciantes de la corrupción.", "", "N-prog"),
    X(174, "basta ya de exministros en consejos de administración de bancos y de eléctricas", "exministros", "R", "regulación de las puertas giratorias"),
]

if __name__ == "__main__":
    guardar(ID, P1, ANADIDAS, P1_EV, P2, P3, P5, P6)
