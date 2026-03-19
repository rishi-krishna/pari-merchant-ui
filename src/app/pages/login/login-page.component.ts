import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthFlowService } from '../../core/services/auth-flow.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthFlowService);

  readonly form = this.fb.nonNullable.group({
    mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    password: ['', Validators.required],
    rememberMe: [true]
  });

  errorMessage = '';

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';

    try {
      await this.auth.submitLogin(this.form.controls.mobileNumber.value, this.form.controls.password.value);
      await this.router.navigateByUrl('/mpin');
    } catch {
      this.errorMessage = 'Login failed. Check the mobile number and password, then try again.';
    }
  }
}
