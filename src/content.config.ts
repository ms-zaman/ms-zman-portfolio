import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/blog' }),
  // `image()` resolves the path against the post's own folder and hands back
  // ImageMetadata (src + intrinsic width/height), which is what the layout needs
  // to emit og:image:width / og:image:height. Both fields are optional, so the
  // posts written before covers existed keep validating unchanged.
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()),
      readTime: z.string(),
      slug: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

export const collections = { blog };
