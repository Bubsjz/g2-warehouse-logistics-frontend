import { Iuser2 } from "./iuser2.interface";

export interface Iwarehouse2 {
    id_warehouse: number;
    name: string;
    locality: string;
    address: string;
    image: File ;
    id_user: number;
    user_name: string;
    surname: string;
    email: string;
    user_image: string;
    users: Iuser2[];
}
