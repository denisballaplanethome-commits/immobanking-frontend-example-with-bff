import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers';
import { PropertiesComponent } from './properties/properties';
import { ActivityHistoryComponent } from './activity-history/activity-history';
import { PropertyInsightsComponent } from './property-insights/property-insights';

export const routes: Routes = [
  { path: '', redirectTo: 'customers', pathMatch: 'full' },
  { path: 'customers', component: CustomersComponent },
  { path: 'properties', component: PropertiesComponent },
  { path: 'property-insights', component: PropertyInsightsComponent },
  { path: 'activity-history', component: ActivityHistoryComponent }
];
