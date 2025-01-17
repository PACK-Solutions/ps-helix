import { Component, Input, OnInit, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PieChartData, PieChartConfig, PieChartSegment } from './pie-chart.types';

@Component({
  selector: 'lib-pie-chart',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibPieChartComponent implements OnInit {
  @Input() data: PieChartData[] = [];
  @Input() config: PieChartConfig = {
    width: 400,
    height: 400,
    margin: 40,
    animationDuration: 500,
    tooltipConfig: {
      format: 'percentage',
      showValue: true
    },
    legendConfig: {
      position: 'right',
      interactive: true
    }
  };

  center = { x: 0, y: 0 };
  radius = 0;
  total = 0;
  segments: PieChartSegment[] = [];
  hoveredIndex: number | null = null;
  hiddenSegments = new Set<number>();
  tooltipWidth = 160;
  private readonly maxTooltipWidth = 200;
  private readonly minTooltipWidth = 120;

  constructor(private elementRef: ElementRef) {}

  onTooltipContentChange(element: HTMLElement) {
    if (element) {
      const textWidth = element.scrollWidth;
      this.tooltipWidth = Math.min(
        Math.max(textWidth + 20, this.minTooltipWidth),
        this.maxTooltipWidth
      );
    }
  }

  ngOnInit() {
    this.initializeChart();
  }

  private initializeChart() {
    const width = typeof this.config.width === 'number' ? this.config.width : 400;
    const height = typeof this.config.height === 'number' ? this.config.height : 400;
    const margin = this.config.margin || 40;

    this.center = {
      x: width / 2,
      y: height / 2
    };
    this.radius = Math.min(width, height) / 2 - margin;
    this.calculateSegments();
  }

  private calculateSegments(): void {
    this.total = this.data
      .filter(item => !this.hiddenSegments.has(item.index))
      .reduce((sum, item) => sum + item.value, 0);

    let startAngle = 0;
    this.segments = this.data.map(item => {
      if (this.hiddenSegments.has(item.index)) {
        return {
          ...item,
          startAngle: 0,
          endAngle: 0,
          percentage: 0,
          path: ''
        };
      }

      const percentage = (item.value / this.total) * 100;
      const angle = (percentage / 100) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      
      const segment = {
        ...item,
        startAngle,
        endAngle,
        percentage,
        path: this.calculatePath(startAngle, endAngle)
      };

      startAngle = endAngle;
      return segment;
    });
  }

  private calculatePath(startAngle: number, endAngle: number): string {
    const start = {
      x: this.radius * Math.cos(startAngle),
      y: this.radius * Math.sin(startAngle)
    };
    
    const end = {
      x: this.radius * Math.cos(endAngle),
      y: this.radius * Math.sin(endAngle)
    };

    const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1';

    return `M 0 0 L ${start.x} ${start.y} A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
  }

  onSegmentHover(index: number) {
    this.hoveredIndex = index;
  }

  onSegmentLeave() {
    this.hoveredIndex = null;
  }

  toggleSegment(index: number) {
    if (this.hiddenSegments.has(index)) {
      this.hiddenSegments.delete(index);
    } else {
      this.hiddenSegments.add(index);
    }
    this.calculateSegments();
  }

  getTooltipPosition(segment: PieChartSegment) {
    const angle = (segment.startAngle + segment.endAngle) / 2;
    const distance = this.radius * 0.8;
    
    return {
      x: this.center.x + Math.cos(angle) * distance,
      y: this.center.y + Math.sin(angle) * distance
    };
  }

  // Ajout d'une zone tampon pour éviter le clignotement
  isSegmentHovered(segment: PieChartSegment, event: MouseEvent): boolean {
    if (!event) return false;
    
    const rect = (event.target as SVGElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calcul de la distance par rapport au centre
    const dx = x - this.center.x;
    const dy = y - this.center.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Vérification si le point est dans le segment
    if (distance <= this.radius) {
      const angle = Math.atan2(dy, dx);
      let normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
      
      // Ajout d'une zone tampon de 5 degrés
      const buffer = Math.PI / 36; // 5 degrés
      return normalizedAngle >= (segment.startAngle - buffer) && 
             normalizedAngle <= (segment.endAngle + buffer);
    }
    
    return false;
  }

  formatTooltipValue(value: number, percentage: number): string {
    const { format = 'percentage' } = this.config.tooltipConfig || {};
    
    switch (format) {
      case 'value':
        return value.toString();
      case 'percentage':
        return `${percentage.toFixed(1)}%`;
      case 'both':
        return `${value} (${percentage.toFixed(1)}%)`;
      default:
        return `${percentage.toFixed(1)}%`;
    }
  }
}