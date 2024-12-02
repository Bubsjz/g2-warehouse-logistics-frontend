import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { iUser } from '../../interfaces/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  // Forma con back-end

/*   loginService = inject(LoginService);
  
  formLogin: FormGroup = new FormGroup({
    email: new FormControl(),
    password: new FormControl()
  });

  async onSubmit() {
    if (this.formLogin.valid) {
      try {
        await this.loginService.login(this.formLogin.value);
      } catch (error) {
        console.log(error);
      }
    }
  } */
  
  
  
  // Forma con json-server
  email: string = '';
  password: string = '';
  token: string = '';
  errorBoolean:boolean =false
  errormsg!:string

  rolRedirectMap: Record<iUser['role'], string> = {
    'boss': '/boss/warehouse-info',
    'manager': '/manager/order-list',
    'operator': '/operator/order-list',
  };

  constructor(private loginService: LoginService, private router: Router, private route:ActivatedRoute) {}

/*   onSubmit() {
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
  } */

    ngOnInit(){
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
      // Guardar el token (opcional: en localStorage o sessionStorage)
      this.token = result.token;
      localStorage.setItem('authToken', result.token); // Guardar en localStorage
      console.log (result.role, result.token, result.message);
      // Redirigir según el rol
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

}


