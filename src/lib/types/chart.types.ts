export interface PieChartData {
  label: string;
  value: number;
  color?: string;
  index: number;
}

export interface PieChartConfig {
  width: number;
  height: number;
  margin?: number;
  animationDuration?: number;
  tooltipConfig?: {
    format?: 'value' | 'percentage' | 'both';
    showValue?: boolean;
  };
  legendConfig?: {
    position?: 'right' | 'bottom';
    interactive?: boolean;
  };
}