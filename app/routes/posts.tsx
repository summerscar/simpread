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
        <li className="mb-1" key={index} data-create_at={post.create_at}>
          <Link
            className="text-neutral-600 hover:text-gray-500 hover:shadow"
            to={"/posts/" + post.name}
            target="_self"
            rel="noreferrer"
            title={`${post.name} - ${new Date(
              post.create_at
            ).toLocaleString()}`}
          >
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
