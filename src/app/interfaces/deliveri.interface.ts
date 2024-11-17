export interface Deliveri {
    ID_delivery:       number;
    Send_date:         Date;
    Received_date:     Date | null;
    Status:            string;
    Truck:             Truck;
    Origin_warehouse:  Warehouse;
    Destiny_warehouse: Warehouse;
    Products:          Product[];
}
export interface Warehouse {
    ID_warehouse: number;
    Name:         string;
    Adress:       string;
}

export interface Product {
    ID_product:   number;
    Product_name: string;
    Quantity:     number;
}

export interface Truck {
    ID_truck: number;
    Plate:    string;
}
