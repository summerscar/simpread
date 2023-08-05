import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { readFile } from "fs/promises";
import { POST_DIR } from "./posts";
import { resolve } from "path";
import { Link, useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.title },
    { name: "description", content: "简悦 - 技术文章收集" },
  ];
};

export async function loader({ params }: LoaderArgs) {
  const post = params.post;
  if (!post) return null;

  try {
    const postPath = resolve(POST_DIR, `${post}.md`);
    const file = await readFile(postPath, { encoding: "utf-8" });
    return {
      title: post,
      content: file,
    };
  } catch (e: any) {
    console.error(`[post][${post}]:`, e.message);
    throw json("Not Found", { status: 404 });
  }
}

const Post = () => {
  const post = useLoaderData<typeof loader>();

  return (
    <div className="markdown-body">
      <nav>
        <Link style={{ fontSize: "32px" }} to={"/"}>
          🏡
        </Link>
      </nav>
      <ReactMarkdown>{post?.content || ""}</ReactMarkdown>;
    </div>
  );
};

export default Post;
