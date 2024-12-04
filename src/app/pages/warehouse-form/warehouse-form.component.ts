
import { Component, inject } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehousesService } from '../../services/warehouses.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

type prueba = {
  name:string,
  locality: string,
  address: string,
  image: File, 
  }

@Component({
  selector: 'app-warehouse-form',
  standalone:true,
  imports:[ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {

  serviceWarehouse = inject(WarehousesService)
  router = inject(Router)

  reactiveForm:FormGroup;
  imagePreview: string | null = null; // Para almacenar la vista previa
  selectedFile!: File; // Para almacenar el archivo seleccionado


  constructor(){
    this.reactiveForm = new FormGroup({
      name: new FormControl('',[Validators.required]),
      locality: new FormControl('',[Validators.required]),
      address: new FormControl ('',[Validators.required]),
      image: new FormControl ('',[Validators.required])

    },[])
  }



  onFileSelected(event:Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    

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
      this.reactiveForm.get('image')?.reset();
    }


 
  async onSubmit() {

    const formData = new FormData();
    formData.append("name", this.reactiveForm.get("name")?.value);
    formData.append("locality", this.reactiveForm.get("locality")?.value);
    formData.append("address", this.reactiveForm.get("address")?.value);
    if (this.selectedFile) {
      formData.append("image",this.selectedFile); 
    }else{
      Swal.fire({
        title: "Upsss!",
        text: `No image was provided!`,
        icon: "error"
      });
    }
  
   const response =  await this.serviceWarehouse.createWarehouse(formData)
   if(response){
    Swal.fire({
      title: "Good job!",
      text: `${response.name} has been created! `,
      icon: "success"
    });
    await this.router.navigate(['/boss','warehouse-info'])

   }else{
    Swal.fire({
      title: "Error!",
      text: `There has been an error!`,
      icon: "error"
    });
   }
    
   
  }
  
}


