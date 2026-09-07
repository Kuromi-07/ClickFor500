'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  tone?: 'default' | 'destructive'
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null)
  const resolver = useRef<((v: boolean) => void) | null>(null)

  const confirm = useCallback<ConfirmFn>((options) => {
    setOpts(options)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
    })
  }, [])

  const close = (value: boolean) => {
    resolver.current?.(value)
    resolver.current = null
    setOpts(null)
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!opts}
        onClose={() => close(false)}
        title={opts?.title}
        description={opts?.description}
        size="sm"
        footer={
          <>
            <Button variant="outline" size="lg" onClick={() => close(false)}>
              {opts?.cancelText ?? 'Cancel'}
            </Button>
            <Button
              size="lg"
              variant={opts?.tone === 'destructive' ? 'destructive' : 'default'}
              onClick={() => close(true)}
            >
              {opts?.confirmText ?? 'Confirm'}
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          {opts?.tone === 'destructive'
            ? 'This action cannot be undone.'
            : 'Please confirm you want to continue.'}
        </p>
      </Modal>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
