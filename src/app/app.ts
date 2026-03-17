import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <h1>ImmoBanking</h1>
    <nav>
      <a routerLink="/customers" routerLinkActive="active">Customers</a> |
      <a routerLink="/properties" routerLinkActive="active">Properties</a> |
      <a routerLink="/property-insights" routerLinkActive="active">Property Insights</a> |
      <a routerLink="/activity-history" routerLinkActive="active">Activity History</a>
    </nav>
    <hr>
    <router-outlet />
  `,
  styles: [`
    nav a { margin-right: 8px; }
    nav a.active { font-weight: bold; }
    h1 { margin-bottom: 4px; }
  `]
})
export class App {}
