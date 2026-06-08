import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date | null) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('fr-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
};

export function formatMontant(montant: number, decimales = 2): string {
  return new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(montant) + ' $'
}

export function formatMontantCourt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)} M$`
  if (n >= 1000) return `${Math.round(n / 1000)} k$`
  return formatMontant(n, 0)
}
