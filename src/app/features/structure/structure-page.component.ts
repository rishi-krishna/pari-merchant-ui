import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-structure-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './structure-page.component.html',
  styleUrl: './structure-page.component.scss'
})
export class StructurePageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(MerchantDataService);

  readonly gateways = [...new Set(this.data.commissionMethods.map((row) => row.gateway))];

  readonly filterForm = this.fb.nonNullable.group({
    gateway: [''],
    cardType: [''],
    cardIssuer: [''],
    partner: ['']
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());

  readonly methods = computed(() => {
    const filters = this.appliedFilters();

    return this.data.commissionMethods.filter((row) => {
      const gatewayMatch = !filters.gateway || row.gateway === filters.gateway;
      const cardTypeMatch = !filters.cardType || row.cardType.toLowerCase().includes(filters.cardType.toLowerCase());
      const cardIssuerMatch = !filters.cardIssuer || row.cardIssuer.toLowerCase().includes(filters.cardIssuer.toLowerCase());
      const partnerMatch = !filters.partner || row.partner.toLowerCase().includes(filters.partner.toLowerCase());

      return gatewayMatch && cardTypeMatch && cardIssuerMatch && partnerMatch;
    });
  });

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }
}
