import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSessionId = () => {
  if (typeof window === "undefined") {
    return "";
  }
  let id = sessionStorage.getItem("thread_id");
  if (!id) {
    id = Math.random().toString(36).substring(7);
    sessionStorage.setItem("thread_id", id);
  }
  return id;
};
