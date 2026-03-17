import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-properties',
  imports: [FormsModule],
  template: `
    <h2>Properties</h2>

    <!-- CREATE PROPERTY -->
    <details open>
      <summary><strong>Create Property</strong></summary>
      <form (ngSubmit)="createProperty()">
        <table>
          <tr><td>Customer UUID *</td><td><input [(ngModel)]="form.customerUuid" name="customerUuid" required size="40"></td></tr>
          <tr><td>Property Type</td><td>
            <select [(ngModel)]="form.propertyType" name="propertyType">
              <option value="FLAT">FLAT</option><option value="HOUSE">HOUSE</option>
            </select>
          </td></tr>
          <tr><td>Property SubType</td><td>
            <select [(ngModel)]="form.propertySubType" name="propertySubType">
              <option value="">-- none --</option>
              <option value="FLAT_APARTMENT">FLAT_APARTMENT</option>
              <option value="FLAT_PENTHOUSE">FLAT_PENTHOUSE</option>
              <option value="HOUSE_DETACHED">HOUSE_DETACHED</option>
              <option value="HOUSE_SEMI_DETACHED">HOUSE_SEMI_DETACHED</option>
            </select>
          </td></tr>
          <tr><td>Building Year</td><td><input [(ngModel)]="form.buildingYear" name="buildingYear" type="number"></td></tr>
          <tr><td>Living Area (m2)</td><td><input [(ngModel)]="form.livingArea" name="livingArea" type="number" step="0.1"></td></tr>
          <tr><td>Land Area (m2)</td><td><input [(ngModel)]="form.landArea" name="landArea" type="number" step="0.1"></td></tr>
          <tr><td>Residential Units</td><td><input [(ngModel)]="form.numberOfResidentialUnits" name="units" type="number"></td></tr>
          <tr><td>Street</td><td><input [(ngModel)]="form.street" name="street"></td></tr>
          <tr><td>Street Number</td><td><input [(ngModel)]="form.streetnumber" name="streetnumber"></td></tr>
          <tr><td>Zip Code</td><td><input [(ngModel)]="form.zipcode" name="zipcode"></td></tr>
          <tr><td>City</td><td><input [(ngModel)]="form.city" name="city"></td></tr>
          <tr><td>Country</td><td><input [(ngModel)]="form.country" name="country" value="DE"></td></tr>
        </table>
        <button type="submit">Create Property</button>
      </form>
    </details>

    @if (message) { <p><strong>{{ message }}</strong></p> }

    <!-- GET SINGLE PROPERTY -->
    <details open>
      <summary><strong>Get Property by ID</strong></summary>
      <input [(ngModel)]="searchPropertyId" placeholder="Property ID" size="40">
      <button (click)="loadProperty()">Load</button>
    </details>

    @if (singleProperty) {
      <table border="1" cellpadding="4">
        <tr><th>Property ID</th><td>{{ singleProperty.propertyId }}</td></tr>
        <tr><th>Customer UUID</th><td>{{ singleProperty.customerUuid }}</td></tr>
        <tr><th>Dossier ID</th><td>{{ singleProperty.dossierId }}</td></tr>
        <tr><th>Type</th><td>{{ singleProperty.propertyType }}</td></tr>
        <tr><th>SubType</th><td>{{ singleProperty.propertySubType }}</td></tr>
        <tr><th>Building Year</th><td>{{ singleProperty.buildingYear }}</td></tr>
        <tr><th>Living Area</th><td>{{ singleProperty.livingArea }} m2</td></tr>
        <tr><th>Land Area</th><td>{{ singleProperty.landArea }} m2</td></tr>
        <tr><th>Units</th><td>{{ singleProperty.numberOfResidentialUnits }}</td></tr>
        <tr><th>Address</th><td>{{ singleProperty.address?.street }} {{ singleProperty.address?.streetnumber }}, {{ singleProperty.address?.zipcode }} {{ singleProperty.address?.city }} {{ singleProperty.address?.country }}</td></tr>
        <tr><th>Created</th><td>{{ singleProperty.createdAt }}</td></tr>
        <tr><th>Modified</th><td>{{ singleProperty.modifiedAt }}</td></tr>
      </table>
    }

    <!-- GET PROPERTIES BY CUSTOMER -->
    <details open>
      <summary><strong>Get Properties by Customer UUID</strong></summary>
      <input [(ngModel)]="searchCustomerUuid" placeholder="Customer UUID" size="40">
      <button (click)="loadProperties()">Load</button>
    </details>

    @if (properties.length > 0) {
      <table border="1" cellpadding="4">
        <tr><th>Property ID</th><th>Type</th><th>SubType</th><th>Year</th><th>Living Area</th><th>Land Area</th><th>Units</th><th>Address</th><th>Dossier ID</th><th>Created</th></tr>
        @for (p of properties; track p.propertyId) {
          <tr>
            <td>{{ p.propertyId }}</td>
            <td>{{ p.propertyType }}</td>
            <td>{{ p.propertySubType }}</td>
            <td>{{ p.buildingYear }}</td>
            <td>{{ p.livingArea }}</td>
            <td>{{ p.landArea }}</td>
            <td>{{ p.numberOfResidentialUnits }}</td>
            <td>{{ p.address?.street }} {{ p.address?.streetnumber }}, {{ p.address?.zipcode }} {{ p.address?.city }}</td>
            <td>{{ p.dossierId }}</td>
            <td>{{ p.createdAt }}</td>
          </tr>
        }
      </table>
    }
  `
})
export class PropertiesComponent {
  form = {
    customerUuid: '', propertyType: 'FLAT', propertySubType: 'FLAT_APARTMENT',
    buildingYear: 1990, livingArea: 85, landArea: 0, numberOfResidentialUnits: 1,
    street: '', streetnumber: '', zipcode: '', city: '', country: 'DE'
  };
  message = '';
  searchPropertyId = '';
  searchCustomerUuid = '';
  singleProperty: any = null;
  properties: any[] = [];

  private propertyFields = `propertyId customerUuid dossierId propertyType propertySubType
    buildingYear livingArea landArea numberOfResidentialUnits
    address { street streetnumber zipcode city country }
    createdAt modifiedAt`;

  constructor(private gql: GraphqlService) {}

  createProperty() {
    const mutation = `mutation CreateProperty($input: PropertyInput!) {
      createProperty(input: $input) { ${this.propertyFields} }
    }`;
    const variables = {
      input: {
        customerUuid: this.form.customerUuid,
        propertyType: this.form.propertyType,
        propertySubType: this.form.propertySubType || null,
        buildingYear: this.form.buildingYear,
        livingArea: this.form.livingArea,
        landArea: this.form.landArea || null,
        numberOfResidentialUnits: this.form.numberOfResidentialUnits,
        address: {
          street: this.form.street, streetnumber: this.form.streetnumber,
          zipcode: this.form.zipcode, city: this.form.city, country: this.form.country
        }
      }
    };
    this.gql.query<any>('property', mutation, variables).subscribe({
      next: res => {
        this.singleProperty = res.createProperty;
        this.searchPropertyId = this.singleProperty.propertyId;
        this.searchCustomerUuid = this.form.customerUuid;
        this.message = `Property created: ${this.singleProperty.propertyId}`;
      },
      error: err => this.message = `Error: ${err.message}`
    });
  }

  loadProperty() {
    if (!this.searchPropertyId) return;
    const query = `query GetProperty($propertyId: String!) {
      getProperty(propertyId: $propertyId) { ${this.propertyFields} }
    }`;
    this.gql.query<any>('property', query, { propertyId: this.searchPropertyId }).subscribe({
      next: res => this.singleProperty = res.getProperty,
      error: err => this.message = `Error: ${err.message}`
    });
  }

  loadProperties() {
    if (!this.searchCustomerUuid) return;
    const query = `query GetProperties($customerUuid: String!) {
      getProperties(customerUuid: $customerUuid) { ${this.propertyFields} }
    }`;
    this.gql.query<any>('property', query, { customerUuid: this.searchCustomerUuid }).subscribe({
      next: res => this.properties = res.getProperties || [],
      error: err => this.message = `Error: ${err.message}`
    });
  }
}
