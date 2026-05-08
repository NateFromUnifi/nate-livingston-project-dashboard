// Fetches latest WTI, Brent, and WCS prices from oilprice.com and writes
// them to web/data/prices.json. Run by .github/workflows/update-prices.yml
// on a daily cron — also runnable locally via `node scripts/fetch-prices.mjs`.
//
// Strategy: scrape oilprice.com's public oil-price-charts page (no API key
// required). On any failure, preserve the existing prices.json so the
// dashboard never breaks — worst case is stale-by-one-day prices.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

const OUT = 'data/prices.json';
const URL = 'https://oilprice.com/oil-price-charts';
const UA =
  'Mozilla/5.0 (compatible; NateLivingstonPortfolio/1.0; +https://nate-livingston-project-dashboard.vercel.app)';

async function fetchHtml() {
  const res = await fetch(URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${URL}`);
  return res.text();
}

// Find a commodity name in the HTML and grab the first crude-oil-shaped
// dollar amount in the next ~1500 chars. Resilient to most HTML changes.
function extractPrice(html, name) {
  const idx = html.indexOf(name);
  if (idx === -1) return null;
  const slice = html.slice(idx, idx + 1500);
  // Two- or three-digit price with two decimals (e.g., 63.50 or 102.43).
  const match = slice.match(/(\d{2,3}\.\d{2})/);
  return match ? parseFloat(match[1]) : null;
}

function loadExisting() {
  if (!existsSync(OUT)) return null;
  try {
    return JSON.parse(readFileSync(OUT, 'utf8'));
  } catch {
    return null;
  }
}

function buildEntry(symbol, name, current, prev, extras = {}) {
  const previous = typeof prev === 'number' ? prev : current;
  const changeUsd = current - previous;
  const changePct = previous !== 0 ? (changeUsd / previous) * 100 : 0;
  return {
    symbol,
    name,
    priceUsd: roundTo(current, 2),
    priceUsdPrev: roundTo(previous, 2),
    changeUsd: roundTo(changeUsd, 2),
    changePct: roundTo(changePct, 2),
    currency: 'USD',
    ...extras,
  };
}

function roundTo(n, decimals) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

async function main() {
  const existing = loadExisting();

  let html;
  try {
    html = await fetchHtml();
  } catch (e) {
    console.error('fetch failed:', e.message);
    console.error('preserving existing prices.json — no commit will happen');
    return;
  }

  const wtiNew = extractPrice(html, 'WTI Crude');
  const brentNew = extractPrice(html, 'Brent Crude');
  const wcsNew = extractPrice(html, 'Western Canadian Select');

  // Sanity-check parsed values — anything outside $10–$300 is almost
  // certainly a parsing failure, not a real crude price.
  const sane = (n) => n != null && n >= 10 && n <= 300;

  if (!sane(wtiNew) || !sane(brentNew)) {
    console.error('parse failed for WTI / Brent — values:', { wtiNew, brentNew });
    console.error('preserving existing prices.json');
    return;
  }

  const wti = buildEntry(
    'WTI',
    'West Texas Intermediate',
    wtiNew,
    existing?.wti?.priceUsd,
  );
  const brent = buildEntry(
    'Brent',
    'Brent Crude',
    brentNew,
    existing?.brent?.priceUsd,
  );

  let wcs;
  if (sane(wcsNew)) {
    wcs = buildEntry('WCS', 'Western Canadian Select', wcsNew, existing?.wcs?.priceUsd, {
      differentialToWti: roundTo(wcsNew - wtiNew, 2),
    });
  } else if (existing?.wcs) {
    // Keep the previous WCS rather than dropping the field.
    console.warn('WCS scrape failed — preserving previous WCS values');
    wcs = existing.wcs;
  } else {
    console.error('no WCS source and no existing — aborting to avoid breaking the file');
    return;
  }

  const out = {
    fetchedAt: new Date().toISOString(),
    source: 'oilprice.com',
    wti,
    brent,
    wcs,
  };

  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log('wrote', OUT);
  console.log('  WTI  ', wti.priceUsd, ' (', wti.changeUsd >= 0 ? '+' : '', wti.changeUsd, ')');
  console.log('  Brent', brent.priceUsd, ' (', brent.changeUsd >= 0 ? '+' : '', brent.changeUsd, ')');
  console.log('  WCS  ', wcs.priceUsd, ' (diff to WTI:', wcs.differentialToWti, ')');
}

main().catch((e) => {
  console.error('unhandled:', e);
  process.exit(1);
});
