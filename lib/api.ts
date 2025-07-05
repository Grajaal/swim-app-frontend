export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Función para obtener el token del localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('jwt_token')
  }
  return null
}

// Función para crear headers con autenticación
const getAuthHeaders = () => {
  const headers: Record<string, string> = {}
  const token = getAuthToken()

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

export const fetcher = (endpoint: string) =>
  fetch(`${API_URL}${endpoint}`, {
    credentials: 'include', // Para cookies
    headers: getAuthHeaders() // Para Authorization header
  }).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetcherTest = async (endpoint: string) => {
  await sleep(3000)

  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: getAuthHeaders()
  })

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

// Función para hacer requests con diferentes métodos
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...getAuthHeaders()
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: 'include',
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    ...options
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}

// Función para limpiar autenticación
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt_token')
  }
}
