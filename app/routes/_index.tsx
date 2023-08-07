import type { V2_MetaFunction } from "@remix-run/node";
import Posts from "./posts";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "简悦 - 技术文章收集" },
    { name: "description", content: "简悦 - 技术文章收集" },
  ];
};

export { loader } from "./posts";

export default function Index() {
  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        textAlign: "center",
      }}
    >
      <h1 className="text-slate-800 text-4xl mt-4 mb-0">简悦 - 技术文章收集</h1>
      <div className="mt-4 mb-4">
        <a href="/posts.rss" target="_blank">
          <img width="15" height="15" src="./rss-feed-symbol.png" alt="rss" />{" "}
          RSS
        </a>
        <a
          style={{ paddingLeft: "10px" }}
          href="https://github.com/summerscar/simpread/tree/main/md"
          target="_blank"
          rel="noreferrer"
        >
          <img
            style={{
              transform: "scale(1.5)",
            }}
            width="15"
            height="15"
            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
            alt="rss"
          />{" "}
          Github
        </a>
      </div>
      <Posts inline />
    </div>
  );
}
