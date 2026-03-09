import { Component, input, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ds-code-snippet',
  imports: [],
  templateUrl: './code-snippet.component.html',
  styleUrls: ['./code-snippet.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
