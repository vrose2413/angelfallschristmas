import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Layout from "components/layout/Layout";
import BlogHeader from "components/BlogHeader";
import BlogBody from "components/BlogBody";
import MorePost from "components/MorePost";
import ShareButton from "components/ShareButton";
import Sidebar from "components/Sidebar";

import { getPostBySlug, getMorePosts, getAllPostsWithSlug } from "lib/index";

import { Container, Grid, Typography } from "@material-ui/core";
// ❌ Removed: import { remark } from "remark";
// ❌ Removed: import html from "remark-html";

export async function getStaticPaths() {
  const allPosts = getAllPostsWithSlug();

  const paths = allPosts.map(({ slug }) => ({
    params: { slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);

  // ✅ Dynamic import to support ESM-only modules in Cloudflare Pages
  const { remark } = await import("remark");
  const html = (await import("remark-html")).default;

  const processedContent = await remark().use(html).process(post.content);
  const contentHtml = processedContent.toString();

  const morePosts = getMorePosts(params.slug);

  return {
    props: {
      post: {
        ...post,
        content: contentHtml,
        frontmatter: {
          ...post.frontmatter,
          date: post.frontmatter.date.toString(),
        },
      },
      morePosts: morePosts.map((p) => ({
        ...p,
        frontmatter: {
          ...p.frontmatter,
          date: p.frontmatter.date.toString(),
        },
      })),
    },
  };
}

const Blog = ({ post, morePosts }) => {
  const router = useRouter();

  if (!router.isFallback && !post) {
    return <ErrorPage statusCode={404} />;
  }

  const {
    title,
    subTitle,
    author,
    authorImage,
    date,
    coverImage,
  } = post.frontmatter;

  return (
    <Layout
      title={title}
      description={subTitle}
      ogImage={coverImage}
      url={`https://yourdomain.com/blog/${post.slug}`}
    >
      <Container maxWidth="lg">
        <BlogHeader
          title={title}
          subtitle={subTitle}
          authorName={author}
          authorImage={authorImage}
          slug={post.slug}
          date={date}
          coverImage={coverImage}
        />

        <Grid container spacing={4}>
          {/* Left - Blog content */}
          <Grid item xs={12} md={8}>
            <BlogBody content={post.content} />

            <div style={{ marginTop: "3rem", textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                - Share -
              </Typography>
              <ShareButton url={`https://yourdomain.com/blog/${post.slug}`} />
            </div>

            <Typography
              align="center"
              gutterBottom
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "3em 0 1.5em",
                borderBottom: "2px solid rgb(208 208 208)",
              }}
            >
              - Recent Entries -
            </Typography>

            <Grid container spacing={4}>
              {morePosts.map(({ slug, frontmatter }) => (
                <Grid item key={slug} xs={12} sm={6}>
                  <MorePost
                    title={frontmatter.title}
                    subtitle={frontmatter.subTitle}
                    authorName={frontmatter.author}
                    authorImage={frontmatter.authorImage}
                    slug={slug}
                    date={frontmatter.date}
                    coverImage={frontmatter.coverImage}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Right - Sticky Sidebar */}
          <Grid item xs={12} md={4}>
            <Sidebar posts={morePosts.slice(0, 5)} />
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default Blog;
