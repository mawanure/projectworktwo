import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { ArrowLeft, User, Calendar, BookOpen } from 'lucide-react';
import { resolveImageUrl } from '../utils/imageUtils';

const BlogDetail = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/blogs/${id}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <BookOpen className="h-14 w-14 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-dark font-spartan">Blog Post Not Found</h2>
        <p className="text-gray-400 mt-2">The article you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/blog"
          className="mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-dark transition"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-12 py-12">
      {/* Back link */}
      <Link
        to="/blog"
        className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-primary mb-8 font-semibold transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Blog</span>
      </Link>

      {/* Cover Image */}
      {post.imageUrl && (
        <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-8 border border-gray-100">
          <img
            src={resolveImageUrl(post.imageUrl, '/images/blog/b1.jpg')}
            alt={post.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/images/blog/b1.jpg';
            }}
          />
        </div>
      )}

      {/* Category badge */}
      <span className="inline-block bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-md uppercase tracking-wider mb-4">
        Fashion
      </span>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold font-spartan text-dark leading-tight mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center space-x-5 text-xs text-gray-400 font-semibold mb-8 border-b border-gray-100 pb-6">
        <span className="flex items-center space-x-1.5">
          <User className="h-3.5 w-3.5" />
          <span>By {post.author || 'Admin'}</span>
        </span>
        <span className="flex items-center space-x-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formattedDate}</span>
        </span>
      </div>

      {/* Content */}
      <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-base whitespace-pre-line">
        {post.content}
      </div>

      {/* Footer nav */}
      <div className="mt-14 pt-8 border-t border-gray-100">
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-primary text-white font-semibold text-sm rounded-lg hover:bg-primary-dark transition shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Posts</span>
        </Link>
      </div>
    </div>
  );
};

export default BlogDetail;
