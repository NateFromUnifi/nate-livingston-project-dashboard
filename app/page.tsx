import Link from 'next/link';

type Project = {
  href: string;
  title: string;
  status: 'In progress' | 'Coming Aug 2026' | 'Planned';
  blurb: string;
};

const projects: Project[] = [
  {
    href: '/oil-gas',
    title: 'Canadian Oil & Gas Primer',
    status: 'In progress',
    blurb:
      'A visual map of the Canadian energy landscape built for beginners — production basins, transport, refining, and live benchmark prices, all in one view.',
  },
  {
    href: '#',
    title: 'Tourmaline Oil DCF + Stock Pitch',
    status: 'Coming Aug 2026',
    blurb:
      'Discounted cash flow valuation of TOU.TO with a full equity research pitch deck and recommendation.',
  },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-16 md:py-24">
      <header className="mb-16">
        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Project Portfolio
        </p>
        <h1 className="mb-4 font-serif text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50">
          Nathaniel Livingston
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-neutral-600 dark:text-neutral-300">
          Finance student with passions for Financial Markets, Energy, Equity Research, and Investing.
        </p>
      </header>

      <section>
        <h2 className="mb-6 text-xs uppercase tracking-[0.2em] text-neutral-500">Projects</h2>
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
          {projects.map((p) => {
            const isLive = p.href !== '#';
            const inner = (
              <div className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-50">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-neutral-600 dark:text-neutral-400">{p.blurb}</p>
                </div>
                <span
                  className={`shrink-0 text-xs uppercase tracking-wider ${
                    isLive
                      ? 'text-amber-700 dark:text-amber-500'
                      : 'text-neutral-400 dark:text-neutral-500'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            );
            return (
              <li key={p.title}>
                {isLive ? (
                  <Link
                    href={p.href}
                    className="block px-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
                  >
                    {inner}
                  </Link>
                ) : (
                  <div className="block px-2 opacity-60">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <footer className="mt-24 text-sm text-neutral-500">
        <p>Calgary, AB · Built with Next.js and d3-geo</p>
      </footer>
    </div>
  );
}
