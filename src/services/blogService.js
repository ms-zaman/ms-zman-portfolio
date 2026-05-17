import { posts } from '../data/posts';
import Fuse from 'fuse.js';

// Configuration for Fuse.js fuzzy search
const fuseOptions = {
  keys: ['title', 'excerpt', 'tags', 'content'],
  threshold: 0.3, // 0.0 is perfect match, 1.0 is match anything
  includeScore: true,
};

const fuse = new Fuse(posts, fuseOptions);

/**
 * Get all blog posts, sorted by date (newest first)
 */
export async function getAllPosts() {
  // Simulate network delay for realistic CMS feeling
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Get a specific post by its slug
 */
export async function getPostBySlug(slug) {
  await new Promise(resolve => setTimeout(resolve, 200));
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Search posts using Fuse.js (Fuzzy search)
 * @param {string} query - The search query
 * @param {string} tag - Optional tag filter
 */
export async function searchPosts(query, tag = null) {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let results = [...posts];

  // 1. Filter by tag first if provided
  if (tag) {
    results = results.filter(post => post.tags.includes(tag));
  }

  // 2. Perform fuzzy search if query exists
  if (query && query.trim() !== '') {
    // If we already filtered by tag, we need to create a new Fuse instance
    // just for those results to be accurate, or we can just run fuse on all
    // and intersect. Creating a temporary instance is cleaner.
    const tempFuse = new Fuse(results, fuseOptions);
    const fuseResults = tempFuse.search(query);
    // Fuse returns { item: Post, score: number }, map back to Post
    results = fuseResults.map(result => result.item);
  } else {
    // If no query but there is a tag, just sort by date
    results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return results;
}

/**
 * Get all unique tags across all posts
 */
export async function getAllTags() {
  const allPosts = await getAllPosts();
  const tagsSet = new Set();
  
  allPosts.forEach(post => {
    if (post.tags && Array.isArray(post.tags)) {
      post.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}
