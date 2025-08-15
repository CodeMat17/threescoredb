/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as aboutHero from "../aboutHero.js";
import type * as blog from "../blog.js";
import type * as bookings from "../bookings.js";
import type * as carousel from "../carousel.js";
import type * as companyInfo from "../companyInfo.js";
import type * as contact from "../contact.js";
import type * as media from "../media.js";
import type * as ourStrength from "../ourStrength.js";
import type * as packages from "../packages.js";
import type * as pages from "../pages.js";
import type * as services from "../services.js";
import type * as singletons from "../singletons.js";
import type * as socials from "../socials.js";
import type * as storage from "../storage.js";
import type * as uploads from "../uploads.js";
import type * as whatWeOffer from "../whatWeOffer.js";
import type * as whoWeAre from "../whoWeAre.js";
import type * as whyChooseUs from "../whyChooseUs.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  aboutHero: typeof aboutHero;
  blog: typeof blog;
  bookings: typeof bookings;
  carousel: typeof carousel;
  companyInfo: typeof companyInfo;
  contact: typeof contact;
  media: typeof media;
  ourStrength: typeof ourStrength;
  packages: typeof packages;
  pages: typeof pages;
  services: typeof services;
  singletons: typeof singletons;
  socials: typeof socials;
  storage: typeof storage;
  uploads: typeof uploads;
  whatWeOffer: typeof whatWeOffer;
  whoWeAre: typeof whoWeAre;
  whyChooseUs: typeof whyChooseUs;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
