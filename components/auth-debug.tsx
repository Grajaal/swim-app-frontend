'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/lib/store/use-auth-store'

export function AuthDebug() {
  const [hasCookie, setHasCookie] = useState(false)
  const [hasToken, setHasToken] = useState(false)
  const [tokenPreview, setTokenPreview] = useState('')
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    setHasCookie(document.cookie.includes('jwt='))
    const token = localStorage.getItem('jwt_token')
    setHasToken(!!token)
    setTokenPreview(token ? token.substring(0, 20) + '...' : '')
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded text-xs max-w-xs">
      <div className="font-bold mb-2">Auth Debug</div>
      <div>Has Cookie: {hasCookie ? '✅' : '❌'}</div>
      <div>Has Token: {hasToken ? '✅' : '❌'}</div>
      <div>Token Preview: {tokenPreview}</div>
      <div>User in Store: {user ? '✅' : '❌'}</div>
      <div>User Role: {user?.role || 'None'}</div>
    </div>
  )
} 