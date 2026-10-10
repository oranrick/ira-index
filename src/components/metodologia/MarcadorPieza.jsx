// IRA · Metodología 2.0 · marcador de posición de una pieza interactiva (fase 3).
// Se sustituye por el componente de la pieza en la fase 4.
export default function MarcadorPieza({ etiqueta, texto, aviso, children }) {
  return (
    <div className="ira-met__marcador" role="note">
      <p className="ira-met__marcador-rotulo ira-cifra">{etiqueta}</p>
      <p className="ira-met__marcador-texto">{texto}</p>
      <p className="ira-met__marcador-estado">{aviso}</p>
      {children}
    </div>
  );
}
