export function SkeletonLine({ w = '100%', h = 12, className = '' }) {
  return (
    <div
      className={`aoc-skeleton ${className}`}
      style={{ width: w, height: h }}
      aria-hidden="true"
    />
  )
}

export function SkeletonStack() {
  return (
    <div className="aoc-skeletonStack" aria-hidden="true">
      <SkeletonLine w="55%" />
      <SkeletonLine w="92%" />
      <SkeletonLine w="86%" />
      <SkeletonLine w="62%" />
    </div>
  )
}

