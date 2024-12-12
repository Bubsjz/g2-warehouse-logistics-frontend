import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../environments/environment';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(!localStorage.getItem(environment.TOKEN_KEY)){
    router.navigateByUrl('/login?status=1')
    return false
  }
  return true;
};
