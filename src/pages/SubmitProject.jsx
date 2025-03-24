import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmitProject = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demoUrl: '',
    imageUrl: ''
  });
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await axios.get(
          `https://devpost-back.onrender.com/api/hackathons/${hackathonId}`
        );
        setHackathon(response.data);
      } catch (error) {
        console.error('Error fetching hackathon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://devpost-back.onrender.com/api/projects',
        {
          ...formData,
          hackathon: hackathonId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/projects');
    } catch (error) {
      console.error('Error submitting project:', error);
      alert('Error submitting project');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Submit Project for {hackathon?.title}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Project Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1">Demo URL</label>
          <input
            type="url"
            value={formData.demoUrl}
            onChange={(e) => setFormData({...formData, demoUrl: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block mb-1">Project Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default SubmitProject;