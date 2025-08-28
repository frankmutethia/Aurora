import * as React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CarCard from '../components/CarCard'
import { DEMO_CARS } from '../lib/demo-data'

const Badge = ({ children }: { children: React.ReactNode }) => (
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">Featured vehicles</h2>
            <p className="text-slate-600">Popular choices for our customers</p>
          </div>
          <a href="/cars" className="w-fit h-10 px-5 inline-flex items-center justify-center rounded-md border hover:border-sky-300 bg-white text-sm font-medium">
            View all cars →
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featured.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </SectionContainer>

      {/* Why choose us */}
      <SectionContainer className="py-12 md:py-16 bg-sky-50/40">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">Why choose Smart Car Rentals?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">We provide reliable and affordable car rental solutions tailored to your needs</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Affordable Rates</h3>
            <p className="text-slate-600">Competitive pricing for rideshare, private, and long-term rentals</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Quality Vehicles</h3>
            <p className="text-slate-600">Well-maintained fleet with regular servicing and safety checks</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Quick Booking</h3>
            <p className="text-slate-600">Simple online booking process with instant confirmation</p>
          </div>
        </div>
      </SectionContainer>

      <Footer />
    </main>
  )
}

export default HomePage
