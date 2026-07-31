import data from '@/data/price-history.json';

export type PriceHistoryEntry = {
  date: string; // YYYY-MM-DD
  wti: number;
  brent: number;
  wcs: number;
};

export const priceHistory = data as PriceHistoryEntry[];

export const firstCollectionDate: string | null = priceHistory[0]?.date ?? null;
