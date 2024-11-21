import { useInView } from "framer-motion";
import { useRef } from "react";

export const ScrollIntoView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  if (ref.current && isInView) {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }

  return <div ref={ref} className="h-2 "></div>;
};
