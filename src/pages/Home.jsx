import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"

const Home = () => {
  const [activeHackathons, setActiveHackathons] = useState([])
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  // const [stats, setStats] = useState({
  //   totalHackathons: 20,
  //   totalUsers: 50,
  //   totalProjects: 10,
  // })
  const role = localStorage.getItem("role")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackathonsRes, projectsRes] = await Promise.all([
          axios.get("https://devpost-back.onrender.com/api/hackathons?status=active"),
          // axios.get("https://devpost-back.onrender.com/api/projects?featured=true"),
          // We need to think about implementing the logic for a project to be featured.
          axios.get("https://devpost-back.onrender.com/api/projects"),
          // axios.get("https://devpost-back.onrender.com/api/stats"), //New API endpoint for stats
        ])

        console.log("Featured projects response:", projectsRes.data);

         // Sort hackathons by createdAt date (newest first)
      const sortedHackathons = [...hackathonsRes.data].sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      )
      // Sort projects by createdAt date (newest first)
      // const sortedProjects = [...projectsRes.data].sort(
      //   (a, b) => new Date(b.startDate) - new Date(a.startDate)
      // )
        // setActiveHackathons(hackathonsRes.data.slice(0, 3))
        setActiveHackathons(sortedHackathons.slice(0, 3))
        // setFeaturedProjects(projectsRes.data.slice(0, 3))
        setFeaturedProjects(projectsRes.data.slice(0, 3))
        // setStats(statsRes.data);
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl py-16 px-8 mb-12">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          </svg>
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Build. Compete. Innovate.</h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join the most exciting hackathons and showcase your technical skills to the world
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/hackathons"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Hackathons
            </Link>
            {role === "admin" && (
              <Link
                to="/create-hackathon"
                className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Hackathon
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition hover:scale-105">
            <div className="text-4xl font-bold text-blue-600 mb-2">
            {/* {  stats.totalHackathons >= 50 ? `${stats.totalHackathons}+` : stats.totalHackathons} */}
            {/* {stats.totalHackathons} */}
              20+
            </div>
            <div className="text-gray-600">Hackathons Hosted</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition hover:scale-105">
            <div className="text-4xl font-bold text-purple-600 mb-2">
            {/* {stats.totalUsers >= 1000 ? `${stats.totalUsers}+` : stats.totalUsers} */}
            {/* {stats.totalUsers} */}
              100+
              </div>
            <div className="text-gray-600">Registered Users</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center transform transition hover:scale-105">
            <div className="text-4xl font-bold text-green-600 mb-2">
            {/* {stats.totalProjects >= 300 ? `${stats.totalProjects}+` : stats.totalProjects} */}
            {/* {stats.totalProjects} */}
              10+
              </div>
            <div className="text-gray-600">Projects Submitted</div>
          </div>
        </div>
      </section>

      {/* Active Hackathons */}
      <section className="py-8 mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Active Hackathons
          </h2>
          <Link to="/hackathons" className="text-blue-600 hover:text-blue-800 font-medium flex items-center group">
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeHackathons.length > 0 ? (
            activeHackathons.map((hackathon) => (
              <div
                key={hackathon._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={hackathon.imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={hackathon.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="text-sm font-medium bg-blue-600 rounded-full px-3 py-1 inline-block">Active</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">{hackathon.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(hackathon.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <Link to={`/hackathons/${hackathon._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500">No active hackathons at the moment.</p>
              <Link to="/hackathons" className="mt-4 inline-block text-blue-600 hover:underline">
                Browse all hackathons
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-8 mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            Featured Projects
          </h2>
          <Link to="/projects" className="text-purple-600 hover:text-purple-800 font-medium flex items-center group">
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.length > 0 ? (
            featuredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={project.imageUrl || "/placeholder.svg?height=200&width=400"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {project.hackathon?.title || "Hackathon Project"}
                    </span>
                    <Link to={`/projects/${project._id}`} className="text-purple-600 hover:text-purple-800 font-medium">
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-500">No featured projects at the moment.</p>
              <Link to="/projects" className="mt-4 inline-block text-purple-600 hover:underline">
                Browse all projects
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white mb-12">
        <div className="text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Join our community of developers and innovators today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!localStorage.getItem("token") ? (
              <>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to="/hackathons"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Join a Hackathon
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

