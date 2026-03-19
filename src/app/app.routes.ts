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
        data: { label: 'Overview' },
        loadComponent: () =>
          import('./pages/dashboard/dashboard-home.component').then((m) => m.DashboardHomeComponent)
      },
      {
        path: 'contacts',
        title: 'Contacts',
        data: {
          label: 'Contacts',
          breadcrumbs: ['Dashboard', 'Contacts']
        },
        loadComponent: () =>
          import('./features/contacts/contacts-page.component').then((m) => m.ContactsPageComponent)
      },
      {
        path: 'bank-accounts',
        title: 'Bank Accounts',
        data: {
          label: 'Bank Accounts',
          breadcrumbs: ['Dashboard', 'Bank Accounts']
        },
        loadComponent: () =>
          import('./features/bank-accounts/bank-accounts-page.component').then((m) => m.BankAccountsPageComponent)
      },
      {
        path: 'bank-accounts/create-beneficiary',
        title: 'Create Beneficiary',
        data: {
          label: 'Create Beneficiary',
          breadcrumbs: ['Dashboard', 'Bank Accounts', 'Create Beneficiary']
        },
        loadComponent: () =>
          import('./features/bank-accounts/create-beneficiary-page.component').then(
            (m) => m.CreateBeneficiaryPageComponent
          )
      },
      {
        path: 'bank-accounts/load-money',
        title: 'Load Money',
        data: {
          label: 'Load Money',
          breadcrumbs: ['Dashboard', 'Bank Accounts', 'Load Money']
        },
        loadComponent: () =>
          import('./features/load-money/load-money-page.component').then((m) => m.LoadMoneyPageComponent)
      },
      {
        path: 'bank-accounts/load-money/payout',
        title: 'Payout',
        data: {
          label: 'Payout',
          breadcrumbs: ['Dashboard', 'Bank Accounts', 'Load Money', 'Payout']
        },
        loadComponent: () =>
          import('./features/payout/payout-page.component').then((m) => m.PayoutPageComponent)
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
        path: 'my-bills',
        title: 'My Bills',
        data: {
          label: 'My Bills',
          breadcrumbs: ['Transactions', 'My Bills']
        },
        loadComponent: () => import('./features/bills/bills-page.component').then((m) => m.BillsPageComponent)
      },
      {
        path: 'reports',
        title: 'Reports',
        data: {
          label: 'Reports',
          breadcrumbs: ['Transactions', 'Reports']
        },
        loadComponent: () =>
          import('./features/reports/reports-page.component').then((m) => m.ReportsPageComponent)
      },
      {
        path: 'profile',
        title: 'My Profile',
        data: {
          label: 'My Profile',
          breadcrumbs: ['Dashboard', 'My Profile']
        },
        loadComponent: () =>
          import('./features/profile/profile-page.component').then((m) => m.ProfilePageComponent)
      },
      {
        path: 'update-mpin',
        title: 'Update MPIN',
        data: {
          label: 'Update MPIN',
          breadcrumbs: ['Dashboard', 'Update MPIN']
        },
        loadComponent: () =>
          import('./features/profile/update-mpin-page.component').then((m) => m.UpdateMpinPageComponent)
      },
      {
        path: 'load-money',
        pathMatch: 'full',
        redirectTo: 'bank-accounts/load-money'
      },
      {
        path: 'payout',
        pathMatch: 'full',
        redirectTo: 'bank-accounts/load-money/payout'
      },
      {
        path: 'pay-bills',
        pathMatch: 'full',
        redirectTo: 'my-bills'
      },
      {
        path: 'complaints',
        pathMatch: 'full',
        redirectTo: 'reports'
      },
      {
        path: 'topup-requests',
        pathMatch: 'full',
        redirectTo: 'reports'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
