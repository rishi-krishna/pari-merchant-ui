export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'Active' | 'Pending' | 'Disabled';
}

export interface BankAccount {
  id: string;
  contactId: string;
  contactName: string;
  phone: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifsc: string;
  branch: string;
  accountType: 'Savings' | 'Current' | string;
  status?: string;
}

export interface SchemeCommission {
  cardType: string;
  commission: string;
}

export interface Scheme {
  id: number;
  name: string;
  transactionLimit: string;
  commissions: SchemeCommission[];
}

export interface Announcement {
  title: string;
  message: string;
  bannerTitle: string;
  bannerSubtitle: string;
}

export interface CreatePaymentLinkRequest {
  phoneNumber: string;
  gateway: string;
  amount: string;
}

export interface CommissionMethod {
  id: number;
  gateway: string;
  from: string;
  to: string;
  partner: string;
  cardType: string;
  cardIssuer: string;
  totalCommission: string;
}

export interface KycInfo {
  status: string;
  name: string;
  pan: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
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
  merchantPhotoLabel: string;
  panPhotoLabel: string;
  aadhaarPhotoLabel: string;
}

export interface Complaint {
  id: string | number;
  date: string;
  complaintId: string;
  referenceId: string;
  assigned: string;
  description: string;
  status: string;
}

export interface BillHistory {
  id: number;
  date: string;
  mobileNumber: string;
  paymentRefId: string;
  approvalRefNum: string;
  transactionReferenceId: string;
  status: string;
  billerName: string;
  billerCategory: string;
  amount: string;
  referenceId: string;
}

export interface WalletSummary {
  availableBalance: number;
  heldBalance: number;
  currency: string;
}

export interface LedgerEntry {
  id: string;
  entryType: string;
  amount: number;
  currency: string;
  description: string;
  createdUtc: string;
  transactionId?: string | null;
}

export interface TransactionRecord {
  id: string;
  transactionType: string;
  status: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  externalReference: string;
  providerReference: string;
  description: string;
  settlementStatus: string;
  createdUtc: string;
}

export interface UserProfile {
  userId: string;
  tenantId: string;
  merchantCode: string;
  role: string;
  displayName: string;
  phone: string;
  email: string;
}

export interface LoadMoneyResult {
  found: boolean;
  status: 'success' | 'pending' | 'failed' | 'unknown' | string;
  message: string;
  transactionId: string | null;
  orderId: string | null;
  providerTransactionId: string | null;
  amount: number | null;
  currency: string;
  reference: string | null;
  description: string | null;
  createdUtc: string | null;
}

export interface CashfreeCheckoutOrder {
  orderId: string;
  cfOrderId: string;
  paymentSessionId: string;
  reference: string;
}
