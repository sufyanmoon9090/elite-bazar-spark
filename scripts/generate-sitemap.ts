/**
 * Sitemap generator — runs before `vite dev` and `vite build` (predev/prebuild).
 * Writes public/sitemap.xml with all static routes + every product URL.
 */
import { writeFileSync, readFileSync, existsSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://elite-bazar.lovable.app";

// Load .env manually (this script runs outside Vite)
const env: Record<string, string> = { ...process.env } as Record<string, string>;
if (existsSync(resolve(".env"))) {
  readFileSync(resolve(".env"), "utf-8")
    .split("\n")
    .forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (match) env[match[1]] = match[2];
    });
}

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Public, indexable static routes (admin / cart / checkout are excluded)
const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/shop", changefreq: "daily", priority: "0.9" },
  { path: "/deals", changefreq: "daily", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
];

async function fetchDynamicEntries(): Promise<SitemapEntry[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const entries: SitemapEntry[] = [];
  try {
    // Products
    const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=id`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (res.ok) {
      const rows = (await res.json()) as { id: string }[];
      rows.forEach((p) =>
        entries.push({ path: `/product/${p.id}`, changefreq: "weekly", priority: "0.8" })
      );
    }
    // Category listing pages (shop filtered by category)
    const catRes = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=slug`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    if (catRes.ok) {
      const cats = (await catRes.json()) as { slug: string }[];
      cats.forEach((c) =>
        entries.push({ path: `/shop?category=${c.slug}`, changefreq: "weekly", priority: "0.7" })
      );
    }
  } catch (err) {
    console.warn("sitemap: could not fetch dynamic routes —", (err as Error).message);
  }
  return entries;
}

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${escapeXml(BASE_URL + e.path)}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const entries = [...staticEntries, ...(await fetchDynamicEntries())];
writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
