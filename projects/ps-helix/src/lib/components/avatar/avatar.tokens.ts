/**
 * Application-wide defaults for `psh-avatar`.
 *
 * Provide it to set a default once for every psh-avatar in the application:
 *
 *     provideHelix({ components: { avatar: { … } } })
 *
 * The defaults are a named const rather than an inline literal so `satisfies` runs the
 * excess-property check: a key renamed on the interface fails the build here instead of
 * quietly falling through to the literal in the component.
 */
import { InjectionToken } from '@angular/core';
import { AvatarConfig } from './avatar.types';

const AVATAR_DEFAULTS = {
  size: 'medium',
  shape: 'circle',
  alt: 'User avatar',
  icon: 'user',
} satisfies Partial<AvatarConfig>;

export const AVATAR_CONFIG = new InjectionToken<Partial<AvatarConfig>>('AVATAR_CONFIG', {
  factory: () => AVATAR_DEFAULTS,
});
