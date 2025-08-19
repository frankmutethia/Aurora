export type DemoCar = {
  id: number
  make: string
  model: string
  year: number
  rental_rate_per_day: number
  transmission?: string
  fuel_type?: string
  seats?: number
  vehicle_model?: { vehicle_line?: { vehicle_type?: 'SUV' | 'Sedan' | 'Hatchback' | 'Van' } }
  imageUrl?: string
}

const CarCard = ({ car }: { car: DemoCar }) => {
  const title = `${car.year} ${car.make} ${car.model}`
  const type = car.vehicle_model?.vehicle_line?.vehicle_type
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative w-full h-44 bg-sky-50" aria-label={title} />
      <div className="space-y-2 p-4">
        <div className="text-base font-semibold">{title}</div>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {type ? <span className="rounded border px-2 py-0.5 bg-sky-50 text-sky-700">{type}</span> : null}
          {car.transmission ? <span className="rounded border px-2 py-0.5">{car.transmission}</span> : null}
          {car.fuel_type ? <span className="rounded border px-2 py-0.5">{car.fuel_type}</span> : null}
          {car.seats ? <span className="rounded border px-2 py-0.5">{car.seats} seats</span> : null}
        </div>
        <div className="text-sm"><span className="font-semibold">${car.rental_rate_per_day.toLocaleString()}</span><span className="text-muted-foreground"> / day</span></div>
      </div>
      <div className="mt-auto p-4 pt-0">
        <div className="flex w-full items-center gap-2">
          <a href="#view" className="w-full inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 h-9 text-white text-sm">View</a>
          <a href="#book" className="w-full inline-flex items-center justify-center rounded-md border bg-white hover:border-sky-300 h-9 text-sm">Book</a>
        </div>
      </div>
    </div>
  )
}

export default CarCard


