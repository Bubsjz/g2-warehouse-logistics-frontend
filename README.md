# G2WarehouseLogisticsFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.




## ESQUEMA DE DATOS PARA ORDER
  ## MODO CREATE 
  
    DATOS NECESARIOS EN FRONT
            {
            "warehouse": [
                {
                "id_warehouse": 1,
                "name": "Central Warehouse",
                },
                {
                "id_warehouse": 2,
                "name": "South Warehouse",
                }
            ],
            "truck": [
                {
                "id_truck": 42,
                "plate": "4586-BTP",
                },
                {
                "id_truck": 7,
                "plate": "2345-RTY",
                }
            ],
            "productNames": [
                {
                "id_product": 4,
                "name": "Pale de tablones"
                },
                {
                "id_product": 5,
                "name": "Pale bloques de hormigón"
                }
            ]
            }

    DATOS ENVIADOS A BACK
        {
            "send_date": "2024-11-23 11:00:00",
            "received_date": "2024-11-25 15:00:00",
            "origin_warehouse_name": "Central Warehouse",
            "destination_warehouse_name": "South Warehouse",
            "plate": "4586-BTP",
            "status": "pending",
            "comments": "",
            "products": [
                {
                    "product_name": "pale de hormigón",
                    "product_quantity": 12
                },
                {
                    "product_name": "tablones",
                    "product_quantity": 20
                }
                ]
            }


  ## MODO EDIT

    DATOS NECESARIOS EN FRONT
            {
            "delivery": {
                "id_delivery": 26,
                "send_date": "2024-11-23T11:00:00.000Z",
                "received_date": "2024-11-25T15:00:00.000Z",
                "origin_warehouse_name": "Central Warehouse",
                "destination_warehouse_name": "South Warehouse",
                "plate": "4586-BTP",
                "status": "pending",
                "comments": "Revisar productos",
                "products": [
                {
                    "product_name": "pale de hormigón",
                    "product_quantity": 12
                },
                {
                    "product_name": "tablones",
                    "product_quantity": 20
                }
                ]
            },
            }

    DATOS ENVIADOS A BACK
            {
            "id_delivery": 26,
            "send_date": "2024-11-24 12:00:00",
            "received_date": "2024-11-26 15:00:00",
            "origin_warehouse_name": "Central Warehouse",
            "destination_warehouse_name": "South Warehouse",
            "plate": "2345-RTY",
            "status": "review",
            "comments": "Pedido actualizado",
            "products": [
                {
                    "product_name": "pale de hormigón",
                    "product_quantity": 12
                },
                {
                    "product_name": "tablones",
                    "product_quantity": 20
                }
                ]
            }


  ## MODO REVIEW

    DATOS NECESARIOS EN FRONT
           {
            "delivery": {
                "id_delivery": 26,
                "send_date": "2024-11-23T11:00:00.000Z",
                "received_date": "2024-11-25T15:00:00.000Z",
                "origin_warehouse_name": "Central Warehouse",
                "destination_warehouse_name": "South Warehouse",
                "plate": "4586-BTP",
                "status": "review",
                "comments": "Revisar productos",
                "products": [
                {
                    "product_name": "pale de hormigón",
                    "product_quantity": 12
                },
                {
                    "product_name": "tablones",
                    "product_quantity": 20
                }
                ]
            }
            } 

    DATOS ENVIADOS A BACK
        SI HAY COMENTARIOS
            {
            "id_delivery": 26,
            "comments": "Por favor, aumentar la cantidad de productos",
            "status": "corrections needed"
            }

        SI NO HAY COMENTARIOS
            {
            "id_delivery": 26,
            "status": "approved"
            }