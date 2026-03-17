import { Component, inject } from '@angular/core';

import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-kyc-page',
  standalone: true,
  imports: [AppIconComponent],
  templateUrl: './kyc-page.component.html',
  styleUrl: './kyc-page.component.scss'
})
export class KycPageComponent {
  private readonly data = inject(MerchantDataService);
  readonly kyc = this.data.kycInfo;

  constructor() {
    void this.data.loadKycInfo().catch(() => undefined);
  }
}
