import { prices, type PriceEntry } from '@/lib/prices';

const ACCENTS: Record<string, string> = {
  WTI: '#d97706',
  Brent: '#be123c',
  WCS: '#7c3aed',
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

export default function PriceCards() {
  const items: PriceEntry[] = [prices.wti, prices.brent, prices.wcs];

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <PriceCard key={p.symbol} entry={p} />
        ))}
      </div>
    </section>
  );
}

function PriceCard({ entry }: { entry: PriceEntry }) {
  const accent = ACCENTS[entry.symbol] ?? '#525252';
  const positive = entry.changeUsd > 0;
  const negative = entry.changeUsd < 0;
  const flat = !positive && !negative;
  const changeColor = flat
    ? 'text-neutral-400 dark:text-neutral-500'
    : positive
    ? 'text-emerald-600 dark:text-emerald-400'
    : 'text-rose-600 dark:text-rose-400';
  const arrow = flat ? '·' : positive ? '▲' : '▼';

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
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
    </div>
  );
}
