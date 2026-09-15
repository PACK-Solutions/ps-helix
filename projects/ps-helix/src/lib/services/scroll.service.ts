import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // providedIn: 'root' makes this effectively immortal in an application, but the
    // subscription still leaks wherever the root injector is recreated — tests, and
    // micro-frontends that bootstrap more than once. Every other subscription in the
    // library is torn down; this one was the exception.
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(),
    ).subscribe(() => {
      if (this.isBrowser) {
        this.document.defaultView?.scrollTo(0, 0);
      }
    });
  }
}
