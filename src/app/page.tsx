'use client'
import { useEffect, useRef, useState } from 'react'

const FG = '#f2ede5'
const COPPER = '#d4845a'
const DIM = 'rgba(242,237,229,0.45)'
const DIM2 = 'rgba(242,237,229,0.22)'

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

// ─── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }
    const onDown = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '16px'
        ringRef.current.style.height = '16px'
      }
    }
    const onUp = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '30px'
        ringRef.current.style.height = '30px'
      }
    }
    let raf: number
    const animate = () => {
      raf = requestAnimationFrame(animate)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.12
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
    <div className="cursor">
      <div ref={dotRef} className="cursor-dot" style={{ position: 'fixed' }} />
      <div ref={ringRef} className="cursor-ring" style={{ position: 'fixed' }} />
    </div>
  )
}

// ─── Scroll Reveal ─────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

// ─── Project Row ───────────────────────────────────────────────────────────────
function ProjectRow({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const { ref, visible } = useReveal()
  const [hovered, setHovered] = useState(false)

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : 'translateY(14px)',
      transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s ease ${index * 0.12}s`,
    }}>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'grid',
          gridTemplateColumns: '3rem 1fr auto auto 2.5rem',
          alignItems: 'center',
          gap: '2rem',
          padding: '1.75rem 0',
          paddingLeft: hovered ? '1.25rem' : '0',
          textDecoration: 'none',
          borderTop: '1px solid rgba(242,237,229,0.07)',
          position: 'relative',
          transition: 'padding-left 0.3s ease',
        }}
      >
        {/* Copper accent bar */}
        <div style={{
          position: 'absolute',
          left: 0, top: 0, bottom: 0,
          width: '2px', background: COPPER,
          transform: hovered ? 'scaleY(1)' : 'scaleY(0)',
          transformOrigin: 'top',
          transition: 'transform 0.3s ease',
        }} />

        {/* Index */}
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.58rem',
          color: hovered ? COPPER : DIM2,
          letterSpacing: '0.2em',
          transition: 'color 0.25s',
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>

        {/* Title + description */}
        <div>
          <div style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
            fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1,
            color: hovered ? COPPER : FG,
            transition: 'color 0.25s',
          }}>
            {project.title}
          </div>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.58rem', color: DIM, letterSpacing: '0.06em', marginTop: '0.3rem',
          }}>
            {project.description}
          </div>
        </div>

        {/* Tech tags */}
        <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.52rem', color: DIM, letterSpacing: '0.12em',
              padding: '0.18rem 0.6rem',
              border: '1px solid rgba(242,237,229,0.1)',
            }}>{t}</span>
          ))}
        </div>

        {/* Year */}
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.58rem', color: DIM2, letterSpacing: '0.1em',
        }}>
          {project.year}
        </span>

        {/* Arrow */}
        <span style={{
          color: hovered ? COPPER : DIM2, fontSize: '0.9rem',
          display: 'inline-block',
          transition: 'color 0.25s, transform 0.25s',
          transform: hovered ? 'translate(3px, -3px)' : 'none',
        }}>↗</span>
      </a>
    </div>
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const aboutReveal = useReveal()
  const contactReveal = useReveal()

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 80)
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const P = 'clamp(1.5rem, 5vw, 6rem)'

  return (
    <div className="portfolio-root" style={{
      backgroundColor: '#0e0c0b',
      color: FG,
      minHeight: '100vh',
      overflowX: 'hidden',
    }}>
      <div className="noise-overlay" />
      <CustomCursor />

      {/* Static ambient light sources */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 55% 45% at 92% 4%, rgba(212,132,90,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 45% 55% at 4% 96%, rgba(143,179,167,0.06) 0%, transparent 60%)
        `,
      }} />

      {/* ─── Nav ──────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: `1.5rem ${P}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: scrolled ? 'rgba(14,12,11,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(242,237,229,0.05)' : 'none',
        transition: 'all 0.4s ease',
      }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.62rem', letterSpacing: '0.3em', color: COPPER,
        }}>FH</span>
        <div style={{ display: 'flex', gap: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
          {['Work', 'About', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.58rem', letterSpacing: '0.2em',
              color: DIM, textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = FG)}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = DIM)}
            >{item.toUpperCase()}</a>
          ))}
        </div>
      </nav>

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', height: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `0 ${P}`, zIndex: 2, overflow: 'hidden',
      }}>
        {/* Giant watermark number */}
        <div aria-hidden style={{
          position: 'absolute', right: '-3%', top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-geist-sans)',
          fontSize: 'clamp(18rem, 48vw, 62rem)',
          fontWeight: 900, lineHeight: 1,
          color: 'rgba(212,132,90,0.028)',
          userSelect: 'none', pointerEvents: 'none',
          letterSpacing: '-0.07em',
        }}>01</div>

        {/* Date tag */}
        <div style={{
          position: 'absolute', top: '7rem', left: P,
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.5rem', letterSpacing: '0.38em', color: 'rgba(212,132,90,0.45)',
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.1s',
        }}>
          FH · PORTFOLIO · MMXXVI
        </div>

        {/* FINN — left aligned, cream */}
        <h1 style={{
          fontFamily: 'var(--font-geist-sans)',
          fontSize: 'clamp(4.5rem, 15vw, 19rem)',
          fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.05em',
          margin: 0, color: FG,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'none' : 'translateY(40px)',
          transition: 'opacity 1s ease 0.2s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
        }}>FINN</h1>

        {/* HETTINGA — right aligned, copper outline */}
        <h1 style={{
          fontFamily: 'var(--font-geist-sans)',
          fontSize: 'clamp(4.5rem, 15vw, 19rem)',
          fontWeight: 900, lineHeight: 0.88, letterSpacing: '-0.05em',
          margin: '0 0 3.5rem',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(212,132,90,0.55)',
          textAlign: 'right',
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'none' : 'translateY(40px)',
          transition: 'opacity 1s ease 0.4s, transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
        }}>HETTINGA</h1>

        {/* Subtitle with flanking lines */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.5rem',
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 0.8s ease 0.75s',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(242,237,229,0.09)' }} />
          <span style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.62rem', color: DIM,
            letterSpacing: '0.22em', textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>
            Backend Developer &nbsp;·&nbsp; NL
          </span>
          <div style={{ width: 40, height: '1px', background: 'rgba(242,237,229,0.09)' }} />
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '3rem', left: P,
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.48rem', color: 'rgba(212,132,90,0.35)',
          letterSpacing: '0.3em',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem',
          animation: 'pulseOpacity 3s ease-in-out infinite',
        }}>
          <span>SCROLL</span>
          <div style={{
            width: 1, height: 36,
            background: `linear-gradient(${COPPER}, transparent)`,
            animation: 'lineGrow 3s ease-in-out infinite',
          }} />
        </div>

        {/* Vertical sidebar text */}
        <div aria-hidden style={{
          position: 'absolute',
          right: 0, top: '50%',
          transform: 'translateY(-50%) rotate(90deg)',
          transformOrigin: 'center center',
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.44rem', letterSpacing: '0.45em',
          color: 'rgba(212,132,90,0.18)',
          whiteSpace: 'nowrap',
          opacity: heroVisible ? 1 : 0,
          transition: 'opacity 1s ease 1.1s',
          pointerEvents: 'none',
        }}>
          SOFTWARE DEVELOPER · FIRDA · SNEEK · NL
        </div>
      </section>

      {/* ─── Skills marquee ───────────────────────────────────── */}
      <div style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(242,237,229,0.06)',
        borderBottom: '1px solid rgba(242,237,229,0.06)',
        padding: '0.9rem 0',
        position: 'relative', zIndex: 2,
      }}>
        <div className="marquee-track" style={{ gap: 0 }}>
          {[...skills, ...learning, ...skills, ...learning, ...skills, ...learning].map((s, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.6rem',
              color: i % 3 === 1 ? 'rgba(212,132,90,0.55)' : DIM,
              letterSpacing: '0.28em',
              padding: '0 2rem',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              {s}<span style={{ margin: '0 0 0 2rem', color: 'rgba(242,237,229,0.18)' }}>/</span>
            </span>
          ))}
        </div>
      </div>

      {/* ─── Work ─────────────────────────────────────────────── */}
      <section id="work" style={{ position: 'relative', padding: `8rem ${P}`, zIndex: 2 }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: '3rem',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-geist-mono)',
              fontSize: '0.52rem', color: 'rgba(212,132,90,0.55)',
              letterSpacing: '0.38em', marginBottom: '0.5rem',
            }}>/ 01</div>
            <h2 style={{
              fontFamily: 'var(--font-geist-sans)',
              fontSize: 'clamp(2.5rem, 6vw, 6rem)',
              fontWeight: 900, letterSpacing: '-0.04em',
              color: FG, lineHeight: 0.95, margin: 0,
            }}>WORK</h2>
          </div>
          <span style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.52rem', color: DIM2, letterSpacing: '0.15em',
          }}>
            {projects.length} PROJECTS
          </span>
        </div>

        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
        <div style={{ borderTop: '1px solid rgba(242,237,229,0.07)' }} />
      </section>

      {/* ─── Divider ──────────────────────────────────────────── */}
      <div style={{ padding: `0 ${P}`, position: 'relative', zIndex: 2 }}>
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,132,90,0.14), transparent)',
        }} />
      </div>

      {/* ─── About ────────────────────────────────────────────── */}
      <section id="about" style={{ position: 'relative', padding: `8rem ${P}`, zIndex: 2 }}>
        <div ref={aboutReveal.ref} style={{
          opacity: aboutReveal.visible ? 1 : 0,
          transform: aboutReveal.visible ? 'none' : 'translateY(20px)',
          transition: 'all 0.9s ease',
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.52rem', color: 'rgba(212,132,90,0.55)',
            letterSpacing: '0.38em', marginBottom: '0.5rem',
          }}>/ 02</div>
          <h2 style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: FG, lineHeight: 0.95, margin: '0 0 5rem',
          }}>ABOUT</h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(3rem, 8vw, 10rem)' }}>

            {/* Left: statement */}
            <div style={{ flex: '1 1 260px' }}>
              <p style={{
                fontFamily: 'var(--font-geist-sans)',
                fontSize: 'clamp(1.2rem, 2.2vw, 1.9rem)',
                lineHeight: 1.45, fontWeight: 300,
                color: 'rgba(242,237,229,0.8)',
                letterSpacing: '-0.01em', margin: 0,
              }}>
                Backend developer gespecialiseerd in moderne webapplicaties met{' '}
                <span style={{ color: COPPER, fontWeight: 500 }}>Laravel</span>,{' '}
                <span style={{ color: COPPER, fontWeight: 500 }}>React</span>{' '}en{' '}
                <span style={{ color: COPPER, fontWeight: 500 }}>TypeScript</span>.
              </p>
            </div>

            {/* Right: details column */}
            <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

              {/* Status */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.48rem', color: 'rgba(212,132,90,0.5)',
                  letterSpacing: '0.28em', marginBottom: '0.7rem',
                }}>STATUS</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: '#00e876', boxShadow: '0 0 6px #00e876',
                    animation: 'pulseOpacity 2s ease-in-out infinite',
                  }} />
                  <span style={{
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: '0.63rem', color: DIM, letterSpacing: '0.06em',
                  }}>Available for projects</span>
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, auto)',
                gap: '2rem', alignItems: 'start',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(242,237,229,0.06)',
              }}>
                {[{ n: '3+', label: 'Years' }, { n: '10+', label: 'Projects' }, { n: '5', label: 'Skills' }].map(({ n, label }) => (
                  <div key={label}>
                    <div style={{
                      fontFamily: 'var(--font-geist-sans)',
                      fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                      fontWeight: 900, letterSpacing: '-0.04em',
                      color: COPPER, lineHeight: 1,
                    }}>{n}</div>
                    <div style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.5rem', color: DIM2,
                      letterSpacing: '0.22em', marginTop: '0.3rem', textTransform: 'uppercase',
                    }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Skills list */}
              <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(242,237,229,0.06)' }}>
                <div style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.48rem', color: 'rgba(212,132,90,0.5)',
                  letterSpacing: '0.28em', marginBottom: '0.9rem',
                }}>SKILLS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {skills.map(s => (
                    <div key={s} style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.63rem', color: DIM, letterSpacing: '0.08em',
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                    }}>
                      <span style={{ color: COPPER, fontSize: '0.38rem' }}>●</span>{s}
                    </div>
                  ))}
                  {learning.map(s => (
                    <div key={s} style={{
                      fontFamily: 'var(--font-geist-mono)',
                      fontSize: '0.63rem', color: 'rgba(242,237,229,0.28)',
                      letterSpacing: '0.08em',
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                    }}>
                      <span style={{ color: 'rgba(212,132,90,0.28)', fontSize: '0.38rem' }}>○</span>
                      {s}
                      <span style={{ fontSize: '0.44rem', color: 'rgba(212,132,90,0.4)', letterSpacing: '0.08em' }}>learning</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(242,237,229,0.06)' }}>
                <div style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.48rem', color: 'rgba(212,132,90,0.5)',
                  letterSpacing: '0.28em', marginBottom: '0.7rem',
                }}>EDUCATION</div>
                <div style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.63rem', color: DIM, letterSpacing: '0.04em',
                }}>Student Software Development</div>
                <div style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.56rem', color: DIM2, letterSpacing: '0.06em', marginTop: '0.25rem',
                }}>Firda · Sneek</div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─── Divider ──────────────────────────────────────────── */}
      <div style={{ padding: `0 ${P}`, position: 'relative', zIndex: 2 }}>
        <div style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(212,132,90,0.14), transparent)',
        }} />
      </div>

      {/* ─── Contact ──────────────────────────────────────────── */}
      <section id="contact" style={{ position: 'relative', padding: `8rem ${P} 10rem`, zIndex: 2 }}>
        <div ref={contactReveal.ref} style={{
          opacity: contactReveal.visible ? 1 : 0,
          transform: contactReveal.visible ? 'none' : 'translateY(20px)',
          transition: 'all 0.9s ease',
        }}>
          <div style={{
            fontFamily: 'var(--font-geist-mono)',
            fontSize: '0.52rem', color: 'rgba(212,132,90,0.55)',
            letterSpacing: '0.38em', marginBottom: '0.5rem',
          }}>/ 03</div>
          <h2 style={{
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 'clamp(2.5rem, 6vw, 6rem)',
            fontWeight: 900, letterSpacing: '-0.04em',
            color: FG, lineHeight: 0.95, margin: '0 0 4rem',
          }}>CONTACT</h2>

          {/* Large email */}
          <a href="mailto:contact@finnhettinga.nl" style={{
            display: 'block',
            fontFamily: 'var(--font-geist-sans)',
            fontSize: 'clamp(1.4rem, 4.5vw, 4rem)',
            fontWeight: 700, letterSpacing: '-0.025em',
            color: FG, textDecoration: 'none',
            paddingBottom: '2rem', marginBottom: '3.5rem',
            borderBottom: '1px solid rgba(242,237,229,0.1)',
            transition: 'color 0.25s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = COPPER)}
          onMouseLeave={e => (e.currentTarget.style.color = FG)}
          >
            contact@finnhettinga.nl
          </a>

          {/* Social links */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {[
              { label: 'LinkedIn', sub: '/in/finn-hettinga', href: 'https://www.linkedin.com/in/finn-hettinga-742a30304/' },
              { label: 'GitHub', sub: '/finnhet', href: 'https://github.com/finnhet' },
            ].map(({ label, sub, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', flexDirection: 'column', gap: '0.2rem',
                textDecoration: 'none',
                padding: '1.25rem 2rem',
                minWidth: '180px',
                border: '1px solid rgba(242,237,229,0.07)',
                transition: 'border-color 0.25s, background 0.25s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(212,132,90,0.35)'
                e.currentTarget.style.background = 'rgba(212,132,90,0.04)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(242,237,229,0.07)'
                e.currentTarget.style.background = 'transparent'
              }}
              >
                <span style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.68rem', color: FG, letterSpacing: '0.12em',
                }}>{label} ↗</span>
                <span style={{
                  fontFamily: 'var(--font-geist-mono)',
                  fontSize: '0.54rem', color: DIM2, letterSpacing: '0.04em',
                }}>{sub}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}
      <footer style={{
        padding: `2rem ${P}`,
        borderTop: '1px solid rgba(242,237,229,0.04)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
        position: 'relative', zIndex: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.5rem', color: DIM2, letterSpacing: '0.2em',
        }}>© 2026 FINN HETTINGA</span>
        <span style={{
          fontFamily: 'var(--font-geist-mono)',
          fontSize: '0.5rem', color: DIM2, letterSpacing: '0.2em',
        }}>SOFTWARE DEVELOPER · NL</span>
      </footer>
    </div>
  )
}
