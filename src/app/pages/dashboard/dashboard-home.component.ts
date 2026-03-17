import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AnnouncementPopupComponent } from '../../shared/components/announcement-popup/announcement-popup.component';
import { PaymentCardComponent } from '../../shared/components/payment-card/payment-card.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [AnnouncementPopupComponent, DatePipe, PaymentCardComponent, StatCardComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {
  readonly data = inject(MerchantDataService);
  private readonly router = inject(Router);

  readonly announcement = this.data.announcement;
  readonly schemes = this.data.schemes;
  readonly paymentLink = this.data.paymentLink;
  readonly announcementVisible = signal(true);
  readonly qrOpen = signal(false);
  readonly walletAmount = this.data.walletAmountLabel;
  readonly heldAmount = this.data.heldAmountLabel;
  readonly transactions = computed(() => this.data.transactions().slice(0, 5));

  constructor() {
    void Promise.all([this.data.loadWalletSummary(), this.data.loadTransactions()]).catch(() => undefined);
  }

  hideAnnouncement(): void {
    this.announcementVisible.set(false);
  }

  copyLink(): void {
    navigator.clipboard?.writeText(this.paymentLink);
  }

  openLink(): void {
    window.open(this.paymentLink, '_blank', 'noopener,noreferrer');
  }

  toggleQr(): void {
    this.qrOpen.update((value) => !value);
  }

  openLoadMoney(): void {
    void this.router.navigate(['/dashboard/load-money']);
  }

  openPayout(): void {
    void this.router.navigate(['/dashboard/payout']);
  }
}
