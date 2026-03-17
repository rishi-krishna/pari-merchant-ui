import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFlowService } from '../services/auth-flow.service';

export const mpinEntryGuard: CanActivateFn = () => {
  const auth = inject(AuthFlowService);
  const router = inject(Router);

  return auth.canAccessMpin() ? true : router.createUrlTree(['/login']);
};

export const dashboardEntryGuard: CanActivateFn = () => {
  const auth = inject(AuthFlowService);
  const router = inject(Router);

  return auth.canAccessDashboard() ? true : router.createUrlTree(['/login']);
};
