import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-customers',
  imports: [FormsModule],
  template: `
    <h2>Customers</h2>

    <!-- CREATE CUSTOMER -->
    <details open>
      <summary><strong>Create Customer</strong></summary>
      <form (ngSubmit)="createCustomer()">
        <table>
          <tr><td>Type</td><td>
            <select [(ngModel)]="form.type" name="type">
              <option value="PERSON">PERSON</option>
              <option value="COMPANY">COMPANY</option>
              <option value="SPOUSES">SPOUSES</option>
            </select>
          </td></tr>
          <tr><td>Salutation</td><td>
            <select [(ngModel)]="form.salutation" name="salutation">
              <option value="MR">MR</option><option value="MS">MS</option>
            </select>
          </td></tr>
          <tr><td>First Name *</td><td><input [(ngModel)]="form.firstName" name="firstName" required></td></tr>
          <tr><td>Last Name *</td><td><input [(ngModel)]="form.lastName" name="lastName" required></td></tr>
          <tr><td>Birthday</td><td><input [(ngModel)]="form.birthday" name="birthday" type="date"></td></tr>
          <tr><td>Street</td><td><input [(ngModel)]="form.street" name="street"></td></tr>
          <tr><td>Street Number</td><td><input [(ngModel)]="form.streetnumber" name="streetnumber"></td></tr>
          <tr><td>Zip Code</td><td><input [(ngModel)]="form.zipcode" name="zipcode"></td></tr>
          <tr><td>City</td><td><input [(ngModel)]="form.city" name="city"></td></tr>
          <tr><td>Country</td><td>
            <select [(ngModel)]="form.country" name="country">
              <option value="DEU">DEU</option><option value="AUT">AUT</option><option value="CHE">CHE</option>
            </select>
          </td></tr>
          <tr><td>Email</td><td><input [(ngModel)]="form.email" name="email" type="email"></td></tr>
          <tr><td>Phone</td><td><input [(ngModel)]="form.phone" name="phone"></td></tr>
          <tr><td>Duplicate Check</td><td>
            <select [(ngModel)]="form.duplicateCheck" name="duplicateCheck">
              <option value="WITH_CHECK">WITH_CHECK</option><option value="NO_CHECK">NO_CHECK</option>
            </select>
          </td></tr>
        </table>
        <button type="submit">Create Customer</button>
      </form>
    </details>

    @if (message) { <p><strong>{{ message }}</strong></p> }

    <!-- LOAD CUSTOMER -->
    <details open>
      <summary><strong>Get Customer</strong></summary>
      <input [(ngModel)]="searchUuid" placeholder="Customer UUID" size="40">
      <button (click)="loadCustomer()">Load</button>
    </details>

    @if (customer) {
      <!-- CUSTOMER DETAIL -->
      <details open>
        <summary><strong>Customer Detail</strong></summary>
        <table border="1" cellpadding="4">
          <tr><th>UUID</th><td>{{ customer.uuid }}</td></tr>
          <tr><th>Type</th><td>{{ customer.type }}</td></tr>
          <tr><th>Name</th><td>{{ customer.salutation }} {{ customer.firstName }} {{ customer.lastName }}</td></tr>
          <tr><th>Status</th><td>{{ customer.status }}</td></tr>
          <tr><th>Birthday</th><td>{{ customer.birthday }}</td></tr>
          <tr><th>Public ID</th><td>{{ customer.publicCustomerId }}</td></tr>
          <tr><th>Created</th><td>{{ customer.created }}</td></tr>
          <tr><th>Modified</th><td>{{ customer.modified }}</td></tr>
        </table>

        @if (customer.addresses?.length) {
          <h4>Addresses</h4>
          <table border="1" cellpadding="4">
            <tr><th>Street</th><th>Number</th><th>Zip</th><th>City</th><th>Country</th><th>Type</th><th>Primary</th></tr>
            @for (a of customer.addresses; track a.uuid) {
              <tr><td>{{ a.street }}</td><td>{{ a.streetnumber }}</td><td>{{ a.zipcode }}</td><td>{{ a.city }}</td><td>{{ a.country }}</td><td>{{ a.addressType }}</td><td>{{ a.primary }}</td></tr>
            }
          </table>
        }
        @if (customer.phones?.length) {
          <h4>Phones</h4>
          <table border="1" cellpadding="4">
            <tr><th>Number</th><th>Type</th><th>Primary</th></tr>
            @for (p of customer.phones; track p.uuid) {
              <tr><td>{{ p.number }}</td><td>{{ p.phoneType }}</td><td>{{ p.primary }}</td></tr>
            }
          </table>
        }
        @if (customer.emails?.length) {
          <h4>Emails</h4>
          <table border="1" cellpadding="4">
            <tr><th>Address</th><th>Type</th><th>Primary</th></tr>
            @for (e of customer.emails; track e.uuid) {
              <tr><td>{{ e.address }}</td><td>{{ e.emailType }}</td><td>{{ e.primary }}</td></tr>
            }
          </table>
        }
        @if (customer.consentFlags?.length) {
          <h4>Consent Flags</h4>
          <table border="1" cellpadding="4">
            <tr><th>Type</th><th>Status</th><th>Date</th><th>Withdrawn</th></tr>
            @for (c of customer.consentFlags; track c.uuid) {
              <tr><td>{{ c.consentType }}</td><td>{{ c.consentStatus }}</td><td>{{ c.consentDate }}</td><td>{{ c.consentWithdrawnOn }}</td></tr>
            }
          </table>
        }
      </details>

      <!-- UPDATE CUSTOMER -->
      <details>
        <summary><strong>Update Customer</strong></summary>
        <form (ngSubmit)="updateCustomer()">
          <table>
            <tr><td>Salutation</td><td>
              <select [(ngModel)]="updateForm.salutation" name="uSalutation">
                <option value="MR">MR</option><option value="MS">MS</option>
              </select>
            </td></tr>
            <tr><td>First Name</td><td><input [(ngModel)]="updateForm.firstName" name="uFirstName"></td></tr>
            <tr><td>Last Name</td><td><input [(ngModel)]="updateForm.lastName" name="uLastName"></td></tr>
            <tr><td>Birthday</td><td><input [(ngModel)]="updateForm.birthday" name="uBirthday" type="date"></td></tr>
          </table>
          <button type="submit">Update Customer</button>
        </form>
      </details>

      <!-- DELETE CUSTOMER -->
      <details>
        <summary><strong>Delete Customer</strong></summary>
        <p>UUID: {{ customer.uuid }}</p>
        <button (click)="deleteCustomer()">Delete Customer</button>
      </details>

      <!-- CONSENT MANAGEMENT -->
      <details>
        <summary><strong>Consent Management</strong></summary>
        <div>
          <button (click)="loadConsentFlags()">Refresh Consent Flags</button>
        </div>
        <h4>Grant Consent</h4>
        <select [(ngModel)]="consentType" name="grantConsentType">
          <option value="TERMS_AND_CONDITIONS">TERMS_AND_CONDITIONS</option>
          <option value="ADVERTISING">ADVERTISING</option>
          <option value="TRACKING">TRACKING</option>
          <option value="AI">AI</option>
          <option value="DATA_TRANSFER">DATA_TRANSFER</option>
          <option value="DATA_BACK_TRANSFER">DATA_BACK_TRANSFER</option>
          <option value="FINANCING_ADVERTISING">FINANCING_ADVERTISING</option>
          <option value="FINANCING_PARTNER_ADVERTISING">FINANCING_PARTNER_ADVERTISING</option>
          <option value="FINANCING_ADVERTISING_PH">FINANCING_ADVERTISING_PH</option>
          <option value="REALESTATE_BROKERAGE_ADVERTISING">REALESTATE_BROKERAGE_ADVERTISING</option>
          <option value="FIN_INTEREST_TICKER">FIN_INTEREST_TICKER</option>
          <option value="GROUP_ADVERTISING">GROUP_ADVERTISING</option>
        </select>
        <button (click)="grantConsent()">Grant</button>
        <button (click)="revokeConsent()">Revoke</button>

        @if (consentFlags.length) {
          <table border="1" cellpadding="4">
            <tr><th>Type</th><th>Status</th><th>Date</th><th>Withdrawn</th></tr>
            @for (c of consentFlags; track c.uuid) {
              <tr><td>{{ c.consentType }}</td><td>{{ c.consentStatus }}</td><td>{{ c.consentDate }}</td><td>{{ c.consentWithdrawnOn }}</td></tr>
            }
          </table>
        }
      </details>
    }
  `
})
export class CustomersComponent {
  form = {
    type: 'PERSON', salutation: 'MR', firstName: '', lastName: '', birthday: '',
    street: '', streetnumber: '', zipcode: '', city: '', country: 'DEU',
    email: '', phone: '', duplicateCheck: 'WITH_CHECK'
  };
  updateForm = { salutation: 'MR', firstName: '', lastName: '', birthday: '' };
  message = '';
  searchUuid = '';
  customer: any = null;
  consentType = 'TERMS_AND_CONDITIONS';
  consentFlags: any[] = [];

  private customerFields = `uuid type salutation firstName lastName status birthday publicCustomerId
    addresses { uuid street streetnumber zipcode city country addressType primary }
    phones { uuid number phoneType primary }
    emails { uuid address emailType primary }
    consentFlags { uuid consentType consentStatus consentDate consentWithdrawnOn }
    created modified`;

  constructor(private gql: GraphqlService) {}

  createCustomer() {
    const mutation = `mutation CreateCustomer($customer: CustomerInput!, $duplicateCheck: DuplicateCheckEnum) {
      createCustomer(customer: $customer, duplicateCheck: $duplicateCheck) { ${this.customerFields} }
    }`;
    const variables: any = {
      customer: {
        salutation: this.form.salutation,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        type: this.form.type,
        birthday: this.form.birthday || null,
        addresses: (this.form.street || this.form.city) ? [{
          street: this.form.street, streetnumber: this.form.streetnumber,
          zipcode: this.form.zipcode, city: this.form.city,
          country: this.form.country, addressType: 'PRIVATE', primary: true
        }] : [],
        emails: this.form.email ? [{ address: this.form.email, emailType: 'PRIVATE', primary: true }] : [],
        phones: this.form.phone ? [{ number: this.form.phone, phoneType: 'MOBILE', primary: true }] : []
      },
      duplicateCheck: this.form.duplicateCheck
    };
    this.gql.query<any>('customer', mutation, variables).subscribe({
      next: res => {
        this.customer = res.createCustomer;
        this.searchUuid = this.customer.uuid;
        this.prefillUpdateForm();
        this.message = `Customer created: ${this.customer.uuid}`;
      },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  loadCustomer() {
    if (!this.searchUuid) return;
    const query = `query GetCustomer($uuid: String!) {
      getCustomer(uuid: $uuid) { ${this.customerFields} }
    }`;
    this.gql.query<any>('customer', query, { uuid: this.searchUuid }).subscribe({
      next: res => { this.customer = res.getCustomer; this.prefillUpdateForm(); },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  updateCustomer() {
    const mutation = `mutation UpdateCustomer($uuid: String!, $customer: CustomerInput!) {
      updateCustomer(uuid: $uuid, customer: $customer) { ${this.customerFields} }
    }`;
    const variables = {
      uuid: this.customer.uuid,
      customer: {
        salutation: this.updateForm.salutation,
        firstName: this.updateForm.firstName,
        lastName: this.updateForm.lastName,
        birthday: this.updateForm.birthday || null
      }
    };
    this.gql.query<any>('customer', mutation, variables).subscribe({
      next: res => { this.customer = res.updateCustomer; this.message = 'Customer updated.'; },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  deleteCustomer() {
    const mutation = `mutation DeleteCustomer($uuid: String!) { deleteCustomer(uuid: $uuid) }`;
    this.gql.query<any>('customer', mutation, { uuid: this.customer.uuid }).subscribe({
      next: () => { this.customer = null; this.message = 'Customer deleted.'; },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  loadConsentFlags() {
    const query = `query GetConsentFlags($customerUuid: String!) {
      getConsentFlags(customerUuid: $customerUuid) { uuid consentType consentStatus consentDate consentWithdrawnOn }
    }`;
    this.gql.query<any>('customer', query, { customerUuid: this.customer.uuid }).subscribe({
      next: res => this.consentFlags = res.getConsentFlags || [],
      error: err => this.message = `Error: ${err.message}`
    });
  }

  grantConsent() {
    const mutation = `mutation GrantConsent($customerUuid: String!, $consentType: ConsentTypeEnum!) {
      grantConsent(customerUuid: $customerUuid, consentType: $consentType) { uuid consentType consentStatus consentDate consentWithdrawnOn }
    }`;
    this.gql.query<any>('customer', mutation, { customerUuid: this.customer.uuid, consentType: this.consentType }).subscribe({
      next: () => { this.message = `Consent granted: ${this.consentType}`; this.loadConsentFlags(); },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  revokeConsent() {
    const mutation = `mutation RevokeConsent($customerUuid: String!, $consentType: ConsentTypeEnum!) {
      revokeConsent(customerUuid: $customerUuid, consentType: $consentType) { uuid consentType consentStatus consentDate consentWithdrawnOn }
    }`;
    this.gql.query<any>('customer', mutation, { customerUuid: this.customer.uuid, consentType: this.consentType }).subscribe({
      next: () => { this.message = `Consent revoked: ${this.consentType}`; this.loadConsentFlags(); },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  private prefillUpdateForm() {
    if (!this.customer) return;
    this.updateForm = {
      salutation: this.customer.salutation || 'MR',
      firstName: this.customer.firstName || '',
      lastName: this.customer.lastName || '',
      birthday: this.customer.birthday || ''
    };
  }
}
