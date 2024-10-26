import { forwardRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box } from './ListingIdPage';
import Listing from '@/models/Listing';
import css from './Article.module.css';

const Article = forwardRef(({ listing }: { listing: Listing }, ref: React.Ref<HTMLDivElement>) => {
  const { title, description, price, imageUrl } = listing;

  const animationProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y:   0 },
       exit: { opacity: 0, y:  10 },
  };

  return (
    <motion.article layout className={css.article} ref={ref}>
      <AnimatePresence mode='wait' initial={false}>
        <motion.img
              layout
                 key={imageUrl}
                 src={import.meta.env.VITE_SERVER_URL + imageUrl}
                 alt='listing'
             initial={{ opacity: 0, height: 0,      maxWidth: 0      }}
             animate={{ opacity: 1, height: 'auto', maxWidth: '100%' }}
                exit={{ opacity: 0, height: 0,      maxWidth: 0      }}
          transition={{   ease: 'linear', duration: 0.7, delay: 0.9  }}
        />
      </AnimatePresence>
      <Box>
        <AnimatePresence mode='wait' initial={false}>
          <motion.h2 key={title} {...animationProps}>
            {title}
          </motion.h2>
        </AnimatePresence>
        <AnimatePresence mode='wait' initial={false}>
          <motion.p key={price} {...animationProps}>
            ${price.toFixed(2)}
          </motion.p>
        </AnimatePresence>
      </Box>
      <Box>
        <h2>Description</h2>
        <AnimatePresence mode='wait' initial={false}>
          <motion.p key={description} {...animationProps}>
            {description}
          </motion.p>
        </AnimatePresence>
      </Box>
    </motion.article>
  );
})

export default Article;
