import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Contact } from '../../core/models/merchant.models';
import { CashfreeCheckoutService } from '../../core/services/cashfree-checkout.service';
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
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly data = inject(MerchantDataService);
  private readonly cashfreeCheckout = inject(CashfreeCheckoutService);

  readonly phoneLookupResult = signal<Contact | null>(null);
  readonly lookupMessage = signal('');
  readonly resultMessage = signal('');
  readonly resultError = signal(false);
  readonly isSubmitting = signal(false);
  readonly paymentBanner = signal<{ status: string; message: string; orderId?: string; reference?: string } | null>(null);
  readonly gatewayOptions = ['Cashfree'];

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    gateway: ['', Validators.required],
    amount: ['', [Validators.required, Validators.min(1)]]
  });

  constructor() {
    const query = this.route.snapshot.queryParamMap;
    const paymentMessage = query.get('paymentMessage');
    const paymentStatus = query.get('paymentStatus');

    if (paymentMessage && paymentStatus) {
      this.paymentBanner.set({
        status: paymentStatus,
        message: paymentMessage,
        orderId: query.get('orderId') ?? undefined,
        reference: query.get('reference') ?? undefined
      });

      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {},
        replaceUrl: true
      });
    }
  }

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

  async openGateway(): Promise<void> {
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

    this.isSubmitting.set(true);
    this.resultError.set(false);
    this.resultMessage.set('Creating a secure Cashfree checkout session...');

    try {
      const order = await this.data.createCashfreeCheckoutOrder({
        contactId: this.phoneLookupResult()!.id,
        amount: Number(this.form.controls.amount.value),
        currency: 'INR'
      });

      this.resultMessage.set('Opening Cashfree secure checkout...');
      await this.cashfreeCheckout.openModal(order.paymentSessionId);

      await this.router.navigate(['/dashboard/bank-accounts/load-money/result'], {
        queryParams: {
          orderId: order.orderId,
          cf_order_id: order.cfOrderId
        }
      });
    } catch (error) {
      this.resultError.set(true);
      this.resultMessage.set(
        error instanceof Error ? error.message : 'Unable to open Cashfree checkout right now.'
      );
    } finally {
      this.isSubmitting.set(false);
    }
  }

  dismissPaymentBanner(): void {
    this.paymentBanner.set(null);
  }
}
