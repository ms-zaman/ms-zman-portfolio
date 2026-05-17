import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  // Format the date beautifully
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}`} className="post-card-link">
        <div className="post-card-content">
          <div className="post-meta">
            <span className="post-date">{formattedDate}</span>
            <span className="post-read-time">{post.readTime}</span>
          </div>
          
          <h3 className="post-title">{post.title}</h3>
          <p className="post-excerpt">{post.excerpt}</p>
          
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="post-tag-chip">#{tag}</span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
