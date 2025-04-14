import { useState, useEffect } from 'react';
import { FaSpinner, FaArrowRight, FaSearch } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogs, likeBlog } from '../redux/slices/blogslice.js';
import Navbar from '../components/Navbar';
import BlogCard from '../components/BlogCard';
import HeroSection from '../components/HeroSection';
import { Link } from 'react-router-dom';
import UserBlogs from '../components/UserBlogs.jsx';
import Footer from '../components/Footer.jsx';

const Home = () => {
  const dispatch = useDispatch();
  const { blogs, status, error } = useSelector((state) => state.blogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Load initial blogs
  useEffect(() => {
    if (status === 'idle') {
      dispatch(getBlogs());
    }
  }, [status, dispatch]);

  const filteredPosts = blogs.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLike = (postId) => {
    dispatch(likeBlog(postId));
  };

  const loadMorePosts = async () => {
    setIsLoadingMore(true);
    // In a real app, you would implement pagination in your API
    // and fetch the next page here
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoadingMore(false);
  };

  if (status === 'loading' && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">Error loading blogs</h3>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <HeroSection />
      {/* <Link 
  to="/myblogs" 
  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
>
  MY BLOGS
</Link> */}
<UserBlogs/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Featured Posts
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover the latest insights, tutorials, and stories from our community
          </p>
        </div>
        
        {searchTerm && filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FaSearch className="text-gray-400 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-gray-500">We couldn't find any posts matching "{searchTerm}"</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {(searchTerm ? filteredPosts : blogs).map((post) => (
              <Link to={`/blogs/${post._id}`}><BlogCard key={post._id} post={post} onLike={handleLike} /></Link>
            ))}
          </div>
        )}

        {!searchTerm && blogs.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMorePosts}
              disabled={isLoadingMore}
              className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  Load more posts
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default Home;