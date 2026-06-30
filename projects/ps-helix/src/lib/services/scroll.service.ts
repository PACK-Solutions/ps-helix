import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(private router: Router) {
    // Subscribe to router events
    this.router.events.pipe(
      // Filter only NavigationEnd events
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset scroll position (browser only)
      if (this.isBrowser) {
        this.document.defaultView?.scrollTo(0, 0);
      }
    });
  }
}
