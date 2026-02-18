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
  const cat = await getDailyCat()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
        }}
      >
        Daily Cat
      </h1>
      <p
        style={{
          fontSize: '0.9rem',
          opacity: 0.5,
          marginBottom: '2rem',
        }}
      >
        {today}
      </p>
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          borderRadius: '1rem',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          aspectRatio: `${cat.width} / ${cat.height}`,
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
    </main>
  )
}
