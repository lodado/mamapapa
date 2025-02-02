export interface Comment {
  id: number;
  userId: string;
  boardId: string;
  content: string;
  createdAt?: string;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: number | null;
}
