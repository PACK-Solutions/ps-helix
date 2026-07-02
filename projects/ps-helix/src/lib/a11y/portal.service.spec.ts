import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewContainerRef,
  inject,
  viewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshPortalService } from './portal.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<ng-template #tpl><div class="portal-panel">content</div></ng-template>`,
})
class HostComponent {
  readonly tpl = viewChild.required<TemplateRef<unknown>>('tpl');
  readonly vcr = inject(ViewContainerRef);
}

describe('PshPortalService', () => {
  let service: PshPortalService;
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let anchor: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HostComponent] });
    service = TestBed.inject(PshPortalService);
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    anchor = document.createElement('div');
    anchor.getBoundingClientRect = () =>
      ({
        top: 100,
        bottom: 120,
        left: 40,
        right: 240,
        width: 200,
        height: 20,
        x: 40,
        y: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    document.body.appendChild(anchor);
  });

  afterEach(() => anchor.remove());

  it('teleports the template into a body-level overlay layer', () => {
    const ref = service.attach(host.tpl(), host.vcr);

    const layer = document.querySelector('.psh-overlay-layer');
    expect(layer).toBeTruthy();
    expect(layer!.parentElement).toBe(document.body);
    expect(ref.panel.classList.contains('portal-panel')).toBe(true);
    expect(layer!.contains(ref.panel)).toBe(true);

    ref.detach();
  });

  it('positions the panel below the anchor as fixed', () => {
    const ref = service.attach(host.tpl(), host.vcr);

    ref.position(anchor, 'bottom', 8);

    expect(ref.panel.style.position).toBe('fixed');
    expect(ref.panel.style.left).toBe('40px');
    expect(ref.panel.style.width).toBe('200px');
    expect(ref.panel.style.top).toBe('128px'); // rect.bottom (120) + gap (8)

    ref.detach();
  });

  it('positions the panel above the anchor when side is top', () => {
    const ref = service.attach(host.tpl(), host.vcr);

    ref.position(anchor, 'top', 8);

    expect(ref.panel.style.position).toBe('fixed');
    // offsetHeight is 0 in jsdom → max(gap, rect.top - 0 - gap) = max(8, 92) = 92
    expect(ref.panel.style.top).toBe('92px');

    ref.detach();
  });

  it('keeps the layer until the last panel detaches, then removes it', () => {
    const a = service.attach(host.tpl(), host.vcr);
    const b = service.attach(host.tpl(), host.vcr);
    expect(document.querySelectorAll('.psh-overlay-layer').length).toBe(1);

    a.detach();
    expect(document.querySelector('.psh-overlay-layer')).toBeTruthy();

    b.detach();
    expect(document.querySelector('.psh-overlay-layer')).toBeFalsy();
  });
});
