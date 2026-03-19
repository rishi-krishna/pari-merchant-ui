import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthFlowService } from '../../core/services/auth-flow.service';
import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [DatePipe, AppIconComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  readonly auth = inject(AuthFlowService);
  readonly data = inject(MerchantDataService);
  private readonly router = inject(Router);

  readonly walletAmount = this.data.walletAmountLabel;
  readonly heldAmount = this.data.heldAmountLabel;
  readonly companyName = computed(() => this.data.kycInfo().companyName || 'Pari');
  readonly contactsCount = computed(() => this.data.contacts().length);
  readonly beneficiariesCount = computed(() => this.data.bankAccounts().length);
  readonly transactions = computed(() => this.data.transactions().slice(0, 6));

  constructor() {
    void Promise.all([
      this.data.loadWalletSummary(),
      this.data.loadTransactions(),
      this.data.loadContacts(),
      this.data.loadBankAccounts(),
      this.data.loadKycInfo()
    ]).catch(() => undefined);
  }

  openLoadMoney(): void {
    void this.router.navigate(['/dashboard/bank-accounts/load-money']);
  }

  openPayout(): void {
    void this.router.navigate(['/dashboard/bank-accounts/load-money/payout']);
  }

  openContacts(): void {
    void this.router.navigate(['/dashboard/contacts']);
  }

  openBeneficiaries(): void {
    void this.router.navigate(['/dashboard/bank-accounts']);
  }
}
