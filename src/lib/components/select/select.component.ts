import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, OnInit, OnDestroy, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SelectOption, SelectSize } from '@lib/types';
import { SelectState } from './select.state';

@Component({
  selector: 'lib-select',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SelectState]
})
export class LibSelectComponent implements OnInit, OnDestroy {
  @Input() options: SelectOption[] = [];
  @Input() value: any = null;
  @Input() placeholder = '';
  @Input() size: SelectSize = 'medium';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() success = '';
  @Input() searchable = false;
  @Input() multiple = false;
  @Input() clearable = false;
  @Input() loading = false;

  @Output() valueChange = new EventEmitter<any>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() searched = new EventEmitter<string>();

  constructor(
    public state: SelectState,
    private translateService: TranslateService,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target) && this.state.isOpen()) {
      this.state.close();
      this.closed.emit();
    }
  }

  ngOnInit(): void {
    this.state.setOptions(this.options);
    this.translateService.onLangChange.subscribe(() => {
      this.updateSelectedLabel();
    });
    this.updateSelectedLabel();
  }

  ngOnDestroy(): void {
    this.state.close();
  }

  toggle(): void {
    if (!this.disabled) {
      this.state.toggle();
      if (this.state.isOpen()) {
        this.opened.emit();
      } else {
        this.closed.emit();
      }
    }
  }

  clear(event: Event): void {
    event.stopPropagation();
    if (!this.disabled) {
      this.value = this.multiple ? [] : null;
      this.valueChange.emit(this.value);
      this.updateSelectedLabel();
    }
  }

  select(option: SelectOption): void {
    if (!this.disabled && !option.disabled) {
      if (this.multiple) {
        const values = Array.isArray(this.value) ? this.value : [];
        const index = values.indexOf(option.value);
        
        if (index === -1) {
          this.value = [...values, option.value];
        } else {
          this.value = values.filter(v => v !== option.value);
        }
      } else {
        this.value = option.value;
        this.state.close();
      }
      
      this.valueChange.emit(this.value);
      this.updateSelectedLabel();
    }
  }

  isSelected(option: SelectOption): boolean {
    if (this.multiple) {
      return Array.isArray(this.value) && this.value.includes(option.value);
    }
    return this.value === option.value;
  }

  onSearch(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.state.setSearchTerm(term);
    this.searched.emit(term);
  }

  private updateSelectedLabel(): void {
    if (this.multiple) {
      const selected = this.options.filter(opt => 
        Array.isArray(this.value) && this.value.includes(opt.value)
      );
      if (selected.length) {
        const labels = selected.map(opt => this.translateService.instant(opt.label));
        this.state.setSelectedLabel(labels.join(', '));
      } else {
        this.state.setSelectedLabel(this.translateService.instant(this.placeholder));
      }
    } else {
      const selected = this.options.find(opt => opt.value === this.value);
      if (selected) {
        this.state.setSelectedLabel(this.translateService.instant(selected.label));
      } else {
        this.state.setSelectedLabel(this.translateService.instant(this.placeholder));
      }
    }
  }

}