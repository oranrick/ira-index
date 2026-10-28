"""IRA · P2 El marco metafórico · borrador v0.1 · cálculo y ficha.

Lee la tabla de eventos metafóricos ya clasificada (ver manual/P2.md) y escribe la ficha:
nota, solidez, recuento por resultado y por dominio, densidad y dominio dominante.

Uso:  python calcular_p2.py datos/p2/<id>_eventos.csv textos/<id>.txt fichas/p2/<id>.md "Título"

Columnas que usa: dominio, resultado (P polariza, N neutra, E empática), excepcion (si/no),
fragmento, oracion. La IA o el codificador clasifican; este script solo calcula.
"""
import csv
import sys
from collections import Counter

VERSION = "P2 borrador v0.2 (2026-10-27)"
MINIMO = 3          # eventos con signo (E + P)
SOLIDA_DESDE = 6    # de 3 a 5, orientativa
NOMBRES = {"P": "polarizan", "N": "neutras", "E": "empáticas"}


def num(x, d=2):
    return f"{x:.{d}f}".replace(".", ",")


def main(eventos_csv, texto, salida, titulo):
    filas = list(csv.DictReader(open(eventos_csv, encoding="utf-8")))
    palabras = len(open(texto, encoding="utf-8").read().split())
    cuenta = Counter(f["resultado"] for f in filas)
    E, P, N = cuenta["E"], cuenta["P"], cuenta["N"]
    con_signo = E + P
    dominios = Counter(f["dominio"] for f in filas)
    dominante, n_dom = dominios.most_common(1)[0] if dominios else ("-", 0)
    densidad = 1000 * len(filas) / palabras if palabras else 0
    excepciones = [f for f in filas if f.get("excepcion", "").strip().lower() == "si"]

    lineas = [f"# {titulo}", ""]
    if con_signo < MINIMO:
        lineas.append(f"**P2 sin puntuar**: {con_signo} eventos con signo (mínimo {MINIMO}).")
    else:
        nota = 10 * (E + 1) / (E + P + 2)
        solidez = "sólida" if con_signo >= SOLIDA_DESDE else "orientativa"
        lineas.append(f"**P2 = {num(nota)}** · solidez: {solidez} ({con_signo} eventos con signo)")
        lineas.append("")
        lineas.append(f"Cálculo: 10 × (E + 1) / (E + P + 2) = 10 × ({E} + 1) / ({E} + {P} + 2) = **{num(nota)}**")
    lineas += [
        "",
        f"- Empáticas (E): {E}",
        f"- Polarizan (P): {P}",
        f"- Neutras (N, no entran en la nota): {N}",
        "",
        f"Descriptivo: {len(filas)} eventos en {palabras} palabras, **{num(densidad, 1)} por mil**. "
        f"Dominio dominante: **{dominante}** ({n_dom} eventos).",
        "",
        "Por dominio: " + ", ".join(f"{d} {n}" for d, n in dominios.most_common()),
        "",
    ]
    if excepciones:
        lineas.append("**Excepción democrática aplicada** (el IRA no verifica estas acusaciones):")
        for f in excepciones:
            aviso = " · había metáforas mejores a mano" if f["dominio"] in ("ANI", "INM") else ""
            lineas.append(f"- Oración {f['oracion']}: «{f['fragmento']}»{aviso}")
        lineas.append("")
    for clave in ("P", "E"):
        sel = [f for f in filas if f["resultado"] == clave]
        if sel:
            lineas.append(f"**Eventos que {'polarizan' if clave == 'P' else 'son empáticos'}**")
            for f in sel:
                lineas.append(f"- {f['oracion']} · {f['dominio']} · «{f['fragmento']}»")
            lineas.append("")
    lineas.append(f"_{VERSION}_")
    open(salida, "w", encoding="utf-8").write("\n".join(lineas) + "\n")
    print("\n".join(lineas))


if __name__ == "__main__":
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    main(*sys.argv[1:])
