import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { TRANSLATION_PROVIDER } from '@lib/services/translation/translation.service';

@Component({
  selector: 'ds-i18n-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './i18n-demo.component.html',
  styleUrls: ['./i18n-demo.component.css']
})
export class I18nDemoComponent {
  translationProvider = inject(TRANSLATION_PROVIDER);
}