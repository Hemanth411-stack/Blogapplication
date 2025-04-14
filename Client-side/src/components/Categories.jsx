import { useEffect, useState } from 'react';

const Categories = () => {
  const [animated, setAnimated] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setAnimated(true);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4 text-white">
      <div className={`max-w-2xl w-full bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl p-8 shadow-2xl transition-all duration-1000 ${animated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-4 border-4 border-dashed border-blue-400 rounded-full animate-spin-slow"></div>
            <svg 
              className="absolute inset-6 w-20 h-20 text-yellow-400" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Categories Coming Soon!
        </h1>
        <p className="text-lg text-center text-gray-300 mb-8">
          We're building something amazing for you. Stay tuned!
        </p>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Construction Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {['🔍 Discovery', '🌟 Features', '🚀 Innovation'].map((item, index) => (
            <div 
              key={index}
              className={`p-4 bg-gray-700 bg-opacity-50 rounded-lg text-center transition-all duration-500 delay-${index * 100} ${animated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            >
              <div className="text-2xl mb-2">{item.split(' ')[0]}</div>
              <div className="text-sm text-gray-300">{item.split(' ')[1]}</div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-400 mb-4">Notify me when it's ready</p>
          <div className="flex max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-4 py-2 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-lg font-medium hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-gray-400 text-sm flex flex-wrap justify-center gap-4">
        {['🚧 Under Construction', '⚡ Powered by Innovation', '💡 Coming Soon'].map((item, index) => (
          <div 
            key={index}
            className={`flex items-center transition-all duration-700 delay-${index * 200 + 500} ${animated ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="mr-2">{item.split(' ')[0]}</span>
            <span>{item.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;