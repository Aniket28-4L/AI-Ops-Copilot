import Spinner from './Spinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}) {
  const isDisabled = disabled || loading

  return (
    <button
      className={`aoc-button aoc-button--${variant} aoc-button--${size} ${className}`}
      disabled={isDisabled}
      {...props}
      onPointerMove={(e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        el.style.setProperty('--x', `${x}%`)
        el.style.setProperty('--y', `${y}%`)
        onPointerMove?.(e)
      }}
      onPointerLeave={(e) => {
        const el = e.currentTarget
        el.style.removeProperty('--x')
        el.style.removeProperty('--y')
        onPointerLeave?.(e)
      }}
    >
      <span className="aoc-buttonInner">
        {loading && <Spinner size={16} className="aoc-buttonSpinner" />}
        <span className="aoc-buttonLabel">{children}</span>
      </span>
    </button>
  )
}
