import React, { useState, useEffect } from 'react';
import { getAllPosts, searchPosts, getAllTags } from '../services/blogService';
import SearchBar from '../components/Blog/SearchBar';
import PostCard from '../components/Blog/PostCard';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);

  // Initial load
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [initialPosts, allTags] = await Promise.all([
          getAllPosts(),
          getAllTags()
        ]);
        setPosts(initialPosts);
        setTags(allTags);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Search effect
  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);
      try {
        const results = await searchPosts(query, selectedTag);
        setPosts(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search slightly to avoid too many renders if user types fast
    const timeoutId = setTimeout(() => {
      performSearch();
      setVisibleCount(4); // Reset visible count on new search/filter
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, selectedTag]);

  return (
    <div className="page-container blog-page">
      <header className="page-header">
        <h1 className="page-title">Thoughts & Engineering</h1>
        <p className="page-subtitle">
          Writing about React, Architecture, Performance, and the things I learn along the way.
        </p>
      </header>

      <section className="blog-controls-section">
        <SearchBar 
          query={query} 
          setQuery={setQuery} 
          selectedTag={selectedTag} 
          setSelectedTag={setSelectedTag}
          tags={tags}
        />
      </section>

      <section className="blog-posts-section">
        {loading ? (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="posts-grid">
              {posts.slice(0, visibleCount).map(post => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            
            {visibleCount < posts.length && (
              <div className="load-more-container">
                <button 
                  className="load-more-btn" 
                  onClick={() => setVisibleCount(prev => prev + 4)}
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-results">
            <h3>No posts found</h3>
            <p>Try adjusting your search query or removing filters.</p>
            <button className="btn-primary" onClick={() => { setQuery(''); setSelectedTag(null); }}>
              Clear Search
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
