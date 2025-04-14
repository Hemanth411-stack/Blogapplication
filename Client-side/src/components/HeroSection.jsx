import { FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-gray-900 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover opacity-70"
          src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
          alt="Workspace with laptop"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 mix-blend-multiply"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Share Your Ideas With The World
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
            Join our community of writers and readers. Publish your stories, connect with like-minded people, and grow your audience.
          </p>
          
          {/* Buttons Container */}
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <div className="rounded-md shadow">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:scale-105">
                <Link to={'/createblog'}>Get Started</Link>
                <FaArrowRight className="ml-2" />
              </button>
            </div>
            <div className="rounded-md shadow">
              <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-300 hover:scale-105">
                Learn More
                <FaInfoCircle className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </div>
  );
};

export default HeroSection;