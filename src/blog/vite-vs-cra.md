---
title: "Why I Chose Vite Over Create React App for My Portfolio"
description: "A breakdown of why Vite is the new standard for React development and how it improved my developer experience."
date: 2026-05-02
tags: ["React", "Performance", "Tooling"]
readTime: "3 min read"
slug: "why-i-chose-vite-over-cra"
---

For years, `create-react-app` (CRA) was the undisputed king of React scaffolding. It was the tool I reached for every time I started a new project. However, when building this portfolio, I made the deliberate choice to use **Vite** instead.

Here is why Vite is the new standard for React development.

## The Problem with CRA

CRA relies on Webpack under the hood. Webpack is incredibly powerful, but it bundles your entire application before the development server can start. As your project grows, this leads to:
- Slower server start times (sometimes taking 10-30 seconds).
- Sluggish Hot Module Replacement (HMR) when you save a file.

## Enter Vite

Vite takes a fundamentally different approach. It leverages native ES modules in the browser.

When you start a Vite development server, it doesn't bundle your app. It simply serves the source code directly to the browser, and the browser handles the module imports. 

### The Real-World Benefits

1. **Instant Server Start:** My portfolio development server starts in less than 300 milliseconds. 
2. **Lightning Fast HMR:** When I change a CSS color token or a React component, the update is reflected in the browser instantly, regardless of how large the app gets.
3. **Optimized Build:** For production, Vite uses Rollup, which produces highly optimized, small bundle sizes.

## Conclusion

Switching to Vite was a massive productivity boost. It removes the friction from the feedback loop, allowing me to focus entirely on writing code and designing UI, rather than waiting for Webpack to rebuild. If you haven't tried Vite yet, you are missing out on the best developer experience in the React ecosystem.
