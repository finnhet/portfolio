'use client'
import { useEffect, useRef, memo } from 'react'
import Image from 'next/image'

const projects = [
  {
    title: 'Portfolio',
    description: 'Modern portfolio website',
    link: 'https://github.com/finnhet/portfolio',
    tech: ['Next.js', 'TypeScript']
  },
  {
    title: 'Stagecentrum',
    description: 'Platform voor stages',
    link: 'https://github.com/finnhet/stagecentrum',
    tech: ['React', 'Node.js']
  },
  {
    title: 'AIboard',
    description: 'AI whiteboard tool',
    link: 'https://github.com/finnhet/whiteboardai',
    tech: ['AI', 'Canvas']
  },
] as const

const skills = ['Laravel', 'React', 'PHP', 'TypeScript', 'React Native'] as const
const learning = ['Golang', 'Java'] as const

const BinaryRain = memo(function BinaryRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    const fontSize = 13
    const cols = Math.floor(canvas.width / (fontSize * 1.6))
    const drops = Array.from({ length: cols }, () => Math.random() * -(canvas.height / fontSize) * 2)

    let animId: number
    let lastTime = 0

    const draw = (time: number) => {
      animId = requestAnimationFrame(draw)
      if (time - lastTime < 120) return
      lastTime = time

      ctx.fillStyle = 'rgba(4, 9, 4, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < cols; i++) {
        const y = drops[i] * fontSize
        if (y > 0 && y < canvas.height) {
          const char = Math.random() > 0.5 ? '1' : '0'
          ctx.fillStyle = 'rgba(0, 255, 65, 0.7)'
          ctx.fillText(char, i * fontSize * 1.6, y)
          if (drops[i] > 2) {
            ctx.fillStyle = 'rgba(0, 255, 65, 0.12)'
            ctx.fillText(Math.random() > 0.5 ? '1' : '0', i * fontSize * 1.6, y - fontSize * 2)
          }
        }
        drops[i] += 0.4
        if (y > canvas.height) drops[i] = Math.random() * -40
      }
    }

    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.18 }} />
})

function AsciiCard({ children, label, className = '' }: {
  children: React.ReactNode
  label?: string
  className?: string
}) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        border: '1px solid #1a4a1a',
        background: 'rgba(2, 6, 2, 0.85)',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 0 20px rgba(0, 255, 65, 0.04), inset 0 0 40px rgba(0, 0, 0, 0.3)',
      }}
    >
      {label && (
        <span
          className="absolute px-2 text-xs tracking-widest"
          style={{
            top: '-10px',
            left: '12px',
            background: '#040904',
            color: '#00ff41',
            fontFamily: 'var(--font-geist-mono), monospace',
            letterSpacing: '0.15em',
          }}
        >
          [{label}]
        </span>
      )}
      <div className="p-5 md:p-6" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
        {children}
      </div>
    </div>
  )
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs transition-all cursor-default"
      style={{
        border: '1px solid #1a4a1a',
        color: '#86efac',
        background: 'rgba(0, 255, 65, 0.04)',
        fontFamily: 'var(--font-geist-mono), monospace',
      }}
      onMouseEnter={e => {
        (e.target as HTMLElement).style.borderColor = '#22c55e'
        ;(e.target as HTMLElement).style.color = '#00ff41'
        ;(e.target as HTMLElement).style.background = 'rgba(0, 255, 65, 0.08)'
      }}
      onMouseLeave={e => {
        (e.target as HTMLElement).style.borderColor = '#1a4a1a'
        ;(e.target as HTMLElement).style.color = '#86efac'
        ;(e.target as HTMLElement).style.background = 'rgba(0, 255, 65, 0.04)'
      }}
    >
      {skill}
    </span>
  )
}

function ProjectCard({ project }: { project: typeof projects[number] }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group transition-all"
      style={{
        border: '1px solid #1a4a1a',
        background: 'rgba(0, 0, 0, 0.4)',
        padding: '1rem',
        fontFamily: 'var(--font-geist-mono), monospace',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 255, 65, 0.03)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.06)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = '#1a4a1a'
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(0, 0, 0, 0.4)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-bold" style={{ color: '#00ff41' }}>
          <span style={{ color: '#1a5c1a' }}>{'> '}</span>{project.title}
        </span>
        <span className="text-xs opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: '#00ff41' }}>
          [↗]
        </span>
      </div>
      <p className="text-xs mb-2.5" style={{ color: '#4ade80', opacity: 0.55 }}>{project.description}</p>
      <div className="flex flex-wrap gap-1">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="text-xs px-1.5 py-0.5"
            style={{ border: '1px solid #1a3a1a', color: '#22c55e', background: 'transparent' }}
          >
            {tech}
          </span>
        ))}
      </div>
    </a>
  )
}

export default function Home() {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background: '#040904',
        color: '#00ff41',
        fontFamily: 'var(--font-geist-mono), monospace',
      }}
    >
      <BinaryRain />

      {/* Scanlines */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      <div className="relative z-10 p-4 md:p-8">
        {/* Terminal prompt */}
        <div className="mb-6 text-xs" style={{ color: '#1a5c1a' }}>
          <span style={{ color: '#00ff41' }}>finn@portfolio</span>
          <span>:</span>
          <span style={{ color: '#4a90e2' }}>~</span>
          <span>$ </span>
          <span style={{ color: '#86efac' }}>./portfolio.sh</span>
          <span className="ml-1 animate-pulse">▊</span>
        </div>

        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <AsciiCard label="IDENTITY">
              <div className="mb-4">
                <h1
                  className="text-xl md:text-2xl font-bold mb-1"
                  style={{ color: '#00ff41', textShadow: '0 0 25px rgba(0, 255, 65, 0.4)' }}
                >
                  Finn Hettinga
                </h1>
                <p className="text-xs" style={{ color: '#4ade80', opacity: 0.6 }}>Software Developer</p>
              </div>

              <div className="mb-4 text-xs leading-relaxed space-y-1">
                <div>
                  <span style={{ color: '#1a5c1a' }}># </span>
                  <span style={{ color: '#86efac', opacity: 0.85 }}>Student Software Development • Firda Sneek</span>
                </div>
                <div>
                  <span style={{ color: '#1a5c1a' }}># </span>
                  <span style={{ color: '#86efac', opacity: 0.85 }}>Gespecialiseerd in backend en webapplicaties</span>
                </div>
              </div>

              <a
                href="mailto:contact@finnhettinga.nl"
                className="text-xs inline-block mb-5 transition-colors"
                style={{ color: '#4ade80' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = '#00ff41'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = '#4ade80'}
              >
                {'> '}contact@finnhettinga.nl
              </a>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://www.linkedin.com/in/finn-hettinga-742a30304/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-2 transition-all flex items-center justify-center gap-2 text-xs group"
                  style={{ border: '1px solid #1a4a1a', color: '#00ff41', background: 'rgba(0,255,65,0.04)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,255,65,0.08)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1a4a1a'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,255,65,0.04)'
                  }}
                >
                  <Image src="/linkedin.svg" alt="" width={13} height={13} style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(80deg)', opacity: 0.7 }} />
                  [LinkedIn]
                </a>
                <a
                  href="https://github.com/finnhet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 p-2 transition-all flex items-center justify-center gap-2 text-xs"
                  style={{ border: '1px solid #1a4a1a', color: '#00ff41', background: 'rgba(0,255,65,0.04)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#22c55e'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,255,65,0.08)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1a4a1a'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,255,65,0.04)'
                  }}
                >
                  <Image src="/github.svg" alt="" width={13} height={13} style={{ filter: 'brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(80deg)', opacity: 0.7 }} />
                  [GitHub]
                </a>
              </div>
            </AsciiCard>

            <AsciiCard label="SKILLS" className="flex-1">
              <div className="flex flex-wrap gap-1.5 mb-6">
                {skills.map((skill) => <SkillTag key={skill} skill={skill} />)}
              </div>

              <div className="text-xs mb-2.5" style={{ color: '#1a5c1a' }}>{'/* Aan het leren */'}</div>
              <div className="space-y-2">
                {learning.map((item) => (
                  <div key={item} className="text-xs flex items-center gap-2" style={{ color: '#86efac' }}>
                    <span style={{ color: '#00ff41' }}>$</span>
                    <span style={{ opacity: 0.7 }}>learning {item}...</span>
                  </div>
                ))}
              </div>
            </AsciiCard>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <AsciiCard label="OVER_MIJ">
              <p className="text-xs leading-relaxed" style={{ color: '#86efac' }}>
                <span style={{ color: '#00ff41', opacity: 0.5 }}>{'>> '}</span>
                Backend developer gespecialiseerd in moderne webapplicaties met Laravel, React en TypeScript.
              </p>
            </AsciiCard>

            <AsciiCard label="PROJECTEN" className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
              </div>
            </AsciiCard>
          </div>
        </div>

        <div className="text-center text-xs mt-8 mb-4" style={{ color: '#1a4a1a' }}>
          <span style={{ color: '#00ff41', opacity: 0.4 }}>~</span>
          {' © 2026 Finn Hettinga '}
          <span style={{ color: '#00ff41', opacity: 0.4 }}>~</span>
        </div>
      </div>
    </div>
  )
}
