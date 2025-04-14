import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBlogById, updateBlog } from '../redux/slices/blogslice';
import { FaSpinner, FaImage, FaTimes } from 'react-icons/fa';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import LinkExtension from '@tiptap/extension-link';

const EditBlog = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, status, error } = useSelector((state) => state.blogs);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [publishStatus, setPublishStatus] = useState('draft');
  const [editorReady, setEditorReady] = useState(false);

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      Underline,
      LinkExtension.configure({
        openOnClick: false,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    onCreate: () => {
      setEditorReady(true);
    },
  });

  // Load blog data when component mounts
  useEffect(() => {
    dispatch(getBlogById(id));
  }, [id, dispatch]);

  // Populate form when currentBlog is loaded and editor is ready
  useEffect(() => {
    if (currentBlog && currentBlog._id === id && editorReady) {
      setTitle(currentBlog.title);
      setTags(currentBlog.tags || []);
      setPublishStatus(currentBlog.status || 'draft');
      setPreviewImage(currentBlog.coverImage || '');
      
      // Set editor content only if it's different to avoid unnecessary updates
      if (currentBlog.content !== editor?.getHTML()) {
        editor?.commands.setContent(currentBlog.content);
        setContent(currentBlog.content);
      }
    }
  }, [currentBlog, id, editor, editorReady]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setPreviewImage('');
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('status', publishStatus);
    tags.forEach(tag => formData.append('tags', tag));
    
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }
  
    try {
      const resultAction = await dispatch(updateBlog({ 
        id, 
        blogData: formData
      }));
      
      if (updateBlog.fulfilled.match(resultAction)) {
        navigate(`/blogs/${id}`);
      }
    } catch (err) {
      console.error('Failed to update blog:', err);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (status === 'loading' && !currentBlog) {
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
          <h3 className="text-xl font-medium text-gray-900">Error loading blog</h3>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Status Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={publishStatus}
                onChange={(e) => setPublishStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Title Field */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              {previewImage ? (
                <div className="relative mb-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-64 w-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaImage className="text-4xl text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      {currentBlog?.coverImage ? 'Change cover image' : 'Upload a cover image'}
                    </p>
                  </div>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Content Editor */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              
              {/* Editor Toolbar */}
              {editor && (
                <div className="flex flex-wrap gap-2 mb-2 border-b pb-2">
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
                  >
                    Underline
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={setLink}
                    className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
                  >
                    Link
                  </button>
                  <button
                    type="button"
                    onClick={addImage}
                    className="p-2 rounded"
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                  >
                    Bullet List
                  </button>
                  <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
                  >
                    Numbered List
                  </button>
                </div>
              )}

              {/* Editor Content */}
              <EditorContent
                editor={editor}
                className="min-h-[300px] border rounded-md p-4 bg-white"
              />
            </div>

            {/* Tags */}
            <div className="mb-8">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-900"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type a tag and press Enter"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/blogs/${id}`)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'loading' || !title || !content}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <span className="flex items-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </span>
                ) : (
                  'Update Post'
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 text-red-600 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;