import type { LoaderArgs } from "@remix-run/node";
import { POST_DIR } from "./posts";
import { readdir } from "fs/promises";
import { statSync, readFileSync } from "fs";
import { resolve } from "path";
import ReactDomServer from "react-dom/server";
import ReactMarkdown from "react-markdown";

function escapeCdata(s: string) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

export const loader = async ({ request }: LoaderArgs) => {
  const posts = await readdir(POST_DIR);

  const postList = posts
    .map((post) => {
      const { ctime, mtime } = statSync(resolve(POST_DIR, post));
      const content = readFileSync(resolve(POST_DIR, post), {
        encoding: "utf-8",
      });
      return {
        name: post.replace(/\.mdx?$/, ""),
        create_at: ctime,
        modified_at: mtime,
        content,
      };
    })
    .sort((a, b) => b.create_at.getTime() - a.create_at.getTime());

  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const homeUrl = `${domain}`;
  console.log(ReactDomServer.renderToString(<div>222</div>));

  const rssString = `
    <rss xmlns:blogChannel="${homeUrl}" version="2.0">
      <channel>
        <title>Simpread - 技术文章收集</title>
        <link>${homeUrl}</link>
        <description>Simpread - 技术文章收集</description>
        <language>zh-Hans</language>
        <generator>summerscar</generator>
        <ttl>40</ttl>
        ${postList
          .map((post) =>
            `
            <item>
              <title><![CDATA[${escapeCdata(post.name)}]]></title>
              <description><![CDATA[${ReactDomServer.renderToString(
                <ReactMarkdown>{post?.content || ""}</ReactMarkdown>
              )}]]></description>
              <author><![CDATA[${escapeCdata("summerscar")}]]></author>
              <pubDate>${post.create_at.toUTCString()}</pubDate>
              <guid isPermaLink="false">${homeUrl}/posts/${escapeCdata(
              encodeURIComponent(post.name)
            )}</guid>
              <link>${homeUrl}/posts/${escapeCdata(
              encodeURIComponent(post.name)
            )}</link>
            </item>
          `.trim()
          )
          .join("\n")}
      </channel>
    </rss>
  `.trim();

  return new Response(rssString, {
    headers: {
      "Cache-Control": `public, max-age=${60 * 10}, s-maxage=${60 * 60 * 24}`,
      "Content-Type": "application/xml",
      "Content-Length": String(Buffer.byteLength(rssString)),
    },
  });
};
