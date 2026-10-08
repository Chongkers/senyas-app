import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'h-14 w-full rounded-full text-lg font-extrabold transition active:scale-[0.98]',
        variant === 'primary' && 'bg-periwinkle text-white',
        variant === 'secondary' && 'border-2 border-periwinkle bg-white text-ink',
        'disabled:bg-mint-light disabled:text-ink/60 disabled:active:scale-100',
        className,
      )}
      {...props}
    />
  )
}

export function IconButton({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface text-ink transition active:scale-95',
        className,
      )}
      {...props}
    />
  )
}
