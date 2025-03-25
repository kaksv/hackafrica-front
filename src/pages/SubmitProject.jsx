import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const SubmitProject = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    demoUrl: '',
    imageUrl: '',
    team: [localStorage.getItem('userId')] // Current user auto-added to team
  });
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch hackathon details
  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await axios.get(
          `https://devpost-back.onrender.com/api/hackathons/${hackathonId}`
        );
        setHackathon(response.data);
      } catch (err) {
        setError('Failed to load hackathon details');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [hackathonId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Validate required fields
      if (!formData.title.trim() || !formData.description.trim()) {
        throw new Error('Title and description are required');
      }

      const response = await axios.post(
        'https://devpost-back.onrender.com/api/projects',
        {
          ...formData,
          hackathon: hackathonId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect to projects page on success
      navigate('/projects', { state: { projectCreated: true } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        Submit Project for {hackathon?.title}
      </h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Title*</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            disabled={submitting}
          />
        </div>
        
        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows={5}
            required
            disabled={submitting}
          />
        </div>
        
        {/* Demo URL Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Demo URL</label>
          <input
            type="url"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/demo"
            disabled={submitting}
          />
        </div>
        
        {/* Image URL Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
            disabled={submitting}
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <img 
                src={formData.imageUrl} 
                alt="Project preview" 
                className="h-40 object-contain border rounded"
              />
            </div>
          )}
        </div>
        
        {/* Submit Button - Now Fully Active */}
        <div className="pt-4">
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded transition-colors ${
              submitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitProject;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import LoadingSpinner from '../components/LoadingSpinner';

// const SubmitProject = () => {
//   const { hackathonId } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     demoUrl: '',
//     imageUrl: '',
//     team: [localStorage.getItem('userId')] // Include current user by default
//   });
//   const [hackathon, setHackathon] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Fetch hackathon details
//   useEffect(() => {
//     const fetchHackathon = async () => {
//       try {
//         const response = await axios.get(
//           `https://devpost-back.onrender.com/api/hackathons/${hackathonId}`
//         );
//         setHackathon(response.data);
//       } catch (err) {
//         setError('Failed to load hackathon details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHackathon();
//   }, [hackathonId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         'https://devpost-back.onrender.com/api/projects',
//         {
//           ...formData,
//           hackathon: hackathonId
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       navigate('/projects');
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to submit project');
//     }
//   };

//   if (loading) return <LoadingSpinner />;
//   if (error) return <div className="p-4 text-red-500">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-6">
//         Submit Project for {hackathon?.title}
//       </h1>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Project Title*</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-1">Description*</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             rows={5}
//             required
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-1">Demo URL</label>
//           <input
//             type="url"
//             name="demoUrl"
//             value={formData.demoUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             placeholder="https://example.com/demo"
//           />
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium mb-1">Project Image URL</label>
//           <input
//             type="url"
//             name="imageUrl"
//             value={formData.imageUrl}
//             onChange={handleChange}
//             className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//             placeholder="https://example.com/image.jpg"
//           />
//           {formData.imageUrl && (
//             <div className="mt-2">
//               <img 
//                 src={formData.imageUrl} 
//                 alt="Project preview" 
//                 className="h-40 object-contain border rounded"
//               />
//             </div>
//           )}
//         </div>
        
//         <div className="pt-4">
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
//           >
//             Submit Project
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SubmitProject;

