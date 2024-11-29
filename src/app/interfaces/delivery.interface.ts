export interface Delivery {
    id_delivery:           number;
    id_user:               number;
    send_date:             string | null;
    received_date:         string | null;
    plate:                  string;
    origin_warehouse_id:      number;
    destination_warehouse_id: number;
    status:                string;
    comments:              null | string;
}




