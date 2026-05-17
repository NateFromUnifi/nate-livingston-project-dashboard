type Player = { name: string; integrated?: boolean };

type Segment = {
  key: 'upstream' | 'midstream' | 'downstream';
  label: string;
  tagline: string;
  accent: string;
  definition: string;
  activities: string[];
  players: Player[];
  facts: string[];
};

const SEGMENTS: Segment[] = [
  {
    key: 'upstream',
    label: 'Upstream',
    tagline: 'Exploration & production',
    accent: '#059669',
    definition:
      'The wellhead end of the business — finding hydrocarbons and getting them out of the ground. Upstream operators take geological and price risk in exchange for the highest-margin barrel when prices cooperate. In Canada this means conventional wells in the WCSB, oil sands mining and in-situ projects in northern Alberta, and natural gas drilling in the Montney and Duvernay.',
    activities: [
      'Geological surveying and exploration drilling',
      'Oil sands mining (surface) and in-situ (SAGD / CSS) bitumen recovery',
      'Conventional and tight-oil well drilling and completion',
      'Natural gas production and field gathering',
      'Field-level processing (water separation, sweetening)',
    ],
    players: [
      { name: 'Canadian Natural Resources', integrated: true },
      { name: 'Suncor', integrated: true },
      { name: 'Cenovus', integrated: true },
      { name: 'Imperial Oil', integrated: true },
      { name: 'Shell Canada', integrated: true },
      { name: 'ARC Resources' },
      { name: 'Tourmaline Oil' },
      { name: 'Ovintiv' },
      { name: 'MEG Energy' },
      { name: 'Whitecap Resources' },
    ],
    facts: [
      'Canada produces ~4.9 MMbbl/d of crude oil (CER, 2024)',
      'Oil sands account for ~64% of total Canadian crude output (CAPP)',
    ],
  },
  {
    key: 'midstream',
    label: 'Midstream',
    tagline: 'Transport, storage & processing',
    accent: '#0284c7',
    definition:
      'The connective tissue between wellhead and refinery. Midstream companies own the pipelines, storage terminals, rail loading facilities, and gas processing plants that move raw production to market. Revenue is largely fee-based and tied to throughput contracts, which makes midstream cash flows steadier than upstream but exposed to egress constraints and regulatory delay.',
    activities: [
      'Crude oil and refined product pipeline transport',
      'Natural gas gathering, processing, and long-haul transmission',
      'NGL fractionation and storage',
      'Crude-by-rail loading and unit-train logistics',
      'Tank-farm storage at hubs (Hardisty, Edmonton, Burnaby)',
    ],
    players: [
      { name: 'Enbridge' },
      { name: 'TC Energy' },
      { name: 'South Bow' },
      { name: 'Trans Mountain Corp' },
      { name: 'Pembina Pipeline' },
      { name: 'Keyera' },
      { name: 'Gibson Energy' },
      { name: 'Inter Pipeline (Brookfield)' },
      { name: 'Suncor', integrated: true },
      { name: 'Cenovus', integrated: true },
    ],
    facts: [
      'Enbridge Mainline ships ~3.0 MMbbl/d — about 70% of Canadian crude exports (Enbridge IR)',
      'TMX expansion added 590 Mbbl/d of Pacific egress capacity in May 2024 (CER)',
    ],
  },
  {
    key: 'downstream',
    label: 'Downstream',
    tagline: 'Refining & marketing',
    accent: '#475569',
    definition:
      'Where barrels become products people actually buy — gasoline, diesel, jet fuel, asphalt, and petrochemical feedstocks. Downstream margins (the "crack spread") depend on the gap between crude input cost and refined product prices, plus how well a refinery is configured for the crude it runs. Canada has 17 operating refineries with roughly 2.0 MMbbl/d of total capacity.',
    activities: [
      'Crude refining (distillation, cracking, hydrotreating)',
      'Petrochemical and lubricants manufacturing',
      'Wholesale fuel distribution to retailers and commercial users',
      'Retail gas station and convenience networks',
      'Aviation, marine, and commercial fuel supply',
    ],
    players: [
      { name: 'Imperial Oil', integrated: true },
      { name: 'Suncor', integrated: true },
      { name: 'Shell Canada', integrated: true },
      { name: 'Cenovus', integrated: true },
      { name: 'Irving Oil' },
      { name: 'Parkland' },
      { name: 'Federated Co-operatives' },
      { name: 'North Atlantic Refining (Braya)' },
    ],
    facts: [
      'Canadian refining capacity ~2.0 MMbbl/d across 17 refineries (CER)',
      "Irving's Saint John refinery is the largest at ~320 Mbbl/d (Irving Oil)",
    ],
  },
];

export default function IndustrySegments() {
  return (
    <section className="mt-12">
      <div className="mb-4">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
          Industry structure
        </p>
        <h2 className="font-serif text-xl text-neutral-900 dark:text-neutral-50">
          Upstream, midstream, downstream
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          The Canadian oil &amp; gas value chain splits into three segments. A handful of large
          integrated producers operate across all three; most companies focus on one.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SEGMENTS.map((segment) => (
          <SegmentCard key={segment.key} segment={segment} />
        ))}
      </div>
    </section>
  );
}

function SegmentCard({ segment }: { segment: Segment }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: segment.accent }}
          aria-hidden
        />
        <p className="text-xs uppercase tracking-widest text-neutral-500">
          {segment.label}
        </p>
      </div>
      <p className="mt-2 font-serif text-2xl font-medium text-neutral-900 dark:text-neutral-50">
        {segment.tagline}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {segment.definition}
      </p>

      <Field label="Key activities">
        <ul className="space-y-1.5">
          {segment.activities.map((activity) => (
            <li key={activity} className="flex gap-2">
              <span
                className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: segment.accent }}
                aria-hidden
              />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </Field>

      <Field label="Major Canadian players">
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
          {segment.players.map((player) => (
            <li key={player.name} className="inline-flex items-center gap-1.5">
              <span>{player.name}</span>
              {player.integrated && (
                <span className="rounded-sm bg-neutral-100 px-1 py-0.5 text-[10px] uppercase tracking-wider text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                  Integrated
                </span>
              )}
            </li>
          ))}
        </ul>
      </Field>

      <Field label="By the numbers">
        <ul className="space-y-1 tabular-nums">
          {segment.facts.map((fact) => (
            <li key={fact} className="flex gap-2">
              <span
                className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full"
                style={{ backgroundColor: segment.accent }}
                aria-hidden
              />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <div className="mt-1.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}
