import { navigationTranslations } from './translations/navigation.translations';
import { themeTranslations } from './translations/theme.translations';
import { selectTranslations } from './translations/select.translations';
import { buttonTranslations } from './translations/button.translations';
import { toastTranslations } from './translations/toast.translations';
import { alertTranslations } from './translations/alert.translations';
import { modalTranslations } from './translations/modal.translations';
import { dropdownTranslations } from './translations/dropdown.translations';
import { tagTranslations } from './translations/tag.translations';
import { inputTranslations } from './translations/input.translations';
import { badgeTranslations } from './translations/badge.translations';
import { checkboxTranslations } from './translations/checkbox.translations';
import { switchTranslations } from './translations/switch.translations';
import { i18nTranslations } from './translations/i18n.translations';
import { tabsTranslations } from './translations/tabs.translations';
import { stepperTranslations } from './translations/stepper.translations';
import { cardTranslations } from './translations/card.translations';
import { tooltipTranslations } from './translations/tooltip.translations';
import { collapseTranslations } from './translations/collapse.translations';
import { tableTranslations } from './translations/table.translations';
import { paginationTranslations } from './translations/pagination.translations';
import { progressbarTranslations } from './translations/progressbar.translations';
import { spinloaderTranslations } from './translations/spinloader.translations';
import { avatarTranslations } from './translations/avatar.translations';
import { menuTranslations } from './translations/menu.translations';
import { tabBarTranslations } from './translations/tab-bar.translations';
import { statCardTranslations } from './translations/stat-card.translations';
import { searchTranslations } from './translations/search.translations';

export interface TranslationType {
  NAVIGATION: typeof navigationTranslations.en.NAVIGATION;
  DESIGN_SYSTEM: typeof themeTranslations.en.DESIGN_SYSTEM;
  THEME: typeof themeTranslations.en.THEME;
  SELECT: typeof selectTranslations.en.SELECT;
  BUTTON: typeof buttonTranslations.en.BUTTON;
  TOAST: typeof toastTranslations.en.TOAST;
  ALERT: typeof alertTranslations.en.ALERT;
  MODAL: typeof modalTranslations.en.MODAL;
  DROPDOWN: typeof dropdownTranslations.en.DROPDOWN;
  INPUT: typeof inputTranslations.en.INPUT;
  CHECKBOX: typeof checkboxTranslations.en.CHECKBOX;
  RADIO: typeof checkboxTranslations.en.RADIO;
  SWITCH: typeof switchTranslations.en.SWITCH;
  STEPPER: typeof stepperTranslations.en.STEPPER;
  TABS: typeof tabsTranslations.en.TABS;
  I18N: typeof i18nTranslations.en.I18N;
  BADGE: typeof badgeTranslations.en.BADGE;
  CARD: typeof cardTranslations.en.CARD;
  TAG: typeof tagTranslations.en.TAG;
  TOOLTIP: typeof tooltipTranslations.en.TOOLTIP;
  COLLAPSE: typeof collapseTranslations.en.COLLAPSE;
  TABLE: typeof tableTranslations.en.TABLE;
  PROGRESSBAR: typeof progressbarTranslations.en.PROGRESSBAR;
  PAGINATION: typeof paginationTranslations.en.PAGINATION;
  SPINLOADER: typeof spinloaderTranslations.en.SPINLOADER;
  AVATAR: typeof avatarTranslations.en.AVATAR;
  MENU: typeof menuTranslations.en.MENU;
  TAB_BAR: typeof tabBarTranslations.en.TAB_BAR;
  STAT_CARDS: typeof statCardTranslations.en.STAT_CARDS;
  SEARCH: typeof searchTranslations.en.SEARCH;
}

export const translations: Record<string, TranslationType> = {
  en: {
    ...navigationTranslations.en,
    ...themeTranslations.en,
    ...selectTranslations.en,
    ...buttonTranslations.en,
    ...toastTranslations.en,
    ...alertTranslations.en,
    ...modalTranslations.en,
    ...dropdownTranslations.en,
    ...inputTranslations.en,
    ...checkboxTranslations.en,
    ...switchTranslations.en,
    ...tabsTranslations.en,
    ...stepperTranslations.en,
    ...i18nTranslations.en,
    ...badgeTranslations.en,
    ...cardTranslations.en,
    ...tagTranslations.en,
    ...tooltipTranslations.en,
    ...collapseTranslations.en,
    ...tableTranslations.en,
    ...progressbarTranslations.en,
    ...paginationTranslations.en,
    ...spinloaderTranslations.en,
    ...avatarTranslations.en,
    ...menuTranslations.en,
    ...tabBarTranslations.en,
    ...statCardTranslations.en,
    ...searchTranslations.en
  },
  fr: {
    ...navigationTranslations.fr,
    ...themeTranslations.fr,
    ...selectTranslations.fr,
    ...buttonTranslations.fr,
    ...toastTranslations.fr,
    ...alertTranslations.fr,
    ...modalTranslations.fr,
    ...dropdownTranslations.fr,
    ...inputTranslations.fr,
    ...checkboxTranslations.fr,
    ...switchTranslations.fr,
    ...tabsTranslations.fr,
    ...stepperTranslations.fr,
    ...i18nTranslations.fr,
    ...badgeTranslations.fr,
    ...cardTranslations.fr,
    ...tagTranslations.fr,
    ...tooltipTranslations.fr,
    ...collapseTranslations.fr,
    ...tableTranslations.fr,
    ...progressbarTranslations.fr,
    ...paginationTranslations.fr,
    ...spinloaderTranslations.fr,
    ...avatarTranslations.fr,
    ...menuTranslations.fr,
    ...tabBarTranslations.fr,
    ...statCardTranslations.fr,
    ...searchTranslations.fr
  }
};