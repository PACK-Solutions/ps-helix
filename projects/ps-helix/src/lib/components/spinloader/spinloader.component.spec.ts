import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshSpinLoaderComponent, SPINLOADER_CONFIG } from './spinloader.component';
import { SpinLoaderVariant, SpinLoaderSize, SpinLoaderColor } from './spinloader.types';

const mockMatchMedia = (matches: boolean = false) => {
  return jest.fn().mockImplementation(() => ({
    matches,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn()
  }));
};

beforeAll(() => {
  window.matchMedia = mockMatchMedia(false);
});

describe('PshSpinLoaderComponent', () => {
  let fixture: ComponentFixture<PshSpinLoaderComponent>;

  const getHostElement = () => fixture.nativeElement as HTMLElement;

  const getLabel = () =>
    fixture.nativeElement.querySelector('.spinner-label') as HTMLElement;

  const getSpinnerContainer = () =>
    fixture.nativeElement.querySelector('[class^="spinner-"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshSpinLoaderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshSpinLoaderComponent);
    fixture.detectChanges();
  });

  describe('Accessibility', () => {
    it('should have role="status" on host element', () => {
      expect(getHostElement().getAttribute('role')).toBe('status');
    });

    it('should have default aria-label "Chargement en cours"', () => {
      expect(getHostElement().getAttribute('aria-label')).toBe('Chargement en cours');
    });

    it('should use custom ariaLabel when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Loading content');
      fixture.detectChanges();

      expect(getHostElement().getAttribute('aria-label')).toBe('Loading content');
    });

    it('should have aria-busy="true"', () => {
      expect(getHostElement().getAttribute('aria-busy')).toBe('true');
    });

    it('should have default aria-live="polite"', () => {
      expect(getHostElement().getAttribute('aria-live')).toBe('polite');
    });

    it.each<['polite' | 'assertive']>([['polite'], ['assertive']])(
      'should apply aria-live="%s" when set',
      (ariaLive) => {
        fixture.componentRef.setInput('ariaLive', ariaLive);
        fixture.detectChanges();

        expect(getHostElement().getAttribute('aria-live')).toBe(ariaLive);
      }
    );
  });

  describe('data-state attribute', () => {
    it('should have default data-state="circle"', () => {
      expect(getHostElement().getAttribute('data-state')).toBe('circle');
    });

    it.each<[SpinLoaderVariant]>([['circle'], ['dots'], ['pulse']])(
      'should set data-state="%s" for variant "%s"',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getHostElement().getAttribute('data-state')).toBe(variant);
      }
    );

    it('should update data-state when variant changes', () => {
      expect(getHostElement().getAttribute('data-state')).toBe('circle');

      fixture.componentRef.setInput('variant', 'dots');
      fixture.detectChanges();
      expect(getHostElement().getAttribute('data-state')).toBe('dots');

      fixture.componentRef.setInput('variant', 'pulse');
      fixture.detectChanges();
      expect(getHostElement().getAttribute('data-state')).toBe('pulse');
    });
  });

  describe('Size classes', () => {
    it.each<[SpinLoaderSize, boolean]>([
      ['small', true],
      ['medium', false],
      ['large', true]
    ])('size "%s" should apply correct host class', (size, hasClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const host = getHostElement();
      if (size === 'medium') {
        expect(host.classList.contains('small')).toBe(false);
        expect(host.classList.contains('large')).toBe(false);
      } else {
        expect(host.classList.contains(size)).toBe(hasClass);
      }
    });

    it('should switch between size classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(getHostElement().classList.contains('small')).toBe(true);

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(getHostElement().classList.contains('large')).toBe(true);
      expect(getHostElement().classList.contains('small')).toBe(false);
    });
  });

  describe('Label rendering', () => {
    it('should not render label when label input is not provided', () => {
      expect(getLabel()).toBeFalsy();
    });

    it('should render label when label input is provided', () => {
      fixture.componentRef.setInput('label', 'Loading...');
      fixture.detectChanges();

      const label = getLabel();
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Loading...');
    });

    it('should update label when input changes', () => {
      fixture.componentRef.setInput('label', 'Loading...');
      fixture.detectChanges();
      expect(getLabel().textContent).toContain('Loading...');

      fixture.componentRef.setInput('label', 'Please wait...');
      fixture.detectChanges();
      expect(getLabel().textContent).toContain('Please wait...');
    });

    it('should hide label when input is cleared', () => {
      fixture.componentRef.setInput('label', 'Loading...');
      fixture.detectChanges();
      expect(getLabel()).toBeTruthy();

      fixture.componentRef.setInput('label', undefined);
      fixture.detectChanges();
      expect(getLabel()).toBeFalsy();
    });
  });

  describe('Variant rendering', () => {
    it.each<[SpinLoaderVariant, string]>([
      ['circle', '.spinner-circle'],
      ['dots', '.spinner-dots'],
      ['pulse', '.spinner-pulse']
    ])('variant "%s" should render %s container', (variant, selector) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(selector)).toBeTruthy();
    });

    it('should only render one variant at a time', () => {
      fixture.componentRef.setInput('variant', 'dots');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.spinner-circle')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.spinner-dots')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.spinner-pulse')).toBeFalsy();
    });
  });

  describe('Color classes', () => {
    it.each<[SpinLoaderColor]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should apply "%s" color class to spinner', (color) => {
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const spinner = getSpinnerContainer();
      expect(spinner.classList.contains(color)).toBe(true);
    });

    it('should switch between color classes', () => {
      fixture.componentRef.setInput('color', 'primary');
      fixture.detectChanges();
      expect(getSpinnerContainer().classList.contains('primary')).toBe(true);

      fixture.componentRef.setInput('color', 'danger');
      fixture.detectChanges();
      expect(getSpinnerContainer().classList.contains('danger')).toBe(true);
      expect(getSpinnerContainer().classList.contains('primary')).toBe(false);
    });
  });

  describe('Reduced motion', () => {
    afterEach(() => {
      window.matchMedia = mockMatchMedia(false);
    });

    it('should apply reduce-motion class when prefers-reduced-motion matches', async () => {
      window.matchMedia = mockMatchMedia(true);

      const newFixture = TestBed.createComponent(PshSpinLoaderComponent);
      newFixture.detectChanges();
      await newFixture.whenStable();

      expect(newFixture.nativeElement.classList.contains('reduce-motion')).toBe(true);
    });

    it('should not apply reduce-motion class when prefers-reduced-motion does not match', async () => {
      window.matchMedia = mockMatchMedia(false);

      const newFixture = TestBed.createComponent(PshSpinLoaderComponent);
      newFixture.detectChanges();
      await newFixture.whenStable();

      expect(newFixture.nativeElement.classList.contains('reduce-motion')).toBe(false);
    });
  });
});

describe('PshSpinLoaderComponent with custom config', () => {
  let fixture: ComponentFixture<PshSpinLoaderComponent>;

  const getHostElement = () => fixture.nativeElement as HTMLElement;

  const getSpinnerContainer = () =>
    fixture.nativeElement.querySelector('[class^="spinner-"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshSpinLoaderComponent],
      providers: [
        {
          provide: SPINLOADER_CONFIG,
          useValue: {
            variant: 'dots',
            size: 'large',
            color: 'success'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PshSpinLoaderComponent);
    fixture.detectChanges();
  });

  it('should use injected config for default variant', () => {
    expect(getHostElement().getAttribute('data-state')).toBe('dots');
  });

  it('should use injected config for default size', () => {
    expect(getHostElement().classList.contains('large')).toBe(true);
  });

  it('should use injected config for default color', () => {
    expect(getSpinnerContainer().classList.contains('success')).toBe(true);
  });

  it('should allow overriding injected defaults via inputs', () => {
    fixture.componentRef.setInput('variant', 'pulse');
    fixture.componentRef.setInput('size', 'small');
    fixture.componentRef.setInput('color', 'danger');
    fixture.detectChanges();

    expect(getHostElement().getAttribute('data-state')).toBe('pulse');
    expect(getHostElement().classList.contains('small')).toBe(true);
    expect(getSpinnerContainer().classList.contains('danger')).toBe(true);
  });
});
