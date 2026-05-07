import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';
import data from '@/data/basins.json';

export type BasinResourceType =
  | 'oil-sands'
  | 'gas-shale'
  | 'liquids-rich-shale'
  | 'tight-oil';

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
};
