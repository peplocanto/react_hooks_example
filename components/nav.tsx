import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Nav.module.css';

const config = [
  { path: '/', label: 'Home' },
  { path: '/usestate', label: 'Use State' },
  { path: '/useeffect', label: 'Use Effect' },
];

const Nav = () => {
  const router = useRouter();

  return (
    <ul className={styles.container}>
      {config.map((c) => (
        <li
          key={c.path}
          className={`${styles.item} ${
            c.path === router.asPath && styles.active
          }`}
        >
          <Link href={c.path}>
            <a>{c.label}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Nav;
