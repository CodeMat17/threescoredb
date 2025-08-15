import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Queries
export const getPackages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("packages").collect();
  },
});

// Mutations
export const addPackages = mutation({
  args: {
    title: v.string(),
    destination: v.string(),
    price: v.number(),
    days: v.number(),
    highlight: v.array(v.string()),
    itinerary: v.array(v.string()),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const destination = args.destination.trim();
    const price = args.price;
    const days = args.days;
    const highlight = args.highlight
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const itinerary = args.itinerary
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!title) throw new Error("Title is required");
    if (!destination) throw new Error("Destination is required");
    if (!Number.isFinite(price) || price <= 0)
      throw new Error("Price must be > 0");
    if (!Number.isInteger(days) || days <= 0)
      throw new Error("Days must be an integer > 0");
    if (highlight.length === 0) throw new Error("Highlights are required");
    if (itinerary.length === 0) throw new Error("Itinerary is required");

    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    return await ctx.db.insert("packages", {
      title,
      destination,
      price,
      days,
      highlight,
      itinerary,
      imageId: args.imageId,
      image,
    });
  },
});

export const updatePackages = mutation({
  args: {
    id: v.id("packages"),
    title: v.string(),
    destination: v.string(),
    price: v.number(),
    days: v.number(),
    highlight: v.array(v.string()),
    itinerary: v.array(v.string()),
    imageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const title = args.title.trim();
    const destination = args.destination.trim();
    const price = args.price;
    const days = args.days;
    const highlight = args.highlight
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const itinerary = args.itinerary
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!title) throw new Error("Title is required");
    if (!destination) throw new Error("Destination is required");
    if (!Number.isFinite(price) || price <= 0)
      throw new Error("Price must be > 0");
    if (!Number.isInteger(days) || days <= 0)
      throw new Error("Days must be an integer > 0");
    if (highlight.length === 0) throw new Error("Highlights are required");
    if (itinerary.length === 0) throw new Error("Itinerary is required");

    const image = await ctx.storage.getUrl(args.imageId);
    if (!image) throw new Error("Failed to resolve image URL");
    await ctx.db.patch(args.id, {
      title,
      destination,
      price,
      days,
      highlight,
      itinerary,
      imageId: args.imageId,
      image,
    });
    return args.id;
  },
});

export const deletePackages = mutation({
  args: { id: v.id("packages") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (doc?.imageId) {
      await ctx.storage.delete(doc.imageId as Id<"_storage">);
    }
    await ctx.db.delete(id);
    return true;
  },
});
