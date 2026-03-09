import type { ModelSignal } from '@angular/core';

export interface FormValueControl<T> {
  value: ModelSignal<T>;
  disabled: ModelSignal<boolean>;
  touched: ModelSignal<boolean>;
}

export interface FormCheckboxControl {
  checked: ModelSignal<boolean>;
  disabled: ModelSignal<boolean>;
  touched: ModelSignal<boolean>;
}
