import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-property-insights',
  imports: [FormsModule],
  template: `
    <h2>Property Insights</h2>

    <details open>
      <summary><strong>Load Property Page</strong></summary>
      <table>
        <tr><td>Property ID *</td><td><input [(ngModel)]="propertyId" placeholder="Property ID" size="40"></td></tr>
        <tr><td>Language</td><td>
          <select [(ngModel)]="lang">
            <option value="de_DE">Deutsch</option>
            <option value="en_GB">English</option>
            <option value="fr_FR">Fran&ccedil;ais</option>
            <option value="it_IT">Italiano</option>
          </select>
        </td></tr>
      </table>
      <button (click)="loadInsights()" [disabled]="!propertyId">Load Insights</button>
    </details>

    @if (message) { <p><strong>{{ message }}</strong></p> }

    @if (iframeUrl) {
      <div style="margin-top: 16px;">
        <p>Dossier ID: {{ dossierId }}</p>
        <iframe
          [src]="iframeUrl"
          width="100%"
          height="800"
          frameborder="0"
          style="border: 1px solid #ccc; border-radius: 4px;">
        </iframe>
      </div>
    }
  `
})
export class PropertyInsightsComponent {
  propertyId = '';
  lang = 'de_DE';
  dossierId = '';
  iframeUrl: SafeResourceUrl | null = null;
  message = '';

  constructor(private gql: GraphqlService, private sanitizer: DomSanitizer) {}

  loadInsights() {
    if (!this.propertyId) return;
    this.message = 'Loading property page...';
    this.iframeUrl = null;

    const query = `query GetPropertyPageUrl($propertyId: String!, $lang: String!) {
      getPropertyPageUrl(propertyId: $propertyId, lang: $lang) {
        propertyId dossierId pageUrl
      }
    }`;

    this.gql.query<any>('property', query, {
      propertyId: this.propertyId,
      lang: this.lang
    }).subscribe({
      next: res => {
        console.log('Property page response:', res);
        const result = res.getPropertyPageUrl;
        this.dossierId = result.dossierId;
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(result.pageUrl);
        this.message = '';
      },
      error: err => {
        console.error('Property page error:', err);
        this.message = `Error: ${err.message}`;
        this.iframeUrl = null;
      }
    });
  }
}
