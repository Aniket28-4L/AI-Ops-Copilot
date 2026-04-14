import { useMemo, useState } from 'react'
import { runAI } from '../lib/api'
import { MenuIcon, TaskIcon } from '../components/icons/Icons'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { SkeletonStack } from '../components/ui/Skeleton'

function priorityTone(priority) {
  if (priority === 'high') return 'danger'
  if (priority === 'normal') return 'info'
  return 'neutral'
}

function intentTone(intent) {
  if (!intent) return 'neutral'
  const map = {
    complaint: 'danger',
    inquiry: 'info',
    request: 'info',
    support: 'info',
  }
  return map[intent] || 'neutral'
}

function normalizeList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return [value]
}

export default function Dashboard({ onOpenSidebar }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const sessionId = import.meta.env.VITE_SESSION_ID || 'user1'
  const reveal = result && !loading ? 'aoc-fadeUp' : ''

  const canRun = input.trim().length > 0 && !loading

  const tasks = useMemo(() => normalizeList(result?.tasks), [result])
  const memoryContext = useMemo(
    () => normalizeList(result?.memory_context),
    [result],
  )

  async function handleRun() {
    if (!canRun) return
    setLoading(true)
    setError('')
    try {
      const data = await runAI({ sessionId, input: input.trim() })
      if (!data?.success) {
        throw new Error(data?.error || 'AI request failed')
      }
      setResult(data)
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="aoc-container">
      <div className="aoc-top">
        <div className="aoc-topLeft">
          <button
            className="aoc-iconBtn aoc-onlyMobile"
            type="button"
            onClick={onOpenSidebar}
          >
            <MenuIcon />
            <span className="aoc-visuallyHidden">Open menu</span>
          </button>
          <div>
            <h1 className="aoc-title">AI Operations Dashboard</h1>
            <p className="aoc-subtitle">Autonomous AI decision system</p>
          </div>
        </div>
        <div className="aoc-topRight">
          <div className="aoc-pills">
            <span className="aoc-pill">Session: {sessionId}</span>
            <span className="aoc-pill">POST /api/ai</span>
          </div>
        </div>
      </div>

      <div className="aoc-grid">
        <Card
          title="Run scenario"
          icon={<TaskIcon />}
          className="aoc-card--input"
          action={
            <span className="aoc-hint" role="note">
              Ctrl + Enter
            </span>
          }
        >
          <div className="aoc-inputWrap">
            <textarea
              className="aoc-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun()
              }}
              placeholder="Describe your business situation..."
              rows={6}
              spellCheck="false"
            />
            {error && (
              <div className="aoc-error" role="alert">
                {error}
              </div>
            )}
            <div className="aoc-inputFooter">
              <div className="aoc-faint">
                The system will classify intent, plan tasks, execute actions, and use memory.
              </div>
              <Button loading={loading} onClick={handleRun} disabled={!canRun}>
                Run AI
              </Button>
            </div>
          </div>
        </Card>

        <div className="aoc-stack">
          <Card
            title="Intent"
            icon={<span className="aoc-dot aoc-dot--indigo" aria-hidden="true" />}
            className={reveal}
          >
            {loading ? (
              <SkeletonStack />
            ) : (
              <div className="aoc-row">
                <Badge tone={intentTone(result?.intent)}>
                  {result?.intent || '—'}
                </Badge>
                <span className="aoc-muted">
                  {result?.memory_used ? 'Context-aware' : 'No memory used'}
                </span>
              </div>
            )}
          </Card>

          <Card
            title="Priority"
            icon={<span className="aoc-dot aoc-dot--warn" aria-hidden="true" />}
            className={reveal}
          >
            {loading ? (
              <SkeletonStack />
            ) : (
              <div className="aoc-priority">
                <Badge tone={priorityTone(result?.priority)}>
                  {result?.priority || '—'}
                </Badge>
                <div className="aoc-muted">
                  {result?.priority === 'high'
                    ? 'Immediate attention recommended'
                    : 'Standard monitoring'}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <div className="aoc-section">
        <div className="aoc-grid aoc-grid--bottom">
          <Card
            title="Tasks"
            icon={<span className="aoc-dot aoc-dot--purple" aria-hidden="true" />}
            className={reveal}
          >
            {loading ? (
              <SkeletonStack />
            ) : tasks.length ? (
              <ul className="aoc-taskList">
                {tasks.map((t, idx) => (
                  <li className="aoc-taskItem" key={`${t}-${idx}`}>
                    <span className="aoc-taskBullet" aria-hidden="true" />
                    <span className="aoc-taskText">{t}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="aoc-muted">—</div>
            )}
          </Card>

          <Card
            title="Memory Context"
            icon={<span className="aoc-dot aoc-dot--blue" aria-hidden="true" />}
            className={`aoc-card--glass ${reveal}`}
          >
            {loading ? (
              <SkeletonStack />
            ) : memoryContext.length ? (
              <div className="aoc-memory">
                <div className="aoc-row aoc-row--space">
                  <Badge tone={result?.memory_used ? 'info' : 'neutral'}>
                    {result?.memory_used ? 'Used' : 'Not used'}
                  </Badge>
                  <span className="aoc-muted">{memoryContext.length} items</span>
                </div>
                <ul className="aoc-memoryList">
                  {memoryContext.map((m, idx) => (
                    <li className="aoc-memoryItem" key={`${idx}-${m.slice(0, 12)}`}>
                      <span className="aoc-memoryText">{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="aoc-muted">—</div>
            )}
          </Card>
        </div>

        <Card
          title="AI Response"
          icon={<span className="aoc-dot aoc-dot--indigo" aria-hidden="true" />}
          className={`aoc-card--reply ${reveal}`}
        >
          {loading ? (
            <SkeletonStack />
          ) : (
            <div className="aoc-reply">
              <div className="aoc-replyMeta">
                <span className="aoc-pill aoc-pill--soft">
                  Reply {result?.reply ? 'generated' : 'not generated'}
                </span>
                <span className="aoc-pill aoc-pill--soft">
                  Intent: {result?.intent || '—'}
                </span>
              </div>
              <pre className="aoc-replyText">
                {result?.reply?.trim() ? result.reply.trim() : '—'}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
