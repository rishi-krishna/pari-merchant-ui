import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { API_BASE_URL } from '../config/api.config';
import {
  Announcement,
  BankAccount,
  BillHistory,
  CommissionMethod,
  Complaint,
  Contact,
  CreatePaymentLinkRequest,
  KycInfo,
  LedgerEntry,
  Scheme,
  TransactionRecord,
  WalletSummary
} from '../models/merchant.models';

interface ContactResponse {
  id: string;
  name: string;
  maskedEmail: string;
  maskedPhone: string;
  city: string;
  status: string;
}

interface BeneficiaryResponse {
  id: string;
  contactId: string;
  contactName: string;
  maskedPhone: string;
  accountHolderName: string;
  maskedAccountNumber: string;
  bankName: string;
  ifsc: string;
  branch: string;
  accountType: string;
  status: string;
}

interface PaymentTransactionResponse {
  transactionId: string;
  transactionType: string;
  status: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  description: string;
  externalReference: string;
  providerReference: string;
}

interface KycDocumentResponse {
  id: string;
  kind: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  uploadedUtc: string;
}

interface KycProfileResponse {
  status: string;
  name: string;
  maskedPan: string;
  dateOfBirth: string;
  aadhaarMasked: string;
  accountHolderName: string;
  bankName: string;
  maskedAccountNumber: string;
  ifsc: string;
  branch: string;
  companyName: string;
  companyType: string;
  companyGst: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyPincode: string;
  companyCountry: string;
  documents: KycDocumentResponse[];
}

const INR_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2
});

const SCHEMES: Scheme[] = [
  {
    id: 1,
    name: 'Slpe Gold Travel Prime',
    transactionLimit: formatCurrencyText(40000),
    commissions: [
      { cardType: 'Consumer', commission: '1.42%' },
      { cardType: 'Business', commission: '1.87%' }
    ]
  },
  {
    id: 2,
    name: 'Slpe Silver Edu Lite',
    transactionLimit: formatCurrencyText(40000),
    commissions: [
      { cardType: 'Consumer', commission: '1.32%' },
      { cardType: 'Business', commission: '1.87%' }
    ]
  },
  {
    id: 3,
    name: 'Slpe Gold Travel Pure',
    transactionLimit: formatCurrencyText(50000),
    commissions: [
      { cardType: 'Consumer', commission: '1.37%' },
      { cardType: 'Business', commission: '1.82%' }
    ]
  },
  {
    id: 4,
    name: 'Slpe Marine Pay',
    transactionLimit: formatCurrencyText(50000),
    commissions: [
      { cardType: 'Business', commission: '1.82%' },
      { cardType: 'Consumer', commission: '1.37%' }
    ]
  }
];

const COMMISSION_METHODS: CommissionMethod[] = [
  {
    id: 1,
    gateway: 'Slpe insure lite',
    from: formatCurrencyText(100),
    to: formatCurrencyText(200000),
    partner: 'payu',
    cardType: 'CC',
    cardIssuer: 'others',
    totalCommission: '1.58%'
  },
  {
    id: 2,
    gateway: 'Slpe insure prime',
    from: formatCurrencyText(100),
    to: formatCurrencyText(100000),
    partner: 'slpe_insure_prime',
    cardType: 'Corporate Card',
    cardIssuer: 'others',
    totalCommission: '1.79%'
  },
  {
    id: 3,
    gateway: 'Slpe insure prime',
    from: formatCurrencyText(100),
    to: formatCurrencyText(100000),
    partner: 'slpe_insure_prime',
    cardType: 'Premium Card',
    cardIssuer: 'others',
    totalCommission: '1.69%'
  },
  {
    id: 4,
    gateway: 'Slpe insure prime',
    from: formatCurrencyText(100),
    to: formatCurrencyText(100000),
    partner: 'slpe_insure_prime',
    cardType: 'Retail Card',
    cardIssuer: 'others',
    totalCommission: '1.69%'
  }
];

const BILL_HISTORY: BillHistory[] = [
  {
    id: 1,
    date: '13-03-26 03:16 PM',
    mobileNumber: '9000000000',
    paymentRefId: 'REF1000001',
    approvalRefNum: 'APR100001',
    transactionReferenceId: 'TRX1000000000001',
    status: 'Success',
    billerName: 'Sample Credit Card',
    billerCategory: 'Credit Card',
    amount: formatCurrencyText(5750),
    referenceId: 'TRX1000000000001'
  },
  {
    id: 2,
    date: '13-03-26 02:52 PM',
    mobileNumber: '9000000001',
    paymentRefId: 'REF1000002',
    approvalRefNum: 'APR100002',
    transactionReferenceId: 'TRX1000000000002',
    status: 'Success',
    billerName: 'Demo Credit Card',
    billerCategory: 'Credit Card',
    amount: formatCurrencyText(49999),
    referenceId: 'TRX1000000000002'
  }
];

const FALLBACK_KYC: KycInfo = {
  status: 'Approved',
  name: 'Demo Merchant',
  pan: '******234F',
  dateOfBirth: '01/01/1990',
  aadhaarNumber: '********0000',
  accountHolderName: 'Demo Merchant',
  bankName: 'Demo Bank',
  accountNumber: '*******1234',
  ifsc: 'DEMO0001234',
  branch: 'Main Branch',
  companyName: 'Demo Merchant Private Limited',
  companyType: 'Private Limited',
  companyGst: '',
  companyAddress: '100 Market Street',
  companyCity: 'Sample City',
  companyState: 'Sample State',
  companyPincode: '500001',
  companyCountry: 'India',
  merchantPhotoLabel: 'Merchant Photo',
  panPhotoLabel: 'PAN Card Photo',
  aadhaarPhotoLabel: 'Aadhaar Photo'
};

const ANNOUNCEMENT: Announcement = {
  title: 'Announcement',
  message:
    'New payout and payment-link limits are now active for Gold Travel and Insure Prime programs. Review the updated commission cards before sharing links with customers.',
  bannerTitle: 'Merchant Growth Update',
  bannerSubtitle: 'Faster collections, smoother settlement, and fresh campaign support.'
};

@Injectable({ providedIn: 'root' })
export class MerchantDataService {
  private readonly http = inject(HttpClient);

  private readonly contactsState = signal<Contact[]>([]);
  private readonly bankAccountsState = signal<BankAccount[]>([]);
  private readonly complaintsState = signal<Complaint[]>([]);
  private readonly paymentLinksState = signal<CreatePaymentLinkRequest[]>([]);
  private readonly walletSummaryState = signal<WalletSummary>({
    availableBalance: 0,
    heldBalance: 0,
    currency: 'INR'
  });
  private readonly ledgerEntriesState = signal<LedgerEntry[]>([]);
  private readonly transactionsState = signal<TransactionRecord[]>([]);
  private readonly kycInfoState = signal<KycInfo>(FALLBACK_KYC);

  readonly contacts = this.contactsState.asReadonly();
  readonly bankAccounts = this.bankAccountsState.asReadonly();
  readonly complaints = this.complaintsState.asReadonly();
  readonly paymentLinks = this.paymentLinksState.asReadonly();
  readonly walletSummary = this.walletSummaryState.asReadonly();
  readonly ledgerEntries = this.ledgerEntriesState.asReadonly();
  readonly transactions = this.transactionsState.asReadonly();
  readonly kycInfo = this.kycInfoState.asReadonly();

  readonly walletAmountLabel = computed(() => this.formatCurrency(this.walletSummary().availableBalance));
  readonly heldAmountLabel = computed(() => this.formatCurrency(this.walletSummary().heldBalance));

  readonly schemes = SCHEMES;
  readonly commissionMethods = COMMISSION_METHODS;
  readonly billHistory = BILL_HISTORY;
  readonly announcement = ANNOUNCEMENT;
  readonly paymentLink = 'https://merchant.slpe.in/process-payment/C9bsNPvcpBdKwb3E21V6MR4ZjcjFmbxe';
  readonly paymentGatewayOptions = SCHEMES.map((scheme) => scheme.name);

  async loadContacts(): Promise<void> {
    const response = await firstValueFrom(this.http.get<ContactResponse[]>(`${API_BASE_URL}/api/contacts`));
    this.contactsState.set(response.map((item) => this.mapContact(item)));
  }

  async lookupContactByPhone(phone: string): Promise<Contact | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<ContactResponse>(`${API_BASE_URL}/api/contacts/search`, { params: { phone } })
      );
      return this.mapContact(response);
    } catch {
      return null;
    }
  }

  async saveContact(payload: Omit<Contact, 'id'> & { id?: string }): Promise<Contact> {
    const body = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      status: payload.status
    };

    const response = payload.id
      ? await firstValueFrom(
          this.http.put<ContactResponse>(`${API_BASE_URL}/api/contacts/${payload.id}`, body)
        )
      : await firstValueFrom(this.http.post<ContactResponse>(`${API_BASE_URL}/api/contacts`, body));

    const contact = this.mapContact(response);
    this.contactsState.update((items) => [contact, ...items.filter((item) => item.id !== contact.id)]);
    return contact;
  }

  async loadBankAccounts(): Promise<void> {
    const response = await firstValueFrom(this.http.get<BeneficiaryResponse[]>(`${API_BASE_URL}/api/beneficiaries`));
    this.bankAccountsState.set(response.map((item) => this.mapBeneficiary(item)));
  }

  async validateBeneficiary(payload: {
    contactId: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    accountType: string;
  }): Promise<BankAccount> {
    const response = await firstValueFrom(
      this.http.post<BeneficiaryResponse>(`${API_BASE_URL}/api/beneficiaries/validate`, payload)
    );
    return this.mapBeneficiary(response);
  }

  async addBankAccount(payload: {
    contactId: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifsc: string;
    branch: string;
    accountType: string;
  }): Promise<BankAccount> {
    const response = await firstValueFrom(
      this.http.post<BeneficiaryResponse>(`${API_BASE_URL}/api/beneficiaries`, payload)
    );
    const account = this.mapBeneficiary(response);
    this.bankAccountsState.update((items) => [account, ...items.filter((item) => item.id !== account.id)]);
    return account;
  }

  async deleteBankAccount(accountId: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${API_BASE_URL}/api/beneficiaries/${accountId}`));
    this.bankAccountsState.update((items) => items.filter((item) => item.id !== accountId));
  }

  async loadWalletSummary(): Promise<void> {
    const response = await firstValueFrom(this.http.get<WalletSummary>(`${API_BASE_URL}/api/wallet`));
    this.walletSummaryState.set(response);
  }

  async loadLedger(): Promise<void> {
    const response = await firstValueFrom(this.http.get<LedgerEntry[]>(`${API_BASE_URL}/api/ledger`));
    this.ledgerEntriesState.set(response);
  }

  async loadTransactions(): Promise<void> {
    const response = await firstValueFrom(this.http.get<TransactionRecord[]>(`${API_BASE_URL}/api/transactions`));
    this.transactionsState.set(response);
  }

  async loadKycInfo(): Promise<void> {
    const response = await firstValueFrom(this.http.get<KycProfileResponse | null>(`${API_BASE_URL}/api/kyc/profile`));
    if (!response) {
      this.kycInfoState.set(FALLBACK_KYC);
      return;
    }

    this.kycInfoState.set({
      status: response.status,
      name: response.name,
      pan: response.maskedPan,
      dateOfBirth: response.dateOfBirth,
      aadhaarNumber: response.aadhaarMasked,
      accountHolderName: response.accountHolderName,
      bankName: response.bankName,
      accountNumber: response.maskedAccountNumber,
      ifsc: response.ifsc,
      branch: response.branch,
      companyName: response.companyName,
      companyType: response.companyType,
      companyGst: response.companyGst,
      companyAddress: response.companyAddress,
      companyCity: response.companyCity,
      companyState: response.companyState,
      companyPincode: response.companyPincode,
      companyCountry: response.companyCountry,
      merchantPhotoLabel: this.documentLabel(response.documents, 'merchantPhoto', 'Merchant Photo'),
      panPhotoLabel: this.documentLabel(response.documents, 'panPhoto', 'PAN Card Photo'),
      aadhaarPhotoLabel: this.documentLabel(response.documents, 'aadhaarPhoto', 'Aadhaar Photo')
    });
  }

  createPaymentLink(payload: CreatePaymentLinkRequest): void {
    this.paymentLinksState.update((links) => [payload, ...links]);
  }

  raiseComplaint(payload: Omit<Complaint, 'id' | 'date' | 'complaintId' | 'status'>): Complaint {
    const nextComplaint: Complaint = {
      ...payload,
      id: Date.now().toString(),
      date: '17-03-26',
      complaintId: `CMP${String(Date.now()).slice(-6)}`,
      status: 'Open'
    };

    this.complaintsState.update((complaints) => [nextComplaint, ...complaints]);
    return nextComplaint;
  }

  async initiateCollection(payload: {
    amount: number;
    currency: string;
    customerName: string;
    cardBrand: string;
    maskedCardNumber: string;
    providerTokenReference: string;
    description: string;
  }): Promise<TransactionRecord> {
    const response = await firstValueFrom(
      this.http.post<PaymentTransactionResponse>(`${API_BASE_URL}/api/load-money/collection/initiate`, payload)
    );
    return this.finishFinancialTransaction(this.mapPaymentTransaction(response));
  }

  async initiateSelfTopup(payload: {
    amount: number;
    currency: string;
    cardBrand: string;
    maskedCardNumber: string;
    providerTokenReference: string;
    description: string;
  }): Promise<TransactionRecord> {
    const response = await firstValueFrom(
      this.http.post<PaymentTransactionResponse>(`${API_BASE_URL}/api/load-money/self-topup/initiate`, payload)
    );
    return this.finishFinancialTransaction(this.mapPaymentTransaction(response));
  }

  async createPayout(payload: {
    beneficiaryId: string;
    amount: number;
    currency: string;
    purpose: string;
  }): Promise<TransactionRecord> {
    const response = await firstValueFrom(
      this.http.post<PaymentTransactionResponse>(`${API_BASE_URL}/api/payouts`, payload)
    );
    return this.finishFinancialTransaction(this.mapPaymentTransaction(response));
  }

  async refreshPortalData(): Promise<void> {
    await Promise.all([this.loadContacts(), this.loadBankAccounts(), this.loadWalletSummary(), this.loadTransactions()]);
  }

  formatCurrency(amount: number, currency = 'INR'): string {
    if (currency === 'INR') {
      return INR_FORMATTER.format(amount);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  private finishFinancialTransaction(record: TransactionRecord): TransactionRecord {
    this.transactionsState.update((items) => [record, ...items]);
    void this.loadWalletSummary();
    void this.loadLedger();
    return record;
  }

  private documentLabel(documents: KycDocumentResponse[], kind: string, fallback: string): string {
    const match = documents.find((item) => item.kind.toLowerCase() === kind.toLowerCase());
    return match?.fileName ?? fallback;
  }

  private mapContact(response: ContactResponse): Contact {
    return {
      id: response.id,
      name: response.name,
      email: response.maskedEmail,
      phone: response.maskedPhone,
      city: response.city,
      status: this.parseContactStatus(response.status)
    };
  }

  private mapBeneficiary(response: BeneficiaryResponse): BankAccount {
    return {
      id: response.id,
      contactId: response.contactId,
      contactName: response.contactName,
      phone: response.maskedPhone,
      accountHolderName: response.accountHolderName,
      accountNumber: response.maskedAccountNumber,
      bankName: response.bankName,
      ifsc: response.ifsc,
      branch: response.branch,
      accountType: response.accountType,
      status: response.status
    };
  }

  private mapPaymentTransaction(response: PaymentTransactionResponse): TransactionRecord {
    return {
      id: response.transactionId,
      transactionType: response.transactionType,
      status: response.status,
      amount: response.amount,
      feeAmount: response.feeAmount,
      netAmount: response.netAmount,
      currency: response.currency,
      externalReference: response.externalReference,
      providerReference: response.providerReference,
      description: response.description,
      settlementStatus: response.status,
      createdUtc: new Date().toISOString()
    };
  }

  private parseContactStatus(value: string): Contact['status'] {
    if (value === 'Pending' || value === 'Disabled') {
      return value;
    }

    return 'Active';
  }
}

function formatCurrencyText(amount: number): string {
  return INR_FORMATTER.format(amount);
}
