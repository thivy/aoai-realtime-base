"use client";

import { Button, ButtonProps, MotionButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

export const AppBar = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <motion.div className="bg-swqelate-900 p-2 rounded-full flex ">
      <Button size={"lg"} onClick={() => setIsSelected((prev) => !prev)}>
        Toggle
      </Button>

      <AnimatePresence>
        {isSelected && (
          <MotionButton
            layout // Enable smooth layout animations
            initial={{ opacity: 0, padding: "10px" }} // Initial padding and opacity
            animate={{ opacity: 1, padding: "20px" }} // Animate to larger padding
            exit={{ opacity: 0, padding: "10px", width: 0 }} // Exit to original padding
            transition={{ duration: 0.5 }}
            size={"lg"}
            className="rounded-full overflow-hidden whitespace-nowrap"
          >
            <motion.span>Content</motion.span>
          </MotionButton>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Sphere = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <motion.div
      animate={{
        borderRadius: isSelected ? "200px" : "20px",
        height: isSelected ? "200px" : "65px",
        width: isSelected ? "200px" : "65px",
      }}
      className="bg-white aspect-square cursor-pointer p-2 rounded-md flex items-center justify-center"
      onClick={() => setIsSelected((prev) => !prev)}
    >
      {isSelected ? "Connect" : "Connect2"}
    </motion.div>
  );
};

export const Stage = () => {
  return (
    <div className=" rounded-full overflow-hidden p-[1px] bg-gradient-to-t from-zinc-600 to-zinc-700 my-2">
      <div className="rounded-full shadow-inner bg-zinc-800 p-2">
        <ButtonW className="bg-zinc-700">Connect</ButtonW>
      </div>
      {/* <AppBar /> */}
    </div>
  );
};

export const ButtonW = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <span
        className={cn(
          "bg-gradient-to-t from-zinc-800 to-zinc-500 p-[1px] rounded-full inline-block shadow-md"
        )}
      >
        <Button
          {...props}
          ref={ref}
          className="bg-zinc-700 hover:bg-zinc-600"
        />
      </span>
    );
  }
);

ButtonW.displayName = "ButtonW";
