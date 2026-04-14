'use client'

import * as React from 'react'

import { cn } from '@/lib/utils/cn'

type BadgeVariant = 'success' | 'neutral'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  neutral: 'bg-slate-100 text-slate-700',
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
