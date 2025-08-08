const fs = require("fs");
const path = require("path");

const BASE_URL = "https://angelfallschristmas.pages.dev";
const POSTS_DIR = path.join(__dirname, "..", "posts");
const OUT_DIR = path.join(__dirname, "..", "out");

function getAllPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      return {
        url: `${BASE_URL}/blog/${slug}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "monthly",
        priority: 0.7,
      };
    });
}

function generateSitemap(posts) {
  const urls = posts
    .map(
      (post) => `
  <url>
    <loc>${post.url}</loc>
    <lastmod>${post.lastmod}</lastmod>
    <changefreq>${post.changefreq}</changefreq>
    <priority>${post.priority}</priority>
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function writeSitemap(content) {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);
  const sitemapPath = path.join(OUT_DIR, "sitemap.xml");
  fs.writeFileSync(sitemapPath, content, "utf8");
  console.log("✅ Sitemap written to:", sitemapPath);
}

const posts = getAllPosts();
const sitemap = generateSitemap(posts);
writeSitemap(sitemap);
