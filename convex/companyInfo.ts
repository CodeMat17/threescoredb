import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCompanyInfo = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("companyInfo").collect();
    return docs[0] ?? null;
  },
});

export const updateCompanyInfo = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    phones: v.array(v.string()),
    email: v.string(),
    instagram: v.string(),
    facebook: v.string(),
    businessHours: v.array(
      v.object({
        label: v.string(),
        hours: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const normalized = {
      name: args.name.trim(),
      address: args.address.trim(),
      phones: args.phones.map((p) => p.trim()),
      email: args.email.trim(),
      instagram: args.instagram.trim(),
      facebook: args.facebook.trim(),
      businessHours: args.businessHours.map((bh) => ({
        label: bh.label.trim(),
        hours: bh.hours.trim(),
      })),
    } as const;

    const existing = await ctx.db.query("companyInfo").collect();
    if (existing.length > 0) {
      await ctx.db.patch(existing[0]._id, normalized);
      return existing[0]._id;
    }
    return await ctx.db.insert("companyInfo", normalized);
  },
});
