export interface Delivery {
    id_delivery?: number;
    send_date: Date | null;
    received_date: Date | null;
    comments: string;
    products: { product_id: number | null; product_name?: string; product_quantity: number }[];
    status: 'pending' | 'review' | 'corrections needed' | 'ready for departure' | 'in transit' | 'pending reception' | 'approved' | 'not approved';
    origin_warehouse_id?: number | null;
    origin_warehouse_name?: string | null;
    destination_warehouse_id?: number | null;
    destination_warehouse_name?: string | null;
    truck_id_truck?: number | null;
    plate?: string | null;
  }
  
  export interface Warehouse {
    id_warehouse: number;
    name: string;
    locality: string;
    adress: string;
    image: string | null;
  }
  
  export interface Product {
    id_product: number;
    name: string;
    quantity?: number;
    selected?: boolean;
  }
  
  export interface Truck {
    id_truck: number;
    plate: string;
    driver_id_user: number;
  }

  export interface CombinedResponse {
    id_delivery: number;
    send_date: string;
    received_date?: string | null;
    origin_warehouse_name: string;
    origin_warehouse_locality?: string;
    destination_warehouse_name: string;
    destination_warehouse_locality?: string;
    status: 'pending' | 'review' | 'corrections needed' | 'ready for departure' | 'in transit' | 'pending reception' | 'approved' | 'not approved';
    plate: string;
    comments: string;
    products: { product_id: number; quantity: number | string }[];
  }