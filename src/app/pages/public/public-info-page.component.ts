import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

type PublicSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type PublicPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: PublicSection[];
};

const PAGE_CONTENT: Record<string, PublicPageContent> = {
  'contact-us': {
    eyebrow: 'Contact',
    title: 'Contact Us',
    intro: 'Reach the Pari support desk for merchant onboarding, payment support, and settlement assistance.',
    sections: [
      {
        heading: 'Business Details',
        bullets: [
          'Business Name: Pari Payments Workspace',
          'Support Email: support@pariworkspace.in',
          'Support Phone: +91 90000 00000',
          'Registered Address: 100 Demo Trade Centre, Hyderabad, Telangana 500001, India'
        ]
      },
      {
        heading: 'Support Hours',
        paragraphs: [
          'Merchant support is available Monday to Saturday from 9:00 AM to 7:00 PM IST.',
          'For urgent payment issues, include your registered mobile number and transaction reference in the email subject.'
        ]
      }
    ]
  },
  'terms-and-conditions': {
    eyebrow: 'Policy',
    title: 'Terms & Conditions',
    intro: 'These terms govern the use of the Pari merchant portal for wallet top-ups, collections, payouts, and related reporting features.',
    sections: [
      {
        heading: 'Platform Usage',
        bullets: [
          'The merchant must provide accurate account, contact, and KYC details while using the platform.',
          'Only authorised users may access the merchant dashboard, initiate collections, or create payout instructions.',
          'The merchant is responsible for maintaining the confidentiality of login credentials and MPIN access.'
        ]
      },
      {
        heading: 'Payments and Compliance',
        bullets: [
          'Collection and wallet top-up requests are subject to payment gateway approval and risk controls.',
          'Payouts may be held, rejected, or delayed if beneficiary validation, KYC, or compliance checks fail.',
          'Pari may suspend or limit account activity if suspicious, fraudulent, or non-compliant usage is detected.'
        ]
      },
      {
        heading: 'Operational Responsibility',
        paragraphs: [
          'The merchant is responsible for verifying the customer, amount, and purpose before initiating a payment request or payout.',
          'Pari provides transaction status, wallet, and reporting information on a best-effort basis and may perform maintenance windows when required.'
        ]
      }
    ]
  },
  'refunds-and-cancellations': {
    eyebrow: 'Policy',
    title: 'Refunds & Cancellations',
    intro: 'This page describes how Pari handles collection reversals, failed payment attempts, and payout cancellations.',
    sections: [
      {
        heading: 'Collections and Wallet Top-ups',
        bullets: [
          'A successful customer payment is treated as final unless a gateway-authorised reversal or refund is approved.',
          'Failed or dropped customer payment attempts are not credited to the merchant wallet.',
          'If a refund is approved, the amount is returned through the original payment channel as per the gateway or banking timeline.'
        ]
      },
      {
        heading: 'Payout Cancellations',
        bullets: [
          'A payout can be cancelled only before it is processed by the banking partner or settlement rail.',
          'Once a payout moves to processing or success, cancellation may no longer be possible.',
          'Rejected or failed payouts are automatically reflected back in the merchant wallet after provider confirmation.'
        ]
      },
      {
        heading: 'Timelines',
        paragraphs: [
          'Approved refunds or payout reversals are generally reflected within 5 to 7 business days, depending on the issuing bank or payment method.',
          'For support, contact the Pari operations desk with the transaction reference and registered merchant contact number.'
        ]
      }
    ]
  },
  services: {
    eyebrow: 'Services',
    title: 'Products & Services',
    intro: 'Pari provides a compact merchant payments workspace for collections, wallet management, beneficiary handling, and payouts.',
    sections: [
      {
        heading: 'Available Services',
        bullets: [
          'Wallet Load Money via hosted card and UPI checkout',
          'Customer collection tracking and payment result sync',
          'Saved contacts and beneficiary management',
          'Merchant payouts to validated bank accounts',
          'Transaction, bill history, and reporting views'
        ]
      },
      {
        heading: 'Indicative Pricing (INR)',
        bullets: [
          'Wallet load money and customer collections: 1.50% to 2.00% per successful transaction',
          'UPI collections: starting from INR 0.90% per successful transaction',
          'Payout processing: INR 5 to INR 10 per completed payout',
          'Failed or dropped payment attempts: no wallet credit and no success fee charged'
        ]
      },
      {
        heading: 'Demo Note',
        paragraphs: [
          'The pricing shown here is indicative demo pricing for website whitelisting and review purposes.',
          'Final commercial terms depend on merchant onboarding, volume, risk review, and payment method mix.'
        ]
      }
    ]
  }
};

@Component({
  selector: 'app-public-info-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './public-info-page.component.html',
  styleUrl: './public-info-page.component.scss'
})
export class PublicInfoPageComponent {
  private readonly route = inject(ActivatedRoute);

  readonly page = computed(() => {
    const pageKey = this.route.snapshot.data['pageKey'] as string | undefined;
    return PAGE_CONTENT[pageKey ?? 'contact-us'] ?? PAGE_CONTENT['contact-us'];
  });
}
