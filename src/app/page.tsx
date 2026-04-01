'use client'
import { useEffect, useRef, useState, useCallback, memo } from 'react'
const GOLD = '#c4714f'
const GOLD_DIM = 'rgba(196, 113, 79, 0.25)'
const GOLD_GLOW = 'rgba(196, 113, 79, 0.07)'
const BLUE = '#7aad9b'
const BLUE_DIM = 'rgba(122, 173, 155, 0.22)'
const BLUE_GLOW = 'rgba(122, 173, 155, 0.07)'
const PURPLE = '#a89078'
const WHITE = '#ede8df'
const WHITE_DIM = 'rgba(237, 232, 223, 0.55)'

const projects = [
  {
    title: 'Portfolio',
    description: 'Modern portfolio website',
    link: 'https://github.com/finnhet/portfolio',
    tech: ['Next.js', 'TypeScript'],
    year: '2026',
  },
  {
    title: 'Stagecentrum',
    description: 'Platform voor stages',
    link: 'https://github.com/finnhet/stagecentrum',
    tech: ['React', 'Node.js'],
    year: '2025',
  },
  {
    title: 'AIboard',
    description: 'AI whiteboard tool',
    link: 'https://github.com/finnhet/whiteboardai',
    tech: ['AI', 'Canvas'],
    year: '2025',
  },
] as const

const skills = ['Laravel', 'React', 'PHP', 'TypeScript', 'React Native'] as const
const learning = ['Golang', 'Java'] as const

// ─── Particle Constellation ───────────────────────────────────────────────────
const ParticleField = memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; c: number }
    const N = 30
    const particles: P[] = Array.from({ length: N }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.3 + 0.08,
      c: Math.floor(Math.random() * 3),
    }))

    const pColor = (c: number, a: number) =>
      c === 0 ? `rgba(196,113,79,${a})`
      : c === 1 ? `rgba(122,173,155,${a})`
      : `rgba(168,144,120,${a})`

    let animId: number
    const draw = () => {
      animId = requestAnimationFrame(draw)
      ctx.clearRect(0, 0, w, h)

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = pColor(p.c, p.a)
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }
    }

    draw()
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.35, zIndex: 0 }}
    />
  )
})


// ─── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      if (glowRef.current) {
        glowRef.current.style.left = e.clientX + 'px'
        glowRef.current.style.top = e.clientY + 'px'
      }
    }

    const onDown = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '20px'
        ringRef.current.style.height = '20px'
        ringRef.current.style.opacity = '1'
      }
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1.8)'
    }
    const onUp = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '36px'
        ringRef.current.style.height = '36px'
        ringRef.current.style.opacity = '1'
      }
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
    }

    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + 'px'
        ringRef.current.style.top = ringPos.current.y + 'px'
      }
    }

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    animate()
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={glowRef} className="cursor-glow" style={{
        background: 'radial-gradient(circle, rgba(196,113,79,0.08) 0%, rgba(196,113,79,0.02) 40%, transparent 70%)',
      }} />
      <div className="cursor">
        <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed', transition: 'transform 0.1s ease' }} />
        <div ref={ringRef} className="cursor-ring" style={{ position: 'fixed' }} />
      </div>
    </>
  )
}

// ─── Scroll Reveal Hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}


// ─── 3D Tilt Project Card ──────────────────────────────────────────────────────
const CARD_ACCENTS = [GOLD, BLUE, PURPLE]

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const { ref: revealRef, visible } = useReveal()
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length]

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(30px)`
    el.style.boxShadow = `${-x * 30}px ${y * 30}px 60px ${accent}26, 0 0 40px ${accent}14`
    el.style.borderColor = accent
  }, [accent])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateZ(0)'
    el.style.boxShadow = 'none'
    el.style.borderColor = GOLD_DIM
  }, [])

  return (
    <div
      ref={revealRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.8s ease ${index * 0.18}s, transform 0.8s ease ${index * 0.18}s`,
      }}
    >
      <a
        ref={ref}
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          display: 'block',
          position: 'relative',
          border: `1px solid ${accent}44`,
          background: `${accent}08`,
          padding: '2.5rem',
          transition: 'transform 0.08s ease, box-shadow 0.08s ease, border-color 0.3s ease',
          overflow: 'hidden',
          textDecoration: 'none',
        }}
      >
        {/* Corner decorations */}
        {[
          { top: 10, left: 10, borderTop: true, borderLeft: true },
          { top: 10, right: 10, borderTop: true, borderRight: true },
          { bottom: 10, left: 10, borderBottom: true, borderLeft: true },
          { bottom: 10, right: 10, borderBottom: true, borderRight: true },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: c.top,
              left: c.left,
              right: c.right,
              bottom: c.bottom,
              width: 14,
              height: 14,
              borderTop: c.borderTop ? `1px solid ${accent}88` : undefined,
              borderBottom: c.borderBottom ? `1px solid ${accent}88` : undefined,
              borderLeft: c.borderLeft ? `1px solid ${accent}88` : undefined,
              borderRight: c.borderRight ? `1px solid ${accent}88` : undefined,
            }}
          />
        ))}

        {/* Shine effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '60%',
            height: '100%',
            background: 'linear-gradient(105deg, transparent 40%, rgba(196,113,79,0.06) 50%, transparent 60%)',
            transition: 'left 0.4s ease',
            pointerEvents: 'none',
          }}
          className="shine"
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.6rem',
              color: `${accent}99`,
              letterSpacing: '0.2em',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.6rem',
              color: `${accent}66`,
              letterSpacing: '0.1em',
            }}
          >
            {project.year}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: WHITE,
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem',
            lineHeight: 1,
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.7rem',
            color: WHITE_DIM,
            letterSpacing: '0.05em',
            marginBottom: '2rem',
          }}
        >
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.58rem',
                  padding: '0.2rem 0.7rem',
                  border: `1px solid ${accent}44`,
                  color: accent,
                  letterSpacing: '0.15em',
                  background: `${accent}0a`,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <span
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.7rem',
              color: accent,
              opacity: 0.75,
            }}
          >
            ↗
          </span>
        </div>
      </a>
    </div>
  )
}

// ─── Skills Marquee ────────────────────────────────────────────────────────────
function SkillsMarquee() {
  const all = [...skills, ...learning, ...skills, ...learning]
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: `1px solid rgba(196,113,79,0.1)`,
        borderBottom: `1px solid rgba(196,113,79,0.1)`,
        padding: '1.2rem 0',
        background: 'rgba(196,113,79,0.02)',
      }}
    >
      <div className="marquee-track" style={{ display: 'flex', gap: '0' }}>
        {[...all, ...all].map((s, i) => {
          const c = i % 5 === 0 ? GOLD : i % 5 === 2 ? BLUE : i % 5 === 4 ? PURPLE : WHITE_DIM
          const sep = i % 5 === 0 ? GOLD : i % 5 === 2 ? BLUE : PURPLE
          return (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.7rem',
                color: c,
                letterSpacing: '0.25em',
                padding: '0 2.5rem',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {s}
              <span style={{ color: `${sep}44`, margin: '0 0 0 2.5rem' }}>—</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

// ─── Stat Counter ──────────────────────────────────────────────────────────────
function StatBlock({ n, label, delay = 0, accent = GOLD }: { n: string; label: string; delay?: number; accent?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: `all 0.8s ease ${delay}s`,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-geist-sans)',
          fontSize: 'clamp(2.5rem, 5vw, 5rem)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: accent,
          textShadow: `0 0 40px ${accent}55`,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.58rem',
          color: WHITE_DIM,
          letterSpacing: '0.2em',
          marginTop: '0.5rem',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  )
}

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ num, title, align = 'left' }: { num: string; title: string; align?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '4rem',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.6rem',
            color: 'rgba(196,113,79,0.6)',
            letterSpacing: '0.3em',
            marginBottom: '0.75rem',
          }}
        >
          / {num}
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            color: WHITE,
            lineHeight: 0.95,
          }}
        >
          {title}
        </h2>
      </div>
    </div>
  )
}

// ─── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ padding: '0 clamp(1.5rem, 5vw, 5rem)', margin: '0', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,113,79,0.2))' }} />
      <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.55rem', color: 'rgba(196,113,79,0.45)', letterSpacing: '0.1em' }}>×</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(270deg, transparent, rgba(196,113,79,0.2))' }} />
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const [heroVisible, setHeroVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const aboutReveal = useReveal()
  const skillsReveal = useReveal()
  const contactReveal = useReveal()

  const P = 'clamp(1.5rem, 5vw, 5rem)'

  return (
    <div className="portfolio-root" style={{
      backgroundColor: '#0d0c0a',
      backgroundImage: 'radial-gradient(circle, rgba(196,113,79,0.1) 1px, transparent 1px)',
      backgroundSize: '30px 30px',
      color: WHITE,
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      {/* Backgrounds */}
      <ParticleField />
      <div className="noise-overlay" />
      <CustomCursor />

      {/* Ambient orbs — static, low opacity */}
      <div
        style={{
          position: 'fixed',
          top: '-15%',
          right: '-10%',
          width: 650,
          height: 650,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,113,79,0.13) 0%, rgba(196,113,79,0.04) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: '-20%',
          left: '-12%',
          width: 750,
          height: 750,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(122,173,155,0.11) 0%, rgba(122,173,155,0.03) 50%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ─── Nav ──────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: `1.5rem ${P}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(196,113,79,0.08)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            color: GOLD,
            opacity: 0.9,
          }}
        >
          FH
        </span>
        <div style={{ display: 'flex', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
          {['Work', 'About', 'Contact'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.2em',
                color: WHITE_DIM,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = GOLD)}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = WHITE_DIM)}
            >
              {item.toUpperCase()}
            </a>
          ))}
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: `0 ${P}`,
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.35em',
            color: 'rgba(196,113,79,0.7)',
            marginBottom: '2.5rem',
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'none' : 'translateY(16px)',
            transition: 'all 0.9s ease 0.1s',
          }}
        >
          — PORTFOLIO · 2026
        </div>

        <div style={{ overflow: 'hidden' }}>
          <h1
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 'clamp(5rem, 15vw, 18rem)',
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.05em',
              margin: 0,
              background: `linear-gradient(135deg, ${WHITE} 0%, ${GOLD} 25%, ${BLUE} 50%, ${WHITE} 70%, ${GOLD} 100%)`,
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 14s ease-in-out infinite',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(60px)',
              transition: 'opacity 1.1s ease 0.3s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            FINN
          </h1>
        </div>

        <div style={{ overflow: 'hidden' }}>
          <h1
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 'clamp(5rem, 15vw, 18rem)',
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.05em',
              margin: '0 0 3.5rem',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(122,173,155,0.5)',
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'none' : 'translateY(60px)',
              transition: 'opacity 1.1s ease 0.5s, transform 1.1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
            }}
          >
            HETTINGA
          </h1>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 1s ease 0.85s',
          }}
        >
          <div
            style={{
              width: 50,
              height: 1,
              background: `linear-gradient(90deg, ${GOLD}, transparent)`,
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.72rem',
              color: WHITE_DIM,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Software Developer &nbsp;·&nbsp; Backend Specialist
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: P,
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.55rem',
            color: 'rgba(196,113,79,0.4)',
            letterSpacing: '0.25em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            animation: 'pulseOpacity 2.5s ease-in-out infinite',
          }}
        >
          <span>SCROLL</span>
          <div
            style={{
              width: 1,
              height: 50,
              background: `linear-gradient(${GOLD}, transparent)`,
              animation: 'lineGrow 2.5s ease-in-out infinite',
            }}
          />
        </div>

        {/* Vertical sidebar text */}
        <div
          style={{
            position: 'absolute',
            right: `calc(${P} - 0.5rem)`,
            top: '50%',
            transform: 'translateY(-50%) rotate(90deg)',
            transformOrigin: 'center center',
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.48rem',
            letterSpacing: '0.4em',
            color: 'rgba(196,113,79,0.22)',
            whiteSpace: 'nowrap',
            opacity: heroVisible ? 1 : 0,
            transition: 'opacity 1s ease 1.2s',
          }}
        >
          BACKEND · DEVELOPER · NL · MMXXVI
        </div>

        {/* Copyright bottom-right */}
        <div
          style={{
            position: 'absolute',
            bottom: '3rem',
            right: P,
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.48rem',
            color: 'rgba(196,113,79,0.2)',
            letterSpacing: '0.2em',
          }}
        >
          © MMXXVI
        </div>
      </section>

      {/* ─── Skills Marquee ───────────────────────────────────── */}
      <SkillsMarquee />

      {/* ─── About ────────────────────────────────────────────── */}
      <section
        id="about"
        style={{ position: 'relative', padding: `8rem ${P}`, zIndex: 2, background: 'linear-gradient(180deg, transparent 0%, rgba(122,173,155,0.07) 50%, transparent 100%)' }}
      >
        <div
          ref={aboutReveal.ref}
          style={{
            opacity: aboutReveal.visible ? 1 : 0,
            transform: aboutReveal.visible ? 'none' : 'translateY(30px)',
            transition: 'all 1s ease',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 'clamp(2rem, 8vw, 8rem)',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {/* Left */}
            <div style={{ minWidth: 200 }}>
              <div
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.6rem',
                  color: 'rgba(196,113,79,0.6)',
                  letterSpacing: '0.3em',
                  marginBottom: '0.75rem',
                }}
              >
                / 01
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.2em',
                  color: WHITE_DIM,
                  textTransform: 'uppercase',
                  fontWeight: 400,
                }}
              >
                About
              </h2>

              <div style={{ marginTop: '5rem' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '0.55rem',
                    color: 'rgba(196,113,79,0.5)',
                    letterSpacing: '0.15em',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#00ff88',
                      boxShadow: '0 0 8px #00ff88',
                      animation: 'pulseOpacity 2s ease-in-out infinite',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.65rem',
                      color: 'rgba(237,232,223,0.55)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Available
                  </span>
                </div>
              </div>
            </div>

            {/* Right */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <p
                style={{
                  fontFamily: 'var(--font-geist-sans)',
                  fontSize: 'clamp(1.4rem, 3vw, 2.4rem)',
                  lineHeight: 1.35,
                  color: 'rgba(237,232,223,0.82)',
                  fontWeight: 300,
                  letterSpacing: '-0.02em',
                  marginBottom: '4rem',
                  margin: '0 0 4rem',
                }}
              >
                Backend developer gespecialiseerd in moderne webapplicaties met{' '}
                <span style={{ color: GOLD, fontWeight: 600 }}>Laravel</span>
                ,{' '}
                <span style={{ color: GOLD, fontWeight: 600 }}>React</span>
                {' '}en{' '}
                <span style={{ color: GOLD, fontWeight: 600 }}>TypeScript</span>
                .
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '2rem',
                  paddingTop: '3rem',
                  borderTop: '1px solid rgba(196,113,79,0.1)',
                }}
              >
                <StatBlock n="3+" label="Jaren Ervaring" delay={0.1} accent={GOLD} />
                <StatBlock n="10+" label="Projecten" delay={0.2} accent={BLUE} />
                <StatBlock n="5" label="Core Skills" delay={0.3} accent={PURPLE} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── Skills ───────────────────────────────────────────── */}
      <section
        id="skills"
        style={{ position: 'relative', padding: `8rem ${P}`, zIndex: 2, background: 'linear-gradient(180deg, transparent 0%, rgba(168,144,120,0.08) 50%, transparent 100%)' }}
      >
        <SectionLabel num="02" title="ARSENAL" />

        <div
          ref={skillsReveal.ref}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
        >
          {skills.map((skill, i) => {
            const isBlue = i % 2 === 1
            const accent = isBlue ? BLUE : GOLD
            const accentDim = isBlue ? BLUE_DIM : GOLD_DIM
            const accentGlow = isBlue ? BLUE_GLOW : GOLD_GLOW
            return (
              <div
                key={skill}
                style={{
                  padding: '0.85rem 2.25rem',
                  border: `1px solid ${accentDim}`,
                  color: WHITE_DIM,
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.2em',
                  background: accentGlow,
                  cursor: 'default',
                  transition: 'all 0.25s ease',
                  opacity: skillsReveal.visible ? 1 : 0,
                  transform: skillsReveal.visible ? 'none' : 'scale(0.88)',
                  transitionDelay: `${i * 0.07}s`,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.background = isBlue ? 'rgba(122,173,155,0.14)' : 'rgba(196,113,79,0.12)'
                  el.style.borderColor = accent
                  el.style.color = accent
                  el.style.boxShadow = `0 0 24px ${accent}22, inset 0 0 20px ${accent}0a`
                  el.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.background = accentGlow
                  el.style.borderColor = accentDim
                  el.style.color = WHITE_DIM
                  el.style.boxShadow = 'none'
                  el.style.transform = 'none'
                }}
              >
                {skill}
              </div>
            )
          })}
          {learning.map((skill, i) => (
            <div
              key={skill}
              style={{
                padding: '0.85rem 2.25rem',
                border: '1px dashed rgba(255,255,255,0.18)',
                color: 'rgba(237,232,223,0.45)',
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                cursor: 'default',
                opacity: skillsReveal.visible ? 0.75 : 0,
                transition: `all 0.5s ease ${(skills.length + i) * 0.07}s`,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {skill}
              <span
                style={{
                  fontSize: '0.5rem',
                  color: 'rgba(196,113,79,0.65)',
                  letterSpacing: '0.1em',
                  border: '1px solid rgba(196,113,79,0.4)',
                  padding: '0.1rem 0.5rem',
                }}
              >
                learning
              </span>
            </div>
          ))}
        </div>

        {/* Education detail */}
        <div
          style={{
            marginTop: '5rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.55rem',
              color: 'rgba(196,113,79,0.45)',
              letterSpacing: '0.2em',
              paddingTop: '0.15rem',
            }}
          >
            EDU
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.7rem',
                color: WHITE_DIM,
                letterSpacing: '0.05em',
              }}
            >
              Student Software Development
            </div>
            <div
              style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.6rem',
                color: 'rgba(237,232,223,0.42)',
                letterSpacing: '0.1em',
                marginTop: '0.3rem',
              }}
            >
              Firda · Sneek
            </div>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── Projects ─────────────────────────────────────────── */}
      <section
        id="work"
        style={{ position: 'relative', padding: `8rem ${P}`, zIndex: 2 }}
      >
        <SectionLabel num="03" title="WORK" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      <Divider />

      {/* ─── Contact ──────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          position: 'relative',
          padding: `8rem ${P} 10rem`,
          zIndex: 2,
        }}
      >
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(122,173,155,0.07) 0%, rgba(196,113,79,0.05) 50%, transparent 75%)',
          pointerEvents: 'none',
        }} />

        <div
          ref={contactReveal.ref}
          style={{
            opacity: contactReveal.visible ? 1 : 0,
            transform: contactReveal.visible ? 'none' : 'translateY(40px)',
            transition: 'all 1s ease',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.6rem',
              color: 'rgba(196,113,79,0.7)',
              letterSpacing: '0.3em',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            / 04 — CONTACT
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 'clamp(3.5rem, 12vw, 12rem)',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.9,
              margin: '0 0 5rem',
              textAlign: 'center',
              background: `linear-gradient(135deg, ${WHITE} 0%, ${GOLD} 40%, ${WHITE} 70%)`,
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 10s ease-in-out infinite',
            }}
          >
            LET&rsquo;S TALK
          </h2>

          {/* Central contact card */}
          <div style={{
            maxWidth: 680,
            margin: '0 auto',
            border: '1px solid rgba(122,173,155,0.22)',
            background: 'linear-gradient(135deg, rgba(122,173,155,0.05) 0%, rgba(196,113,79,0.04) 100%)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            position: 'relative',
          }}>
            {/* Corner accents */}
            {[
              { top: -1, left: -1, borderTop: true, borderLeft: true },
              { top: -1, right: -1, borderTop: true, borderRight: true },
              { bottom: -1, left: -1, borderBottom: true, borderLeft: true },
              { bottom: -1, right: -1, borderBottom: true, borderRight: true },
            ].map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: c.top, left: c.left, right: c.right, bottom: c.bottom,
                width: 20, height: 20,
                borderTop: c.borderTop ? `2px solid ${BLUE}` : undefined,
                borderBottom: c.borderBottom ? `2px solid ${GOLD}` : undefined,
                borderLeft: c.borderLeft ? `2px solid ${BLUE}` : undefined,
                borderRight: c.borderRight ? `2px solid ${GOLD}` : undefined,
              }} />
            ))}

            {/* Email */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: '0.55rem',
                color: 'rgba(196,113,79,0.6)',
                letterSpacing: '0.3em',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}>
                Email
              </div>
              <a
                href="mailto:contact@finnhettinga.nl"
                style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                  color: WHITE,
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                  transition: 'color 0.25s',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = GOLD)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = WHITE)}
              >
                contact@finnhettinga.nl
              </a>
            </div>

            {/* Divider line */}
            <div style={{
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(196,113,79,0.3), transparent)',
              marginBottom: '2.5rem',
            }} />

            {/* Social links */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { label: 'LinkedIn', sub: '/in/finn-hettinga', href: 'https://www.linkedin.com/in/finn-hettinga-742a30304/' },
                { label: 'GitHub', sub: '/finnhet', href: 'https://github.com/finnhet' },
              ].map(({ label, sub, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: '1 1 200px',
                    textDecoration: 'none',
                    border: '1px solid rgba(196,113,79,0.2)',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(196,113,79,0.03)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = GOLD
                    el.style.background = 'rgba(196,113,79,0.09)'
                    el.style.boxShadow = '0 0 20px rgba(196,113,79,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = 'rgba(196,113,79,0.2)'
                    el.style.background = 'rgba(196,113,79,0.03)'
                    el.style.boxShadow = 'none'
                  }}
                >
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.75rem',
                      color: WHITE,
                      letterSpacing: '0.15em',
                      marginBottom: '0.2rem',
                    }}>
                      {label}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.58rem',
                      color: 'rgba(237,232,223,0.45)',
                      letterSpacing: '0.05em',
                    }}>
                      {sub}
                    </div>
                  </div>
                  <span style={{ color: GOLD, fontSize: '1rem', opacity: 0.8 }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          padding: `2rem ${P}`,
          borderTop: '1px solid rgba(255,255,255,0.04)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.55rem',
            color: 'rgba(237,232,223,0.3)',
            letterSpacing: '0.2em',
          }}
        >
          © 2026 FINN HETTINGA
        </span>
        <span
          style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.55rem',
            color: 'rgba(237,232,223,0.3)',
            letterSpacing: '0.2em',
          }}
        >
          SOFTWARE DEVELOPER · NL
        </span>
      </footer>
    </div>
  )
}
