'use client';

type Props = {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  count: number;
  swatchColors?: string[];
};

export default function LayerToggle({ enabled, onToggle, label, count, swatchColors }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
        enabled
          ? 'border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800'
          : 'border-neutral-200 bg-neutral-50 text-neutral-400 hover:text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:text-neutral-300'
      }`}
    >
      {swatchColors && swatchColors.length > 0 ? (
        <span className="flex shrink-0 items-center -space-x-1" aria-hidden>
          {swatchColors.map((c, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-neutral-900"
              style={{ backgroundColor: enabled ? c : '#d4d4d4' }}
            />
          ))}
        </span>
      ) : (
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: enabled ? '#171717' : '#d4d4d4' }}
          aria-hidden
        />
      )}
      <span>{label}</span>
      <span className="ml-0.5 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] tabular-nums text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
        {count}
      </span>
    </button>
  );
}
