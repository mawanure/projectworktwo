import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, BookOpen, Calendar, User, Upload, X } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageUtils';

const Blogs = () => {
  const queryClient = useQueryClient();
  const [editingBlog, setEditingBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    imageUrl: '',
    imagePreview: '',
  });

  // Fetch all blogs for admin
  const { data: blogsPage, isLoading } = useQuery({
    queryKey: ['admin', 'blogs'],
    queryFn: async () => {
      const response = await apiClient.get('/api/admin/blogs?size=100');
      return response.data;
    },
  });
  const blogs = blogsPage?.content || [];

  // Mutation: Create Blog
  const createBlogMutation = useMutation({
    mutationFn: async (data) => (await apiClient.post('/api/admin/blogs', data)).data,
    onSuccess: () => {
      toast.success('Blog post published!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to publish blog'),
  });

  // Mutation: Update Blog
  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }) => (await apiClient.put(`/api/admin/blogs/${id}`, data)).data,
    onSuccess: () => {
      toast.success('Blog post updated!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update blog'),
  });

  // Mutation: Delete Blog
  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => await apiClient.delete(`/api/admin/blogs/${id}`),
    onSuccess: () => {
      toast.success('Blog post deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: () => toast.error('Failed to delete blog post'),
  });

  const resetForm = () =>
    setFormData({ title: '', content: '', author: '', imageUrl: '', imagePreview: '' });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setEditingBlog(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      author: blog.author || '',
      imageUrl: blog.imageUrl || '',
      imagePreview: blog.imageUrl ? resolveImageUrl(blog.imageUrl) : '',
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    setIsUploading(true);
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, imagePreview: previewUrl }));
    try {
      const fd = new FormData();
      fd.append('file', file);
      const response = await apiClient.post('/api/admin/upload/image', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, imageUrl: response.data.url, imagePreview: previewUrl }));
      toast.success('Image uploaded!');
    } catch (err) {
      setFormData((prev) => ({ ...prev, imagePreview: prev.imageUrl ? resolveImageUrl(prev.imageUrl) : '' }));
      toast.error('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      content: formData.content,
      author: formData.author || 'Admin',
      imageUrl: formData.imageUrl || null,
    };
    if (editingBlog) {
      updateBlogMutation.mutate({ id: editingBlog.id, data: payload });
    } else {
      createBlogMutation.mutate(payload);
    }
  };

  const formatDate = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : '—';

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-spartan text-dark">Blog Posts</h2>
          <p className="text-sm text-neutral-400">
            Publish and manage articles displayed on the customer Blog page.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Post</span>
        </button>
      </div>

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-16 bg-white border border-gray-100 rounded-2xl min-h-[300px]">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-bold text-dark mt-4 font-spartan">No Blog Posts Yet</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-sm">
            Click "New Post" to publish your first article.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-150 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold uppercase text-neutral-400 tracking-wider">
                <th className="p-4">Post</th>
                <th className="p-4">Author</th>
                <th className="p-4">Published</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50">
                  <td className="p-4 flex items-center space-x-3">
                    <div className="h-12 w-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {blog.imageUrl ? (
                        <img
                          src={resolveImageUrl(blog.imageUrl)}
                          alt={blog.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = '/images/blog/b1.jpg'; }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-dark block line-clamp-1">{blog.title}</span>
                      <span className="text-xs text-neutral-400 line-clamp-1">{blog.content?.slice(0, 80)}…</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center space-x-1 text-sm text-neutral-600">
                      <User className="h-3.5 w-3.5" />
                      <span>{blog.author || 'Admin'}</span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center space-x-1 text-sm text-neutral-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(blog.createdAt)}</span>
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEditClick(blog)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this blog post?')) deleteBlogMutation.mutate(blog.id); }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-spartan text-dark mb-4">
              {editingBlog ? 'Edit Blog Post' : 'New Blog Post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="e.g. Top 5 Summer Fashion Trends"
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none"
                  placeholder="Admin"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Cover Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-gray-50 rounded-lg p-4 text-center cursor-pointer transition-all"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  {isUploading ? (
                    <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500">
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Uploading…</span>
                    </div>
                  ) : formData.imagePreview ? (
                    <div className="relative inline-block">
                      <img src={formData.imagePreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover mx-auto" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFormData((p) => ({ ...p, imageUrl: '', imagePreview: '' })); }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-neutral-400 mx-auto mb-1" />
                      <p className="text-xs text-neutral-500">Click to upload cover image</p>
                      <p className="text-xs text-neutral-400">JPEG, PNG, WebP • max 10MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1 uppercase tracking-wider">Content *</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none h-36 resize-y"
                  placeholder="Write the full article content here…"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-neutral-700 text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || createBlogMutation.isPending || updateBlogMutation.isPending}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-primary-dark transition disabled:opacity-60"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
