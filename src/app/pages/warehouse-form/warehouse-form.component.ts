
import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { WarehousesService } from '../../services/warehouses.service';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {
  warehouseForm: FormGroup;

  private warehousesService = inject(WarehousesService);

  constructor() {
    this.warehouseForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      location: new FormControl('', [Validators.required]),
      capacity: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    });
  }

  checkControl(controlName: string, errorType: string): boolean {
    const control = this.warehouseForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  onSubmit(): void {
    if (this.warehouseForm.valid) {
      this.warehousesService.createWarehouse(this.warehouseForm.value).subscribe({
        next: (response) => console.log('Warehouse created:', response),
        error: (err) => console.error('Error creating warehouse:', err),
      });
    } else {
      this.warehouseForm.markAllAsTouched();
    }
  }
}