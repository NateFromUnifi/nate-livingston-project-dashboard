import Link from 'next/link';
import OilGasMapView from '@/components/OilGasMapView';

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
          Visual Primer
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
        <h2 className="mb-5 font-serif text-2xl text-neutral-900 dark:text-neutral-50">
          Map of Canada
        </h2>
        <OilGasMapView />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 font-serif text-xl text-neutral-900 dark:text-neutral-50">
          Coming next
        </h2>
        <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Natural gas pipelines</strong>{' '}
            — NGTL system, Coastal GasLink, TC Mainline.
          </li>
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Production basins</strong> —
            WCSB, Montney, Duvernay, and the Oil Sands regions.
          </li>
          <li>
            <strong className="text-neutral-900 dark:text-neutral-100">Proposed and cancelled projects</strong>{' '}
            — Keystone XL, greenfield LNG, hydrogen, and CCUS sites.
          </li>
        </ul>
      </section>
    </div>
  );
}
