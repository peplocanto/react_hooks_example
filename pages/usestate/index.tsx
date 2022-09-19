import type { NextPage } from 'next';
import { useState } from 'react';
import Nav from '../../components/nav';
import styles from '../../styles/Home.module.css';

const DEFAULT_COUNT = 0;

const getDefaultCount = () => {
  console.log('render from State');
  return DEFAULT_COUNT;
};

const UseStatePage: NextPage = () => {
  const [count, setCount] = useState<number>(() => getDefaultCount());

  console.log('render from Component');

  const increment = () => {
    setCount((prev) => prev + 1);
  };

  const decrement = () => {
    setCount((prev) => prev - 1);
  };

  return (
    <div className={styles.container}>
      <Nav />
      <h1>Use State</h1>
      <div className={styles.counter__container}>
        <button
          onClick={decrement}
          disabled={count <= 0}
          className={styles.counter__button}
        >
          {'<'}
        </button>
        <div className={styles.counter__value}>{count}</div>
        <button onClick={increment} className={styles.counter__button}>
          {'>'}
        </button>
      </div>
    </div>
  );
};

export default UseStatePage;
