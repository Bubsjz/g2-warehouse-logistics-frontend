  // Importaciones básicas de Angular
  import { Component, OnInit } from '@angular/core'; // Decorador para definir el componente y su ciclo de vida
  import { ActivatedRoute, Router } from '@angular/router'; // Herramientas para manejo de rutas y navegación
  import { FormsModule } from '@angular/forms'; // Funcionalidades para trabajar con formularios
  import { CommonModule } from '@angular/common'; // Funcionalidades comunes de Angular
  import { NgForm } from '@angular/forms'; // Tipo para formularios reactivos

  // Importaciones del proyecto
  import { DeliveryService } from '../services/order.services'; // Servicio para gestionar entregas
  import { Delivery, Warehouse, Truck, Product } from '../interfaces/interfaces'; // Interfaces para modelar los datos principales
  
  @Component({
    selector: 'app-order-form',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './order-form.component.html',
    styleUrls: ['./order-form.component.css'],
  })
  
  export class OrderFormComponent implements OnInit {
    // Determina el modo del formulario: creación, edición o revisión
    mode: 'create' | 'edit' | 'review' = 'create';
  
    // Objeto que contiene los datos del pedido actual
    delivery: Delivery = {
      send_date: null, // Fecha de envío
      received_date: null, // Fecha de recepción
      truck_id_truck: null, // ID del camión
      origin_warehouse_id: null, // ID del almacén de origen
      destination_warehouse_id: null, // ID del almacén de destino
      status: 'pending', // Estado inicial del pedido
      comments: '', // Comentarios asociados
      products: [], // Productos asociados al pedido
    };
  
    // Listas cargadas desde el back-end
    warehouses: Warehouse[] = []; // Lista de almacenes disponibles
    trucks: Truck[] = []; // Lista de camiones disponibles
    products: Product[] = []; // Lista de productos disponibles
  
    // Detalles de los productos seleccionados para el pedido
    orderDetails: { product_id: number | null; quantity: number; touched: boolean }[] = [
      { product_id: null, quantity: 0, touched: false }, // Producto vacío inicial
    ];
  
    // Mensaje de error para mostrar en caso de validación fallida o error del servidor
    errorMessage: string = '';
  
    // Indica si el formulario ya fue enviado
    submitted: boolean = false;

    // Indica si el envío es editable
    isEditable: boolean = true;
    areButtonsEnabled: boolean = true;
    isCommentEditable: boolean = false;
  
    // Constructor para inyectar dependencias
    constructor(
      private route: ActivatedRoute, // Manejo de parámetros de la ruta actual
      private router: Router, // Navegación entre rutas
      private deliveryService: DeliveryService // Servicio para interactuar con el back-end
    ) {}

//-------------------------------
//ARRANQUE
//-------------------------------
    ngOnInit(): void {
      // Determina el modo del formulario basado en la ruta activa
      this.detectMode();

      // Carga los datos iniciales necesarios para rellenar los selectores del formulario
      this.loadInitialData();
    }

//-------------------------------
//DETECCIÓN DE MODO Y CARGA DE DATOS
//-------------------------------
    detectMode(): void {
      // Suscripción a los cambios en la URL activa
      this.route.url.subscribe((url) => {
        // Obtiene el ID del pedido desde la URL, si está presente
        const id = +this.route.snapshot.paramMap.get('id')!;

        // Determina el modo según el segmento de la ruta
        if (url.some((segment) => segment.path === 'create-order')) {
          this.mode = 'create'; // Modo para crear un pedido
        } else if (url.some((segment) => segment.path === 'modify-order')) {
          this.mode = 'edit'; // Modo para editar un pedido existente
          this.loadDelivery(id); // Carga los datos del pedido para editar
        } else if (url.some((segment) => segment.path === 'review-order')) {
          this.mode = 'review'; // Modo para revisar un pedido existente
          this.loadDelivery(id); // Carga los datos del pedido para revisión
        }
      });
    }

  //Carga los datos básicos para el funcionamiento del formulario
    loadInitialData(): void {
      // Carga la lista de almacenes desde el backend
      this.deliveryService.getWarehouses().subscribe({
        next: (data) => {
          this.warehouses = data; // Asigna los datos de almacenes a la variable correspondiente
          console.log('Warehouses loaded:', this.warehouses); // Muestra los almacenes cargados en consola
        },
        error: () => (this.errorMessage = 'Error loading warehouses.'), // Manejo de errores
      });
    
      // Carga la lista de camiones desde el backend
      this.deliveryService.getTrucks().subscribe({
        next: (data) => {
          this.trucks = data; // Asigna los datos de camiones a la variable correspondiente
          console.log('Trucks loaded:', this.trucks); // Muestra los camiones cargados en consola
        },
        error: () => (this.errorMessage = 'Error loading trucks.'), // Manejo de errores
      });
    
      // Carga la lista de productos desde el backend
      this.deliveryService.getProducts().subscribe({
        next: (data) => {
          this.products = data; // Asigna los datos de productos a la variable correspondiente
          console.log('Products loaded:', this.products); // Muestra los productos cargados en consola
        },
        error: () => (this.errorMessage = 'Error loading products.'), // Manejo de errores
      });
    }

  //Carga los detalles del envío seleccionado (con ayuda de loadDeliveryProducts) y controla que las fechas sean de tipo Date
  loadDelivery(id: number): void {
    this.deliveryService.getDeliveryById(id).subscribe({
      next: (delivery) => {
        this.delivery = {
          ...delivery,
          send_date: delivery.send_date ? new Date(delivery.send_date) : null,
          received_date: delivery.received_date ? new Date(delivery.received_date) : null,
        };
        console.log('Delivery loaded:', this.delivery);
  
        // Comprueba las condiciones de editabilidad
        this.checkIfEditable();
  
        // Carga los productos relacionados al envío
        this.loadDeliveryProducts(id);
      },
      error: (err) => {
        if (err.status === 404) {
          alert('The delivery you are trying to access does not exist.');
          this.router.navigate(['/operator/order-list']);
        } else {
          this.errorMessage = 'An error occurred while loading the delivery. Please try again later.';
        }
      },
    });
  }
  
  //Carga los datos de los productos y cantidades, del pedido
    loadDeliveryProducts(deliveryId: number): void {
      // Llama al servicio para obtener todos los productos asociados a pedidos
      this.deliveryService.getDeliveryProducts().subscribe({
        next: (products) => {
          // Filtra los productos que pertenecen al pedido especificado por deliveryId
          this.orderDetails = products
            .filter((product) => product.delivery_id_delivery === deliveryId)
            .map((product) => ({
              // Crea un objeto simplificado para cada producto
              product_id: product.product_id_product, // ID del producto
              quantity: product.quantity,            // Cantidad del producto en el pedido
              touched: false,                        // Estado inicial de interacción
            }));
          console.log('Delivery products loaded:', this.orderDetails); // Consola para seguimiento
        },
        error: () => {
          // Manejo de errores: mensaje para indicar que no se cargaron los productos
          this.errorMessage = 'Error loading delivery products.';
        },
      });
    }

    checkIfEditable(): void {
      const editableStatuses = ['pending', 'correction needed'];
      const reviewStatuses = ['review', 'pending reception'];
    
      // Control de editabilidad general (modo edit y estados permitidos)
      this.isEditable = this.mode === 'edit' && editableStatuses.includes(this.delivery.status);
    
      // Botones habilitados
      this.areButtonsEnabled =
        (this.mode === 'edit' && editableStatuses.includes(this.delivery.status)) ||
        (this.mode === 'review' && reviewStatuses.includes(this.delivery.status));
    
      // Campo de comentarios (editable solo en ciertos casos en modo review)
      if (this.mode === 'edit') {
        this.isCommentEditable = this.delivery.status === 'correction needed';
      } else if (this.mode === 'review') {
        this.isCommentEditable = reviewStatuses.includes(this.delivery.status);
      } else {
        this.isCommentEditable = false;
      }
    }

//------------------------------- 
//ACCIONES EN EL FORMULARIO
//-------------------------------
  //Agrega un nuevo producto al pedido
    addProduct(): void {
      // Inserta un nuevo producto con valores iniciales en la lista de detalles
      this.orderDetails.push({ 
        product_id: null,  // Producto no seleccionado inicialmente
        quantity: 0,       // Cantidad inicial en 0
        touched: false,    // Marcado como no interactuado
      });
      
      // Consola para verificar el estado actual de los detalles del pedido
      console.log('Product added. Current details:', this.orderDetails);
    }
  
  //Elimina un producto del pedido
    removeProduct(index: number): void {
      // Verificar si hay más de un producto en la lista
      if (this.orderDetails.length > 1) {
        // Eliminar el producto en el índice proporcionado
        this.orderDetails.splice(index, 1);
        // Consola para verificar el estado actual de los detalles del pedido
        console.log('Product removed. Current details:', this.orderDetails);
      } else {
        // Mostrar alerta si el usuario intenta eliminar el último producto
        alert('You must have at least one product in the order.');
      }
    }

  //Controla que la fecha sea de tipo Date y posibles cambios
    onDateChange(field: 'send_date' | 'received_date', value: string | null): void {
      if (value) {
        const parsedDate = new Date(value); // Convertir el valor recibido a un objeto Date
        if (this.isValidDate(parsedDate)) {
          // Si la fecha es válida, asignarla al campo correspondiente
          this.delivery[field] = parsedDate;
          console.log(`${field} updated to:`, this.delivery[field]); // Registrar el cambio en la consola
        } else {
          // Si el formato de la fecha es inválido, asignar null y registrar un error
          console.error(`Invalid date format for field: ${field}`, value);
          this.delivery[field] = null;
        }
      } else {
        // Si no hay valor (el campo fue borrado), asignar null y registrar una advertencia
        console.warn(`${field} was cleared or set to null.`);
        this.delivery[field] = null;
      }
    }

//-------------------------------
//VALIDACIONES
//-------------------------------
  //Validar campos cumplimentados y productos mayores a 0
    validateForm(): boolean {
      // Validar campos principales (fechas y selectores obligatorios)
      if (
        !this.isValidDate(this.delivery.send_date) || // Fecha de envío válida
        !this.isValidDate(this.delivery.received_date) || // Fecha de recepción válida
        !this.delivery.origin_warehouse_id || // ID del almacén de origen válido
        !this.delivery.destination_warehouse_id || // ID del almacén de destino válido
        !this.delivery.truck_id_truck // ID del camión válido
      ) {
        this.errorMessage = 'Please fill in all required fields with valid data.';
        console.log('Form validation failed: Missing required fields.'); // Registrar error
        return false; // Formulario no válido
      }

      // Validar productos (todos deben tener un tipo y cantidad mayor a 0)
      const invalidProducts = this.orderDetails.some(
        (detail) => !detail.product_id || detail.quantity <= 0
      );

      if (invalidProducts) {
        this.errorMessage = 'All products must have a valid type and quantity greater than 0.';
        console.log('Form validation failed: Invalid products.', this.orderDetails); // Registrar error
        return false; // Formulario no válido
      }

      // Si todos los datos son válidos, limpiar el mensaje de error y retornar true
      this.errorMessage = '';
      return true; // Formulario válido
    }

  //Verifica si una fecha es válida
    isValidDate(date: any): boolean {
      // Verificar que 'date' es una instancia de la clase Date
      // y que no es una fecha inválida (NaN)
      return date instanceof Date && !isNaN(date.getTime());
    }

//-------------------------------
//ENVÍOS Y APROBACIONES
//-------------------------------
  //Enviar el formulario
    onSubmit(form: NgForm): void {
      // Marcar el formulario como enviado para activar las validaciones visuales
      this.submitted = true;
    
      // Validar los datos del formulario antes de proceder
      if (!this.validateForm()) {
        // Mostrar un mensaje en la consola si la validación falla
        console.log('Form submission blocked due to validation errors.');
        return; // Detener la ejecución si hay errores
      }
    
      // Mostrar en la consola los datos que se enviarán si el formulario es válido
      console.log('Form submitted successfully with data:', this.delivery, this.orderDetails);
    
      // Proceder a guardar los datos (crear o actualizar el envío)
      this.saveDelivery();
    }

    private prepareDeliveryPayload(status: string): any {
      return {
        ...this.delivery,
        status, // Estado dinámico según el botón pulsado
        send_date: this.delivery.send_date
          ? `${this.formatDateForInput(this.delivery.send_date)} 00:00:00`
          : null,
        received_date: this.delivery.received_date
          ? `${this.formatDateForInput(this.delivery.received_date)} 00:00:00`
          : null,
        truck_id_truck: this.delivery.truck_id_truck ? +this.delivery.truck_id_truck : null,
        origin_warehouse_id: this.delivery.origin_warehouse_id ? +this.delivery.origin_warehouse_id : null,
        destination_warehouse_id: this.delivery.destination_warehouse_id ? +this.delivery.destination_warehouse_id : null,
        products: this.orderDetails.map((detail) => ({
          product_id: detail.product_id!,
          quantity: detail.quantity,
        })),
      };
    }

      saveAsDraft(): void {
        const deliveryPayload = this.prepareDeliveryPayload('pending');
        console.log('Saving draft with data:', deliveryPayload);
      
        this.deliveryService.createDelivery(deliveryPayload).subscribe({
          next: () => {
            alert('Draft saved successfully!');
            this.router.navigate(['/operator/order-list']);
          },
          error: () => {
            this.errorMessage = 'Failed to save draft.';
          },
        });
      }

      saveDelivery(): void {
        const deliveryPayload = this.prepareDeliveryPayload('review'); // Cambiar el status a 'review'
        console.log('Saving delivery with data:', deliveryPayload);
      
        if (this.mode === 'create') {
          this.deliveryService.createDelivery(deliveryPayload).subscribe({
            next: () => {
              alert('Order created successfully!');
              this.router.navigate(['/operator/order-list']);
            },
            error: () => {
              this.errorMessage = 'Failed to create order.';
            },
          });
        } else if (this.mode === 'edit') {
          this.deliveryService.updateDelivery(this.delivery.id_delivery!, deliveryPayload).subscribe({
            next: () => {
              alert('Order updated successfully!');
              this.router.navigate(['/operator/order-list']);
            },
            error: () => {
              this.errorMessage = 'Failed to update order.';
            },
          });
        }
      }
  
  //Envío de comentarios en modo review
    submitReview(): void {
      if (!this.delivery.id_delivery) return;
    
      let newStatus = '';
      if (this.delivery.status === 'review') {
        newStatus = 'correction needed';
      } else if (this.delivery.status === 'pending reception') {
        newStatus = 'send back';
      }
    
      const updatedDelivery = {
        ...this.delivery,
        status: newStatus,
      };
    
      console.log('Submitting review with data:', updatedDelivery);
    
      this.deliveryService.updateDelivery(this.delivery.id_delivery, updatedDelivery).subscribe({
        next: () => {
          alert('Comments sent successfully.');
          this.router.navigate(['/manager/order-list']);
        },
        error: () => {
          this.errorMessage = 'Failed to send comments.';
        },
      });
    }

    deleteDelivery(): void {
      // Confirmación del usuario antes de proceder con el borrado
      const confirmDelete = confirm(
        'Are you sure you want to delete this order? This action cannot be undone.'
      );
    
      if (!confirmDelete) {
        return; // Si el usuario cancela, no se hace nada
      }
    
      // Llama al servicio para borrar el envío
      this.deliveryService.deleteDelivery(this.delivery.id_delivery!).subscribe({
        next: () => {
          // Notificación de éxito y redirección
          alert('Order deleted successfully!');
          this.router.navigate(['/operator/order-list']);
        },
        error: () => {
          // Manejo de errores
          this.errorMessage = 'Failed to delete the order. Please try again later.';
        },
      });
    }
  
  //Aprobación de envíos en modo review
    approveDelivery(): void {
      if (!this.delivery.id_delivery) return;
    
      let newStatus = '';
      if (this.delivery.status === 'review') {
        newStatus = 'ready departure';
      } else if (this.delivery.status === 'pending reception') {
        newStatus = 'accepted';
      }
    
      const updatedDelivery = {
        ...this.delivery,
        status: newStatus,
      };
    
      console.log('Approving delivery with data:', updatedDelivery);
    
      this.deliveryService.updateDelivery(this.delivery.id_delivery, updatedDelivery).subscribe({
        next: () => {
          alert('Delivery approved successfully.');
          this.router.navigate(['/manager/order-list']);
        },
        error: () => {
          this.errorMessage = 'Failed to approve delivery.';
        },
      });
    }



//-------------------------------
//PROCESADO DE DATOS
//-------------------------------
  //Convierte un objeto Date a formato yyyy-MM-dd para los inputs tipo date
    toDateInputFormat(date: Date): string {
      // Obtener el año de la fecha
      const year = date.getFullYear();
    
      // Obtener el mes y agregar un 0 al inicio si es necesario (ejemplo: 1 -> 01)
      const month = String(date.getMonth() + 1).padStart(2, '0');
    
      // Obtener el día y agregar un 0 al inicio si es necesario (ejemplo: 1 -> 01)
      const day = String(date.getDate()).padStart(2, '0');
    
      // Devolver la fecha formateada como yyyy-MM-dd
      return `${year}-${month}-${day}`;
    }

  //Convierte una fecha en formato yyyy-MM-dd a formato datetime para el back-end
    toDateTimeFormat(dateString: string, time: string = '00:00:00'): string {
      // Combina la fecha en formato yyyy-MM-dd con la hora especificada (por defecto '00:00:00')
      return `${dateString} ${time}`;
    }

  //Convierte un objeto Date a formato yyyy-MM-dd para los inputs tipo date
    formatDateForInput(date: Date): string {
      // Extrae el año del objeto Date
      const year = date.getFullYear();
      // Extrae el mes (sumando 1 porque los meses en JavaScript van de 0 a 11) y lo formatea a dos dígitos
      const month = String(date.getMonth() + 1).padStart(2, '0');
      // Extrae el día y lo formatea a dos dígitos
      const day = String(date.getDate()).padStart(2, '0');
      // Combina el año, el mes y el día en formato yyyy-MM-dd
      return `${year}-${month}-${day}`;
    }

//-------------------------------
// NAVEGACIÓN
//-------------------------------
  //Acción de salida sin enviar el formulario
    cancel(): void {
      // Navega a la ruta relativa '../order-list' desde la ruta actual
      this.router.navigate(['../order-list'], { relativeTo: this.route });
    }

  }

