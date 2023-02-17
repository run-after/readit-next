export interface User {
  groups: string[];
  likes: string[];
  hates: string[];
  displayName: string;
}
export interface IPost {
  content: string;
  group: string;
  image: string;
  likes: number;
  timestamp: number;
  title: string;
  user: string;
  id: string;
}
export interface IComment {
  user: string;
  timestamp: number;
  content: string;
  likes: number;
  post: string;
  id: string;
}
