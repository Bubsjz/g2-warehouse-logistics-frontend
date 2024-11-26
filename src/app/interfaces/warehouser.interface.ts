import { Delivery } from "./deliveri.interface";

export interface Warehouse {
  id_warehouse: number;
  name: string;
  locality: string;
  address: string;
  capacity: number;
  status: string;
  deliveries: Delivery[];
}



export interface Truck {
  plate: string;
  driver: string;
}

export interface WarehouseLocation {
  name: string;
  locality: string;
}
