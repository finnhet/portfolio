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

const skills = ['Laravel', 'React', 'PHP', 'TypeScript'] as const
const learning = ['Golang', 'Java', 'React Native'] as const
const COLORS = ['#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#fbbf24'] as const

const ParticleCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
    }

    const particles: Particle[] = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }))

    let animationId: number

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.6
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = dx * dx + dy * dy 

          if (dist < 22500) { 
            const actualDist = Math.sqrt(dist)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = 0.15 * (1 - actualDist / 150)
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      animationId = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', resizeCanvas)
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
})

const SkillBadge = memo(({ skill }: { skill: string }) => (
  <span className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-full border border-blue-500/30 hover:border-blue-400 transition-all">
    {skill}
  </span>
))

const LearningItem = memo(({ item }: { item: string }) => (
  <div className="text-sm text-slate-300 flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
    {item}
  </div>
))

const ProjectCard = memo(({ project }: { project: typeof projects[number] }) => (
  <a
    href={project.link}
    target="_blank"
    rel="noopener noreferrer"
    className="block group bg-slate-900/60 rounded-lg border border-slate-700/50 hover:border-blue-500/50 p-4 transition-all hover:scale-[1.02]"
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
        {project.title}
      </h3>
      <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </div>
    <p className="text-xs text-slate-400 mb-3">{project.description}</p>
    <div className="flex flex-wrap gap-1.5">
      {project.tech.map((tech) => (
        <span key={tech} className="px-2 py-0.5 text-xs bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
          {tech}
        </span>
      ))}
    </div>
  </a>
))

const Card = memo(({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-slate-800/60 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-xl ${className}`}>
    {children}
  </div>
))

export default function Home() {
  return (
    <div className="relative h-screen overflow-hidden bg-slate-900">
      <ParticleCanvas />
      
      <div className="relative z-10 min-h-screen flex flex-col p-3 md:p-8">
        <div className="flex-1 flex items-center justify-center py-4 md:py-0">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4 h-full max-h-[900px] overflow-y-auto md:overflow-hidden custom-scrollbar">
          
          {/* Left Column - Hero & Skills */}
          <div className="lg:col-span-1 flex flex-col gap-3 md:gap-4">
            <Card>
              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">Finn Hettinga</h1>
                  <p className="text-xs md:text-sm text-slate-400">Software Developer</p>
                </div>
              </div>
              
              <p className="text-xs md:text-sm text-slate-300 mb-2">
                18 jaar • Firda Sneek<br />
                Backend-focused developer, gepassioneerd over schaalbare en veilige software.
              </p>

              <a 
                href="mailto:contact@finnhettinga.nl" 
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors mb-3 inline-block"
              >
                contact@finnhettinga.nl
              </a>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mt-2">
                <a 
                  href="https://www.linkedin.com/in/finn-hettinga-742a30304/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-white text-xs md:text-sm"
                >
                  <Image src="/linkedin.svg" alt="LinkedIn" width={16} height={16} />
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/finnhet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-white text-xs md:text-sm"
                >
                  <Image src="/github.svg" alt="GitHub" width={16} height={16} />
                  GitHub
                </a>
              </div>
            </Card>

            <Card className="lg:flex-1">
              <h2 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-lg md:text-xl"></span>Skills
              </h2>
              <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                {skills.map((skill) => <SkillBadge key={skill} skill={skill} />)}
              </div>

              <h2 className="text-base md:text-lg font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
                Aan het leren
              </h2>
              <div className="space-y-2">
                {learning.map((item) => <LearningItem key={item} item={item} />)}
              </div>
            </Card>
          </div>          {/* Right Columns - Over Mij + Projects */}
          <div className="lg:col-span-2 flex flex-col gap-3 md:gap-4">
            <Card>
              <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 flex items-center gap-2">
                <span className="text-xl md:text-2xl"></span>Over Mij
              </h2>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                Hoi! Ik ben Finn, een student Software developer in Friesland.
                Ik ben gepassioneerd in het bouwen van websites en applicaties.
                Ik streef ernaar om mijn ideeën tot leven te brengen door middel van code.
              </p>
            </Card>

            <Card className="lg:flex-1 flex flex-col">
              <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                <span className="text-xl md:text-2xl"></span>Projecten
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
              </div>
            </Card>

          </div>

          </div>
        </div>

        {/* Footer - Stuck to bottom middle */}
        <div className="text-center text-xs text-slate-500 py-3 md:py-4 mt-2 md:mt-0">
          © 2025 Finn Hettinga
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </div>
  )
}
