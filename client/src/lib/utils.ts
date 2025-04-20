import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// HEADER=> Get Page Lable
export const getPageLabel = (pathname: string) => {
  if (pathname.includes('/project/')) return 'Project';
  if (pathname.includes('/settings')) return 'Settings';
  if (pathname.includes('/tasks')) return 'Tasks';
  if (pathname.includes('/members')) return 'Members';
};
