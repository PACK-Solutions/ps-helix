import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-code-snippet',
  imports: [CommonModule],
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.css']
})
export class CodeSnippetComponent {
  code = input.required<string>();
  language = input<string>('html');

  copied = signal(false);

  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);

      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  }
}
