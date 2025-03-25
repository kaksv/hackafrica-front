"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"
import { Link } from "react-router-dom"

const Profile = () => {
  const [user, setUser] = useState(null)
  const [userProjects, setUserProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("You must be logged in to view your profile")
          setLoading(false)
          return
        }

        const [userResponse, projectsResponse] = await Promise.all([
          axios.get("https://devpost-back.onrender.com/api/users/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://devpost-back.onrender.com/api/projects/user", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        setUser(userResponse.data)
        setUserProjects(projectsResponse.data || [])
      } catch (error) {
        console.error("Error fetching profile:", error)
        setError("Failed to load profile data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        {!localStorage.getItem("token") && (
          <div className="mt-4">
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            {" or "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-yellow-700">
        <h2 className="text-xl font-bold mb-2">Profile Not Found</h2>
        <p>Unable to load profile information.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account and view your projects</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
            <div className="px-6 py-8 relative">
              <div className="absolute -top-12 left-6 bg-white rounded-full p-1 shadow-md">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center h-20 w-20 text-white text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Role:</span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {user.role === "admin" ? "Admin (Organizer)" : "User (Participant)"}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-700 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="font-medium">Projects:</span>
                    <span className="ml-2">{userProjects.length}</span>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Joined:</span>
                    <span className="ml-2">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Projects */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              My Projects
            </h2>

            {userProjects.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-gray-500 mb-4">You haven't submitted any projects yet.</p>
                <Link
                  to="/hackathons"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Join a Hackathon
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userProjects.map((project) => (
                  <div
                    key={project._id}
                    className="flex flex-col md:flex-row border rounded-lg overflow-hidden hover:shadow-md transition"
                  >
                    <div className="md:w-1/3 h-40">
                      <img
                        src={project.imageUrl || "/placeholder.svg?height=200&width=400"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:w-2/3">
                      <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.hackathon && (
                          <div className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                            {project.hackathon.title}
                          </div>
                        )}

                        <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                          View Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

