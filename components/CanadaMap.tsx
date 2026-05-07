'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { geoConicConformal, geoPath } from 'd3-geo';
import type { GeoPath, GeoProjection } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';
import canadaData from '@/data/canada.json';

const WIDTH = 960;
const HEIGHT = 600;

type ProvinceProperties = {
  name: string;
  iso_3166_2: string;
  type_en: string;
  region: string;
};

const data = canadaData as unknown as FeatureCollection<Geometry, ProvinceProperties>;

type CanadaProjectionContextValue = {
  projection: GeoProjection;
  pathFn: GeoPath;
  width: number;
  height: number;
};

const CanadaProjectionContext = createContext<CanadaProjectionContextValue | null>(null);

export function useCanadaProjection(): CanadaProjectionContextValue {
  const ctx = useContext(CanadaProjectionContext);
  if (!ctx) {
    throw new Error('useCanadaProjection must be used inside <CanadaMap>');
  }
  return ctx;
}

type Props = {
  children?: ReactNode;
};

export default function CanadaMap({ children }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { paths, contextValue } = useMemo(() => {
    const projection = geoConicConformal()
      .parallels([49, 77])
      .rotate([95, 0])
      .fitSize([WIDTH, HEIGHT], data);
    const pathFn = geoPath(projection);
    return {
      paths: data.features.map((f) => ({
        d: pathFn(f) ?? '',
        id: f.properties.iso_3166_2,
        name: f.properties.name,
        region: f.properties.region,
      })),
      contextValue: { projection, pathFn, width: WIDTH, height: HEIGHT },
    };
  }, []);

  const hovered = paths.find((p) => p.id === hoveredId);

  return (
    <CanadaProjectionContext.Provider value={contextValue}>
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Map of Canada showing provinces and territories"
        >
          <g aria-label="Provinces and territories">
            {paths.map((p) => {
              const isHovered = p.id === hoveredId;
              return (
                <path
                  key={p.id}
                  d={p.d}
                  className={`cursor-pointer transition-colors duration-150 ${
                    isHovered ? 'fill-amber-500/15' : 'fill-transparent'
                  }`}
                  stroke="currentColor"
                  strokeWidth={0.75}
                  strokeLinejoin="round"
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <title>{p.name}</title>
                </path>
              );
            })}
          </g>
          {children}
        </svg>
        <div
          className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-neutral-900/85 px-3 py-1.5 text-sm font-medium text-white shadow-md backdrop-blur transition-opacity duration-150"
          style={{ opacity: hovered ? 1 : 0 }}
          aria-live="polite"
        >
          {hovered ? `${hovered.name} · ${hovered.region}` : ' '}
        </div>
      </div>
    </CanadaProjectionContext.Provider>
  );
}
