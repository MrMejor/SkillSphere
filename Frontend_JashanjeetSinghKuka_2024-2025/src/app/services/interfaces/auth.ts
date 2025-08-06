export interface UserInterface {

  username: string;
  password: string;
  roleName: "ADMIN" | "STUDENT" | "TEACHER";
  firstName: string;
  lastName: string;
  address: string;
}


export type LoginInterface = Pick<UserInterface, "username" | "password">

export interface CommentInterface {
  id?: number;          
  text: string;
  postId: number;
  userId: number;
  username: string;    
  createdAt?: string;   
  profileImage?: string | null;
}

export type CreateCommentInterface = Pick<CommentInterface, "text" | "postId" | "userId">;

// For API responses
export interface CommentResponseInterface extends CommentInterface {
  id: number;           // Now required
  createdAt: string;    // Now required
  username: string;     // Now required
}

export interface Post{
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  username: string;
  comments?: CommentInterface[];
  likes?: number; // Number of likes
  commentCount?: number; // Number of comments
  showComments?: boolean; // For toggling comment visibility
}

export interface PurchaseDto {
  id: number;
  name: string;
  description: string;

}

export interface UserPostSummary {
  fullName: string;
  username: string;
  postCount: number;
  role: string;
}
