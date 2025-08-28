import Header from '../components/Header'
import Footer from '../components/Footer'

function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">About Smart Car Rentals</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Your trusted partner for reliable and affordable car rentals in Melbourne. 
              We specialize in rideshare, private use, and long-term rental solutions.
            </p>
          </div>

          {/* Our Story */}
          <div className="mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-semibold text-slate-900 mb-6 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-slate-700">
                <p className="mb-6">
                  Founded in Melbourne, Smart Car Rentals was born from the simple idea that car rental 
                  should be accessible, affordable, and hassle-free. We recognized the growing need for 
                  flexible transportation solutions in the rideshare economy and set out to create a 
                  service that meets the diverse needs of modern drivers.
                </p>
                <p className="mb-6">
                  Our journey began with a small fleet of well-maintained vehicles and a commitment to 
                  exceptional customer service. Today, we've grown to become one of Melbourne's most 
                  trusted car rental services, serving thousands of satisfied customers across the city.
                </p>
                <p>
                  Whether you're a rideshare driver looking for a reliable vehicle, a family needing 
                  a car for the weekend, or a business requiring long-term rental solutions, we're here 
                  to help you get where you need to go.
                </p>
              </div>
            </div>
          </div>

          {/* Our Mission */}
          <div className="bg-sky-50 rounded-lg p-8 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-semibold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-700 mb-8">
                To provide reliable, affordable, and convenient car rental services that empower 
                our customers to achieve their personal and professional goals while maintaining 
                the highest standards of safety and customer satisfaction.
              </p>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Reliability</h3>
                  <p className="text-slate-600">Dependable vehicles and service you can count on</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Affordability</h3>
                  <p className="text-slate-600">Competitive pricing without compromising quality</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Customer Care</h3>
                  <p className="text-slate-600">Exceptional service and support every step of the way</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8 text-center">Why Choose Us?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Quality Fleet</h3>
                <p className="text-sm text-slate-600">Well-maintained vehicles with regular servicing</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">24/7 Support</h3>
                <p className="text-sm text-slate-600">Round-the-clock assistance when you need it</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Quick Booking</h3>
                <p className="text-sm text-slate-600">Simple online booking with instant confirmation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Flexible Options</h3>
                <p className="text-sm text-slate-600">Daily, weekly, and monthly rental options</p>
              </div>
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-8 text-center">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <img 
                  src="/images/avatars/avatar-1.png" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Sarah Johnson</h3>
                <p className="text-sky-600 mb-2">Fleet Manager</p>
                <p className="text-sm text-slate-600">
                  Ensures our vehicles are always in top condition and ready for your journey.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="/images/avatars/avatar-2.png" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Mike Chen</h3>
                <p className="text-sky-600 mb-2">Customer Support</p>
                <p className="text-sm text-slate-600">
                  Provides exceptional customer service and support throughout your rental experience.
                </p>
              </div>
              <div className="text-center">
                <img 
                  src="/images/avatars/avatar-3.png" 
                  alt="Team Member" 
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-slate-900 mb-1">Emma Wilson</h3>
                <p className="text-sky-600 mb-2">Operations Manager</p>
                <p className="text-sm text-slate-600">
                  Coordinates all operations to ensure smooth and efficient service delivery.
                </p>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-slate-900 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-slate-300 mb-6">
              Contact us today to learn more about our services or to make a reservation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/cars" 
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 rounded-md transition font-medium"
              >
                Browse Our Fleet
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 border border-slate-600 hover:border-slate-500 rounded-md transition font-medium"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default AboutPage
