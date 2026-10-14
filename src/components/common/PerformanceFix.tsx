'use client';

// Protect against Turbopack/React negative timestamp exceptions during navigation profiling
if (typeof window !== 'undefined' && window.performance && typeof window.performance.measure === 'function') {
  const origMeasure = window.performance.measure.bind(window.performance);
  window.performance.measure = function (
    name: string,
    startOrMeasureOptions?: string | PerformanceMeasureOptions,
    endMark?: string
  ) {
    try {
      return origMeasure(name, startOrMeasureOptions as any, endMark as any);
    } catch {
      return undefined as any;
    }
  };
}

export function PerformanceFix() {
  return null;
}
