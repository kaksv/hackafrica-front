import { Link } from 'react-router-dom';

const Sidebar = () => {
  // Get the role from localStorage
  const role = localStorage.getItem('role');

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Devpost Clone</h2>
      <ul>
        <li className="mb-2">
          <Link to="/" className="block p-2 hover:bg-gray-700 rounded">
            Home
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/hackathons" className="block p-2 hover:bg-gray-700 rounded">
            Hackathons
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/projects" className="block p-2 hover:bg-gray-700 rounded">
            Projects
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/profile" className="block p-2 hover:bg-gray-700 rounded">
            Profile
          </Link>
        </li>
        {/* Show "Create Hackathon" only for admins */}
        {role === 'admin' && (
          <li className="mb-2">
            <Link to="/create-hackathon" className="block p-2 hover:bg-gray-700 rounded">
              Create Hackathon
            </Link>
          </li>
        )}
        <li className="mb-2">
          <Link to="/register" className="block p-2 hover:bg-gray-700 rounded">
            Register
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/login" className="block p-2 hover:bg-gray-700 rounded">
            Login
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;