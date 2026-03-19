import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { BankAccount, Contact } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-payout-page',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './payout-page.component.html',
  styleUrl: './payout-page.component.scss'
})
export class PayoutPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly phoneLookupResult = signal<Contact | null>(null);
  readonly lookupMessage = signal('');
  readonly resultMessage = signal('');
  readonly resultError = signal(false);

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    beneficiaryId: ['', Validators.required],
    amount: [1000, [Validators.required, Validators.min(1)]],
    purpose: ['Vendor settlement', Validators.required]
  });

  readonly beneficiaries = computed(() => {
    const contact = this.phoneLookupResult();
    if (!contact) {
      return [] as BankAccount[];
    }

    return this.data.bankAccounts().filter((item) => item.contactId === contact.id);
  });

  readonly recentPayouts = computed(() =>
    this.data
      .transactions()
      .filter((item) => item.transactionType === 'Payout')
      .slice(0, 8)
  );

  constructor() {
    void Promise.all([this.data.loadBankAccounts(), this.data.loadWalletSummary(), this.data.loadTransactions()]).catch(
      () => undefined
    );
  }

  async searchContact(): Promise<void> {
    const phoneControl = this.form.controls.phoneNumber;
    this.lookupMessage.set('');
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
      this.form.patchValue({ beneficiaryId: '' });
      this.lookupMessage.set('No saved contact found for this phone number.');
      return;
    }

    this.phoneLookupResult.set(contact);
    this.form.patchValue({ beneficiaryId: '' });
    const beneficiaryCount = this.data.bankAccounts().filter((item) => item.contactId === contact.id).length;
    this.lookupMessage.set(
      beneficiaryCount
        ? `Contact verified for ${contact.name}. Select one of the saved beneficiary accounts below.`
        : `Contact verified for ${contact.name}, but no saved beneficiary exists yet.`
    );
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.phoneLookupResult()) {
      this.resultError.set(true);
      this.resultMessage.set('Verify the contact first, then choose a saved beneficiary account.');
      return;
    }

    this.resultMessage.set('');
    this.resultError.set(false);

    try {
      const value = this.form.getRawValue();
      const transaction = await this.data.createPayout({
        beneficiaryId: value.beneficiaryId,
        amount: Number(value.amount),
        currency: 'INR',
        purpose: value.purpose
      });

      this.resultMessage.set(`Payout ${transaction.externalReference} created successfully with status ${transaction.status}.`);
    } catch {
      this.resultError.set(true);
      this.resultMessage.set('Unable to create payout. Confirm a validated beneficiary exists and wallet balance is sufficient.');
    }
  }
}
