export async function fetchOgImage(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'curl/7.0' } });
    if (!res.ok) return '';
    const html = await res.text();
    const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
               || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    return match ? match[1] : '';
  } catch (error) {
    return '';
  }
}
