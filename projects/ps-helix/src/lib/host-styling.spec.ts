import { ChangeDetectionStrategy, Component, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PshCardComponent } from './components/card/card.component';
import { PshHorizontalCardComponent } from './components/horizontal-card/horizontal-card.component';
import { PshInfoCardComponent } from './components/info-card/info-card.component';
import { PshStatCardComponent } from './components/stat-card/stat-card.component';

/**
 * The four card components used to render a wrapper `<div>` that carried every class the
 * library set. A consumer's `<psh-card class="…">` landed on the host, one level above — so
 * the components grew `cssClass` and `customStyle` inputs to hand it back down. That is the
 * whole reason those inputs existed, and it is why exactly these four had them.
 *
 * In 7.0.0 the card *is* the host, and `class` and `style` reach it the way they reach any
 * element. The passthrough inputs are gone.
 *
 * Removing an escape hatch is only honest if what replaces it is checked, so this file checks
 * it — once, for all four, because it is one contract and four copies would document it
 * worse.
 */

@Component({
  selector: 'psh-host-styling-fixture',
  imports: [
    PshCardComponent,
    PshHorizontalCardComponent,
    PshInfoCardComponent,
    PshStatCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- The literal style attribute is the contract under test: a consumer must be able to
         style the host element directly, which is what removing the inner wrapper bought. -->
    <!-- eslint-disable @angular-eslint/template/no-inline-styles -->
    <psh-card class="mine one two" style="background-color: red" appearance="elevated" />
    <psh-horizontal-card class="mine one two" style="background-color: red" appearance="elevated" />
    <psh-info-card [data]="[]" class="mine one two" style="background-color: red" appearance="elevated" />
    <psh-stat-card class="mine one two" style="background-color: red" appearance="elevated" />
  `,
})
class HostStylingFixtureComponent {}

interface Case {
  readonly selector: string;
  readonly component: Type<unknown>;
  /** The class the library puts on the host, which the consumer's must not displace. */
  readonly ownClass: string;
}

const CASES: readonly Case[] = [
  { selector: 'psh-card', component: PshCardComponent, ownClass: 'psh-card' },
  {
    selector: 'psh-horizontal-card',
    component: PshHorizontalCardComponent,
    ownClass: 'psh-horizontal-card',
  },
  { selector: 'psh-info-card', component: PshInfoCardComponent, ownClass: 'psh-info-card' },
  { selector: 'psh-stat-card', component: PshStatCardComponent, ownClass: 'psh-stat-card' },
];

describe('cards are styled through their host element', () => {
  let root: HTMLElement;

  beforeEach(() => {
    const fixture = TestBed.createComponent(HostStylingFixtureComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  for (const { selector, ownClass } of CASES) {
    describe(selector, () => {
      let host: HTMLElement;

      beforeEach(() => {
        host = root.querySelector(selector) as HTMLElement;
        expect(host).toBeTruthy();
      });

      it("keeps the consumer's classes", () => {
        expect(host.className).toContain('mine');
        expect(host.className).toContain('one');
        expect(host.className).toContain('two');
      });

      it("does not lose its own classes to the consumer's", () => {
        expect(host.className).toContain(ownClass);
        expect(host.className).toContain('psh-appearance-elevated');
      });

      it("applies the consumer's inline style to the card itself", () => {
        expect(host.style.backgroundColor).toBe('red');
      });

      it('renders no wrapper element carrying its own root class', () => {
        // The wrapper is what made `cssClass` necessary. If one comes back, so does the
        // problem — silently, because everything else keeps working.
        //
        // `classList.contains`, not an equality check on `className`: a restored wrapper
        // would carry `psh-card psh-appearance-flat …`, which never equals `psh-card`, so an
        // equality check would pass no matter what and assert nothing.
        for (const el of Array.from(host.querySelectorAll(`.${ownClass}`))) {
          expect(el).toBe(host); // only the host itself may carry it
        }
        expect(host.classList.contains(ownClass)).toBe(true);
      });
    });
  }

  it('exposes no class or style passthrough input any more', () => {
    for (const { component } of CASES) {
      const inputs = Object.keys(TestBed.createComponent(component).componentInstance as object);
      expect(inputs).not.toContain('cssClass');
      expect(inputs).not.toContain('customStyle');
    }
  });
});
