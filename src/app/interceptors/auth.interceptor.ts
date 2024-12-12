import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getTokenData() ? localStorage.getItem(authService['tokenKey']) : null;

  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: token || '',
    },
  });
 
  return next(cloneRequest);
};
