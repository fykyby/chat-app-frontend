export type User = {
  id: number;
  name: string;
  avatar: string;
};

export type Message = {
  id: number;
  user: User;
  content: string;
  createdAt: string;
};

export type ApiResponse = {
  ok: boolean;
  message: string;
  data: any;
};
