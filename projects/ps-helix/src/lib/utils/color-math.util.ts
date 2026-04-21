import { contrastRatio, parseColor, type Rgb } from './contrast.util';

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function rgbToHex(r: number, g: number, b: number): string {
  const to = (x: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(x)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;
  if (hp >= 0 && hp < 1) { r1 = c; g1 = x; }
  else if (hp < 2) { r1 = x; g1 = c; }
  else if (hp < 3) { g1 = c; b1 = x; }
  else if (hp < 4) { g1 = x; b1 = c; }
  else if (hp < 5) { r1 = x; b1 = c; }
  else { r1 = c; b1 = x; }
  const m = ln - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
    a: 1,
  };
}

export function hexToHsl(hex: string): Hsl | null {
  const rgb = parseColor(hex);
  return rgb ? rgbToHsl(rgb) : null;
}

export function hslToHex(hsl: Hsl): string {
  const { r, g, b } = hslToRgb(hsl);
  return rgbToHex(r, g, b);
}

/**
 * Returns a new hex color with lightness shifted by `delta` percentage points,
 * clamped to [0, 100]. Positive values lighten, negative darken. HSL-based so
 * the hue/saturation of the brand are preserved.
 */
export function deriveVariant(hex: string, delta: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return hex;
  const next: Hsl = { ...hsl, l: Math.max(0, Math.min(100, hsl.l + delta)) };
  return hslToHex(next);
}

export type AdjustDirection = 'lighten' | 'darken';

export interface AdjustResult {
  hex: string;
  ratio: number;
  iterations: number;
  converged: boolean;
}

/**
 * Iteratively shifts lightness of `hex` toward `direction` until the contrast
 * ratio against `backgroundHex` reaches `targetRatio`. Returns the closest
 * value achievable within MAX_ITERATIONS (the original color if already
 * compliant).
 */
export function adjustLightnessForContrast(
  hex: string,
  backgroundHex: string,
  targetRatio: number,
  direction: AdjustDirection,
): AdjustResult {
  const bg = parseColor(backgroundHex);
  const fg = parseColor(hex);
  if (!bg || !fg) {
    return { hex, ratio: 0, iterations: 0, converged: false };
  }
  const initialRatio = contrastRatio(fg, bg);
  if (initialRatio >= targetRatio) {
    return { hex, ratio: initialRatio, iterations: 0, converged: true };
  }
  const hsl = rgbToHsl(fg);
  const step = direction === 'lighten' ? 2 : -2;
  const limit = direction === 'lighten' ? 100 : 0;
  let currentL = hsl.l;
  let bestHex = hex;
  let bestRatio = initialRatio;

  for (let i = 1; i <= 50; i++) {
    currentL += step;
    if ((direction === 'lighten' && currentL > limit) || (direction === 'darken' && currentL < limit)) {
      currentL = limit;
    }
    const nextHex = hslToHex({ ...hsl, l: currentL });
    const nextFg = parseColor(nextHex);
    if (!nextFg) break;
    const ratio = contrastRatio(nextFg, bg);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestHex = nextHex;
    }
    if (ratio >= targetRatio) {
      return { hex: nextHex, ratio, iterations: i, converged: true };
    }
    if (currentL === limit) break;
  }
  return { hex: bestHex, ratio: bestRatio, iterations: 50, converged: false };
}

/**
 * Chooses the candidate color producing the highest contrast ratio against
 * `backgroundHex`. Defaults mirror our dark-convention text tokens.
 */
export function pickReadableText(
  backgroundHex: string,
  candidates: readonly string[] = ['#0A0D16', '#FFFFFF'],
): { hex: string; ratio: number } {
  const bg = parseColor(backgroundHex);
  if (!bg) return { hex: candidates[0] ?? '#000000', ratio: 0 };
  let bestHex = candidates[0] ?? '#000000';
  let bestRatio = 0;
  for (const candidate of candidates) {
    const rgb = parseColor(candidate);
    if (!rgb) continue;
    const ratio = contrastRatio(rgb, bg);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      bestHex = candidate;
    }
  }
  return { hex: bestHex, ratio: bestRatio };
}
