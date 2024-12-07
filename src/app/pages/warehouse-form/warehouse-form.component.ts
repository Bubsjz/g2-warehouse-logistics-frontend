
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehousesService } from '../../services/warehouses.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';



@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {

  serviceWarehouse = inject(WarehousesService)
  router = inject(Router)
  activateRoute = inject(ActivatedRoute)

  reactiveForm: FormGroup;
  imagePreview: string | null = null; // Para almacenar la vista previa
  selectedFile!: File | null // Para almacenar el archivo seleccionado
  type: string = "creation"
  typebtn: string = "Create"
  warehouse_id!:number
  previousFile: File = new File([], "image.jpg", { type: 'image/jpeg' });

  constructor() {
    this.reactiveForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      locality: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      latitude: new FormControl('',[Validators.required]),
      longitude: new FormControl('',[Validators.required])


    }, [])
  }
  ngOnInit() {

    

    this.activateRoute.params.subscribe(async (params: any) => {
      this.warehouse_id = Number(params.id)
      if (params.id) {
        console.log(params.id)
        this.type = "update"
        this.typebtn = "Update"
        const warehouse = await this.serviceWarehouse.getById(params.id)
        console.log(warehouse)
        this.convertImageToFile(warehouse.image)
        this.reactiveForm = new FormGroup({
          _id: new FormControl(warehouse.id_warehouse, []),
          name: new FormControl(warehouse.name, [Validators.required]),
          locality: new FormControl(warehouse.locality, [Validators.required]),
          address: new FormControl(warehouse.address, [Validators.required]),
          latitude: new FormControl(warehouse.latitude, [Validators.required]),
          longitude: new FormControl(warehouse.longitude, [Validators.required]),
          image: new FormControl(null)

        }, [])

        this.imagePreview = String(warehouse.image)

      }

    })

  }


  onFileSelected(event: Event) {
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

  clearImage() {
    this.imagePreview = null
    this.reactiveForm.get('image')?.reset();
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

  async onSubmit() {
    if (this.reactiveForm.valid) {
      const formData = new FormData();
      formData.append("name", this.reactiveForm.get("name")?.value);
      formData.append("locality", this.reactiveForm.get("locality")?.value);
      formData.append("address", this.reactiveForm.get("address")?.value);
      formData.append("latitude", this.reactiveForm.get("latitude")?.value);
      formData.append("longitude", this.reactiveForm.get("longitude")?.value);
      if (this.selectedFile) {
        formData.append("image", this.selectedFile)
      } else {
        formData.append("image", this.previousFile)
      }

      let response;
      if (this.type === "creation") {
        response = await this.serviceWarehouse.createWarehouse(formData)
        console.log(response)
        Swal.fire({
          title: "Good job!",
          text: `${response.name} has been created! `,
          icon: "success"
        })
        await this.router.navigate(['/boss', 'warehouse-info'])
      } else {
        response = await this.serviceWarehouse.update(this.reactiveForm.value._id, formData)
        console.log(response)
        Swal.fire({
          title: "Good job!",
          text: `${response.name} has been created! `,
          icon: "success"
        });
      
        await this.router.navigate(['/boss', 'warehouse-info'])
        window.location.reload()
      }
    }
  }

 
}




