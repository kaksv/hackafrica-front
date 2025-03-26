import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"

const HackathonDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isParticipating, setIsParticipating] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await axios.get(`https://devpost-back.onrender.com/api/hackathons/${id}`)
        setHackathon(response.data)

        // Check if user is participating
        if (token) {
          try {
            const participationRes = await axios.get(
              `https://devpost-back.onrender.com/api/hackathons/${id}/check-participation`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            )
            setIsParticipating(participationRes.data.isParticipating)
          } catch (err) {
            console.error("Error checking participation:", err)
          }
        }
      } catch (err) {
        setError("Failed to fetch hackathon details.")
      } finally {
        setLoading(false)
      }
    }

    fetchHackathon()
  }, [id, token])

  const handleParticipate = async () => {
    if (!token) {
      localStorage.setItem("pendingParticipation", id)
      navigate("/login")
      return
    }

    try {
      const response = await axios.post(
        `https://devpost-back.onrender.com/api/hackathons/${id}/participate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      )

      if (response.data.success) {
        navigate(`/submit-project/${id}`)
      } else {
        alert("Failed to participate. Please try again.")
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Please login to participate")
        navigate("/login")
      } else {
        alert(error.response?.data?.message || "Participation error")
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <Link to="/hackathons" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Hackathons
        </Link>
      </div>
    )
  }

  if (!hackathon) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-yellow-700">
        <h2 className="text-xl font-bold mb-2">Not Found</h2>
        <p>Hackathon not found.</p>
        <Link to="/hackathons" className="mt-4 inline-block text-blue-600 hover:underline">
          ← Back to Hackathons
        </Link>
      </div>
    )
  }

  const isActive = new Date(hackathon.endDate) > new Date()

  return (
    <div>
      <Link to="/hackathons" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Hackathons
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-64 md:h-80">
          {hackathon.imageUrl ? (
            <img
              src={hackathon.imageUrl || "/placeholder.svg"}
              alt={hackathon.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white">{hackathon.title}</h1>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="mb-2">
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  isActive ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {isActive ? "Active" : "Ended"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{hackathon.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              <div>
                <div className="text-xs text-blue-500 font-medium">Start Date</div>
                <div className="font-medium">{new Date(hackathon.startDate).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
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
              <div>
                <div className="text-xs text-purple-500 font-medium">End Date</div>
                <div className="font-medium">{new Date(hackathon.endDate).toLocaleDateString()}</div>
              </div>
            </div>

            {isActive && (
              <div className="ml-auto">
                {isParticipating ? (
                  <Link
                    to={`/submit-project/${hackathon._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Submit Project
                  </Link>
                ) : (
                  <button
                    onClick={handleParticipate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Participate
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{hackathon.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Rules
              </h2>
              <div className="text-gray-700 whitespace-pre-line">{hackathon.rules}</div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-purple-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                Prizes
              </h2>
              <div className="text-gray-700 whitespace-pre-line">{hackathon.prizes}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HackathonDetails

