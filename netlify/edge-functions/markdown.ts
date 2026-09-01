/**
 * markdown — content negotiation for a static site.
 *
 * Astro builds `/index.md` and `/blog/<slug>.md` alongside the HTML, but a
 * static host cannot vary on a request header. This sits in front of `/` and
 * `/blog/*` only (see netlify.toml) and rewrites to the markdown twin when the
 * client asks for it, either with `Accept: text/markdown` or `?format=md`.
 *
 * Everything else falls straight through untouched — an HTML visitor pays one
 * header check, and the response is not rewritten, buffered or re-encoded.
 *
 * Deno runtime: no remote type imports here on purpose, so `astro check` (which
 * globs `**\/*`) never has to resolve them. `netlify/` is excluded in tsconfig.
 */

interface NetlifyContext {
  rewrite: (path: string) => Promise<Response>;
}

/** `/` -> `/index.md`; `/blog/foo` and `/blog/foo/` -> `/blog/foo.md`. */
function markdownTwin(pathname: string): string | null {
  if (pathname === '/' || pathname === '/index.html') return '/index.md';

  // Already a markdown request, or the archive index, which has no mirror.
  if (pathname.endsWith('.md')) return null;

  const post = pathname.match(/^\/blog\/([^/]+)\/?$/);
  return post ? `/blog/${post[1]}.md` : null;
}

export default async function handler(request: Request, context: NetlifyContext) {
  const url = new URL(request.url);
  const accept = request.headers.get('accept') ?? '';

  const wantsMarkdown =
    url.searchParams.get('format') === 'md' || accept.includes('text/markdown');

  // Not a markdown request: hand it back untouched.
  if (!wantsMarkdown) return;

  const twin = markdownTwin(url.pathname);
  if (!twin) return;

  const response = await context.rewrite(twin);

  // No mirror built for this URL (an unknown slug, say) — let the normal
  // HTML/404 path answer rather than returning a markdown-typed error page.
  if (!response.ok) return;

  return new Response(await response.text(), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // The same URL now has two representations; keep a shared cache from
      // handing the markdown copy to a browser that asked for HTML.
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
