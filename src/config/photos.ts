import registry from "./photos.json";

/**
 * Every photograph of the owner that is published on /press and /ar/press/.
 *
 * The JSON file beside this one is the single source of truth. This module
 * types it for the pages; scripts/seo-data.mjs reads the same file for the
 * Person structured data and the image sitemap, so a photo cannot appear on
 * the page without also being declared to search engines, or the reverse.
 *
 * To add a photo, see "Adding photos" in the README.
 */
export type PhotoCopy = { alt: string; caption: string };

export type Photo = {
  /** Site-root path of a file under public/, e.g. "/photos/ibrahem-ahmed-hassan-adam-desk.webp". */
  src: string;
  width: number;
  height: number;
  en: PhotoCopy;
  ar: PhotoCopy;
};

export const PHOTOS: Photo[] = registry;
