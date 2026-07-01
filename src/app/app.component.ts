import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PshToastComponent } from '@lib/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, PshToastComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './app.component.html',
})
export class AppComponent {}
