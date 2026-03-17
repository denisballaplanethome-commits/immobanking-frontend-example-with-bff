import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-activity-history',
  imports: [FormsModule],
  template: `
    <h2>Activity History</h2>

    <details open>
      <summary><strong>Query Activity History</strong></summary>
      <table>
        <tr><td>Customer UUID *</td><td><input [(ngModel)]="customerUuid" placeholder="Customer UUID" size="40"></td></tr>
        <tr><td>Event Type (optional)</td><td>
          <select [(ngModel)]="eventType" name="eventType">
            <option [ngValue]="null">-- all --</option>
            <option value="CUSTOMER_CREATED">CUSTOMER_CREATED</option>
            <option value="CUSTOMER_ADVERTISING_CONSENT_CONFIRMED">CUSTOMER_ADVERTISING_CONSENT_CONFIRMED</option>
            <option value="CUSTOMER_ADVERTISING_CONSENT_WITHDRAWN">CUSTOMER_ADVERTISING_CONSENT_WITHDRAWN</option>
            <option value="NOT_SPECIFIED">NOT_SPECIFIED</option>
          </select>
        </td></tr>
      </table>
      <button (click)="load()">Load Activity History</button>
    </details>

    @if (message) { <p><strong>{{ message }}</strong></p> }

    @if (activities.length > 0) {
      <table border="1" cellpadding="4">
        <tr>
          <th>Time</th><th>Event Type</th><th>Actor</th><th>Actor Name</th>
          <th>Source Service</th><th>Source Domain</th><th>Value</th><th>Customer UUID</th>
        </tr>
        @for (a of activities; track a.uuid) {
          <tr>
            <td>{{ a.time }}</td>
            <td>{{ a.type }}</td>
            <td>{{ a.actor }}</td>
            <td>{{ a.actorFirstname }} {{ a.actorLastname }}</td>
            <td>{{ a.sourceService }}</td>
            <td>{{ a.sourceDomain }}</td>
            <td>{{ a.value }}</td>
            <td>{{ a.customerUuid }}</td>
          </tr>
        }
      </table>
      <p>Total: {{ activities.length }} entries</p>
    } @else if (loaded) {
      <p>No activity history found.</p>
    }
  `
})
export class ActivityHistoryComponent {
  customerUuid = '';
  eventType: string | null = null;
  activities: any[] = [];
  message = '';
  loaded = false;

  constructor(private gql: GraphqlService) {}

  load() {
    if (!this.customerUuid) return;
    const query = `query GetActivityHistory($customerUuid: String!, $eventType: EventType) {
      getActivityHistory(customerUuid: $customerUuid, eventType: $eventType) {
        uuid time actor actorFirstname actorLastname
        sourceService sourceDomain type value customerUuid
      }
    }`;
    this.gql.query<any>('activity', query, {
      customerUuid: this.customerUuid,
      eventType: this.eventType
    }).subscribe({
      next: res => {
        this.activities = res.getActivityHistory || [];
        this.loaded = true;
        this.message = '';
      },
      error: err => this.message = `Error: ${err.message}`
    });
  }
}
