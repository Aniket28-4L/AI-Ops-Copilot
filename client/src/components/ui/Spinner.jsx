export default function Spinner({ size = 18, className = '' }) {
  return (
    <span
      className={`aoc-spinner ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  )
}

