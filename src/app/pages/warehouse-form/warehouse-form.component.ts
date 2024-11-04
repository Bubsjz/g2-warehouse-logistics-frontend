import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.css'
})
export class WarehouseFormComponent {
  warehouseForm: FormGroup

  constructor(){
    this.warehouseForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      locality: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [])
    })
  }

  getDataForm(){
    if (this.warehouseForm.valid){
      console.log('Formulario válido: '), this.warehouseForm.value
    } else {
      console.log('Formulario no válido')
      this.warehouseForm.markAllAsTouched()
    }
  }
}
