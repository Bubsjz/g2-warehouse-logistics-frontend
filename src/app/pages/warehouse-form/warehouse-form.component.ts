import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  router = inject(Router)
  activatedRoute = inject(ActivatedRoute)

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


  getDataForm(fileInput: HTMLInputElement){
    if (this.warehouseForm.invalid){
      alert('Please complete all fields correctly before submitting.')
      return
    }
    const formData = new FormData()

    formData.append('name', this.warehouseForm.get('name')?.value)
    formData.append('locality', this.warehouseForm.get('locality')?.value)
    formData.append('address', this.warehouseForm.get('address')?.value)
    if (this.selectedImage){
      formData.append('image', this.selectedImage)
    }
    alert('Form submitted correctly')
    this.warehouseForm.reset()
    this.selectedImage = null
    fileInput.value = ""
  }

  backTo(){
    this.router.navigate(['/dashboard','dashboardboss', 'warehousefirstview' ])
  }
}
