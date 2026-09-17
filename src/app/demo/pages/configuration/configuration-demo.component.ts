import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { PshButtonComponent, PshTagComponent, PshSelectComponent } from '@lib/components';
import type { PshComponentDefaults } from '@lib/provide-helix';

type Preset = 'library' | 'compact' | 'french';

/**
 * `provideHelix()` is new in 7.0.0 and nothing in the demo showed it. The library had
 * twenty-two injection tokens and a single `provide*` function, so configuring it meant
 * importing tokens by name that no document listed.
 */
@Component({
  selector: 'ds-configuration-demo',
  imports: [
    TranslateModule,
    DemoPageLayoutComponent,
    PshButtonComponent,
    PshTagComponent,
    PshSelectComponent,
  ],
  templateUrl: './configuration-demo.component.html',
  styleUrls: ['./configuration-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationDemoComponent {
  readonly preset = signal<Preset>('library');

  readonly options = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Bravo' },
  ];

  /**
   * What each preset would be given to `provideHelix({ components: … })`.
   *
   * A page cannot re-bootstrap the application to show that, so the same values are bound to
   * the elements below. In an application this is one call, and none of these attributes.
   */
  private readonly presets: Record<Preset, PshComponentDefaults> = {
    library: {},
    compact: {
      button: { size: 'small', appearance: 'outline' },
      tag: { size: 'small' },
      select: { size: 'small' },
    },
    french: {
      button: { size: 'medium', loadingText: 'Chargement…' },
      select: { placeholder: 'Sélectionner une option', clearLabel: 'Effacer la sélection' },
    },
  };

  readonly applied = computed(() => this.presets[this.preset()]);

  readonly snippet = computed(() => {
    const defaults = this.applied();
    if (Object.keys(defaults).length === 0) {
      return 'provideHelix()   // les défauts de la bibliothèque';
    }
    const body = JSON.stringify(defaults, null, 2)
      .replace(/"([^"]+)":/g, '$1:')
      .replace(/"/g, "'");
    return `provideHelix({\n  components: ${body},\n})`;
  });

  setPreset(preset: Preset): void {
    this.preset.set(preset);
  }
}
