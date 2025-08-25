const Footer = () => {
  return (
    <footer className="border-t border-sky-100 bg-white">
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <h4 className="font-semibold">Smart Car Rentals Pty Ltd</h4>
          <p className="text-sm text-muted-foreground">Unit 2/11 Burrows Avenue, Dandenong VIC 3175</p>
          <p className="text-sm text-muted-foreground">Phone: 0420 759 910</p>
          <p className="text-sm">Email: <a href="mailto:smartrentals1@gmail.com" className="underline hover:text-sky-700">smartrentals1@gmail.com</a></p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold">Company</h4>
          <ul className="text-sm space-y-1">
            <li><a href="#about" className="hover:text-sky-700">About</a></li>
            <li><a href="#terms" className="hover:text-sky-700">Terms & Conditions</a></li>
            <li><a href="#contact" className="hover:text-sky-700">Contact</a></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>ABN: 26 686 295 554</p>
          <p className="mt-2 text-sky-700/80">“Drive Smart, Rent Smart.”</p>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground pb-6">© {new Date().getFullYear()} Smart Car Rentals Pty Ltd. All rights reserved.</div>
    </footer>
  )
}

export default Footer


