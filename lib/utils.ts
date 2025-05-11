// app/lib/utils.ts 
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases utilizando `clsx` y las fusiona con `tailwind-merge`.
 * 
 * @param inputs - Lista de valores de clase que pueden ser cadenas, objetos o arreglos.
 * @returns Una cadena de clases fusionadas.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs));
}

export const formatCurrency = (amount: number | bigint | null) => {
  // Si es null o undefined, devolver un valor por defecto
  if (amount === null || amount === undefined) {
    return '$0.00';
  }
  
  // Convertir a number si es bigint
  const numericAmount = typeof amount === 'bigint' ? Number(amount) : amount;
  
  return (numericAmount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'es-CL',
) => {
  const date = new Date(dateStr);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: any[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
