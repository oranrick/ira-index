"""IRA · Debate a cuatro de RTVE (26-nov-2026) · fichas por candidatura y resumen comparado.

Calcula P1 (v1.1, codificado con los cambios de v1.2), P2 (v1.0), P3, P5 y P6 (v0.1) para cada
candidatura a partir de las tablas de datos/pX/, escribe una ficha por parámetro en fichas/pX/ y un
resumen en fichas/debate-rtve-2026-resumen.md. P4 y P7 no tienen manual: no se calculan, y por eso
tampoco hay nota IRA agregada.

Uso (desde research/):  python scripts/calcular_debate.py
"""
import csv
import json
import os
import subprocess
import sys
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "scripts"))
import calcular_p1  # noqa: E402
import calcular_p2  # noqa: E402
import calcular_signo  # noqa: E402

# Orden alfabético por apellido: el resumen no ordena por nota.
CANDIDATURAS = [
    ("abascal", "Santiago Abascal (Vox)"),
    ("colau", "Ada Colau (Frente Amplio)"),
    ("feijoo", "Alberto Núñez Feijóo (PP)"),
    ("sanchez", "Pedro Sánchez (PSOE)"),
]
DEBATE = "Debate a cuatro · RTVE, 26-nov-2026"


def num(x, d=1):
    return f"{x:.{d}f}".replace(".", ",")


def leer(ruta):
    return list(csv.DictReader(open(ruta, encoding="utf-8")))


def margen_web(p1=None, p2=None):
    datos = {k: v for k, v in (("p1", p1), ("p2", p2)) if v is not None}
    out = subprocess.run(["node", os.path.join(RAIZ, "scripts", "margen_cli.mjs"), json.dumps(datos)],
                         check=True, capture_output=True, text=True).stdout
    return json.loads(out)


def p1(id_, titulo):
    ref_csv, ev_csv = f"{RAIZ}/datos/p1/{id_}_referencias.csv", f"{RAIZ}/datos/p1/{id_}_eventos.csv"
    texto = calcular_p1.ficha(titulo, ref_csv, ev_csv).rstrip("\n").split("\n")
    refs, evs = leer(ref_csv), leer(ev_csv)
    cat = Counter(f["categoria"] for f in refs)
    tipos = Counter(f["tipo"] for f in evs)
    cuentas = dict(U=cat["U"], G=cat["G"], GC=cat["GC"], I=cat["2I"], C=cat["2C"], A=tipos["A"], Cp=tipos["C"])
    web = margen_web(p1=cuentas)["p1"]
    anadidas = sum("omisión del extractor" in f.get("nota", "") for f in refs)
    extra = []
    if web["nota"] is not None:
        extra.append(f"Margen del 80 % (mismo cálculo que la web, src/lib/margen.js): {num(web['margen'][0])} a {num(web['margen'][1])}")
    extra += [
        f"Segunda persona dirigida a rivales del debate (2R, no puntúa): {cat['2R']}. Terceras personas (F): {cat['F']}.",
        f"Referencias añadidas a mano por omisión del extractor: {anadidas}.",
        "Codificado con los cambios de P1 v1.2 acordados en ESTADO.md (C7 y A6 pasan a P5, C6 solo literal, "
        "C4 sin la expulsión pedida); fórmula y pesos de v1.1.",
    ]
    # Antes de la línea de versión
    texto = texto[:-2] + extra + texto[-2:]
    os.makedirs(f"{RAIZ}/fichas/p1", exist_ok=True)
    open(f"{RAIZ}/fichas/p1/{id_}.md", "w", encoding="utf-8").write("\n".join(texto) + "\n")
    r = calcular_p1.calcular(ref_csv, ev_csv)
    return dict(nota=r["p1"], margen=web.get("margen"), solidez=r["sol"], cuentas=cuentas, ind=r["ind"], usados=r["usados"],
                exc=len(r["excepciones"]), r2=cat["2R"])


def p2(id_, titulo):
    ev_csv = f"{RAIZ}/datos/p2/{id_}_eventos.csv"
    os.makedirs(f"{RAIZ}/fichas/p2", exist_ok=True)
    import io, contextlib
    with contextlib.redirect_stdout(io.StringIO()):
        calcular_p2.main(ev_csv, f"{RAIZ}/textos/{id_}.txt", f"{RAIZ}/fichas/p2/{id_}.md", titulo)
    c = Counter(f["resultado"] for f in leer(ev_csv))
    web = margen_web(p2=dict(E=c["E"], P=c["P"], N=c["N"]))["p2"]
    return dict(nota=web["nota"], margen=web.get("margen"), solidez=web["solidez"], E=c["E"], P=c["P"], N=c["N"])


def signo(param, id_, titulo):
    ev_csv = f"{RAIZ}/datos/{param}/{id_}_eventos.csv"
    texto, r = calcular_signo.ficha(param, ev_csv, f"{RAIZ}/textos/{id_}.txt", titulo)
    os.makedirs(f"{RAIZ}/fichas/{param}", exist_ok=True)
    open(f"{RAIZ}/fichas/{param}/{id_}.md", "w", encoding="utf-8").write(texto)
    return r


def celda(nota, margen, solidez, n_txt):
    if nota is None:
        return f"sin puntuar ({n_txt})"
    m = f" ({num(margen[0])}–{num(margen[1])})" if margen else ""
    return f"**{num(nota)}**{m} · {solidez}"


def solapan(a, b):
    if a["nota"] is None or b["nota"] is None:
        return True
    return a["margen"][0] <= b["margen"][1] and b["margen"][0] <= a["margen"][1]


def main():
    res = {}
    for slug, nombre in CANDIDATURAS:
        id_ = f"debate-rtve-2026-{slug}"
        t = f"{nombre} · {DEBATE}"
        res[slug] = dict(
            nombre=nombre,
            p1=p1(id_, f"P1 · Frontera del nosotros · {t}"),
            p2=p2(id_, f"P2 · Marco metafórico · {t}"),
            p3=signo("p3", id_, f"P3 · Polaridad moral · {t}"),
            p5=signo("p5", id_, f"P5 · Apertura al disenso · {t}"),
            p6=signo("p6", id_, f"P6 · Llamada a la acción · {t}"),
            palabras=len(open(f"{RAIZ}/textos/{id_}.txt", encoding="utf-8").read().split()),
        )

    nombres = [res[s]["nombre"].split(" (")[0] for s, _ in CANDIDATURAS]
    L = [f"# {DEBATE} · Resumen IRA por candidatura", "",
         "Una pieza por candidatura con todas sus intervenciones en los cuatro bloques. Columnas en orden alfabético "
         "por apellido: el resumen no ordena por nota. Entre paréntesis, el margen del 80 %: si dos márgenes se solapan, "
         "no hay diferencia clara entre esas dos notas.", "",
         "| Parámetro | " + " | ".join(nombres) + " |",
         "|---|" + "---|" * len(nombres)]

    def fila(nombre, fn):
        L.append(f"| {nombre} | " + " | ".join(fn(res[s]) for s, _ in CANDIDATURAS) + " |")

    fila("P1 · Frontera del nosotros", lambda r: celda(r["p1"]["nota"], r["p1"]["margen"], (r["p1"]["solidez"] or "").split(" (")[0], "sin material"))
    fila("P2 · Marco metafórico", lambda r: celda(r["p2"]["nota"], r["p2"]["margen"], r["p2"]["solidez"].replace("solida", "sólida"), f"{r['p2']['E'] + r['p2']['P']} con signo, mínimo 3"))
    fila("P3 · Polaridad moral", lambda r: celda(r["p3"]["nota"], r["p3"]["margen"], r["p3"]["solidez"], f"{r['p3']['total']} juicios"))
    fila("P4 · Tono emocional", lambda r: "sin manual")
    fila("P5 · Apertura al disenso", lambda r: celda(r["p5"]["nota"], r["p5"]["margen"], r["p5"]["solidez"], f"{r['p5']['total']} eventos"))
    fila("P6 · Llamada a la acción", lambda r: celda(r["p6"]["nota"], r["p6"]["margen"], r["p6"]["solidez"], f"{r['p6']['total']} acciones"))
    fila("P7 · Engagement dialógico", lambda r: "sin manual")
    L += ["", "No hay nota IRA agregada: faltan P4 y P7, que suman el 25 % del peso. Los márgenes de P3, P5 y P6 son "
          "provisionales (sus manuales aún no fijan margen; se usa la misma beta que P2, con el neutro a mitad).", ""]

    L += ["## Recuentos", "",
          "| | " + " | ".join(nombres) + " |", "|---|" + "---|" * len(nombres)]
    fila("Palabras", lambda r: str(r["palabras"]))
    fila("P1 · nosotros inclusivos / contra alguien", lambda r: f"{r['p1']['cuentas']['U'] + r['p1']['cuentas']['G']} / {r['p1']['cuentas']['GC']}")
    fila("P1 · interpelación al público: inclusiva / contra alguien", lambda r: f"{r['p1']['cuentas']['I']} / {r['p1']['cuentas']['C']}")
    fila("P1 · aperturas / cierres (excepciones)", lambda r: f"{r['p1']['cuentas']['A']} / {r['p1']['cuentas']['Cp']} ({r['p1']['exc']})")
    fila("P1 · segunda persona a rivales (2R, no puntúa)", lambda r: str(r["p1"]["r2"]))
    fila("P2 · empáticas / polarizan / neutras", lambda r: f"{r['p2']['E']} / {r['p2']['P']} / {r['p2']['N']}")
    fila("P3 · R / A / D", lambda r: f"{r['p3']['e']} / {r['p3']['n']} / {r['p3']['p']}")
    fila("P5 · V / B / Z", lambda r: f"{r['p5']['e']} / {r['p5']['n']} / {r['p5']['p']}")
    fila("P6 · C / R / X", lambda r: f"{r['p6']['e']} / {r['p6']['n']} / {r['p6']['p']}")
    L.append("")

    L += ["## Diferencias claras (márgenes que no se solapan)", ""]
    claves = [("p1", "P1"), ("p2", "P2"), ("p3", "P3"), ("p5", "P5"), ("p6", "P6")]
    for k, etiqueta in claves:
        pares = []
        slugs = [s for s, _ in CANDIDATURAS]
        for i, a in enumerate(slugs):
            for b in slugs[i + 1:]:
                ra, rb = res[a][k], res[b][k]
                if ra["nota"] is not None and rb["nota"] is not None and not solapan(ra, rb):
                    alto, bajo = (a, b) if ra["nota"] > rb["nota"] else (b, a)
                    pares.append(f"{res[alto]['nombre'].split(' (')[0]} por encima de {res[bajo]['nombre'].split(' (')[0]}")
        L.append(f"- **{etiqueta}**: " + ("; ".join(pares) if pares else "ninguna; todas las notas puntuadas se solapan."))
    L.append("")
    L += ["Fichas por parámetro: `fichas/p1/`, `fichas/p2/`, `fichas/p3/`, `fichas/p5/`, `fichas/p6/` "
          "(archivos `debate-rtve-2026-<candidatura>.md`). Tablas codificadas: `datos/pX/`. Decisiones de codificación: "
          "`codificacion/CRITERIOS.md`.", ""]
    open(f"{RAIZ}/fichas/debate-rtve-2026-resumen.md", "w", encoding="utf-8").write("\n".join(L))
    print("\n".join(L))


if __name__ == "__main__":
    main()
