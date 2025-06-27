// Authentication utilities for client-side use

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  isVerified: boolean
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
  }
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export const setUser = (user: User): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}

export const logout = (): void => {
  removeToken()
  removeUser()
  window.location.href = '/login'
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

// API request helper with authentication
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
} 