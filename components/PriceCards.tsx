'use client';

import { useState } from 'react';
import { prices, type PriceEntry } from '@/lib/prices';
import { firstCollectionDate } from '@/lib/price-history';
import PriceChart from './PriceChart';

type Symbol = 'WTI' | 'Brent' | 'WCS';

const ACCENTS: Record<Symbol, string> = {
  WTI: '#d97706',
  Brent: '#be123c',
  WCS: '#7c3aed',
};

const DESCRIPTIONS: Record<string, string> = {
  WTI:
    "Light, sweet crude — the North American benchmark. Quoted at the Cushing, Oklahoma pipeline hub and settled on NYMEX. The headline 'oil price' you see in most US financial coverage.",
  Brent:
    'Light, sweet crude from the North Sea — the pricing benchmark for roughly two-thirds of global oil supply. Settled on ICE in London; especially relevant for European, African, and Asian buyers.',
  WCS:
    'Heavy, sour blend of Alberta oil sands bitumen and diluent, quoted at Hardisty, AB. Trades at a wide discount to WTI — the WCS–WTI differential reflects pipeline-egress capacity, the cost of upgrading heavy oil, and competition for refining capacity that can handle it.',
};

const formatPrice = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatChange = (n: number) =>
  `${n >= 0 ? '+' : ''}${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatPct = (n: number) =>
  `${n >= 0 ? '+' : ''}${n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

const formatCaptionDate = (iso: string | null) => {
  if (!iso) return 'today';
  const [y, m, d] = iso.split('-').map(Number);
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1];
  return `${month} ${d}, ${y}`;
};

export default function PriceCards() {
  const items: PriceEntry[] = [prices.wti, prices.brent, prices.wcs];
  const [expanded, setExpanded] = useState<Set<Symbol>>(new Set());

  const toggle = (sym: Symbol) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(sym)) next.delete(sym);
      else next.add(sym);
      return next;
    });
  };

  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-xl text-neutral-900 dark:text-neutral-50">
          Crude oil benchmarks
        </h2>
        <p className="text-xs uppercase tracking-wider text-neutral-400">
          Source: {prices.source} · {formatTimestamp(prices.fetchedAt)}
        </p>
      </div>
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
        Select a benchmark to read what it tracks. All three are plotted on the price history chart below.
      </p>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <PriceCard
            key={p.symbol}
            entry={p}
            description={DESCRIPTIONS[p.symbol]}
            isExpanded={expanded.has(p.symbol as Symbol)}
            onToggle={() => toggle(p.symbol as Symbol)}
          />
        ))}
      </div>

      <PriceChart />
      {firstCollectionDate && (
        <p className="mt-3 text-xs italic text-neutral-500 dark:text-neutral-400">
          Price history since {formatCaptionDate(firstCollectionDate)}, updated daily.
        </p>
      )}
    </section>
  );
}

function PriceCard({
  entry,
  description,
  isExpanded,
  onToggle,
}: {
  entry: PriceEntry;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const accent = ACCENTS[entry.symbol as Symbol] ?? '#525252';
  const positive = entry.changeUsd > 0;
  const negative = entry.changeUsd < 0;
  const flat = !positive && !negative;
  const changeColor = flat
    ? 'text-neutral-400 dark:text-neutral-500'
    : positive
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';
  const arrow = flat ? '·' : positive ? '▲' : '▼';

  const baseClasses =
    'block w-full rounded-lg border bg-white p-5 shadow-sm text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-950';
  const stateClasses = isExpanded
    ? 'border-transparent ring-2 dark:bg-neutral-900'
    : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700';

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isExpanded}
      aria-label={`${isExpanded ? 'Hide' : 'Show'} what ${entry.symbol} tracks`}
      className={`${baseClasses} ${stateClasses}`}
      style={
        isExpanded
          ? ({ ['--tw-ring-color' as string]: accent } as React.CSSProperties)
          : undefined
      }
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
        <p className="text-xs uppercase tracking-widest text-neutral-500">{entry.symbol}</p>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="font-serif text-3xl font-medium tabular-nums text-neutral-900 dark:text-neutral-50">
          ${formatPrice(entry.priceUsd)}
        </p>
        <p className={`text-sm tabular-nums ${changeColor}`}>
          <span className="mr-0.5">{arrow}</span>
          {formatChange(entry.changeUsd)} ({formatPct(entry.changePct)})
        </p>
      </div>
      <p className="mt-1 text-sm text-neutral-500">{entry.name}</p>
      {typeof entry.differentialToWti === 'number' && (
        <p className="mt-2 text-xs text-neutral-400">
          Differential to WTI:{' '}
          <span className="tabular-nums">{formatChange(entry.differentialToWti)}</span>
        </p>
      )}

      <div className="mt-3 flex items-center gap-1.5 border-t border-neutral-100 pt-3 dark:border-neutral-800/80">
        <svg
          viewBox="0 0 16 16"
          className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        <span className="text-xs uppercase tracking-wider text-neutral-500">What it tracks</span>
      </div>
      {isExpanded && (
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
    </button>
  );
}
