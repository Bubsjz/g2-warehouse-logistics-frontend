import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/token.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class roleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.authService.getUserRole();
    const url = state.url;
  
    console.log('User role:', userRole);
    console.log('Accessed URL:', url);
  
    if (!userRole) {
        console.warn('User role not found. Redirecting to login.');
        Swal.fire({
          title: 'Unauthorized Access',
          text: 'You need to log in to access this page.',
          icon: 'error',
          confirmButtonText: 'Login',
        }).then(() => {
          this.router.navigate(['/login']);
        });
        return false;
    }
  
    if ((userRole === 'manager' && !url.startsWith('/manager/')) ||
      (userRole === 'operator' && !url.startsWith('/operator/')) ||
      (userRole === 'boss' && !url.startsWith('/boss/'))
    ) {
    console.warn(`Unauthorized URL access detected for role: ${userRole}. Redirecting...`);

    const correctedUrl = this.getCorrectUrl(userRole, url);

    Swal.fire({
      title: 'Access Denied',
      text: `You cannot access ${url}. Redirecting to the appropriate section...`,
      icon: 'warning',
      confirmButtonText: 'OK',
    }).then(() => {
      this.router.navigateByUrl(correctedUrl);
    });
      return false;
    }
  
    return true;
  }

  private getCorrectUrl(userRole: string, url: string): string {
    if (userRole === 'manager') {
      return url.replace(/^\/operator\/|^\/boss\//, '/manager/');
    } else if (userRole === 'operator') {
      return url.replace(/^\/manager\/|^\/boss\//, '/operator/');
    } else if (userRole === 'boss') {
      return url.replace(/^\/manager\/|^\/operator\//, '/boss/');
    }
    return '/login';
  }
}