import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  template: `
    <div class="dark">
      <app-navigation></app-navigation>
      <router-outlet></router-outlet>
    </div>
  `
})
export class App {
  title = 'Portfolio Dashboard';
}
