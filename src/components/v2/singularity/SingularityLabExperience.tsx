'use client';

import { useCallback, useRef, useState } from 'react';
import { BlackHoleLazy } from '@/src/components/v2/singularity/BlackHoleLazy';
import {
  DEFAULT_SINGULARITY_PARAMS,
  type SingularityParams
} from '@/src/components/v2/singularity/lib/params';

type SliderDef = {
  key: keyof SingularityParams;
  label: string;
  min: number;
  max: number;
  step: number;
};

type ColorDef = {
  key: keyof SingularityParams;
  label: string;
};

const SLIDERS: SliderDef[] = [
  { key: 'bloomStrength', label: 'Glow strength', min: 0, max: 2.4, step: 0.01 },
  { key: 'bloomRadius', label: 'Glow radius', min: 0, max: 1.5, step: 0.01 },
  { key: 'bloomThreshold', label: 'Glow threshold', min: 0, max: 1, step: 0.01 },
  { key: 'diskDensity', label: 'Disk density', min: 0, max: 3, step: 0.01 },
  { key: 'flowSpeed', label: 'Disk flow', min: 0, max: 0.5, step: 0.005 },
  { key: 'noiseScale', label: 'Disk noise', min: 0.4, max: 6, step: 0.05 },
  { key: 'diskSpin', label: 'Disk spin', min: 0, max: 0.03, step: 0.0005 },
  { key: 'diskTiltDeg', label: 'Disk tilt °', min: -90, max: 0, step: 1 },
  { key: 'diskBankDeg', label: 'Disk bank °', min: -45, max: 45, step: 1 },
  { key: 'lensingStrength', label: 'Lensing', min: 0, max: 0.45, step: 0.005 },
  { key: 'lensingRadius', label: 'Lens radius', min: 0.1, max: 0.8, step: 0.01 },
  { key: 'chromaticAberration', label: 'Chromatic', min: 0, max: 0.012, step: 0.0001 },
  { key: 'exposure', label: 'Exposure', min: 0.4, max: 2.2, step: 0.01 },
  { key: 'fogDensity', label: 'Fog', min: 0, max: 0.08, step: 0.001 },
  { key: 'timeScale', label: 'Time scale', min: 0, max: 1.5, step: 0.01 }
];

const COLORS: ColorDef[] = [
  { key: 'colorHot', label: 'Hot' },
  { key: 'colorMid', label: 'Mid' },
  { key: 'colorAccent', label: 'Accent' },
  { key: 'colorEmber', label: 'Ember' },
  { key: 'colorOuter', label: 'Outer' },
  { key: 'background', label: 'Background' }
];

function ControlSlider({
  def,
  value,
  onChange
}: {
  def: SliderDef;
  value: number;
  onChange: (key: keyof SingularityParams, value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3">
        <span className="archive-label text-white/55">{def.label}</span>
        <span className="font-mono text-[11px] text-white/70">{value}</span>
      </span>
      <input
        type="range"
        min={def.min}
        max={def.max}
        step={def.step}
        value={value}
        onChange={(event) => onChange(def.key, Number(event.target.value))}
        className="mt-2 w-full accent-[#f23828]"
      />
    </label>
  );
}

/** Full-page singularity playground — tweak glow, disk, lensing, colors live. */
export function SingularityLabExperience() {
  const stageRef = useRef<HTMLElement>(null);
  const [params, setParams] = useState<SingularityParams>(DEFAULT_SINGULARITY_PARAMS);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const [panelOpen, setPanelOpen] = useState(true);

  const setNumber = useCallback((key: keyof SingularityParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setColor = useCallback((key: keyof SingularityParams, value: string) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setParams({ ...DEFAULT_SINGULARITY_PARAMS });
  }, []);

  const toggleSecondHole = useCallback(() => {
    setParams((prev) => ({
      ...prev,
      holeCount: prev.holeCount > 1 ? 1 : 2
    }));
  }, []);

  const copyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(params, null, 2));
    } catch {
      /* ignore */
    }
  }, [params]);

  const dualHoles = params.holeCount > 1;

  return (
    <section
      ref={stageRef}
      className="bh-hero bh-lab relative overflow-hidden border-0"
    >
      <BlackHoleLazy heroRef={stageRef} mode="lab" paramsRef={paramsRef} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-4 p-4 md:p-6">
        <div className="pointer-events-auto max-w-md rounded-sm border border-white/15 bg-black/55 px-4 py-3 backdrop-blur-md">
          <p className="archive-label text-[#f23828]">Singularity lab</p>
          <h1 className="mt-2 text-lg font-semibold tracking-tight text-[#f2efe6] md:text-xl">
            Tune the void.
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-white/60">
            Drag the singularity, orbit empty space, and live-edit bloom, disk shaders, lensing,
            and color. Add a second hole to watch them warp each other.
          </p>
        </div>

        <div className="pointer-events-auto flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={toggleSecondHole}
            className={`archive-label border px-4 py-2 backdrop-blur-md ${
              dualHoles
                ? 'border-[#f23828]/60 bg-[#f23828]/20 text-[#f2efe6]'
                : 'border-white/20 bg-black/55 text-white'
            }`}
          >
            {dualHoles ? 'Remove second hole' : 'Add second hole'}
          </button>
          <button
            type="button"
            onClick={() => setPanelOpen((open) => !open)}
            className="archive-label border border-white/20 bg-black/55 px-4 py-2 text-white backdrop-blur-md"
          >
            {panelOpen ? 'Hide controls' : 'Show controls'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="archive-label border border-white/20 bg-black/55 px-4 py-2 text-white backdrop-blur-md"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={copyJson}
            className="archive-label border border-white/20 bg-black/55 px-4 py-2 text-white backdrop-blur-md"
          >
            Copy JSON
          </button>
        </div>
      </div>

      {panelOpen ? (
        <aside className="absolute bottom-4 right-4 z-20 flex max-h-[min(70svh,34rem)] w-[min(100%-2rem,22rem)] flex-col overflow-hidden rounded-sm border border-white/15 bg-black/70 text-[#f2efe6] shadow-2xl backdrop-blur-md md:bottom-6 md:right-6">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="archive-label text-white/50">Parameters</p>
          </div>
          <div className="space-y-5 overflow-y-auto px-4 py-4">
            <div>
              <p className="archive-label mb-3 text-[#f23828]">Colors</p>
              <div className="grid grid-cols-2 gap-3">
                {COLORS.map((color) => (
                  <label key={color.key} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={String(params[color.key])}
                      onChange={(event) => setColor(color.key, event.target.value)}
                      className="h-8 w-8 cursor-pointer rounded-sm border border-white/20 bg-transparent"
                    />
                    <span className="archive-label text-white/55">{color.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="archive-label mb-3 text-[#f23828]">Glow &amp; lens</p>
              <div className="space-y-4">
                {SLIDERS.filter((item) =>
                  [
                    'bloomStrength',
                    'bloomRadius',
                    'bloomThreshold',
                    'lensingStrength',
                    'lensingRadius',
                    'chromaticAberration',
                    'exposure',
                    'fogDensity'
                  ].includes(item.key)
                ).map((def) => (
                  <ControlSlider
                    key={def.key}
                    def={def}
                    value={Number(params[def.key])}
                    onChange={setNumber}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="archive-label mb-3 text-[#f23828]">Disk shader</p>
              <div className="space-y-4">
                {SLIDERS.filter((item) =>
                  [
                    'diskDensity',
                    'flowSpeed',
                    'noiseScale',
                    'diskSpin',
                    'diskTiltDeg',
                    'diskBankDeg',
                    'timeScale'
                  ].includes(item.key)
                ).map((def) => (
                  <ControlSlider
                    key={def.key}
                    def={def}
                    value={Number(params[def.key])}
                    onChange={setNumber}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      ) : null}
    </section>
  );
}
