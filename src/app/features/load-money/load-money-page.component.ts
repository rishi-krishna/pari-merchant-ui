import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-load-money-page',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './load-money-page.component.html',
  styleUrl: './load-money-page.component.scss'
})
export class LoadMoneyPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly flow = signal<'collection' | 'self-topup'>('collection');
  readonly resultMessage = signal('');
  readonly resultError = signal(false);

  readonly form = this.fb.nonNullable.group({
    customerName: ['Walk-in Customer', Validators.required],
    amount: [5000, [Validators.required, Validators.min(1)]],
    cardBrand: ['Visa', Validators.required],
    maskedCardNumber: ['411111XXXXXX1111', Validators.required],
    providerTokenReference: ['tok_demo_001', Validators.required],
    description: ['Merchant wallet load', Validators.required]
  });

  readonly recentTransactions = computed(() =>
    this.data
      .transactions()
      .filter((item) => item.transactionType === 'CardCollection' || item.transactionType === 'SelfTopup')
      .slice(0, 8)
  );

  constructor() {
    void Promise.all([this.data.loadWalletSummary(), this.data.loadTransactions(), this.data.loadLedger()]).catch(
      () => undefined
    );
  }

  setFlow(flow: 'collection' | 'self-topup'): void {
    this.flow.set(flow);
    this.resultMessage.set('');
    this.resultError.set(false);
    this.form.patchValue({
      description: flow === 'collection' ? 'Customer card collection' : 'Merchant self topup'
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.resultMessage.set('');
    this.resultError.set(false);

    const value = this.form.getRawValue();

    try {
      const transaction =
        this.flow() === 'collection'
          ? await this.data.initiateCollection({
              amount: Number(value.amount),
              currency: 'INR',
              customerName: value.customerName,
              cardBrand: value.cardBrand,
              maskedCardNumber: value.maskedCardNumber,
              providerTokenReference: value.providerTokenReference,
              description: value.description
            })
          : await this.data.initiateSelfTopup({
              amount: Number(value.amount),
              currency: 'INR',
              cardBrand: value.cardBrand,
              maskedCardNumber: value.maskedCardNumber,
              providerTokenReference: value.providerTokenReference,
              description: value.description
            });

      this.resultMessage.set(
        `${transaction.transactionType} created with reference ${transaction.externalReference}. Status: ${transaction.status}.`
      );
    } catch {
      this.resultError.set(true);
      this.resultMessage.set('Unable to initiate load-money flow. Make sure the backend API is running.');
    }
  }
}
