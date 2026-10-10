"""IRA · P1 (frontera del nosotros) · Paso 1: extracción determinista.

Lee un discurso en español y devuelve una fila por cada referencia a personas:
pronombres personales, desinencias verbales de 1.ª y 2.ª persona, posesivos y
clíticos de 1.ª y 2.ª persona, y los pronombres tónicos ellos/ellas, usted/ustedes.

No interpreta nada: el mismo texto da siempre la misma tabla.
La columna `categoria` queda vacía para el paso 2 (clasificación humana o IA).

Uso:  python3 extraer_p1.py discurso.txt salida.csv
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


def extraer(texto):
    doc = nlp(texto)
    filas = []
    for i_or, sent in enumerate(doc.sents, 1):
        # sujetos pronominales explícitos: se fusionan con su verbo (una sola referencia)
        sujetos = {}
        for t in sent:
            if t.dep_ == "nsubj" and t.lower_ in LEXICO and LEXICO[t.lower_][0] == "pronombre":
                sujetos[t.head.i] = t
        usados = set()
        for t in sent:
            low = t.lower_
            per, num = persona_numero(t)
            tipo = None
            if t.pos_ in ("VERB", "AUX") and t.morph.get("VerbForm") == ["Fin"] and per in ("1", "2"):
                tipo = "verbo"
            elif low in LEXICO:
                tipo, per, num = LEXICO[low]
            if not tipo or t.i in usados:
                continue
            explicito = ""
            if tipo == "verbo" and t.i in sujetos and LEXICO[sujetos[t.i].lower_][1] == per:
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
            })
    return filas, len([t for t in doc if not t.is_punct and not t.is_space])


if __name__ == "__main__":
    texto = open(sys.argv[1], encoding="utf-8").read()
    filas, palabras = extraer(texto)
    with open(sys.argv[2], "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(filas[0].keys()))
        w.writeheader()
        w.writerows(filas)
    from collections import Counter
    c = Counter((r["persona"], r["numero"]) for r in filas)
    print(f"{palabras} palabras · {len(filas)} referencias · " +
          " · ".join(f"{p}.ª {n}: {v}" for (p, n), v in sorted(c.items())))
