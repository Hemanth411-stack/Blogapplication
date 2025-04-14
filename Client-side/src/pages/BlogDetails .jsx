import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogById, likeBlog, addComment, deleteBlog } from '../redux/slices/blogslice';
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaRegComment, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentBlog, status, error } = useSelector((state) => state.blogs);
  const { userInfo, token } = useSelector((state) => state.user); 
  console.log(`user info`,token)// Assuming you have auth state
  const [commentText, setCommentText] = React.useState('');
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  useEffect(() => {
    dispatch(getBlogById(id));
  }, [id, dispatch]);

  const handleLike = () => {
    dispatch(likeBlog(id));
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setIsLoading(true);
    try {
      await dispatch(addComment({ id, text: commentText }));
      setCommentText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteBlog(id));
        navigate('/'); // Redirect to user's blogs after deletion
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  // Check if current user is the author
  const isAuthor = token && currentBlog && (
    (typeof currentBlog.author === 'object' && currentBlog.author._id === userInfo) ||
    (typeof currentBlog.author === 'string' && currentBlog.author === userInfo)
   
  );
  

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">Error loading blog</h3>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">Blog not found</h3>
          <p className="mt-2 text-gray-500">The requested blog post doesn't exist</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="bg-white shadow-xl rounded-lg overflow-hidden">
            {/* Blog Cover Image with Edit/Delete buttons */}
            <div className="h-96 w-full overflow-hidden relative">
              <img
                className="w-full h-full object-cover"
                src={currentBlog.coverImage}
                alt={currentBlog.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/default-blog-image.jpg';
                }}
              />
              {isAuthor && (
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
                    title="Edit blog"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                    title="Delete blog"
                  >
                    {isDeleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                  </button>
                </div>
              )}
            </div>

            {/* Rest of the blog content remains the same */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {currentBlog.title}
                  </h1>
                  <div className="flex items-center text-gray-500">
                    <span>By {typeof currentBlog.author === 'object' ? currentBlog.author.name : currentBlog.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(currentBlog.createdAt)}</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    {currentBlog.isLiked ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{currentBlog.likes}</span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="text-gray-500 hover:text-indigo-500 transition-colors"
                  >
                    {isBookmarked ? (
                      <FaBookmark className="text-indigo-500" />
                    ) : (
                      <FaRegBookmark />
                    )}
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{currentBlog.content}</p>
                
                {currentBlog.extendedContent && (
                  <div className="mt-6">
                    {currentBlog.extendedContent}
                  </div>
                )}
              </div>

              <div className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Comments ({currentBlog.comments?.length || 0})
                </h2>

                <form onSubmit={handleAddComment} className="mb-8">
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim() || isLoading}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : (
                        'Post'
                      )}
                    </button>
                  </div>
                </form>

                {currentBlog.comments?.length > 0 ? (
                  <div className="space-y-6">
                    {currentBlog.comments.map((comment) => (
                      <div key={comment._id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-500">
                            {comment.user?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">
                                {comment.user?.name || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default BlogDetails;