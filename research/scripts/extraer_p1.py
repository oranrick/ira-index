"""IRA · P1 (frontera del nosotros) · Paso 1: extracción determinista.

Lee un discurso en español y devuelve una fila por cada referencia a personas:
pronombres personales, desinencias verbales de 1.ª y 2.ª persona, posesivos y
clíticos de 1.ª y 2.ª persona, y los pronombres tónicos ellos/ellas, usted/ustedes.

No interpreta nada: el mismo texto da siempre la misma tabla.
La columna `categoria` queda vacía para el paso 2 (clasificación humana o IA).

Variedad americana (--variedad america). En América el público es «ustedes», que concuerda
con el verbo en 3.ª persona («ustedes saben», «les pido», «sus familias»). Se extrae así:
  - Seguro (persona 2): el verbo en 3.ª persona que lleva «ustedes»/«usted» colgado de él
    (se cuenta una sola vez, como «vosotros sabéis»), y el imperativo («sigan», «siga»).
  - Candidato (persona 2?): el verbo en 3.ª del plural sin sujeto expreso, el clítico «les»,
    los clíticos «los/las» y, en oraciones donde aparece «ustedes» o «usted», los posesivos
    «su/sus/suyo...». Pueden ser el público o «ellos»: el codificador lo decide en la revisión
    (2I/2C si es el público, X si es tercera persona). La columna `revisar` lo indica.
En la variedad española (por defecto) la extracción no cambia.

Uso:  python3 extraer_p1.py discurso.txt salida.csv [--variedad america]
"""
import csv
import sys

import spacy

nlp = spacy.load("es_core_news_md")

# Clases cerradas: léxico fijo (más fiable que el modelo, que falla con "vosotros").
LEXICO = {
    # forma: (tipo, persona, número)
    "yo": ("pronombre", "1", "Sing"), "me": ("pronombre", "1", "Sing"), "mí": ("pronombre", "1", "Sing"),
    "conmigo": ("pronombre", "1", "Sing"),
    "mi": ("posesivo", "1", "Sing"), "mis": ("posesivo", "1", "Sing"), "mío": ("posesivo", "1", "Sing"),
    "mía": ("posesivo", "1", "Sing"), "míos": ("posesivo", "1", "Sing"), "mías": ("posesivo", "1", "Sing"),
    "nosotros": ("pronombre", "1", "Plur"), "nosotras": ("pronombre", "1", "Plur"), "nos": ("pronombre", "1", "Plur"),
    "nuestro": ("posesivo", "1", "Plur"), "nuestra": ("posesivo", "1", "Plur"),
    "nuestros": ("posesivo", "1", "Plur"), "nuestras": ("posesivo", "1", "Plur"),
    "tú": ("pronombre", "2", "Sing"), "te": ("pronombre", "2", "Sing"), "ti": ("pronombre", "2", "Sing"),
    "contigo": ("pronombre", "2", "Sing"), "tu": ("posesivo", "2", "Sing"), "tus": ("posesivo", "2", "Sing"),
    "usted": ("pronombre", "2", "Sing"), "ustedes": ("pronombre", "2", "Plur"),
    "vosotros": ("pronombre", "2", "Plur"), "vosotras": ("pronombre", "2", "Plur"), "os": ("pronombre", "2", "Plur"),
    "vuestro": ("posesivo", "2", "Plur"), "vuestra": ("posesivo", "2", "Plur"),
    "vuestros": ("posesivo", "2", "Plur"), "vuestras": ("posesivo", "2", "Plur"),
    "ellos": ("pronombre", "3", "Plur"), "ellas": ("pronombre", "3", "Plur"),
}


def persona_numero(tok):
    m = tok.morph
    per = m.get("Person")
    num = m.get("Number")
    return (per[0] if per else None, num[0] if num else None)


USTEDES = {"ustedes": "Plur", "usted": "Sing"}
POSESIVOS_3 = {"su", "sus", "suyo", "suya", "suyos", "suyas"}
REVISAR = "candidato a «ustedes»: confirmar si es el público (2I/2C) o tercera persona (X)"


def finito(t):
    return t.pos_ in ("VERB", "AUX") and t.morph.get("VerbForm") == ["Fin"]


def extraer(texto, variedad="espana"):
    america = variedad == "america"
    doc = nlp(texto)
    filas = []
    for i_or, sent in enumerate(doc.sents, 1):
        # sujetos pronominales explícitos: se fusionan con su verbo (una sola referencia)
        sujetos = {}
        for t in sent:
            if t.dep_ == "nsubj" and t.lower_ in LEXICO and LEXICO[t.lower_][0] == "pronombre":
                sujetos[t.head.i] = t
        # «ustedes»/«usted» colgado de un verbo en 3.ª persona del mismo número: se cuenta con
        # el verbo. Se mira la palabra y no la función sintáctica: spaCy etiqueta a veces
        # «Ustedes» como nombre propio o como objeto.
        de_ustedes = {}
        if america:
            for t in sent:
                h = t.head
                if t.lower_ in USTEDES and h is not t and finito(h) and persona_numero(h) == ("3", USTEDES[t.lower_]):
                    de_ustedes.setdefault(h.i, t)
        con_ustedes = america and any(t.lower_ in USTEDES for t in sent)
        unidos = {t.i for t in de_ustedes.values()}
        usados = set()
        for t in sent:
            low = t.lower_
            per, num = persona_numero(t)
            tipo = None
            revisar = ""
            if finito(t) and per in ("1", "2"):
                tipo = "verbo"
            elif america and finito(t) and per == "3" and (t.i in de_ustedes or t.morph.get("Mood") == ["Imp"]):
                tipo, per = "verbo", "2"
            elif america and finito(t) and per == "3" and num == "Plur" and not any(c.dep_.startswith("nsubj") for c in t.children):
                tipo, per, revisar = "verbo", "2?", REVISAR
            elif america and t.i in unidos:
                continue  # ya se cuenta con su verbo
            elif low in LEXICO:
                tipo, per, num = LEXICO[low]
            elif america and t.pos_ == "PRON" and low in ("les", "los", "las"):
                tipo, per, num, revisar = "pronombre", "2?", "Plur", REVISAR
            elif con_ustedes and low in POSESIVOS_3:
                tipo, per, revisar = "posesivo", "2?", REVISAR
                num = "Plur" if low.endswith("s") else "Sing"
            if not tipo or t.i in usados:
                continue
            explicito = ""
            if tipo == "verbo" and t.i in de_ustedes:
                explicito = de_ustedes[t.i].text
            elif tipo == "verbo" and t.i in sujetos and LEXICO[sujetos[t.i].lower_][1] == per:
                explicito = sujetos[t.i].text
                usados.add(sujetos[t.i].i)
            if tipo == "pronombre" and sujetos.get(t.head.i) is t and t.head.pos_ in ("VERB", "AUX") \
                    and t.head.morph.get("VerbForm") == ["Fin"] and persona_numero(t.head)[0] == per:
                continue  # ya se cuenta con su verbo
            filas.append({
                "n": len(filas) + 1,
                "oracion": i_or,
                "forma": t.text,
                "lema": t.lemma_,
                "tipo": tipo,
                "persona": per,
                "numero": {"Sing": "sg", "Plur": "pl"}.get(num, ""),
                "sujeto_explicito": explicito,
                "contexto": sent.text.strip().replace("\n", " "),
                "categoria": "",
                **({"revisar": revisar} if america else {}),
            })
    return filas, len([t for t in doc if not t.is_punct and not t.is_space])


if __name__ == "__main__":
    args = sys.argv[1:]
    variedad = "espana"
    if "--variedad" in args:
        i = args.index("--variedad")
        variedad = args[i + 1]
        del args[i:i + 2]
    if variedad not in ("espana", "america"):
        sys.exit("--variedad tiene que ser espana o america")
    texto = open(args[0], encoding="utf-8").read()
    filas, palabras = extraer(texto, variedad)
    with open(args[1], "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
        w.writeheader()
        w.writerows(filas)
    from collections import Counter
    c = Counter((r["persona"], r["numero"]) for r in filas)
    print(f"{palabras} palabras · {len(filas)} referencias · " +
          " · ".join(f"{p}.ª {n}: {v}" for (p, n), v in sorted(c.items())))
