import type { MetadataRoute } from "next";

// robots.txt generado por Next.js (Sprint 12D).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.grillete.dev/sitemap.xml",
  };
}
