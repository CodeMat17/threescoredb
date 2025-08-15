import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getContact = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contact").collect();
  },
});

export const addContact = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const doc = {
      fullName: args.fullName.trim(),
      email: args.email.trim(),
      phone: args.phone.trim(),
      comment: args.comment.trim(),
    } as const;
    return await ctx.db.insert("contact", doc);
  },
});

export const deleteContact = mutation({
  args: { id: v.id("contact") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
    return true;
  },
});
