import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

const CreateHackathon = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [rules, setRules] = useState("")
  const [prizes, setPrizes] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const navigate = useNavigate()

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return

    setIsUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "devpost-hackathons")

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/dagn33ye3/image/upload`, formData)

      setImageUrl(response.data.secure_url)
      console.log(response.data.secure_url)
    } catch (err) {
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!imageUrl) {
      setError("Please upload an image for the hackathon.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        "https://devpost-back.onrender.com/api/hackathons",
        {
          title,
          description,
          startDate,
          endDate,
          rules,
          prizes,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Redirect to the hackathons page after successful creation
      navigate("/hackathons")
    } catch (err) {
      setError(err.response?.data?.message || "Error creating hackathon")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Hackathon</h1>
        <p className="text-gray-600">Set up a new hackathon for the community</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Hackathon Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Description Field */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description*
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Describe the hackathon, its theme, and what participants can expect.
                  </p>
                </div>

                {/* Date Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date*
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                      End Date*
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Rules Field */}
                <div>
                  <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-1">
                    Rules*
                  </label>
                  <textarea
                    id="rules"
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Outline the rules and guidelines for participants.</p>
                </div>

                {/* Prizes Field */}
                <div>
                  <label htmlFor="prizes" className="block text-sm font-medium text-gray-700 mb-1">
                    Prizes*
                  </label>
                  <textarea
                    id="prizes"
                    value={prizes}
                    onChange={(e) => setPrizes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">Describe the prizes and rewards for winners.</p>
                </div>
              </div>
            </div>

            {/* Image Upload Field */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Hackathon Image*
              </label>
              <div className="mt-1 flex items-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isUploading}
                />
              </div>
              {isUploading && (
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading image...
                </div>
              )}
              {imageUrl && (
                <div className="mt-3 border rounded-md p-2 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Hackathon Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link
                to="/hackathons"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isUploading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }`}
                disabled={isUploading}
              >
                {isUploading ? "Creating..." : "Create Hackathon"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateHackathon

