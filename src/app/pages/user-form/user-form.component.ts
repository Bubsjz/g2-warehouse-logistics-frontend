import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { WarehousesService } from '../../services/warehouses.service';
import { Iuser3 } from '../../interfaces/iuser.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';

type AlertResponse = { title: string; text: string; icon: SweetAlertIcon, cbutton: string};

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
  router = inject(Router);

  warehouses: Iwarehouse[] | undefined = [];
  myWarehouse: Iwarehouse | undefined;
  myUserId: Iuser3 | undefined;

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
        this.myUserId = params.id

        this.userForm = new FormGroup({
          name: new FormControl(res.name, [Validators.required]),
          surname: new FormControl(res.surname, [Validators.required]),
          email: new FormControl(res.email, [
            Validators.required, 
            Validators.pattern(this.email_pattern)
          ]),
          password: new FormControl(res.password, [Validators.required]),
          repeatpassword: new FormControl(res.password, [Validators.required]),
          role: new FormControl(res.role),
          warehouse: new FormControl(res.warehouse_name),
        }, [this.checkPassword])
      }
    })
  }

  async getDataForm() {
    console.log(this.userForm.value)
    if (this.myUserId) {
      try{
        const form_values = this.userForm.value
        form_values.id_user = this.myUserId;
        form_values.assigned_id_warehouse = 1
        form_values.assigned_id_truck = 105
        form_values.image = 'http:/localhost:3000/uploads/user-2.jpg'
        const response: Iuser3 = await this.userServices.update(form_values)
        console.log(response)
        if (response.id_user === Number(this.userForm.value.id_user)) {
          let alert_res: AlertResponse = {title: 'Great!', text: 'User with ID: ' + response.id_user + ' successfully updated', icon: 'success', cbutton: 'Accept'}
          Swal.fire(alert_res)
          this.router.navigate(['/boss', 'employee-view', response.id_user])
        }
      } catch (error) {
        console.log(error)
      }

    }else{
      try{
        const form_values = this.userForm.value
        form_values.assigned_id_warehouse = 1
        form_values.assigned_id_truck = 104
        form_values.image = 'http:/localhost:3000/uploads/user-2.jpg'
        const response: Iuser3 = await this.userServices.insert(form_values)
        console.log(response)
        if (response.id_user) {
          let alert_res: AlertResponse = {title: 'Great!', text: 'User succesfully registered', icon: 'success', cbutton: 'Accept'}
          Swal.fire(alert_res)
          this.router.navigate(['/boss', 'employee-view', response.id_user])
        }
      } catch (error) {
        console.log(error)
      }
    }
  }


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
