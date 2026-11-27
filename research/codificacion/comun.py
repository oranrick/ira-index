"""Utilidades para escribir las tablas codificadas del debate a cuatro (RTVE, 26-nov-2026).

Cada candidato tiene un módulo con sus decisiones (debate_<slug>.py). Este archivo comprueba que
cada fragmento citado está literalmente en su oración y escribe las tablas en datos/pX/.
"""
import csv, os, re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ESCRATCH = os.environ.get("IRA_ORACIONES", "")


def oraciones(id_):
    import spacy
    nlp = spacy.load("es_core_news_md")
    doc = nlp(open(f"{RAIZ}/textos/{id_}.txt", encoding="utf-8").read())
    return {i: s.text.strip().replace("\n", " ") for i, s in enumerate(doc.sents, 1)}


def norm(t):
    return re.sub(r"\s+", " ", t).strip()


def comprobar(id_, ors, filas, campo="fragmento"):
    malos = []
    for f in filas:
        o = int(f["oracion"])
        if norm(f[campo]) not in norm(ors[o]):
            malos.append((o, f[campo]))
    if malos:
        raise SystemExit(f"{id_}: fragmentos que no están en su oración:\n" + "\n".join(f"  {o}: {t}" for o, t in malos))


def escribir(ruta, campos, filas):
    os.makedirs(os.path.dirname(ruta), exist_ok=True)
    with open(ruta, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=campos)
        w.writeheader()
        for i, f in enumerate(filas, 1):
            fila = {k: f.get(k, "") for k in campos}
            if "n" in campos:
                fila["n"] = i
            w.writerow(fila)


def clasificar_referencias(id_, codigos, anadidas):
    """codigos: {n: (categoria, nota)}; anadidas: filas nuevas (omisiones del extractor)."""
    ruta = f"{RAIZ}/datos/p1/{id_}_referencias.csv"
    # Se parte siempre de la extracción determinista recién hecha: el script es reproducible.
    import subprocess, sys
    subprocess.run([sys.executable, f"{RAIZ}/scripts/extraer_p1.py", f"{RAIZ}/textos/{id_}.txt", ruta],
                   check=True, stdout=subprocess.DEVNULL)
    filas = list(csv.DictReader(open(ruta, encoding="utf-8")))
    campos = list(filas[0].keys())
    for extra in ("categoria", "nota"):
        if extra not in campos:
            campos.append(extra)
    faltan = [f["n"] for f in filas if int(f["n"]) not in codigos]
    if faltan:
        raise SystemExit(f"{id_}: referencias sin código: {faltan}")
    for f in filas:
        cat, nota = codigos[int(f["n"])]
        f["categoria"], f["nota"] = cat, nota
    for a in anadidas:
        fila = {k: "" for k in campos}
        fila.update(a)
        fila["n"] = str(len(filas) + 1)
        filas.append(fila)
    with open(ruta, "w", encoding="utf-8", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=campos)
        w.writeheader()
        w.writerows(filas)


def guardar(id_, codigos_p1, anadidas_p1, p1_eventos, p2, p3, p5, p6):
    ors = oraciones(id_)
    for filas, campo in ((p1_eventos, "texto"), (p2, "fragmento"), (p3, "fragmento"), (p5, "fragmento"), (p6, "fragmento")):
        comprobar(id_, ors, filas, campo)
    clasificar_referencias(id_, codigos_p1, anadidas_p1)
    escribir(f"{RAIZ}/datos/p1/{id_}_eventos.csv", ["oracion", "texto", "tipo", "marca", "blanco", "nota", "desmentido"], p1_eventos)
    escribir(f"{RAIZ}/datos/p2/{id_}_eventos.csv", ["n", "oracion", "fragmento", "dominio", "tipo", "blanco", "tipo_blanco", "humano", "reglas", "une", "excepcion", "resultado", "nota"], p2)
    escribir(f"{RAIZ}/datos/p3/{id_}_eventos.csv", ["n", "oracion", "fragmento", "blanco", "signo", "codigo", "nota"], p3)
    escribir(f"{RAIZ}/datos/p5/{id_}_eventos.csv", ["n", "oracion", "fragmento", "voz", "codigo", "nota"], p5)
    escribir(f"{RAIZ}/datos/p6/{id_}_eventos.csv", ["n", "oracion", "fragmento", "blanco", "codigo", "nota"], p6)
    print(f"{id_}: tablas escritas")
