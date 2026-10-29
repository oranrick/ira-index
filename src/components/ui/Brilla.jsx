// IRA · Brilla: envuelve un texto (normalmente un título) con las estrellitas de la portada.
// Al pulsarlo salta un chispazo. Decorativo: no cambia el texto ni su semántica.
import { Chispas, chispazo } from './Chispas.jsx';

export default function Brilla({ children, tono = 'oro', cantidad = 3, tamano = [8, 14], semilla }) {
  const texto = semilla ?? (typeof children === 'string' ? children : '');
  return (
    <span className="ira-brilla" onClick={(ev) => chispazo(ev, tono, 8)}>
      {children}
      <Chispas tono={tono} semilla={texto || 'ira'} cantidad={cantidad} tamano={tamano} />
    </span>
  );
}
