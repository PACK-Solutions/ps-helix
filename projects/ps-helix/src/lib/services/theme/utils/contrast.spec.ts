import {
  Rgb,
  bestTextColor,
  contrastRatio,
  hexToRgb,
  oklchToRgb,
  relativeLuminance,
  rgbToHex,
  rgbToOklch,
  shiftLightness,
  withLightness,
} from './color.utils';
import {
  WCAG_AAA_NORMAL,
  WCAG_AA_NORMAL,
  ensureContrast,
  targetRatio,
} from './wcag.utils';

/**
 * These two files carry the contrast promise `ACCESSIBILITY.md` makes, and neither had a test.
 *
 * `axe`'s own colour-contrast rule is disabled under jsdom — there is no layout to compute a
 * rendered colour from — so nothing in CI checked the arithmetic the theme derives a whole
 * palette with. The promise was resting on code nobody had exercised.
 */

const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const BLACK: Rgb = { r: 0, g: 0, b: 0 };

describe('colour arithmetic', () => {
  describe('hexToRgb', () => {
    it.each([
      ['#000000', BLACK],
      ['#FFFFFF', WHITE],
      ['#0B0191', { r: 11, g: 1, b: 145 }],
      ['0B0191', { r: 11, g: 1, b: 145 }],
      ['#fff', WHITE],
    ])('reads %s', (hex, expected) => {
      expect(hexToRgb(hex)).toEqual(expected);
    });

    it.each(['', 'nope', '#12', '#12345', 'rgb(0,0,0)'])('refuses %p', hex => {
      expect(hexToRgb(hex)).toBeNull();
    });
  });

  it('round-trips through hex', () => {
    for (const hex of ['#000000', '#ffffff', '#0b0191', '#7f3fbf']) {
      expect(rgbToHex(hexToRgb(hex)!)).toBe(hex);
    }
  });

  it('round-trips through OKLCH within a rounding error', () => {
    for (const rgb of [{ r: 11, g: 1, b: 145 }, { r: 200, g: 120, b: 40 }, { r: 12, g: 180, b: 90 }]) {
      const back = oklchToRgb(rgbToOklch(rgb));
      expect(Math.abs(back.r - rgb.r)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.g - rgb.g)).toBeLessThanOrEqual(2);
      expect(Math.abs(back.b - rgb.b)).toBeLessThanOrEqual(2);
    }
  });

  describe('contrastRatio', () => {
    it('is 21 for black on white, the maximum the formula allows', () => {
      expect(contrastRatio(BLACK, WHITE)).toBeCloseTo(21, 1);
    });

    it('is 1 for a colour against itself', () => {
      expect(contrastRatio(BLACK, BLACK)).toBeCloseTo(1, 5);
    });

    it('does not depend on the order of its arguments', () => {
      const a = { r: 11, g: 1, b: 145 };
      expect(contrastRatio(a, WHITE)).toBeCloseTo(contrastRatio(WHITE, a), 5);
    });
  });

  it('relativeLuminance puts white at 1 and black at 0', () => {
    expect(relativeLuminance(WHITE)).toBeCloseTo(1, 5);
    expect(relativeLuminance(BLACK)).toBeCloseTo(0, 5);
  });

  describe('bestTextColor', () => {
    it('picks the one that actually reads, on either extreme', () => {
      expect(contrastRatio(hexToRgb(bestTextColor(WHITE))!, WHITE)).toBeGreaterThan(
        WCAG_AA_NORMAL,
      );
      expect(contrastRatio(hexToRgb(bestTextColor(BLACK))!, BLACK)).toBeGreaterThan(
        WCAG_AA_NORMAL,
      );
    });

    it('clears AA against any background it is given', () => {
      for (let value = 0; value <= 255; value += 15) {
        const background = { r: value, g: value, b: value };
        const text = hexToRgb(bestTextColor(background))!;
        expect(contrastRatio(text, background)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
      }
    });
  });

  it('withLightness and shiftLightness stay inside the sRGB gamut', () => {
    const brand = { r: 11, g: 1, b: 145 };
    for (const l of [0, 0.25, 0.5, 0.75, 1]) {
      const out = withLightness(brand, l);
      for (const channel of [out.r, out.g, out.b]) {
        expect(channel).toBeGreaterThanOrEqual(0);
        expect(channel).toBeLessThanOrEqual(255);
      }
    }
    const lighter = shiftLightness(brand, 0.3);
    expect(relativeLuminance(lighter)).toBeGreaterThan(relativeLuminance(brand));
  });
});

describe('ensureContrast', () => {
  it('leaves a colour alone when it already passes', () => {
    const already = BLACK;
    expect(ensureContrast(already, WHITE, WCAG_AA_NORMAL)).toEqual(already);
  });

  it.each([
    ['AA', WCAG_AA_NORMAL],
    ['AAA', WCAG_AAA_NORMAL],
  ])('reaches the %s target against a light background', (_name, ratio) => {
    // A mid grey fails against white by a wide margin; this is the case the theme hits when
    // a customer's brand colour is too pale for its own text.
    const pale = { r: 170, g: 170, b: 170 };
    const fixed = ensureContrast(pale, WHITE, ratio);
    expect(contrastRatio(fixed, WHITE)).toBeGreaterThanOrEqual(ratio);
  });

  it('reaches the target against a dark background by going lighter', () => {
    const dark = { r: 20, g: 20, b: 25 };
    const tooClose = { r: 40, g: 40, b: 60 };
    const fixed = ensureContrast(tooClose, dark, WCAG_AA_NORMAL);

    expect(contrastRatio(fixed, dark)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    expect(relativeLuminance(fixed)).toBeGreaterThan(relativeLuminance(tooClose));
  });

  it('keeps the hue it was given, so a brand stays recognisable', () => {
    const brand = { r: 120, g: 120, b: 220 };
    const fixed = ensureContrast(brand, WHITE, WCAG_AAA_NORMAL);

    const before = rgbToOklch(brand).h;
    const after = rgbToOklch(fixed).h;
    // Signed difference on the hue circle: 0 means the two are the same colour family.
    // Only lightness moves, which is the whole design of `ensureContrast`.
    expect(Math.abs(((after - before + 540) % 360) - 180)).toBeLessThan(1);
  });

  it('returns its best attempt rather than nothing when the target is unreachable', () => {
    // Nothing reaches 21:1 against a mid grey. The theme still has to render something.
    const grey = { r: 128, g: 128, b: 128 };
    const fixed = ensureContrast({ r: 130, g: 130, b: 130 }, grey, 21);

    expect(fixed).toBeDefined();
    expect(contrastRatio(fixed, grey)).toBeGreaterThan(contrastRatio({ r: 130, g: 130, b: 130 }, grey));
  });

  it('targetRatio names the two levels the library offers', () => {
    expect(targetRatio('AA')).toBe(WCAG_AA_NORMAL);
    expect(targetRatio('AAA')).toBe(WCAG_AAA_NORMAL);
  });
});
