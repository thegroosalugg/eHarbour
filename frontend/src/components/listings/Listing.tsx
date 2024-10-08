import { motion } from 'framer-motion';
import { useContext } from 'react';
import { Context } from '@/store/Context';
import Listing from '@/models/Listing';
import css from './Listing.module.css';

export default function ListingItem({ listing }: { listing: Listing; }) {
  const { _id, title, price, description, imageUrl, username } = listing;
  const { navTo, isAnimating, setMetadata } = useContext(Context);

  function clickHandler() {
    navTo('/market/' + _id)
    !isAnimating && setMetadata({ title, description });
  }

  return (
    <motion.li
          layout
       className={css['listing']}
        variants={{
          hidden: { opacity: 0, y: -50 },
         visible: { opacity: 1, y:   0 },
        }}
            exit={{ opacity: 0, scale: 0 }}
      whileHover={{ borderColor: '#000', y: -5 }}
      transition={{ ease: 'easeInOut', duration: 0.45, layout: { duration: 0.65 } }}
         onClick={clickHandler}
    >
      <img src={import.meta.env.VITE_SERVER_URL + imageUrl} alt={title} />
      {username && <p className={css['username']}>Posted by {username}</p>}
      <div className={css['details']}>
        <p>
          ${price.toFixed(2)} ○ {title}
        </p>
        <p style={{ color: '#7a7676' }}>{description}</p>
      </div>
    </motion.li>
  );
}
