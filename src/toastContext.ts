import { createContext } from 'react'
import type { ToastKind } from './types'

export interface ToastContextValue {
  showToast: (kind: ToastKind, message: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
