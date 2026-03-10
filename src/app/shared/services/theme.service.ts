import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDark = signal(false);

  toggle(): void {
    this.isDark.update(v => !v);
    document.body.classList.toggle('dark-theme', this.isDark());
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }
}