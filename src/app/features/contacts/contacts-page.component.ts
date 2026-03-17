import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Contact } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';
import { AppIconComponent } from '../../shared/app-icon.component';

@Component({
  selector: 'app-contacts-page',
  standalone: true,
  imports: [ReactiveFormsModule, AppIconComponent],
  templateUrl: './contacts-page.component.html',
  styleUrl: './contacts-page.component.scss'
})
export class ContactsPageComponent {
  private readonly fb = inject(FormBuilder);
  readonly data = inject(MerchantDataService);

  readonly filterForm = this.fb.nonNullable.group({
    name: [''],
    email: [''],
    phone: ['']
  });

  readonly contactForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    city: ['Hyderabad', Validators.required],
    status: ['Active' as Contact['status'], Validators.required]
  });

  readonly appliedFilters = signal(this.filterForm.getRawValue());
  readonly modalOpen = signal(false);
  readonly editingContactId = signal<string | null>(null);
  readonly formMessage = signal('');
  readonly formMessageIsError = signal(false);

  readonly contacts = computed(() => {
    const filters = this.appliedFilters();

    return this.data.contacts().filter((contact) => {
      const nameMatch = !filters.name || contact.name.toLowerCase().includes(filters.name.toLowerCase());
      const emailMatch = !filters.email || contact.email.toLowerCase().includes(filters.email.toLowerCase());
      const phoneMatch = !filters.phone || contact.phone.includes(filters.phone);
      return nameMatch && emailMatch && phoneMatch;
    });
  });

  readonly modalTitle = computed(() => (this.editingContactId() ? 'Edit Contact' : 'Add Contact'));

  constructor() {
    void this.data.loadContacts().catch(() => undefined);
  }

  applyFilters(): void {
    this.appliedFilters.set(this.filterForm.getRawValue());
  }

  openCreateContact(): void {
    this.editingContactId.set(null);
    this.formMessage.set('');
    this.formMessageIsError.set(false);
    this.contactForm.reset({
      name: '',
      email: '',
      phone: '',
      city: 'Hyderabad',
      status: 'Active'
    });
    this.modalOpen.set(true);
  }

  openEditContact(contact: Contact): void {
    this.editingContactId.set(contact.id);
    this.formMessage.set('For security, masked phone and email cannot be prefilled. Enter them again to save updates.');
    this.formMessageIsError.set(false);
    this.contactForm.reset({
      name: contact.name,
      email: '',
      phone: '',
      city: contact.city,
      status: contact.status
    });
    this.modalOpen.set(true);
  }

  closeModal(): void {
    this.modalOpen.set(false);
    this.formMessage.set('');
    this.formMessageIsError.set(false);
  }

  async saveContact(): Promise<void> {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.formMessage.set('');
    this.formMessageIsError.set(false);

    try {
      await this.data.saveContact({
        id: this.editingContactId() ?? undefined,
        ...this.contactForm.getRawValue()
      });
    } catch {
      this.formMessage.set('Unable to save contact. Confirm the backend is running and try again.');
      this.formMessageIsError.set(true);
      return;
    }

    this.applyFilters();
    this.closeModal();
  }
}
