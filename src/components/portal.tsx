import React, { useRef, useLayoutEffect, type ReactNode } from "react";
import ReactDOM from "react-dom";

interface PortalProps {
  children: ReactNode;
}

export const Portal: React.FC<PortalProps> = (props) => {
  const el = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      el.current = document.createElement("div");
      const currentEl = el.current;
      const portal = document.getElementById("portal");
      portal?.appendChild(currentEl);

      return () => {
        portal?.removeChild(currentEl);
      };
    }
  }, []);

  return el.current ? ReactDOM.createPortal(props.children, el.current) : null;
};

export const PortalDiv = () => <div id="portal"></div>;
