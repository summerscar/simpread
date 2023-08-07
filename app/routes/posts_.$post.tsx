import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { POST_DIR } from "~/utils/config";
import { resolve } from "path";
import { Link, useLoaderData } from "@remix-run/react";
import ReactMarkdown from "react-markdown";
import * as matter from "gray-matter";

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
    const matterData = matter.read(postPath);

    return {
      title: post,
      content: matterData.content,
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
