"""IRA · P2 (marco metafórico) · Paso 1: extracción determinista de candidatos.

Lee un discurso en español y devuelve una fila por cada palabra o expresión que puede ser
una metáfora de alguno de los dominios de la sección 6 del manual (research/manual/P2.md).
No decide nada: el mismo texto da siempre la misma tabla. Quien codifica decide después si
cada candidato es metáfora (MIPVU), su blanco y su resultado (secciones 4 a 8).

Cómo busca (léxico en lexico_p2.csv):
  - Palabras sueltas, por lema: «luchaba», «lucharemos» y «lucha» llevan al lema «luchar».
    La lista solo necesita la forma base; spaCy resuelve la conjugación.
  - Participios que spaCy toma por adjetivos: «rendida» queda como lema «rendido»; se prueba
    también el infinitivo («rendir») para no perderlos.
  - Expresiones de varias palabras («doblar brazo», «traer mundo»): los lemas en ese orden,
    dentro de la misma oración y con 3 palabras como máximo entre uno y otro.
  - Los nombres propios no cuentan («Partido Socialista»).

Lo que no puede hacer: encontrar metáforas que no estén en el léxico («el futuro nos ha
reclamado») ni saber si un uso es literal («la guerra en Gaza»). Por eso hay revisión humana.

Uso:  python extraer_p2.py discurso.txt salida.csv
"""
import csv
import os
import sys

import spacy

nlp = spacy.load("es_core_news_md")
AQUI = os.path.dirname(os.path.abspath(__file__))
HUECO = 3  # palabras permitidas entre los lemas de una expresión

COLUMNAS_CODIFICADOR = ["es_metafora", "tipo", "blanco", "tipo_blanco", "humano", "reglas",
                        "une", "excepcion", "resultado", "nota"]


def cargar_lexico(ruta):
    simples, multiples, notas = {}, [], {}
    with open(ruta, encoding="utf-8") as f:
        for fila in csv.DictReader(f):
            lemas = fila["patron"].lower().split()
            dom = fila["dominio"]
            if len(lemas) == 1:
                simples.setdefault(lemas[0], set()).add(dom)
            else:
                multiples.append((dom, lemas))
            if fila.get("nota"):
                notas[(dom, fila["patron"].lower())] = fila["nota"]
    return simples, multiples, notas


CLITICOS = ("selas", "selos", "sela", "selo", "les", "los", "las", "nos", "le", "lo", "la", "se", "me", "te", "os")
SIN_TILDE = str.maketrans("áéíóú", "aeiou")


def lemas_posibles(tok):
    """El lema de spaCy más las correcciones de sus errores habituales en verbos:
    participios tomados por adjetivos («rendida» → rendir), gerundios con pronombre pegado
    («doblándoles» → doblar) y la conjugación equivocada («languidecir» → languidecer)."""
    lema = tok.lemma_.lower()
    salida = [lema]
    for fin in ("ado", "ada", "ados", "adas"):
        if lema.endswith(fin):
            salida.append(lema[: -len(fin)] + "ar")
    for fin in ("ido", "ida", "idos", "idas"):
        if lema.endswith(fin):
            salida += [lema[: -len(fin)] + "er", lema[: -len(fin)] + "ir"]
    forma = tok.text.lower().translate(SIN_TILDE)
    for cl in CLITICOS:  # gerundio con pronombre pegado
        if forma.endswith(cl) and forma[: -len(cl)].endswith(("ando", "iendo")):
            raiz = forma[: -len(cl)]
            salida += [raiz[:-4] + "ar"] if raiz.endswith("ando") else [raiz[:-5] + "er", raiz[:-5] + "ir"]
            break
    # Conjugación equivocada («languidecir», «robir»). Si la palabra ya es el infinitivo
    # («parar»), el lema es correcto y no se prueban otras terminaciones.
    es_infinitivo = forma == lema and lema.endswith(("ar", "er", "ir"))
    if lema.endswith(("ar", "er", "ir")) and tok.pos_ in ("VERB", "AUX") and not es_infinitivo:
        raiz = lema[:-2]
        salida += [raiz + "ar", raiz + "er", raiz + "ir"]
    # El modelo no lematizó (p. ej. «luchen») o tomó un verbo por sustantivo («peleaste»):
    # se prueban las terminaciones verbales y se buscan los infinitivos posibles en el léxico.
    # En los verbos valen todas; en sustantivos y adjetivos, solo las inequívocamente verbales,
    # para no convertir «calle» en «callar».
    if tok.pos_ in ("VERB", "AUX") and not es_infinitivo:
        finales = TERMINACIONES
    elif lema == forma and tok.pos_ in ("NOUN", "ADJ"):
        finales = TERMINACIONES_VERBALES
    else:
        finales = ()
    for fin in finales:
        if forma.endswith(fin) and len(forma) - len(fin) >= 3:
            raiz = forma[: -len(fin)]
            salida += [raiz + "ar", raiz + "er", raiz + "ir"]
    return salida


# Terminaciones verbales frecuentes, de más larga a más corta
TERMINACIONES = sorted({
    "aste", "asteis", "aron", "amos", "ábamos", "aban", "aba", "abas", "aré", "arás", "ará", "aremos", "arán",
    "ieron", "iste", "isteis", "imos", "íamos", "ían", "ía", "ías", "eré", "erás", "erá", "eremos", "erán",
    "iré", "irás", "irá", "iremos", "irán", "ando", "iendo", "ado", "ido", "an", "en", "as", "es", "a", "e", "o", "ó", "é",
}, key=len, reverse=True)
TERMINACIONES_VERBALES = [t for t in TERMINACIONES if len(t) >= 4 or t in ("amos", "imos")]


def buscar_expresion(tokens, lemas):
    """Devuelve (inicio, fin) si los lemas aparecen en orden con huecos cortos."""
    for i, tok in enumerate(tokens):
        if lemas[0] not in lemas_posibles(tok):
            continue
        pos, ok = i, True
        for lema in lemas[1:]:
            ventana = tokens[pos + 1: pos + 2 + HUECO]
            j = next((k for k, t in enumerate(ventana) if lema in lemas_posibles(t)), None)
            if j is None:
                ok = False
                break
            pos = pos + 1 + j
        if ok:
            return i, pos
    return None


def extraer(texto, simples, multiples, notas):
    filas = []
    doc = nlp(texto)
    for n_or, sent in enumerate(doc.sents, 1):
        tokens = [t for t in sent]
        cubiertos = set()
        # 1. expresiones de varias palabras (tienen prioridad sobre sus palabras sueltas)
        for dom, lemas in multiples:
            hallado = buscar_expresion(tokens, lemas)
            if hallado:
                i, j = hallado
                cubiertos.update(range(i, j + 1))
                filas.append({"oracion": n_or, "forma": sent[i:j + 1].text, "lema": " ".join(lemas),
                              "dominio": dom, "patron": "expresión",
                              "aviso": notas.get((dom, " ".join(lemas)), ""),
                              "contexto": sent.text.strip()})
        # 2. palabras sueltas
        for i, tok in enumerate(tokens):
            if i in cubiertos or tok.pos_ == "PROPN" or not tok.is_alpha:
                continue
            for lema in lemas_posibles(tok):
                if lema in simples:
                    for dom in sorted(simples[lema]):
                        filas.append({"oracion": n_or, "forma": tok.text, "lema": lema, "dominio": dom,
                                      "patron": "palabra" if lema == tok.lemma_.lower() else "participio",
                                      "aviso": notas.get((dom, lema), ""), "contexto": sent.text.strip()})
                    break
    for k, f in enumerate(filas, 1):
        f["n"] = k
    return filas


def main(entrada, salida):
    simples, multiples, notas = cargar_lexico(os.path.join(AQUI, "lexico_p2.csv"))
    filas = extraer(open(entrada, encoding="utf-8").read(), simples, multiples, notas)
    campos = ["n", "oracion", "forma", "lema", "dominio", "patron", "aviso", "contexto"] + COLUMNAS_CODIFICADOR
    with open(salida, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=campos)
        w.writeheader()
        for fila in filas:
            w.writerow({**{c: "" for c in COLUMNAS_CODIFICADOR}, **fila})
    print(f"{len(filas)} candidatos en {len({f['oracion'] for f in filas})} oraciones → {salida}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(*sys.argv[1:])
