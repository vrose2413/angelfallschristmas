// pages/sitemap.xml.js
import { getAllPosts } from "../lib/api"; // adjust to your actual data fetching logic

const EXTERNAL_DATA_URL = 'https://angelfallschristmas.pages.dev';

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${EXTERNAL_DATA_URL}</loc>
    </url>
    ${posts
      .map((post) => {
        return `
          <url>
              <loc>${`${EXTERNAL_DATA_URL}/posts/${post.slug}`}</loc>
          </url>
        `;
      })
      .join("")}
  </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const posts = await getAllPosts(); // You must fetch ALL posts here from Contentful or wherever

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
