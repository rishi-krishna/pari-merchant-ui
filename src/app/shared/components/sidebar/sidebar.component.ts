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
  readonly collapsed = input(false);
  readonly itemSelected = output<void>();

  readonly sections: SidebarSection[] = [
    {
      heading: 'Dashboard',
      items: [
        { label: 'Overview', route: '/dashboard', icon: 'dashboard' },
        { label: 'Contacts', route: '/dashboard/contacts', icon: 'contacts' },
        { label: 'Bank Accounts', route: '/dashboard/bank-accounts', icon: 'bank' },
        { label: 'Load Money', route: '/dashboard/bank-accounts/load-money', icon: 'card' },
        { label: 'Payout', route: '/dashboard/bank-accounts/load-money/payout', icon: 'payout' }
      ]
    },
    {
      heading: 'Transactions',
      items: [
        { label: 'My Bills', route: '/dashboard/my-bills', icon: 'list' },
        { label: 'Reports', route: '/dashboard/reports', icon: 'reports' }
      ]
    },
    {
      heading: 'Reference',
      items: [
        { label: 'KYC', route: '/dashboard/kyc', icon: 'kyc' },
        { label: 'COM Calculator', route: '/dashboard/calculator', icon: 'calculator' },
        { label: 'COM Structure', route: '/dashboard/structure', icon: 'percent' }
      ]
    }
  ];

  onSelect(): void {
    this.itemSelected.emit();
  }
}
