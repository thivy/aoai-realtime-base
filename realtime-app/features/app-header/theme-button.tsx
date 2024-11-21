"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeButton = () => {
  const { setTheme } = useTheme();
  return (
    <Button
      variant={"outline"}
      onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
    >
      <Sun />
      <Moon />
    </Button>
  );
};
