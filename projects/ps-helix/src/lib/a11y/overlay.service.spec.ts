import { TestBed } from '@angular/core/testing';
import { PshOverlayService } from './overlay.service';

describe('PshOverlayService', () => {
  let service: PshOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PshOverlayService);
  });

  it('assigns increasing z-indexes to stacked layers', () => {
    const a = service.push();
    const b = service.push();
    const c = service.push();

    expect(a.zIndex).toBeLessThan(b.zIndex);
    expect(b.zIndex).toBeLessThan(c.zIndex);
    expect(service.activeCount()).toBe(3);
  });

  it('reports the topmost layer', () => {
    const a = service.push();
    const b = service.push();

    expect(service.isTopmost(b.id)).toBe(true);
    expect(service.isTopmost(a.id)).toBe(false);

    service.remove(b.id);
    expect(service.isTopmost(a.id)).toBe(true);
    expect(service.activeCount()).toBe(1);
  });

  it('gives each layer a distinct id and z-index', () => {
    const a = service.push();
    const b = service.push();
    expect(a.id).not.toBe(b.id);
    expect(a.zIndex).not.toBe(b.zIndex);
  });

  it('resets the z-index sequence once every layer is released (bounded values)', () => {
    const a = service.push();
    const b = service.push();
    service.remove(a.id);
    service.remove(b.id);
    expect(service.activeCount()).toBe(0);

    // After a full release, a fresh layer starts back at the base z-index.
    const c = service.push();
    expect(c.zIndex).toBe(a.zIndex);
  });

  it('removing an unknown id is a no-op', () => {
    const a = service.push();
    service.remove(9999);
    expect(service.activeCount()).toBe(1);
    expect(service.isTopmost(a.id)).toBe(true);
  });
});
