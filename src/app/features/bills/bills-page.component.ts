import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MerchantDataService } from '../../core/services/merchant-data.service';

@Component({
  selector: 'app-bills-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bills-page.component.html',
  styleUrl: './bills-page.component.scss'
})
export class BillsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly data = inject(MerchantDataService);

  readonly filterForm = this.fb.nonNullable.group({
    mobileNumber: [''],
    paymentRefId: [''],
    approvalRefNum: [''],
    transactionReferenceId: [''],
    status: [''],
    dateRange: ['']
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());

  readonly bills = computed(() => {
    const filters = this.appliedFilters();

    return this.data.billHistory.filter((bill) => {
      const mobileMatch = !filters.mobileNumber || bill.mobileNumber.includes(filters.mobileNumber);
      const paymentRefMatch = !filters.paymentRefId || bill.paymentRefId.toLowerCase().includes(filters.paymentRefId.toLowerCase());
      const approvalMatch = !filters.approvalRefNum || bill.approvalRefNum.toLowerCase().includes(filters.approvalRefNum.toLowerCase());
      const referenceMatch =
        !filters.transactionReferenceId ||
        bill.transactionReferenceId.toLowerCase().includes(filters.transactionReferenceId.toLowerCase());
      const statusMatch = !filters.status || bill.status.toLowerCase().includes(filters.status.toLowerCase());
      const dateMatch = !filters.dateRange || bill.date.includes(filters.dateRange);

      return mobileMatch && paymentRefMatch && approvalMatch && referenceMatch && statusMatch && dateMatch;
    });
  });

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }
}
