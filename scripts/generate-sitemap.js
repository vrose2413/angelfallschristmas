const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const BASE_URL = "https://angelfallschristmas.pages.dev";
const postsDirectory = path.join(__dirname, "..", "posts");
const outDir = path.join(__dirname, "..", "out");
const sitemapPath = path.join(outDir, "sitemap.xml");

function getAllPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      filePath: path.join(postsDirectory, file),
    }));
}

function generateSitemap() {
  const posts = getAllPostSlugs();

  const urls = posts.map(({ slug, filePath }) => {
    const content = fs.readFileSync(filePath, "utf8");
    const { data } = matter(content);

    const lastmod = data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  fs.writeFileSync(sitemapPath, sitemap, "utf8");
  console.log("✅ Sitemap generated at", sitemapPath);
}

generateSitemap();
