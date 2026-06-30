import { TestBed } from '@angular/core/testing';
import { PshOverlayPositionService } from './overlay-position.service';

function anchorAt(rect: Partial<DOMRect>): HTMLElement {
  const top = rect.top ?? 0;
  const bottom = rect.bottom ?? 0;
  const left = rect.left ?? 0;
  const right = rect.right ?? 0;
  const el = document.createElement('div');
  el.getBoundingClientRect = () =>
    ({
      top,
      bottom,
      left,
      right,
      width: rect.width ?? right - left,
      height: rect.height ?? bottom - top,
      x: left,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect;
  return el;
}

describe('PshOverlayPositionService', () => {
  let service: PshOverlayPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PshOverlayPositionService);
    Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 768, configurable: true });
  });

  it('keeps the preferred side when there is enough room', () => {
    const anchor = anchorAt({ top: 400, bottom: 420, left: 400, right: 500 });
    expect(service.flipSide(anchor, 'bottom', { overlayHeight: 100 })).toBe('bottom');
    expect(service.flipSide(anchor, 'top', { overlayHeight: 100 })).toBe('top');
  });

  it('flips bottom -> top when there is no room below', () => {
    const anchor = anchorAt({ top: 740, bottom: 760 }); // 8px below the anchor
    expect(service.flipSide(anchor, 'bottom', { overlayHeight: 240 })).toBe('top');
  });

  it('flips top -> bottom when there is no room above', () => {
    const anchor = anchorAt({ top: 8, bottom: 28 });
    expect(service.flipSide(anchor, 'top', { overlayHeight: 240 })).toBe('bottom');
  });

  it('flips right -> left when there is no room on the right', () => {
    const anchor = anchorAt({ left: 1000, right: 1018, top: 400, bottom: 420 });
    expect(service.flipSide(anchor, 'right', { overlayWidth: 200 })).toBe('left');
  });

  it('does not flip when neither side has more room (keeps preferred)', () => {
    const anchor = anchorAt({ top: 740, bottom: 760 });
    // Tiny overlay fits below, so no flip.
    expect(service.flipSide(anchor, 'bottom', { overlayHeight: 0, offset: 0 })).toBe('bottom');
  });

  it('flipPlacement flips the side and preserves the alignment', () => {
    const anchor = anchorAt({ top: 740, bottom: 760, left: 100, right: 200 });
    expect(service.flipPlacement(anchor, 'bottom-start', { overlayHeight: 240 })).toBe('top-start');
  });

  it('flipPlacement keeps a simple side placement format', () => {
    const anchor = anchorAt({ top: 400, bottom: 420 });
    expect(service.flipPlacement(anchor, 'bottom', { overlayHeight: 100 })).toBe('bottom');
  });

  it('returns unknown placements unchanged', () => {
    const anchor = anchorAt({ top: 400, bottom: 420 });
    expect(service.flipPlacement(anchor, 'weird-thing')).toBe('weird-thing');
  });

  it('does not flip against an unrendered (zero-size) anchor', () => {
    const anchor = anchorAt({}); // all-zero rect (e.g. not laid out / SSR / jsdom)
    expect(service.flipSide(anchor, 'top', { overlayHeight: 240 })).toBe('top');
    expect(service.flipPlacement(anchor, 'top-start', { overlayHeight: 240 })).toBe('top-start');
  });
});
