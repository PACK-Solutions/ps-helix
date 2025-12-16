import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '@lib/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterModule, ToastComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}