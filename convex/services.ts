import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

import type { MutationCtx, QueryCtx } from "./_generated/server";

async function ensureUniqueSlug(
  ctx: MutationCtx | QueryCtx,
  base: string,
  excludeId?: string
): Promise<string> {
  let slug = base;
  let suffix = 1;
  // Collect all services and check for duplicates
  const all = await ctx.db.query("services").collect();
  while (
    all.some(
      (s: { slug: string; _id: string }) =>
        s.slug === slug && s._id !== excludeId
    )
  ) {
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
  return slug;
}

// Queries
export const getServices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("services").collect();
  },
});

// Mutations
export const addServices = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const subtitle = args.subtitle.trim();
    const description = args.description.trim();
    if (!title) throw new Error("Title is required");
    if (!subtitle) throw new Error("Subtitle is required");
    if (!description) throw new Error("Description is required");
    const slugBase = slugify(title);
    const slug = await ensureUniqueSlug(ctx, slugBase);
    return await ctx.db.insert("services", {
      slug,
      title,
      subtitle,
      description,
    });
  },
});

export const updateServices = mutation({
  args: {
    id: v.id("services"),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const subtitle = args.subtitle.trim();
    const description = args.description.trim();
    if (!title) throw new Error("Title is required");
    if (!subtitle) throw new Error("Subtitle is required");
    if (!description) throw new Error("Description is required");
    // Update slug if title changed
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Service not found");
    let slug = existing.slug as string;
    if (existing.title !== title) {
      const slugBase = slugify(title);
      slug = await ensureUniqueSlug(ctx, slugBase, args.id);
    }
    await ctx.db.patch(args.id, { slug, title, subtitle, description });
    return args.id;
  },
});

export const deleteServices = mutation({
  args: { id: v.id("services") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return true;
  },
});
