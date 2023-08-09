import type { LoaderArgs } from "@remix-run/node";
import { POST_DIR } from "~/utils/config";
import { readdir } from "fs/promises";
import { resolve } from "path";
import ReactDomServer from "react-dom/server";
import ReactMarkdown from "react-markdown";
import * as matter from "gray-matter";

export const getPostList = async (slice?: number) => {
  const posts = await readdir(POST_DIR);

  const postList = posts
    .map((post) => {
      const postPath = resolve(POST_DIR, post);
      const matterData = matter.read(postPath);

      return {
        name: post.replace(/\.mdx?$/, ""),
        create_at: matterData.data.date
          ? new Date(+matterData.data.date - 8 * 60 * 60 * 1000)
          : new Date(),
        content: matterData.content,
      };
    })
    .sort((a, b) => b.create_at.getTime() - a.create_at.getTime())
    .slice(0, slice ?? undefined);
  return postList;
};

function escapeCdata(s: string) {
  return s.replace(/\]\]>/g, "]]]]><![CDATA[>");
}

export const loader = async ({ request }: LoaderArgs) => {
  const postList = await getPostList(5);
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  if (!host) {
    throw new Error("Could not determine domain URL.");
  }
  const protocol = host.includes("localhost") ? "http" : "https";
  const domain = `${protocol}://${host}`;
  const homeUrl = `${domain}`;

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
