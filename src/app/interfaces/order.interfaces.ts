export interface Delivery {
  /* solo para json-server */ id?: number;  
    id_delivery?: number;
    send_date: Date | null;
    received_date: Date | null;
    origin_warehouse_id: number | null;
    destination_warehouse_id: number | null;
    truck_id_truck: number | null;
    comments: string;
    products: { product_id: number; quantity: number }[];
    status: 'pending' | 'review' | 'correction needed' | 'ready for departure' | 'in transit' | 'pending reception' | 'accepted' | 'send back';
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
  
  export interface DeliveryProduct {
    id_delivery_products: number;
    product_id_product: number;
    quantity: number;
    delivery_id_delivery: number;
  }