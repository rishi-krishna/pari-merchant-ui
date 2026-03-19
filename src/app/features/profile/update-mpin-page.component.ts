import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthFlowService } from '../../core/services/auth-flow.service';

@Component({
  selector: 'app-update-mpin-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './update-mpin-page.component.html',
  styleUrl: './update-mpin-page.component.scss'
})
export class UpdateMpinPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly auth = inject(AuthFlowService);

  readonly message = signal('');
  readonly isError = signal(false);

  readonly form = this.fb.nonNullable.group({
    oldMpin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    newMpin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
    confirmMpin: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
  });

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { oldMpin, newMpin, confirmMpin } = this.form.getRawValue();

    if (newMpin !== confirmMpin) {
      this.isError.set(true);
      this.message.set('New MPIN and confirm MPIN must match.');
      return;
    }

    try {
      await this.auth.updateMpin(oldMpin, newMpin, confirmMpin);
      this.isError.set(false);
      this.message.set('MPIN updated successfully.');
      this.form.reset({
        oldMpin: '',
        newMpin: '',
        confirmMpin: ''
      });
    } catch {
      this.isError.set(true);
      this.message.set('Unable to update MPIN. Check your current MPIN and try again.');
    }
  }
}
