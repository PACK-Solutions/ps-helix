import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshAvatarComponent } from './avatar.component';
import { AvatarSize, AvatarShape, AvatarStatus } from './avatar.types';

describe('PshAvatarComponent', () => {
  let fixture: ComponentFixture<PshAvatarComponent>;

  const getAvatarContainer = () =>
    fixture.nativeElement.querySelector('[role="img"]') as HTMLElement;

  const getImage = () =>
    fixture.nativeElement.querySelector('img') as HTMLImageElement;

  const getInitials = () =>
    fixture.nativeElement.querySelector('.avatar-initials') as HTMLElement;

  const getIcon = () =>
    fixture.nativeElement.querySelector('i[aria-hidden="true"]') as HTMLElement;

  const getStatusIndicator = () =>
    fixture.nativeElement.querySelector('.avatar-status') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshAvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshAvatarComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should display image when src is provided', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.detectChanges();

      const img = getImage();
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('https://example.com/avatar.jpg');
    });

    it('should display initials when provided without image', () => {
      fixture.componentRef.setInput('initials', 'JD');
      fixture.detectChanges();

      expect(getInitials()).toBeTruthy();
      expect(getInitials().textContent).toBe('JD');
      expect(getImage()).toBeFalsy();
    });

    it('should display icon fallback when no image or initials', () => {
      fixture.detectChanges();

      expect(getIcon()).toBeTruthy();
      expect(getImage()).toBeFalsy();
      expect(getInitials()).toBeFalsy();
    });

    it('should prioritize image over initials', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.componentRef.setInput('initials', 'JD');
      fixture.detectChanges();

      expect(getImage()).toBeTruthy();
      expect(getInitials()).toBeFalsy();
    });

    it('should prioritize initials over icon', () => {
      fixture.componentRef.setInput('initials', 'AB');
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      expect(getInitials()).toBeTruthy();
      expect(getIcon()).toBeFalsy();
    });

    it('should use custom icon when provided', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      const icon = getIcon();
      expect(icon).toBeTruthy();
      expect(icon.classList.contains('ph-star')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have role="img" on container', () => {
      expect(getAvatarContainer().getAttribute('role')).toBe('img');
    });

    it('should have default aria-label', () => {
      expect(getAvatarContainer().getAttribute('aria-label')).toBe('User avatar');
    });

    it('should use alt as aria-label when no custom ariaLabel', () => {
      fixture.componentRef.setInput('alt', 'John Doe profile picture');
      fixture.detectChanges();

      expect(getAvatarContainer().getAttribute('aria-label')).toBe('John Doe profile picture');
    });

    it('should use custom ariaLabel when provided', () => {
      fixture.componentRef.setInput('alt', 'John Doe');
      fixture.componentRef.setInput('ariaLabel', 'Custom accessibility label');
      fixture.detectChanges();

      expect(getAvatarContainer().getAttribute('aria-label')).toBe('Custom accessibility label');
    });

    it('should have aria-hidden on decorative icon', () => {
      const icon = getIcon();
      expect(icon).toBeTruthy();
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set alt attribute on image', () => {
      fixture.componentRef.setInput('src', 'https://example.com/avatar.jpg');
      fixture.componentRef.setInput('alt', 'Profile photo');
      fixture.detectChanges();

      expect(getImage().getAttribute('alt')).toBe('Profile photo');
    });
  });

  describe('Status indicator', () => {
    it('should not show status indicator by default', () => {
      expect(getStatusIndicator()).toBeFalsy();
    });

    it.each<[AvatarStatus]>([['online'], ['offline'], ['away'], ['busy']])(
      'should show status indicator with class "%s" when status is set',
      (status) => {
        fixture.componentRef.setInput('status', status);
        fixture.detectChanges();

        const indicator = getStatusIndicator();
        expect(indicator).toBeTruthy();
        expect(indicator.classList.contains(status)).toBe(true);
        expect(indicator.getAttribute('aria-label')).toBe(status);
      }
    );
  });

  describe('data-state attribute', () => {
    it('should have data-state="default" by default', () => {
      expect(getAvatarContainer().getAttribute('data-state')).toBe('default');
    });

    it.each<[AvatarStatus]>([['online'], ['offline'], ['away'], ['busy']])(
      'should have data-state="%s" when status is "%s"',
      (status) => {
        fixture.componentRef.setInput('status', status);
        fixture.detectChanges();

        expect(getAvatarContainer().getAttribute('data-state')).toBe(status);
      }
    );
  });

  describe('Model inputs', () => {
    describe('src model', () => {
      it('should update image source when src changes', () => {
        fixture.componentRef.setInput('src', 'https://example.com/first.jpg');
        fixture.detectChanges();
        expect(getImage().getAttribute('src')).toBe('https://example.com/first.jpg');

        fixture.componentRef.setInput('src', 'https://example.com/second.jpg');
        fixture.detectChanges();
        expect(getImage().getAttribute('src')).toBe('https://example.com/second.jpg');
      });
    });

    describe('alt model', () => {
      it('should update accessibility when alt changes', () => {
        fixture.componentRef.setInput('alt', 'Initial alt');
        fixture.detectChanges();
        expect(getAvatarContainer().getAttribute('aria-label')).toBe('Initial alt');

        fixture.componentRef.setInput('alt', 'Updated alt');
        fixture.detectChanges();
        expect(getAvatarContainer().getAttribute('aria-label')).toBe('Updated alt');
      });
    });

    describe('size model', () => {
      it.each<[AvatarSize, boolean]>([
        ['small', true],
        ['medium', false],
        ['large', true],
        ['xlarge', true]
      ])('should apply "%s" size class correctly (hasClass: %s)', (size, hasClass) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const container = getAvatarContainer();
        if (hasClass) {
          expect(container.classList.contains(size)).toBe(true);
        } else {
          expect(container.classList.contains('small')).toBe(false);
          expect(container.classList.contains('large')).toBe(false);
          expect(container.classList.contains('xlarge')).toBe(false);
        }
      });
    });

    describe('shape model', () => {
      it.each<[AvatarShape]>([['circle'], ['square']])(
        'should apply "%s" shape class',
        (shape) => {
          fixture.componentRef.setInput('shape', shape);
          fixture.detectChanges();

          const container = getAvatarContainer();
          expect(container.classList.contains(shape)).toBe(true);
        }
      );

      it('should switch between shapes', () => {
        fixture.componentRef.setInput('shape', 'circle');
        fixture.detectChanges();
        expect(getAvatarContainer().classList.contains('circle')).toBe(true);

        fixture.componentRef.setInput('shape', 'square');
        fixture.detectChanges();
        expect(getAvatarContainer().classList.contains('square')).toBe(true);
        expect(getAvatarContainer().classList.contains('circle')).toBe(false);
      });
    });
  });
});
