// Google Analytics (gtag.js), alongside Clarity.
//
// Held until the browser is idle. gtag.js is ~130 kB that parses and runs on the
// main thread; as a plain `async` tag in <head> it was landing inside the load
// window and counting straight into Total Blocking Time. Nothing here needs to
// happen during the first paint — page_view fires just as well a moment later.
//
// The id is build-time public config; without it GA never loads, so local dev
// and forks stay clean.
const gaId = import.meta.env.PUBLIC_GA_ID || 'G-FL57VDMLD8';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

if (gaId) {
  const start = () => {
    if (document.getElementById('ga-script')) return;

    const tag = document.createElement('script');
    tag.async = true;
    tag.id = 'ga-script';
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    // Verbatim from Google's snippet: it pushes the `arguments` object itself,
    // not an array. Keep the function declaration — an arrow has no `arguments`.
    function gtag(..._args: unknown[]) {
      window.dataLayer!.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', gaId);
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 5000 });
  } else {
    setTimeout(start, 2000);
  }
}

export {};
