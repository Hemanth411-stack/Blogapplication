import { FaRegHeart, FaRegBookmark, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

const BlogCard = ({ post, onLike }) => {
  const [error, setError] = useState(null);

  // Safely get author information
  const authorName = typeof post.author === 'object' 
    ? post.author?.name || 'Unknown Author'
    : post.author || 'Unknown Author';
  
  const authorInitial = authorName.charAt(0).toUpperCase();

  // Safe date handling
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return 'Invalid date';
    }
  };

  // Function to strip HTML tags and create preview text
  const createPreview = (html) => {
    if (!html) return 'No content available';
    
    // Strip HTML tags
    const strippedText = html.replace(/<[^>]+>/g, '');
    
    // Truncate to 150 characters
    return strippedText.length > 150 
      ? `${strippedText.substring(0, 150)}...` 
      : strippedText;
  };

  // Check if current user has liked the post
  const hasLiked = post.likes?.includes(post.userId) || false;

  if (error) {
    return (
      <div className="rounded-lg shadow-lg bg-red-50 p-4">
        <p className="text-red-600">Error displaying blog post</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl bg-white h-full">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="flex-shrink-0 h-48 w-full overflow-hidden">
          <img 
            className="h-full w-full object-cover" 
            src={post.coverImage} 
            alt={post.title}
            onError={() => setError('Image failed to load')}
          />
        </div>
      )}
      
      {/* Card Content */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {post.title || 'Untitled Post'}
          </h3>
          
          {/* Content Preview */}
          <p className="mt-3 text-base text-gray-500 line-clamp-3">
            {createPreview(post.content)}
          </p>
        </div>
        
        {/* Footer */}
        <div className="mt-6 flex items-center">
          {/* Author */}
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-500">
              {authorInitial}
            </span>
          </div>
          
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{authorName}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time>{formatDate(post.createdAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.comments?.length || 0} comments</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="ml-auto flex space-x-3">
            <button 
              onClick={(e) => {
                e.preventDefault();
                onLike(post._id);
              }}
              className="flex items-center text-gray-400 hover:text-red-500"
            >
              {hasLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span className="ml-1 text-sm">{post.likes?.length || 0}</span>
            </button>
            <button 
              className="text-gray-400 hover:text-gray-500"
              onClick={(e) => e.preventDefault()}
            >
              <FaRegBookmark />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;