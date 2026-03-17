import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthFlowService } from '../services/auth-flow.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthFlowService);
  const accessToken = auth.accessToken();

  if (!accessToken) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    })
  );
};
