'use client'

import * as React from 'react'

import { cn } from '../../lib/utils/cn'

type BadgeVariant = 'success' | 'failed' | 'warning'

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800'
}

export function Badge({ className, variant = 'failed', ...props }: BadgeProps) {
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
