import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPostBySlug } from '../services/blogService';
import MarkdownRenderer from '../components/MarkdownRenderer';

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostBySlug(slug);
        if (!data) {
          // If post not found, redirect to blog home or 404
          navigate('/blog', { replace: true });
          return;
        }
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="page-container flex-center">
        <div className="loader"></div>
      </div>
    );
  }

  if (!post) return null; // handled by navigate above

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="page-container blog-post-page">
      <Link to="/blog" className="back-link">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to articles
      </Link>

      <header className="post-header">
        <div className="post-meta-top">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="dot-separator">•</span>
          <span>{post.readTime}</span>
        </div>
        
        <h1 className="post-title-main">{post.title}</h1>
        
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="post-tag-chip">#{tag}</span>
          ))}
        </div>
      </header>

      <div className="post-content-wrapper">
        <MarkdownRenderer content={post.content} />
      </div>
    </article>
  );
};

export default BlogPost;
