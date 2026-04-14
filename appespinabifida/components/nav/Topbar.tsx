'use client'

import { LogOut, User } from 'lucide-react'
import Link from 'next/link'

import { Button } from '../ui/Button'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/asociados', label: 'Asociados' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/inventory', label: 'Inventario' },
] as const

export function Topbar() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-3 px-4">
        <div className="flex items-center gap-7">
          <div className="flex h-14 w-15 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold">
            <span className="text-sm font-bold">EB</span>
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-6 py-2 text-sm font-medium transition hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm md:flex">
            <User className="h-4 w-4" />
            <span>Usuario</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<LogOut className="h-4 w-4" />}
            onClick={() => {}}
          >
            Salir
          </Button>
        </div>
      </div>
    </header>
  )
}
