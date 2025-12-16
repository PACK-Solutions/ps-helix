import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  constructor(private router: Router) {
    // Subscribe to router events
    this.router.events.pipe(
      // Filter only NavigationEnd events
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Reset scroll position
      window.scrollTo(0, 0);
    });
  }
}