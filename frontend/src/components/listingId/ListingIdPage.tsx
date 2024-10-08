import { LayoutGroup, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHTTP } from '@/hooks/useHTTP';
import { forwardRef, useContext, useRef } from 'react';
import { Context } from '@/store/Context';
import ItemForm from '../form/ItemForm';
import Article from './Article';
import DeletePrompt from './DeletePrompt';
import Listing from '@/models/Listing';
import css from './ListingIdPage.module.css';

export const Box = forwardRef(
  ({ children }: { children: React.ReactNode }, ref: React.Ref<HTMLDivElement>) => (
    <motion.section
      layout
         ref={ref}
       style={{ padding: '0.8rem', borderRadius: 3, background: '#ffffff' }}
    >
      {children}
    </motion.section>
  )
);

const GitLink = ({ link, name }: { link: string; name: string }) => (
  <p>
    <FontAwesomeIcon icon={['fab', 'github']} />
    <a href={`https://github.com/${link}`} target='_blank' rel='noopener noreferrer'>
      {name}
    </a>
  </p>
);

export default function ListingIdPage({
  listing,
  onEdit,
  onDelete,
  isLoading,
  error,
  expanded,
  toggleForm,
}: {
     listing: Listing;
      onEdit: (data: object) => void;
    onDelete: () => void;
   isLoading: boolean;
       error: object | null;
    expanded: boolean;
  toggleForm: (ref: React.RefObject<HTMLElement>) => void;
}) {
  const { _id, title, price, imageUrl, userId, username, isLoggedIn } = listing;
  const myAd = isLoggedIn === userId;
  const {    navTo    } = useContext(Context);
  const { sendRequest } = useHTTP();
  const   scrollDownRef = useRef(null);
  const    scrollUpRef  = useRef(null);

  async function clickHandler() {
    if (!isLoggedIn) {
      navTo('/account');
    } else if (myAd) {
      toggleForm(expanded ? scrollUpRef : scrollDownRef);
    } else {
      const chat = await sendRequest({
           url: `chat/${userId}/${_id}`,
        method: 'GET',
      });
      if (chat) {
        navTo('/inbox/' + chat._id);
      } else {
        const newChat = await sendRequest({
             url: 'chat',
          method: 'POST',
            data: {
             seller: {
                    _id: userId,
               username,
                listing: { _id, title, price, imageUrl },
            },
          },
        });
        if (newChat) {
          navTo('/inbox/' + newChat._id);
        }
      }
    }
  }

  return (
    <LayoutGroup>
      <section className={css['container']}>
        <LayoutGroup>
          <Article listing={listing} ref={scrollUpRef} />
        </LayoutGroup>
        <LayoutGroup>
          <aside className={css['aside']}>
            <Box>
              <p>
                <span>Ad ID</span>
                <span>{_id}</span>
              </p>
              {isLoggedIn &&              <p>{myAd ? 'Manage your Ad' : 'Posted by ' + username}</p>}
              <button onClick={clickHandler}>{myAd ?   'Edit Listing' : 'Send Message'}</button>
              {myAd && <DeletePrompt onDelete={onDelete} />}
            </Box>
            <ItemForm
               expanded={expanded}
                 dataFn={onEdit}
              isLoading={isLoading}
                  error={error}
                listing={listing}
            />
            <Box ref={scrollDownRef}>
              <GitLink name='Victor Loginov' link='thegroosalugg' />
              <GitLink name='Iyayi Roland'   link='Iyayi2'        />
            </Box>
          </aside>
        </LayoutGroup>
      </section>
    </LayoutGroup>
  );
}
