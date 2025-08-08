const fs = require("fs");
const path = require("path");

const SITE_URL = "https://angelfallschristmas.pages.dev";

// Get all slugs from the /posts directory
const postsDirectory = path.join(__dirname, "..", "posts");
const filenames = fs.readdirSync(postsDirectory);

const posts = filenames
  .filter((file) => file.endsWith(".md"))
  .map((file) => {
    const slug = file.replace(/\.md$/, "");
    return {
      url: `${SITE_URL}/blog/${slug}`,
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: 0.7,
    };
  });

// Add homepage and static pages if needed
const staticPaths = [
  { url: `${SITE_URL}/`, changefreq: "weekly", priority: 1.0 },
  { url: `${SITE_URL}/about`, changefreq: "monthly", priority: 0.5 }, // optional
];

const allUrls = [...staticPaths, ...posts];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

fs.writeFileSync(path.join(__dirname, "..", "out", "sitemap.xml"), sitemapXml);

console.log("✅ Sitemap generated at: /out/sitemap.xml");
