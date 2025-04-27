import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import LoadingSpinner from '../components/LoadingSpinner'
// import ErrorMessage from '../components/ErrorMessage'

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`https://devpost-back.onrender.com/api/projects/${id}`)
        setProject(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load project details')
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-blue-600 flex items-center"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Projects
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Project Header */}
        <div className="relative h-64 bg-gray-100">
          <img
            src={project.imageUrl || '/default-project.png'}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/default-project.png'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <div className="flex items-center space-x-4">
              {project.hackathon && (
                <Link 
                  to={`/hackathons/${project.hackathon._id}`}
                  className="bg-blue-600 px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition"
                >
                  {project.hackathon.title}
                </Link>
              )}
              {project.featured && (
                <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
                  Featured Project
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Project Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Project Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap mb-8">{project.description}</p>

            {project.technicalDetails && (
              <>
                <h3 className="text-xl font-bold mb-4">Technical Details</h3>
                <div className="prose max-w-none mb-8">
                  <pre className="whitespace-pre-wrap">{project.technicalDetails}</pre>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Project Details</h3>
              
              <div className="space-y-4">
                {project.teamMembers && project.teamMembers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Team Members</h4>
                    <ul className="space-y-2">
                      {project.teamMembers.map((member, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-gray-700">{member}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.githubRepo && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">GitHub Repository</h4>
                    <a
                      href={project.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {project.githubRepo}
                    </a>
                  </div>
                )}

                {project.demoVideo && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-2">Demo Video</h4>
                    <a
                      href={project.demoVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      Watch Demo
                    </a>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2">Submitted On</h4>
                  <p className="text-gray-700">
                    {new Date(project.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails