import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-bank-accounts-page',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './bank-accounts-page.component.html',
  styleUrl: './bank-accounts-page.component.scss'
})
export class BankAccountsPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  readonly data = inject(MerchantDataService);

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    phone: [''],
    bankName: [''],
    accountNumber: [''],
    ifsc: ['']
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());

  constructor() {
    void this.data.loadBankAccounts().catch(() => undefined);
  }

  readonly accounts = computed(() => {
    const filters = this.appliedFilters();

    return this.data.bankAccounts().filter((account) => {
      const nameMatch = !filters.name || account.contactName.toLowerCase().includes(filters.name.toLowerCase());
      const phoneMatch = !filters.phone || account.phone.includes(filters.phone);
      const bankMatch = !filters.bankName || account.bankName.toLowerCase().includes(filters.bankName.toLowerCase());
      const accountMatch = !filters.accountNumber || account.accountNumber.includes(filters.accountNumber);
      const ifscMatch = !filters.ifsc || account.ifsc.toLowerCase().includes(filters.ifsc.toLowerCase());

      return nameMatch && phoneMatch && bankMatch && accountMatch && ifscMatch;
    });
  });

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }

  openCreateAccount(): void {
    this.router.navigate(['/dashboard/bank-accounts/create-beneficiary']);
  }

  async deleteAccount(accountId: string): Promise<void> {
    await this.data.deleteBankAccount(accountId);
    this.applyFilters();
  }
}
