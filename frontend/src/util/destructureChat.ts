import Chat from '@/models/Chat';

export const destructureChat = (chat: Chat) => {
  const { _id, sessionId, members }       = chat;
  const { username,   _id: userId }       = members[0];
  const { username: sellerName, product } = members[1];
  const recipient = sessionId === userId ? sellerName : username;

  return { _id, recipient, product }
}
