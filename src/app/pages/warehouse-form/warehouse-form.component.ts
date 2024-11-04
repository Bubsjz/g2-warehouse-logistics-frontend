import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrl: './warehouse-form.component.css'
})
export class WarehouseFormComponent {
  warehouseForm: FormGroup;
  selectedImage: File | null = null

  constructor(){
    this.warehouseForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      locality: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      image: new FormControl(null, [Validators.required, this.imageUrlValidator])
    })
  }

  imageUrlValidator = (control: AbstractControl): {[key: string]: any} | null => {
    const file = control.value
    if (!file) return null

    const validExtensions = ['jpeg', 'jpg', 'gif', 'png']
    const extension = file.name.split('.').pop().toLowerCase()
    return validExtensions.includes(extension) ? null : {invalidImageFile: true}
  }

  onFileSelected(event: Event){
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0){
      const file = input.files[0]
      this.selectedImage = file;
      this.warehouseForm.patchValue({ image: file})
    }
  }


  getDataForm(){
    if (this.warehouseForm.invalid){
      alert('Por favor, completa correctamente todos los campos antes de enviar.')
      return
    }
    const formData = new FormData()

    formData.append('name', this.warehouseForm.get('name')?.value)
    formData.append('locality', this.warehouseForm.get('locality')?.value)
    formData.append('address', this.warehouseForm.get('address')?.value)
    if (this.selectedImage){
      formData.append('image', this.selectedImage)
    }
    alert('Formulario enviado correctamente')
    this.warehouseForm.reset()
    this.selectedImage = null
  }
}
