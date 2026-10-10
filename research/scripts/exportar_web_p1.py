"""IRA · P1 Frontera del nosotros · exportación de datos para la web.

Lee las tablas codificadas de datos/p1/ y escribe src/data/metodologia/p1.json, el único
archivo que lee la página /metodologia/p1. La página no calcula nada: las cifras salen de
calcular_p1.py (se importa; las fórmulas no se reimplementan aquí).

Contenido:
  fichas      la ficha de P1 de cada discurso, indicador a indicador
  fragmento   oraciones 40-51 y 80-82 de Barcelona con cada referencia localizada en su
              oración y los eventos de frontera de esas oraciones

Uso (desde research/):  python scripts/exportar_web_p1.py
"""
import csv
import json
import sys
from collections import Counter
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

import calcular_p1 as calc  # noqa: E402
from extraer_p1 import nlp  # noqa: E402  (mismo modelo y versión que la extracción)

DATOS = RAIZ / "datos" / "p1"
TEXTOS = RAIZ / "textos"
SALIDA = RAIZ.parent / "src" / "data" / "metodologia" / "p1.json"

DISCURSOS = [
    ("sanchez-barcelona-2026", "Sánchez · Cumbre Progresista, Barcelona 2026"),
    ("sanchez-onu-2024", "Sánchez · Asamblea General de la ONU 2024"),
]
FRAGMENTO_ID = "sanchez-barcelona-2026"
FRAGMENTO_ORACIONES = list(range(40, 52)) + list(range(80, 83))
FRAGMENTO_FUENTE = "Pedro Sánchez, Cumbre Progresista Internacional, Barcelona, 18 de abril de 2026. Fragmento."

# Códigos del manual (secciones 4 y 5). `valor` es lo que aporta la mención a su indicador.
CODIGOS = {
    "U": ("Universal sin oposición", "alcance", 10, "inclusivo"),
    "G": ("Grupo sin perdedor", "alcance", 10, "inclusivo"),
    "GC": ("Contra alguien", "alcance", 0, "contra"),
    "S": ("Situacional", None, None, "situacional"),
    "I": ("Institucional", None, None, "situacional"),
    "A": ("Ambiguo", None, None, "situacional"),
    "X": ("Error de extracción", None, None, "situacional"),
    "Y": ("Primera persona singular", None, None, "tenue"),
    "F": ("Tercera persona «ellos»", None, None, "tenue"),
    "2I": ("Interpelación inclusiva", "interpelacion", 10, "inclusivo"),
    "2C": ("Interpelación contra alguien", "interpelacion", 0, "contra"),
}
PENDIENTE = "[PENDIENTE RICK]"


def leer(ruta):
    return list(csv.DictReader(open(ruta, encoding="utf-8")))


def r(x, d=4):
    return None if x is None else round(x, d)


def ficha(id_, titulo):
    ruta_ref, ruta_ev = DATOS / f"{id_}_referencias.csv", DATOS / f"{id_}_eventos.csv"
    res = calc.calcular(ruta_ref, ruta_ev)
    ref, ind, usados, total = res["ref"], res["ind"], res["usados"], res["total"]

    # Recuentos de la permeabilidad (las retiradas cuentan como cierre, igual que en calcular_p1).
    ev = leer(ruta_ev)
    aperturas = sum(f["tipo"] == "A" for f in ev)
    cierres = sum(f["tipo"] == "C" for f in ev) + len(res["retiradas"])
    assert aperturas + cierres == ind["permeabilidad"]["n"]

    recuentos = {
        "alcance": {"U": ref["U"], "G": ref["G"], "GC": ref["GC"]},
        "permeabilidad": {"A": aperturas, "C": cierres},
        "interpelacion": {"2I": ref["2I"], "2C": ref["2C"]},
    }
    indicadores = {}
    for k in calc.PESOS:
        d = ind[k]
        indicadores[k] = {
            "nombre": calc.NOMBRES[k],
            "valor": r(d["valor"]),
            "n": d["n"],
            "minimo": calc.MINIMOS[k],
            "puntua": k in usados,
            "peso_nominal": r(calc.PESOS[k] / sum(calc.PESOS.values())),
            "peso_efectivo": r(calc.PESOS[k] / total) if k in usados else None,
            "motivo": None if k in usados else (
                f"{calc.pl(d['n'], 'caso', 'casos')}, mínimo {calc.MINIMOS[k]}" if d["n"] < calc.MINIMOS[k]
                else "P1 no se puntúa: ni el alcance ni la permeabilidad llegan a su mínimo"),
            "recuento": recuentos[k],
            "detalle": d["detalle"],
        }

    margen = None
    if "alcance" in usados:
        lo, hi = calc.wilson(ref["U"] + ref["G"], res["n_alc"])
        margen = [r(10 * lo, 2), r(10 * hi, 2)]

    excepciones = [{"oracion": int(f["oracion"]), "texto": f["texto"]} for f in res["excepciones"]] + \
                  [{"oracion": int(f["oracion"]), "texto": f["contexto"]} for f in res["excepciones_ref"]]
    retiradas = [{"oracion": int(f["oracion"]), "texto": f["texto"], "fuente": f["desmentido"]}
                 for f in res["retiradas"]]
    return {
        "id": id_,
        "titulo": titulo,
        "p1": r(res["p1"]),
        "solidez": res["sol"],
        "nosotros_clasificables": res["n_alc"],
        "indicadores": indicadores,
        "margen_alcance_95": margen,
        "excepciones": excepciones,
        "excepciones_retiradas": retiradas,
        "informativo": {c: ref[c] for c in ("S", "I", "A", "Y", "X", "F")},
        "version": calc.VERSION,
    }


def oraciones(id_):
    doc = nlp(open(TEXTOS / f"{id_}.txt", encoding="utf-8").read())
    return list(doc.sents)


def localizar(sent, filas):
    """Posición de cada referencia dentro de su oración, por orden de aparición.

    Cada fila se asigna a la primera aparición todavía libre de su `forma`: primero como
    token completo; si no, como parte de una palabra (clíticos pegados añadidos a mano)."""
    texto = sent.text
    recorte = len(texto) - len(texto.lstrip())
    libres = [(t.idx - sent.start_char, t.idx - sent.start_char + len(t.text), t.text) for t in sent]
    ocupado = []

    def libre(ini, fin):
        return all(fin <= a or ini >= b for a, b in ocupado)

    pos = {}
    for f in sorted(filas, key=lambda f: int(f["n"])):
        forma = f["forma"]
        hit = next(((a, b) for a, b, t in libres if t == forma and libre(a, b)), None) or \
            next(((a, b) for a, b, t in libres if t.lower() == forma.lower() and libre(a, b)), None)
        if hit is None:  # dentro de una palabra o en otra posición
            ini = texto.lower().find(forma.lower())
            while ini != -1 and not libre(ini, ini + len(forma)):
                ini = texto.lower().find(forma.lower(), ini + 1)
            hit = None if ini == -1 else (ini, ini + len(forma))
        if hit:
            ocupado.append(hit)
            pos[f["n"]] = (hit[0] - recorte, hit[1] - recorte)
        else:
            pos[f["n"]] = None
    return pos


def fragmento():
    filas = leer(DATOS / f"{FRAGMENTO_ID}_referencias.csv")
    eventos = leer(DATOS / f"{FRAGMENTO_ID}_eventos.csv")
    sents = oraciones(FRAGMENTO_ID)
    salida, pendientes = [], []
    for o in FRAGMENTO_ORACIONES:
        sent = sents[o - 1]
        texto = sent.text.strip().replace("\n", " ")
        filas_o = [f for f in filas if int(f["oracion"]) == o]
        for f in filas_o:  # la segmentación tiene que ser la misma que la de la tabla
            if f["contexto"] != texto:
                sys.exit(f"La oración {o} no coincide con la columna contexto de la fila {f['n']}")
        pos = localizar(sent, filas_o)
        refs = []
        for f in sorted(filas_o, key=lambda f: pos[f["n"]][0] if pos[f["n"]] else 10 ** 6):
            cat, indicador, valor, grupo = CODIGOS[f["categoria"]]
            p = pos[f["n"]]
            if p is None:
                pendientes.append(f"oración {o}, fila {f['n']} ({f['forma']})")
            refs.append({
                "n": int(f["n"]),
                "inicio": p[0] if p else None,
                "fin": p[1] if p else None,
                "forma": f["forma"],
                "codigo": f["categoria"],
                "categoria": cat,
                "grupo": grupo,
                "indicador": indicador,
                "valor": valor,
                "nota": f["nota"],
                **({"pendiente": f"{PENDIENTE} no se ha podido localizar en la oración"} if p is None else {}),
            })
        evs = []
        for e in eventos:
            if int(e["oracion"]) != o:
                continue
            marca = e["marca"]
            codigo, _, etiqueta = marca.partition(" ")
            if not (codigo[:1] in "AC" and codigo[1:].isdigit()):
                codigo, etiqueta = None, marca
            evs.append({"tipo": e["tipo"], "codigo": codigo, "marca": etiqueta, "blanco": e["blanco"],
                        "nota": e["nota"], "texto": e["texto"]})
        salida.append({"oracion": o, "texto": texto, "referencias": refs, "eventos": evs})

    todas = [x for s in salida for x in s["referencias"]]
    return {
        "discurso": FRAGMENTO_ID,
        "fuente": FRAGMENTO_FUENTE,
        "oraciones": salida,
        "recuento": {
            "por_grupo": dict(Counter(x["grupo"] for x in todas)),
            "por_codigo": dict(Counter(x["codigo"] for x in todas)),
            "eventos": dict(Counter(e["tipo"] for s in salida for e in s["eventos"])),
        },
        "pendientes": pendientes,
    }


if __name__ == "__main__":
    import spacy
    datos = {
        "generado_por": "research/scripts/exportar_web_p1.py",
        "version": calc.VERSION,
        "spacy": spacy.__version__,
        "modelo": f"{nlp.meta['lang']}_{nlp.meta['name']} {nlp.meta['version']}",
        "codigos": {c: {"categoria": v[0], "indicador": v[1], "valor": v[2], "grupo": v[3]}
                    for c, v in CODIGOS.items()},
        "fichas": {id_: ficha(id_, t) for id_, t in DISCURSOS},
        "fragmento": fragmento(),
    }
    SALIDA.parent.mkdir(parents=True, exist_ok=True)
    with open(SALIDA, "w", encoding="utf-8", newline="\n") as f:
        json.dump(datos, f, ensure_ascii=False, indent=2)
        f.write("\n")
    pend = datos["fragmento"]["pendientes"]
    print(f"Escrito {SALIDA} · {sum(len(s['referencias']) for s in datos['fragmento']['oraciones'])} "
          f"referencias en el fragmento · pendientes: {len(pend)}")
    for p in pend:
        print(f"  {PENDIENTE} {p}")
