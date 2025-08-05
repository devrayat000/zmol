import { pgTable, text, timestamp, serial, integer, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  title: text('title'),
  description: text('description'),
  clicks: integer('clicks').default(0).notNull(),
  isCustom: boolean('is_custom').default(false).notNull(),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const urlClicks = pgTable('url_clicks', {
  id: serial('id').primaryKey(),
  urlId: integer('url_id').references(() => urls.id).notNull(),
  userAgent: text('user_agent'),
  referer: text('referer'),
  ipAddress: text('ip_address'),
  country: text('country'),
  city: text('city'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});

// Zod schemas for validation
export const insertUrlSchema = createInsertSchema(urls, {
  originalUrl: z.string().url('Please enter a valid URL'),
  shortCode: z.string().min(3).max(20).regex(/^[a-zA-Z0-9-_]+$/, 'Short code can only contain letters, numbers, hyphens, and underscores'),
  title: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
}).omit({
  id: true,
  clicks: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUrlSchema = createSelectSchema(urls);

export type InsertUrl = z.infer<typeof insertUrlSchema>;
export type SelectUrl = z.infer<typeof selectUrlSchema>;
export type UrlClick = typeof urlClicks.$inferSelect;
