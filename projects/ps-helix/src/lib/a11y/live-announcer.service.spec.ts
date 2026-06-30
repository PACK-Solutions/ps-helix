import { TestBed } from '@angular/core/testing';
import { PshLiveAnnouncerService } from './live-announcer.service';

describe('PshLiveAnnouncerService', () => {
  let service: PshLiveAnnouncerService;

  const politeRegion = () =>
    document.body.querySelector('[aria-live="polite"].psh-live-announcer') as HTMLElement | null;
  const assertiveRegion = () =>
    document.body.querySelector('[aria-live="assertive"].psh-live-announcer') as HTMLElement | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PshLiveAnnouncerService);
  });

  afterEach(() => {
    document.body
      .querySelectorAll('.psh-live-announcer')
      .forEach(el => el.remove());
  });

  it('lazily creates a polite live region and announces the message', () => {
    expect(politeRegion()).toBeNull();

    service.announce('3 results found');

    const region = politeRegion();
    expect(region).toBeTruthy();
    expect(region?.getAttribute('aria-live')).toBe('polite');
    expect(region?.getAttribute('aria-atomic')).toBe('true');
    expect(region?.getAttribute('role')).toBe('status');
    expect(region?.textContent).toBe('3 results found');
  });

  it('uses a separate assertive region with role="alert"', () => {
    service.announce('Save failed', 'assertive');

    const region = assertiveRegion();
    expect(region).toBeTruthy();
    expect(region?.getAttribute('role')).toBe('alert');
    expect(region?.textContent).toBe('Save failed');
    // polite region is not created unless used
    expect(politeRegion()).toBeNull();
  });

  it('reuses the same region across announcements', () => {
    service.announce('first');
    const region = politeRegion();
    service.announce('second');

    expect(politeRegion()).toBe(region);
    expect(region?.textContent).toBe('second');
  });

  it('clears the live regions', () => {
    service.announce('hello');
    service.announce('urgent', 'assertive');

    service.clear();

    expect(politeRegion()?.textContent).toBe('');
    expect(assertiveRegion()?.textContent).toBe('');
  });

  it('is visually hidden but present in the DOM', () => {
    service.announce('hidden message');
    const region = politeRegion();
    const style = region?.getAttribute('style') ?? '';
    expect(style).toContain('position:absolute');
    expect(style).toContain('width:1px');
  });
});
