'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { getPipelineById, type PipelineProperties } from '@/lib/pipelines';

type Props = {
  selectedId: string | null;
  onClose: () => void;
};

const formatNumber = (n: number) => n.toLocaleString('en-CA');

const formatEndpoint = (e: PipelineProperties['from']) =>
  [e.name, e.province, e.country].filter(Boolean).join(', ');

export default function PipelineCard({ selectedId, onClose }: Props) {
  const [displayed, setDisplayed] = useState<PipelineProperties | null>(null);
  const isOpen = selectedId !== null;

  useEffect(() => {
    if (selectedId) {
      const p = getPipelineById(selectedId);
      if (p) setDisplayed(p);
    } else {
      const t = setTimeout(() => setDisplayed(null), 220);
      return () => clearTimeout(t);
    }
  }, [selectedId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  return (
    <aside
      className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-200 ease-out dark:bg-neutral-950 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!isOpen}
      aria-label={displayed ? `${displayed.name} info` : undefined}
      role="dialog"
    >
      {displayed && (
        <>
          <header className="flex items-start justify-between border-b border-neutral-200 px-6 py-5 dark:border-neutral-800">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: displayed.color }}
                  aria-hidden
                />
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  {displayed.status}
                </p>
              </div>
              <h2 className="mt-1.5 font-serif text-2xl text-neutral-900 dark:text-neutral-50">
                {displayed.name}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">{displayed.operator}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="-mr-2 -mt-1 rounded p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden>
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <Field label="Route">
              {formatEndpoint(displayed.from)} <span className="text-neutral-400">→</span>{' '}
              {formatEndpoint(displayed.to)}
            </Field>
            <Field label="Commodity">{displayed.commodity}</Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Length">{formatNumber(displayed.lengthKm)} km</Field>
              <Field label="Capacity">{displayed.capacity}</Field>
              <Field label="In service">{displayed.inServiceYear}</Field>
            </div>

            {displayed.notes && (
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500">About</p>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                  {displayed.notes}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs uppercase tracking-widest text-neutral-500">Key facts</p>
              <ul className="mt-2 space-y-2.5 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {displayed.keyFacts.map((fact) => (
                  <li key={fact} className="flex gap-3">
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: displayed.color }}
                      aria-hidden
                    />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{children}</p>
    </div>
  );
}
