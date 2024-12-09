import { Component, inject } from '@angular/core';
import { Iwarehouse } from '../../interfaces/iwarehouse.interface';
import { RouterLink } from '@angular/router';
import { WarehousesService } from '../../services/warehouses.service';
import { SearchEngineComponent } from '../../components/search-engine/search-engine.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SearchEngineComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  warehouseServices = inject(WarehousesService)
  warehouses: Iwarehouse[] | undefined = [];

  async ngOnInit() {
    try {
      const res = await this.warehouseServices.getAll();
      this.warehouses = res
    } catch (error) {
      console.log(error)
    }
  }

  async search(event: string): Promise<void> {
    this.warehouses = await this.warehouseServices.getAll()
    this.warehouses =  this.warehouses.filter(warehouse => warehouse.name.toLowerCase().includes(event.toLowerCase()))
  }
  
}