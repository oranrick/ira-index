"""IRA · Debate a cuatro de RTVE (26-nov-2026) · exporta los resultados para el panel.

Lee las tablas codificadas (datos/pX/debate-rtve-2026-*.csv), calcula las notas con los mismos
cálculos que las fichas (calcular_p1.py, src/lib/margen.js vía margen_cli.mjs, calcular_signo.py)
y escribe cuatro JSON {rows, meta} en exportar/: notas, recuentos, eventos y sensibilidad.

Uso (desde research/):  python scripts/exportar_debate.py
"""
import csv
import json
import os
import sys
from collections import Counter

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(RAIZ, "scripts"))
import calcular_p1  # noqa: E402
import calcular_signo  # noqa: E402
from calcular_debate import CANDIDATURAS, margen_web  # noqa: E402

PARAMS = [("P1", "Frontera del nosotros"), ("P2", "Marco metafórico"), ("P3", "Polaridad moral"),
          ("P5", "Apertura al disenso"), ("P6", "Llamada a la acción")]
POLO = {"p3": {"R": "empático", "A": "neutro", "D": "polariza"},
        "p5": {"V": "empático", "B": "neutro", "Z": "polariza"},
        "p6": {"C": "empático", "R": "neutro", "X": "polariza", "N": "programa"}}


def leer(ruta):
    return list(csv.DictReader(open(ruta, encoding="utf-8")))


def r2(x):
    return None if x is None else round(x, 4)


def nota_signo(e, n, p):
    return 10 * (e + 0.5 * n + 1) / (e + n + p + 2)


def p1_nota(c):
    return margen_web(p1=c)["p1"]["nota"]


def main():
    notas, recuentos, eventos = [], [], []
    base = {}
    for slug, nombre in CANDIDATURAS:
        id_ = f"debate-rtve-2026-{slug}"
        persona, partido = nombre[:-1].split(" (")
        palabras = len(open(f"{RAIZ}/textos/{id_}.txt", encoding="utf-8").read().split())
        refs, ev1 = leer(f"{RAIZ}/datos/p1/{id_}_referencias.csv"), leer(f"{RAIZ}/datos/p1/{id_}_eventos.csv")
        cat, tip = Counter(f["categoria"] for f in refs), Counter(f["tipo"] for f in ev1)
        c1 = dict(U=cat["U"], G=cat["G"], GC=cat["GC"], I=cat["2I"], C=cat["2C"], A=tip["A"], Cp=tip["C"])
        w1 = margen_web(p1=c1)["p1"]
        sol1 = calcular_p1.calcular(f"{RAIZ}/datos/p1/{id_}_referencias.csv", f"{RAIZ}/datos/p1/{id_}_eventos.csv")["sol"]
        ev2 = leer(f"{RAIZ}/datos/p2/{id_}_eventos.csv")
        c2 = Counter(f["resultado"] for f in ev2)
        w2 = margen_web(p2=dict(E=c2["E"], P=c2["P"], N=c2["N"]))["p2"]
        sig = {p: calcular_signo.calcular(p, leer(f"{RAIZ}/datos/{p}/{id_}_eventos.csv")) for p in ("p3", "p5", "p6")}
        base[slug] = dict(c1=c1, sig=sig)

        def fila(par, nota, margen, solidez, n):
            return dict(candidato=slug, persona=persona, partido=partido, parametro=par, nombre_parametro=dict(PARAMS)[par],
                        nota=r2(nota), margen_bajo=r2(margen[0]) if margen else None, margen_alto=r2(margen[1]) if margen else None,
                        solidez=solidez, eventos=n)

        notas.append(fila("P1", w1["nota"], w1.get("margen"), (sol1 or "sin puntuar").split(" (")[0],
                          c1["U"] + c1["G"] + c1["GC"]))
        notas.append(fila("P2", w2["nota"], w2.get("margen"),
                          {"solida": "sólida", "orientativa": "orientativa", "sin": "sin puntuar"}[w2["solidez"]], c2["E"] + c2["P"]))
        for p in ("p3", "p5", "p6"):
            s = sig[p]
            notas.append(fila(p.upper(), s["nota"], s["margen"], s["solidez"] if s["nota"] is not None else "sin puntuar", s["total"]))

        recuentos.append(dict(
            candidato=slug, persona=persona, partido=partido, palabras=palabras,
            nosotros_inclusivos=c1["U"] + c1["G"], nosotros_contra=c1["GC"], interpelacion_inclusiva=c1["I"],
            interpelacion_contra=c1["C"], segunda_a_rivales=cat["2R"], aperturas=c1["A"], cierres=c1["Cp"],
            excepciones=tip["CP"], metaforas_polarizan=c2["P"], metaforas_neutras=c2["N"], metaforas_empaticas=c2["E"],
            p3_R=sig["p3"]["e"], p3_A=sig["p3"]["n"], p3_D=sig["p3"]["p"],
            p5_V=sig["p5"]["e"], p5_B=sig["p5"]["n"], p5_Z=sig["p5"]["p"],
            p6_C=sig["p6"]["e"], p6_R=sig["p6"]["n"], p6_X=sig["p6"]["p"]))

        for f in ev1:
            polo = {"C": "polariza", "A": "empático", "CP": "excepción democrática"}[f["tipo"]]
            eventos.append(dict(candidato=slug, persona=persona, parametro="P1", oracion=int(f["oracion"]),
                                codigo=f["marca"].split(" ")[0] if f["tipo"] != "CP" else "CP", polo=polo,
                                blanco=f["blanco"], fragmento=f["texto"], nota=f["nota"]))
        for f in ev2:
            eventos.append(dict(candidato=slug, persona=persona, parametro="P2", oracion=int(f["oracion"]), codigo=f["dominio"],
                                polo={"P": "polariza", "N": "neutro", "E": "empático"}[f["resultado"]],
                                blanco=f["blanco"], fragmento=f["fragmento"], nota=f["nota"]))
        for p in ("p3", "p5", "p6"):
            for f in leer(f"{RAIZ}/datos/{p}/{id_}_eventos.csv"):
                k = calcular_signo.polo_de(p, f)
                eventos.append(dict(candidato=slug, persona=persona, parametro=p.upper(), oracion=int(f["oracion"]), codigo=f["codigo"],
                                    polo=POLO[p][k], blanco=f.get("blanco") or f.get("voz", ""), fragmento=f["fragmento"], nota=f["nota"]))
    eventos.sort(key=lambda e: (e["candidato"], e["parametro"], e["oracion"]))
    for i, e in enumerate(eventos, 1):
        e["id"] = f"{e['candidato']}-{e['parametro']}-{i}"

    # ── Sensibilidad: cómo cambiaría cada nota si se decidiera lo contrario ──────────────
    a6, a3 = base["abascal"]["sig"]["p6"], base["abascal"]["sig"]["p3"]
    prio = 3  # oraciones 41, 73 y 132: X1 → R
    oferta = 2  # oraciones 64 y 65: sin C1 ni C2
    mafia = 3  # oraciones 55, 56 y 161: D2 → A
    ca = dict(base["abascal"]["c1"])
    fe = dict(base["feijoo"]["c1"])
    f3 = base["feijoo"]["sig"]["p3"]
    sin_int = dict(ca, I=0, C=0)
    sens = [
        dict(clave="prioridad", decision="«Prioridad nacional» y «solo para españoles» como acción reglada (R) en vez de excluyente (X1)",
             candidato="abascal", persona="Santiago Abascal", parametro="P6",
             nota_actual=r2(a6["nota"]), nota_alternativa=r2(nota_signo(a6["e"], a6["n"] + prio, a6["p"] - prio))),
        dict(clave="oferta", decision="Quitar «Comprométanse. Vamos a dejarlo en un 50 %» como acciones cooperativas (C1 y C2)",
             candidato="abascal", persona="Santiago Abascal", parametro="P6",
             nota_actual=r2(a6["nota"]), nota_alternativa=r2(nota_signo(a6["e"] - oferta, a6["n"], a6["p"]))),
        dict(clave="ambas", decision="Las dos anteriores a la vez",
             candidato="abascal", persona="Santiago Abascal", parametro="P6",
             nota_actual=r2(a6["nota"]), nota_alternativa=r2(nota_signo(a6["e"] - oferta, a6["n"] + prio, a6["p"] - prio))),
        dict(clave="mafia", decision="«Mafia» y «robo» para políticas legales como críticas ancladas (A) en vez de D2",
             candidato="abascal", persona="Santiago Abascal", parametro="P3",
             nota_actual=r2(a3["nota"]), nota_alternativa=r2(nota_signo(a3["e"], a3["n"] + mafia, a3["p"] - mafia))),
        dict(clave="interpelacion", decision="P1 sin el indicador de interpelación (3 casos, justo el mínimo)",
             candidato="abascal", persona="Santiago Abascal", parametro="P1",
             nota_actual=r2(p1_nota(ca)), nota_alternativa=r2(p1_nota(sin_int))),
        dict(clave="presencia", decision="«Yo sería incapaz de venir aquí en su situación procesal» en P3 (A) en vez de P1 (C4)",
             candidato="feijoo", persona="Alberto Núñez Feijóo", parametro="P1",
             nota_actual=r2(p1_nota(fe)), nota_alternativa=r2(p1_nota(dict(fe, Cp=fe["Cp"] - 1)))),
        dict(clave="presencia-p3", decision="La misma frase, efecto en P3",
             candidato="feijoo", persona="Alberto Núñez Feijóo", parametro="P3",
             nota_actual=r2(f3["nota"]), nota_alternativa=r2(nota_signo(f3["e"], f3["n"] + 1, f3["p"]))),
    ]

    codigo = open(os.path.abspath(__file__), encoding="utf-8").read()
    meta = [
        {"label": "exportar_debate.py", "value": codigo, "type": "code", "lang": "python"},
        {"label": "Input", "value": "research/datos/p1, p2, p3, p5 y p6: debate-rtve-2026-<candidatura>_*.csv (repositorio oranrick/ira-index, rama debate-rtve-2026)"},
        {"label": "Cálculo", "value": "calcular_p1.py y src/lib/margen.js (P1, P2); calcular_signo.py (P3, P5, P6). Codificación: research/codificacion/debate_<candidatura>.py y CRITERIOS.md"},
    ]
    os.makedirs(f"{RAIZ}/exportar", exist_ok=True)
    for nombre, filas in (("notas", notas), ("recuentos", recuentos), ("eventos", eventos), ("sensibilidad", sens)):
        with open(f"{RAIZ}/exportar/debate-rtve-2026-{nombre}.json", "w", encoding="utf-8") as fh:
            json.dump({"rows": filas, "meta": meta}, fh, ensure_ascii=False, indent=0)
        print(nombre, len(filas))


if __name__ == "__main__":
    main()
