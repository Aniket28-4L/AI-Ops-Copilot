import Badge from '../ui/Badge'
import Card from '../ui/Card'
import { SkeletonStack } from '../ui/Skeleton'

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

export default function InsightPanel({ insights, loading }) {
  const tasks = insights?.tasks || []
  const memory = insights?.memory_context || []

  return (
    <div className="aoc-insightStack">
      <div className="aoc-insightTop">
        <div className="aoc-insightTitle">Insights</div>
        <div className="aoc-insightSub">Decision signals and memory trail</div>
      </div>

      <Card
        title="Intent"
        icon={<span className="aoc-dot aoc-dot--indigo" aria-hidden="true" />}
        className="aoc-card--glass"
      >
        {loading ? (
          <SkeletonStack />
        ) : (
          <div className="aoc-insightRow">
            <Badge tone={intentTone(insights?.intent)}>{insights?.intent || '—'}</Badge>
            <span className="aoc-muted">{insights?.memory_used ? 'Context-aware' : 'Cold start'}</span>
          </div>
        )}
      </Card>

      <Card
        title="Tasks"
        icon={<span className="aoc-dot aoc-dot--purple" aria-hidden="true" />}
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
        title="Priority"
        icon={<span className="aoc-dot aoc-dot--warn" aria-hidden="true" />}
      >
        {loading ? (
          <SkeletonStack />
        ) : (
          <div className="aoc-priority">
            <Badge tone={priorityTone(insights?.priority)}>{insights?.priority || '—'}</Badge>
            <div className="aoc-muted">
              {insights?.priority === 'high'
                ? 'Immediate attention recommended'
                : 'Standard monitoring'}
            </div>
          </div>
        )}
      </Card>

      <Card
        title="Memory Context"
        icon={<span className="aoc-dot aoc-dot--blue" aria-hidden="true" />}
        className="aoc-card--glass"
      >
        {loading ? (
          <SkeletonStack />
        ) : memory.length ? (
          <ul className="aoc-memoryList">
            {memory.map((m, idx) => (
              <li className="aoc-memoryItem" key={`${idx}-${m.slice(0, 12)}`}>
                <span className="aoc-memoryText">{m}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="aoc-muted">—</div>
        )}
      </Card>
    </div>
  )
}
