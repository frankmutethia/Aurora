import * as React from 'react'
import type { Car } from '../lib/types'

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const title = `${car.year} ${car.make} ${car.model}`
  // Resolve image from API shape (images[0].image_url) or demo shape (image_url)
  const rawImage: string | undefined =
    (car as any)?.images?.[0]?.image_url || (car as any)?.image_url
  let imageUrl = rawImage || '/images/cars/sedan-white.png'
  // If it's a relative path that isn't already under /images, prefix API base
  if (imageUrl && !/^https?:\/\//.test(imageUrl) && !imageUrl.startsWith('/images/')) {
    imageUrl = `https://4043f016f021.ngrok-free.app/api/v1/${imageUrl.replace(/^\//, '')}`
  }
  const agencyName = (car as any)?.agency?.name || (car as any)?.agency || ''
  const categoryName = (car as any)?.category?.name || (car as any)?.category || ''
  
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-44 object-cover bg-sky-50"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/images/cars/sedan-white.png'
        }}
      />
      <div className="space-y-2 p-4">
        <div className="text-base font-semibold">{title}</div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {agencyName && (
            <span className="rounded border px-2 py-0.5 bg-sky-50 text-sky-700">{agencyName}</span>
          )}
          {categoryName && (
            <span className="rounded border px-2 py-0.5 bg-white">{categoryName}</span>
          )}
          <span className="rounded border px-2 py-0.5">{car.transmission}</span>
          <span className="rounded border px-2 py-0.5">{car.fuel_type}</span>
          <span className="rounded border px-2 py-0.5">{car.seats} seats</span>
        </div>
        <div className="text-sm">
          <span className="font-semibold">${parseFloat(car.rental_rate_per_day).toLocaleString()}</span>
          <span className="text-muted-foreground"> / day</span>
        </div>
      </div>
      <div className="mt-auto p-4 pt-0">
        <div className="flex w-full items-center gap-2">
          <a href={`/car/${car.id}`} className="w-full inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 h-9 text-white text-sm">View</a>
          <a href={`/book/${car.id}`} className="w-full inline-flex items-center justify-center rounded-md border bg-white hover:border-sky-300 h-9 text-sm">Book</a>
        </div>
      </div>
    </div>
  )
}

export default CarCard


