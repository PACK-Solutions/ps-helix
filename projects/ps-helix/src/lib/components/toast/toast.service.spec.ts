import { TestBed } from '@angular/core/testing';

import { PshToastService } from './toast.service';
import { TOAST_CONFIG } from './toast.tokens';
import { resetPshUniqueIdForTesting } from '../../utils/unique-id';

/**
 * `psh-toast` is the one component with no inputs at all: everything goes through this
 * service, so the service *is* its API — and it had no test of its own, only the component's.
 */
describe('PshToastService', () => {
  let service: PshToastService;

  beforeEach(() => {
    resetPshUniqueIdForTesting();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    service = TestBed.inject(PshToastService);
  });

  it('starts empty', () => {
    expect(service.toasts()).toEqual([]);
  });

  it('returns the id it assigned, so a caller can dismiss its own toast', () => {
    const id = service.info('Saved');

    expect(id).toBeTruthy();
    expect(service.toasts()).toHaveLength(1);
    expect(service.toasts()[0]!.id).toBe(id);

    service.remove(id);
    expect(service.toasts()).toEqual([]);
  });

  it('gives two toasts two different ids', () => {
    const first = service.info('One');
    const second = service.info('Two');

    expect(first).not.toBe(second);
  });

  it.each([
    ['info', 'info'],
    ['success', 'success'],
    ['warning', 'warning'],
    ['error', 'danger'],
    ['danger', 'danger'],
  ] as const)('%s() raises a %s toast', (method, color) => {
    service[method]('Message');
    expect(service.toasts()[0]!.color).toBe(color);
  });

  it('keeps the newest when the queue is full, dropping from the front', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: TOAST_CONFIG, useValue: { maxToasts: 2 } }],
    });
    const limited = TestBed.inject(PshToastService);

    limited.info('One');
    limited.info('Two');
    limited.info('Three');

    expect(limited.toasts().map(t => t.message)).toEqual(['Two', 'Three']);
  });

  it('takes its duration from the configuration, and a call overrides it', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: TOAST_CONFIG, useValue: { duration: 1234 } }],
    });
    const configured = TestBed.inject(PshToastService);

    configured.info('Default');
    configured.info('Explicit', { duration: 10 });

    expect(configured.toasts()[0]!.duration).toBe(1234);
    expect(configured.toasts()[1]!.duration).toBe(10);
  });

  it('treats duration 0 as "stay", not as "missing"', () => {
    // `?? ` rather than `||`: a toast a user has to dismiss is a real thing to ask for, and
    // `||` would have silently replaced it with the default.
    service.info('Sticky', { duration: 0 });
    expect(service.toasts()[0]!.duration).toBe(0);
  });

  it('removing an id that is not there changes nothing', () => {
    service.info('One');
    service.remove('psh-toast-does-not-exist');

    expect(service.toasts()).toHaveLength(1);
  });
});
