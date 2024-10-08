import { Context } from '@/store/Context';
import { useContext, useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { useFetch } from '@/hooks/useFetch';
import { useHTTP } from '@/hooks/useHTTP';
import { compareArrays } from '@/util/compareArrays';
import Message from '@/models/Message';
import MessageItem from './Message';
import LoadingIndicator from '../loading/LoadingIndicator';
import Chat from '@/models/Chat';
import css from './Messages.module.css';

export default function Messages({ chat }: { chat: Chat }) {
  const {          _id, sessionId            } = chat;
  const {              navTo                 } = useContext(Context);
  const {           sendRequest              } = useHTTP();
  const { data: messages, isLoading, setData } = useFetch<Message[]>('messages/' + _id);
  const [value,     setValue] = useState('');
  const [didSend, setDidSend] = useState(false);
  const  msgRef               = useRef<HTMLLIElement>(null);

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim()) {
      const message = await sendRequest({
           url: 'message',
        method: 'POST',
          data: { chatId: _id, text: value },
      });
      if (message) {
          setValue('');
           setData((prevData) => (prevData ? [...prevData, message] : [message]));
        setDidSend(true);
      } else {
        navTo('/account'); // if session ends on server
      }
    }
  }

  useEffect(() => {
    const checkForMsgs = async () => {
      const response = await sendRequest({ url: 'messages/' + _id, method: 'GET' });
      if (response) {
        const newMsgs = compareArrays(messages || [], response);
        if (newMsgs.length > 0) {
          setData((prevData) => (prevData ? [...prevData, ...newMsgs] : [...newMsgs]))
        }
      }
    };

    const interval = setInterval(() => {
      checkForMsgs();
    }, 6000);

    return () => {
      clearInterval(interval);
    };
  }, [_id, messages, setData, sendRequest]);

  const scrollTo = () =>
    messages && messages.length > 0 && msgRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <motion.div className={css['messages']}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <LayoutGroup>
          <ul>
            {(messages || []).map((message: Message, index) => {
              const   isLast = index === (messages || []).length - 1;
              const duration = didSend ? 0.5 : Math.max(1.5 - 0.01 * index, 0.2);
              const    delay = didSend ? 0   : Math.min(      0.02 * index, 1.5);

              return (
                <MessageItem
                        key={message._id}
                        ref={isLast ? msgRef : null}
                    message={message}
                  sessionId={sessionId}
                   scrollTo={scrollTo}
                   duration={duration}
                      delay={delay}
                />
              );
            })}
          </ul>
        </LayoutGroup>
      )}
      <motion.form
        layout
        onSubmit={sendMessage}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0, transition: { ease: 'easeIn', duration: 0.5, delay: 1 } }}
      >
        <textarea value={value} onChange={(e) => setValue(e.target.value)} />
        <button>send</button>
      </motion.form>
    </motion.div>
  );
}
