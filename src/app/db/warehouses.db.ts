import { Iwarehouse } from "../interfaces/iwarehouse.interface";


export const WAREHOUSES: Iwarehouse[] = [
    {
        name: 'Central Warehouse',
        locality: 'Madrid',
        address: 'C. de Arboleda, 10, Puente de Vallecas, 28031 Madrid',
        image: 'https://images.ctfassets.net/ksxncq3aj87t/1dD7ZLyLxS4OuprJPfGCVK/8c31e984a8bf346d0b66ff9342f62604/warehouse_setup_1.png?w=892&h=595&q=50&fm=png',
        employees: [
            {
                'name': 'Maria',
                'surname': 'Nieves',
                'email': 'marinieves@hotmail.com',
                'password': '2FM:;tDi>1A4',
                'rol': 'operator'
            },
            {
                'name': 'Pedro',
                'surname': 'Garcia',
                'email': 'pegarcia@gmail.com',
                'password': '1DbNr5[2t]5s',
                'rol': 'manager'
            }
        ]
    },
    {
        name: 'North Warehouse',
        locality: 'Burgos',
        address: 'Ctra. Burgos, 32, 09001 Burgos',
        image: 'https://www.avantauk.com/wp-content/uploads/2023/10/Image1.jpg.pagespeed.ce.EJaVPuYsVc.jpg',
        employees: [
            {
                'name': 'Iván',
                'surname': 'Campos',
                'email': 'icamp@hotmail.com',
                'password': 'ZvEI43A8>`P(',
                'rol': 'operator' 
            },
            {
                'name': 'Eugenia',
                'surname': 'Rodríguez',
                'email': 'eugeniarod@gmail.com',
                'password': 'vDl[1_4Uqd6-',
                'rol': 'manager' 
            }
        ]
    }
]
