'use client';

import { useMemo } from 'react';
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

export default function PipelineLayer({ category, selectedId, onSelect }: Props) {
  const { pathFn } = useCanadaProjection();

  const items = useMemo(() => {
    return getPipelinesByCategory(category).map((f) => ({
      id: f.properties.id,
      name: f.properties.name,
      color: f.properties.color,
      d: pathFn(f) ?? '',
    }));
  }, [category, pathFn]);

  const hasSelection = selectedId !== null;

  return (
    <g aria-label={`${category} pipelines`}>
      {items.map((p) => {
        const isSelected = p.id === selectedId;
        const isDimmed = hasSelection && !isSelected;
        return (
          <g
            key={p.id}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(p.id);
            }}
          >
            <path
              d={p.d}
              stroke="transparent"
              strokeWidth={12}
              fill="none"
              strokeLinecap="round"
              pointerEvents="stroke"
            />
            <path
              d={p.d}
              stroke={p.color}
              strokeWidth={isSelected ? 3.5 : 1.75}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pointerEvents="none"
              opacity={isDimmed ? 0.25 : 1}
              className="transition-all duration-200"
            >
              <title>{p.name}</title>
            </path>
          </g>
        );
      })}
    </g>
  );
}
