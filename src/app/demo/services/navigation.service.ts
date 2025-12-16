import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
import { NavigationSection } from '../types';
import { NAVIGATION_SECTIONS } from '../constants/navigation.constants';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly sections = signal<NavigationSection[]>(NAVIGATION_SECTIONS);

  getSections(): NavigationSection[] {
    return this.sections();
  }
}