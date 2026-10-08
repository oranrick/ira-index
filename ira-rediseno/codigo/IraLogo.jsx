// IRA · logo (variante Señal)
// Requiere copiar brand/ira-logo-sobre-oscuro.svg a public/brand/.
// conNombre: añade "Índice de Resonancia Afectiva" a continuación, alineado a la izquierda.

export default function IraLogo({ altura = 32, conNombre = false, href = '/' }) {
  return (
    <a
      href={href}
      aria-label={conNombre ? 'ira, Índice de Resonancia Afectiva, inicio' : 'ira, inicio'}
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 14, textDecoration: 'none' }}
    >
      {/* El SVG incluye las ondas por encima de la i, por eso es más alto que las letras */}
      <img src="/brand/ira-logo-sobre-oscuro.svg" alt="" style={{ height: altura * 1.09, width: 'auto', display: 'block' }} />
      {conNombre && (
        <span
          style={{
            fontFamily: 'var(--ira-font-texto)', fontSize: 14, lineHeight: 1,
            color: 'var(--ira-texto-2)', whiteSpace: 'nowrap', textAlign: 'left',
            paddingBottom: altura * 0.02,
          }}
        >
          Índice de Resonancia Afectiva
        </span>
      )}
    </a>
  );
}
