import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthFlowService } from '../../core/services/auth-flow.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-mpin-page',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './mpin-page.component.html',
  styleUrl: './mpin-page.component.scss'
})
export class MpinPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly auth = inject(AuthFlowService);

  readonly errorMessage = signal('');
  readonly form = this.fb.nonNullable.group({
    mpin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    const verified = await this.auth.verifyMpin(this.form.controls.mpin.value);

    if (!verified) {
      this.errorMessage.set('MPIN verification failed. Use the configured development merchant MPIN.');
      return;
    }

    await this.router.navigateByUrl('/dashboard');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
