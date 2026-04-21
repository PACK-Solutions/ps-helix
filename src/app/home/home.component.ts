import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ds-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('pageExit', [
      state('visible', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.95)'
      })),
      transition('visible => hidden', [
        animate('600ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ])
    ])
  ]
})
export class HomeComponent {
  private router = inject(Router);
  isLeaving = signal(false);

  handleNavigation(): void {
    this.isLeaving.set(true);

    setTimeout(() => {
      this.router.navigate(['/demo/introduction']);
    }, 600);
  }
}