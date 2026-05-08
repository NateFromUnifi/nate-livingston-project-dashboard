import data from '@/data/prices.json';

export type PriceEntry = {
  symbol: string;
  name: string;
  priceUsd: number;
  priceUsdPrev: number;
  changeUsd: number;
  changePct: number;
  currency: string;
  differentialToWti?: number;
};

export type PricesFile = {
  fetchedAt: string;
  source: string;
  wti: PriceEntry;
  brent: PriceEntry;
  wcs: PriceEntry;
};

export const prices = data as PricesFile;
