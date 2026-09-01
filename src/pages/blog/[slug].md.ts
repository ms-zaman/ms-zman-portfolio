import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../../lib/agent-docs';

/**
 * /blog/<slug>.md — the raw markdown behind each post.
 *
 * getStaticPaths mirrors [slug].astro exactly (same sort, same
 * `post.data.slug || post.id` rule) so the .md filenames line up with the HTML
 * routes — including the posts whose frontmatter slug differs from the filename.
 * No route collision: the .astro pages build to /blog/<slug>/, these to
 * /blog/<slug>.md.
 */
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.data.slug || post.id },
    props: { post },
  }));
}

/** JSON string syntax is a valid YAML double-quoted scalar, so this handles the
 *  titles carrying colons, em dashes and quotes without hand-rolling an escaper. */
const yaml = (value: unknown) => JSON.stringify(value);

export const GET: APIRoute = ({ props }) => {
  const { post } = props as { post: Awaited<ReturnType<typeof getCollection<'blog'>>>[number] };
  const slug = post.data.slug || post.id;

  const frontmatter = [
    '---',
    `title: ${yaml(post.data.title)}`,
    `description: ${yaml(post.data.description)}`,
    `date: ${post.data.date.toISOString().slice(0, 10)}`,
    `tags: ${yaml(post.data.tags)}`,
    `readTime: ${yaml(post.data.readTime)}`,
    `canonical: ${yaml(`${SITE}/blog/${slug}`)}`,
    `author: "Sharfuzzaman"`,
    '---',
  ].join('\n');

  return new Response(`${frontmatter}\n\n${post.body ?? ''}\n`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
