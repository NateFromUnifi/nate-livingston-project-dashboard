import type { Feature, FeatureCollection, Point } from 'geojson';
import data from '@/data/ports.json';

export type PortType = 'oil' | 'lng' | 'multi';

export type PortStatus = 'Operational' | 'Commissioning' | 'Under construction' | 'Idle';

export type PortProperties = {
  id: string;
  name: string;
  type: PortType;
  operator: string;
  operatorLogo?: string;
  operatorLogoOnDark?: boolean;
  status: PortStatus;
  volume: string;
  inputs: string;
  exportMarkets: string;
  vesselTypes: string;
  location: { city: string; province: string };
  inServiceYear: number;
  keyFacts: string[];
  notes?: string;
  color: string;
};

export type PortFeature = Feature<Point, PortProperties>;
export type PortCollection = FeatureCollection<Point, PortProperties>;

export const ports = data as unknown as PortCollection;

export function getPortById(id: string): PortProperties | null {
  const f = ports.features.find((f) => f.properties.id === id);
  return f ? f.properties : null;
}

export const PORT_LAYER_LABEL = 'Marine Terminals';

export const PORT_TYPE_LABELS: Record<PortType, string> = {
  oil: 'Oil terminal',
  lng: 'LNG terminal',
  multi: 'Multi-product terminal',
};

// Two colours used in the toggle pill swatch — oil + LNG.
export const PORT_SWATCH_COLORS = ['#1e40af', '#0d9488'];
