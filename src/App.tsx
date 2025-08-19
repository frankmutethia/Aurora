import './App.css'
import type { ReactNode } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import CarCard from './components/CarCard'
import { DEMO_CARS, DEMO_TESTIMONIALS } from './lib/demo'

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

export default function App() {
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
          {DEMO_TESTIMONIALS.map((t, i) => (
            <div key={i} className="rounded-xl border hover:shadow-md transition">
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
                <p className="text-sm text-slate-700">“{t.quote}”</p>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>

      <Footer />
    </main>
  )
}

