// useStickyOffset.ts
import { useRef, useEffect, useId, useSyncExternalStore } from "react";
import { useStickyContext } from "./sticky-context";

export function useStickyOffset() {
  const id = useId(); // React 18 自动生成唯一 ID
  const ref = useRef<HTMLDivElement>(null);
  const {
    register,
    unregister,
    updateHeight,
    getTopOffset,
    subscribe,
    getSnapshot,
  } = useStickyContext();

  // 注册 & 注销
  useEffect(() => {
    register(id);
    return () => unregister(id);
  }, [id, register, unregister]);

  // ResizeObserver 自动监听高度变化
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const height =
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      updateHeight(id, height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [id, updateHeight]);

  // 订阅 store 变化，获取最新 offset
  const topOffset = useSyncExternalStore(subscribe, () => getTopOffset(id));

  return { ref, topOffset };
}
