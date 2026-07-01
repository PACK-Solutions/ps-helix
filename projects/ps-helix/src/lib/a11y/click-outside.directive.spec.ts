import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PshClickOutsideDirective } from './click-outside.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button id="outside">Outside</button>
    <div id="host" pshClickOutside (pshClickOutside)="outsideClicks = outsideClicks + 1">
      <button id="inside">Inside</button>
    </div>
  `,
  imports: [PshClickOutsideDirective],
})
class TestHostComponent {
  outsideClicks = 0;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<span id="hd-host">x</span>`,
  hostDirectives: [PshClickOutsideDirective],
})
class HostDirectiveComponent {
  readonly clickOutside = inject(PshClickOutsideDirective);
  outsideClicks = 0;
  constructor() {
    this.clickOutside.pshClickOutside.subscribe(() => (this.outsideClicks += 1));
  }
}

describe('PshClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('emits when clicking outside the host', () => {
    (document.getElementById('outside') as HTMLElement).click();
    expect(host.outsideClicks).toBe(1);
  });

  it('does not emit when clicking inside the host', () => {
    (document.getElementById('inside') as HTMLElement).click();
    expect(host.outsideClicks).toBe(0);
  });

  it('stops emitting after destroy', () => {
    fixture.destroy();
    (document.getElementById('outside') as HTMLElement)?.click();
    expect(host.outsideClicks).toBe(0);
  });
});

describe('PshClickOutsideDirective as host directive', () => {
  let fixture: ComponentFixture<HostDirectiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostDirectiveComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostDirectiveComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.nativeElement.remove();
  });

  it('lets a component react to outside clicks via injection', () => {
    const outside = document.createElement('button');
    document.body.appendChild(outside);

    outside.click();

    expect(fixture.componentInstance.outsideClicks).toBe(1);
    outside.remove();
  });
});
