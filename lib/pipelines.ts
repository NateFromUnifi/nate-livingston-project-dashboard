import type { Feature, FeatureCollection, LineString } from 'geojson';
import data from '@/data/pipelines.json';

export type PipelineEndpoint = {
  name: string;
  province?: string;
  country?: string;
};

export type PipelineProperties = {
  id: string;
  name: string;
  operator: string;
  status: 'Operational' | 'Cancelled' | 'Proposed';
  commodity: string;
  from: PipelineEndpoint;
  to: PipelineEndpoint;
  lengthKm: number;
  capacityBpd: number;
  inServiceYear: number;
  keyFacts: string[];
  notes?: string;
  color: string;
};

export type PipelineFeature = Feature<LineString, PipelineProperties>;
export type PipelineCollection = FeatureCollection<LineString, PipelineProperties>;

export const pipelines = data as unknown as PipelineCollection;

export function getPipelineById(id: string): PipelineProperties | null {
  const f = pipelines.features.find((f) => f.properties.id === id);
  return f ? f.properties : null;
}

export const PIPELINE_LAYER_LABEL = 'Crude Oil Pipelines';
