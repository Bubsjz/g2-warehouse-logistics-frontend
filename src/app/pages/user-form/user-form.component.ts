import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { WarehousesService } from '../../services/warehouses.service';
import { Iuser3 } from '../../interfaces/iuser.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Itruck } from '../../interfaces/itruck.interface';

type AlertResponse = { title: string; text: string; icon: SweetAlertIcon, cbutton: string};

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})

export class UserFormComponent {
  warehouseServices = inject(WarehousesService)
  userServices = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  warehouses: Iwarehouse[] | undefined = [];
  trucks: Itruck[] | undefined = [];
  myWarehouseId: number | undefined;
  myUserId: number | undefined;
  previousImage: any | undefined;
  previousFile: File = new File([], "empty.txt", { type: "text/plain" });

  userForm: FormGroup;
  formType: string = 'Insert';

  email_pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,8}$/

  imagePreview: string | null = null; // Para almacenar la vista previa
  selectedFile!: File; // Para almacenar el archivo seleccionado

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
      image: new FormControl(null),
      role: new FormControl(null),
      warehouse: new FormControl(null),
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
        const fileName = 'image.jpg'; // Name your file
        this.previousFile = new File([blob], fileName, { type: blob.type });
      })
      .catch((error) => {
        console.error('Error converting image URL to File:', error);
      });
  }  

  async ngOnInit() {
    try {
      const res = await this.warehouseServices.getAll();
      this.warehouses = res
      const res2 = await this.userServices.getAvailableTrucks();
      this.trucks = res2;
    } catch (error) {
      console.log(error)
    }

    this.activatedRoute.params.subscribe(async (params: any) => {
      if(params.id) {
        this.formType = 'Update'
        this.myUserId = params.id

        const res = await this.userServices.getById(params.id);
        this.myWarehouseId = res.assigned_id_warehouse;
        this.previousImage = res.image;

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
          role: new FormControl(res.role),
          warehouse: new FormControl(res.warehouse_name),
          truck: new FormControl(res.assigned_id_truck)  // TODO: res.plate (acceder a la matricula del assigned_id_truck)
        }, [this.checkPassword])
      }
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
        formData.append("role", this.userForm.get("role")?.value);
        if (this.selectedFile) {
          formData.append("image", this.selectedFile)
        } else {
          if (this.previousImage) {
            this.convertImageToFile(this.previousImage)
            formData.append("image", this.previousFile)
          }else {
            Swal.fire({
              title: "Upsss!",
              text: `No image was provided!`,
              icon: "error"
            });
          }
        }

        const newWarehouseName: string = this.userForm.get("warehouse")?.value
        const newWarehouseId: number = this.warehouses!.filter(warehouse => warehouse.name === newWarehouseName)[0].id_warehouse
        formData.append("assigned_id_warehouse", newWarehouseId.toString());

        // formData.append("assigned_id_truck", "115");
        const chosentruck = this.userForm.get("truck")?.value
        console.log(chosentruck)
        formData.append("assigned_id_truck", chosentruck.toString());

        const response: Iuser3 = await this.userServices.update(this.myUserId, formData)
        console.log('usuario actualizado', response)
        if (response.id_user) {
          let alert_res: AlertResponse = {title: 'Great!', text: 'User with ID: ' + response.id_user + ' successfully updated', icon: 'success', cbutton: 'Accept'}
          Swal.fire(alert_res)
          this.router.navigate(['/boss', 'employee-view', response.id_user])
        }

        
      } catch (error) {
        console.log(error)
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

        // formData.append("assigned_id_truck", "115");
        formData.append("assigned_id_truck", this.userForm.get("truck")?.value);
    
        const response: Iuser3 = await this.userServices.insert(formData)
        console.log('usuario creado:', response)
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
