import type { APIRoute } from 'astro';
import { homeMarkdown } from '../lib/agent-docs';

/**
 * /index.md — the homepage as markdown, for agents that would rather read prose
 * than parse a WebGL-heavy page. Also the target the Netlify edge function
 * rewrites to when a client sends `Accept: text/markdown` for `/`.
 */
export const GET: APIRoute = () =>
  new Response(homeMarkdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
