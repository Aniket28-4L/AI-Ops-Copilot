import { ChatIcon, PlusIcon, SparkIcon } from '../icons/Icons'

export default function Sidebar({
  isOpen,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onClose,
}) {
  return (
    <>
      <div
        className={`aoc-sidebarBackdrop ${isOpen ? 'isOpen' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside className={`aoc-sidebar ${isOpen ? 'isOpen' : ''}`}>
        <div className="aoc-sidebarTop">
          <div className="aoc-brand">
            <div className="aoc-brandMark">
              <SparkIcon size={18} />
            </div>
            <div className="aoc-brandText">
              <div className="aoc-brandName">AI Ops Copilot</div>
              <div className="aoc-brandTag">Autonomous operations</div>
            </div>
          </div>
          <button className="aoc-newChat" type="button" onClick={onNewSession}>
            <span className="aoc-newChatIcon" aria-hidden="true">
              <PlusIcon size={18} />
            </span>
            <span className="aoc-newChatLabel">New chat</span>
            <span className="aoc-newChatGlow" aria-hidden="true" />
          </button>
        </div>

        <nav className="aoc-chatList" aria-label="Conversations">
          {sessions.map((s) => {
            const selected = s.id === activeSessionId
            return (
              <button
                key={s.id}
                className={`aoc-chatItem ${selected ? 'isActive' : ''}`}
                onClick={() => {
                  onSelectSession(s.id)
                  onClose()
                }}
                type="button"
              >
                <span className="aoc-chatIcon" aria-hidden="true">
                  <ChatIcon />
                </span>
                <span className="aoc-chatText">
                  <span className="aoc-chatTitle">{s.title || s.id}</span>
                  <span className="aoc-chatPreview">{s.preview || '—'}</span>
                </span>
                <span className="aoc-chatGlow" aria-hidden="true" />
              </button>
            )
          })}
        </nav>

        <div className="aoc-sidebarBottom">
          <div className="aoc-sideMeta">
            <div className="aoc-sideMetaLabel">API</div>
            <div className="aoc-sideMetaValue">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}
            </div>
          </div>
          <div className="aoc-sideMeta">
            <div className="aoc-sideMetaLabel">User</div>
            <div className="aoc-sideMetaValue">{import.meta.env.VITE_USER_ID || 'user1'}</div>
          </div>
        </div>
      </aside>
    </>
  )
}
