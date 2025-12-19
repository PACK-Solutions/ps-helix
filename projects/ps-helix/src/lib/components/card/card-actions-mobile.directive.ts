import {
  AfterContentInit,
  ContentChildren,
  Directive,
  effect,
  OnDestroy,
  QueryList,
  signal
} from '@angular/core';
import { PshButtonComponent } from '../button/button.component';

@Directive({
  selector: '[card-actions]'
})
export class CardActionsMobileDirective implements AfterContentInit, OnDestroy {
  @ContentChildren(PshButtonComponent, { descendants: true })
  buttons!: QueryList<PshButtonComponent>;

  private isMobile = signal(false);
  private mediaQuery!: MediaQueryList;
  private mediaQueryListener!: (e: MediaQueryListEvent) => void;

  constructor() {
    effect(() => {
      const mobile = this.isMobile();
      this.buttons?.forEach(button => {
        button.fullWidth.set(mobile);
      });
    });
  }

  ngAfterContentInit(): void {
    this.mediaQuery = window.matchMedia('(max-width: 640px)');
    this.isMobile.set(this.mediaQuery.matches);

    this.mediaQueryListener = (e: MediaQueryListEvent) => {
      this.isMobile.set(e.matches);
    };

    this.mediaQuery.addEventListener('change', this.mediaQueryListener);

    this.buttons.changes.subscribe(() => {
      const mobile = this.isMobile();
      this.buttons.forEach(button => {
        button.fullWidth.set(mobile);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryListener) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryListener);
    }
  }
}
