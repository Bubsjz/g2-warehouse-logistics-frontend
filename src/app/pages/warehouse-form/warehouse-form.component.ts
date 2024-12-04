
import { Component, inject } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-warehouse-form',
  standalone:true,
  imports:[ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {

  serviceWarehouse = inject(WarehousesService)

  reactiveForm:FormGroup;
  imagePreview: string | null = null; // Para almacenar la vista previa
  selectedFile!: File; // Para almacenar el archivo seleccionado


  constructor(){
    this.reactiveForm = new FormGroup({
      name: new FormControl('',[]),
      locality: new FormControl('',[]),
      address: new FormControl ('',[]),
      image: new FormControl (this.selectedFile,[])

    },[])
  }



  onFileSelected(event:Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    

    if (file) {
     this.selectedFile = file
      console.log(this.selectedFile)
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.onerror = (error) => {
        console.error('Error al leer el archivo:', error);
      };
       reader.readAsDataURL(file);
    } else {
      console.warn('No se seleccionó ningún archivo.');
    }
    }
  

 async onSubmit() {
 
  await this.serviceWarehouse.createWarehouse(this.reactiveForm.value)
  
}
}

