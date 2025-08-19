import * as React from 'react'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={["rounded-xl border bg-white", className].join(' ').trim()} {...props} />
})

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { className = '', ...props },
  ref,
) {
  return <div ref={ref} className={["p-4", className].join(' ').trim()} {...props} />
})

export default Card


