import { Routes } from '@angular/router';

import { dashboardEntryGuard, mpinEntryGuard } from './core/guards/auth-flow.guards';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./pages/login/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: 'mpin',
    title: 'Enter MPIN',
    canActivate: [mpinEntryGuard],
    loadComponent: () => import('./pages/mpin/mpin-page.component').then((m) => m.MpinPageComponent)
  },
  {
    path: 'dashboard',
    canActivate: [dashboardEntryGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard-shell.component').then((m) => m.DashboardShellComponent),
    children: [
      {
        path: '',
        title: 'Dashboard',
        data: { label: 'Dashboard' },
        loadComponent: () =>
          import('./pages/dashboard/dashboard-home.component').then((m) => m.DashboardHomeComponent)
      },
      {
        path: 'kyc',
        title: 'KYC',
        data: { label: 'KYC' },
        loadComponent: () => import('./features/kyc/kyc-page.component').then((m) => m.KycPageComponent)
      },
      {
        path: 'calculator',
        title: 'COM Calculator',
        data: { label: 'COM Calculator' },
        loadComponent: () =>
          import('./features/calculator/calculator-page.component').then((m) => m.CalculatorPageComponent)
      },
      {
        path: 'structure',
        title: 'COM Structure',
        data: { label: 'COM Structure' },
        loadComponent: () =>
          import('./features/structure/structure-page.component').then((m) => m.StructurePageComponent)
      },
      {
        path: 'contacts',
        title: 'Contacts',
        data: { label: 'Contacts' },
        loadComponent: () =>
          import('./features/contacts/contacts-page.component').then((m) => m.ContactsPageComponent)
      },
      {
        path: 'bank-accounts',
        title: 'Bank Accounts',
        data: { label: 'Bank Accounts' },
        loadComponent: () =>
          import('./features/bank-accounts/bank-accounts-page.component').then((m) => m.BankAccountsPageComponent)
      },
      {
        path: 'bank-accounts/create-beneficiary',
        title: 'Create Beneficiary',
        data: {
          label: 'Create Beneficiary',
          breadcrumbs: ['Bank Accounts', 'Create Beneficiary']
        },
        loadComponent: () =>
          import('./features/bank-accounts/create-beneficiary-page.component').then(
            (m) => m.CreateBeneficiaryPageComponent
          )
      },
      {
        path: 'pay-bills',
        title: 'Pay Bills',
        data: { label: 'Pay Bills' },
        loadComponent: () =>
          import('./pages/pay-bills/pay-bills-page.component').then((m) => m.PayBillsPageComponent)
      },
      {
        path: 'my-bills',
        title: 'My Bills',
        data: { label: 'My Bills' },
        loadComponent: () => import('./features/bills/bills-page.component').then((m) => m.BillsPageComponent)
      },
      {
        path: 'complaints',
        title: 'Complaints',
        data: { label: 'Complaints' },
        loadComponent: () =>
          import('./features/complaints/complaints-page.component').then((m) => m.ComplaintsPageComponent)
      },
      {
        path: 'load-money',
        title: 'Load Money',
        data: { label: 'Load Money' },
        loadComponent: () =>
          import('./features/load-money/load-money-page.component').then((m) => m.LoadMoneyPageComponent)
      },
      {
        path: 'payout',
        title: 'Payout',
        data: { label: 'Payout' },
        loadComponent: () =>
          import('./features/payout/payout-page.component').then((m) => m.PayoutPageComponent)
      },
      {
        path: 'topup-requests',
        title: 'Topup Requests',
        data: {
          label: 'Topup Requests',
          headline: 'Topup Requests',
          description: 'Dummy topup requests page placeholder.'
        },
        loadComponent: () =>
          import('./features/placeholder/placeholder-page.component').then((m) => m.PlaceholderPageComponent)
      },
      {
        path: 'reports',
        title: 'Reports',
        data: {
          label: 'Reports',
          headline: 'Reports',
          description: 'Dummy reports page placeholder.'
        },
        loadComponent: () =>
          import('./features/placeholder/placeholder-page.component').then((m) => m.PlaceholderPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
