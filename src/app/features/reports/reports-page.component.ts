import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-reports-page',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './reports-page.component.html',
  styleUrl: './reports-page.component.scss'
})
export class ReportsPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly filterForm = this.fb.nonNullable.group({
    type: [''],
    status: [''],
    reference: ['']
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());
  readonly transactions = computed(() => {
    const filters = this.appliedFilters();

    return this.data.transactions().filter((transaction) => {
      const typeMatch =
        !filters.type || transaction.transactionType.toLowerCase().includes(filters.type.toLowerCase());
      const statusMatch =
        !filters.status || transaction.status.toLowerCase().includes(filters.status.toLowerCase());
      const referenceMatch =
        !filters.reference || transaction.externalReference.toLowerCase().includes(filters.reference.toLowerCase());

      return typeMatch && statusMatch && referenceMatch;
    });
  });

  readonly totalVolume = computed(() =>
    this.transactions().reduce((sum, transaction) => sum + transaction.amount, 0)
  );

  constructor() {
    void this.data.loadTransactions().catch(() => undefined);
  }

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }
}
