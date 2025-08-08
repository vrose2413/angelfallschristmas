import { useEffect } from "react";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";

export default function Sidebar({ posts }) {
  useEffect(() => {
    // ✅ Adsterra script
    const adScript = document.createElement("script");
    adScript.src = "https://bleedingofficecontagion.com/4a1f1119f949a4af74d56b8a3af8b867/invoke.js";
    adScript.type = "text/javascript";
    adScript.async = true;
    const adContainer = document.getElementById("adsterra-ad");
    if (adContainer) adContainer.appendChild(adScript);

    // ✅ Statcounter script
    window.sc_project = 12681502;
    window.sc_invisible = 1;
    window.sc_security = "e9d93c5a";

    const statScript = document.createElement("script");
    statScript.src = "https://www.statcounter.com/counter/counter.js";
    statScript.async = true;
    const statContainer = document.getElementById("statcounter");
    if (statContainer) statContainer.appendChild(statScript);
  }, []);

  return (
    <div style={{ position: "sticky", top: "100px" }}>
      <Typography
        variant="h6"
        gutterBottom
        style={{ fontWeight: "bold", marginBottom: "1rem" }}
      >
        More Posts
      </Typography>

      <List dense>
        {posts.map(({ slug, frontmatter }) => (
          <Link key={slug} href={`/blog/${slug}`} passHref>
            <ListItem button component="a">
              <ListItemText primary={frontmatter.title} />
            </ListItem>
          </Link>
        ))}
      </List>

      {/* ✅ Adsterra Ad Box with padding + border */}
      <div
        id="adsterra-ad"
        style={{
          marginTop: "30px",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#f9f9f9",
        }}
      />

      {/* ✅ Statcounter Tracking Code */}
      <div id="statcounter" style={{ display: "none" }} />
      <noscript>
        <div className="statcounter">
          <a
            title="Web Analytics"
            href="https://statcounter.com/"
            target="_blank"
            rel="noreferrer"
          >
            <img
              className="statcounter"
              src="https://c.statcounter.com/12681502/0/e9d93c5a/1/"
              alt="Web Analytics"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </noscript>
    </div>
  );
}
