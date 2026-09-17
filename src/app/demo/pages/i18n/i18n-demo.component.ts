import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { PshSelectComponent, PshModalComponent, PshButtonComponent } from '@lib/components';
import { PSH_FRENCH_DEFAULTS } from '@lib/i18n/french';

type Language = 'en' | 'fr';

/**
 * The page used to document `TRANSLATION_PROVIDER`, a wrapper around ngx-translate that no
 * component ever injected and that put the package in every consumer's dependency graph. It
 * was removed in 7.0.0; what replaced it is the configuration, so that is what this shows.
 */
@Component({
  selector: 'ds-i18n-demo',
  imports: [
    TranslateModule,
    DemoPageLayoutComponent,
    PshSelectComponent,
    PshModalComponent,
    PshButtonComponent,
  ],
  templateUrl: './i18n-demo.component.html',
  styleUrls: ['./i18n-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nDemoComponent {
  /** The language of the *library's* strings on this page, switched live below. */
  readonly language = signal<Language>('en');

  readonly modalOpen = signal(false);

  readonly options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Bravo' },
  ];

  /**
   * What the page binds to the components.
   *
   * A real application sets these once through `provideHelix({ components: … })` rather than
   * per element; the bindings are here so the two languages can sit side by side on one page.
   */
  readonly strings = computed(() => {
    const fr = this.language() === 'fr';
    return {
      selectPlaceholder: fr ? PSH_FRENCH_DEFAULTS.select!.placeholder : undefined,
      selectClear: fr ? PSH_FRENCH_DEFAULTS.select!.clearLabel : undefined,
      selectNoResults: fr ? PSH_FRENCH_DEFAULTS.select!.noResultsText : undefined,
      modalDismiss: fr ? PSH_FRENCH_DEFAULTS.modal!.dismissLabel : undefined,
      modalConfirm: fr ? PSH_FRENCH_DEFAULTS.modal!.confirmLabel : undefined,
      modalCancel: fr ? PSH_FRENCH_DEFAULTS.modal!.cancelLabel : undefined,
    } as Record<string, string | undefined>;
  });

  setLanguage(language: Language): void {
    this.language.set(language);
  }
}
