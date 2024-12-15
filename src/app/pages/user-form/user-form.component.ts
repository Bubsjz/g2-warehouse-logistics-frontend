import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { WarehousesService } from '../../services/warehouses.service';
import { Iuser3 } from '../../interfaces/iuser.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Itruck } from '../../interfaces/itruck.interface';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

type AlertResponse = { title: string; text: string; icon: SweetAlertIcon, cbutton: string};

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})

export class UserFormComponent {
  warehouseServices = inject(WarehousesService)
  userServices = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  warehouses: Iwarehouse[] | undefined = [];
  managerWarehouses: Iwarehouse[] = [];
  trucks: Itruck[] | undefined = [];
  myWarehouseId: number | undefined;
  myUserId: number | undefined;
  previousFile: File = new File([], "image.jpg", { type: 'image/jpeg' });
  previousTruck: Itruck | undefined;
  previousWarehouse: Iwarehouse | undefined;

  userForm: FormGroup;
  formType: string = 'Insert';

  email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/

  imagePreview: string | null = null; // Para almacenar la vista previa
  selectedFile!: File; // Para almacenar el archivo seleccionado

  isOperator: boolean | undefined;

  private isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
    return error instanceof HttpErrorResponse;
  }

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
      image: new FormControl(null, [Validators.required]),
      role: new FormControl(null, [Validators.required]),
      warehouse: new FormControl(null, [Validators.required]),
      truck: new FormControl(null)
    }, [this.checkPassword])
  }

  onFileSelected(event:Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log('file', file)

    if (file) {
     this.selectedFile = file
     
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.onerror = (error) => {
        console.error('error with reed the file', error);
      };
       reader.readAsDataURL(file);
    } else {
      console.warn('No image was provided');
    }
  }
  
  clearImage(){
    this.imagePreview = null
    this.userForm.get('image')?.reset();
  }

  convertImageToFile(image: any): void {
    fetch(image)
      .then((response) => response.blob())
      .then((blob) => {
        this.previousFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      })
      .catch((error) => {
        console.error('Error converting image URL to File:', error);
      });
  }  

  async ngOnInit() {
    try {
      this.warehouses = await this.warehouseServices.getAll();
      this.trucks = await this.userServices.getAvailableTrucks();
      this.managerWarehouses = await this.warehouseServices.getManagerAvailable();
      this.isOperator = true;
    } catch (error) {
      console.log(error)
    }

    this.activatedRoute.params.subscribe(async (params: any) => {
      if(params.id) {
        this.formType = 'Update'
        this.myUserId = params.id

        const res = await this.userServices.getById(params.id);

        this.myWarehouseId = res.assigned_id_warehouse;
        this.convertImageToFile(res.image);
        this.isOperator = (res.role === 'operator' ? true: false);

        if (res.assigned_id_truck) {
          this.previousTruck = await this.userServices.getTruckById(res.assigned_id_truck);
        }
        if (this.previousTruck) {
          this.trucks?.push({id_truck: this.previousTruck.id_truck, plate: this.previousTruck.plate});
        }

        this.previousWarehouse = this.warehouses!.filter(warehouse => warehouse.id_warehouse === res.assigned_id_warehouse)[0]
        this.managerWarehouses?.push(this.previousWarehouse);

        this.userForm = new FormGroup({
          name: new FormControl(res.name, [Validators.required]),
          surname: new FormControl(res.surname, [Validators.required]),
          email: new FormControl(res.email, [
            Validators.required, 
            Validators.pattern(this.email_pattern)
          ]),
          password: new FormControl(res.password, [Validators.required]),
          repeatpassword: new FormControl(res.password, [Validators.required]),
          image: new FormControl(null),
          role: new FormControl(res.role, [Validators.required]),
          warehouse: new FormControl(res.warehouse_name, [Validators.required]),
          truck: new FormControl(this.previousTruck ? this.previousTruck.plate : null)
        }, [this.checkPassword])

        this.imagePreview = String(res.image)

      }
    
      this.userForm.get('role')?.valueChanges.subscribe((value) => {
        if (value === 'operator') {
          this.isOperator = true;
          this.userForm.get('truck')?.setValue('Select a truck plate');
        } else {
          this.isOperator = false;
          this.userForm.get('truck')?.reset();
          if (this.previousWarehouse) {
            if (this.managerWarehouses?.includes(this.previousWarehouse)) {
              const index = this.managerWarehouses.indexOf(this.previousWarehouse);
              if (index > -1) {
                this.managerWarehouses.splice(index, 1);
              }              
            }
          }
        }
      });
    
    })
  }

  
  async getDataForm() {
    if (this.myUserId) {
      try{
        const formData = new FormData();
        formData.append("id_user", this.myUserId.toString());
        formData.append("name", this.userForm.get("name")?.value);
        formData.append("surname", this.userForm.get("surname")?.value);
        formData.append("email", this.userForm.get("email")?.value);
        formData.append("password", this.userForm.get("password")?.value);
        if (this.selectedFile) {
          formData.append("image", this.selectedFile)
        } else {
          formData.append("image", this.previousFile)
        }

        const newWarehouseName: string = this.userForm.get("warehouse")?.value
        const newWarehouseId: number = this.warehouses!.filter(warehouse => warehouse.name === newWarehouseName)[0].id_warehouse
        formData.append("assigned_id_warehouse", newWarehouseId.toString());

        const chosenPlate: string = this.userForm.get("truck")?.value
        if (chosenPlate) {
          const chosenTruckId: string = this.trucks!.find((obj) => obj.plate == chosenPlate)!.id_truck;
          formData.append("assigned_id_truck", chosenTruckId);
        }
        const users = (await this.warehouseServices.getById(newWarehouseId)).users
        const currentManager = users?.find((user) => user.role === "manager")
        if (currentManager && (currentManager?.id_user !== Number(this.myUserId))) {
          const previousRole: String = "operator"
          formData.append("role", previousRole.toString());
        } else {
          formData.append("role", this.userForm.get("role")?.value);
        }

        const response: Iuser3 = await this.userServices.update(this.myUserId, formData)
        console.log('usuario actualizado', response)
        if (response.id_user) {
          let alert_res: AlertResponse = {title: 'Great!', text: 'User with ID: ' + response.id_user + ' successfully updated', icon: 'success', cbutton: 'Accept'}
          Swal.fire(alert_res)
          this.router.navigate(['/boss', 'employee-view', response.id_user])
        }
      } catch (error: unknown) {
        if (this.isHttpErrorResponse(error) && error.error.message.startsWith("Duplicate entry")) {
          Swal.fire({
            title: 'Error',
            text: 'Email address already exists',
            icon: 'error',
            confirmButtonText: 'Accept',
          });
        }
      }

    }else{
      try{
        const formData = new FormData();
        formData.append("name", this.userForm.get("name")?.value);
        formData.append("surname", this.userForm.get("surname")?.value);
        formData.append("email", this.userForm.get("email")?.value);
        formData.append("password", this.userForm.get("password")?.value);
        formData.append("role", this.userForm.get("role")?.value);
        
        if (this.selectedFile) {
          formData.append("image", this.selectedFile)
        } else {
          Swal.fire({
            title: "Upsss!",
            text: `No image was provided!`,
            icon: "error"
          });
        }

        const newWarehouseName: string = this.userForm.get("warehouse")?.value
        const newWarehouseId: number = this.warehouses!.filter(warehouse => warehouse.name === newWarehouseName)[0].id_warehouse
        formData.append("assigned_id_warehouse", newWarehouseId.toString());

        const chosenPlate: string = this.userForm.get("truck")?.value
        if (chosenPlate) {
          const chosenTruckId: string = this.trucks!.find((obj) => obj.plate == chosenPlate)!.id_truck;
          formData.append("assigned_id_truck", chosenTruckId);
        }
   
        console.log(this.userForm.get("role")?.value, chosenPlate)
        const response: Iuser3 = await this.userServices.insert(formData)
        console.log('usuario creado:', response)
        if (response.id_user) {
          let alert_res: AlertResponse = {title: 'Great!', text: 'User succesfully registered', icon: 'success', cbutton: 'Accept'}
          Swal.fire(alert_res)
          this.router.navigate(['/boss', 'employee-view', response.id_user])
        }
      } catch (error: unknown) {
        if (this.isHttpErrorResponse(error) && error.error.message.startsWith("Duplicate entry")) {
          Swal.fire({
            title: 'Error',
            text: 'Email address already exists',
            icon: 'error',
            confirmButtonText: 'Accept',
          });
        }
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

  checkManagerWarehouse(formValue: AbstractControl, managerWarehouses: Iwarehouse[]): any {
    const role = formValue.get('role')?.value;
    const warehouse = formValue.get('warehouse')?.value;
    if (role === 'manager' && managerWarehouses.length === 0) {
      return {'checkmanagerwarehouse': true}
    } else {
      return null
    }
  }

}
