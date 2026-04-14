export default function Card({
  title,
  icon,
  action,
  children,
  className = '',
}) {
  return (
    <section className={`aoc-card ${className}`}>
      {(title || action) && (
        <header className="aoc-cardHeader">
          <div className="aoc-cardHeaderLeft">
            {icon && <span className="aoc-cardIcon">{icon}</span>}
            {title && <h3 className="aoc-cardTitle">{title}</h3>}
          </div>
          {action && <div className="aoc-cardHeaderRight">{action}</div>}
        </header>
      )}
      <div className="aoc-cardBody">{children}</div>
    </section>
  )
}

