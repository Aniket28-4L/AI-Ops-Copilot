import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
})

export async function runAI({ userId, sessionId, input }) {
  const { data } = await api.post('/api/ai', { userId, sessionId, input })
  return data
}
