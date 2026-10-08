// IRA · estrellita de cuatro puntas (marca de palabras polarizantes o empáticas)
export default function Estrella({ color, brillo, titila = false, tamano = 10, className = '', style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={tamano}
      height={tamano}
      aria-hidden="true"
      className={`ira-estrella${titila ? ' ira-estrella--titila' : ''} ${className}`}
      style={{ fill: color, filter: brillo ? `drop-shadow(0 0 3px ${brillo})` : undefined, flexShrink: 0, ...style }}
    >
      <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
    </svg>
  );
}
