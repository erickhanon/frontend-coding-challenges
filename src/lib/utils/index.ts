import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isValid, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date?: string) => {
  if (!date) return null;

  const parsedDate = parse(date, "dd-MM-yyyy", new Date());

  // Bug fix: Keep invalid API dates from breaking the details page.
  return isValid(parsedDate) ? format(parsedDate, "MMMM d, yyyy") : null;
};
