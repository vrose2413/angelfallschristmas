const fs = require("fs");
const path = require("path");

const BASE_URL = "https://angelfallschristmas.pages.dev";
const POSTS_DIR = path.join(__dirname, "..", "posts");

function getPostSlugs() {
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith(".md"));
}

function generateSitemap() {
  const pages = getPostSlugs().map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(POSTS_DIR, filename);
    const stats = fs.statSync(filePath);
    const lastmod = stats.mtime.toISOString();

    return `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.join("\n")}
</urlset>`;

  fs.writeFileSync("public/sitemap.xml", sitemap, "utf8");
  console.log("✅ Sitemap generated: public/sitemap.xml");
}

generateSitemap();
