export interface Rgb {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type WcagLevel = 'AAA' | 'AA' | 'AA Large' | 'Fail';

const HEX_SHORT = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONG = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const RGB_FN = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i;

export function parseColor(input: string): Rgb | null {
  if (!input) return null;
  const value = input.trim();

  const long = HEX_LONG.exec(value);
  if (long) {
    return {
      r: parseInt(long[1]!, 16),
      g: parseInt(long[2]!, 16),
      b: parseInt(long[3]!, 16),
      a: 1,
    };
  }
  const short = HEX_SHORT.exec(value);
  if (short) {
    const r = short[1]!;
    const g = short[2]!;
    const b = short[3]!;
    return {
      r: parseInt(r + r, 16),
      g: parseInt(g + g, 16),
      b: parseInt(b + b, 16),
      a: 1,
    };
  }
  const fn = RGB_FN.exec(value);
  if (fn) {
    return {
      r: Number(fn[1]),
      g: Number(fn[2]),
      b: Number(fn[3]),
      a: fn[4] !== undefined ? Number(fn[4]) : 1,
    };
  }
  return null;
}

export function compositeOver(fg: Rgb, bg: Rgb): Rgb {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
    a,
  };
}

function channel(value: number): number {
  const v = value / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function relativeLuminance(rgb: Rgb): number {
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(fg: Rgb, bg: Rgb): number {
  const opaqueFg = fg.a < 1 ? compositeOver(fg, { ...bg, a: 1 }) : fg;
  const l1 = relativeLuminance(opaqueFg);
  const l2 = relativeLuminance(bg);
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (lighter + 0.05) / (darker + 0.05);
}

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

export function resolveCssVariable(name: string, element?: Element): string {
  const target = element ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}
