import type { MetadataRoute } from "next";

// sitemap.xml generado por Next.js (Sprint 12D).
// SPA de scroll con una sola página; si en el futuro se añaden rutas
// nuevas, se amplía esta lista.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.grillete.dev",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
