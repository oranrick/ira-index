// IRA · /elecciones-29n · la campaña de las generales del 29-N, escuchada con P1 y P2.
// Sin nota IRA global: solo los dos parámetros cerrados de la Metodología 2.0 (P1 v1.1, P2 v1.0).
// Cada nota va con su margen (80 %). La nota de campaña junta los eventos de todas las piezas
// de una candidatura; nunca se promedian notas ni se ordena a nadie de mayor a menor.
import { useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import Traza from './ui/Traza.jsx';
import { CAMPANA, CANDIDATURAS, PIEZAS, REGLAS } from '../data/campana';
import { formatearPuntuacion, colorCifra } from '../lib/escala';
import { calcularP1, calcularP2, sumarRecuentos } from '../lib/margen';

const TXT = {
  es: {
    rotulo: 'Elecciones generales · 29 de noviembre de 2026',
    titulo: 'La campaña, escuchada',
    entradilla: 'Del 13 al 27 de noviembre, IRA escucha el mitin central de cada fin de semana y los debates a cuatro, y mide dos cosas: dónde pone cada candidatura la frontera del nosotros y contra quién apuntan sus metáforas.',
    faltan: (n) => (n === 1 ? 'Falta 1 día para que empiece la campaña.' : `Faltan ${n} días para que empiece la campaña.`),
    enCampana: (n) => `Día ${n} de campaña.`,
    reflexion: 'Hoy es jornada de reflexión.',
    votacion: 'Hoy se vota.',
    despues: 'La campaña terminó. Los análisis siguen aquí.',
    cinta: { inicio: 'Empieza la campaña', fin: 'Último mitin', reflexion: 'Reflexión', voto: 'Votación', hoy: 'hoy', dias: 'días' },
    candidaturasTitulo: 'Las candidaturas',
    candidaturasTexto: 'Las cuatro fuerzas más votadas en las generales de 2023. Ordenadas por apellido, sin ningún orden de mérito.',
    silencio: 'Sin mitin analizado todavía',
    primerMitin: 'Primer análisis a partir del 13 de noviembre',
    piezas: (n) => (n === 1 ? '1 mitin' : `${n} mítines`),
    p1Corto: 'Nosotros',
    p2Corto: 'Metáforas',
    queTitulo: 'Qué se mide',
    p1: { codigo: 'P1', nombre: 'La frontera del nosotros', texto: 'Dónde traza el discurso la línea entre «nosotros» y «ellos», y si esa línea es un muro o una puerta.', estado: 'Manual v1.1', ruta: '/metodologia/p1' },
    p2: { codigo: 'P2', nombre: 'El marco metafórico', texto: 'Con qué imágenes piensa el discurso el conflicto y contra quién apuntan. El dominio no decide; decide el blanco.', estado: 'Manual v1.0', ruta: '/metodologia/p2' },
    leer: 'Leer el método',
    sinNotaTitulo: 'Por qué no hay nota IRA',
    sinNota: 'La nota IRA reúne siete parámetros y en campaña solo se aplican dos. Dar una cifra global con dos sería inventarla. Por eso se publican P1 y P2 por separado, cada uno con su margen. Cuando cierren los demás, la campaña entera se recalculará y se publicará completa.',
    margenesTitulo: 'Las dos lecturas, con su margen',
    margenesTexto: 'El punto es la nota de campaña de cada candidatura: junta todos los eventos de sus piezas. La barra es su margen, el rango donde cae la nota con 4 de cada 5 probabilidades. Si dos barras se solapan, no hay diferencia clara entre esas dos candidaturas.',
    margenesVacio: 'Las barras aparecerán con el primer análisis.',
    eje: ['0 · muro', '5', '10 · puerta'],
    ejeP2: ['0 · polariza', '5', '10 · une'],
    margen: (a, b) => `de ${a} a ${b}`,
    sinPuntuar: 'sin puntuar',
    sinPuntuarNota: 'aún no llega al mínimo de eventos',
    piezasTitulo: 'Piezas analizadas',
    piezasTexto: 'Cada mitin y cada debate, con su nota, su margen y las frases que suman o restan.',
    piezasVacio: 'Todavía no hay piezas. La primera llegará el fin de semana del 14 y 15 de noviembre.',
    tipos: { mitin: 'Mitin', debate: 'Debate' },
    fuente: 'Transcripción',
    abre: 'abre', cierra: 'cierra',
    reglasTitulo: 'Las reglas',
    reglasTexto: 'Se fijaron antes del primer análisis y no cambian durante la campaña.',
    archivo: 'Los discursos analizados antes de la campaña, con la Metodología 1.0, siguen en el archivo.',
    archivoEnlace: 'Ir al archivo',
  },
  en: {
    rotulo: 'Spanish general election · 29 November 2026',
    titulo: 'The campaign, listened to',
    entradilla: 'From 13 to 27 November, IRA listens to each weekend’s main rally and to the four-way debates, and measures two things: where each candidate draws the boundary of "us" and who their metaphors are aimed at.',
    faltan: (n) => (n === 1 ? 'The campaign starts in 1 day.' : `The campaign starts in ${n} days.`),
    enCampana: (n) => `Campaign day ${n}.`,
    reflexion: 'Today is the day of reflection.',
    votacion: 'Today Spain votes.',
    despues: 'The campaign is over. The analyses remain here.',
    cinta: { inicio: 'Campaign starts', fin: 'Last rally', reflexion: 'Reflection', voto: 'Vote', hoy: 'today', dias: 'days' },
    candidaturasTitulo: 'The candidates',
    candidaturasTexto: 'The four most voted forces in the 2023 general election. Sorted by surname, in no order of merit.',
    silencio: 'No rally analyzed yet',
    primerMitin: 'First analysis from 13 November',
    piezas: (n) => (n === 1 ? '1 rally' : `${n} rallies`),
    p1Corto: 'Us',
    p2Corto: 'Metaphors',
    queTitulo: 'What is measured',
    p1: { codigo: 'P1', nombre: 'The boundary of "us"', texto: 'Where the speech draws the line between "us" and "them", and whether that line is a wall or a door.', estado: 'Manual v1.1', ruta: '/metodologia/p1' },
    p2: { codigo: 'P2', nombre: 'The metaphorical frame', texto: 'Which images the speech uses to think about conflict and who they are aimed at. The domain does not decide; the target does.', estado: 'Manual v1.0', ruta: '/metodologia/p2' },
    leer: 'Read the method',
    sinNotaTitulo: 'Why there is no IRA score',
    sinNota: 'The IRA score combines seven parameters and only two are applied during the campaign. A global figure built on two would be made up. So P1 and P2 are published separately, each with its margin. When the rest are closed, the whole campaign will be recalculated and published in full.',
    margenesTitulo: 'Both readings, with their margin',
    margenesTexto: 'The dot is each candidate’s campaign score: it pools every event from all their pieces. The bar is the margin, the range the score falls in with a 4-in-5 probability. If two bars overlap, there is no clear difference between those two candidates.',
    margenesVacio: 'The bars will appear with the first analysis.',
    eje: ['0 · wall', '5', '10 · door'],
    ejeP2: ['0 · polarizes', '5', '10 · unites'],
    margen: (a, b) => `${a} to ${b}`,
    sinPuntuar: 'not scored',
    sinPuntuarNota: 'not enough events yet',
    piezasTitulo: 'Pieces analyzed',
    piezasTexto: 'Every rally and every debate, with its score, its margin and the sentences that add or subtract.',
    piezasVacio: 'No pieces yet. The first will come on the weekend of 14 and 15 November.',
    tipos: { mitin: 'Rally', debate: 'Debate' },
    fuente: 'Transcript',
    abre: 'opens', cierra: 'closes',
    reglasTitulo: 'The rules',
    reglasTexto: 'Set before the first analysis. They do not change during the campaign.',
    archivo: 'Speeches analyzed before the campaign with Methodology 1.0 remain in the archive.',
    archivoEnlace: 'Go to the archive',
  },
};

const REGLAS_EN = [
  { titulo: 'Same quota', texto: 'Each candidate’s main rally every weekend, plus the debates where all four take part. In a debate, each candidate is measured only on their own turns.' },
  { titulo: 'Same kind of piece', texto: 'Rally with rally, debate with debate. Always the full transcript, never loose fragments.' },
  { titulo: 'Everything is published', texto: 'Everything analyzed is published, whether or not it matches expectations.' },
  { titulo: 'Method in plain sight', texto: 'Each analysis states which version of each parameter was used (P1 v1.1, P2 v1.0) and shows the sentences that add or subtract.' },
  { titulo: 'Every number with its margin', texto: 'Scores come with the range they fall in with a 4-in-5 probability. If two margins overlap, there is no clear difference. No one is ranked from top to bottom.' },
];

const DIA = 86400000;
const fecha = (iso) => new Date(`${iso}T12:00:00`);
const diasEntre = (a, b) => Math.round((b - a) / DIA);

function estadoHoy(t) {
  const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
  const inicio = fecha(CAMPANA.inicio); const fin = fecha(CAMPANA.fin);
  const refl = fecha(CAMPANA.reflexion); const voto = fecha(CAMPANA.votacion);
  if (hoy < inicio) return { texto: t.faltan(diasEntre(hoy, inicio)), hoy };
  if (hoy <= fin) return { texto: t.enCampana(diasEntre(inicio, hoy) + 1), hoy };
  if (+hoy === +refl) return { texto: t.reflexion, hoy };
  if (+hoy === +voto) return { texto: t.votacion, hoy };
  return { texto: t.despues, hoy };
}

// La cinta de la campaña: una marca por día, del inicio a la votación. Cada mitin analizado
// se posa en su día como un punto; todos en nieve, sin colores de partido.
function Cinta({ t, hoy, piezas }) {
  const inicio = fecha(CAMPANA.inicio); const voto = fecha(CAMPANA.votacion);
  const total = diasEntre(inicio, voto);
  const pos = (d) => `${(diasEntre(inicio, d) / total) * 100}%`;
  const dias = Array.from({ length: total + 1 }, (_, i) => new Date(inicio.getTime() + i * DIA));
  const hoyDentro = hoy >= inicio && hoy <= voto;
  const antes = hoy < inicio;
  return (
    <div className={`ira-cinta${antes ? ' ira-cinta--antes' : ''}`} aria-hidden="true">
      {antes && (
        <div className="ira-cinta__espera">
          <span className="ira-cinta__hoy-antes"><span>{t.cinta.hoy}</span></span>
          <span className="ira-cinta__faltan">{diasEntre(hoy, inicio)} {t.cinta.dias}</span>
        </div>
      )}
      <div className="ira-cinta__tramo">
      <div className="ira-cinta__pista">
        <span className="ira-cinta__campana" style={{ left: 0, width: pos(fecha(CAMPANA.fin)) }} />
        {dias.map((d, i) => (
          <span key={i} className={`ira-cinta__dia${d.getDay() === 0 || d.getDay() === 6 ? ' is-finde' : ''}`} style={{ left: pos(d) }} />
        ))}
        {piezas.map((p) => <span key={p.id} className="ira-cinta__pieza" style={{ left: pos(fecha(p.fecha)) }} />)}
        {hoyDentro && <span className="ira-cinta__hoy" style={{ left: pos(hoy) }}><span>{t.cinta.hoy}</span></span>}
      </div>
      <div className="ira-cinta__hitos">
        <span style={{ left: 0 }}><b>13</b> {t.cinta.inicio}</span>
        <span style={{ left: pos(fecha(CAMPANA.fin)) }} className="is-derecha"><b>27</b> {t.cinta.fin}</span>
        <span style={{ left: '100%' }} className="is-final"><b>29</b> {t.cinta.voto}</span>
      </div>
      </div>
    </div>
  );
}

const cifra = (v, lang, d = 1) => (v == null ? '' : v.toFixed(d).replace('.', lang === 'en' ? '.' : ','));

function Lectura({ etiqueta, r, lang, t }) {
  const valor = r?.nota;
  return (
    <p className="ira-campana__lectura">
      {valor == null
        ? <span className="ira-campana__lectura-n ira-campana__lectura-n--vacia" aria-label={lang === 'en' ? 'no data' : 'sin datos'} />
        : <span className="ira-campana__lectura-n" style={{ color: colorCifra(valor) }}>{formatearPuntuacion(valor, lang)}</span>}
      <span className="ira-campana__lectura-e">{etiqueta}</span>
      {r?.margen && <span className="ira-campana__lectura-m">{t.margen(cifra(r.margen[0], lang), cifra(r.margen[1], lang))}</span>}
      {r && r.nota == null && <span className="ira-campana__lectura-m">{t.sinPuntuar}</span>}
    </p>
  );
}

// Una regla 0-10 por parámetro, una fila por candidatura: punto (nota) y barra (margen).
// Mismo orden alfabético que la mesa. Sin colores de partido: el color es el de la escala.
function Margenes({ t, filas, lang }) {
  const hay = filas.some((f) => f.r1?.nota != null || f.r2?.nota != null);
  const panel = (clave, codigo, nombre, eje) => (
    <figure className="ira-margenes__panel" key={clave}>
      <figcaption className="ira-margenes__cab"><b>{codigo}</b> {nombre}</figcaption>
      <div className="ira-margenes__rejilla">
        {[0, 5, 10].map((x) => <span key={x} className="ira-margenes__guia" style={{ left: `${x * 10}%` }} />)}
      </div>
      <ul className="ira-margenes__filas">
        {filas.map((f) => {
          const r = f[clave];
          return (
            <li key={f.id} className="ira-margenes__fila">
              <span className="ira-margenes__quien">{f.nombre.split(' ').slice(-1)[0]}</span>
              <span className="ira-margenes__pista">
                {r?.nota != null ? (
                  <>
                    <span className="ira-margenes__banda" style={{ left: `${r.margen[0] * 10}%`, width: `${(r.margen[1] - r.margen[0]) * 10}%`, '--c': colorCifra(r.nota) }} />
                    <span className="ira-margenes__punto" style={{ left: `${r.nota * 10}%`, '--c': colorCifra(r.nota) }} />
                  </>
                ) : <span className="ira-margenes__vacia" />}
              </span>
              <span className="ira-margenes__valor">
                {r?.nota != null
                  ? <><b style={{ color: colorCifra(r.nota) }}>{cifra(r.nota, lang)}</b> <span>{t.margen(cifra(r.margen[0], lang), cifra(r.margen[1], lang))}</span></>
                  : <span className="ira-margenes__sin">{f.piezas.length ? t.sinPuntuar : '—'}</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="ira-margenes__eje" aria-hidden="true">{eje.map((e, i) => <span key={e} style={{ left: `${i * 50}%` }}>{e}</span>)}</div>
    </figure>
  );
  return (
    <>
      <div className="ira-margenes">
        {panel('r1', 'P1', t.p1.nombre, t.eje)}
        {panel('r2', 'P2', t.p2.nombre, t.ejeP2)}
      </div>
      {!hay && <p className="ira-campana__nota ira-campana__nota--pie">{t.margenesVacio}</p>}
    </>
  );
}

function Piezas({ t, piezas, lang }) {
  const nombre = Object.fromEntries(CANDIDATURAS.map((c) => [c.id, c]));
  if (!piezas.length) return <p className="ira-campana__nota ira-campana__nota--pie">{t.piezasVacio}</p>;
  const fechaCorta = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'en' ? 'en-GB' : 'es-ES', { day: 'numeric', month: 'long' });
  return (
    <ol className="ira-piezas">
      {[...piezas].sort((a, b) => b.fecha.localeCompare(a.fecha) || a.candidatura.localeCompare(b.candidatura)).map((p) => {
        const r1 = calcularP1(p.p1); const r2 = calcularP2(p.p2);
        return (
          <li key={p.id} className="ira-pieza">
            <p className="ira-pieza__meta"><span>{fechaCorta(p.fecha)}</span> · <span>{t.tipos[p.tipo] ?? p.tipo}</span>{p.lugar && <> · <span>{p.lugar}</span></>}</p>
            <h3 className="ira-pieza__quien">{nombre[p.candidatura]?.nombre} <span>{nombre[p.candidatura]?.formacion}</span></h3>
            {p.titulo && <p className="ira-pieza__titulo">{p.titulo}</p>}
            <div className="ira-pieza__lecturas">
              <Lectura etiqueta={`P1 · ${t.p1Corto}`} r={r1} lang={lang} t={t} />
              <Lectura etiqueta={`P2 · ${t.p2Corto}`} r={r2} lang={lang} t={t} />
            </div>
            {p.frases?.length > 0 && (
              <ul className="ira-pieza__frases">
                {p.frases.map((f) => (
                  <li key={f.texto} className={`is-${f.signo}`}><span className="ira-pieza__signo">{f.parametro} · {t[f.signo]}</span> «{f.texto}»</li>
                ))}
              </ul>
            )}
            {p.fuente && <a className="ira-campana__enlace" href={p.fuente} target="_blank" rel="noopener noreferrer">{t.fuente}</a>}
          </li>
        );
      })}
    </ol>
  );
}

export default function Campana() {
  const { lang } = useContext(AppContext);
  const t = TXT[lang] ?? TXT.es;
  const reglas = lang === 'en' ? REGLAS_EN : REGLAS.es;
  const { texto: hoyTexto, hoy } = useMemo(() => estadoHoy(t), [t]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filas = CANDIDATURAS.map((c) => {
    const suyas = PIEZAS.filter((p) => p.candidatura === c.id).sort((a, b) => a.fecha.localeCompare(b.fecha));
    // Nota de campaña: se suman los recuentos de todas sus piezas y se calcula una sola vez
    const r1 = suyas.length ? calcularP1(sumarRecuentos(suyas.map((p) => p.p1))) : null;
    const r2 = suyas.length ? calcularP2(sumarRecuentos(suyas.map((p) => p.p2))) : null;
    return { ...c, piezas: suyas, r1, r2 };
  });
  const todasConFoto = CANDIDATURAS.every((c) => c.foto);

  return (
    <div className="ira-campana">
      <header className="ira-campana__cab">
        <p className="ira-campana__rotulo">{t.rotulo}</p>
        <h1 className="ira-campana__titulo">{t.titulo}</h1>
        <p className="ira-campana__entradilla">{t.entradilla}</p>
        <p className="ira-campana__hoy">{hoyTexto}</p>
        <Cinta t={t} hoy={hoy} piezas={PIEZAS} />
      </header>

      <section className="ira-campana__seccion" aria-labelledby="ira-campana-cand">
        <h2 id="ira-campana-cand" className="ira-campana__h2">{t.candidaturasTitulo}</h2>
        <p className="ira-campana__nota">{t.candidaturasTexto}</p>
        <ul className="ira-campana__mesa">
          {filas.map((f) => (
            <li key={f.id} className="ira-campana__fila">
              {/* Mismo trato: o todas con foto o ninguna; si falta una, iniciales para todas */}
              {todasConFoto
                ? <img src={f.foto} alt="" className="ira-campana__foto" title={f.credito ?? undefined} loading="lazy" width="52" height="52" />
                : <span className="ira-campana__foto ira-campana__foto--inicial" aria-hidden="true">{[f.nombre.split(' ')[0], f.nombre.split(' ').slice(-1)[0]].map((w) => w[0]).join('')}</span>}
              <div className="ira-campana__quien">
                <p className="ira-campana__nombre">{f.nombre}</p>
                <p className="ira-campana__formacion">{f.formacion}</p>
              </div>
              <div className="ira-campana__onda">
                {f.piezas.length
                  ? <Traza notas={f.piezas.map((p) => calcularP1(p.p1).nota ?? 5)} semilla={f.id} alto={44} grosor={1.8} repetir />
                  : <span className="ira-campana__plana"><span className="ira-campana__latido" /></span>}
                <span className="ira-campana__estado">{f.piezas.length ? t.piezas(f.piezas.length) : t.silencio}</span>
              </div>
              <div className="ira-campana__lecturas">
                <Lectura etiqueta={`P1 · ${t.p1Corto}`} r={f.r1} lang={lang} t={t} />
                <Lectura etiqueta={`P2 · ${t.p2Corto}`} r={f.r2} lang={lang} t={t} />
              </div>
            </li>
          ))}
        </ul>
        {PIEZAS.length === 0 && <p className="ira-campana__nota ira-campana__nota--pie">{t.primerMitin}.</p>}
      </section>

      <section className="ira-campana__seccion" aria-labelledby="ira-campana-margen">
        <h2 id="ira-campana-margen" className="ira-campana__h2">{t.margenesTitulo}</h2>
        <p className="ira-campana__nota">{t.margenesTexto}</p>
        <Margenes t={t} filas={filas} lang={lang} />
      </section>

      <section className="ira-campana__seccion" aria-labelledby="ira-campana-piezas">
        <h2 id="ira-campana-piezas" className="ira-campana__h2">{t.piezasTitulo}</h2>
        <p className="ira-campana__nota">{t.piezasTexto}</p>
        <Piezas t={t} piezas={PIEZAS} lang={lang} />
      </section>

      <section className="ira-campana__seccion" aria-labelledby="ira-campana-que">
        <h2 id="ira-campana-que" className="ira-campana__h2">{t.queTitulo}</h2>
        <div className="ira-campana__params">
          {[t.p1, t.p2].map((p) => (
            <article key={p.codigo} className="ira-campana__param">
              <p className="ira-campana__param-cod">{p.codigo}<span>{p.estado}</span></p>
              <h3>{p.nombre}</h3>
              <p>{p.texto}</p>
              <Link to={p.ruta} className="ira-campana__enlace">{t.leer}</Link>
            </article>
          ))}
        </div>
        <div className="ira-campana__sinnota">
          <h3>{t.sinNotaTitulo}</h3>
          <p>{t.sinNota}</p>
        </div>
      </section>

      <section className="ira-campana__seccion" aria-labelledby="ira-campana-reglas">
        <h2 id="ira-campana-reglas" className="ira-campana__h2">{t.reglasTitulo}</h2>
        <p className="ira-campana__nota">{t.reglasTexto}</p>
        <ol className="ira-campana__reglas">
          {reglas.map((r) => (
            <li key={r.titulo}><b>{r.titulo}</b><span>{r.texto}</span></li>
          ))}
        </ol>
      </section>

      <p className="ira-campana__archivo">
        {t.archivo} <Link to="/politicos">{t.archivoEnlace}</Link>
      </p>
    </div>
  );
}
