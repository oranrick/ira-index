"""IRA · P3, P5 y P6 · cálculo y ficha (manuales P3 v0.1, P5 v0.1, P6 v0.1).

Los tres parámetros comparten forma: un polo empático, un neutro que vale 5 y un polo que polariza.
  P3 = 10 × (R + 0,5·A + 1) / (R + A + D + 2)
  P5 = 10 × (V + 0,5·B + 1) / (V + B + Z + 2)
  P6 = 10 × (C + 0,5·R + 1) / (C + R + X + 2)
Mínimo 5 eventos; de 5 a 9, orientativa; 10 o más, sólida.

Margen (provisional): los manuales de P3, P5 y P6 aún no fijan margen. Se usa el mismo criterio que P2:
el intervalo central del 80 % de una beta, contando el neutro como medio acierto y medio fallo, es decir,
beta(empáticos + 0,5·neutros + 1, polarizantes + 0,5·neutros + 1). Su media es exactamente la nota.

Uso:  python calcular_signo.py p3|p5|p6 datos/pX/<id>_eventos.csv textos/<id>.txt fichas/pX/<id>.md "Título"
"""
import csv
import math
import sys
from collections import Counter

NIVEL = 0.8
MINIMO, SOLIDA = 5, 10

CONF = {
    "p3": dict(version="P3 v0.1", col="signo", sub="codigo", emp="R", neu="A", pol="D",
               nombres={"R": "reconocimientos (R)", "A": "críticas ancladas (A)", "D": "deslegitimaciones (D)"},
               unidad="juicios sobre el otro", evento="juicio"),
    "p5": dict(version="P5 v0.1", col="codigo", sub="codigo", emp="V", neu="B", pol="Z",
               nombres={"V": "validaciones (V)", "B": "rebatir (B)", "Z": "anulaciones (Z)"},
               unidad="eventos de voz ajena", evento="evento"),
    "p6": dict(version="P6 v0.1", col="codigo", sub="codigo", emp="C", neu="R", pol="X",
               nombres={"C": "cooperativas (C)", "R": "regladas (R)", "X": "excluyentes (X)"},
               unidad="acciones sobre el otro", evento="acción"),
}


# ── Beta regularizada con parámetros reales (fracción continua de Lentz) ─────────────────
def _betacf(a, b, x):
    tiny, eps = 1e-300, 3e-16
    qab, qap, qam = a + b, a + 1, a - 1
    c, d = 1.0, 1 - qab * x / qap
    d = 1 / (d if abs(d) > tiny else tiny)
    h = d
    for m in range(1, 300):
        m2 = 2 * m
        aa = m * (b - m) * x / ((qam + m2) * (a + m2))
        d = 1 + aa * d; d = 1 / (d if abs(d) > tiny else tiny)
        c = 1 + aa / c; c = c if abs(c) > tiny else tiny
        h *= d * c
        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2))
        d = 1 + aa * d; d = 1 / (d if abs(d) > tiny else tiny)
        c = 1 + aa / c; c = c if abs(c) > tiny else tiny
        delta = d * c
        h *= delta
        if abs(delta - 1) < eps:
            break
    return h


def beta_cdf(x, a, b):
    if x <= 0:
        return 0.0
    if x >= 1:
        return 1.0
    lb = math.lgamma(a + b) - math.lgamma(a) - math.lgamma(b) + a * math.log(x) + b * math.log(1 - x)
    if x < (a + 1) / (a + b + 2):
        return math.exp(lb) * _betacf(a, b, x) / a
    return 1 - math.exp(lb) * _betacf(b, a, 1 - x) / b


def beta_cuantil(q, a, b):
    lo, hi = 0.0, 1.0
    for _ in range(80):
        mid = (lo + hi) / 2
        if beta_cdf(mid, a, b) < q:
            lo = mid
        else:
            hi = mid
    return (lo + hi) / 2


def num(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")


def tipo(codigo, c):
    """Polo de un código: 'R1' → R (en P3), 'Z2' → Z, 'X1' → X, 'N-prog' → N."""
    if codigo.startswith("N"):
        return "N"
    return codigo[0]


def polo_de(param, f):
    return f["signo"] if param == "p3" else tipo(f["codigo"], None)


def calcular(param, filas):
    c = CONF[param]
    polo = Counter()
    sub = Counter()
    for f in filas:
        polo[polo_de(param, f)] += 1
        sub[f[c["sub"]]] += 1
    e, n, p = polo[c["emp"]], polo[c["neu"]], polo[c["pol"]]
    total = e + n + p
    res = dict(e=e, n=n, p=p, total=total, sub=sub, polo=polo, nota=None, margen=None, solidez="sin")
    if total >= MINIMO:
        a, b = e + 0.5 * n + 1, p + 0.5 * n + 1
        res["nota"] = 10 * a / (a + b)
        cola = (1 - NIVEL) / 2
        res["margen"] = (10 * beta_cuantil(cola, a, b), 10 * beta_cuantil(1 - cola, a, b))
        res["solidez"] = "sólida" if total >= SOLIDA else "orientativa"
    return res


def ficha(param, ruta_ev, ruta_texto, titulo):
    c = CONF[param]
    filas = list(csv.DictReader(open(ruta_ev, encoding="utf-8")))
    palabras = len(open(ruta_texto, encoding="utf-8").read().split())
    r = calcular(param, filas)
    E, Nn, P = c["emp"], c["neu"], c["pol"]
    L = [f"# {titulo}", ""]
    if r["nota"] is None:
        L.append(f"**{param.upper()} sin puntuar**: {r['total']} {c['unidad']} (mínimo {MINIMO}).")
    else:
        lo, hi = r["margen"]
        L.append(f"**{param.upper()} = {num(r['nota'])}** (margen provisional del 80 %: {num(lo, 1)} a {num(hi, 1)}) · "
                 f"solidez: {r['solidez']} ({r['total']} {c['unidad']})")
        L.append("")
        L.append(f"Cálculo: 10 × ({E} + 0,5·{Nn} + 1) / ({E} + {Nn} + {P} + 2) = "
                 f"10 × ({r['e']} + 0,5·{r['n']} + 1) / ({r['e']} + {r['n']} + {r['p']} + 2) = **{num(r['nota'])}**")
    L.append("")
    for k in (E, Nn, P):
        subs = sorted(Counter(f["codigo"] for f in filas if polo_de(param, f) == k).items())
        det = f" ({', '.join(f'{s} {v}' for s, v in subs)})" if subs and not (len(subs) == 1 and subs[0][0] == k) else ""
        L.append(f"- {c['nombres'][k][0].upper() + c['nombres'][k][1:]}: {r['polo'][k]}{det}")
    if param == "p6":
        L.append(f"- Programa (N-prog, no entra): {r['sub']['N-prog']}")
        L.append(f"- Movilización propia (N-mov, no entra): {r['sub']['N-mov']}")
    L.append("")
    if param == "p3":
        d, a = r["p"], r["n"]
        if d + a:
            L.append(f"Descriptivo: proporción de esencia D / (D + A) = {num(100 * d / (d + a), 0)} %; "
                     f"{num(1000 * d / palabras, 1)} deslegitimaciones por mil palabras ({palabras} palabras).")
    elif param == "p5":
        L.append(f"Descriptivo: {num(1000 * r['total'] / palabras, 1)} eventos de voz ajena por mil palabras ({palabras} palabras).")
    else:
        x, rr = r["p"], r["n"]
        if x + rr:
            L.append(f"Descriptivo: proporción excluyente X / (X + R) = {num(100 * x / (x + rr), 0)} %; "
                     f"{num(1000 * x / palabras, 1)} acciones excluyentes por mil palabras ({palabras} palabras).")
    L.append("")
    sel_pol = [f for f in filas if polo_de(param, f) == P]
    titulo_pol = {"p3": "Deslegitimaciones (D), lista completa", "p5": "Anulaciones (Z), lista completa",
                  "p6": "Acciones excluyentes (X), lista completa"}[param]
    L.append(f"**{titulo_pol}**" + ("" if sel_pol else ": ninguna."))
    for f in sel_pol:
        blanco = f.get("blanco") or f.get("voz", "")
        L.append(f"- Oración {f['oracion']} · {f['codigo']} · {blanco}: «{f['fragmento']}»" + (f" — {f['nota']}" if f.get("nota") else ""))
    L.append("")
    sel_emp = [f for f in filas if polo_de(param, f) == E]
    titulo_emp = {"p3": "Reconocimientos (R)", "p5": "Validaciones (V)", "p6": "Acciones cooperativas (C)"}[param]
    L.append(f"**{titulo_emp}**" + ("" if sel_emp else ": ninguno."))
    for f in sel_emp:
        blanco = f.get("blanco") or f.get("voz", "")
        L.append(f"- Oración {f['oracion']} · {f['codigo']} · {blanco}: «{f['fragmento']}»" + (f" — {f['nota']}" if f.get("nota") else ""))
    L.append("")
    if param == "p3":
        ironias = [f for f in filas if "ironía" in f.get("nota", "")]
        if ironias:
            L.append("**Ironías codificadas**")
            L += [f"- Oración {f['oracion']}: «{f['fragmento']}» — {f['nota']}" for f in ironias]
            L.append("")
        L.append("_El IRA no verifica las acusaciones. Una crítica anclada es neutra por cómo se formula, no porque sea cierta._")
        L.append("")
    L.append(f"_{c['version']} · margen provisional (ver calcular_signo.py)_")
    texto = "\n".join(L) + "\n"
    return texto, r


if __name__ == "__main__":
    if len(sys.argv) != 6:
        sys.exit(__doc__)
    texto, _ = ficha(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[5])
    open(sys.argv[4], "w", encoding="utf-8").write(texto)
    print(texto)
