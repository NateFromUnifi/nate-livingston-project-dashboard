'use client';

import { useMemo, useState } from 'react';
import CanadaMap from '@/components/CanadaMap';
import PipelineLayer from '@/components/PipelineLayer';
import PipelineCard from '@/components/PipelineCard';
import LayerToggle from '@/components/LayerToggle';
import {
  getPipelinesByCategory,
  PIPELINE_CATEGORY_LABELS,
  type PipelineCategory,
} from '@/lib/pipelines';

type CategoryConfig = {
  key: PipelineCategory;
  label: string;
  features: ReturnType<typeof getPipelinesByCategory>;
};

export default function OilGasMapView() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<PipelineCategory | null>('crude');

  const categories = useMemo<CategoryConfig[]>(
    () => [
      { key: 'crude', label: PIPELINE_CATEGORY_LABELS.crude, features: getPipelinesByCategory('crude') },
      { key: 'gas', label: PIPELINE_CATEGORY_LABELS.gas, features: getPipelinesByCategory('gas') },
    ],
    [],
  );

  const toggleCategory = (key: PipelineCategory) => {
    const next = activeCategory === key ? null : key;
    setActiveCategory(next);
    setSelectedPipelineId(null);
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Pipeline category">
          {categories.map((c) => (
            <LayerToggle
              key={c.key}
              enabled={activeCategory === c.key}
              onToggle={() => toggleCategory(c.key)}
              label={c.label}
              count={c.features.length}
              swatchColors={c.features.map((f) => f.properties.color)}
            />
          ))}
        </div>
        <span className="text-xs uppercase tracking-wider text-neutral-400">
          {activeCategory ? 'Click a pipeline for details' : 'Hover a region'}
        </span>
      </div>

      <div className="text-neutral-700 dark:text-neutral-300">
        <CanadaMap>
          {activeCategory && (
            <PipelineLayer
              category={activeCategory}
              selectedId={selectedPipelineId}
              onSelect={setSelectedPipelineId}
            />
          )}
        </CanadaMap>
      </div>

      <PipelineCard
        selectedId={selectedPipelineId}
        onClose={() => setSelectedPipelineId(null)}
      />
    </>
  );
}
