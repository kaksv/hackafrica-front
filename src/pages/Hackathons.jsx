import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participationStatus, setParticipationStatus] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get('https://devpost-back.onrender.com/api/hackathons');
        // const response = await axios.get('http://localhost:5000/api/hackathons');
        setHackathons(response.data);
        
        // Check participation status for each hackathon if logged in
        if (token) {
          const status = {};
          for (const hackathon of response.data) {
            try {
              const res = await axios.get(
                `https://devpost-back.onrender.com/api/hackathons/${hackathon._id}/check-participation`,
                // `http://localhost:5000/api/hackathons/${hackathon._id}/check-participation`,
                {
                  headers: { Authorization: `Bearer ${token}` }
                }
              );
              status[hackathon._id] = res.data.isParticipating;
            } catch (err) {
              status[hackathon._id] = false;
            }
          }
          setParticipationStatus(status);
        }
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, [token]);

  const handleParticipate = async (hackathonId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Store the hackathon ID in localStorage before redirecting to register
    localStorage.setItem('pendingParticipation', hackathonId);
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(
        // `${API_BASE_URL}/hackathons/${hackathonId}/participate`,
        `https://devpost-back.onrender.com/api/hackathons/${hackathonId}/participate`,
        // `http://localhost:5000/api/hackathons/${hackathonId}/participate`,
        {},
        {
           headers: { Authorization: `Bearer ${token}`,
           'Content-Type': 'application/json'
           } }
      );

       // Handle success (whether new participation or already participating)
      if (response.data.success) {
         // Handle success (whether new participation or already participating)
        navigate(`/submit-project/${hackathonId}`);
      } else {
        console.error('Participation failed:', response.data.message);
        alert('Failed to participate. Please try again.');
      }
      
      // // Update participation status
      // setParticipationStatus(prev => ({
      //   ...prev,
      //   [hackathonId]: true
      // }));
      
      // // Redirect to submit project page
      // navigate(`/submit-project/${hackathonId}`);
    } catch (error) {
      console.error('Error participating:', error);

      // Handle specific error cases
      if (error.response) {
        // Handle specific error cases
        if (error.response.status === 404) {
          alert('Hackathon not found');
        } else if (error.response.status === 401) {
          alert('Please login to participate');
          navigate('/login');
        } else {
          alert(error.response.data?.message || 'Participation error');
        }
      } else {
        alert('Network error. Please check your connection.');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <div key={hackathon._id} className="bg-white shadow rounded-lg overflow-hidden">
            {hackathon.imageUrl && (
              <img
                src={hackathon.imageUrl}
                alt={hackathon.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{hackathon.title}</h2>
              <p className="text-gray-700 mb-2 line-clamp-2">{hackathon.description}</p>
              <div className="text-sm text-gray-600 space-y-1 mb-4">
                <p><strong>Start:</strong> {new Date(hackathon.startDate).toLocaleDateString()}</p>
                <p><strong>End:</strong> {new Date(hackathon.endDate).toLocaleDateString()}</p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/hackathons/${hackathon._id}`}
                  className="text-blue-500 hover:underline"
                >
                  View Details
                </Link>
                
                <button
                  onClick={() => handleParticipate(hackathon._id)}
                  disabled={participationStatus[hackathon._id]}
                  className={`px-4 py-2 rounded ${
                    participationStatus[hackathon._id]
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {participationStatus[hackathon._id] ? 'Participating' : 'Participate'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hackathons;



// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import LoadingSpinner from '../components/LoadingSpinner';

// const Hackathons = () => {
//   const [hackathons, setHackathons] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchHackathons = async () => {
//       try {
//         const response = await axios.get('https://devpost-back.onrender.com/api/hackathons');
//         setHackathons(response.data);
//       } catch (error) {
//         console.error('Error fetching hackathons:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHackathons();
//   }, []);

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div>
//       <h1 className="text-3xl font-bold">Hackathons</h1>
//       <ul>
//         {hackathons.map((hackathon) => (
//           <li key={hackathon._id} className="mb-4 p-4 bg-white shadow rounded">
//             <h2 className="text-xl font-bold">{hackathon.title}</h2>
//             <p>{hackathon.description}</p>
//             <p>Start Date: {new Date(hackathon.startDate).toLocaleDateString()}</p>
//             <p>End Date: {new Date(hackathon.endDate).toLocaleDateString()}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Hackathons;