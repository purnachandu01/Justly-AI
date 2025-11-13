export type Message = {
  id: number;
  role: 'user' | 'ai';
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export const chats: Chat[] = [];
