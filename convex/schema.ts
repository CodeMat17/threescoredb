import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Generic pages (used by convex/pages.ts)
  pages: defineTable({
    slug: v.string(),
    title: v.string(),
    content: v.any(),
    excerpt: v.optional(v.string()),
    heroImageId: v.optional(v.id("_storage")),
    published: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),

  contact: defineTable({
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    comment: v.string(),
  }),

  companyInfo: defineTable({
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
  }),

  blog: defineTable({
    slug: v.string(),
    title: v.string(),
    // description: v.string(),
    content: v.string(),
    imageId: v.id("_storage"),
    image: v.string(),
  }),

  services: defineTable({
    slug: v.string(),
    title: v.string(),
    subtitle: v.string(),
    description: v.string(),
  }),

  packages: defineTable({
    title: v.string(),
    destination: v.string(),
    price: v.number(),
    days: v.number(),
    highlight: v.array(v.string()),
    itinerary: v.array(v.string()),
    imageId: v.id("_storage"),
    image: v.string(),
  }),

  // Media table (used by convex/media.ts)
  media: defineTable({
    storageId: v.id("_storage"),
    contentType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    size: v.optional(v.number()),
    alt: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  heroCarousel: defineTable({
    title: v.string(),
    subtitle: v.string(),
    imageId: v.id("_storage"),
    image: v.string(),
  }),

  // About page sections
  aboutHero: defineTable({
    title: v.string(),
    description: v.string(),
    imageId: v.id("_storage"),
    image: v.string(),
  }),

  whoWeAre: defineTable({
    title: v.string(),
    body: v.string(),
  }),

  whatWeOffer: defineTable({
    title: v.string(),
    items: v.array(v.string()),
  }),

  ourStrength: defineTable({
    items: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  }),

  whyChooseUs: defineTable({
    items: v.array(
      v.object({
        title: v.string(),
        description: v.string(),
      })
    ),
  }),

  testimonials: defineTable({
    authorName: v.string(),
    authorTitle: v.optional(v.string()),
    content: v.string(),
    avatarImageId: v.optional(v.id("_storage")),
    order: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["order"])
    .index("by_active", ["active"]),

  // Singletons key-value (used by convex/singletons.ts)
  singletons: defineTable({
    key: v.string(),
    data: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  socials: defineTable({
    facebook: v.string(),
    instagram: v.string(),
  }),

  bookings: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_email", ["email"]),
});
