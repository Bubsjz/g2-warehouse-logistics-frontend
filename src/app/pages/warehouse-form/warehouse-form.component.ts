
  import { Component } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { WarehousesService } from 'src/app/services/warehouses.service';

  @Component({
    selector: 'app-warehouse-form',
    templateUrl: './warehouse-form.component.html',
    styleUrls: ['./warehouse-form.component.css'],
  })
  export class WarehouseFormComponent {
    warehouseForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      private warehousesService: WarehousesService
    ) {
      this.warehouseForm = this.fb.group({
        id: [null],
        name: ['', Validators.required],
        location: ['', Validators.required],
      });
    }

    onSubmit() {
      if (this.warehouseForm.valid) {
        this.warehousesService.saveWarehouse(this.warehouseForm.value).subscribe(
          (response) => {
            console.log('Warehouse saved successfully', response);
          },
          (error) => {
            console.error('Error saving warehouse', error);
          }
        );
      }
    }
  }
