import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-complaints-page',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './complaints-page.component.html',
  styleUrl: './complaints-page.component.scss'
})
export class ComplaintsPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly filterForm = this.fb.nonNullable.group({
    complaintId: [''],
    referenceId: [''],
    dateRange: ['']
  });

  readonly complaintForm = this.fb.nonNullable.group({
    referenceId: ['', Validators.required],
    assigned: ['Support Desk', Validators.required],
    description: ['', Validators.required]
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());
  readonly modalOpen = signal(false);

  readonly complaints = computed(() => {
    const filters = this.appliedFilters();

    return this.data.complaints().filter((complaint) => {
      const complaintIdMatch =
        !filters.complaintId || complaint.complaintId.toLowerCase().includes(filters.complaintId.toLowerCase());
      const referenceIdMatch =
        !filters.referenceId || complaint.referenceId.toLowerCase().includes(filters.referenceId.toLowerCase());
      const dateMatch = !filters.dateRange || complaint.date.includes(filters.dateRange);

      return complaintIdMatch && referenceIdMatch && dateMatch;
    });
  });

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }

  openRaiseComplaint(): void {
    this.complaintForm.reset({
      referenceId: '',
      assigned: 'Support Desk',
      description: ''
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
  }

  submitComplaint(): void {
    if (this.complaintForm.invalid) {
      this.complaintForm.markAllAsTouched();
      return;
    }

    this.data.raiseComplaint(this.complaintForm.getRawValue());
    this.applyFilters();
    this.closeModal();
  }
}
