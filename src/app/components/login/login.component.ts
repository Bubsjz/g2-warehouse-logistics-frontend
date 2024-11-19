import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { iUser } from '../../user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  rolRedirectMap: Record<iUser['rol'], string> = {
    'administrator': '/dashboard/boss/warehouse-info',
    'manager': '/dashboard/manager/order-list',
    'driver': '/dashboard/operator/order-list',
  };

  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit() {
    this.loginService.login(this.email, this.password).subscribe(result => {
      if (result) {
        const route = this.rolRedirectMap[result.rol];
        if (route) {
          this.router.navigate([route]);
        } else {
          this.router.navigate(['/login']);
        }
      } else {
        alert('Wrong email or password');
      }
    });
  }
}
