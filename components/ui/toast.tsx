'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tone = 'default' | 'success' | 'warning' | 'error'

interface ToastItem {
  id: string
  message: string
  tone: Tone
  actionLabel?: string
  onAction?: () => void
}

interface ToastContextValue {
  toast: (
    message: string,
    opts?: { tone?: Tone; actionLabel?: string; onAction?: () => void; duration?: number },
  ) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toneIcon: Record<Tone, React.ReactNode> = {
  default: <Info className="size-4 text-primary" />,
  success: <CheckCircle2 className="size-4 text-success" />,
  warning: <AlertTriangle className="size-4 text-warning" />,
  error: <AlertTriangle className="size-4 text-destructive" />,
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const [mounted, setMounted] = useState(false)
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => setMounted(true), [])

  const dismiss = useCallback((id: string) => {
    setItems((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const toast = useCallback<ToastContextValue['toast']>((message, opts) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const item: ToastItem = {
      id,
      message,
      tone: opts?.tone ?? 'default',
      actionLabel: opts?.actionLabel,
      onAction: opts?.onAction,
    }
    setItems((list) => [...list.slice(-2), item])
    const timer = setTimeout(() => dismiss(id), opts?.duration ?? 4500)
    timers.current.set(id, timer)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 pb-24 sm:items-end sm:pb-4">
            {items.map((t) => (
              <div
                key={t.id}
                className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border bg-popover px-4 py-3 text-popover-foreground shadow-lg animate-in slide-in-from-bottom-4 fade-in duration-200"
              >
                {toneIcon[t.tone]}
                <p className="flex-1 text-sm">{t.message}</p>
                {t.actionLabel && (
                  <button
                    onClick={() => {
                      t.onAction?.()
                      dismiss(t.id)
                    }}
                    className="rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    {t.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => dismiss(t.id)}
                  aria-label="Dismiss"
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
