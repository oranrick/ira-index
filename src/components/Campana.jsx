// IRA · /elecciones-29n · la campaña de las generales del 29-N, escuchada con P1 y P2.
// Sin nota IRA global: solo los dos parámetros cerrados o casi cerrados de la Metodología 2.0.
import { useContext, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App.jsx';
import Traza from './ui/Traza.jsx';
import { CAMPANA, CANDIDATURAS, PIEZAS, REGLAS } from '../data/campana';
import { formatearPuntuacion } from '../lib/escala';

const TXT = {
  es: {
    rotulo: 'Elecciones generales · 29 de noviembre de 2026',
    titulo: 'La campaña, escuchada',
    entradilla: 'Del 13 al 27 de noviembre, IRA escucha cada semana un mitin de cada candidatura y mide dos cosas: dónde pone la frontera del nosotros y contra quién apuntan sus metáforas.',
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
    p2: { codigo: 'P2', nombre: 'El marco metafórico', texto: 'Con qué imágenes piensa el discurso el conflicto y contra quién apuntan. El dominio no decide; decide el blanco.', estado: 'Se cierra antes del 13 de noviembre', ruta: '/metodologia/p2' },
    leer: 'Leer el método',
    sinNotaTitulo: 'Por qué no hay nota IRA',
    sinNota: 'La nota IRA reúne siete parámetros y la Metodología 2.0 tiene, de momento, dos. Dar una cifra global mezclando métodos sería inventarla. Por eso en campaña solo se publican P1 y P2, que ya pesan el 40 % de la fórmula. Cuando cierren los demás, la campaña entera se recalculará y se publicará completa.',
    reglasTitulo: 'Las reglas',
    reglasTexto: 'Se fijaron antes del primer análisis y no cambian durante la campaña.',
    archivo: 'Los discursos analizados antes de la campaña, con el método de 2024, siguen en el archivo.',
    archivoEnlace: 'Ir al archivo',
  },
  en: {
    rotulo: 'Spanish general election · 29 November 2026',
    titulo: 'The campaign, listened to',
    entradilla: 'From 13 to 27 November, IRA listens to one rally per candidate each week and measures two things: where the boundary of "us" is drawn and who the metaphors are aimed at.',
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
    p2: { codigo: 'P2', nombre: 'The metaphorical frame', texto: 'Which images the speech uses to think about conflict and who they are aimed at. The domain does not decide; the target does.', estado: 'Closes before 13 November', ruta: '/metodologia/p2' },
    leer: 'Read the method (in Spanish)',
    sinNotaTitulo: 'Why there is no IRA score',
    sinNota: 'The IRA score combines seven parameters and Methodology 2.0 has two so far. A global figure mixing methods would be made up. So during the campaign only P1 and P2 are published, which already weigh 40% of the formula. When the rest are closed, the whole campaign will be recalculated and published in full.',
    reglasTitulo: 'The rules',
    reglasTexto: 'Set before the first analysis. They do not change during the campaign.',
    archivo: 'Speeches analyzed before the campaign, with the 2024 method, remain in the archive.',
    archivoEnlace: 'Go to the archive',
  },
};

const REGLAS_EN = [
  { titulo: 'Same quota', texto: 'One rally per candidate per week, chosen with the same criterion: the main event of the weekend.' },
  { titulo: 'Same kind of piece', texto: 'Rally with rally, debate with debate. Always the full transcript, never loose fragments.' },
  { titulo: 'Everything is published', texto: 'Everything analyzed is published, whether or not it matches expectations.' },
  { titulo: 'Method in plain sight', texto: 'Each analysis states which version of each parameter was used and shows the sentences that add or subtract.' },
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

function Lectura({ etiqueta, valor, lang }) {
  return (
    <p className="ira-campana__lectura">
      {valor == null
        ? <span className="ira-campana__lectura-n ira-campana__lectura-n--vacia" aria-label="sin datos" />
        : <span className="ira-campana__lectura-n">{formatearPuntuacion(valor, lang)}</span>}
      <span className="ira-campana__lectura-e">{etiqueta}</span>
    </p>
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
    const media = (k) => (suyas.length ? suyas.reduce((s, p) => s + p[k], 0) / suyas.length : null);
    return { ...c, piezas: suyas, p1: media('p1'), p2: media('p2') };
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
                  ? <Traza notas={f.piezas.flatMap((p) => p.fragmentos?.map((x) => x.p1 ?? p.p1) ?? [p.p1])} semilla={f.id} alto={44} grosor={1.8} repetir />
                  : <span className="ira-campana__plana"><span className="ira-campana__latido" /></span>}
                <span className="ira-campana__estado">{f.piezas.length ? t.piezas(f.piezas.length) : t.silencio}</span>
              </div>
              <div className="ira-campana__lecturas">
                <Lectura etiqueta={`P1 · ${t.p1Corto}`} valor={f.p1} lang={lang} />
                <Lectura etiqueta={`P2 · ${t.p2Corto}`} valor={f.p2} lang={lang} />
              </div>
            </li>
          ))}
        </ul>
        {PIEZAS.length === 0 && <p className="ira-campana__nota ira-campana__nota--pie">{t.primerMitin}.</p>}
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
