import type { Feature, FeatureCollection, Point } from 'geojson';
import data from '@/data/refineries.json';

export type RefineryType = 'upgrader' | 'refinery' | 'integrated';

export type RefineryProperties = {
  id: string;
  name: string;
  type: RefineryType;
  operator: string;
  operatorLogo?: string;
  operatorLogoOnDark?: boolean;
  status: 'Operational' | 'Closed' | 'Converting';
  capacity: string;
  inputs: string;
  outputs: string;
  process: string;
  location: { city: string; province: string };
  inServiceYear: number;
  keyFacts: string[];
  notes?: string;
  color: string;
};

export type RefineryFeature = Feature<Point, RefineryProperties>;
export type RefineryCollection = FeatureCollection<Point, RefineryProperties>;

export const refineries = data as unknown as RefineryCollection;

export function getRefineryById(id: string): RefineryProperties | null {
  const f = refineries.features.find((f) => f.properties.id === id);
  return f ? f.properties : null;
}

export const REFINERY_LAYER_LABEL = 'Refineries & Upgraders';

export const REFINERY_TYPE_LABELS: Record<RefineryType, string> = {
  upgrader: 'Upgrader',
  refinery: 'Refinery',
  integrated: 'Integrated upgrader + refinery',
};

// Type-level swatch colours used in the toggle pill.
export const REFINERY_SWATCH_COLORS = ['#1e293b', '#d97706', '#059669'];
