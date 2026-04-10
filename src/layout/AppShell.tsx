import type { ReactNode } from 'react'

import { Topbar } from '../components/nav/Topbar'

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-sky-100">
      <Topbar />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

