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

export const chats: Chat[] = [
  {
    id: '1',
    title: 'Contract Law Basics',
    messages: [
      { id: 1, role: 'user', content: 'What are the essential elements of a contract?' },
      { id: 2, role: 'ai', content: 'The essential elements of a valid contract are: Offer, Acceptance, Consideration, Intention to create legal relations, and Capacity of the parties. Each must be present for a contract to be legally enforceable.' },
      { id: 3, role: 'user', content: 'Can you explain consideration in more detail?' },
      { id: 4, role: 'ai', content: 'Certainly. Consideration is the "price" for the promise. It is something of value that each party gives to the other. It can be a promise to do something, a promise not to do something, or the performance of an act. It doesn\'t have to be adequate, but it must be sufficient, meaning it has some value in the eyes of the law.' },
    ],
  },
  {
    id: '2',
    title: 'Intellectual Property',
    messages: [
      { id: 1, role: 'user', content: 'What\'s the difference between a patent and a copyright?' },
      { id: 2, role: 'ai', content: 'A patent protects an invention, like a new machine or process, from being made, used, or sold by others without permission. A copyright, on the other hand, protects original works of authorship, such as books, music, or software code, from being reproduced or distributed without permission. The key difference is that patents protect ideas and inventions, while copyrights protect the expression of ideas.' },
    ],
  },
  {
    id: '3',
    title: 'Tenant Rights',
    messages: [
      { id: 1, role: 'user', content: 'My landlord wants to evict me. What are my rights?' },
      { id: 2, role: 'ai', content: 'Tenant rights regarding eviction vary significantly by jurisdiction. However, generally, a landlord must have a valid reason for eviction (like non-payment of rent or violation of lease terms) and must follow a specific legal process. This usually involves providing you with a written notice. You have the right to challenge the eviction in court. It is highly recommended to consult with a local legal aid society or an attorney.' },
    ]
  },
];
