export interface Iuser {
    id?: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    warehouse_id: number;
}

export interface Iuser3 {
    id_user?: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    image: File;     
    assigned_id_warehouse: number;
    assigned_id_truck: number;
}


export interface Iuser4 {
    id_user?: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    role: string;
    image: File;     
    assigned_id_warehouse: number;
    assigned_id_truck?: number;
    warehouse_name: string;
    locality: string;
    address: string;
    warehouse_image: string;
}