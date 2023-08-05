import { Link, useLoaderData } from "@remix-run/react";
import { readdir } from "fs/promises";
import { statSync } from "fs";
import { resolve } from "path";

export const POST_DIR = "./md";

export async function loader() {
  const posts = await readdir(POST_DIR);

  const postList = posts
    .map((post) => {
      const { ctime, mtime } = statSync(resolve(POST_DIR, post));

      return {
        name: post.replace(/\.mdx?$/, ""),
        create_at: ctime,
        modified_at: mtime,
      };
    })
    .sort((a, b) => b.create_at.getTime() - a.create_at.getTime());
  return postList;
}

const Posts = ({ inline = false }: { inline?: Boolean }) => {
  const list = useLoaderData<typeof loader>();

  const posts = (
    <ul>
      {list.map((post, index) => (
        <li key={index} data-create_at={post.create_at}>
          <Link to={"/posts/" + post.name} target="_self" rel="noreferrer">
            {post.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  if (inline) {
    return posts;
  }

  return (
    <div>
      <Link to={"/"}>{"<"} Back</Link>
      <h1>Post</h1>

      {posts}
    </div>
  );
};

export default Posts;
