import { Link } from 'react-router-dom';

const Sidebar = () => {
  const role = localStorage.getItem('role');

  return (
    <div className="bg-white text-gray-800 w-64 min-h-screen p-4 shadow-md">
      <h2 className="text-2xl font-bold mb-6">HA</h2>
      <ul>
        <li className="mb-2">
          <Link to="/" className="block p-2 hover:bg-gray-100 rounded">
            Home
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/hackathons" className="block p-2 hover:bg-gray-100 rounded">
            Hackathons
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/projects" className="block p-2 hover:bg-gray-100 rounded">
            Projects
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/profile" className="block p-2 hover:bg-gray-100 rounded">
            Profile
          </Link>
        </li>
        {role === 'admin' && (
          <li className="mb-2">
            <Link to="/create-hackathon" className="block p-2 hover:bg-gray-100 rounded">
              Create Hackathon
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;