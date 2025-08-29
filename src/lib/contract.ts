export type ContractData = {
  renterName: string
  renterEmail: string
  renterPhone: string
  carId: number
  carMake: string
  carModel: string
  carYear: number | string
  carPlate: string
  pickup: string
  dropoff: string
  pickupLocation: string
  returnLocation: string
  total: string
  bondAmount?: string
  week1Amount?: string
}

export async function generateContractPdf(templateUrl: string, data: ContractData): Promise<Uint8Array> {
  // Load pdf-lib from local deps, or fallback to CDN to avoid dev resolution errors
  let PDFDocument: any, StandardFonts: any, rgb: any
  try {
    // @vite-ignore prevents pre-bundle resolution errors in dev
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import(/* @vite-ignore */ 'pdf-lib')
    PDFDocument = mod.PDFDocument; StandardFonts = mod.StandardFonts; rgb = mod.rgb
  } catch (err) {
    const cdn = await import('https://cdn.skypack.dev/pdf-lib@1.17.1')
    PDFDocument = cdn.PDFDocument; StandardFonts = cdn.StandardFonts; rgb = cdn.rgb
  }
  const templateBytes = await fetch(templateUrl).then(r => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(templateBytes)
  const pages = pdfDoc.getPages()
  const first = pages[0]
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const draw = (text: string, x: number, y: number, size = 10, bold = false) => {
    first.drawText(text || '', { x, y, size, font: bold ? fontBold : font, color: rgb(0.1, 0.12, 0.16) })
  }

  // NOTE: Coordinates assume an A4-ish template; adjust as needed to match your PDF
  // Header company block
  draw('Smart Car Rentals Pty Ltd', 40, first.getHeight() - 60, 12, true)
  draw('Unit 2/11 Burrows Avenue, Dandenong VIC 3175', 40, first.getHeight() - 74)
  draw('Phone: 0420 759 910  •  Email: smartrentals1@gmail.com', 40, first.getHeight() - 88)

  // Renter details
  draw('Renter', 40, first.getHeight() - 120, 11, true)
  draw(`Name: ${data.renterName}`, 40, first.getHeight() - 136)
  draw(`Email: ${data.renterEmail}`, 40, first.getHeight() - 150)
  draw(`Phone: ${data.renterPhone}`, 40, first.getHeight() - 164)

  // Vehicle details
  draw('Vehicle', 320, first.getHeight() - 120, 11, true)
  draw(`ID: ${data.carId}`, 320, first.getHeight() - 136)
  draw(`Make/Model: ${data.carMake} ${data.carModel}`, 320, first.getHeight() - 150)
  draw(`Year: ${String(data.carYear)}`, 320, first.getHeight() - 164)
  draw(`Reg: ${data.carPlate}`, 320, first.getHeight() - 178)

  // Booking details
  draw('Booking', 40, first.getHeight() - 208, 11, true)
  draw(`Pickup: ${data.pickup}`, 40, first.getHeight() - 224)
  draw(`Return: ${data.dropoff}`, 40, first.getHeight() - 238)
  draw(`Pickup Location: ${data.pickupLocation}`, 40, first.getHeight() - 252)
  draw(`Return Location: ${data.returnLocation}`, 40, first.getHeight() - 266)

  draw('Financials', 320, first.getHeight() - 208, 11, true)
  draw(`Total: $${data.total}`, 320, first.getHeight() - 224, 12, true)
  if (data.bondAmount) draw(`Bond: $${data.bondAmount}`, 320, first.getHeight() - 238)
  if (data.week1Amount) draw(`Week 1: $${data.week1Amount}`, 320, first.getHeight() - 252)

  // Signature lines
  draw('Renter Signature:', 40, 120)
  draw('_____________________________', 140, 120)
  draw('Company Representative:', 40, 96)
  draw('_____________________________', 200, 96)
  draw('Date:', 40, 72)
  draw('__________________', 80, 72)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}


