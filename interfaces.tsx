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
}
