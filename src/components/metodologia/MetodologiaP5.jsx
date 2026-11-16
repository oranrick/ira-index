// IRA · /metodologia/p5 (Metodología 2.0, manual v0.1 cerrado). Contenido en textosP5.js.
// La página usa el armazón común de los manuales cerrados y le añade las piezas propias de P5
// (piezas/PiezasP5.jsx): la voz del otro dibujada como onda, de la cabecera a la fórmula.
import MetodologiaManual, { Acordeon, Codigo, Tabla } from './MetodologiaManual.jsx';
import { TEXTOS_P5 } from './textosP5.js';
import { PIEZAS_P5 } from './textosPiezasP5.js';
import { useLang } from './Juego.jsx';
import { Aparecer } from './Visuales.jsx';
import { AnatomiaEvento, BalanzaP5, DondeGolpea, EmblemaP5, GlifoVoz, VozAjena } from './piezas/PiezasP5.jsx';
import '../../styles/metodologia-piezas.css';
import '../../styles/metodologia-juego.css';
import '../../styles/metodologia-p5.css';

const MANUAL_URL = 'https://github.com/oranrick/ira-index/blob/main/research/manual/P5.md';
const TONOS = ['polariza', 'neutra', 'empatica'];

/** Secciones propias: sustituyen a la genérica del mismo id o añaden una nueva. */
function secciones(p, idioma) {
  return {
    'la-idea': (t) => (
      <>
        <Aparecer as="p" className="ira-p2-lema">
          <span>{t.idea.lema[0]}</span>
          <span className="ira-p2-lema__fuerte">{t.idea.lema[1]}</span>
        </Aparecer>
        <p className="ira-met__texto">{t.idea.texto}</p>
        <ul className="ira-p2-tres ira-p5-tres">
          {t.idea.tres.map((x, i) => (
            <Aparecer as="li" key={x.codigo} className={`ira-p2-tres__item ira-p2--${TONOS[i]}`} style={{ '--retardo': `${i * 80}ms` }}>
              <GlifoVoz tipo={x.codigo} titulo={p.glifos[x.codigo]} />
              <span className="ira-man-tres__cab">
                <span className="ira-p2-tres__nombre">{x.nombre}</span>
                <span className="ira-p2-codigo ira-cifra">{x.codigo}</span>
              </span>
              <span className="ira-p2-tres__texto">{x.texto}</span>
            </Aparecer>
          ))}
        </ul>
      </>
    ),

    'la-voz': () => <VozAjena t={p.voz} />,

    unidad: (t) => (
      <>
        <p className="ira-man-definicion">{t.unidad.definicion}</p>
        <AnatomiaEvento t={p.anatomia} />
        <ul className="ira-met__lista">{t.unidad.reglas.map((x) => <li key={x}>{x}</li>)}</ul>
      </>
    ),

    prueba: (t) => (
      <>
        <p className="ira-met__texto">{t.prueba.intro}</p>
        <p className="ira-p5-ayuda">{p.golpe.ayuda}</p>
        <DondeGolpea t={p.golpe} />
        <Acordeon titulo={p.golpe.tabla}>
          <Tabla
            cabecera={t.prueba.tabla.cabecera}
            filas={t.prueba.tabla.filas}
            clase="ira-man-tabla--contraste"
            render={(c, j) => (j === t.prueba.tabla.cabecera.length - 1 ? <Codigo codigo={c} signos={t.signos} /> : c)}
          />
        </Acordeon>
      </>
    ),

    formula: (t) => (
      <>
        <div className="ira-met__formula"><p className="ira-met__formula-linea ira-cifra">{t.formula.linea}</p></div>
        <ul className="ira-p2-leyenda">
          {t.formula.leyenda.map(([k, v, tono]) => (
            <li key={k} className={`ira-p2--${tono}`}><span className="ira-p2-leyenda__k ira-cifra">{k}</span><span>{v}</span></li>
          ))}
        </ul>
        <p className="ira-met__texto">{t.formula.explicacion}</p>
        <BalanzaP5
          t={p.balanza}
          idioma={idioma}
          presets={t.formula.tabla.filas.map(([nombre, Z, B, V]) => ({ nombre, Z: Number(Z), B: Number(B), V: Number(V) }))}
        />
        <h3 className="ira-met__h3">{t.formula.minimos.titulo}</h3>
        <ul className="ira-man-umbrales">
          {t.formula.minimos.filas.map(([n, r]) => (
            <li key={n}><span className="ira-man-umbrales__n ira-cifra">{n}</span><span>{r}</span></li>
          ))}
        </ul>
        <p className="ira-met__nota">{t.formula.minimos.nota}</p>
      </>
    ),
  };
}

export default function MetodologiaP5() {
  const idioma = useLang();
  const p = PIEZAS_P5[idioma];
  return (
    <MetodologiaManual
      textos={TEXTOS_P5}
      manualUrl={MANUAL_URL}
      clase="ira-met--p5"
      extra={secciones(p, idioma)}
      emblema={<EmblemaP5 codigo="P5" titulo={p.emblema} />}
      anterior={{ ruta: '/metodologia/p3', es: '← P3 · El juicio sobre el otro', en: '← P3 · Judging the other' }}
      siguiente={{ ruta: '/metodologia/p6', es: 'Siguiente: P6 · Lo que pide hacer', en: 'Next: P6 · What it calls for' }}
    />
  );
}
