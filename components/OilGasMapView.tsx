'use client';

import { useMemo, useState } from 'react';
import CanadaMap from '@/components/CanadaMap';
import PipelineLayer from '@/components/PipelineLayer';
import PipelineCard from '@/components/PipelineCard';
import BasinLayer from '@/components/BasinLayer';
import BasinCard from '@/components/BasinCard';
import RefineryLayer from '@/components/RefineryLayer';
import RefineryCard from '@/components/RefineryCard';
import LayerToggle from '@/components/LayerToggle';
import {
  getPipelinesByCategory,
  PIPELINE_CATEGORY_LABELS,
  type PipelineCategory,
} from '@/lib/pipelines';
import {
  BASIN_LAYER_LABEL,
  PRODUCTION_BASIN_COUNT,
  PRODUCTION_BASIN_SWATCH_COLORS,
} from '@/lib/basins';
import {
  refineries,
  REFINERY_LAYER_LABEL,
  REFINERY_SWATCH_COLORS,
} from '@/lib/refineries';

type CategoryConfig = {
  key: PipelineCategory;
  label: string;
  features: ReturnType<typeof getPipelinesByCategory>;
};

type Selection =
  | { kind: 'pipeline'; id: string }
  | { kind: 'basin'; id: string }
  | { kind: 'refinery'; id: string }
  | null;

export default function OilGasMapView() {
  const [selection, setSelection] = useState<Selection>(null);
  const [activeCategory, setActiveCategory] = useState<PipelineCategory | null>('crude');
  const [basinsEnabled, setBasinsEnabled] = useState(true);
  const [refineriesEnabled, setRefineriesEnabled] = useState(true);

  const categories = useMemo<CategoryConfig[]>(
    () => [
      { key: 'crude', label: PIPELINE_CATEGORY_LABELS.crude, features: getPipelinesByCategory('crude') },
      { key: 'gas', label: PIPELINE_CATEGORY_LABELS.gas, features: getPipelinesByCategory('gas') },
    ],
    [],
  );

  const togglePipelineCategory = (key: PipelineCategory) => {
    const next = activeCategory === key ? null : key;
    setActiveCategory(next);
    if (selection?.kind === 'pipeline') setSelection(null);
  };

  const toggleBasins = () => {
    setBasinsEnabled((prev) => !prev);
    if (basinsEnabled && selection?.kind === 'basin') setSelection(null);
  };

  const toggleRefineries = () => {
    setRefineriesEnabled((prev) => !prev);
    if (refineriesEnabled && selection?.kind === 'refinery') setSelection(null);
  };

  const selectedPipelineId = selection?.kind === 'pipeline' ? selection.id : null;
  const selectedBasinId = selection?.kind === 'basin' ? selection.id : null;
  const selectedRefineryId = selection?.kind === 'refinery' ? selection.id : null;

  const hint = (() => {
    const parts: string[] = [];
    if (activeCategory) parts.push('pipeline');
    if (basinsEnabled) parts.push('basin');
    if (refineriesEnabled) parts.push('facility');
    if (parts.length === 0) return 'Hover a region';
    if (parts.length === 1) return `Click a ${parts[0]} for details`;
    if (parts.length === 2) return `Click a ${parts[0]} or ${parts[1]} for details`;
    return `Click a ${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]} for details`;
  })();

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Pipelines
          </span>
          <div role="radiogroup" aria-label="Pipeline category" className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <LayerToggle
                key={c.key}
                enabled={activeCategory === c.key}
                onToggle={() => togglePipelineCategory(c.key)}
                label={c.label}
                count={c.features.length}
                swatchColors={c.features.map((f) => f.properties.color)}
              />
            ))}
          </div>
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Geology
          </span>
          <LayerToggle
            enabled={basinsEnabled}
            onToggle={toggleBasins}
            label={BASIN_LAYER_LABEL}
            count={PRODUCTION_BASIN_COUNT}
            swatchColors={PRODUCTION_BASIN_SWATCH_COLORS}
          />
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            Downstream
          </span>
          <LayerToggle
            enabled={refineriesEnabled}
            onToggle={toggleRefineries}
            label={REFINERY_LAYER_LABEL}
            count={refineries.features.length}
            swatchColors={REFINERY_SWATCH_COLORS}
          />
        </div>
        <span className="text-xs uppercase tracking-wider text-neutral-400">{hint}</span>
      </div>

      <div className="text-neutral-700 dark:text-neutral-300">
        <CanadaMap>
          {basinsEnabled && (
            <BasinLayer
              selectedId={selectedBasinId}
              onSelect={(id) => setSelection({ kind: 'basin', id })}
            />
          )}
          {activeCategory && (
            <PipelineLayer
              category={activeCategory}
              selectedId={selectedPipelineId}
              onSelect={(id) => setSelection({ kind: 'pipeline', id })}
            />
          )}
          {refineriesEnabled && (
            <RefineryLayer
              selectedId={selectedRefineryId}
              onSelect={(id) => setSelection({ kind: 'refinery', id })}
            />
          )}
        </CanadaMap>
      </div>

      <PipelineCard selectedId={selectedPipelineId} onClose={() => setSelection(null)} />
      <BasinCard selectedId={selectedBasinId} onClose={() => setSelection(null)} />
      <RefineryCard selectedId={selectedRefineryId} onClose={() => setSelection(null)} />
    </>
  );
}
