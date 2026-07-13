import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  // Content Layer (Astro 5/6) : on charge les fichiers depuis le disque.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

const guideCategory = z.enum(['macro', 'fed', 'marches', 'crypto']);

const guideSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  ogImage: z.string().optional(),
  // Réponse définitionnelle courte, réutilisée dans le JSON-LD DefinedTerm.
  summary: z.string().optional(),
  // Famille de classement sur la page index des guides.
  category: guideCategory.optional(),
});

const guides = defineCollection({
  // Pages piliers : guides de référence longs, citables par les agents et moteurs de réponse.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: guideSchema,
});

const guidesEn = defineCollection({
  // Versions anglaises publiées explicitement, sans internationaliser tout le site.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides-en' }),
  schema: guideSchema.extend({
    // Slug du guide français source, ex: lire-le-pce-inflation-fed.
    sourceGuide: z.string(),
    // Date de révision du guide français au moment de la traduction.
    sourceUpdatedDate: z.coerce.date(),
  }),
});

const postsEn = defineCollection({
  // Versions anglaises d'articles d'analyse sélectionnés, même logique que guidesEn.
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts-en' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
    // Slug de l'article français source, ex: financement-circulaire-ia.
    sourceArticle: z.string(),
    // Date de révision de l'article français au moment de la traduction.
    sourceUpdatedDate: z.coerce.date(),
  }),
});

export const collections = { posts, guides, guidesEn, postsEn };
