import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshSelectComponent } from '@lib/components/select/select.component';
import { PshButtonComponent } from '@lib/components/button/button.component';
import { SelectOption, SelectOptionGroup } from '@lib/components/select/select.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-select-demo',
  imports: [TranslateModule, PshSelectComponent, PshButtonComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './select-demo.component.html',
  styleUrls: ['./select-demo.component.css']
})
export class SelectDemoComponent {
  selectedBasic: string | null = null;
  selectedCountry: string | null = null;
  selectedLanguages: string[] = [];
  selectedFruit: string | null = null;
  selectedSize: string | null = 'medium';
  selectedDisabled: string | null = null;
  selectedError: string | null = null;
  selectedSuccess: string | null = 'email';
  isLoading = false;

  basicOptions: SelectOption<string>[] = [
    { label: 'Option 1', value: '1', icon: 'star' },
    { label: 'Option 2', value: '2', icon: 'heart' },
    { label: 'Option 3', value: '3', icon: 'sparkle' },
    { label: 'Option 4', value: '4', icon: 'crown' }
  ];

  fruitOptions: SelectOption<string>[] = [
    { label: 'Pomme', value: 'apple', icon: 'apple-logo' },
    { label: 'Banane', value: 'banana', icon: 'sun' },
    { label: 'Orange', value: 'orange', icon: 'circle' },
    { label: 'Fraise', value: 'strawberry', icon: 'heart' },
    { label: 'Raisin', value: 'grape', icon: 'circles-three' }
  ];

  countryOptions: SelectOption<string>[] = [
    { label: 'France', value: 'FR', icon: 'flag', description: 'République Française' },
    { label: 'Allemagne', value: 'DE', icon: 'flag', description: 'République Fédérale d\'Allemagne' },
    { label: 'Italie', value: 'IT', icon: 'flag', description: 'République Italienne' },
    { label: 'Espagne', value: 'ES', icon: 'flag', description: 'Royaume d\'Espagne' },
    { label: 'Royaume-Uni', value: 'UK', icon: 'flag', description: 'Royaume-Uni de Grande-Bretagne' },
    { label: 'Belgique', value: 'BE', icon: 'flag', description: 'Royaume de Belgique' },
    { label: 'Suisse', value: 'CH', icon: 'flag', description: 'Confédération Suisse' },
    { label: 'Portugal', value: 'PT', icon: 'flag', description: 'République Portugaise' }
  ];

  languageOptions: SelectOption<string>[] = [
    { label: 'JavaScript', value: 'js', icon: 'code', description: 'Langage web populaire' },
    { label: 'TypeScript', value: 'ts', icon: 'code', description: 'JavaScript avec typage' },
    { label: 'Python', value: 'py', icon: 'code', description: 'Langage polyvalent' },
    { label: 'Java', value: 'java', icon: 'code', description: 'Langage orienté objet' },
    { label: 'C#', value: 'cs', icon: 'code', description: 'Langage Microsoft' },
    { label: 'Go', value: 'go', icon: 'code', description: 'Langage de Google' },
    { label: 'Rust', value: 'rust', icon: 'code', description: 'Langage système moderne' },
    { label: 'PHP', value: 'php', icon: 'code', description: 'Langage serveur' }
  ];

  sizeOptions: SelectOption<string>[] = [
    { label: 'Petit', value: 'small', icon: 'circle', description: '32px de hauteur' },
    { label: 'Moyen', value: 'medium', icon: 'circle', description: '40px de hauteur' },
    { label: 'Grand', value: 'large', icon: 'circle', description: '48px de hauteur' }
  ];

  contactOptions: SelectOption<string>[] = [
    { label: 'Email', value: 'email', icon: 'envelope', description: 'contact@exemple.fr' },
    { label: 'Téléphone', value: 'phone', icon: 'phone', description: '+33 1 23 45 67 89' },
    { label: 'Chat', value: 'chat', icon: 'chat-circle', description: 'Support en ligne' }
  ];

  groupedOptions: SelectOptionGroup<string>[] = [
    {
      label: 'Fruits',
      options: [
        { label: 'Pomme', value: 'apple', icon: 'apple-logo' },
        { label: 'Banane', value: 'banana', icon: 'sun' },
        { label: 'Orange', value: 'orange', icon: 'circle' }
      ]
    },
    {
      label: 'Légumes',
      options: [
        { label: 'Carotte', value: 'carrot', icon: 'carrot' },
        { label: 'Tomate', value: 'tomato', icon: 'circle' },
        { label: 'Salade', value: 'lettuce', icon: 'leaf' }
      ]
    }
  ];

  handleSearch(term: string): void {
    console.log('Searching for:', term);
  }

  handleChange(value: any): void {
    console.log('Value changed:', value);
  }

  handleOpen(): void {
    console.log('Select opened');
  }

  handleClose(): void {
    console.log('Select closed');
  }

  basicSelectCode = `<psh-select
  [options]="options"
  [(value)]="selected"
  placeholder="Choisir"
  [clearable]="true"
>
  <span select-hint>Texte d'aide</span>
</psh-select>`;

  searchableSelectCode = `<psh-select
  [options]="options"
  [searchable]="true"
  (searched)="handleSearch($event)"
></psh-select>`;

  multipleSelectCode = `<psh-select
  [options]="options"
  [multiple]="true"
  [(value)]="selectedArray"
></psh-select>`;

  selectStatesCode = `<psh-select
  [options]="options"
  [disabled]="isSubmitting"
  [loading]="isLoading"
  error="Message d'erreur"
  success="Message de succès"
/>`;

  optionsWithDescriptionsCode = `options = [
  {
    label: 'France',
    value: 'FR',
    icon: 'flag',
    description: 'République Française'
  }
];`;

  optionsWithIconsCode = `options = [
  {
    label: 'Option 1',
    value: '1',
    icon: 'star'
  }
];`;

  groupedOptionsCode = `groups = [
  {
    label: 'Fruits',
    options: [...]
  },
  {
    label: 'Légumes',
    options: [...]
  }
];`;

  defaultWidthCode = `<psh-select
  [options]="options"
  placeholder="Standard"
/>`;

  fullWidthCode = `<psh-select
  [options]="options"
  [fullWidth]="true"
/>`;

  simulateLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}