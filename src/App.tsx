import './App.css'
import type { ReactNode } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CarCard from './components/CarCard'
import AdminPage from './components/AdminPage'
import AdminSetup from './components/AdminSetup'
import { DEMO_CARS, filterDemoCars } from './lib/demo-data'
import { createDemoAdmin } from './lib/demo-admin'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import * as React from 'react'
import type { Booking } from './lib/types'
import { toast } from './components/Toaster'
import PaymentSection from './components/PaymentSection'

const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center rounded-full bg-white/60 backdrop-blur px-3 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100">{children}</span>
)

const SectionContainer = ({ children, className = '', ...props }: React.ComponentProps<'section'>) => (
  <section {...props} className={"container mx-auto px-4 " + className}>{children}</section>
)

const HeroBackground = () => (
  <div className="absolute inset-0">
    {/* Background image layer from clone */}
    <div className="absolute inset-0 bg-[url('/images/hero-light-blue-2.png')] bg-cover bg-center" />
    {/* Soft gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-sky-200/40 via-sky-100/30 to-white/80" />
    <svg
      className="absolute inset-x-0 top-[22%] w-full h-[55%]"
      viewBox="0 0 1440 320"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveA" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="waveB" x1="1" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.18" />
        </linearGradient>
      </defs>
      <path fill="url(#waveA)" d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,197.3C672,213,768,203,864,176C960,149,1056,107,1152,101.3C1248,96,1344,128,1392,144L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
      <path fill="url(#waveB)" d="M0,224L48,208C96,192,192,160,288,149.3C384,139,480,149,576,165.3C672,181,768,203,864,197.3C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z" />
    </svg>
    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(80%_60%_at_60%_80%,rgba(56,189,248,0.25),transparent_60%)]" />
    </div>
  )

function HomePage() {
  const featured = DEMO_CARS.slice(0, 4)

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Hero */}
      <section className="relative">
        <HeroBackground />
        <SectionContainer className="relative py-24 md:py-32">
          <div className="max-w-2xl space-y-6">
            <Badge>Melbourne • Rideshare • Long-term • Private</Badge>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight text-slate-900">
              Drive Smart, <span className="text-sky-700">Rent Smart.</span>
            </h1>
            <p className="text-slate-700">Affordable, reliable, and flexible rentals for rideshare, private use, and long-term customers.</p>
            <div className="flex gap-3">
              <a href="#cars" className="h-10 px-5 inline-flex items-center justify-center rounded-md bg-sky-600 hover:bg-sky-700 text-white shadow-md text-sm">Browse Cars</a>
              <a href="#about" className="h-10 px-5 inline-flex items-center justify-center rounded-md border hover:border-sky-300 bg-transparent text-sm">Learn More</a>
            </div>
          </div>
          <div className="mt-10 -mx-4 px-4 md:hidden">
            <div className="flex gap-2 overflow-x-auto">
              {['SUV', 'Sedan', 'Hatchback', 'Van'].map((c) => (
                <a key={c} href="#cars" className="shrink-0 rounded-md border bg-white/80 px-3 py-2 text-sm font-medium text-slate-800 hover:shadow-sm">
                  {c}
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 hidden md:grid grid-cols-2 gap-2 max-w-xl">
            {['SUV', 'Sedan', 'Hatchback', 'Van'].map((c) => (
              <a key={c} href="#cars" className="group">
                <div className="rounded-lg border bg-white/70 backdrop-blur transition hover:shadow-md">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{c}</span>
                    <span className="text-xs text-sky-700 group-hover:underline">Explore →</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* Featured vehicles */}
      <SectionContainer className="py-12 md:py-16" id="cars">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-900">Featured vehicles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </SectionContainer>

      {/* Why choose */}
      <section className="bg-gradient-to-b from-white to-sky-50">
        <SectionContainer className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-900">Why choose Smart Rentals?</h2>
          <ul className="grid md:grid-cols-3 gap-4 text-sm text-slate-700">
            <li className="p-5 border rounded-lg bg-white hover:shadow-md transition">Reliable, late-model vehicles maintained to high standards.</li>
            <li className="p-5 border rounded-lg bg-white hover:shadow-md transition">Flexible terms for rideshare, private, and long-term use.</li>
            <li className="p-5 border rounded-lg bg-white hover:shadow-md transition">Transparent pricing. No surprises.</li>
          </ul>
        </SectionContainer>
      </section>

      {/* Testimonials */}
      <SectionContainer className="py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-900">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'Sophie L.', role: 'Rideshare Driver', quote: 'Picked up a clean car and hit the road in minutes. Best rates in Melbourne!' },
            { name: 'Mark R.', role: 'Contractor', quote: 'Long-term rental was flexible and hassle-free. Highly recommended.' },
            { name: 'Aisha K.', role: 'Student', quote: 'Loved the simple booking and great customer service.' }
          ].map((t, i) => (
            <div key={i} className="rounded-xl border hover:shadow-md transition">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700">"{t.quote}"</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      {/* Australia imagery / locations */}
      <SectionContainer className="py-12 md:py-16" id="about">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-900">Explore Melbourne & Dandenong</h2>
        <p className="text-slate-700 mb-4">Pickup and returns available around Dandenong VIC. Discover iconic spots across Melbourne on your next trip.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            '/images/australia/dan-freeman-7Zb7kUyQg1E-unsplash.jpg',
            '/images/australia/photoholgic-1GFUOji-yck-unsplash.jpg',
            '/images/australia/photoholgic-jK9dT34TfuI-unsplash.jpg',
            '/images/australia/iStock_000046244704_Full2.jpg',
            '/images/australia/1533817792-australiasigndepositphotos.avif',
            '/images/australia/images.jpg'
          ].map((src, i) => (
            <div key={i} className="rounded-lg overflow-hidden border bg-white">
              <img src={src} onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/images/hero-light-blue-2.png'}} alt="Australia location" className="w-full h-44 object-cover" />
            </div>
          ))}
        </div>
      </SectionContainer>

      <Footer />
    </main>
  )
}

function CarsPage() {
  const [search] = useSearchParams()
  const [make, setMake] = React.useState<string>(search.get('make') || '')
  const [category, setCategory] = React.useState<string>(search.get('category') || 'Any')
  const [transmission, setTransmission] = React.useState<string>(search.get('transmission') || 'Any')
  const [fuel, setFuel] = React.useState<string>(search.get('fuel_type') || 'Any')
  const [seats, setSeats] = React.useState<string>(search.get('seats') || '')
  const [priceRange, setPriceRange] = React.useState<[number, number]>([Number(search.get('min_price') || 0) || 0, Number(search.get('max_price') || 100000) || 100000])
  const navigate = useNavigate()

  const params = new URLSearchParams(search)
  params.set('make', make)
  if (category !== 'Any') params.set('category', category); else params.delete('category')
  if (transmission !== 'Any') params.set('transmission', transmission); else params.delete('transmission')
  if (fuel !== 'Any') params.set('fuel_type', fuel); else params.delete('fuel_type')
  if (seats) params.set('seats', seats); else params.delete('seats')
  params.set('min_price', String(priceRange[0]))
  params.set('max_price', String(priceRange[1]))

  const filtered = filterDemoCars(params)
  const page = Number(params.get('page') || 1)
  const totalPages = filtered.pagination.total_pages
  function goPage(p: number) { const n = new URLSearchParams(params); n.set('page', String(Math.min(Math.max(1, p), totalPages))); navigate(`/cars?${n.toString()}`) }

  function apply() {
    navigate(`/cars?${params.toString()}`)
  }
  function clear() {
    navigate('/cars')
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <section className="container mx-auto px-4 py-8 grid md:grid-cols-[280px_1fr] gap-6">
        <aside className="space-y-4 md:sticky md:top-20 h-fit">
          <div className="rounded-lg border p-4 space-y-4">
            <div>
              <label className="block text-sm mb-1">Make</label>
              <input className="w-full rounded-md border px-3 py-2" value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <select aria-label="Vehicle category" className="w-full rounded-md border px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                {['Any','SUV','Sedan','Hatchback','Van'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Transmission</label>
              <select aria-label="Transmission" className="w-full rounded-md border px-3 py-2" value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                {['Any','Automatic','Manual','CVT'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Fuel type</label>
              <select aria-label="Fuel type" className="w-full rounded-md border px-3 py-2" value={fuel} onChange={(e) => setFuel(e.target.value)}>
                {['Any','Petrol','Diesel','Hybrid','Electric'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Seats</label>
              <input className="w-full rounded-md border px-3 py-2" value={seats} onChange={(e) => setSeats(e.target.value)} placeholder="e.g. 5" />
            </div>
            <div>
              <label className="block text-sm mb-1">Price per day</label>
              <div className="flex items-center gap-2">
                <input type="number" aria-label="Min price per day" className="w-1/2 rounded-md border px-3 py-2" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value)||0, priceRange[1]])} />
                <span>–</span>
                <input type="number" aria-label="Max price per day" className="w-1/2 rounded-md border px-3 py-2" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)||0])} />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={apply} className="w-full h-9 rounded-md bg-sky-600 text-white hover:bg-sky-700">Apply</button>
              <button onClick={clear} className="w-full h-9 rounded-md border hover:border-sky-300 bg-white">Clear</button>
            </div>
          </div>
        </aside>
        <section>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-slate-900">Available Cars</h1>
            <div className="text-sm text-slate-600">{filtered.pagination.total} results</div>
          </div>
          {filtered.cars.length === 0 ? (
            <div className="text-sm text-muted-foreground">No cars match your filters.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.cars.map((car: (typeof DEMO_CARS)[number]) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={()=>goPage(page-1)} disabled={page<=1} className="h-9 px-3 rounded-md border bg-white hover:border-sky-300 disabled:opacity-50">Prev</button>
              <div className="text-sm">{page} / {totalPages}</div>
              <button onClick={()=>goPage(page+1)} disabled={page>=totalPages} className="h-9 px-3 rounded-md border bg-white hover:border-sky-300 disabled:opacity-50">Next</button>
            </div>
          )}
        </section>
      </section>
      <Footer />
    </main>
  )
}

function CarDetailsPage() {
  const { id } = useParams()
  const car = DEMO_CARS.find(c => String(c.id) === String(id)) || DEMO_CARS[0]
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            <img
              src={car.image_url || '/placeholder.svg'}
              alt={`${car.year} ${car.make} ${car.model}`}
              className="w-full h-72 md:h-96 object-cover bg-sky-50 rounded-lg"
            />
            <div className="grid grid-cols-3 gap-2">
              {[car.image_url, car.image_url, car.image_url].map((src, i) => (
                <img key={i} src={src || '/placeholder.svg'} alt={String(i+1)} className="h-20 w-full object-cover rounded-md bg-sky-50" />
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <h1 className="text-3xl font-semibold text-slate-900">{car.year} {car.make} {car.model}</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info label="Transmission" value={car.transmission || '—'} />
              <Info label="Fuel" value={car.fuel_type || '—'} />
              <Info label="Seats" value={String(car.seats || '—')} />
              <Info label="Color" value={'—'} />
            </div>
            <div className="text-xl"><span className="font-semibold">${car.rental_rate_per_day.toLocaleString()}</span><span className="text-muted-foreground"> / day</span></div>
            <div className="flex gap-3">
              <Link to={`/book/${car.id}`} className="inline-flex"><button className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 shadow">Book now</button></Link>
              <a href="#terms" className="inline-flex"><button className="px-4 py-2 rounded-md border hover:border-sky-300">View T&Cs</button></a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-slate-800">{value}</div>
    </div>
  )
}

function BookPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [start, setStart] = React.useState<string>('')
  const [end, setEnd] = React.useState<string>('')
  const [pickup, setPickup] = React.useState<string>('Dandenong VIC')
  const [ret, setRet] = React.useState<string>('Dandenong VIC')
  const [special, setSpecial] = React.useState<string>('')
  const [promo, setPromo] = React.useState<string>('')
  const [phone, setPhone] = React.useState<string>('')
  const [extras, setExtras] = React.useState({ gps: false, childSeat: false, addDriver: false })
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>('')
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false)
  const [showPaymentSection, setShowPaymentSection] = React.useState(false)

  const car = DEMO_CARS.find(c => String(c.id) === String(id)) || DEMO_CARS[0]
  const days = React.useMemo(() => (start && end ? Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / (1000*60*60*24))) : 0), [start, end])
  const base = React.useMemo(() => days * (car?.rental_rate_per_day || 0), [days, car])
  const extraDay = (extras.gps ? 10 : 0) + (extras.childSeat ? 8 : 0)
  const extraWeek = extras.addDriver ? 20 : 0
  const extrasTotal = extraDay * days + extraWeek * Math.ceil(days / 7)
  const totalEstimate = base + extrasTotal

  async function submit() {
    if (!start || !end || !phone) return
    setShowPaymentSection(true)
  }

  async function handlePaymentSubmit() {
    if (!selectedPaymentMethod) {
      toast('Please select a payment method')
      return
    }
    
    setIsProcessingPayment(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const idNum = Math.floor(Math.random()*100000)
      const total = totalEstimate
      const booking: Booking = { 
        id: idNum, 
        user_id: 1, // Default user ID for demo
        car_id: Number(id), 
        start_date: new Date(start).toISOString(), 
        end_date: new Date(end).toISOString(), 
        pickup_location: pickup, 
        return_location: ret, 
        special_requests: special || undefined, 
        promo_code: promo || undefined, 
        phone_number: phone, 
        status: 'confirmed', 
        payment_status: 'paid',
        total_cost: total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      try {
        const mod = import('./lib/auth')
        mod.then(auth => auth.addBooking(booking))
      } catch {
        // noop in demo
      }
      setIsProcessingPayment(false)
      toast(`Payment successful! Booking confirmed with ${selectedPaymentMethod}`)
      navigate(`/profile?booking=${idNum}`)
    }, 2000)
  }

  function handlePaymentMethodSelect(method: string) {
    setSelectedPaymentMethod(method)
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!showPaymentSection ? (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1" htmlFor="start">Start Date</label><input id="start" type="datetime-local" className="w-full rounded-md border px-3 py-2" value={start} onChange={(e)=>setStart(e.target.value)} /></div>
                <div><label className="block text-sm mb-1" htmlFor="end">End Date</label><input id="end" type="datetime-local" className="w-full rounded-md border px-3 py-2" value={end} onChange={(e)=>setEnd(e.target.value)} /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1" htmlFor="pickup">Pickup Location</label><input id="pickup" className="w-full rounded-md border px-3 py-2" value={pickup} onChange={(e)=>setPickup(e.target.value)} placeholder="Dandenong VIC" /></div>
                <div><label className="block text-sm mb-1" htmlFor="return">Return Location</label><input id="return" className="w-full rounded-md border px-3 py-2" value={ret} onChange={(e)=>setRet(e.target.value)} placeholder="Dandenong VIC" /></div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm">Extras</label>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={extras.gps} onChange={(e)=>setExtras(v=>({...v,gps:e.target.checked}))} /> GPS ($10/day)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={extras.childSeat} onChange={(e)=>setExtras(v=>({...v,childSeat:e.target.checked}))} /> Child seat ($8/day)</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={extras.addDriver} onChange={(e)=>setExtras(v=>({...v,addDriver:e.target.checked}))} /> Additional driver ($20/week)</label>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm mb-1" htmlFor="phone">Phone Number</label><input id="phone" className="w-full rounded-md border px-3 py-2" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="+61..." /></div>
                <div><label className="block text-sm mb-1" htmlFor="promo">Promo Code</label><input id="promo" className="w-full rounded-md border px-3 py-2" value={promo} onChange={(e)=>setPromo(e.target.value)} placeholder="e.g. WELCOME10" /></div>
              </div>
              <div>
                <label className="block text-sm mb-1" htmlFor="special">Special Requests</label>
                <textarea id="special" className="w-full rounded-md border px-3 py-2" rows={4} value={special} onChange={(e)=>setSpecial(e.target.value)} />
              </div>
              <div className="flex gap-3">
                <button onClick={submit} className="h-10 px-5 rounded-md bg-sky-600 text-white hover:bg-sky-700">Continue to Payment</button>
                <Link to={`/cars/${id}`}>
                  <button className="h-10 px-5 rounded-md border bg-white hover:border-sky-300">Back to car</button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Rental Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">{car ? `${car.year} ${car.make} ${car.model}` : '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{days} day(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pickup:</span>
                        <span className="font-medium">{pickup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Return:</span>
                        <span className="font-medium">{ret}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cost Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Rate:</span>
                        <span className="font-medium">${base.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Extras:</span>
                        <span className="font-medium">${extrasTotal.toLocaleString()}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-sky-600">${totalEstimate.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <PaymentSection
                totalAmount={totalEstimate}
                onPaymentMethodSelect={handlePaymentMethodSelect}
                selectedPaymentMethod={selectedPaymentMethod}
                onPaymentSubmit={handlePaymentSubmit}
                isProcessing={isProcessingPayment}
              />

              {/* Back Button */}
              <div className="flex justify-start">
                <button 
                  onClick={() => setShowPaymentSection(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Back to Booking Details
                </button>
              </div>
            </div>
          )}
        </div>
        <aside className="space-y-4">
          <div className="border rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Vehicle</span><span>{car ? `${car.year} ${car.make} ${car.model}` : '—'}</span></div>
            <div className="flex justify-between"><span>Rate</span><span>${car?.rental_rate_per_day.toLocaleString()}/day</span></div>
            <div className="flex justify-between"><span>Duration</span><span>{days} day(s)</span></div>
            <div className="flex justify-between"><span>Extras</span><span>${extrasTotal.toLocaleString()}</span></div>
            <div className="flex justify-between font-medium"><span>Est. total</span><span>${totalEstimate.toLocaleString()}</span></div>
            <p className="text-xs text-slate-500">Final total may vary with fees (tolls, fines processing, etc.). See T&Cs.</p>
          </div>
        </aside>
      </div>
      <Footer />
    </main>
  )
}

function AboutPage() { return pageShell('About Smart Car Rentals', (
  <div className="text-slate-700 space-y-4">
    <p>Smart Car Rentals Pty Ltd is dedicated to providing affordable, reliable, and flexible car rental solutions tailored for rideshare, private use, and long-term customers across Melbourne.</p>
    <div>
      <h3 className="font-semibold text-slate-900">Mission</h3>
      <p>To provide affordable, reliable, and flexible car rental solutions tailored for rideshare, private use, and long-term customers.</p>
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">Vision</h3>
      <p>To be the leading choice for car rentals in Melbourne by focusing on customer satisfaction, vehicle quality, and seamless booking experiences.</p>
    </div>
    <div>
      <h3 className="font-semibold text-slate-900">Values</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Reliability</li>
        <li>Affordability</li>
        <li>Customer Satisfaction</li>
        <li>Innovation</li>
      </ul>
    </div>
    <p className="text-sky-700/90 font-medium">Smart Car Rentals</p>
  </div>
)) }
function ContactPage() { return pageShell('Contact us', (
  <div className="text-sm space-y-1 text-slate-700">
    <p>Smart Car Rentals Pty Ltd</p>
    <p>Unit 2/11 Burrows Avenue, Dandenong VIC 3175</p>
    <p>Phone: 0420 759 910</p>
    <p>Email: <a href="mailto:smartrentals1@gmail.com" className="underline text-sky-700">smartrentals1@gmail.com</a></p>
  </div>
)) }
function TermsPage() { return pageShell('Terms and Conditions', (
  <div className="text-sm leading-6 text-slate-700 space-y-4">
    <p><span className="font-semibold">Company:</span> Smart Car Rentals Pty Ltd</p>
    <p><span className="font-semibold">Tagline:</span> Smart Car Rentals</p>
    <div className="space-y-2">
      <h3 className="font-semibold text-slate-900">Rental Agreement Summary</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li>Valid driver's license and payment method required.</li>
        <li>Renter is responsible for tolls, fines, and fuel unless otherwise stated.</li>
        <li>Mileage and usage must comply with vehicle category guidelines.</li>
        <li>Vehicle condition photos should be taken at pickup and return.</li>
        <li>Insurance excess, bond, and fees (if applicable) are disclosed at booking.</li>
        <li>Late returns may incur additional daily charges.</li>
      </ul>
    </div>
    <p>For full terms and conditions or tailored agreements for rideshare and long-term rentals, please contact us at <a href="mailto:smartrentals1@gmail.com" className="underline">smartrentals1@gmail.com</a> or 0420 759 910.</p>
  </div>
)) }

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try { await import('./lib/auth').then(m => m.login(email, password)); toast('Signed in'); navigate('/profile') } catch { setError('Login failed') }
  }

  const handleSignInAsAdmin = () => {
    createDemoAdmin()
    toast('Signed in as Admin')
    navigate('/admin')
  }

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="border rounded-lg p-4 space-y-3">
          <h1 className="text-xl font-semibold">Sign in</h1>
          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="lemail">Email</label>
              <input id="lemail" type="email" className="w-full rounded-md border px-3 py-2" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1" htmlFor="lpass">Password</label>
              <input id="lpass" type="password" className="w-full rounded-md border px-3 py-2" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            </div>
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
            <button className="w-full h-10 rounded-md bg-sky-600 text-white hover:bg-sky-700">Sign in</button>
          </form>
          
          <div className="pt-3 border-t">
            <button 
              onClick={handleSignInAsAdmin}
              className="w-full h-10 rounded-md bg-slate-600 text-white hover:bg-slate-700 text-sm"
            >
              Sign in as Admin
            </button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Quick access to admin dashboard for testing
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = React.useState({ first_name: '', last_name: '', email: '', password: '', phone: '' })
  const [error, setError] = React.useState<string | null>(null)
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(null)
    try { await import('./lib/auth').then(m => m.register(form)); toast('Account created'); navigate('/profile') } catch { setError('Registration failed') }
  }
  return (
    <main className="min-h-screen flex flex-col bg-white"><Header /><div className="container mx-auto px-4 py-8 max-w-md">
      <div className="border rounded-lg p-4 space-y-3"><h1 className="text-xl font-semibold">Create account</h1>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm mb-1" htmlFor="fn">First name</label><input id="fn" className="w-full rounded-md border px-3 py-2" value={form.first_name} onChange={(e)=>setForm(f=>({...f, first_name:e.target.value}))} required /></div>
            <div><label className="block text-sm mb-1" htmlFor="ln">Last name</label><input id="ln" className="w-full rounded-md border px-3 py-2" value={form.last_name} onChange={(e)=>setForm(f=>({...f, last_name:e.target.value}))} required /></div>
          </div>
          <div><label className="block text-sm mb-1" htmlFor="re">Email</label><input id="re" type="email" className="w-full rounded-md border px-3 py-2" value={form.email} onChange={(e)=>setForm(f=>({...f, email:e.target.value}))} required /></div>
          <div><label className="block text-sm mb-1" htmlFor="ph">Phone</label><input id="ph" className="w-full rounded-md border px-3 py-2" value={form.phone} onChange={(e)=>setForm(f=>({...f, phone:e.target.value}))} placeholder="+61..." /></div>
          <div><label className="block text-sm mb-1" htmlFor="rp">Password</label><input id="rp" type="password" className="w-full rounded-md border px-3 py-2" value={form.password} onChange={(e)=>setForm(f=>({...f, password:e.target.value}))} required /></div>
          {error ? <div className="text-sm text-red-600">{error}</div> : null}
          <button className="w-full h-10 rounded-md bg-sky-600 text-white hover:bg-sky-700">Create account</button>
        </form>
      </div></div><Footer /></main>
  )
}

function ProfilePage() {
  const user = React.useMemo(()=>{ try { return JSON.parse(localStorage.getItem('am_user') || 'null') } catch { return null }}, [])
  type B = { id:number; car?: { make:string; model:string }; car_id:number; start_date:string; end_date:string; status:string; total_cost?:number }
  const bookings = React.useMemo(()=>{ try { return JSON.parse(localStorage.getItem('am_bookings') || '[]') as B[] } catch { return [] as B[] }}, [])
  return (
    <main className="min-h-screen flex flex-col bg-white"><Header />
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="text-muted-foreground">You are not signed in. Please <a href="/login" className="underline text-sky-700">sign in</a>.</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <section className="lg:col-span-1 space-y-2">
              <h1 className="text-2xl font-semibold text-slate-900">Welcome{user.first_name ? `, ${user.first_name}` : ''}</h1>
              <p className="text-sm text-slate-600">{user.email}</p>
              {typeof user.loyalty_points === 'number' ? (
                <p className="text-sm text-slate-700">Loyalty points: {user.loyalty_points}</p>
              ) : null}
            </section>
            <section className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-2 text-slate-900">Your bookings</h2>
              {bookings.length === 0 ? (
                <div className="text-sm text-slate-600">No bookings yet.</div>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm"><thead className="text-left text-slate-600 bg-sky-50/60"><tr><th className="py-2 px-3">Booking</th><th className="px-3">Car</th><th className="px-3">Period</th><th className="px-3">Status</th><th className="px-3">Total</th></tr></thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-t"><td className="py-3 px-3">#{b.id}</td><td className="px-3">{b.car ? `${b.car.make} ${b.car.model}` : `ID ${b.car_id}`}</td><td className="px-3">{new Date(b.start_date).toLocaleString()} – {new Date(b.end_date).toLocaleString()}</td><td className="px-3 capitalize">{b.status}</td><td className="px-3">${(b.total_cost ?? 0).toLocaleString()}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}

function pageShell(title: string, body: React.ReactNode) {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <h1 className="text-4xl font-semibold text-slate-900">{title}</h1>
        {body}
      </div>
      <Footer />
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cars" element={<CarsPage />} />
        <Route path="/cars/:id" element={<CarDetailsPage />} />
        <Route path="/book/:id" element={<BookPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/setup" element={<AdminSetup />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

