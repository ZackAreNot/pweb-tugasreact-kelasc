export const buttonStyles = {
  primary: 'border-brand-600 bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50',
  danger: 'border-red-200 bg-white text-red-700 hover:bg-red-50',
}

export const buttonClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors'

export default function Button({
  variant = 'primary',
  className = '',
  ...props
}) {
  return (
    <button
      type="button"
      className={`${buttonClass} ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  )
}
