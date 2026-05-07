'use client';

import { useMemo } from 'react';
import { useCanadaProjection } from '@/components/CanadaMap';
import { basins } from '@/lib/basins';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function BasinLayer({ selectedId, onSelect }: Props) {
  const { pathFn } = useCanadaProjection();

  const items = useMemo(() => {
    return basins.features.map((f) => ({
      id: f.properties.id,
      name: f.properties.name,
      color: f.properties.color,
      d: pathFn(f) ?? '',
    }));
  }, [pathFn]);

  const hasSelection = selectedId !== null;

  return (
    <g aria-label="Production basins">
      {items.map((b) => {
        const isSelected = b.id === selectedId;
        const isDimmed = hasSelection && !isSelected;
        return (
          <path
            key={b.id}
            d={b.d}
            fill={b.color}
            fillOpacity={isSelected ? 0.42 : isDimmed ? 0.1 : 0.22}
            stroke={b.color}
            strokeWidth={isSelected ? 1.75 : 1}
            strokeOpacity={isDimmed ? 0.35 : 0.85}
            className="cursor-pointer transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(b.id);
            }}
          >
            <title>{b.name}</title>
          </path>
        );
      })}
    </g>
  );
}
