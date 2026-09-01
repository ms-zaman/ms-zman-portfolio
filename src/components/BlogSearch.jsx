import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

/**
 * BlogSearch — React island for the blog list: a single search field over the
 * whole archive, then every matching post.
 *
 * Deliberately does NOT filter by tag or paginate. With 8 posts and 17 tags — 12
 * of them on exactly one post — a tag cloud was larger than the archive it
 * filtered and pushed the first article below the fold, and "Load More" hid four
 * posts behind a click for no reason. Both come back when the archive is big
 * enough to need them (roughly 25+ posts); until then, scrolling is the feature.
 *
 * Receives post metadata as a prop (no body content — keeps the payload small).
 */

const fuseOptions = {
  keys: ['title', 'description', 'tags'],
  threshold: 0.3,
  includeScore: true,
};

const BlogSearch = ({ posts }) => {
  const [query, setQuery] = useState('');

  const fuse = useMemo(() => new Fuse(posts, fuseOptions), [posts]);

  const filteredPosts = useMemo(() => {
    if (query.trim() === '') {
      return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return fuse.search(query).map((result) => result.item);
  }, [posts, query, fuse]);

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
        </div>
      </section>

      {/* Post Results */}
      <section className="blog-posts-section">
        {filteredPosts.length > 0 ? (
          <>
            <div className="posts-grid">
              {filteredPosts.map((post) => (
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
          </>
        ) : (
          <div className="no-results">
            <h3>No posts found</h3>
            <p>Nothing matched that search — try a different word.</p>
            <button
              className="btn-primary"
              onClick={() => setQuery('')}
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
