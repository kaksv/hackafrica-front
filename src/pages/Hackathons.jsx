"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"
import { useNavigate } from "react-router-dom"

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [participationStatus, setParticipationStatus] = useState({})
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get("https://devpost-back.onrender.com/api/hackathons")
        setHackathons(response.data)

        // Check participation status for each hackathon if logged in
        if (token) {
          const status = {}
          for (const hackathon of response.data) {
            try {
              const res = await axios.get(
                `https://devpost-back.onrender.com/api/hackathons/${hackathon._id}/check-participation`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                },
              )
              status[hackathon._id] = res.data.isParticipating
            } catch (err) {
              status[hackathon._id] = false
            }
          }
          setParticipationStatus(status)
        }
      } catch (error) {
        console.error("Error fetching hackathons:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHackathons()
  }, [token])

  const handleParticipate = async (hackathonId) => {
    const token = localStorage.getItem("token")

    if (!token) {
      localStorage.setItem("pendingParticipation", hackathonId)
      navigate("/login")
      return
    }

    try {
      const response = await axios.post(
        `https://devpost-back.onrender.com/api/hackathons/${hackathonId}/participate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        },
      )

      if (response.data.success) {
        navigate(`/submit-project/${hackathonId}`)
      } else {
        console.error("Participation failed:", response.data.message)
        alert("Failed to participate. Please try again.")
      }
    } catch (error) {
      console.error("Error participating:", error)

      if (error.response) {
        if (error.response.status === 404) {
          alert("Hackathon not found")
        } else if (error.response.status === 401) {
          alert("Please login to participate")
          navigate("/login")
        } else {
          alert(error.response.data?.message || "Participation error")
        }
      } else {
        alert("Network error. Please check your connection.")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Hackathons</h1>
        <p className="text-gray-600">Discover and participate in exciting coding challenges</p>
      </div>

      {hackathons.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 mx-auto text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No Hackathons Found</h3>
          <p className="text-gray-500 mb-6">There are currently no hackathons available.</p>
          {localStorage.getItem("role") === "admin" && (
            <Link
              to="/create-hackathon"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create a Hackathon
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hackathons.map((hackathon) => (
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
                  <div className="text-sm font-medium bg-blue-600 rounded-full px-3 py-1 inline-block">
                    {new Date(hackathon.endDate) > new Date() ? "Active" : "Ended"}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 line-clamp-1">{hackathon.title}</h2>
                <p className="text-gray-700 mb-4 line-clamp-2">{hackathon.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Starts: {new Date(hackathon.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Ends: {new Date(hackathon.endDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <Link to={`/hackathons/${hackathon._id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    View Details
                  </Link>

                  <button
                    onClick={() => handleParticipate(hackathon._id)}
                    disabled={participationStatus[hackathon._id]}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      participationStatus[hackathon._id]
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {participationStatus[hackathon._id] ? (
                      <span className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Participating
                      </span>
                    ) : (
                      "Participate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Hackathons

