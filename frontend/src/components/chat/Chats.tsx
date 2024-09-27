import { useHTTP } from '@/hooks/useHTTP';
import { useParams } from 'react-router-dom';
import { Context } from '@/store/Context';
import { useEffect, useState, useContext, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { destructureChat } from '@/util/destructureChat';
import { compareArrays } from '@/util/compareArrays';
import Chat from '@/models/Chat';
import ChatItem from './Chat';
import Fallback from './Fallback';
import ErrorPage from '../error/Error';
import css from './Chats.module.css';

export default function Chats({
  chats,
  setChats,
}: {
  chats: Chat[];
  setChats: Dispatch<SetStateAction<Chat[] | null>>;
}) {
  const [isActive, setIsActive] = useState<Chat[] | null>(null);
  const [   error,    setError] = useState(false);
  const {       chatId        } = useParams();
  const {     sendRequest     } = useHTTP<Chat[]>();
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

    const checkForNewChats = async () => {
      const response = await sendRequest({ url: 'chats', method: 'GET' });
      if (response) {
        const newChats = compareArrays(chats || [], response);
        if (newChats.length > 0) {
          setChats((prevData) => (prevData ? [...newChats, ...prevData] : [...newChats]))
        }
      }
    }

    const interval = setInterval(() => {
      checkForNewChats();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [chats, chatId, setChats, sendRequest, setMetadata]);

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
