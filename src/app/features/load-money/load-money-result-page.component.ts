import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { LoadMoneyResult } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-load-money-result-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './load-money-result-page.component.html',
  styleUrl: './load-money-result-page.component.scss'
})
export class LoadMoneyResultPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly data = inject(MerchantDataService);

  readonly loading = signal(true);
  readonly result = signal<LoadMoneyResult | null>(null);
  readonly error = signal('');
  readonly redirectCountdown = signal<number | null>(null);

  constructor() {
    void this.loadResult();
  }

  async refresh(): Promise<void> {
    await this.loadResult();
  }

  statusClass(): string {
    return `is-${this.result()?.status ?? 'unknown'}`;
  }

  private async loadResult(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    const query = this.route.snapshot.queryParamMap;
    const orderId = query.get('order_id') ?? query.get('orderId') ?? query.get('cf_order_id');
    const providerTransactionId =
      query.get('transaction_id') ?? query.get('providerTransactionId') ?? query.get('cf_payment_id');
    const fallbackStatus = this.normalizeStatus(
      query.get('order_status') ?? query.get('txStatus') ?? query.get('status') ?? 'pending'
    );

    try {
      if (!orderId && !providerTransactionId) {
        this.result.set({
          found: false,
          status: fallbackStatus,
          message: 'Payment form returned without a payment reference. Check Cashfree redirect settings and webhook delivery.',
          transactionId: null,
          orderId: null,
          providerTransactionId: null,
          amount: null,
          currency: 'INR',
          reference: null,
          description: null,
          createdUtc: null
        });
        return;
      }

      await this.fetchWithPolling(orderId, providerTransactionId, fallbackStatus);

      const result = this.result();
      if (result?.status === 'success') {
        this.startRedirectCountdown(4);
      } else if (result?.status === 'pending') {
        this.startRedirectCountdown(6);
      }
    } catch {
      this.error.set('Unable to load payment status right now.');
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchWithPolling(
    orderId: string | null,
    providerTransactionId: string | null,
    fallbackStatus: string
  ): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await this.data.getLoadMoneyResult(orderId, providerTransactionId);
      this.result.set({
        ...response,
        status: this.normalizeStatus(response.status || fallbackStatus)
      });

      if (response.found || this.normalizeStatus(response.status) === 'failed') {
        return;
      }

      await this.delay(2500);
    }
  }

  private normalizeStatus(status: string): string {
    const normalized = status.trim().toLowerCase();
    if (normalized === 'success' || normalized === 'pending' || normalized === 'failed') {
      return normalized;
    }

    if (normalized === 'paid') {
      return 'success';
    }

    return 'unknown';
  }

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      const timeoutId = setTimeout(resolve, milliseconds);
      this.destroyRef.onDestroy(() => clearTimeout(timeoutId));
    });
  }

  private startRedirectCountdown(seconds: number): void {
    this.redirectCountdown.set(seconds);

    const intervalId = setInterval(() => {
      const current = this.redirectCountdown();
      if (current === null) {
        clearInterval(intervalId);
        return;
      }

      if (current <= 1) {
        clearInterval(intervalId);
        void this.returnToLoadMoney();
        return;
      }

      this.redirectCountdown.set(current - 1);
    }, 1000);

    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  private async returnToLoadMoney(): Promise<void> {
    const result = this.result();
    await this.router.navigate(['/dashboard/bank-accounts/load-money'], {
      queryParams: {
        paymentStatus: result?.status ?? 'pending',
        paymentMessage: result?.message ?? 'Payment submitted.',
        orderId: result?.orderId ?? undefined,
        reference: result?.reference ?? undefined
      },
      replaceUrl: true
    });
  }
}
