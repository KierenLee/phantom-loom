// StickySection.tsx —— 你的业务组件，多实例复用
import React from "react";
import { useStickyOffset } from "./use-sticky-offset";

interface StickySectionProps {
  title: string;
  children: React.ReactNode;
}

const StickySection: React.FC<StickySectionProps> = ({ title, children }) => {
  const { ref, topOffset } = useStickyOffset();

  return (
    <div>
      <div
        ref={ref}
        style={{
          position: "sticky",
          top: topOffset,
          zIndex: 100, // 可以再用 order 递减
          background: "#fff",
          borderBottom: "1px solid #e5e5e5",
          padding: "12px 16px",
        }}
      >
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: "16px" }}>{children}</div>
    </div>
  );
};

export default StickySection;
