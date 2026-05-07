'use client';

import { useMemo, useState } from 'react';
import { useCanadaProjection } from '@/components/CanadaMap';
import { basins } from '@/lib/basins';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type Pt = [number, number];

// Inflate the polygon outward this much before smoothing, so the
// rounded blob encapsulates the polygon's interior area instead of
// inset-ing into it (which midpoint smoothing alone would do).
const INFLATE_FACTOR = 1.12;

function centroid(points: Pt[]): Pt {
  const n = points.length;
  return [
    points.reduce((s, p) => s + p[0], 0) / n,
    points.reduce((s, p) => s + p[1], 0) / n,
  ];
}

function scaleAround(points: Pt[], cx: number, cy: number, factor: number): Pt[] {
  return points.map((p) => [cx + (p[0] - cx) * factor, cy + (p[1] - cy) * factor]);
}

function polygonArea(points: Pt[]): number {
  let a = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    a += points[i][0] * points[j][1];
    a -= points[j][0] * points[i][1];
  }
  return Math.abs(a / 2);
}

// Closed quadratic-bezier smoothing: each polygon vertex becomes a
// control point and the curve passes through every edge midpoint.
// Result is a closed rounded blob with no sharp corners.
function smoothClosedPath(points: Pt[]): string {
  const n = points.length;
  if (n < 3) return '';
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(points[n - 1], points[0]);
  let d = `M ${start[0].toFixed(2)} ${start[1].toFixed(2)}`;
  for (let i = 0; i < n; i++) {
    const v = points[i];
    const next = mid(points[i], points[(i + 1) % n]);
    d += ` Q ${v[0].toFixed(2)} ${v[1].toFixed(2)} ${next[0].toFixed(2)} ${next[1].toFixed(2)}`;
  }
  return d + ' Z';
}

export default function BasinLayer({ selectedId, onSelect }: Props) {
  const { projection } = useCanadaProjection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(() => {
    const built = basins.features.map((f) => {
      const ring = (f.geometry.type === 'Polygon'
        ? f.geometry.coordinates[0]
        : f.geometry.coordinates[0][0]) as Pt[];
      // Drop GeoJSON's duplicate closing point if present.
      const isDupClose =
        ring.length > 1 &&
        ring[0][0] === ring[ring.length - 1][0] &&
        ring[0][1] === ring[ring.length - 1][1];
      const open = isDupClose ? ring.slice(0, -1) : ring;
      const projected = open.map((c) => (projection(c) ?? [0, 0]) as Pt);
      const [cx, cy] = centroid(projected);
      const inflated = scaleAround(projected, cx, cy, INFLATE_FACTOR);
      const xs = inflated.map((p) => p[0]);
      const ys = inflated.map((p) => p[1]);
      return {
        id: f.properties.id,
        name: f.properties.name,
        color: f.properties.color,
        d: smoothClosedPath(inflated),
        labelX: (Math.min(...xs) + Math.max(...xs)) / 2,
        labelY: Math.min(...ys) - 12,
        area: polygonArea(inflated),
      };
    });
    // Render largest first; smaller shapes sit on top so they remain
    // clickable in any overlap zone.
    return built.sort((a, b) => b.area - a.area);
  }, [projection]);

  const hasSelection = selectedId !== null;
  const hovered = items.find((i) => i.id === hoveredId);

  return (
    <g aria-label="Production basins">
      {items.map((b) => {
        const isSelected = b.id === selectedId;
        const isHovered = b.id === hoveredId;
        const isDimmed = hasSelection && !isSelected;

        const fillOpacity = isSelected
          ? 0.45
          : isHovered
          ? isDimmed
            ? 0.22
            : 0.34
          : isDimmed
          ? 0.1
          : 0.2;
        const strokeWidth = isSelected ? 2.25 : isHovered ? 2 : 1;
        const strokeOpacity = isSelected
          ? 1
          : isHovered
          ? isDimmed
            ? 0.75
            : 1
          : isDimmed
          ? 0.3
          : 0.75;

        return (
          <path
            key={b.id}
            d={b.d}
            fill={b.color}
            fillOpacity={fillOpacity}
            stroke={b.color}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            strokeLinejoin="round"
            className="cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHoveredId(b.id)}
            onMouseLeave={() => setHoveredId((id) => (id === b.id ? null : id))}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(b.id);
            }}
          >
            <title>{b.name}</title>
          </path>
        );
      })}

      {hovered && <BasinLabel x={hovered.labelX} y={hovered.labelY} name={hovered.name} />}
    </g>
  );
}

function BasinLabel({ x, y, name }: { x: number; y: number; name: string }) {
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
