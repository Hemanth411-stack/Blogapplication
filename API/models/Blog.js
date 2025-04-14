  import mongoose from 'mongoose';

  const blogSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [120, 'Title cannot exceed 120 characters']
      },
      content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [50, 'Content should be at least 50 characters']
      },
      excerpt: {
        type: String,
        maxlength: [200, 'Excerpt cannot exceed 200 characters']
      },
      coverImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
      },
      tags: {
        type: [String],
        enum: ['technology', 'programming', 'webdev', 'react', 'nodejs', 'mongodb'],
        default: []
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
      },
      readTime: {
        type: Number,
        default: 5 // minutes
      },
      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      ],
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            
          },
          text: {
            type: String,
            
            maxlength: [500, 'Comment cannot exceed 500 characters']
          },
          createdAt: {
            type: Date,
            default: Date.now
          }
        }
      ]
    },
    {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true }
    }
  );

  // Calculate read time before saving
  blogSchema.pre('save', function(next) {
    const wordsPerMinute = 200;
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
    next();
  });

  // Add excerpt if not provided
  blogSchema.pre('save', function(next) {
    if (!this.excerpt) {
      this.excerpt = this.content.substring(0, 200) + '...';
    }
    next();
  });

  const Blog = mongoose.model('Blog', blogSchema);

  export default Blog;