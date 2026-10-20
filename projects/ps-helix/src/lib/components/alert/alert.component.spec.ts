/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshAlertComponent } from './alert.component';
import { AlertType } from './alert.types';
import { PSH_COLORS } from '../../types/semantic.types';

describe('PshAlertComponent', () => {
  let fixture: ComponentFixture<PshAlertComponent>;

  const getAlertRegion = () =>
    fixture.nativeElement.querySelector('[role="alert"], [role="status"]') as HTMLElement;

  const getDismissButton = () =>
    fixture.nativeElement.querySelector('button[aria-label]') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshAlertComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render text content from input', () => {
      fixture.componentRef.setInput('content', 'Test alert message');
      fixture.detectChanges();

      expect(getAlertRegion().textContent).toContain('Test alert message');
    });

    it('should display decorative icon by default', () => {
      const icon = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(icon).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(icon).toBeFalsy();
    });
  });

  describe('Dismiss behavior', () => {
    it('should not show dismiss button by default', () => {
      expect(getDismissButton()).toBeFalsy();
    });

    it('should show accessible dismiss button when closable', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const button = getDismissButton();
      expect(button).toBeTruthy();
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('aria-label')).toBe('Dismiss alert');
    });

    it('should emit closed event on button click', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      getDismissButton().click();

      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should support custom dismiss label', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.componentRef.setInput('dismissLabel', 'Fermer');
      fixture.detectChanges();

      expect(getDismissButton().getAttribute('aria-label')).toBe('Fermer');
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it.each<[AlertType, string]>([
        ['info', 'status'],
        ['success', 'status'],
        ['warning', 'alert'],
        ['danger', 'alert']
      ])('type "%s" should have role="%s"', (type, expectedRole) => {
        fixture.componentRef.setInput('color', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('role')).toBe(expectedRole);
      });

      it('should allow overriding role', () => {
        fixture.componentRef.setInput('color', 'info');
        fixture.componentRef.setInput('role', 'alert');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('role')).toBe('alert');
      });
    });

    describe('aria-live attribute', () => {
      it.each<[AlertType, string]>([
        ['info', 'polite'],
        ['success', 'polite'],
        ['warning', 'assertive'],
        ['danger', 'assertive']
      ])('type "%s" should have aria-live="%s"', (type, expectedLive) => {
        fixture.componentRef.setInput('color', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-live')).toBe(expectedLive);
      });

      it('should allow overriding aria-live', () => {
        fixture.componentRef.setInput('color', 'info');
        fixture.componentRef.setInput('ariaLive', 'assertive');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-live')).toBe('assertive');
      });
    });

    describe('aria-label attribute', () => {
      it('should not have aria-label by default', () => {
        expect(getAlertRegion().getAttribute('aria-label')).toBeFalsy();
      });

      it('should apply custom aria-label when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Important notification');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-label')).toBe('Important notification');
      });
    });
  });

  describe('data-state attribute', () => {
    it.each<[AlertType]>([['info'], ['success'], ['warning'], ['danger']])(
      'should have data-state="%s" for type "%s" when not closable',
      (type) => {
        fixture.componentRef.setInput('color', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('data-state')).toBe(type);
      }
    );

    it('should have data-state="closable" when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getAlertRegion().getAttribute('data-state')).toBe('closable');
    });
  });
});

/**
 * Everything in the alert sits on the message's first line. jsdom lays nothing out and Jest does
 * not apply the component's stylesheet, so the alignment itself is measured in a browser. What a
 * test can hold is the mechanism: the text size and line are set once, on the alert, and
 * inherited; the icon box and the dismiss button each carry a line of that text; the alert and
 * the content row line up first baselines. Each assertion is one way to break it — the 7.0.2
 * defects among them: the icon and the actions aligned by their top, and the message
 * re-declaring the base size over the one `small` and `large` set.
 */
describe('PshAlertComponent stylesheet', () => {
  const css = readFileSync(join(__dirname, 'alert.component.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

  // Innermost rules only, which is every rule here: a media query's own braces never match.
  const parse = (source: string) =>
    [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(([, selector, body]) => ({
      selectors: selector.split(',').map((s) => s.trim().replace(/\s+/g, ' ')),
      declarations: Object.fromEntries(
        body
          .split(';')
          .map((d) => d.split(/:(.*)/s).map((part) => part.trim().replace(/\s+/g, ' ')))
          .filter(([property, value]) => property && value),
      ) as Record<string, string>,
    }));

  const rules = parse(css);
  // The desktop rules alone. The narrow-screen queries set the text size for every size at once,
  // so a variant that lost its own declaration would still find one there.
  const topLevel = parse(css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, ''));

  const declared = (selector: string, property: string) =>
    topLevel
      .filter((rule) => rule.selectors.includes(selector))
      .map((rule) => rule.declarations[property])
      .filter(Boolean);

  /** Every value given to `property` by a rule with a selector matching `target`, media queries included. */
  const everywhere = (target: RegExp, property: string) =>
    rules
      .filter((rule) => rule.selectors.some((s) => target.test(s)))
      .map((rule) => rule.declarations[property])
      .filter(Boolean);

  /** The alert itself, in any size or colour — not its descendants. */
  const ALERT = /^\.psh-alert(\.[\w-]+)*$/;
  /** The content row itself, in any state — not its descendants. */
  const ROW = /^\.psh-alert-content(\.[\w-]+)*$/;
  /** Anything that would give the message or the icon box a text metric of its own. */
  const INHERITORS = /\.psh-alert-(message|icon)(?![\w-])/;
  const TEXT_METRICS = ['font', 'font-size', 'line-height'];

  it('sets the text size and line once, on the alert, and lets the sizes change only the property', () => {
    // A size that set `font-size` beside the property would hold the same value twice, and the
    // narrow-screen queries — which change the property — would leave the other one behind.
    expect(everywhere(ALERT, 'font-size')).toEqual(['var(--_psh-alert-text-size)']);
    expect(everywhere(ALERT, 'line-height')).toEqual(['var(--psh-line-height-relaxed)']);
    expect(everywhere(ALERT, 'font')).toEqual([]);
  });

  it.each(TEXT_METRICS)('lets the content row, the message and the icon box inherit %s, media queries included', (property) => {
    expect(everywhere(ROW, property)).toEqual([]);
    expect(everywhere(INHERITORS, property)).toEqual([]);
  });

  it('lines up the alert and the content row by first baseline', () => {
    expect(everywhere(ALERT, 'align-items')).toEqual(['first baseline']);
    expect(everywhere(ROW, 'align-items')).toEqual(['first baseline']);
  });

  it('gives the icon box a line of message text, its baseline the box', () => {
    expect(declared('.psh-alert-icon::before', 'content')).toEqual(["'\\200b'"]);
    expect(declared('.psh-alert-icon::before', 'align-self')).toEqual(['baseline']);
    expect(declared('.psh-alert-icon', 'align-items')).toEqual(['center']);
  });

  it('gives the dismiss button a line of message text the full height of the button', () => {
    // The button inherits the alert's font, which a button does not do on its own, and the line
    // reaches through its padding, so the icon centred in the button is centred on the line.
    expect(declared('.psh-alert-dismiss', 'font')).toEqual(['inherit']);
    expect(declared('.psh-alert-dismiss::before', 'content')).toEqual(["'\\200b'"]);
    expect(declared('.psh-alert-dismiss::before', 'align-self')).toEqual(['baseline']);
    expect(declared('.psh-alert-dismiss', 'align-items')).toEqual(['center']);

    const [padding] = declared('.psh-alert-dismiss', 'padding');
    expect(everywhere(/^\.psh-alert-dismiss$/, 'padding')).toEqual([padding]);
    expect(declared('.psh-alert-dismiss::before', 'margin-block')).toEqual([`calc(-1 * ${padding})`]);
  });

  it('declares no `--psh-*` property: the public ones are only read, with a fallback', () => {
    // A declared `--psh-alert-*` would look like the documented override surface and ignore a
    // consumer who set it on `psh-alert`. Internal carriers take the private `--_psh-` prefix.
    const declaredPublic = rules.flatMap((rule) =>
      Object.keys(rule.declarations).filter((property) => property.startsWith('--psh-')),
    );

    expect(declaredPublic).toEqual([]);
  });

  it.each([
    ['.psh-alert', 'base'],
    ['.psh-alert.psh-small', 'sm'],
    ['.psh-alert.psh-large', 'lg'],
  ])('%s carries its size to the text', (selector, step) => {
    expect(declared(selector, '--_psh-alert-text-size')).toEqual([`var(--psh-font-size-${step})`]);
  });

  it('leaves every icon the line-height of its font', () => {
    // The message icon is centred in its line only as a 1em box; and `.psh-alert i` also matches
    // the dismiss button's icon, where a line-height would grow the button from 28px to 43px and
    // the whole one-line alert with it.
    const iconRules = rules.filter((rule) =>
      rule.selectors.some((s) => /(^|\s|>)i$/.test(s) || s.startsWith('.psh-alert-dismiss')),
    );

    expect(iconRules.map((rule) => rule.declarations['line-height']).filter(Boolean)).toEqual([]);
  });
});

/**
 * Every colour `color` accepts is styled, from its own theme tokens. Primary, secondary and
 * neutral were accepted and had no rule; success, warning and danger used the bare colour as
 * text, under 4.5:1 in the light theme. The text tokens are chosen and measured in a browser —
 * what a test holds is that each colour reads its three tokens and each theme defines them.
 */
describe('PshAlertComponent colours', () => {
  const css = readFileSync(join(__dirname, 'alert.component.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const theme = (name: string) =>
    readFileSync(join(__dirname, `../../styles/themes/${name}.css`), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const PARTS = [
    ['background', 'bg'],
    ['border-color', 'border-color'],
    ['color', 'text-color'],
  ] as const;

  it.each(PSH_COLORS.map((color) => [color]))('styles %s from its three alert tokens', (color) => {
    const [, body = ''] = css.match(new RegExp(`(?:^|\\})\\s*\\.psh-alert\\.psh-${color}\\s*\\{([^}]*)\\}`)) ?? [];

    for (const [property, token] of PARTS) {
      expect(body).toMatch(new RegExp(`(^|[;\\s])${property}:\\s*var\\(--psh-alert-${color}-${token}\\);`));
    }
  });

  it.each(['light', 'dark'])('defines every alert colour token in the %s theme', (name) => {
    const source = theme(name);
    const missing = PSH_COLORS.flatMap((color) => PARTS.map(([, token]) => `--psh-alert-${color}-${token}`)).filter(
      (token) => !new RegExp(`${token}\\s*:`).test(source),
    );

    expect(missing).toEqual([]);
  });
});
