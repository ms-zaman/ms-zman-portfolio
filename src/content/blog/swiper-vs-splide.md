---
title: "Cutting Bundle Size: Migrating from Swiper to Splide.js"
description: "Swiper is great, but sometimes it is overkill. Here is why I migrated a recent client project to Splide for better performance."
date: 2026-03-22
tags: ["Performance", "JavaScript", "Optimization"]
readTime: "3 min read"
slug: "migrating-swiper-to-splide"
---

Performance optimization is an ongoing journey. In a recent project, I had to take a hard look at my dependency graph, and one culprit stood out: **Swiper.js**.

Don't get me wrong, Swiper is an incredible library. It's feature-rich and heavily documented. But for the specific task I had—a simple responsive category slider—it was massive overkill.

## The Audit

When I ran `vite-bundle-visualizer`, Swiper was taking up a large chunk of my initial vendor chunk. I only needed about 10% of its features (basic sliding, touch support, and breakpoints), but I was paying the performance tax for the other 90% (virtual slides, parallax effects, history APIs).

## The Migration Strategy

I decided to replace Swiper with **Splide.js**. Splide is a lightweight, accessible slider library written in TypeScript with zero dependencies.

The migration required some component refactoring:

### Before (Swiper):
```javascript
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

<Swiper spaceBetween={20} slidesPerView={3}>
  <SwiperSlide>Content</SwiperSlide>
</Swiper>
```

### After (Splide):
```javascript
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/core';

<Splide options={{ gap: '20px', perPage: 3 }}>
  <SplideSlide>Content</SplideSlide>
</Splide>
```

## The CSS Visibility Gotcha

It wasn't completely smooth sailing. After migrating, my sliders completely disappeared from the DOM! 

After debugging, I discovered that Splide uses a default CSS rule (`visibility: hidden`) on the `.splide` container until the JavaScript initializes it. Because I was heavily customizing the CSS structure in my Astro project, I hadn't imported the specific Splide core stylesheet that handles the initialization state.

Once I identified the issue, a quick CSS override fixed it:
```css
.splide.is-initialized,
.splide.is-rendered {
  visibility: visible;
}
```

## The Results

By making this swap, I reduced the JavaScript payload significantly, improving the Time to Interactive (TTI) on mobile devices. It's a reminder that choosing the *right* tool for the job is often better than choosing the most popular one.
