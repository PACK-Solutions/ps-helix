import { TestBed } from '@angular/core/testing';
import { PshOverlayPositionService } from './overlay-position.service';

function anchorAt(rect: Partial<DOMRect>): HTMLElement {
  const el = document.createElement('div');
  el.getBoundingClientRect = () =>
    ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
      ...rect,
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
});
