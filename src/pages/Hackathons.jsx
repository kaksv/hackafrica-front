import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Hackathons = () => {
  const [hackathons, setHackathons] = useState([]);
  const [filteredHackathons, setFilteredHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await axios.get('https://devpost-back.onrender.com/api/hackathons');
        setHackathons(response.data);
        setFilteredHackathons(response.data);
      } catch (error) {
        console.error('Error fetching hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHackathons();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = hackathons.filter((hackathon) =>
        hackathon.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHackathons(filtered);
    } else {
      setFilteredHackathons(hackathons);
    }
  }, [searchQuery, hackathons]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Hackathons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHackathons.map((hackathon) => (
          <Link
            to={`/hackathons/${hackathon._id}`}
            key={hackathon._id}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
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
              <p className="text-sm text-gray-600">
                <strong>Start Date:</strong> {new Date(hackathon.startDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong>End Date:</strong> {new Date(hackathon.endDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 line-clamp-1">
                <strong>Prizes:</strong> {hackathon.prizes}
              </p>
            </div>
          </Link>
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