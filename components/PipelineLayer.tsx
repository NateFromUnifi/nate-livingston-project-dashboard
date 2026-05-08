'use client';

import { useMemo, useState } from 'react';
import { useCanadaProjection } from '@/components/CanadaMap';
import {
  getPipelinesByCategory,
  type PipelineCategory,
} from '@/lib/pipelines';

type Props = {
  category: PipelineCategory;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type Pt = [number, number];

export default function PipelineLayer({ category, selectedId, onSelect }: Props) {
  const { projection, pathFn } = useCanadaProjection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(() => {
    return getPipelinesByCategory(category).map((f) => {
      // Anchor the floating hover label at the line's midpoint vertex.
      // For MultiLineString (NGTL), pick the longest segment's midpoint.
      let midPoint: Pt;
      if (f.geometry.type === 'LineString') {
        const coords = f.geometry.coordinates;
        const midIdx = Math.floor(coords.length / 2);
        midPoint = (projection(coords[midIdx] as Pt) ?? [0, 0]) as Pt;
      } else {
        let longest = f.geometry.coordinates[0];
        for (const seg of f.geometry.coordinates) {
          if (seg.length > longest.length) longest = seg;
        }
        const midIdx = Math.floor(longest.length / 2);
        midPoint = (projection(longest[midIdx] as Pt) ?? [0, 0]) as Pt;
      }
      return {
        id: f.properties.id,
        name: f.properties.name,
        color: f.properties.color,
        d: pathFn(f) ?? '',
        labelX: midPoint[0],
        labelY: midPoint[1] - 14,
      };
    });
  }, [category, projection, pathFn]);

  const hasSelection = selectedId !== null;
  const hovered = items.find((i) => i.id === hoveredId);

  return (
    <g aria-label={`${category} pipelines`}>
      {items.map((p) => {
        const isSelected = p.id === selectedId;
        const isHovered = p.id === hoveredId;
        const isDimmed = hasSelection && !isSelected;
        return (
          <g
            key={p.id}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p.id);
            }}
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId((id) => (id === p.id ? null : id))}
          >
            {/* Hit target — a wider invisible stroke so thin lines are easy to grab */}
            <path
              d={p.d}
              stroke="transparent"
              strokeWidth={14}
              fill="none"
              strokeLinecap="round"
              pointerEvents="stroke"
            />
            {/* Halo — soft colored glow that animates in on hover / select */}
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth={isSelected ? 8 : isHovered ? 6 : 0}
              strokeOpacity={isSelected ? 0.2 : isHovered ? 0.3 : 0}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
              className="transition-all duration-200 ease-out"
            />
            {/* Main line */}
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.75}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
              opacity={isDimmed && !isHovered ? 0.25 : 1}
              className="transition-all duration-200 ease-out"
            >
              <title>{p.name}</title>
            </path>
          </g>
        );
      })}

      {hovered && (
        <PipelineLabel x={hovered.labelX} y={hovered.labelY} name={hovered.name} />
      )}
    </g>
  );
}

function PipelineLabel({ x, y, name }: { x: number; y: number; name: string }) {
  const width = name.length * 6.6 + 14;
  const safeY = y < 18 ? y + 28 : y;
  return (
    <g transform={`translate(${x}, ${safeY})`} pointerEvents="none">
      <rect
        x={-width / 2}
        y={-9}
        width={width}
        height={18}
        rx={9}
        fill="#171717"
        fillOpacity={0.9}
      />
      <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={600} fill="white">
        {name}
      </text>
    </g>
  );
}
