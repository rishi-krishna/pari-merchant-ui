import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

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

  readonly resultMessage = signal('');
  readonly resultError = signal(false);

  readonly form = this.fb.nonNullable.group({
    beneficiaryId: ['', Validators.required],
    amount: [1000, [Validators.required, Validators.min(1)]],
    purpose: ['Vendor settlement', Validators.required]
  });

  readonly beneficiaries = this.data.bankAccounts;
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

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
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
