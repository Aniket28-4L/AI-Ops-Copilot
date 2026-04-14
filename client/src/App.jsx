import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/layout/Sidebar'
import ChatWindow from './components/chat/ChatWindow'
import InputBox from './components/chat/InputBox'
import InsightPanel from './components/insights/InsightPanel'
import { MenuIcon, SparkIcon } from './components/icons/Icons'
import { runAI } from './lib/api'

function nowId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function sessionTitleFrom(messages) {
  const firstUser = messages.find((m) => m.role === 'user' && m.content?.trim())
  if (!firstUser) return ''
  return firstUser.content.trim().slice(0, 36)
}

function sessionPreviewFrom(messages) {
  const last = [...messages].reverse().find((m) => m.content?.trim())
  if (!last) return ''
  return last.content.trim().replace(/\s+/g, ' ').slice(0, 44)
}

function composeAssistantMessage(ai) {
  const reply = ai?.reply?.trim()
  if (reply) return reply

  const lines = []
  if (ai?.intent) lines.push(`Intent: ${ai.intent}`)
  if (Array.isArray(ai?.tasks) && ai.tasks.length) {
    lines.push('', 'Planned tasks:')
    for (const t of ai.tasks) lines.push(`- ${t}`)
  }
  if (ai?.priority) lines.push('', `Priority: ${ai.priority}`)
  return lines.length ? lines.join('\n') : '—'
}

function sanitizeAssistantText(text) {
  const MAX_CHARS = 5000
  let t = String(text || '').split('\u0000').join('')

  t = t.replace(/(\b[^\s]{2,}\b)(?:\s+\1){4,}/gi, '$1 $1 $1')
  t = t.replace(
    /(\b[^\s]{2,}\b\s+\b[^\s]{2,}\b)(?:\s+\1){3,}/gi,
    '$1 $1',
  )
  t = t.replace(
    /(\b[^\s]{2,}\b\s+\b[^\s]{2,}\b\s+\b[^\s]{2,}\b)(?:\s+\1){2,}/gi,
    '$1',
  )

  if (t.length > MAX_CHARS) {
    const slice = t.slice(0, MAX_CHARS)
    const cut = Math.max(slice.lastIndexOf('\n\n'), slice.lastIndexOf('. '))
    const head = slice.slice(0, cut > 800 ? cut : MAX_CHARS)
    t = `${head.trimEnd()}\n\n… (truncated)`
  }

  return t.trim() || '—'
}

function loadSessions() {
  try {
    const raw = localStorage.getItem('aoc_sessions_v1')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem('aoc_sessions_v1', JSON.stringify(sessions))
  } catch {
    // ignore
  }
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const userId = import.meta.env.VITE_USER_ID || 'user1'

  const [sessions, setSessions] = useState(() => {
    const saved = loadSessions()
    if (saved?.length) return saved
    return [
      {
        id: 'chat1',
        title: 'New conversation',
        preview: 'Describe your business situation…',
        messages: [
          {
            id: nowId(),
            role: 'assistant',
            content:
              'Describe your business situation, and I’ll classify intent, plan tasks, and surface memory-aware insights.',
            status: 'done',
            animate: false,
          },
        ],
        insights: null,
        loading: false,
      },
    ]
  })

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = loadSessions()
    if (saved?.[0]?.id) return saved[0].id
    return 'chat1'
  })

  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) || sessions[0],
    [activeSessionId, sessions],
  )

  function updateSession(sessionId, updater) {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? updater(s) : s)),
    )
  }

  function newSession() {
    const id = `chat${sessions.length + 1}`
    setSessions((prev) => [
      {
        id,
        title: 'New conversation',
        preview: 'Describe your business situation…',
        messages: [],
        insights: null,
        loading: false,
      },
      ...prev,
    ])
    setActiveSessionId(id)
    setSidebarOpen(false)
  }

  async function sendMessage() {
    const text = (activeSession?.draft || '').trim()
    if (!text || activeSession?.loading) return

    const userMsg = { id: nowId(), role: 'user', content: text, status: 'done' }
    const aiMsgId = nowId()
    const aiMsg = { id: aiMsgId, role: 'assistant', content: '', status: 'typing', animate: false }

    updateSession(activeSession.id, (s) => {
      const nextMessages = [...s.messages, userMsg, aiMsg]
      return {
        ...s,
        messages: nextMessages,
        title: sessionTitleFrom(nextMessages) || s.title,
        preview: sessionPreviewFrom(nextMessages) || s.preview,
        draft: '',
        loading: true,
      }
    })

    try {
      const data = await runAI({ userId, sessionId: activeSession.id, input: text })
      if (!data?.success) throw new Error(data?.error || 'AI request failed')

      const assistantText = sanitizeAssistantText(composeAssistantMessage(data))
      updateSession(activeSession.id, (s) => {
        const nextMessages = s.messages.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: assistantText, status: 'done', animate: true }
            : m,
        )
        return {
          ...s,
          messages: nextMessages,
          preview: sessionPreviewFrom(nextMessages) || s.preview,
          insights: {
            intent: data.intent,
            tasks: data.tasks || [],
            priority: data.priority,
            memory_used: data.memory_used,
            memory_context: data.memory_context || [],
          },
          loading: false,
        }
      })
    } catch (e) {
      const errText = `Request failed: ${e?.message || 'Unknown error'}`
      updateSession(activeSession.id, (s) => {
        const nextMessages = s.messages.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: errText, status: 'done', animate: true }
            : m,
        )
        return {
          ...s,
          messages: nextMessages,
          preview: sessionPreviewFrom(nextMessages) || s.preview,
          loading: false,
        }
      })
    }
  }

  function clearTyped(messageId) {
    updateSession(activeSession.id, (s) => ({
      ...s,
      messages: s.messages.map((m) =>
        m.id === messageId ? { ...m, animate: false } : m,
      ),
    }))
  }

  return (
    <div className="aoc-app">
      <Sidebar
        isOpen={sidebarOpen}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionId}
        onNewSession={newSession}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="aoc-main aoc-center">
        <div className="aoc-topbar">
          <div className="aoc-topbarLeft">
            <button
              className="aoc-iconBtn aoc-onlyMobile"
              type="button"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
              <span className="aoc-visuallyHidden">Open menu</span>
            </button>
            <div className="aoc-topbarTitle">
              <div className="aoc-topbarBrand">
                <span className="aoc-topbarMark" aria-hidden="true">
                  <SparkIcon size={18} />
                </span>
                <div>
                  <div className="aoc-topbarH">AI Ops Copilot</div>
                  <div className="aoc-topbarS">Autonomous AI decision system</div>
                </div>
              </div>
            </div>
          </div>
          <div className="aoc-topbarRight">
            <span className="aoc-pill">User: {userId}</span>
            <span className="aoc-pill">Session: {activeSession?.id}</span>
          </div>
        </div>

        <ChatWindow messages={activeSession?.messages || []} onTyped={clearTyped} />

        <InputBox
          value={activeSession?.draft || ''}
          onChange={(v) => updateSession(activeSession.id, (s) => ({ ...s, draft: v }))}
          onSend={sendMessage}
          disabled={!activeSession || activeSession.loading || !(activeSession.draft || '').trim()}
        />
      </main>
      <aside className="aoc-insights">
        <InsightPanel insights={activeSession?.insights} loading={activeSession?.loading} />
      </aside>
    </div>
  )
}
