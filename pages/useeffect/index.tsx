import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import Nav from '../../components/nav';
import styles from '../../styles/Home.module.css';

// Fetch Service with config and schema
const RESOURCES = ['posts', 'comments', 'todos', 'error'] as const;
type Resource = typeof RESOURCES[number];

const fetchService = async (param: Resource) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/${param}`);
  if (res.status < 399) {
    return res.json();
  } else {
    throw new Error(`Error ${res.status}`);
  }
};

// State schema and utils
enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}
type Item = Record<'id' | 'title' | string, string>;
interface State {
  status: Status;
  resourceType?: Resource;
  items: Item[];
}

const setInitialState = (): State => {
  return {
    status: Status.LOADING,
    resourceType: undefined,
    items: [],
  };
};

// Page
const UseEffectPage: NextPage = () => {
  const [state, setState] = useState<State>(() => setInitialState());

  function updateState(state?: State) {
    setState(() => state ?? setInitialState());
  }
  
  function updateStateKey<T extends keyof State>(key: T, value: State[T]) {
    setState((prevState) => ({ ...prevState, [key]: value }));
  }

  const renderButton = (resource: Resource) => {
    return (
      <button
        key={resource}
        className={`${styles.resources__button} ${
          state.resourceType === resource && styles.resources__active
        }`}
        onClick={() =>
          state.resourceType !== resource &&
          updateStateKey('resourceType', resource)
        }
      >
        {resource}
      </button>
    );
  };

  const renderContent = () => {
    switch (state.status) {
      case Status.SUCCESS:
        return (
          <div className={styles.resources__item__container}>
            {state.items.map((item) => (
              <div className={styles.resources__item} key={item.id}>
                {state.resourceType} - {item.title ?? item.name}
              </div>
            ))}
          </div>
        );
      case Status.ERROR:
        return <div className={styles.resources__error}>Error 404</div>;
      case Status.LOADING:
      default:
        return <div className={styles.resources__loading}>Loading...</div>;
    }
  };

  return (
    <div className={styles.container}>
      <Nav />
      <h1>Use Effect</h1>
      <div className={styles.resources__container}>
        {RESOURCES.map((r) => renderButton(r))}
      </div>
      {state.resourceType && (
        <h3 className={styles.resources__subtitle}>{state.resourceType}</h3>
      )}
      {renderContent()}
    </div>
  );
};

export default UseEffectPage;
