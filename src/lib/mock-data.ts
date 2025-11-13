export type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export const chats: Chat[] = [];
