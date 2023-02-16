import { IPost } from "@/interfaces";
import Post from "./Post";

interface IPosts {
  posts: IPost[];
  showGroupButtons?: boolean;
}

export default function PostFeed({ posts, showGroupButtons }: IPosts) {
  return (
    <div className="p-4 px-12 space-y-6 flex-1">
      {posts.map((post: IPost) => (
        <Post
          key={post.timestamp}
          post={post}
          showGroupButton={showGroupButtons}
        />
      ))}
    </div>
  );
}
