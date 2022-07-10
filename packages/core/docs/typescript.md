# Typescript

WARNING - out of date

The libary can be consumed from typescript applications via yarn / npm install as with any other package.

If you are not using redux in your application simply call `setupThebeCore()` to setup the library, `thebe-core`
will create it's own store.

If your application uses redux, integrate `thebe` into you applications store by adding it' reducer and passing yoru store to the
setup function.

```
  import { setupThebeCore, thebeReducer } from "thebe-core";
  import reducer from './app/store';

  const store = createStore(combineReducers({
      app: reducer,
      thebe: thebeReducer
    }));

  setupThebeCore(store)
```
