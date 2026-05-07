'use client';

import { useMemo, useState } from 'react';
import { geoCentroid } from 'd3-geo';
import { useCanadaProjection } from '@/components/CanadaMap';
import { basins } from '@/lib/basins';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const MIN_RADIUS = 16;
const MAX_RADIUS = 70;

export default function BasinLayer({ selectedId, onSelect }: Props) {
  const { projection, pathFn } = useCanadaProjection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(() => {
    const built = basins.features.map((f) => {
      const centroid = geoCentroid(f);
      const projected = projection(centroid) ?? [0, 0];
      const areaPx2 = pathFn.area(f);
      const radiusPx = Math.max(MIN_RADIUS, Math.min(MAX_RADIUS, Math.sqrt(areaPx2 / Math.PI)));
      return {
        id: f.properties.id,
        name: f.properties.name,
        color: f.properties.color,
        cx: projected[0],
        cy: projected[1],
        r: radiusPx,
      };
    });
    // Render largest first so smaller circles sit on top and stay clickable.
    return built.sort((a, b) => b.r - a.r);
  }, [projection, pathFn]);

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
          <g key={b.id}>
            {/* Slightly-larger transparent ring widens the hit target. */}
            <circle
              cx={b.cx}
              cy={b.cy}
              r={b.r + 6}
              fill="transparent"
              stroke="transparent"
              className="cursor-pointer"
              pointerEvents="all"
              onMouseEnter={() => setHoveredId(b.id)}
              onMouseLeave={() => setHoveredId((id) => (id === b.id ? null : id))}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(b.id);
              }}
            />
            <circle
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill={b.color}
              fillOpacity={fillOpacity}
              stroke={b.color}
              strokeWidth={strokeWidth}
              strokeOpacity={strokeOpacity}
              className="transition-all duration-150"
              pointerEvents="none"
            >
              <title>{b.name}</title>
            </circle>
          </g>
        );
      })}

      {hovered && <BasinLabel x={hovered.cx} y={hovered.cy - hovered.r - 12} name={hovered.name} />}
    </g>
  );
}

function BasinLabel({ x, y, name }: { x: number; y: number; name: string }) {
  // Approximate width based on character count — close enough for our 5 basin names.
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
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill="white"
      >
        {name}
      </text>
    </g>
  );
}
