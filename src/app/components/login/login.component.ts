import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { iUser } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  token: string = '';
  errorBoolean:boolean =false
  errormsg!:string
  isPasswordVisible = false

  rolRedirectMap: Record<iUser['role'], string> = {
    'boss': '/boss/warehouse-info',
    'manager': '/manager/order-list',
    'operator': '/operator/order-list',
  };

  constructor(private loginService: LoginService, private router: Router, private route:ActivatedRoute, private authService: AuthService) {}


    ngOnInit(){
      this.authService.logOut();
      /* localStorage.removeItem(environment.TOKEN_KEY) */
      this.route.queryParams.subscribe((params:any) => {
        if(params.status === '1'){
          this.errorBoolean = true
          this.errormsg = "Access denied. You do not have the necessary permissions."

        }
      })
    }

onSubmit() {
  this.loginService.login(this.email, this.password).subscribe(result => {
    if (result) {
      this.token = result.token;
      localStorage.setItem(environment.TOKEN_KEY, result.token); // Guardar en localStorage
      const route = this.rolRedirectMap[result.role];
      if (route) {
        this.router.navigate([route]);
      } else {
        alert('User role not recognized');
      }
    } else {
      Swal.fire({
        title: "Login failed",
        text: "Wrong email or password!",
        icon: "error",
      }); 
     
    }
  });
}

togglePasswordVisibility() {
  this.isPasswordVisible = !this.isPasswordVisible;
}

}


