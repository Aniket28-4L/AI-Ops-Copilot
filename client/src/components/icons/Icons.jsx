export function Icon({ children, size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function MenuIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M5 7h14M5 12h14M5 17h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function SparkIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M12 2l1.35 5.02L18 8.35l-4.65 1.33L12 15l-1.35-5.32L6 8.35l4.65-1.33L12 2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.78 2.9L22 16.7l-2.22.8L19 20l-.78-2.5L16 16.7l2.22-.8L19 13z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function DashboardIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M4 13.5c0-3.7 3.58-6.7 8-6.7s8 3 8 6.7c0 2.4-1.1 4.6-2.9 6.2a1.4 1.4 0 0 1-.94.36H8.84c-.35 0-.68-.13-.94-.36A8.15 8.15 0 0 1 4 13.5z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 12.3l3.2-2.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 14.7a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </Icon>
  )
}

export function ActivityIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M4 13h4l2-6 4 14 2-8h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

export function MemoryIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M8 7.2A3.2 3.2 0 0 1 11.2 4h1.6A3.2 3.2 0 0 1 16 7.2V10h1.1A1.9 1.9 0 0 1 19 11.9v5.2A2.9 2.9 0 0 1 16.1 20H7.9A2.9 2.9 0 0 1 5 17.1v-5.2A1.9 1.9 0 0 1 6.9 10H8V7.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 10V8.2c0-1.2 1-2.2 2.2-2.2h-.4c1.2 0 2.2 1 2.2 2.2V10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function TaskIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </Icon>
  )
}

export function ChatIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M5 6.8A3.8 3.8 0 0 1 8.8 3h6.4A3.8 3.8 0 0 1 19 6.8v4.4a3.8 3.8 0 0 1-3.8 3.8H10l-3.6 2.4c-.6.4-1.4-.03-1.4-.75V6.8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8 8.5h8M8 11.5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </Icon>
  )
}

export function PlusIcon(props) {
  return (
    <Icon {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Icon>
  )
}
