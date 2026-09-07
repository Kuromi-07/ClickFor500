'use client'

import { useEffect } from 'react'
import { useStore } from '@/lib/store'

export function ThemeSync() {
  const { settings, ready } = useStore()

  useEffect(() => {
    if (!ready) return
    const root = document.documentElement
    const apply = () => {
      const system = window.matchMedia('(prefers-color-scheme: dark)').matches
      const dark = settings.theme === 'dark' || (settings.theme === 'system' && system)
      root.classList.toggle('dark', dark)
      root.classList.toggle('light', !dark)
    }
    apply()
    try {
      localStorage.setItem('sp-theme', settings.theme)
    } catch {}

    if (settings.theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }
  }, [settings.theme, ready])

  return null
}
