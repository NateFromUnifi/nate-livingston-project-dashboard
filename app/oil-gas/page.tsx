import Link from 'next/link';
import CanadaMap from '@/components/CanadaMap';

export const metadata = {
  title: 'Canadian Oil & Gas Primer — Nate Livingston',
  description:
    'A visual explainer of the Canadian energy landscape: pipelines, production basins, and proposed projects.',
};

export default function OilGasPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <Link
        href="/"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
      >
        ← Back to projects
      </Link>

      <header className="my-10">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Visual Primer · Phase 1
        </p>
        <h1 className="mb-4 font-serif text-4xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">
          The Canadian Oil &amp; Gas Industry
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          A visual explainer for beginners. The pipelines, production basins, and proposed projects
          that move Canadian crude and natural gas to market.
        </p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-10">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl text-neutral-900 dark:text-neutral-50">
            Map of Canada
          </h2>
          <span className="text-xs uppercase tracking-wider text-neutral-400">
            Hover a region
          </span>
        </div>
        <div className="text-neutral-700 dark:text-neutral-300">
          <CanadaMap />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-serif text-xl text-neutral-900 dark:text-neutral-50">
          Coming next
        </h2>
        <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Pipelines layer</strong> —
            major crude and natural gas systems (TMX, Enbridge Mainline, NGTL, Coastal GasLink,
            Keystone XL).
          </li>
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Basins layer</strong> —
            production geology (WCSB, Montney, Duvernay, Oil Sands regions).
          </li>
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Proposed projects</strong> —
            greenfield LNG, hydrogen, and CCUS sites under development.
          </li>
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Click-through info</strong>{' '}
            — capacity, operator, status, and a beginner-friendly explainer per element.
          </li>
        </ul>
      </section>
    </div>
  );
}
