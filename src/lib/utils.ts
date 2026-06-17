import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date NUMÉRIQUE normalisée : 'yyyy-MM-dd' (norme OQLF, traits d'union). SOURCE
// UNIQUE pour tout affichage de date numérique. Les dates du domaine sont des
// dates calendaires stockées à minuit UTC ; on lit donc les composantes en UTC
// (ou on prend le préfixe d'une chaîne ISO) pour éviter tout décalage de fuseau
// — ainsi une date saisie est réaffichée à l'identique.
// NE PAS utiliser pour les formats HUMAINS intentionnels (agenda hebdo, PDF).
const pad2 = (n: number) => (n < 10 ? '0' + n : '' + n);

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '—';
  if (typeof date === 'string') {
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  }
  const d = new Date(date);
  if (isNaN(d.getTime())) return '—';
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`;
};

// Parse une chaîne 'yyyy-MM-dd' (ou ISO) en Date (minuit UTC, cohérent avec le
// stockage). Renvoie null si invalide.
export const parseDateISO = (s: string | null | undefined): Date | null => {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (m) return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
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
