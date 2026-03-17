import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { AppIconComponent } from '../../app-icon.component';

interface SidebarItem {
  label: string;
  route: string;
  icon: string;
}

interface SidebarSection {
  heading?: string;
  items: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AppIconComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  readonly open = input(false);
  readonly mobile = input(false);
  readonly itemSelected = output<void>();

  readonly sections: SidebarSection[] = [
    {
      items: [
        { label: 'Dashboards', route: '/dashboard', icon: 'dashboard' },
        { label: 'KYC', route: '/dashboard/kyc', icon: 'kyc' },
        { label: 'COM Calculator', route: '/dashboard/calculator', icon: 'calculator' },
        { label: 'COM Structure', route: '/dashboard/structure', icon: 'percent' }
      ]
    },
    {
      heading: 'User Management',
      items: [
        { label: 'Contacts', route: '/dashboard/contacts', icon: 'contacts' },
        { label: 'Bank Accounts', route: '/dashboard/bank-accounts', icon: 'bank' }
      ]
    },
    {
      heading: 'Bill Payments',
      items: [
        { label: 'Pay Bills', route: '/dashboard/pay-bills', icon: 'receipt' },
        { label: 'My Bills', route: '/dashboard/my-bills', icon: 'list' },
        { label: 'Complaints', route: '/dashboard/complaints', icon: 'complaint' }
      ]
    },
    {
      heading: 'Payment Management',
      items: [
        { label: 'Load Money', route: '/dashboard/load-money', icon: 'card' },
        { label: 'Payout', route: '/dashboard/payout', icon: 'payout' },
        { label: 'Topup Requests', route: '/dashboard/topup-requests', icon: 'rupee' },
        { label: 'Reports', route: '/dashboard/reports', icon: 'reports' }
      ]
    }
  ];

  onSelect(): void {
    this.itemSelected.emit();
  }
}
