import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, onTyped }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages?.length])

  return (
    <div className="aoc-chatWindow">
      <div className="aoc-chatScroll">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} onTyped={onTyped} />
        ))}
        <div ref={endRef} />
      </div>
    </div>
  )
}

