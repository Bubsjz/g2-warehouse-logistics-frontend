  // Importaciones básicas de Angular
  import { Component, OnInit } from '@angular/core'; // Decorador para definir el componente y su ciclo de vida
  import { ActivatedRoute, Router } from '@angular/router'; // Herramientas para manejo de rutas y navegación
  import { FormsModule } from '@angular/forms'; // Funcionalidades para trabajar con formularios
  import { CommonModule } from '@angular/common'; // Funcionalidades comunes de Angular
  import { NgForm } from '@angular/forms'; // Tipo para formularios reactivos
  import { firstValueFrom } from 'rxjs';
  import dayjs from 'dayjs';

  // Importaciones del proyecto
  import { DeliveryService } from '../../services/order.service';
  import { Delivery, Warehouse, Truck, Product } from '../../interfaces/order.interfaces';
  
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
      send_date: null,
      received_date: null,
      truck_id_truck: null,
      origin_warehouse_id: null,
      destination_warehouse_id: null,
      status: 'pending',
      comments: '',
      products: [],
    };
  
    // Listas cargadas desde el back-end
    warehouses: Warehouse[] = [];
    trucks: Truck[] = [];
    products: Product[] = [];
  
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

    // Variable para almacenar el rol
    role: string = 'operator';
  
    // Constructor para inyectar dependencias
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private deliveryService: DeliveryService
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

        //Determina el modo del formulario y carga los datos correspondientes
// !!!! MODIFICAR RUTA REVIEW-ORDER PARA QUE COJA CON MODIFY-ORDER Y EL DIRECTORIO PREVIO (/MANAGER), TAMBIÉN MODIFICAR EL DIRECTORIO DEL ORDER-LIST
        async detectMode(): Promise<void> {
          const id = +this.route.snapshot.paramMap.get('id')!;
        
          // Detectar el rol en base a la URL
          this.role = this.route.snapshot.url[0]?.path === 'operator' ? 'operator' : 'manager';
        
          // Usar el rol detectado para decidir el modo
          if (this.route.snapshot.url.some((segment) => segment.path === 'create-order')) {
            this.mode = 'create';
          } else if (this.route.snapshot.url.some((segment) => segment.path === 'modify-order')) {
            this.mode = 'edit';
            await this.loadDeliveryWithProducts(id, this.role);
          } else if (this.route.snapshot.url.some((segment) => segment.path === 'review-order')) {
            this.mode = 'review';
            await this.loadDeliveryWithProducts(id, this.role);
          }
        }

        //Carga los datos básicos para el funcionamiento del formulario
        async loadInitialData(): Promise<void> {
          try {
            // Obtener el rol de la URL o de algún servicio
            const [warehouses, trucks, products] = await Promise.all([
              firstValueFrom(this.deliveryService.getWarehouses(this.role)),
              firstValueFrom(this.deliveryService.getTrucks(this.role)),
              firstValueFrom(this.deliveryService.getProducts(this.role)),
            ]);
      
            this.warehouses = warehouses || [];
            this.trucks = trucks || [];
            this.products = products || [];
      
            console.log('Initial data loaded:', { warehouses, trucks, products });
          } catch (error) {
            this.errorMessage = 'Error loading initial data.';
            console.error(error);
          }
        }

        //Carga los detalles del envío seleccionado (con ayuda de loadDeliveryProducts) y controla que las fechas sean de tipo Date
        async loadDeliveryWithProducts(id: number, role: string): Promise<void> {
          try {
            const [rawDelivery, products] = await Promise.all([
              firstValueFrom(this.deliveryService.getDeliveryById(id, role)),
              firstValueFrom(this.deliveryService.getDeliveryProducts(id, role)),
            ]);
        
            this.delivery = this.normalizeDeliveryFromBackend(rawDelivery);
        
            this.orderDetails = (products || [])
              .filter((product) => product.delivery_id_delivery === id)
              .map((product) => ({
                product_id: product.product_id_product,
                quantity: product.quantity,
                touched: false,
              }));
        
            this.checkIfEditable();
            console.log('Delivery and products loaded:', this.delivery, this.orderDetails);
          } catch (error: unknown) {
            if (error && typeof error === 'object' && 'status' in error) {
              const httpError = error as { status: number };
              if (httpError.status === 404) {
                alert('The delivery you are trying to access does not exist.');
                this.router.navigate(['/operator/order-list']);
              } else {
                this.errorMessage = 'An error occurred while loading the delivery. Please try again later.';
                console.error(error);
              }
            } else {
              this.errorMessage = 'An unexpected error occurred.';
              console.error(error);
            }
          }
        }

//-------------------------------
//FUNCIONES DE PROCESAMIENTO DE DATOS
//-------------------------------
        
        //Genera un objeto con los datos del pedido para enviar al back-end
          prepareDeliveryPayload(status: string): any {
            return {
              ...this.delivery,
              status, // Estado dinámico según el botón pulsado
              send_date: this.delivery.send_date
                ? dayjs(this.delivery.send_date).format('YYYY-MM-DD HH:mm:ss')
                : null,
              received_date: this.delivery.received_date
                ? dayjs(this.delivery.received_date).format('YYYY-MM-DD HH:mm:ss')
                : null,
              // Convierte los campos ID explícitamente a números
              truck_id_truck: this.delivery.truck_id_truck ? Number(this.delivery.truck_id_truck) : null,
              origin_warehouse_id: this.delivery.origin_warehouse_id ? Number(this.delivery.origin_warehouse_id) : null,
              destination_warehouse_id: this.delivery.destination_warehouse_id ? Number(this.delivery.destination_warehouse_id) : null,
              products: this.orderDetails.map((detail) => ({
                product_id: detail.product_id ? Number(detail.product_id) : null,
                quantity: detail.quantity,
              })),
            };
          }

        //Comprueba las condiciones de editabilidad
          checkIfEditable(): void {
            const editableStatuses = ['pending', 'corrections needed'];
            const reviewStatuses = ['under review', 'pending reception'];
          
            // Control de editabilidad general (modo edit y estados permitidos)
            this.isEditable = this.mode === 'edit' && editableStatuses.includes(this.delivery.status);
          
            // Botones habilitados
            this.areButtonsEnabled =
              (this.mode === 'edit' && editableStatuses.includes(this.delivery.status)) ||
              (this.mode === 'review' && reviewStatuses.includes(this.delivery.status));
          
            // Campo de comentarios (editable solo en ciertos casos en modo review)
            if (this.mode === 'edit') {
              this.isCommentEditable = this.delivery.status === 'corrections needed';
            } else if (this.mode === 'review') {
              this.isCommentEditable = reviewStatuses.includes(this.delivery.status);
            } else {
              this.isCommentEditable = false;
            }
          }

        //Normaliza los datos de un pedido para mostrarlos en la interfaz
          normalizeDeliveryFromBackend(data: any): Delivery {
            return {
              send_date: data?.send_date ? new Date(data.send_date) : null,
              received_date: data?.received_date ? new Date(data.received_date) : null,
              origin_warehouse_id: data?.origin_warehouse_id ?? null,
              destination_warehouse_id: data?.destination_warehouse_id ?? null,
              truck_id_truck: data?.truck_id_truck ?? null,
              comments: data?.comments ?? '',
              status: data?.status ?? 'pending',
              products: data?.products ?? [],
              id_delivery: data?.id_delivery ?? undefined,
            };
          }


//-------------------------------
//VALIDACIONES
//-------------------------------

        //Validar campos cumplimentados y productos mayores a 0
          validateForm(): boolean {
            // Validar campos principales (fechas y selectores obligatorios)
            if (
              !this.delivery.send_date || // Verifica que no sea null
              !dayjs(this.delivery.send_date).isValid() || // Verifica que sea una fecha válida
              !this.delivery.received_date || // Verifica que no sea null
              !dayjs(this.delivery.received_date).isValid() || // Verifica que sea una fecha válida
              !this.delivery.origin_warehouse_id || // ID del almacén de origen válido
              !this.delivery.destination_warehouse_id || // ID del almacén de destino válido
              !this.delivery.truck_id_truck // ID del camión válido
            ) {
              this.errorMessage = 'Please fill in all required fields with valid data.';
              console.log('Form validation failed: Missing required fields.');
              return false; // Formulario no válido
            }
          
            // Validar productos (todos deben tener un tipo y cantidad mayor a 0)
            const invalidProducts = this.orderDetails.some(
              (detail) => !detail.product_id || detail.quantity <= 0
            );
          
            if (invalidProducts) {
              this.errorMessage = 'All products must have a valid type and quantity greater than 0.';
              console.log('Form validation failed: Invalid products.', this.orderDetails);
              return false; // Formulario no válido
            }
          
            // Si todos los datos son válidos, limpiar el mensaje de error y retornar true
            this.errorMessage = '';
            return true; // Formulario válido
          }

//-------------------------------
//ENVÍOS Y APROBACIONES
//-------------------------------

        //Enviar el formulario (crear o actualizar un pedido)
          onSubmit(form: NgForm): void {
            // Marcar el formulario como enviado para activar las validaciones visuales
            this.submitted = true;
          
            // Validar los datos del formulario antes de proceder
            if (!this.validateForm()) {
              console.log('Form submission blocked due to validation errors.');
              return;
            }
          
            // Mostrar en la consola los datos que se enviarán si el formulario es válido
            console.log('Form submitted successfully with data:', this.delivery, this.orderDetails);
          
            // Proceder a guardar los datos (crear o actualizar el envío)
            this.saveDelivery();
          }

        //Guarda un pedido con el status 'pending'
          async saveAsDraft(): Promise<void> {
            await this.saveDeliveryByStatus('pending'); // Cambia el status a 'pending'
          }

        //Guarda un pedido con el status 'review'
          async saveDelivery(): Promise<void> {
            await this.saveDeliveryByStatus('under review'); // Cambia el status a 'review'
          }

        //Guarda un pedido con un status específico
        async saveDeliveryByStatus(status: string): Promise<void> {
          const deliveryPayload = this.prepareDeliveryPayload(status);
          console.log('Payload to be sent:', deliveryPayload);
        
          try {
            // Obtener el rol de la URL o de algún servicio
            const role = this.role; // Usamos el `role` que ya está asignado
        
            if (this.mode === 'create') {
              await firstValueFrom(this.deliveryService.createDelivery(deliveryPayload));
              alert(status === 'pending' ? 'Draft saved successfully!' : 'Order created successfully!');
            } else if (this.mode === 'edit') {
              await firstValueFrom(this.deliveryService.updateDelivery(this.delivery.id_delivery!, deliveryPayload));
              alert(status === 'under review' ? 'Order updated successfully!' : 'Draft updated successfully!');
            }
            this.router.navigate(['/operator/order-list']);
          } catch (error) {
            this.errorMessage = `Failed to ${status === 'pending' ? 'save draft' : 'save order'}.`;
            console.error(error);
          }
        }

        //Envío de comentarios en modo review
          async submitReview(): Promise<void> {
            if (!this.delivery.id_delivery) {
              console.error('Delivery ID is missing.');
              return;
            }
          
            const newStatus = this.delivery.status === 'under review' ? 'corrections needed' : 'not approved';
          
            try {
              // Reutiliza `updateDeliveryStatus` para actualizar el estado y comentarios
              await this.updateDeliveryStatus(newStatus, this.delivery.comments);
              console.log(newStatus, this.delivery.comments);
              alert('Comments sent successfully.');
            } catch (error) {
              this.errorMessage = `Failed to update delivery comments.`;
              console.error(error);
            }
          }
      
        //Aprobación de envíos en modo review
          async approveDelivery(): Promise<void> {
            const newStatus = this.delivery.status === 'under review' ? 'ready for departure' : 'approved';
            console.log(newStatus);
            await this.updateDeliveryStatus(newStatus);
          }

        //Actualiza el estado de un pedido en modo review
        async updateDeliveryStatus(newStatus: "corrections needed" | "ready for departure" | "approved" | "not approved", comments?: string | null): Promise<void> {
          if (!this.delivery.id_delivery) {
            console.error('Delivery ID is missing.');
            return;
          }
        
          // Crea el payload dinámicamente, incluyendo comentarios si se proporcionan
          const updatedDelivery = {
            ...this.delivery,
            status: newStatus, // Se asegura de que el nuevo estado sea uno de los valores válidos
            comments: comments?.trim() || this.delivery.comments, // Prioriza comentarios pasados al método
          };
        
          try {
            // Obtener el rol de la URL o de algún servicio
            const role = this.role;
            await firstValueFrom(this.deliveryService.updateDelivery(this.delivery.id_delivery, updatedDelivery));
            alert(`Delivery status updated to ${newStatus}`);
            this.router.navigate(['/manager/order-list']);
          } catch (error) {
            this.errorMessage = `Failed to update delivery status to ${newStatus}.`;
            console.error(error);
          }
        }
        
        //Elimina un pedido
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
                alert('Order deleted successfully!');
                this.router.navigate(['/operator/order-list']);
              },
              error: () => {

                this.errorMessage = 'Failed to delete the order. Please try again later.';
              },
            });
          }

//------------------------------- 
//ACCIONES EN EL FORMULARIO
//-------------------------------

        //Agrega un nuevo producto al pedido
          addProduct(): void {
            // Inserta un nuevo producto con valores iniciales en la lista de detalles
            this.orderDetails.push({ 
              product_id: null,
              quantity: 0,
              touched: false,
            });
            console.log('Product added. Current details:', this.orderDetails);
          }
        
        //Elimina un producto del pedido
          removeProduct(index: number): void {
            // Verificar si hay más de un producto en la lista
            if (this.orderDetails.length > 1) {
              this.orderDetails.splice(index, 1);
              console.log('Product removed. Current details:', this.orderDetails);
            } else {
              // Mostrar alerta si el usuario intenta eliminar el último producto
              alert('You must have at least one product in the order.');
            }
          }

//-------------------------------
//PROCESADO DE FECHAS
//-------------------------------

        //Convierte una fecha en formato yyyy-MM-dd a formato datetime para el back-end
          toDateTimeFormat(dateString: string, time: string = '00:00:00'): string {
            return dayjs(`${dateString}T${time}`).format('YYYY-MM-DD HH:mm:ss');
          }

        //Convierte un objeto Date a formato yyyy-MM-dd para los inputs tipo date
          formatDateForInput(date: Date): string {
            return dayjs(date).format('YYYY-MM-DD');
          }

        //Controla que la fecha sea de tipo Date y posibles cambios
          onDateChange(field: 'send_date' | 'received_date', value: string | null): void {
            this.delivery[field] = value ? dayjs(value).toDate() : null;
          }

//-------------------------------
// NAVEGACIÓN
//-------------------------------

        //Salida sin enviar el formulario
          cancel(): void {
            this.router.navigate(['../order-list'], { relativeTo: this.route });
          }

}

