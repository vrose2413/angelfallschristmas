const fs = require("fs");
const path = require("path");
const glob = require("glob");
const matter = require("gray-matter");

const baseUrl = "https://angelfallschristmas.pages.dev";
const pagesDir = path.join(__dirname, "../pages");
const postsDir = path.join(__dirname, "../posts");
const outDir = path.join(__dirname, "../out");

function getStaticPages() {
  const pagePaths = glob.sync("**/*.js", {
    cwd: pagesDir,
    ignore: [
      "_*.js",
      "**/[[]*[]].js",
      "api/**",
    ]
  });

  return pagePaths.map((file) => {
    const route = file
      .replace(/\.js$/, "")
      .replace(/index$/, "")
      .replace(/\\/g, "/");

    return `${baseUrl}/${route}`;
  });
}

function getBlogPosts() {
  const postFiles = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));

  return postFiles.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const fullPath = path.join(postsDir, file);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    const lastmod = data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    return {
      loc: `${baseUrl}/blog/${slug}`,
      lastmod,
    };
  });
}

function generateSitemap() {
  const pages = getStaticPages();
  const posts = getBlogPosts();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((url) => `<url><loc>${url}</loc></url>`)
  .join("\n")}
${posts
  .map(
    ({ loc, lastmod }) => `
<url>
  <loc>${loc}</loc>
  <lastmod>${lastmod}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  fs.writeFileSync(path.join(outDir, "sitemap.xml"), sitemap, "utf8");
  console.log("✅ sitemap.xml generated and includes both pages and blog posts.");
}

generateSitemap();
