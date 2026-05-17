import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * BlogSearch — React island for interactive blog search, tag filtering, and load-more pagination.
 * Receives post metadata as a prop (no body content — keeps the payload small).
 * Used as <BlogSearch client:load posts={posts} /> in the blog list Astro page.
 */

const fuseOptions = {
  keys: ['title', 'description', 'tags'],
  threshold: 0.3,
  includeScore: true,
};

const BlogSearch = ({ posts }) => {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);

  // Extract all unique tags from posts
  const allTags = useMemo(() => {
    const tagSet = new Set();
    posts.forEach((post) => {
      if (post.tags) post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Create fuse instance
  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let results = [...posts];

    // 1. Filter by tag
    if (selectedTag) {
      results = results.filter((post) => post.tags.includes(selectedTag));
    }

    // 2. Fuzzy search
    if (query && query.trim() !== '') {
      const tempFuse = new Fuse(results, fuseOptions);
      const fuseResults = tempFuse.search(query);
      results = fuseResults.map((result) => result.item);
    } else {
      // Sort by date (newest first) when not searching
      results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return results;
  }, [posts, query, selectedTag, fuse]);

  // Reset visible count when search/filter changes
  useEffect(() => {
    setVisibleCount(4);
  }, [query, selectedTag]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      {/* Search Controls */}
      <section className="blog-controls-section">
        <div className="blog-search-container">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>

          {allTags.length > 0 && (
            <div className="tags-container">
              <button
                className={`tag-btn ${selectedTag === null ? 'active' : ''}`}
                onClick={() => setSelectedTag(null)}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-btn ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Post Results */}
      <section className="blog-posts-section">
        {filteredPosts.length > 0 ? (
          <>
            <div className="posts-grid">
              {filteredPosts.slice(0, visibleCount).map((post) => (
                <article className="post-card" key={post.slug}>
                  <a href={`/blog/${post.slug}`} className="post-card-link">
                    <div className="post-card-content">
                      <div className="post-meta">
                        <span className="post-date">{formatDate(post.date)}</span>
                        <span className="post-read-time">{post.readTime}</span>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-excerpt">{post.description}</p>
                      <div className="post-tags">
                        {post.tags.map((tag) => (
                          <span key={tag} className="post-tag-chip">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </a>
                </article>
              ))}
            </div>

            {visibleCount < filteredPosts.length && (
              <div className="load-more-container">
                <button
                  className="load-more-btn"
                  onClick={() => setVisibleCount((prev) => prev + 4)}
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
            <button
              className="btn-primary"
              onClick={() => {
                setQuery('');
                setSelectedTag(null);
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default BlogSearch;
