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
      <h1>简悦 - 技术文章收集</h1>
      <Posts inline />
    </div>
  );
}
