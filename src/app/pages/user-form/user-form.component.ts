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

  constructor(){
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      surname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      rol: new FormControl(null, [Validators.required]),
      warehouse: new FormControl(null, [Validators.required])
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
    } else {
      // Llamar al servicio para crear un usuario
    }
    this.userForm.reset()
  }

}
