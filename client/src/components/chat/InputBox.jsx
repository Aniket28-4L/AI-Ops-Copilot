import { useEffect, useRef } from 'react'
import Button from '../ui/Button'

export default function InputBox({ value, onChange, onSend, disabled }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = '0px'
    const next = Math.min(el.scrollHeight, 180)
    el.style.height = `${next}px`
  }, [value])

  return (
    <div className="aoc-composer">
      <div className="aoc-composerInner">
        <textarea
          ref={ref}
          className="aoc-composerInput"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your business situation..."
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSend()
          }}
          spellCheck="false"
        />
        <div className="aoc-composerActions">
          <div className="aoc-composerHint">Ctrl + Enter</div>
          <Button disabled={disabled} onClick={onSend}>
            Run AI
          </Button>
        </div>
      </div>
    </div>
  )
}

