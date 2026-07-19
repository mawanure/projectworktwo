import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
import { BookOpen, User, Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [page, setPage] = useState(0);
  const pageSize = 4;

  // Fetch Paginated Blog Posts
  const { data: blogPage, isLoading } = useQuery({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const response = await apiClient.get('/api/blogs', {
        params: { page, size: pageSize },
      });
      return response.data;
    },
  });

  const posts = blogPage?.content || [];
  const totalPages = blogPage?.totalPages || 0;

  return (
    <div className="w-full">
      {/* Page Header */}
      <section 
        className="relative bg-[url('/images/banner/b19.jpg')] bg-cover bg-center h-[25vh] w-full flex flex-col justify-center items-center text-center px-4 select-none mb-16"
      >
        <h2 className="text-white text-4xl font-extrabold font-spartan tracking-wide">#ReadMore</h2>
        <p className="text-gray-200 text-sm mt-1">Read all case studies about our products!</p>
      </section>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 mb-20">
        {isLoading ? (
          <div className="space-y-12">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col md:flex-row gap-6 bg-white border border-gray-100 p-6 rounded-2xl h-[220px]"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-white border border-gray-100 rounded-2xl min-h-[300px]">
            <BookOpen className="h-12 w-12 text-gray-300" />
            <h3 className="text-lg font-bold text-dark mt-4 font-spartan">No Blog Posts Found</h3>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              We haven't published any articles yet. Stay tuned for future fashion updates!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {posts.map((post) => (
              <article 
                key={post.id}
                className="flex flex-col md:flex-row items-center gap-8 bg-white border border-gray-100 p-6 rounded-2xl hover:shadow-lg transition-all duration-300 relative group"
              >
                {/* Blog Image */}
                <div className="w-full md:w-80 h-52 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
                  <img
                    src={`/${post.imageUrl || 'images/blog/b1.jpg'}`}
                    alt={post.title}
                    className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-350"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/blog/b1.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    Fashion
                  </div>
                </div>

                {/* Blog details */}
                <div className="flex-grow flex flex-col items-start text-left">
                  {/* Metadata */}
                  <div className="flex items-center space-x-4 text-xs text-gray-400 font-semibold mb-3">
                    <span className="flex items-center space-x-1">
                      <User className="h-3.5 w-3.5" />
                      <span>By {post.author || 'Admin'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-dark font-spartan mb-3 leading-tight group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-500 leading-relaxed font-sans line-clamp-3 mb-4">
                    {post.content}
                  </p>

                  <button
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary-hover border-0 bg-transparent cursor-pointer group-hover:translate-x-1 transition-transform"
                    onClick={() => {
                      toast.success(`Opening detailed view for: ${post.title}`);
                    }}
                  >
                    <span>Read More</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-12 bg-white px-4 py-3 border border-gray-100 rounded-2xl w-fit mx-auto select-none">
            <button
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={page === 0}
              className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-9 w-9 text-sm font-semibold rounded-xl transition-all ${
                  page === i
                    ? 'bg-primary text-white shadow-sm'
                    : 'border border-gray-150 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={page === totalPages - 1}
              className="p-2 border border-gray-150 rounded-xl hover:bg-gray-50 text-gray-500 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
