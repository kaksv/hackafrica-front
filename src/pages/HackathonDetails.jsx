import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const HackathonDetails = () => {
  const { id } = useParams(); // Get the hackathon ID from the URL
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHackathon = async () => {
      try {
        const response = await axios.get(
          `https://devpost-back.onrender.com/api/hackathons/${id}`
        );
        setHackathon(response.data);
      } catch (err) {
        setError('Failed to fetch hackathon details.');
      } finally {
        setLoading(false);
      }
    };

    fetchHackathon();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!hackathon) {
    return <div className="p-6">Hackathon not found.</div>;
  }

  return (
    <div className="p-6">
      <Link
        to="/hackathons"
        className="text-blue-500 hover:underline mb-4 inline-block"
      >
        ← Back to Hackathons
      </Link>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {hackathon.imageUrl && (
          <img
            src={hackathon.imageUrl}
            alt={hackathon.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{hackathon.title}</h1>
          <p className="text-gray-700 mb-4">{hackathon.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Start Date</h3>
              <p>{new Date(hackathon.startDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">End Date</h3>
              <p>{new Date(hackathon.endDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800">Rules</h3>
            <p className="whitespace-pre-line">{hackathon.rules}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Prizes</h3>
            <p className="whitespace-pre-line">{hackathon.prizes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetails;