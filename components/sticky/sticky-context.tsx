// StickyContext.tsx
import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";

interface StickyEntry {
  id: string;
  height: number;
  order: number; // 注册顺序，用于排序
}

interface StickyStore {
  entries: Map<string, StickyEntry>;
  listeners: Set<() => void>;
  counter: number;
}

interface StickyContextValue {
  register: (id: string) => number; // 返回 order
  unregister: (id: string) => void;
  updateHeight: (id: string, height: number) => void;
  getTopOffset: (id: string) => number;
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Map<string, StickyEntry>;
}

const StickyContext = createContext<StickyContextValue | null>(null);

export const StickyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const storeRef = useRef<StickyStore>({
    entries: new Map(),
    listeners: new Set(),
    counter: 0,
  });

  // 通知所有订阅者
  const emit = useCallback(() => {
    storeRef.current.listeners.forEach((l) => l());
  }, []);

  const register = useCallback(
    (id: string) => {
      const store = storeRef.current;
      if (!store.entries.has(id)) {
        const order = store.counter++;
        store.entries.set(id, { id, height: 0, order });
        emit();
        return order;
      }
      return store.entries.get(id)!.order;
    },
    [emit],
  );

  const unregister = useCallback(
    (id: string) => {
      storeRef.current.entries.delete(id);
      emit();
    },
    [emit],
  );

  const updateHeight = useCallback(
    (id: string, height: number) => {
      const entry = storeRef.current.entries.get(id);
      if (entry && entry.height !== height) {
        entry.height = height;
        emit();
      }
    },
    [emit],
  );

  const getTopOffset = useCallback((id: string) => {
    const entries = Array.from(storeRef.current.entries.values()).sort(
      (a, b) => a.order - b.order,
    );

    let offset = 0;
    for (const entry of entries) {
      if (entry.id === id) break;
      offset += entry.height;
    }
    return offset;
  }, []);

  const subscribe = useCallback((listener: () => void) => {
    storeRef.current.listeners.add(listener);
    return () => storeRef.current.listeners.delete(listener);
  }, []);

  const getSnapshot = useCallback(() => {
    return storeRef.current.entries;
  }, []);

  return (
    <StickyContext.Provider
      value={{
        register,
        unregister,
        updateHeight,
        getTopOffset,
        subscribe,
        getSnapshot,
      }}
    >
      {children}
    </StickyContext.Provider>
  );
};

export const useStickyContext = () => {
  const ctx = useContext(StickyContext);
  if (!ctx)
    throw new Error("useStickyContext must be used within <StickyProvider>");
  return ctx;
};
