import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper function for handling fetch responses
const handleResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from server');
  }
  const data = JSON.parse(text);
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
};

// Async Thunks using fetch
export const createBlog = createAsyncThunk(
  'blogs/create',
  async (formData, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); 
      console.log(`auth details`,user) // user is from store.js 
      const token = user.token;
      console.log(`token details`,token)
      
      // Add this debug code to verify FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch('http://localhost:5000/api/blogs/createblog', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove any Content-Type header for FormData
        },
        body: formData
      });

      // Add response debugging
      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Request failed');
      }

      return responseData;
    } catch (error) {
      console.error('Error in createBlog:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogs = createAsyncThunk(
  'blogs/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/blogs/getblogs');
      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogById = createAsyncThunk(
  'blogs/getById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs/getblogbyid/${id}`);
      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBlogByUsername = createAsyncThunk(
  'blogs/getByUsername',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); 
      const token = user.token;
      
      const response = await fetch('http://localhost:5000/api/blogs/getmypublishedblogs', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || 'Request failed');
      }
      return responseData.data; // Make sure to return the data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateBlog = createAsyncThunk(
  'blogs/update',
  async ({ id, blogData }, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); 
      const token = user.token;
      
      // Verify we're receiving FormData
      console.log('Received blogData:', blogData);
      if (!(blogData instanceof FormData)) {
        throw new Error('Expected FormData but received something else');
      }

      const response = await fetch(`http://localhost:5000/api/blogs/updateblog/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type - let browser set it with boundary
        },
        body: blogData
      });

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || 'Request failed');
      }

      return responseData;
    } catch (error) {
      console.error('Error in updateBlog:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blogs/delete',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); 
      const token = user.token;
      const response = await fetch(`http://localhost:5000/api/blogs/deleteblog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blogs/like',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { user } = getState(); 
      const token = user.token;
      const response = await fetch(`/api/blogs/delete${id}/like`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addComment = createAsyncThunk(
  'blogs/addComment',
  async ({ id, text }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await fetch(`/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ text }),
      });

      return await handleResponse(response);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: 'blogs',
  initialState: {
    blogs: [],
    userblogs: [],
    currentBlog: null,
    status: 'idle',
    error: null,
    operationStatus: 'idle',
    operationError: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    resetOperationStatus: (state) => {
      state.operationStatus = 'idle';
      state.operationError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.blogs.unshift(action.payload.blog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      // Get All Blogs
      .addCase(getBlogs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.blogs = action.payload;
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Get Blog By ID
      .addCase(getBlogById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBlogById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBlog = action.payload;
      })
      .addCase(getBlogById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(getBlogByUsername.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBlogByUsername.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userblogs = action.payload;
        console.log(`user blogs`,state.userblogs);
      })
      .addCase(getBlogByUsername.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        
        
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      // Delete Blog
      .addCase(deleteBlog.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload.id);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      // Like Blog
      .addCase(likeBlog.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        state.blogs = state.blogs.map(blog => 
          blog._id === action.payload.blog._id ? action.payload.blog : blog
        );
        if (state.currentBlog?._id === action.payload.blog._id) {
          state.currentBlog = action.payload.blog;
        }
      })
      .addCase(likeBlog.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      })

      // Add Comment
      .addCase(addComment.pending, (state) => {
        state.operationStatus = 'loading';
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.operationStatus = 'succeeded';
        if (state.currentBlog?._id === action.payload.blog._id) {
          state.currentBlog.comments = action.payload.comments;
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.operationStatus = 'failed';
        state.operationError = action.payload;
      });
  },
});

export const { clearCurrentBlog, resetOperationStatus } = blogSlice.actions;
export default blogSlice.reducer;