// One-time script: walks git log for data/prices.json commits and seeds
// data/price-history.json with one row per commit date.
//
// Going forward, fetch-prices.mjs maintains the file incrementally — this
// script only needs to run once to backfill the historical data already
// living in git.
//
// Usage:
//   node scripts/backfill-price-history.mjs           # writes data/price-history.json
//   node scripts/backfill-price-history.mjs --dry-run # prints what would be written

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const OUT = 'data/price-history.json';
const DRY_RUN = process.argv.includes('--dry-run');

function sh(cmd) {
  return execSync(cmd, { encoding: 'utf8' }).trim();
}

function listCommits() {
  // --reverse so oldest first; -M -C to follow renames; --diff-filter=AM
  // catches both the initial Add and every Modify of prices.json.
  const out = sh('git log --reverse --format=%H --diff-filter=AM -- data/prices.json');
  return out.split('\n').filter(Boolean);
}

function commitDate(hash) {
  // ISO 8601 UTC; slice to YYYY-MM-DD.
  const iso = sh(`git log -1 --format=%cI ${hash}`);
  return new Date(iso).toISOString().slice(0, 10);
}

function priceAt(hash) {
  try {
    const json = sh(`git show ${hash}:data/prices.json`);
    return JSON.parse(json);
  } catch (e) {
    console.error(`! skipping ${hash}: ${e.message}`);
    return null;
  }
}

function main() {
  const commits = listCommits();
  console.log(`Found ${commits.length} commits touching data/prices.json`);

  const byDate = new Map();
  for (const hash of commits) {
    const data = priceAt(hash);
    if (!data?.wti || !data?.brent || !data?.wcs) continue;
    const date = commitDate(hash);
    // Later commits on the same date overwrite earlier ones — keeps the
    // most recent value when there are multiple commits per day (manual
    // seed + auto-run, force-pushes, etc.).
    byDate.set(date, {
      date,
      wti: data.wti.priceUsd,
      brent: data.brent.priceUsd,
      wcs: data.wcs.priceUsd,
    });
  }

  const rows = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  console.log(`Seeded ${rows.length} unique-date rows:`);
  for (const r of rows) {
    console.log(`  ${r.date}  WTI ${r.wti}  Brent ${r.brent}  WCS ${r.wcs}`);
  }

  if (DRY_RUN) {
    console.log('--dry-run set; not writing.');
    return;
  }

  writeFileSync(OUT, JSON.stringify(rows, null, 2) + '\n');
  console.log(`Wrote ${OUT}`);
}

main();
