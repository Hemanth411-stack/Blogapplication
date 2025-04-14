import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBlogByUsername } from '../redux/slices/blogslice';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const UserBlogs = () => {
  const dispatch = useDispatch();
  const { userblogs, status, error } = useSelector((state) => state.blogs);
  
  useEffect(() => {
    dispatch(getBlogByUsername());
  }, [dispatch]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Stories</h1>
        
      </div>

      {userblogs.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No stories yet</h3>
          <p className="mt-1 text-sm text-gray-500 mb-6">
            Get started by creating your first story.
          </p>
          <Link
            to="/createBlog"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create your first story
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userblogs.map((blog) => (
            <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/blogs/${blog._id}`} className="block">
                {blog.coverImage && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase font-semibold tracking-wide">
                      {blog.tag || 'tags'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{blog.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {blog.views || 0} views
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default UserBlogs;