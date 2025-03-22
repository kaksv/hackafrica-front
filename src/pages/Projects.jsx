import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://devpost-back.onrender.com/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project._id} className="mb-4 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-bold">{project.title}</h2>
            <p>{project.description}</p>
            <p>Hackathon: {project.hackathon.title}</p>
            <p>Team: {project.team.map((member) => member.name).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;