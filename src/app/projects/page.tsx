import Header from '../components/Header'

const projects = [
  {
    title: 'Portfolio Website',
    description: 'Mooie portfolio',
    link: 'https://github.com/finnhet/portfolio'
  },
  {
    title: 'Stagecentrum',
    description: 'Een betere manier om stages te zoeken',
    link: 'https://github.com/finnhet/stagecentrum'
  },
  {
    title: 'AIboard',
    description: 'Verbeterde samenwerking',
    link: 'https://github.com/finnhet/whiteboardai'
  },
]

export default function Projects() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Header />
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32">
        <h1 className="text-4xl font-bold mb-10">Mijn Projecten</h1>

        <div className="grid gap-6">
          {projects.map((project, index) => (
            <a
              key={index}
              href={project.link}
              target="_blank"
              className="block bg-gray-900 p-6 rounded-xl border border-gray-700 hover:border-blue-400 transition"
            >
              <h2 className="text-2xl font-semibold text-white">{project.title}</h2>
              <p className="text-gray-400 mt-2">{project.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
