import { getAllPosts } from "../lib/api"; // Or wherever you fetch your posts

const BASE_URL = "https://angelfallschristmas.pages.dev";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${BASE_URL}</loc>
    </url>
    ${posts
      .map((post) => {
        return `
          <url>
              <loc>${`${BASE_URL}/blog/${post.slug}`}</loc>
          </url>
        `;
      })
      .join("")}
  </urlset>`;
}

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts(); // Fetch ALL posts with slugs from Contentful

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
