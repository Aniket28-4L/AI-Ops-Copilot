import { useEffect, useMemo, useRef, useState } from 'react'

function useTypewriter({ text, enabled, speed = 14, onDone }) {
  const [out, setOut] = useState('')
  const rafRef = useRef(0)
  const idxRef = useRef(0)
  const lastRef = useRef(0)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!enabled) return
    idxRef.current = 0
    lastRef.current = 0

    function tick(ts) {
      if (!lastRef.current) lastRef.current = ts
      const delta = ts - lastRef.current
      if (delta >= speed) {
        lastRef.current = ts
        if (idxRef.current === 0) setOut('')
        idxRef.current = Math.min(idxRef.current + 2, text.length)
        setOut(text.slice(0, idxRef.current))
        if (idxRef.current >= text.length) {
          onDoneRef.current?.()
          return
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [enabled, speed, text])

  return enabled ? out : text
}

export default function MessageBubble({ message, onTyped }) {
  const isUser = message.role === 'user'
  const [expanded, setExpanded] = useState(false)

  const content = useMemo(() => message.content || '', [message.content])
  const typed = useTypewriter({
    text: content,
    enabled: Boolean(message.animate) && !isUser && message.status !== 'typing',
    onDone: () => onTyped?.(message.id),
  })

  const display = message.animate && !isUser ? typed : content
  const isLong = !isUser && message.status === 'done' && content.length > 1200
  const clamp = isLong && !expanded

  return (
    <div className={`aoc-msgRow ${isUser ? 'isUser' : 'isAI'}`}>
      <div className={`aoc-msg ${isUser ? 'isUser' : 'isAI'} aoc-fadeUp`}>
        {message.status === 'typing' ? (
          <div className="aoc-typing" aria-label="AI is typing">
            <span />
            <span />
            <span />
          </div>
        ) : (
          <div className="aoc-msgContent">
            <div className={`aoc-msgText ${clamp ? 'aoc-msgClamp' : ''}`}>{display}</div>
            {clamp && <div className="aoc-msgFade" aria-hidden="true" />}
            {isLong && (
              <button
                className="aoc-msgMore"
                type="button"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
