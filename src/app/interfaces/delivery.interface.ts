export interface Delivery {
    id_delivery:           number;
    id_user:               number;
    send_date:             string | null;
    received_date:         string | null;
    plate:                  string;
    origin_warehouse_name:      string;
    origin_warehouse_locality: string;
    destination_warehouse_name: string;
    destination_warehouse_locality: string;
    status:                string;
    comments:              null | string;
}




