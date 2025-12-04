export function getSafeAreaInsetBottom(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue('--safe-area-inset-bottom')
    .trim();
  // raw viene como "20px" o "" — parseFloat devuelve NaN si no hay valor
  const px = parseFloat(raw || '0');
  return Number.isFinite(px) ? px : 0;
}