import { Context } from '@/store/Context';
import { Dispatch, SetStateAction, useContext } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import {  useHTTP } from '@/hooks/useHTTP';
import       User   from '@/models/User';
import   UserInfo   from './UserInfo';
import   ItemForm   from '../form/ItemForm';
import   Listings   from '../listings/Listings';
import        css   from './Portal.module.css';

export default function Portal({
  user,
  onLogout,
  isLoading,
  setData,
}: {
       user: User;
   onLogout: () => void;
  isLoading: boolean;
    setData: Dispatch<SetStateAction<User>>;
}) {
  const { sendRequest, isLoading: sendingData, error, setError } = useHTTP();
  const { setExpanded } = useContext(Context);

  const { listings } = user;
  const hasItems = listings.length > 0;

  const submitHandler = async (data: object) => {
    const token = localStorage.getItem('token');
    const newItem = await sendRequest({ url: 'add-listing', method: 'POST', data, token });
    if (newItem) {
      setExpanded(false);
      setTimeout(() => {
        setData((user) => ({ ...user, listings: [newItem, ...listings] }));
      }, 500);
    }
  };

  const userInfoProps = { isLoading, user, onLogout, setError, adsOnline: listings.length };
  const itemFormProps = { error, isLoading: sendingData, dataFn: submitHandler };
  const listingsProps = { hasItems, listings, onUserPage: true };

  return (
    <LayoutGroup>
      <motion.div
            layout
        className={css['portal']}
          initial={{ y: -100 }}
          animate={{ y: 0, transition: { ease: 'easeIn', duration: 0.5 } }}
      >
        <UserInfo  {...userInfoProps} />
        <ItemForm  {...itemFormProps} />
        <Listings  {...listingsProps} />
      </motion.div>
    </LayoutGroup>
  );
}
