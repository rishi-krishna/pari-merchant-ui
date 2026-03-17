import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Contact } from '../../core/models/merchant.models';
import { MerchantDataService } from '../../core/services/merchant-data.service';

interface BankOption {
  name: string;
  ifsc: string;
  branch: string;
}

@Component({
  selector: 'app-create-beneficiary-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-beneficiary-page.component.html',
  styleUrl: './create-beneficiary-page.component.scss'
})
export class CreateBeneficiaryPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly data = inject(MerchantDataService);

  readonly bankOptions: BankOption[] = [
    { name: 'Sample Bank One', ifsc: 'SAMP0001001', branch: 'Central Branch' },
    { name: 'Sample Bank Two', ifsc: 'SAMP0001002', branch: 'North Branch' },
    { name: 'Sample Bank Three', ifsc: 'SAMP0001003', branch: 'South Branch' },
    { name: 'Sample Bank Four', ifsc: 'SAMP0001004', branch: 'West Branch' }
  ];

  readonly matchedContact = signal<Contact | null>(null);
  readonly lookupMessage = signal('');
  readonly accountMessage = signal('');
  readonly accountValidated = signal(false);

  readonly form = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    bankName: [this.bankOptions[0]?.name ?? '', Validators.required],
    ifsc: [this.bankOptions[0]?.ifsc ?? '', Validators.required],
    accountNumber: ['', [Validators.required, Validators.pattern(/^\d{8,20}$/)]],
    beneficiary: ['', Validators.required]
  });

  constructor() {
    this.form.controls.bankName.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((bankName) => {
      const bank = this.findBank(bankName);
      this.form.controls.ifsc.setValue(bank?.ifsc ?? '');
      this.accountValidated.set(false);
      this.accountMessage.set('');
    });

    this.form.controls.accountNumber.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.accountValidated.set(false);
      this.accountMessage.set('');
    });

    this.form.controls.beneficiary.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.accountValidated.set(false);
      this.accountMessage.set('');
    });
  }

  async searchContact(): Promise<void> {
    const phoneControl = this.form.controls.phoneNumber;

    if (phoneControl.invalid) {
      phoneControl.markAsTouched();
      this.matchedContact.set(null);
      this.lookupMessage.set('Enter a valid 10 digit phone number to search contacts.');
      return;
    }

    const contact = await this.data.lookupContactByPhone(phoneControl.value);

    if (!contact) {
      this.matchedContact.set(null);
      this.lookupMessage.set('No saved contact found for this phone number.');
      this.form.controls.beneficiary.setValue('');
      return;
    }

    this.matchedContact.set(contact);
    this.lookupMessage.set(`Matched contact: ${contact.name}`);
    this.form.controls.beneficiary.setValue(contact.name);
  }

  async validateAccount(): Promise<void> {
    if (!this.ensureReady()) {
      return;
    }

    const formValue = this.form.getRawValue();
    const contact = this.matchedContact();
    const bank = this.findBank(formValue.bankName);

    if (!contact || !bank) {
      this.accountValidated.set(false);
      this.accountMessage.set('Select a valid bank and contact before validation.');
      return;
    }

    try {
      const validated = await this.data.validateBeneficiary({
        contactId: contact.id,
        accountHolderName: formValue.beneficiary,
        accountNumber: formValue.accountNumber,
        bankName: bank.name,
        ifsc: bank.ifsc,
        branch: bank.branch,
        accountType: 'Savings'
      });

      this.accountValidated.set(true);
      this.accountMessage.set(`Account validated successfully for ${validated.accountHolderName}.`);
    } catch {
      this.accountValidated.set(false);
      this.accountMessage.set('Account validation failed. Check the details and confirm the backend is running.');
    }
  }

  async addNow(): Promise<void> {
    if (!this.ensureReady()) {
      return;
    }

    const formValue = this.form.getRawValue();
    const bank = this.findBank(formValue.bankName);
    const contact = this.matchedContact();

    if (!contact || !bank) {
      this.accountMessage.set('Select a valid bank and contact before adding the beneficiary.');
      return;
    }

    try {
      await this.data.addBankAccount({
        contactId: contact.id,
        accountHolderName: formValue.beneficiary,
        accountNumber: formValue.accountNumber,
        bankName: bank.name,
        ifsc: bank.ifsc,
        branch: bank.branch,
        accountType: 'Savings'
      });

      await this.router.navigate(['/dashboard/bank-accounts']);
    } catch {
      this.accountValidated.set(false);
      this.accountMessage.set('Unable to create beneficiary. Validate first and make sure the API is available.');
    }
  }

  private ensureReady(): boolean {
    if (!this.matchedContact()) {
      this.accountValidated.set(false);
      this.accountMessage.set('Search for an existing contact by phone number first.');
      return false;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.accountValidated.set(false);
      this.accountMessage.set('Complete all beneficiary details before continuing.');
      return false;
    }

    return true;
  }

  private findBank(bankName: string): BankOption | undefined {
    return this.bankOptions.find((option) => option.name === bankName);
  }
}
