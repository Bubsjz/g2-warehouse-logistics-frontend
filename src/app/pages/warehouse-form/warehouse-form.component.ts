import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css'],
})
export class WarehouseFormComponent {
  warehouseForm: FormGroup; // Declarac de form

  constructor(private fb: FormBuilder) {
    // Inicialización del form
    this.warehouseForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      locality: ['', Validators.required],
      address: ['', Validators.required],
      image: [null],
    });
  }

  // Manejo del envío del form
  onSubmit(): void {
    if (this.warehouseForm.valid) {
      console.log('Form Submitted:', this.warehouseForm.value);
      alert('Warehouse successfully created!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  // Método para limpiar form
  deleteWarehouse(): void {
    this.warehouseForm.reset();
    alert('Form has been cleared.');
  }
}
