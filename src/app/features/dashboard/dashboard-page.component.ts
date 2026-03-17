import { Component, inject, signal } from '@angular/core';

import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  private readonly data = inject(MerchantDataService);

  readonly paymentLink = this.data.paymentLink;
  readonly schemes = this.data.schemes;
  readonly qrOpen = signal(false);

  copyLink(): void {
    navigator.clipboard?.writeText(this.paymentLink);
  }

  openPaymentLink(): void {
    window.open(this.paymentLink, '_blank', 'noopener,noreferrer');
  }

  toggleQr(): void {
    this.qrOpen.update((value) => !value);
  }
}
