import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavButton from './NavButton';
import css from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={css.nav}>
      <h2>▢◻▫ eHarbour <FontAwesomeIcon icon='anchor' size='xs' /> ▫◻</h2>
      <motion.ul
        initial='hidden'
        animate='visible'
        transition={{ staggerChildren: 0.2 }}
      >
        <NavButton path='/'        label='Home' />
        <NavButton path='/market'  label='Market' />
        <NavButton path='/account' label='Account' />
        <AnimatePresence>
          {localStorage.token && <NavButton path='/inbox' label='Inbox' />}
        </AnimatePresence>
      </motion.ul>
    </nav>
  );
}
