import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import data from '@/data/basins.json';

export type BasinResourceType =
  | 'oil-sands'
  | 'gas-shale'
  | 'liquids-rich-shale'
  | 'tight-oil'
  | 'sedimentary-basin';

export type BasinProperties = {
  id: string;
  name: string;
  resourceType: BasinResourceType;
  primaryResource: string;
  province: string;
  productionContext: string;
  reserves: string;
  majorOperators: string[];
  geology: string;
  keyFacts: string[];
  notes?: string;
  color: string;
};

export type BasinGeometry = Polygon | MultiPolygon;
export type BasinFeature = Feature<BasinGeometry, BasinProperties>;
export type BasinCollection = FeatureCollection<BasinGeometry, BasinProperties>;

export const basins = data as unknown as BasinCollection;

export function getBasinById(id: string): BasinProperties | null {
  const f = basins.features.find((f) => f.properties.id === id);
  return f ? f.properties : null;
}

export const BASIN_LAYER_LABEL = 'Production Basins';

export const RESOURCE_TYPE_LABELS: Record<BasinResourceType, string> = {
  'oil-sands': 'Oil sands',
  'gas-shale': 'Gas shale',
  'liquids-rich-shale': 'Liquids-rich shale',
  'tight-oil': 'Tight oil',
  'sedimentary-basin': 'Sedimentary basin',
};

// Counts and swatches reflect the user-facing "Production Basins" toggle —
// the WCSB umbrella renders alongside but is conceptually a backdrop, not a peer.
export const PRODUCTION_BASINS = basins.features.filter(
  (f) => f.properties.resourceType !== 'sedimentary-basin',
);
export const PRODUCTION_BASIN_COUNT = PRODUCTION_BASINS.length;
export const PRODUCTION_BASIN_SWATCH_COLORS = PRODUCTION_BASINS.map(
  (f) => f.properties.color,
);
