// IRA · ventana modal accesible
// Se cierra con X, clic fuera o Escape; el foco queda atrapado dentro mientras está abierta
// y vuelve al elemento que la abrió al cerrarse.
import { useEffect, useRef } from 'react';

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useAtraparFoco(activo, ref, onEscape) {
  useEffect(() => {
    if (!activo || !ref.current) return;
    const previo = document.activeElement;
    const nodo = ref.current;
    const primero = () => nodo.querySelectorAll(ENFOCABLES)[0];
    (nodo.querySelector('[data-autofocus]') ?? primero() ?? nodo).focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onEscape?.(); return; }
      if (e.key !== 'Tab') return;
      const lista = [...nodo.querySelectorAll(ENFOCABLES)].filter((el) => el.offsetParent !== null);
      if (!lista.length) { e.preventDefault(); return; }
      const ini = lista[0], fin = lista[lista.length - 1];
      if (e.shiftKey && document.activeElement === ini) { e.preventDefault(); fin.focus(); }
      else if (!e.shiftKey && document.activeElement === fin) { e.preventDefault(); ini.focus(); }
    };
    document.addEventListener('keydown', onKey, true);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.body.style.overflow = overflow;
      if (previo && typeof previo.focus === 'function') previo.focus();
    };
    // onEscape cambia en cada render; el efecto solo depende de si está abierta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo]);
}

export default function Ventana({ abierta, onCerrar, tituloId, ancho = 560, children }) {
  const ref = useRef(null);
  useAtraparFoco(abierta, ref, onCerrar);
  if (!abierta) return null;
  return (
    <div className="ira-ventana__fondo" onClick={onCerrar}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        tabIndex={-1}
        className="ira-ventana"
        style={{ maxWidth: ancho }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function BotonCerrar({ onClick, etiqueta = 'Cerrar' }) {
  return (
    <button type="button" className="ira-boton ira-boton--secundario ira-boton--icono" aria-label={etiqueta} onClick={onClick}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round' }}>
        <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );
}
