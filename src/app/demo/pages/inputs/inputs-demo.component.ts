import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { form, FormField, required, email } from '@angular/forms/signals';
import { PshInputComponent } from '@lib/components/input/input.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-inputs-demo',
  imports: [TranslateModule, PshInputComponent, DemoPageLayoutComponent, CodeSnippetComponent, FormField, JsonPipe],
  templateUrl: './inputs-demo.component.html',
  styleUrls: ['./inputs-demo.component.css'],
})
export class InputsDemoComponent {
  emailValue = '';
  phoneValue = '';
  searchValue = '';
  passwordValue = '';

  signalFormModel = signal({ email: '', password: '' });
  signalForm = form(this.signalFormModel, (p) => {
    required(p.email, { message: 'Email requis' });
    email(p.email, { message: 'Format email invalide' });
    required(p.password, { message: 'Mot de passe requis' });
  });

  cities = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice',
    'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
    'Rennes', 'Reims', 'Saint-Étienne', 'Toulon', 'Le Havre',
    'Grenoble', 'Dijon', 'Angers', 'Nîmes', 'Villeurbanne'
  ];

  handleCitySelect(city: string) {
    console.log('City selected:', city);
  }

  signalFormCode = `import { signal } from '@angular/core';
import { form, FormField, required, email } from '@angular/forms/signals';

model = signal({ email: '', password: '' });
loginForm = form(this.model, (p) => {
  required(p.email, { message: 'Email requis' });
  email(p.email, { message: 'Format email invalide' });
  required(p.password, { message: 'Mot de passe requis' });
});

// Template :
<psh-input [formField]="loginForm.email" type="email">
  <span input-label>Email</span>
</psh-input>
<psh-input [formField]="loginForm.password" type="password">
  <span input-label>Mot de passe</span>
</psh-input>`;

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
