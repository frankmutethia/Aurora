import * as React from 'react'

export type ButtonVariant = 'default' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const baseClasses = 'inline-flex items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

function variantClasses(variant: ButtonVariant): string {
  if (variant === 'outline') return 'border bg-transparent hover:border-sky-300'
  if (variant === 'ghost') return 'bg-transparent hover:bg-slate-100'
  return 'bg-sky-600 text-white hover:bg-sky-700 shadow-sm'
}

function sizeClasses(size: ButtonSize): string {
  if (size === 'sm') return 'h-8 px-3 text-sm'
  if (size === 'lg') return 'h-10 px-5 text-base'
  return 'h-9 px-4 text-sm'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = '', variant = 'default', size = 'md', ...props },
  ref,
) {
  const classes = [baseClasses, variantClasses(variant), sizeClasses(size), className].join(' ').trim()
  return <button ref={ref} className={classes} {...props} />
})

export default Button


