import * as React from 'react'

type ToastMsg = { id: number; text: string }

export function toast(text: string) {
  window.dispatchEvent(new CustomEvent('app-toast', { detail: { text } }))
}

const Toaster = () => {
  const [queue, setQueue] = React.useState<ToastMsg[]>([])

  React.useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail as { text?: string }
      if (!detail?.text) return
      const id = Date.now() + Math.random()
      setQueue((q) => [...q, { id, text: detail.text! }])
      setTimeout(() => setQueue((q) => q.filter((t) => t.id !== id)), 3000)
    }
    window.addEventListener('app-toast', onToast as any)
    return () => window.removeEventListener('app-toast', onToast as any)
  }, [])

  return (
    <div className="fixed z-[9999] bottom-4 right-4 flex flex-col gap-2">
      {queue.map((m) => (
        <div key={m.id} className="rounded-md border bg-white shadow px-4 py-2 text-sm">
          {m.text}
        </div>
      ))}
    </div>
  )
}

export default Toaster


