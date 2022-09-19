import type { NextPage } from 'next';
import Nav from '../components/nav';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Nav />
      <h1>REACT HOOKs</h1>
      <p>Pagina de ejemplo de algunos de los principales hooks de React en NextJS.</p>
    </div>
  );
};

export default Home;
