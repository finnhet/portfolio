import Image from 'next/image'

interface CatImage {
  id: string
  url: string
  width: number
  height: number
}

async function getDailyCat(): Promise<CatImage> {
  const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=1', {
    headers: {
      'x-api-key': process.env.CAT_API_KEY!,
    },
    next: {
      revalidate: 86400, // cache for 24 hours — new cat every day
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch cat')
  }

  const data: CatImage[] = await res.json()
  return data[0]
}

export default async function DailyCatPage() {
  let cat: CatImage | null = null
  try {
    cat = await getDailyCat()
  } catch {
    // API unavailable or key missing — show fallback
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (!cat) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0a18',
        fontFamily: 'var(--font-geist-mono), monospace',
        color: '#4c3a6e',
      }}>
        <pre style={{ color: '#7c3aed', fontSize: '0.75rem', marginBottom: '1rem', opacity: 0.5 }}>{`  /\\_____/\\
 (  x   x  )
 =( Y . Y )=`}</pre>
        <p style={{ color: '#4c3a6e', fontSize: '0.8rem' }}>no cat today :(</p>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1.5rem',
        background: '#0d0a18',
        fontFamily: 'var(--font-geist-mono), monospace',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ASCII cat art */}
      <pre
        style={{
          color: '#7c3aed',
          fontSize: '0.75rem',
          lineHeight: 1.5,
          marginBottom: '0.75rem',
          opacity: 0.7,
          userSelect: 'none',
          textAlign: 'center',
        }}
      >{`  /\\_____/\\
 (  o   o  )
 =( Y . Y )=
  )       (
 (_)-(_)-(_)`}</pre>

      <h1
        style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '0.25rem',
          color: '#a78bfa',
          letterSpacing: '0.05em',
          textShadow: '0 0 30px rgba(167, 139, 250, 0.4)',
        }}
      >
        =^.^= daily cat =^.^=
      </h1>

      <p
        style={{
          fontSize: '0.72rem',
          color: '#4c3a6e',
          marginBottom: '2.5rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {today}
      </p>

      {/* Image frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          padding: '12px',
        }}
      >
        {/* Corner chars */}
        <span style={{ position: 'absolute', top: 0, left: 0, color: '#7c3aed', fontSize: '1rem', opacity: 0.6, lineHeight: 1 }}>╔══</span>
        <span style={{ position: 'absolute', top: 0, right: 0, color: '#7c3aed', fontSize: '1rem', opacity: 0.6, lineHeight: 1 }}>══╗</span>
        <span style={{ position: 'absolute', bottom: 0, left: 0, color: '#7c3aed', fontSize: '1rem', opacity: 0.6, lineHeight: 1 }}>╚══</span>
        <span style={{ position: 'absolute', bottom: 0, right: 0, color: '#7c3aed', fontSize: '1rem', opacity: 0.6, lineHeight: 1 }}>══╝</span>

        <div
          style={{
            position: 'relative',
            width: '100%',
            borderRadius: '4px',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.2), 0 8px 40px rgba(0,0,0,0.6)',
            aspectRatio: `${cat.width} / ${cat.height}`,
            border: '1px solid rgba(139, 92, 246, 0.25)',
          }}
        >
          <Image
            src={cat.url}
            alt="Cat of the day"
            fill
            style={{ objectFit: 'cover' }}
            priority
            unoptimized
          />
        </div>
      </div>

      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.7rem',
          color: '#2d1f4a',
          letterSpacing: '0.08em',
        }}
      >
      </p>
    </main>
  )
}
