import {
  createStore,
  type StoreApi,
  type StateCreator,
  type Mutate,
  useStore,
} from "zustand";
import { immer } from "zustand/middleware/immer";
import type { ReactNode } from "react";
import { createContext, useContext, useRef } from "react";

type ImmerStore<S> = Mutate<StoreApi<S>, [["zustand/immer", never]]>;

export function createScopedImmerStore<S>(
  initializer: StateCreator<S, [["zustand/immer", never]], []>,
) {
  const StoreContext = createContext<ImmerStore<S> | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const storeRef = useRef<ImmerStore<S> | null>(null);

    if (!storeRef.current) {
      storeRef.current = createStore(immer(initializer));
    }

    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    );
  }

  function useScopedStore<U>(selector: (state: S) => U): U {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("useScopedStore called outside its matching Provider");
    }

    return useStore(store, selector);
  }

  return { Provider, useScopedStore };
}
