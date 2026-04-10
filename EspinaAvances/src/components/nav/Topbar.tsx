import { LogOut, User } from 'lucide-react'

import { Button } from '../ui/Button'
import halfLogo from '../../assets/HalfLogo.png'

const NAV_ITEMS = ['Recibos', 'Asociados', 'Servicios', 'Inventario', 'Métricas'] as const

export function Topbar() {
  return (
    <header className="bg-slate-800 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
        <div className="flex items-center gap-70">
          <div className="flex h-14 w-15 items-center justify-center rounded-lg bg-white/10 text-xs font-semibold">
            <img src={halfLogo} alt="Logo" className="h-10 w-30 object-contain" />
          </div>
          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item === 'Inventario'
              return (
                <a
                  key={item}
                  href="#"
                  className={[
                    'rounded-full px-6 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-white/10 ring-1 ring-white/20'
                      : 'hover:bg-white/10',
                  ].join(' ')}
                >
                  {item}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm md:flex">
            <User className="h-4 w-4" />
            <span>Lupita</span>
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

