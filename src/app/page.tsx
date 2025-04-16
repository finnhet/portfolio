'use client'
import { useEffect, useRef } from 'react'
import Header from './components/Header'
import Image from 'next/image'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return 

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Particle {
      x: number
      y: number
      radius: number
      dx: number
      dy: number
    }

    const particles: Particle[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: Math.random() * 0.5 - 0.25,
        dy: Math.random() * 0.5 - 0.25,
      })
    }

    const animate = () => {
      
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.25)'
      ctx!.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx!.fillStyle = '#ffffff'
        ctx!.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()
}, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20 min-h-screen">
        <Header />

        <div className="bg-black/60 p-10 rounded-2xl shadow-lg max-w-2xl w-full">
          <h1 className="text-5xl font-bold text-white mb-6">Finn Hettinga</h1>
        
          <p className="text-gray-300 mb-6 text-lg">
            17-jarige Software Development Student aan Firda Sneek<br />
            Stagiair Backend API Developer bij DevOps NL
          </p>
          <p className="text-gray-400 mb-6">
            Backend-focused, leergierig en gedreven om schaalbare, veilige software te bouwen.
          </p>

          <div className="flex justify-center gap-6 mb-6">
            <a href="https:
              <Image src="/linkedin.png" alt="LinkedIn" width={40} height={40} className="hover:scale-110 transition" />
            </a>
            <a href="https:
              <Image src="/github.png" alt="GitHub" width={40} height={40} className="hover:scale-110 transition" />
            </a>
          </div>

          <a
            href="/projects"
            className="inline-block bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          >
            Bekijk Projecten
          </a>
        </div>
      </div>
    </div>
  )
}
