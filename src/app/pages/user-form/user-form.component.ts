import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userForm: FormGroup
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)
  formTitle: string = 'Insert a user'
  buttonText: string = 'Register'
  userId: string | null = null
  successMessage: string = ""

  constructor(){
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      surname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(com|org|net)$')]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$')]),
      rol: new FormControl("", [Validators.required]),
      warehouse: new FormControl("", [Validators.required])
    })
  }

  ngOnInit(){
    this.activatedRoute.params.subscribe(params => {
      this.userId = params['id']
      if (this.userId){
        this.formTitle = "Update user"
        this.buttonText = 'Update'
      } else {
        this.formTitle = 'Insert a new user'
        this.buttonText = 'Create'
      }
    })
  }

  getDataForm(){
    if (this.userForm.invalid){
      alert('Please complete all fields correctly before submitting.')
      return
    }
    if (this.userId){
      // Llamar al servicio para actualizar usuario
      this.successMessage = "User updated successfully"
    } else {
      // Llamar al servicio para crear un usuario
      this.successMessage = "User registered successfully"
    }
    this.userForm.reset()
  }

  goback(){
    this.router.navigate(['/dashboard', 'dashboardboss', 'warehousefirstview'])
  }

}
