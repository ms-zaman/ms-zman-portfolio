import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE, EMAIL, summary } from '../lib/agent-docs';

/**
 * /llms.txt — llmstxt.org format: H1, blockquote summary, then `##` sections of
 * markdown links.
 *
 * Generated rather than checked into public/ so the post list is read from the
 * content collection and cannot go stale. Every post links to its `.md` mirror,
 * which is the copy an agent actually wants.
 *
 * Slug rule mirrors src/pages/blog/[slug].astro — `post.data.slug || post.id` —
 * because several posts override their filename in frontmatter.
 */
export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog')).sort(
    (a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf(),
  );

  const writing = posts
    .map((post) => {
      const slug = post.data.slug || post.id;
      return `- [${post.data.title}](${SITE}/blog/${slug}.md): ${post.data.description}`;
    })
    .join('\n');

  const body = `# Sharfuzzaman

> ${summary}

## Start here

- [Homepage (markdown)](${SITE}/index.md): full profile: expertise, selected work, experience and contact details, as plain markdown.
- [Homepage (HTML)](${SITE}/): the site itself.
- [Résumé (PDF)](${SITE}/Sharfuzzaman-Resume.pdf): the CV a recruiter would ask for.

## Writing

${writing}

- [All articles](${SITE}/blog): the full archive.

## Contact

- [Email](mailto:${EMAIL}): ${EMAIL}, currently looking for a remote WordPress / Web Developer position.
- [GitHub](https://github.com/ms-zaman): open source work, including DesignScan and Redline.
- [LinkedIn](https://www.linkedin.com/in/sharfuzzaman/): professional profile.

## Optional

- [Sitemap](${SITE}/sitemap.xml): every indexable URL.
- [OpenAPI description](${SITE}/openapi.json): the machine-readable read-only endpoints of this site.
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
