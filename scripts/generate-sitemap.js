const fs = require("fs");
const path = require("path");

const BASE_URL = "https://angelfallschristmas.pages.dev";
const POSTS_DIR = path.join(__dirname, "..", "posts");
const OUT_DIR = path.join(__dirname, "..", "out");

function getPostSlugs() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter(file => file.endsWith(".md") || file.endsWith(".mdx"))
    .map(file => file.replace(/\.mdx?$/, ""));
}

function getLastMod(filepath) {
  const stats = fs.statSync(filepath);
  return stats.mtime.toISOString().split("T")[0];
}

function generateSitemapXml(postSlugs) {
  const urls = postSlugs
    .map(slug => {
      const filepath = path.join(POSTS_DIR, `${slug}.md`);
      const lastmod = getLastMod(filepath);
      return `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
  </url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>weekly</changefreq>
  </url>${urls}
</urlset>`;
}

// Ensure output folder exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const slugs = getPostSlugs();
const sitemap = generateSitemapXml(slugs);
fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), sitemap);

console.log("✅ Sitemap generated at: /out/sitemap.xml");
