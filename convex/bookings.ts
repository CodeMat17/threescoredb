import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getBookings = query({
  args: {
    email: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { email, limit }) => {
    let q = ctx.db.query("bookings").order("desc");
    if (email) {
      q = ctx.db
        .query("bookings")
        .withIndex("by_email", (ix) => ix.eq("email", email))
        .order("desc");
    }
    const results = await q.collect();
    if (limit && results.length > limit) return results.slice(0, limit);
    return results;
  },
});

export const addBookings = mutation({
  args: {
    packageTitle: v.string(),
    priceFromUsd: v.optional(v.number()),
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    nationality: v.optional(v.string()),
    passport: v.optional(v.string()),
    fromDate: v.number(),
    toDate: v.number(),
    rooms: v.number(),
    roomType: v.optional(v.string()),
    mealPlan: v.optional(v.string()),
    travelers: v.object({
      adults: v.number(),
      teens: v.number(),
      kids: v.number(),
    }),
    comments: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const id = await ctx.db.insert("bookings", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return id;
  },
});

export const deleteBookings = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return true;
  },
});
