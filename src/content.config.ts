import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    year: z.string(),
    order: z.number().default(99),
    client: z.string().optional(),
    excerpt: z.string(),
    cover: z.string(),
    coverAlt: z.string(),
    services: z.array(z.string()).default([]),
    results: z
      .array(z.object({ figure: z.string(), label: z.string() }))
      .default([]),
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
