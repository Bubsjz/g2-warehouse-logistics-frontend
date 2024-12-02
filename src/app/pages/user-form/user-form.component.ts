import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})

export class UserFormComponent {
  warehouseServices = inject(WarehousesService)
  userServices = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);

  warehouses: Iwarehouse[] | undefined = [];
  myWarehouse: Iwarehouse | undefined;
  
  userForm: FormGroup;
  formType: string = 'Insert';

  email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/

  constructor() {
    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      surname: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required, 
        Validators.pattern(this.email_pattern)
      ]),
      password: new FormControl(null, [Validators.required]),
      repeatpassword: new FormControl(null, [Validators.required]),
      role: new FormControl(null),
      warehouse: new FormControl(null),
    }, [this.checkPassword])
  }

  async ngOnInit() {
    try {
      const res = await this.warehouseServices.getAll();
      this.warehouses = res
    } catch (error) {
      console.log(error)
    }

    this.activatedRoute.params.subscribe(async (params: any) => {
      if(params.id) {
        this.formType = 'Update'
        const res = await this.userServices.getById(params.id);
        const res2 = await this.warehouseServices.getById(res[0].warehouse_id);

        this.userForm = new FormGroup({
          name: new FormControl(res[0].name, [Validators.required]),
          surname: new FormControl(res[0].surname, [Validators.required]),
          email: new FormControl(res[0].email, [
            Validators.required, 
            Validators.pattern(this.email_pattern)
          ]),
          password: new FormControl(res[0].password, [Validators.required]),
          repeatpassword: new FormControl(res[0].password, [Validators.required]),
          role: new FormControl(res[0].role),
          warehouse: new FormControl(res2.name),
        }, [this.checkPassword])
      }
    })
  }

  // async getDataForm() {
  //   if (this.userForm.value.id) {
  //     try{
  //       const respose: Iuser = await this.usersService.update(this.userForm.value)
  //       if (response._id && response._id === this.userForm.value._id) {
  //         let alert_res: AlertResponse = {title: 'Perfecto!', text: 'Usuario con ID: ' + response._id + ' Actualizado con exito', icon: 'success', cbutton: 'Aceptar'}
  //         Swal.fire(alert_res)
  //         this.router.navigate(['/dashboard', 'home'])
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }

  //   }else{
  //     try{
  //       const response: IUser = await this.usersService.insert(this.userForm.value)
  //       console.log(response)
  //       if (response.id) {
  //         let alert_res: AlertResponse = {title: 'Perfecto!', text: 'Usuario creado con exito', icon: 'success', cbutton: 'Aceptar'}
  //         Swal.fire(alert_res)
  //         this.router.navigate(['/dashboard', 'home'])
  
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  // }


  checkControl(formControlName: string, validator: string){
    return this.userForm.get(formControlName)?.hasError(validator) && this.userForm.get(formControlName)?.touched;
  }

  checkPassword(formValue: AbstractControl): any {
    const password = formValue.get('password')?.value;
    const repeatpassword = formValue.get('repeatpassword')?.value
    if (password !== repeatpassword) {
      return {'checkpassword': true}
    } else {
      return null
    }
  }

  checkRole(formValue: AbstractControl): any {
    enum Role {"operator", "manager", "administrator"}
    const role = formValue.get('role')?.value;
    if (role in Role) {
      return null
    } else {
      return {'checkrole': true}
    }
  }

  checkWarehouse(formValue: AbstractControl): any {
    const warehouse = formValue.get('warehouse')?.value;
    if (warehouse.includes(this.warehouses)) {
      return null
    } else {
      return {'checkwarehouse': true}
    }
  }

}
