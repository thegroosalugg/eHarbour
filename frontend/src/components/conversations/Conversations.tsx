import { Context } from '@/store/Context';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { destructureChat } from '@/util/destructureConversation';  // *REMINDER*
import Chat from '@/models/Conversation'; // *REMINDER*
import ChatItem from './Conversation';  // *REMINDER*
import Fallback from './Fallback';
import ErrorPage from '../error/Error';
import css from './Conversations.module.css'; // *REMINDER*

export default function Chats({ chats }: { chats: Chat[] }) {
  const [isActive, setIsActive] = useState<Chat[] | null>(null);
  const [   error,    setError] = useState(false);
  const {       chatId        } = useParams();
  const {     setMetadata     } = useContext(Context);

  useEffect(() => {
    if (chatId) {
      const chat = chats.find((chat) => chat._id === chatId);
      if (chat) {
        setIsActive([chat]);
        const { recipient } = destructureChat(chat);
        setMetadata({ title: recipient, description: 'Chat' })
        setError(false);
      } else {
        setError(true);
      }
    }
  }, [chats, chatId, setMetadata]);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <LayoutGroup>
      <motion.ul initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={css['chats']}>
        <AnimatePresence>
          {chats.length > 0 ? (
            (isActive ? isActive : chats).map((chat, index) => (
              <ChatItem
                      key={chat._id}
                    index={index}
                     chat={chat}
                 isActive={isActive}
                setActive={setIsActive}
              />
            ))
          ) : (
            <Fallback key='fallback' />
          )}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
