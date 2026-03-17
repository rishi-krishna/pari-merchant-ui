import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Contact } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-pay-bills-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pay-bills-page.component.html',
  styleUrl: './pay-bills-page.component.scss'
})
export class PayBillsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(MerchantDataService);

  readonly phoneLookupResult = signal<Contact | null>(null);
  readonly lookupMessage = signal('');
  readonly gatewayOptions = this.data.paymentGatewayOptions;

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    gateway: [this.gatewayOptions[0] ?? '', Validators.required],
    amount: ['', Validators.required]
  });

  readonly savedLinks = computed(() => this.data.paymentLinks());

  async searchContact(): Promise<void> {
    if (this.form.controls.phoneNumber.invalid) {
      this.form.controls.phoneNumber.markAsTouched();
      return;
    }

    const contact = await this.data.lookupContactByPhone(this.form.controls.phoneNumber.value);

    if (!contact) {
      this.phoneLookupResult.set(null);
      this.lookupMessage.set('No contact found for this phone number.');
      return;
    }

    this.phoneLookupResult.set(contact);
    this.lookupMessage.set(`Ready to create a link for ${contact.name}.`);
  }

  payNow(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.data.createPaymentLink(this.form.getRawValue());
    this.lookupMessage.set('Dummy payment link created successfully.');
  }
}
