import type { Feature, FeatureCollection, LineString, MultiLineString } from 'geojson';
import data from '@/data/pipelines.json';

export type PipelineCategory = 'crude' | 'gas';

// Direction of physical flow along the pipeline. 'forward' = direction of
// the GeoJSON LineString coordinates (from-to); 'reverse' = opposite;
// 'bidirectional' = the line moves product both ways (e.g., gathering networks).
export type FlowDirection = 'forward' | 'reverse' | 'bidirectional';

export type PipelineEndpoint = {
  name: string;
  province?: string;
  country?: string;
};

export type PipelineProperties = {
  id: string;
  name: string;
  category: PipelineCategory;
  operator: string;
  status: 'Operational' | 'Cancelled' | 'Proposed';
  commodity: string;
  from: PipelineEndpoint;
  to: PipelineEndpoint;
  lengthKm: number;
  capacity: string;
  inServiceYear: number;
  operatorLogo?: string;
  operatorLogoOnDark?: boolean;
  flowDirection?: FlowDirection;
  keyFacts: string[];
  notes?: string;
  color: string;
};

export type PipelineGeometry = LineString | MultiLineString;
export type PipelineFeature = Feature<PipelineGeometry, PipelineProperties>;
export type PipelineCollection = FeatureCollection<PipelineGeometry, PipelineProperties>;

export const pipelines = data as unknown as PipelineCollection;

export function getPipelineById(id: string): PipelineProperties | null {
  const f = pipelines.features.find((f) => f.properties.id === id);
  return f ? f.properties : null;
}

export function getPipelinesByCategory(category: PipelineCategory): PipelineFeature[] {
  return pipelines.features.filter((f) => f.properties.category === category);
}

export const PIPELINE_CATEGORY_LABELS: Record<PipelineCategory, string> = {
  crude: 'Crude Oil Pipelines',
  gas: 'Natural Gas Pipelines',
};
