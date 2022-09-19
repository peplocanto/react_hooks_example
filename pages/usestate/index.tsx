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

  console.log('render from Component');

  return (
    <div className={styles.container}>
      <Nav />
      <h1>Use State</h1>
      <div className={styles.counter__container}>
      </div>
    </div>
  );
};

export default UseStatePage;
