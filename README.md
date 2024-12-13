## FUNCIONAMIENTO COMPONENTE ORDERTABLE 

El componente OrderTableComponent permite mostrar y gestionar pedidos de entrada y salida para usuarios con roles específicos (operador o manager). Además, se incluye un diseño dinámico basado en el rol del usuario y el estado de los pedidos.

Funcionalidad Principal: Muestra una tabla con los pedidos del usuario autenticado.

## Roles Soportados:

Operador: Ve todos los pedidos asignados y puede editarlos.
Manager: Puede alternar entre pedidos de entrada y salida, revisar pedidos específicos y ver información del almacén.

## Servicios Utilizados:

OperatorService: Recupera pedidos para los operadores.

ManagerService: Obtiene pedidos de entrada y salida para managers.

AuthService: Maneja la autenticación y roles del usuario.

## Manejo de Errores:

Redirige a la página de inicio de sesión si no se encuentra el rol del usuario.

## Vista del HTML

Botones de Filtrado:

Managers pueden alternar entre pedidos de entrada y salida.
Los botones cambian de estilo cuando están activos.

Tabla de Pedidos:

Los datos de los pedidos se muestran en columnas como:
ID de Pedido
Fecha
Origen y Destino
Matrícula del vehículo
Estado del Pedido

## Cada rol tiene acceso a diferentes acciones:

Operadores: Pueden editar pedidos.
Managers: Pueden revisar pedidos.


## ESQUEMA DE DATOS PARA ORDER
  ## MODO CREATE 
  
    DATOS NECESARIOS EN FRONT
            [
                {
                    "warehouse": [
                    {
                        "id_warehouse": 23,
                        "name": "Alicante Warehouse"
                    },
                    {
                        "id_warehouse": 16,
                        "name": "Barcelona Warehouse"
                    },
                    {
                        "id_warehouse": 20,
                        "name": "Bilbao Warehouse"
                    }
                ],
                    "truck": [
                    {
                        "id_truck": 11,
                        "plate": "0857-OPA"
                    },
                    {
                        "id_truck": 6,
                        "plate": "0874-UIO"
                    },
                    {
                        "id_truck": 45,
                        "plate": "1234-ABC"
                    }
                ],
                    "productNames": [
                    {
                        "id_product": 5,
                        "product_name": "Pale bloques de hormigón"
                    },
                    {
                        "id_product": 3,
                        "product_name": "Pale de ladrillos"
                    },
                    {
                        "id_product": 4,
                        "product_name": "Pale de tablones"
                    }
                    ]
                }
                ]

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