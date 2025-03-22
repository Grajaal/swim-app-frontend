import useSWR from 'swr'

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    credentials: 'include',
  })

  return res.json()
}

export function useUser() {
  const { data, error, isLoading } = useSWR(
    'http://localhost:4000/api/auth/validate',
    fetcher)

  return {
    isAuthenticated: data?.isAuthenticated,
    user: data?.user,
    error,
    isLoading,
  }
}