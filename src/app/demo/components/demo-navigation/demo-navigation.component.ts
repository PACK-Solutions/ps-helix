import { Component, viewChild, effect, AfterViewInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { output, computed } from '@angular/core';
import { ThemeService } from '@lib/services/theme/theme.service';
import { NavigationService, KeyboardShortcutService } from '../../services';
import { SearchComponent } from '../../shared';

@Component({
  selector: 'ds-demo-navigation',
  imports: [RouterModule, TranslateModule, SearchComponent],
  templateUrl: './demo-navigation.component.html',
  styleUrls: ['./demo-navigation.component.css']
})
export class DemoNavigationComponent implements AfterViewInit {
  navigationSections = this.navigationService.getSections();

  navigationClick = output<void>();

  themeIcon = computed(() => this.themeService.isDarkTheme() ? 'moon' : 'sun');
  themeLabel = computed(() => this.themeService.isDarkTheme() ? 'Mode clair' : 'Mode sombre');

  searchComponent = viewChild(SearchComponent);

  constructor(
    public themeService: ThemeService,
    public translateService: TranslateService,
    private navigationService: NavigationService,
    private keyboardShortcutService: KeyboardShortcutService,
    private router: Router
  ) {
    effect(() => {
      this.keyboardShortcutService.getSearchTrigger()();
      const search = this.searchComponent();
      if (search) {
        search.focus();
      }
    });
  }

  ngAfterViewInit(): void {
    const search = this.searchComponent();
    if (search) {
      search.setNavigationSections(this.navigationSections);
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    const currentLang = this.translateService.currentLang;
    this.translateService.use(currentLang === 'en' ? 'fr' : 'en');
  }

  onSearchNavigate(path: string): void {
    this.router.navigate([path]);
    this.navigationClick.emit();
  }
}