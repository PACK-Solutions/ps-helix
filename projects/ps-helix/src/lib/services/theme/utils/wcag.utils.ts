import {
  Rgb,
  contrastRatio,
  relativeLuminance,
  rgbToOklch,
  oklchToRgb,
} from './color.utils';

export const WCAG_AA_NORMAL = 4.5;
export const WCAG_AA_LARGE = 3;
export const WCAG_AAA_NORMAL = 7;
export const WCAG_AAA_LARGE = 4.5;

export type ContrastTarget = 'AA' | 'AAA';

export function targetRatio(target: ContrastTarget): number {
  return target === 'AAA' ? WCAG_AAA_NORMAL : WCAG_AA_NORMAL;
}

/**
 * Adjusts a color in OKLCH lightness until the contrast ratio against the
 * background meets or exceeds the target. Direction is chosen based on the
 * background (darken on light backgrounds, lighten on dark backgrounds).
 * Hue and chroma are preserved as much as possible.
 */
export function ensureContrast(color: Rgb, background: Rgb, ratio: number): Rgb {
  if (contrastRatio(color, background) >= ratio) {
    return color;
  }

  const backgroundLuminance = relativeLuminance(background);
  const { c, h } = rgbToOklch(color);
  const goLighter = backgroundLuminance < 0.5;

  let low = 0;
  let high = 1;
  let best: Rgb = color;
  let bestRatio = contrastRatio(color, background);

  for (let i = 0; i < 24; i++) {
    const mid = (low + high) / 2;
    const candidate = oklchToRgb({ l: mid, c, h });
    const candidateRatio = contrastRatio(candidate, background);

    if (candidateRatio >= ratio) {
      best = candidate;
      bestRatio = candidateRatio;
      if (goLighter) {
        high = mid;
      } else {
        low = mid;
      }
    } else {
      if (candidateRatio > bestRatio) {
        best = candidate;
        bestRatio = candidateRatio;
      }
      if (goLighter) {
        low = mid;
      } else {
        high = mid;
      }
    }
  }

  if (bestRatio < ratio) {
    const chromaReduced = oklchToRgb({
      l: goLighter ? 0.98 : 0.08,
      c: Math.min(c, 0.05),
      h,
    });
    if (contrastRatio(chromaReduced, background) > bestRatio) {
      return chromaReduced;
    }
  }

  return best;
}
