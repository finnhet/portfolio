import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full py-4 bg-black/80 backdrop-blur-sm shadow-md fixed top-0 z-50 pointer-events-auto">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition touch-manipulation">
          Finn Hettinga
        </Link>
        <nav className="space-x-4 sm:space-x-6 flex">
          <Link href="/" className="text-gray-300 hover:text-white transition px-2 py-1 touch-manipulation">Home</Link>
          <Link href="/projects" className="text-gray-300 hover:text-white transition px-2 py-1 touch-manipulation">Projects</Link>
        </nav>
      </div>
    </header>
  )
}
