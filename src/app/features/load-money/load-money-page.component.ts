import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { cashfreeHostedCheckoutUrl } from '../../core/config/payment-gateway.config';
import { Contact } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-load-money-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './load-money-page.component.html',
  styleUrl: './load-money-page.component.scss'
})
export class LoadMoneyPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly phoneLookupResult = signal<Contact | null>(null);
  readonly lookupMessage = signal('');
  readonly resultMessage = signal('');
  readonly resultError = signal(false);
  readonly gatewayOptions = ['Cashfree'];

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    gateway: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  async searchContact(): Promise<void> {
    const phoneControl = this.form.controls.phoneNumber;
    this.resultMessage.set('');
    this.resultError.set(false);

    if (phoneControl.invalid) {
      phoneControl.markAsTouched();
      this.phoneLookupResult.set(null);
      this.lookupMessage.set('Enter a valid 10 digit phone number to search contacts.');
      return;
    }

    const contact = await this.data.lookupContactByPhone(phoneControl.value);

    if (!contact) {
      this.phoneLookupResult.set(null);
      this.lookupMessage.set('No saved contact found for this phone number.');
      return;
    }

    this.phoneLookupResult.set(contact);
    this.lookupMessage.set(`Contact verified for ${contact.name}.`);
  }

  openGateway(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.resultError.set(true);
      this.resultMessage.set('Enter a valid phone number, select Cashfree, and add an amount.');
      return;
    }

    if (!this.phoneLookupResult()) {
      this.resultError.set(true);
      this.resultMessage.set('Search and verify an existing contact before continuing.');
      return;
    }

    if (cashfreeHostedCheckoutUrl.includes('replace-with-your-cashfree-link')) {
      this.resultError.set(true);
      this.resultMessage.set('Set your Cashfree hosted checkout URL in payment-gateway.config.ts before continuing.');
      return;
    }

    this.resultError.set(false);
    this.resultMessage.set('Opening Cashfree checkout...');
    const paymentWindow = window.open(cashfreeHostedCheckoutUrl, '_blank', 'noopener');

    if (!paymentWindow) {
      window.location.href = cashfreeHostedCheckoutUrl;
    }
  }
}
