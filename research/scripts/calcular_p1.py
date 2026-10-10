"""IRA · P1 Frontera del nosotros · v1 · cálculo y ficha desglosada.

Lee dos tablas ya clasificadas (ver manual/P1.md):
  <id>_referencias.csv  una fila por referencia a personas, con su código
  <id>_eventos.csv      una fila por evento de frontera (cierre o apertura)
y escribe la ficha del discurso con cada indicador, su recuento y el cálculo.

Uso:  python3 calcular_p1.py datos/<id>_referencias.csv datos/<id>_eventos.csv [fichas/<id>.md]
"""
import csv
import math
import sys
from collections import Counter

VERSION = "P1 v1.1 (2026-10-09)"
PESOS = {"alcance": 0.45, "permeabilidad": 0.25, "interpelacion": 0.20}
MINIMOS = {"alcance": 15, "permeabilidad": 3, "interpelacion": 3}
NOMBRES = {"alcance": "Alcance del nosotros", "permeabilidad": "Permeabilidad", "interpelacion": "Interpelación"}


def num(x, d=1):
    return f"{x:.{d}f}".replace(".", ",")


def pl(n, sing, plur):
    return f"{n} {sing if n == 1 else plur}"


def solidez(n):
    if n < 15:
        return "no fiable"
    if n <= 40:
        return "orientativa"
    return "sólida"


def wilson(k, n, z=1.96):
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return max(0.0, c - h), min(1.0, c + h)


def calcular(ruta_ref, ruta_ev):
    filas_ref = list(csv.DictReader(open(ruta_ref, encoding="utf-8")))
    filas_ev = list(csv.DictReader(open(ruta_ev, encoding="utf-8")))
    ref = Counter(f["categoria"] for f in filas_ref)

    # Excepción democrática: se mantiene salvo desmentido documentado (entonces es un cierre normal).
    excepciones = [f for f in filas_ev if f["tipo"] == "CP" and not f.get("desmentido", "").strip()]
    retiradas = [f for f in filas_ev if f["tipo"] == "CP" and f.get("desmentido", "").strip()]
    excepciones_ref = [f for f in filas_ref if "excepción democrática" in f.get("nota", "")]
    a = sum(f["tipo"] == "A" for f in filas_ev)
    c = sum(f["tipo"] == "C" for f in filas_ev) + len(retiradas)

    incl, contra = ref["U"] + ref["G"], ref["GC"]
    n_alc = incl + contra
    n_int = ref["2I"] + ref["2C"]
    n_perm = a + c

    ind = {
        "alcance": {
            "n": n_alc,
            "valor": 10 * incl / n_alc if n_alc else None,
            "detalle": f"{incl} inclusivos ({ref['U']} universales + {ref['G']} de grupo sin perdedor) "
                       f"y {contra} contra alguien → 10 × {incl} / {n_alc}",
        },
        "permeabilidad": {
            "n": n_perm,
            "valor": 10 * (a + 1) / (n_perm + 2),
            "detalle": f"{pl(a, 'apertura', 'aperturas')} y {pl(c, 'cierre', 'cierres')} → 10 × ({a} + 1) / ({n_perm} + 2)",
        },
        "interpelacion": {
            "n": n_int,
            "valor": 10 * ref["2I"] / n_int if n_int else None,
            "detalle": f"{pl(ref['2I'], 'inclusiva', 'inclusivas')} y {ref['2C']} contra alguien → 10 × {ref['2I']} / {n_int}",
        },
    }
    for k, d in ind.items():
        d["usado"] = d["valor"] is not None and d["n"] >= MINIMOS[k]

    # v1.1: P1 se puntúa si el alcance o la permeabilidad llegan a su mínimo.
    if ind["alcance"]["usado"]:
        sol = f"{solidez(n_alc)} ({n_alc} nosotros clasificables)"
    elif ind["permeabilidad"]["usado"]:
        sol = ("orientativa" if n_perm <= 5 else "sólida") + f" (solo por permeabilidad: {pl(n_perm, 'evento', 'eventos')})"
    else:
        sol = None
    usados = [k for k in PESOS if ind[k]["usado"]] if sol else []
    total = sum(PESOS[k] for k in usados)
    p1 = sum(PESOS[k] / total * ind[k]["valor"] for k in usados) if usados else None
    return dict(ref=ref, ind=ind, usados=usados, total=total, p1=p1, n_alc=n_alc, sol=sol,
                excepciones=excepciones, retiradas=retiradas, excepciones_ref=excepciones_ref)


def ficha(titulo, ruta_ref, ruta_ev):
    r = calcular(ruta_ref, ruta_ev)
    ref, ind, usados, total, p1 = r["ref"], r["ind"], r["usados"], r["total"], r["p1"]
    L = [f"# {titulo}", ""]
    if p1 is None:
        L += [f"**P1: sin puntuar** · ni el alcance ({r['n_alc']} nosotros, mínimo 15) "
              f"ni la permeabilidad ({ind['permeabilidad']['n']} eventos, mínimo 3) tienen material suficiente", ""]
    else:
        L += [f"**P1 = {num(p1)}** · solidez: {r['sol']}", ""]
    for k in PESOS:
        d = ind[k]
        if k in usados:
            peso = PESOS[k] / total
            L.append(f"- **{NOMBRES[k]}** ({round(peso * 100)} %): **{num(d['valor'])}**. {d['detalle']}")
        else:
            motivo = f"{pl(d['n'], 'caso', 'casos')}, mínimo {MINIMOS[k]}"
            val = "" if d["valor"] is None else f" (sería {num(d['valor'])})"
            L.append(f"- **{NOMBRES[k]}**: no puntúa{val}. {d['detalle']} · {motivo}")
    if p1 is not None:
        partes = " + ".join(f"{num(PESOS[k] / total, 2)} × {num(ind[k]['valor'])}" for k in usados)
        L += ["", f"Cálculo: {partes} = **{num(p1)}**"]
        if "alcance" in usados:
            lo, hi = wilson(ref["U"] + ref["G"], r["n_alc"])
            L.append(f"Margen del alcance (95 %): {num(10 * lo)} a {num(10 * hi)}")
    exc = [(f["oracion"], f["texto"]) for f in r["excepciones"]] + \
          [(f["oracion"], f["contexto"]) for f in r["excepciones_ref"]]
    if exc:
        L += ["", f"**Fronteras por conducta violenta o antidemocrática ({len(exc)}): no restan, "
                  "pero el IRA no verifica estas acusaciones.**"]
        L += [f"- Frase {o}: \"{t}\"" for o, t in exc]
    if r["retiradas"]:
        L += ["", f"**Excepciones retiradas por desmentido documentado ({len(r['retiradas'])}): cuentan como cierre.**"]
        L += [f"- Frase {f['oracion']}: \"{f['texto']}\" · fuente: {f['desmentido']}" for f in r["retiradas"]]
    L += ["", f"Informativo: situacionales {ref['S']}, institucionales {ref['I']}, ambiguos {ref['A']}, "
              f"primera persona singular {ref['Y']}, errores de extracción {ref['X']}.", f"_{VERSION}_", ""]
    return "\n".join(L)


if __name__ == "__main__":
    texto = ficha(sys.argv[4] if len(sys.argv) > 4 else "Ficha P1", sys.argv[1], sys.argv[2])
    if len(sys.argv) > 3:
        open(sys.argv[3], "w", encoding="utf-8").write(texto)
    print(texto)
