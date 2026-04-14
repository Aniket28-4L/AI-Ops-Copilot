export default function Badge({ tone = 'neutral', children, className = '' }) {
  return <span className={`aoc-badge aoc-badge--${tone} ${className}`}>{children}</span>
}

