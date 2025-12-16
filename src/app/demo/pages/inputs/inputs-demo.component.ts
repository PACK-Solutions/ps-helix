import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshInputComponent } from '@lib/components/input/input.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-inputs-demo',
  imports: [TranslateModule, PshInputComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './inputs-demo.component.html',
  styleUrls: ['./inputs-demo.component.css'],
})
export class InputsDemoComponent {
  emailValue = '';
  phoneValue = '';
  searchValue = '';
  passwordValue = '';

  cities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice',
    'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
    'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre',
    'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'
  ];

  handleCitySelect(city: string) {
    console.log('City selected:', city);
  }

  outlinedVariantCode = `<psh-input
  variant="outlined"
  placeholder="Entrez votre texte"
>
  <span input-label>Label</span>
</psh-input>`;

  filledVariantCode = `<psh-input
  variant="filled"
  placeholder="Entrez votre texte"
>
  <span input-label>Label</span>
</psh-input>`;

  statesCode = `<psh-input
  [disabled]="isSubmitting"
  [loading]="isValidating"
  [error]="errorMessage"
  [success]="successMessage"
>
  <span input-label>Email</span>
</psh-input>`;

  autocompleteCode = `// Suggestions statiques
<psh-input
  [suggestions]="cities"
/>

// Suggestions dynamiques
fetchCities = (query: string) => {
  return this.api.searchCities(query);
};

<psh-input
  [suggestions]="fetchCities"
  [autocompleteConfig]="{
    minLength: 2,
    debounceTime: 300
  }"
/>`;

  fetchCities = async (query: string): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.cities.filter(city =>
      city.toLowerCase().includes(query.toLowerCase())
    );
  };
}
