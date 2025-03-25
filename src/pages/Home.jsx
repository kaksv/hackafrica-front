import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [activeHackathons, setActiveHackathons] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('role');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hackathonsRes, projectsRes] = await Promise.all([
          axios.get('https://devpost-back.onrender.com/api/hackathons?status=active'),
          axios.get('https://devpost-back.onrender.com/api/projects?featured=true')
        ]);
        
        setActiveHackathons(hackathonsRes.data.slice(0, 3));
        setFeaturedProjects(projectsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Build. Compete. Innovate.</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the most exciting hackathons and showcase your technical skills
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/hackathons" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Hackathons
            </Link>
            {role === 'admin' && (
              <Link 
                to="/create-hackathon" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                Create Hackathon
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Active Hackathons */}
      <section className="py-12 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Active Hackathons</h2>
          <Link to="/hackathons" className="text-blue-600 hover:underline">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeHackathons.map(hackathon => (
            <div key={hackathon._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img 
                src={hackathon.imageUrl || '/default-hackathon.jpg'} 
                alt={hackathon.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{hackathon.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{hackathon.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                  </span>
                  <Link 
                    to={`/hackathons/${hackathon._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Link to="/projects" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <img 
                  src={project.imageUrl || '/default-project.jpg'} 
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {project.hackathon?.title || 'Hackathon Project'}
                    </span>
                    <Link 
                      to={`/projects/${project._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathons section */}
      {/* <section className="py-12">
      <div className="py-8 bg-white">
  <div className="container mx-auto px-4 grid grid-cols-3 text-center">
    <div>
      <div className="text-4xl font-bold text-blue-600">50+</div>
      <div className="text-gray-600">Hackathons</div>
    </div>
    <div>
      <div className="text-4xl font-bold text-blue-600">1000+</div>
      <div className="text-gray-600">Participants</div>
    </div>
    <div>
      <div className="text-4xl font-bold text-blue-600">300+</div>
      <div className="text-gray-600">Projects</div>
    </div>
  </div>
</div>
      </section> */}

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of developers and innovators today
          </p>
          <div className="flex justify-center gap-4">
            {!localStorage.getItem('token') ? (
              <>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login" 
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link 
                to="/hackathons" 
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
              >
                Join a Hackathon
              </Link>
            )}
          </div>
        </div>
      </section>
    
    {/* Testimonials */}
      {/* <section className="py-12 bg-gray-100">
  <div className="container mx-auto px-4">
    <h2 className="text-2xl font-bold mb-8 text-center">What Our Community Says</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <p className="italic mb-4">"{testimonial.quote}"</p>
          <div className="flex items-center">
            <img 
              src={testimonial.avatar} 
              alt={testimonial.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section> */}

      
    </div>
  );
};

export default Home;