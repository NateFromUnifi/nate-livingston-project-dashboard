'use client';

import { priceHistory } from '@/lib/price-history';

type Symbol = 'WTI' | 'Brent' | 'WCS';

const SERIES_KEY = { WTI: 'wti', Brent: 'brent', WCS: 'wcs' } as const;

const ACCENTS: Record<Symbol, string> = {
  WTI: '#d97706',
  Brent: '#be123c',
  WCS: '#7c3aed',
};

const SYMBOL_ORDER: Symbol[] = ['WTI', 'Brent', 'WCS'];

const WIDTH = 800;
const HEIGHT = 300;
const PADDING = { top: 20, right: 24, bottom: 32, left: 56 };
const plotW = WIDTH - PADDING.left - PADDING.right;
const plotH = HEIGHT - PADDING.top - PADDING.bottom;

function formatTickDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1];
  return `${month} ${d}`;
}

export default function PriceChart() {
  if (priceHistory.length === 0) {
    return (
      <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
        <p className="text-sm text-neutral-500">Collecting price history… check back tomorrow.</p>
      </section>
    );
  }

  // Always chart all three benchmarks.
  const selectedList = SYMBOL_ORDER;

  const x = (i: number) =>
    PADDING.left + (priceHistory.length === 1 ? plotW / 2 : (i / (priceHistory.length - 1)) * plotW);

  const visibleValues = priceHistory.flatMap((row) =>
    selectedList.map((s) => row[SERIES_KEY[s]]),
  );
  const rawMin = Math.min(...visibleValues);
  const rawMax = Math.max(...visibleValues);
  const span = rawMax - rawMin;
  const yPad = span === 0 ? 1 : span * 0.08;
  const yMin = rawMin - yPad;
  const yMax = rawMax + yPad;

  const y = (v: number) => PADDING.top + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks }, (_, i) => yMin + ((yMax - yMin) * i) / (yTicks - 1));

  const xTickIndexes =
    priceHistory.length <= 3
      ? priceHistory.map((_, i) => i)
      : [0, Math.floor((priceHistory.length - 1) / 2), priceHistory.length - 1];

  const pathFor = (sym: Symbol) => {
    const key = SERIES_KEY[sym];
    return priceHistory
      .map((row, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(row[key]).toFixed(2)}`)
      .join(' ');
  };

  return (
    <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h3 className="font-serif text-base text-neutral-900 dark:text-neutral-50">Price history</h3>
        <p className="text-xs uppercase tracking-wider text-neutral-400">
          {selectedList.length} benchmarks · {priceHistory.length} day
          {priceHistory.length === 1 ? '' : 's'}
        </p>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Price history for ${selectedList.join(', ')}`}
      >
        {/* axis lines */}
        <line
          x1={PADDING.left}
          y1={PADDING.top}
          x2={PADDING.left}
          y2={PADDING.top + plotH}
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth={1}
        />
        <line
          x1={PADDING.left}
          y1={PADDING.top + plotH}
          x2={PADDING.left + plotW}
          y2={PADDING.top + plotH}
          className="stroke-neutral-300 dark:stroke-neutral-700"
          strokeWidth={1}
        />

        {/* y-axis tick labels */}
        {yTickValues.map((v, i) => (
          <g key={`yt-${i}`}>
            <line
              x1={PADDING.left - 4}
              y1={y(v)}
              x2={PADDING.left}
              y2={y(v)}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={1}
            />
            <text
              x={PADDING.left - 8}
              y={y(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-neutral-500 dark:fill-neutral-400"
              fontSize={11}
            >
              ${v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* x-axis tick labels */}
        {xTickIndexes.map((i) => (
          <g key={`xt-${i}`}>
            <line
              x1={x(i)}
              y1={PADDING.top + plotH}
              x2={x(i)}
              y2={PADDING.top + plotH + 4}
              className="stroke-neutral-300 dark:stroke-neutral-700"
              strokeWidth={1}
            />
            <text
              x={x(i)}
              y={PADDING.top + plotH + 18}
              textAnchor="middle"
              className="fill-neutral-500 dark:fill-neutral-400"
              fontSize={11}
            >
              {formatTickDate(priceHistory[i].date)}
            </text>
          </g>
        ))}

        {/* series lines */}
        {selectedList.map((sym) => (
          <path
            key={`line-${sym}`}
            d={pathFor(sym)}
            stroke={ACCENTS[sym]}
            strokeWidth={2}
            fill="none"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {/* series dots with native browser tooltips */}
        {selectedList.map((sym) =>
          priceHistory.map((row, i) => {
            const v = row[SERIES_KEY[sym]];
            return (
              <circle
                key={`dot-${sym}-${i}`}
                cx={x(i)}
                cy={y(v)}
                r={3}
                fill={ACCENTS[sym]}
                stroke="white"
                strokeWidth={1}
              >
                <title>
                  {sym} ${v.toFixed(2)} on {row.date}
                </title>
              </circle>
            );
          }),
        )}
      </svg>

      {/* legend */}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {selectedList.map((sym) => (
          <div key={`legend-${sym}`} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ACCENTS[sym] }}
              aria-hidden
            />
            <span className="text-xs text-neutral-600 dark:text-neutral-400">{sym}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
