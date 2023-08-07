import { Link, useLoaderData } from "@remix-run/react";
import { getPostList } from "./posts[.]rss";

export async function loader() {
  const postList = await getPostList();

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
