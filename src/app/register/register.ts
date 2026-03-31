import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphqlService } from '../graphql.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  template: `
    <h2>Register User</h2>

    <form (ngSubmit)="register()">
      <table>
        <tr><td>Username *</td><td><input [(ngModel)]="form.username" name="username" required placeholder="e.g. john.doe@example.com"></td></tr>
        <tr><td>Password *</td><td><input [(ngModel)]="form.password" name="password" type="password" required></td></tr>
        <tr><td>First Name</td><td><input [(ngModel)]="form.firstName" name="firstName"></td></tr>
        <tr><td>Last Name</td><td><input [(ngModel)]="form.lastName" name="lastName"></td></tr>
      </table>
      <button type="submit">Register</button>
    </form>

    @if (message) { <p><strong>{{ message }}</strong></p> }

    @if (result) {
      <details open>
        <summary><strong>Registered User</strong></summary>
        <table border="1" cellpadding="4">
          <tr><th>User UUID</th><td>{{ result.userUuid }}</td></tr>
          <tr><th>Username</th><td>{{ result.username }}</td></tr>
          <tr><th>First Name</th><td>{{ result.firstName }}</td></tr>
          <tr><th>Last Name</th><td>{{ result.lastName }}</td></tr>
          <tr><th>Tenant ID</th><td>{{ result.tenantId }}</td></tr>
        </table>
      </details>
      <p>You can now <a href="/oauth2/authorization/immobanking-auth">log in</a> with your credentials.</p>
    }
  `
})
export class RegisterComponent {
  form = { username: '', password: '', firstName: '', lastName: '' };
  message = '';
  result: any = null;

  constructor(private gql: GraphqlService) {}

  register() {
    const mutation = `mutation RegisterUser($input: RegisterUserInput!) {
      registerUser(input: $input) { userUuid username firstName lastName tenantId }
    }`;
    const variables = {
      input: {
        username: this.form.username,
        password: this.form.password,
        firstName: this.form.firstName || null,
        lastName: this.form.lastName || null
      }
    };
    this.gql.query<any>('auth', mutation, variables).subscribe({
      next: res => {
        this.result = res.registerUser;
        this.message = `User registered successfully: ${this.result.username}`;
      },
      error: err => this.message = `Error: ${err.message}`
    });
  }
}
