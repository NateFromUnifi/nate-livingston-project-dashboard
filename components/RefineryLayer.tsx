'use client';

import { useMemo, useState } from 'react';
import { useCanadaProjection } from '@/components/CanadaMap';
import { refineries, type RefineryType } from '@/lib/refineries';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type Pt = [number, number];

export default function RefineryLayer({ selectedId, onSelect }: Props) {
  const { projection } = useCanadaProjection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(() => {
    return refineries.features.map((f) => {
      const projected = (projection(f.geometry.coordinates as Pt) ?? [0, 0]) as Pt;
      return {
        id: f.properties.id,
        name: f.properties.name,
        type: f.properties.type as RefineryType,
        color: f.properties.color,
        cx: projected[0],
        cy: projected[1],
      };
    });
  }, [projection]);

  const hasSelection = selectedId !== null;
  const hovered = items.find((i) => i.id === hoveredId);

  return (
    <g aria-label="Oil refineries and upgraders">
      {items.map((m) => {
        const isSelected = m.id === selectedId;
        const isHovered = m.id === hoveredId;
        const isDimmed = hasSelection && !isSelected;

        const baseScale = isSelected ? 1.4 : isHovered ? 1.25 : 1;
        const opacity = isDimmed && !isHovered ? 0.35 : 1;

        return (
          <g
            key={m.id}
            transform={`translate(${m.cx.toFixed(2)}, ${m.cy.toFixed(2)})`}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredId(m.id)}
            onMouseLeave={() => setHoveredId((id) => (id === m.id ? null : id))}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(m.id);
            }}
            opacity={opacity}
          >
            {/* Glow halo behind the marker — animates in on hover/select */}
            <Marker
              type={m.type}
              size={9}
              fill={m.color}
              fillOpacity={isSelected ? 0.3 : isHovered ? 0.22 : 0}
              stroke="none"
              scale={baseScale * 1.85}
              transition
            />
            {/* Hit target — invisible but extends the click area beyond the marker */}
            <Marker
              type={m.type}
              size={9}
              fill="transparent"
              stroke="transparent"
              scale={baseScale * 1.6}
            />
            {/* Main marker (carries native tooltip via <title>) */}
            <g>
              <Marker
                type={m.type}
                size={6}
                fill={m.color}
                stroke="white"
                strokeWidth={1.5}
                scale={baseScale}
                transition
              />
              <title>{m.name}</title>
            </g>
          </g>
        );
      })}

      {hovered && (
        <RefineryLabel x={hovered.cx} y={hovered.cy - 18} name={hovered.name} />
      )}
    </g>
  );
}

type MarkerProps = {
  type: RefineryType;
  size: number;
  fill: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  scale?: number;
  transition?: boolean;
};

function Marker({
  type,
  size,
  fill,
  fillOpacity = 1,
  stroke = 'none',
  strokeWidth = 0,
  scale = 1,
  transition = false,
}: MarkerProps) {
  const className = transition ? 'transition-transform duration-200 ease-out' : undefined;
  const style = scale === 1 ? undefined : { transform: `scale(${scale})` };

  if (type === 'upgrader') {
    // Diamond
    const r = size + 1;
    return (
      <polygon
        points={`0,${-r} ${r},0 0,${r} ${-r},0`}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        className={className}
        style={style}
      />
    );
  }

  if (type === 'integrated') {
    // Rounded rectangle (slightly wider than tall)
    const w = size * 2.2;
    const h = size * 1.6;
    return (
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx={2}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={stroke}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
      />
    );
  }

  // Refinery default — circle
  return (
    <circle
      r={size}
      fill={fill}
      fillOpacity={fillOpacity}
      stroke={stroke}
      strokeWidth={strokeWidth}
      className={className}
      style={style}
    />
  );
}

function RefineryLabel({ x, y, name }: { x: number; y: number; name: string }) {
  const width = name.length * 6.6 + 14;
  const safeY = y < 18 ? y + 38 : y;
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
