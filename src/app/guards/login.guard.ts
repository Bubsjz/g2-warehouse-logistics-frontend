import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/token.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService);
  if(!authService.getTokenData()){
    router.navigateByUrl('/login?status=1')
    return false
  }
  return true;
};
