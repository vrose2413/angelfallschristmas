// pages/sitemap.xml.js
import { getAllPosts } from "../lib/api";

const BASE_URL = "https://angelfallschristmas.pages.dev";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${BASE_URL}</loc>
      <changefreq>weekly</changefreq>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    ${posts
      .map((post) => {
        return `
          <url>
              <loc>${`${BASE_URL}/blog/${post.slug}`}</loc>
              <changefreq>monthly</changefreq>
              <lastmod>${new Date(post.date).toISOString()}</lastmod>
          </url>
        `;
      })
      .join("")}
  </urlset>`;
}

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts(); // Must include `slug` and `date`

  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function SiteMap() {
  return null;
}
