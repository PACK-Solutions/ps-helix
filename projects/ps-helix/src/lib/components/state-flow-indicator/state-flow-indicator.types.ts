import { PshConfigValue } from '../../utils/config-value';

export type StateFlowIndicatorSize = 'small' | 'medium' | 'large';

export interface StateFlowIndicatorAriaLabels {
  step: string;
  completed: string;
  active: string;
  incomplete: string;
  disabled: string;
  warning: string;
  error: string;
}

export interface StateFlowIndicatorConfig {
  linear: boolean;
  ariaLabels?: StateFlowIndicatorAriaLabels;
  /** Accessible name of the indicator landmark */
  ariaLabel?: PshConfigValue<string>;
}

export interface FlowStepConfig {
  title: string;
  disabled: boolean;
  completed: boolean;
  loading: boolean;
  error?: string | null;
  warning?: string | null;
}
