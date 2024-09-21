import { useContext } from 'react';
import { Context } from '@/store/Context';
import { AnimatePresence, motion } from 'framer-motion';
import Input from './Input';
import ImagePicker from './ImagePicker';
import Button from '../button/Button';
import Listing from '@/models/Listing';
import css from './ItemForm.module.css';

export default function ItemForm({
  dataFn,
  isLoading,
  error,
  listing,
}: {
     dataFn: (data: object) => void;
  isLoading: boolean;
      error: object | null;
   listing?: Listing;
}) {
  const { title = '', price = '', description = '' } = listing || {};
  const { expanded } = useContext(Context);

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dataFn(data);
  };

  return (
    <AnimatePresence>
      {expanded && (
        <motion.form
            onSubmit={submitHandler}
           className={css['form']}
             initial={{ opacity: 0, height:     0  }}
             animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height:     0  }}
          transition={{ ease: 'linear', opacity: { duration: 0.5 } }}
        >
          <div className={css['inputs']}>
            <Input id='title'       error={error} defaultValue={title} />
            <Input id='price'       error={error} defaultValue={price} />
            <Input id='description' error={error} defaultValue={description} text />
          </div>
          <div className={css['controls']}>
            <ImagePicker error={error} />
            <Button text={listing ? 'Update' : 'Add +'} style={{ background: '#538392' }} isLoading={isLoading} />
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
