import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateHackathon = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rules, setRules] = useState('');
  const [prizes, setPrizes] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // Store the Cloudinary URL
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false); // Track upload status
  const navigate = useNavigate();

  // Handle image upload to Cloudinary
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true); // Start uploading
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'devpost-hackathons'); // Replace with your Cloudinary upload preset

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dagn33ye3/image/upload`, // Replace with your Cloudinary cloud name
        formData
      );

      setImageUrl(response.data.secure_url); // Set the Cloudinary URL
      console.log(response.data.secure_url);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false); // Stop uploading
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      setError('Please upload an image for the hackathon.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://devpost-back.onrender.com/api/hackathons',
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
        }
      );

      // Redirect to the hackathons page after successful creation
      navigate('/hackathons');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating hackathon');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6">Create Hackathon</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rules</label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Prizes</label>
            <textarea
              value={prizes}
              onChange={(e) => setPrizes(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Hackathon Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              className="w-full p-2 border rounded"
              disabled={isUploading}
            />
            {isUploading && <p className="text-sm text-gray-600 mt-2">Uploading image...</p>}
            {imageUrl && (
              <div className="mt-2">
                <img
                  src={imageUrl}
                  alt="Hackathon Preview"
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            disabled={isUploading}
            onClick={handleSubmit}
            
          >
            {isUploading ? 'Creating Hackathon...' : 'Create Hackathon'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateHackathon;