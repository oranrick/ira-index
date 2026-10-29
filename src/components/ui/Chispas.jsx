// IRA · chispas: los destellos de cuatro puntas de la portada, para toda la web.
// chispazo() lanza un estallido desde el punto pulsado; <Chispas> deja unas estrellitas
// titilando alrededor de un bloque (el padre necesita position: relative).
// Decorativo: aria-hidden y quieto con prefers-reduced-motion. Estilos en styles/destellos.css.
import Estrella from './Estrella.jsx';

export const quieto = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Colores de los destellos: [relleno, brillo] (los de la portada, más oro y neutro)
export const TONOS = {
  salvia: ['#B9D2AC', '#8DAA7E'],
  rojo: ['#E8604A', '#BE281A'],
  oro: ['#F4CF7A', '#DCB149'],
  neutra: ['#D5DEDE', '#7C8F8F'],
  alcance: ['#FFF8E8', '#EDE4CF'],
  interpelacion: ['#B9CCC9', '#6F8C88'],
  permeabilidad: ['#DCEBE6', '#A3C2B8'],
};

// Traduce los nombres de tono que usan las piezas a un tono de destello
export function tonoDe(clave) {
  if (!clave) return 'oro';
  if (TONOS[clave]) return clave;
  if (/^(incl|inclusivo|apertura|empatica|si|dentro|umbral|grupo)$/.test(clave)) return 'salvia';
  if (/^(cierre|contra|polariza|no|muro|expulsion|retirada)$/.test(clave)) return 'rojo';
  if (/^(neutra|tenue|situacional)$/.test(clave)) return 'neutra';
  return 'oro';
}

const PUNTA = 'M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z';

/** Lanza un estallido de destellos desde un punto (evento de puntero) o desde el centro de un nodo. */
export function chispazo(origen, tono = 'oro', cantidad = 9) {
  if (typeof document === 'undefined' || quieto()) return;
  // marca el clic como ya celebrado, para que el destello general de la web no lo repita
  const nativo = origen?.nativeEvent ?? origen;
  if (nativo && typeof nativo === 'object' && 'type' in nativo) nativo.__iraChispa = true;
  let x; let y;
  if (origen && 'clientX' in origen && (origen.clientX || origen.clientY)) { x = origen.clientX; y = origen.clientY; }
  else {
    const nodo = origen?.currentTarget ?? origen?.target ?? origen;
    const r = nodo?.getBoundingClientRect?.();
    if (!r) return;
    x = r.left + r.width / 2; y = r.top + r.height / 2;
  }
  const [relleno, brillo] = TONOS[tonoDe(tono)];
  const capa = document.createElement('div');
  capa.className = 'ira-chispazo';
  capa.setAttribute('aria-hidden', 'true');
  capa.style.left = `${x}px`;
  capa.style.top = `${y}px`;
  const giro = Math.random() * Math.PI * 2;
  for (let k = 0; k < cantidad; k++) {
    const ang = giro + (k / cantidad) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const dist = 26 + Math.random() * 34;
    const tam = 7 + Math.random() * 8;
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('width', String(tam));
    s.setAttribute('height', String(tam));
    s.style.setProperty('--dx', `${Math.cos(ang) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(ang) * dist}px`);
    s.style.setProperty('--giro', `${(Math.random() - 0.5) * 180}deg`);
    s.style.animationDelay = `${Math.random() * 60}ms`;
    s.style.fill = relleno;
    s.style.filter = `drop-shadow(0 0 4px ${brillo})`;
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', PUNTA);
    s.appendChild(p);
    capa.appendChild(s);
  }
  // un anillo que se abre, como las ondas del fondo
  const onda = document.createElement('span');
  onda.className = 'ira-chispazo__onda';
  onda.style.borderColor = brillo;
  capa.appendChild(onda);
  document.body.appendChild(capa);
  setTimeout(() => capa.remove(), 950);
}

/** Destellos que titilan alrededor de un bloque (el padre debe tener position: relative).
 *  Posiciones fijas para cada «semilla», repartidas por los bordes, como en la portada. */
export function Chispas({ tono = 'oro', semilla = '', cantidad = 3, tamano = [7, 12] }) {
  let h = 2166136261;
  const s = String(semilla) || 'ira';
  for (let k = 0; k < s.length; k++) h = Math.imul(h ^ s.charCodeAt(k), 16777619) >>> 0;
  const azar = () => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return h / 4294967296; };
  const [relleno, brillo] = TONOS[tonoDe(tono)];
  const bordes = ['arriba', 'derecha', 'abajo', 'izquierda'];
  return (
    <span className="ira-chispas" aria-hidden="true">
      {Array.from({ length: cantidad }, (_, k) => {
        const borde = bordes[(k + Math.floor(azar() * 4)) % 4];
        const a = Math.round(8 + azar() * 84);
        const pos = borde === 'arriba' ? { left: `${a}%`, top: '-6px' }
          : borde === 'abajo' ? { left: `${a}%`, top: 'calc(100% - 5px)' }
            : borde === 'izquierda' ? { left: '-6px', top: `${a}%` }
              : { left: 'calc(100% - 5px)', top: `${a}%` };
        const t = Math.round(tamano[0] + azar() * (tamano[1] - tamano[0]));
        return (
          <Estrella key={k} color={relleno} brillo={brillo} titila tamano={t} className="ira-chispas__una"
            style={{ ...pos, animationDelay: `${(-azar() * 2.4).toFixed(2)}s` }} />
        );
      })}
    </span>
  );
}

/** Destellos en cualquier clic de la web (botones, enlaces, pestañas…), salvo que la pieza
 *  ya haya lanzado los suyos. Se monta una vez, en el fondo de destellos. */
export function escucharClics() {
  if (typeof document === 'undefined') return () => {};
  const alClic = (ev) => {
    if (ev.__iraChispa) return;
    const objetivo = ev.target?.closest?.('button, a, [role="button"], [role="tab"], [role="radio"], summary, label');
    if (!objetivo || objetivo.closest('[data-sin-chispa]')) return;
    const tono = objetivo.closest('.ira-boton--principal') ? 'rojo' : 'oro';
    chispazo(ev.clientX || ev.clientY ? ev : objetivo, tono, 7);
  };
  document.addEventListener('click', alClic);
  return () => document.removeEventListener('click', alClic);
}
