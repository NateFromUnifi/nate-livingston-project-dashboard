'use client';

import { useMemo, useState } from 'react';
import { useCanadaProjection } from '@/components/CanadaMap';
import { ports } from '@/lib/ports';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type Pt = [number, number];

// Pin / teardrop SVG path. Tip is at (0, 0) so the pin "points to" the
// projected port location after a translate(cx, cy) transform.
const PIN_PATH = 'M 0,0 C -10,-9 -11,-18 0,-22 C 11,-18 10,-9 0,0 Z';
const PIN_DOT_CY = -14;

export default function PortLayer({ selectedId, onSelect }: Props) {
  const { projection } = useCanadaProjection();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const items = useMemo(() => {
    return ports.features.map((f) => {
      const projected = (projection(f.geometry.coordinates as Pt) ?? [0, 0]) as Pt;
      return {
        id: f.properties.id,
        name: f.properties.name,
        color: f.properties.color,
        cx: projected[0],
        cy: projected[1],
      };
    });
  }, [projection]);

  const hasSelection = selectedId !== null;
  const hovered = items.find((i) => i.id === hoveredId);

  return (
    <g aria-label="Marine terminals">
      {items.map((p) => {
        const isSelected = p.id === selectedId;
        const isHovered = p.id === hoveredId;
        const isDimmed = hasSelection && !isSelected;

        const baseScale = isSelected ? 1.4 : isHovered ? 1.2 : 1;
        const opacity = isDimmed && !isHovered ? 0.35 : 1;

        return (
          <g
            key={p.id}
            transform={`translate(${p.cx.toFixed(2)}, ${p.cy.toFixed(2)})`}
            className="cursor-pointer"
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId((id) => (id === p.id ? null : id))}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p.id);
            }}
            opacity={opacity}
          >
            {/* Glow halo behind the pin — animates in on hover/select */}
            <g
              className="transition-transform duration-200 ease-out"
              style={{ transform: `scale(${baseScale * 1.5})` }}
            >
              <path
                d={PIN_PATH}
                fill={p.color}
                fillOpacity={isSelected ? 0.3 : isHovered ? 0.22 : 0}
              />
            </g>
            {/* Hit target — invisible, slightly larger than visible pin */}
            <g style={{ transform: `scale(${baseScale * 1.4})` }}>
              <path d={PIN_PATH} fill="transparent" />
            </g>
            {/* Main pin — colored body + white inner dot */}
            <g
              className="transition-transform duration-200 ease-out"
              style={{ transform: `scale(${baseScale})` }}
            >
              <path
                d={PIN_PATH}
                fill={p.color}
                stroke="white"
                strokeWidth={1.25}
                strokeLinejoin="round"
              />
              <circle cx={0} cy={PIN_DOT_CY} r={2.6} fill="white" />
              <title>{p.name}</title>
            </g>
          </g>
        );
      })}

      {hovered && (
        // Pin extends ~22 px upward from its projected point, so anchor the label
        // above that.
        <PortLabel x={hovered.cx} y={hovered.cy - 30} name={hovered.name} />
      )}
    </g>
  );
}

function PortLabel({ x, y, name }: { x: number; y: number; name: string }) {
  const width = name.length * 6.6 + 14;
  const safeY = y < 18 ? y + 50 : y;
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
