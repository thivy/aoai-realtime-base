import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resolveAfter = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));
