'use client';

import { useState } from 'react';
import CanadaMap from '@/components/CanadaMap';
import PipelineLayer from '@/components/PipelineLayer';
import PipelineCard from '@/components/PipelineCard';
import LayerToggle from '@/components/LayerToggle';
import { pipelines, PIPELINE_LAYER_LABEL } from '@/lib/pipelines';

const pipelineSwatchColors = pipelines.features.map((f) => f.properties.color);

export default function OilGasMapView() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<string | null>(null);
  const [pipelinesEnabled, setPipelinesEnabled] = useState(true);

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <LayerToggle
            enabled={pipelinesEnabled}
            onToggle={() => {
              setPipelinesEnabled((v) => {
                if (v) setSelectedPipelineId(null);
                return !v;
              });
            }}
            label={PIPELINE_LAYER_LABEL}
            count={pipelines.features.length}
            swatchColors={pipelineSwatchColors}
          />
        </div>
        <span className="text-xs uppercase tracking-wider text-neutral-400">
          {pipelinesEnabled ? 'Click a pipeline for details' : 'Hover a region'}
        </span>
      </div>

      <div className="text-neutral-700 dark:text-neutral-300">
        <CanadaMap>
          {pipelinesEnabled && (
            <PipelineLayer
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
