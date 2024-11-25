export interface Delivery {
    id_delivery:           number;
    send_date:             string | null;
    received_date:         string | null;
    truck:                 Truck;
    origin_warehouse:      NWarehouse;
    destination_warehouse: NWarehouse;
    status:                string;
    comments:              null | string;
}

export interface NWarehouse {
    name:     string;
    locality: string;
}

export interface Truck {
    plate:  string;
    driver: string;
}

