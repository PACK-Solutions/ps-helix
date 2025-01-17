import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LibButtonComponent } from '../button/button.component';
import type { ModalSize } from './modal.types';

@Component({
  selector: 'lib-modal',
  standalone: true,
  imports: [CommonModule, TranslateModule, LibButtonComponent],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibModalComponent implements AfterViewInit, OnDestroy {
  @Input() title = '';
  @Input() size: ModalSize = 'medium';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() preventScroll = true;
  @Input() showFooter = true;
  private isInitialized = false;
  private hasCustomFooterValue = false;
  private boundEscapeHandler = this.handleEscapeKey.bind(this);
  private _open = false;
  private isDestroyed = false;

  @Input()
  get open(): boolean {
    return this._open;
  }
  set open(value: boolean) {
    if (!this.isDestroyed && value !== this._open && this.isInitialized) {
      this._open = value;
      if (value) {
        this.setupScrollLock();
      } else {
        this.removeScrollLock();
      }
      this.openChange.emit(value);
    }
  }

  @Output() openChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  @ViewChild('modalContent', { static: false }) modalContent?: ElementRef;

  constructor() {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.boundEscapeHandler);
      // Initialize after a short delay to prevent initial flash
      setTimeout(() => {
        this.isInitialized = true;
      }, 100);
    }
  }

  hasCustomFooter(): boolean {
    return this.hasCustomFooterValue;
  }

  ngAfterViewInit(): void {
    // Vérifier le footer personnalisé après le premier changement de détection
    // Vérifier le footer personnalisé
    Promise.resolve().then(() => {
      if (this.modalContent) {
        this.hasCustomFooterValue = !!this.modalContent.nativeElement.querySelector('[modal-footer]');
      }
    });
  }

  handleClose(): void {
    this.open = false;
    this.closed.emit();
  }

  handleConfirm(): void {
    this.confirmed.emit();
  }

  handleBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.handleClose();
    }
  }

  private handleEscapeKey(event: KeyboardEvent): void {
    if (this.closeOnEscape && this.open && event.key === 'Escape') {
      this.handleClose();
    }
  }

  private setupScrollLock(): void {
    if (this.preventScroll && typeof window !== 'undefined') {
      // Calculate scrollbar width only once when opening
      if (!document.documentElement.style.getPropertyValue('--scrollbar-width')) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      }
      document.body.classList.add('modal-open');
    }
  }

  private removeScrollLock(): void {
    if (this.preventScroll && typeof window !== 'undefined') {
      document.body.classList.remove('modal-open');
    }
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.boundEscapeHandler);
      this.removeScrollLock();
    }
  }
}