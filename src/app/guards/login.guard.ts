import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  if(!localStorage.getItem('authToken')){
    router.navigateByUrl('/login?status=1')
    return false
  }
  return true;
};
