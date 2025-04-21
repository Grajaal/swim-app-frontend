export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const fetcher = (endpoint: string) =>
  fetch(`${API_URL}${endpoint}`, {
    credentials: 'include'
  }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetcherTest = async (endpoint: string) => {
  await sleep(3000)

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include'
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}
