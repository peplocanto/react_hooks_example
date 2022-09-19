## Intro

- definicion de hook

  - Los Hooks son funciones especiales de react que permiten acceder a funcionalidades de los classComponents en un contexto de componentes funcionales.

  En la leccion de hoy vamos a hablar de 2 hooks en particular que nos permiten acceder al State de un componente y a su ciclo de vida.

- introduccion a state y lifecycle

  - Son conceptos que encontramos en la mayoria de los framework frontend modernos.
  - El state es un valor, suele ser un object pero tb puede se un primitivo, que se guarda en un componente y se mantiene a traves de sus re-renders.

  Es como las variables en los classComponents pero tiene 2 caracteristicas que lo hacen mejor de una simple variable.

  Las dos caracteristicas principales de un State son la polaridad del flujo de la informacion y su inmutabilitad.

  Para el primero: la forma de escribir el valor en el State es diferente a la forma de leer el valor guardado en el State.

  Para el segundo: no se puede cambiar el valor al que apunta el puntero, se tiene que cambiar el puntero.

  El state es una propriedad reactiva del componente. Esto significa que cuando cambia el compo rerenderiza.

  - El ciclo de vida de un componente tiene muchas fases.

  Las mas importantes son el Mount cuando el compo se monta en el dom,
  el Update cuando el compo tiene que rerenderizar por el cambio de una propriedad reactiva (pe el state)
  y el Unmount cuando se desmonta del DOM.

  En estas fases nos interesa lanzar una accion o una serie de acciones que se ejecuten en paralelo a nuestro flujo principal.

  Por eso el segundo hook que vamos a ver se llama UseEffect, porque esas acciones se suelen definir como side effects o efectos colaterales.

- caveat
  - Los hooks se pueden utilizar solo en componentes funcionales o en otros hooks, los custom hooks.
  - siempre el mismo orden y not conditionally, por ejemplo en un if.

## Use State

- El UseState nos permite acceder al State de un componente.
- Tenemos este componente.
- Le añadimos esto

```tsx
<button
    className={styles.counter__button}
>
    {'<'}
</button>
<div className={styles.counter__value}>0</div>
<button
    className={styles.counter__button}
>
    {'>'}
</button>

```

- Dos botones y un valor que por ahora no cambia.
- Creamos un State y lo inicializamos.

```tsx
const [count, setCount] = useState<number>(DEFAULT_COUNT);

<button
    className={styles.counter__button}
>
    {'<'}
</button>
<div className={styles.counter__value}>{count}</div>
<button
    className={styles.counter__button}
>
    {'>'}
</button>

```

- Como podeis ver `useState` es una funcion que devulve un array: un valor y su setter.

- Asi funciona pero no es la forma correcta porque si lo pongo asi

```tsx
const [count, setCount] = useState<number>(getDefaultCount());
```

- me doy cuenta que se reinicializa en cada click.
- con esta forma

```tsx
const [count, setCount] = useState<number>(
  // DEFAULT_COUNT
  // getDefaultCount()
  () => getDefaultCount()
);
```

- inizializa el State solo al principio (la fase de Mount)
- ahora vamos a dar funcionalidad a los botones

```tsx
const increment = () => {
   setCount(count + 1);
  };

const decrement = () => {
    setCount(count - 1);
  };


<button
    onClick={decrement}
    disabled={count <= 0}
    className={styles.counter__button}
>
    {'<'}
</button>
<div className={styles.counter__value}>{count}</div>
<button
    onClick={increment}
    className={styles.counter__button}
>
    {'>'}
</button>

```

- Esto funciona pero hay un problema...si duplico las lineas de setCount sigue incrementando y disminuyendo solo de uno. Esto porque `count` sigue siendo el antiguo puntero en el scope de esta funcion.
- Por esto en la funcion de set de State tenemos el `prev` value que podemos utilizar.

```tsx
const increment = () => {
  setCount((prev) => prev + 1);
};

const decrement = () => {
  setCount((prev) => prev - 1);
};
```

## Use Effect

- Como dicho nos permite acceder a los ciclos de vidas del componente.
- Tenemos este componente
- Como se puede observar tenemos una serie de botones que actualiza una parte del state `resourceType` cuando se clicka encima de ellos.
- Como podeis ver el componente no se inicializa de forma correcta. Todos los botones, al arranque, estan en gris.
  Yo quiero que al arranque se seleccione `post`

```tsx
useEffect(() => {
  updateStateKey('resourceType', 'posts');
}, []);
```

- Como se puede observar el `useEffect` accepta una callback y un array de dependencias.
  - Esta fase del ciclo de vida es el Mount.
  - Enseñar que pasa si no lo pongo. Esta fase del ciclo de vida seria el Render.
- Todavia no hay datos.
- Arriba tenemos definido un servicio que llama una api de mock.
- Implementamos una funcion que utiliza este servicio y popule la key `items` de nuestro State.

```tsx
const getData = async (resource: Resource) => {
  if (!resource) {
    return;
  }
  updateStateKey('status', Status.LOADING);
  try {
    const res = await fetchService(resource);
    updateStateKey('items', res ?? []);
    updateStateKey('status', Status.SUCCESS);
  } catch (e) {
    updateStateKey('status', Status.ERROR);
    console.log(e);
  }
};
```

- Creamos un effect para que utilice esta funcion.

```tsx
useEffect(() => {
  if (state.resourceType) {
    getData(state.resourceType);
  }
}, []);
```

- Quiero que se lanze solo cuando cambia el `referenceType` de nuestro State.
- Esta fase del ciclo de vida es el Update.

```tsx
useEffect(() => {
  if (state.resourceType) {
    getData(state.resourceType);
  }
}, [state.resourceType]);
```

- Dice que le falta una dependencia `getData`
- Si la pongo en el array de dependencias tenemos un error, porque esta funcion se recrea en cada render.
```tsx
useEffect(() => {
  if (state.resourceType) {
    getData(state.resourceType);
  }
}, [state.resourceType, getData]);
```
- Tenemos dos opciones:
  - definimos la funcion en el `useEffect` que la utiliza 
```tsx
useEffect(() => {
  const getData = async (resource: Resource) => {
    if (!resource) {
      return;
    }
    updateStateKey('status', Status.LOADING);
    try {
      const res = await fetchService(resource);
      updateStateKey('items', res ?? []);
      updateStateKey('status', Status.SUCCESS);
    } catch (e) {
      updateStateKey('status', Status.ERROR);
      console.log(e);
    }
  };
  if (state.resourceType) {
    getData(state.resourceType);
  }
}, [state.resourceType]);
```
-  - Utilizamos otro hook que memoiza la funcion y la mantiene entre los render.

```tsx
const getData = useCallback(async (resource: Resource) => {
  if (!resource) {
    return;
  }
  updateStateKey('status', Status.LOADING);
  try {
    const res = await fetchService(resource);
    updateStateKey('items', res ?? []);
    updateStateKey('status', Status.SUCCESS);
  } catch (e) {
    updateStateKey('status', Status.ERROR);
    console.log(e);
  }
}, []);
```

- Y por fin la ultima fase del ciclo de vida el Unmount

```tsx
useEffect(() => {
  updateStateKey('resourceType', 'posts');
  return () => {
    updateState();
  };
}, []);
```

- Tambien se puede utilizar para que ejecute una accion antes de cada cambio de las variables en el array de dependencias

```tsx
useEffect(() => {
  if (state.resourceType) {
    console.log('After Update', state.resourceType)
    getData(state.resourceType);
  }
  return () => {
    console.log('Before Update', state.resourceType)
  }
}, [state.resourceType, getData]);
```