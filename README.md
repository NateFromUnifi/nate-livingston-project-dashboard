# Nate Livingston — Project Dashboard

Public hub for finance, energy, and equity research projects.

Live: <https://nate-livingston-project-dashboard.vercel.app>

## Stack

- Next.js 16 (App Router) · React 19 · TypeScript
- Tailwind CSS v4
- d3-geo + topojson-client (custom SVG map of Canada)

## Develop

```bash
npm install
npm run dev
# http://localhost:3000
```

## Build

```bash
npm run build
npm start
```

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing dashboard — project tiles |
| `/oil-gas` | Visual primer of the Canadian oil & gas industry, starting with a province-level outline map |

## Data

`data/canada.json` — 13 features (10 provinces + 3 territories) filtered from Natural Earth `ne_50m_admin_1_states_provinces` via `adm0_a3 === 'CAN'`.
