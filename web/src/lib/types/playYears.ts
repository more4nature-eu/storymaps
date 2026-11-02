import type maplibregl from 'maplibre-gl';
import type { ChapterAnimation } from '$lib/types/playYears';

export function playYears(
  map: maplibregl.Map,
  { layerId, from, to, duration, delay = 1800 }: ChapterAnimation,
  onYear: (y: number) => void
) {
  const interval = duration / (to - from + 1);
  let year = from;
  let timer: ReturnType<typeof setInterval> | undefined;

  const setYear = (y: number) => {
    if (!map.getLayer(layerId)) return false;
    map.setFilter(layerId, ['<=', ['get', 'DN'], y - 2000]);
    onYear(y);
    return true;
  };

  const start = setTimeout(() => {
    timer = setInterval(() => {
      if (!setYear(year)) return; // espera que la capa existeixi
      if (year >= to) return clearInterval(timer);
      year++;
    }, interval);
  }, delay);

  return () => {
    clearTimeout(start);
    clearInterval(timer);
  };
}

export function resetYears(map: maplibregl.Map, layerId: string, showAll = false) {
  if (map.getLayer(layerId)) map.setFilter(layerId, ['<=', ['get', 'DN'], showAll ? 25 : 0]);
}