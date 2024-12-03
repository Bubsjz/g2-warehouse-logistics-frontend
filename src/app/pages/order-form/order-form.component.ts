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
  import { Delivery, Warehouse, Truck, Product, CombinedResponse } from '../../interfaces/order.interfaces';
  
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
      plate: null,
      origin_warehouse_name: null,
      destination_warehouse_name: null,
      status: 'pending',
      comments: '',
      products: [],
    };
  
    // Listas cargadas desde el back-end
    warehouses: Warehouse[] = [];
    trucks: Truck[] = [];
    products: Product[] = [];
  
    // Detalles de los productos seleccionados para el pedido
    orderDetails: { 
      product_id: number | null; 
      product_name?: string;
      quantity: number; 
      touched: boolean; 
    }[] = [
      { product_id: null, quantity: 0, touched: false },
    ];
  
    // Mensaje de error para mostrar en caso de validación fallida o error del servidor
    errorMessage: string = '';
  
    // Indica si el formulario ya fue enviado
    submitted: boolean = false;

    // Indica si el rol puede gestionar productos
    canManageProducts: boolean = true;

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
      this.detectMode()
      this.loadInitialData();
    }


//-------------------------------
//DETECCIÓN DE MODO Y CARGA DE DATOS
//-------------------------------

        //Determina el modo del formulario y carga los datos correspondientes
          async detectMode(): Promise<void> {
            const fullUrl = this.router.url;
          
            if (fullUrl.includes('/operator/')) {
              this.role = 'operator';
            } else if (fullUrl.includes('/manager/')) {
              this.role = 'manager';
            } else {
              console.error('Role not detected in the URL. Defaulting to operator.');
              this.role = 'operator';
            }
          
            console.log(`Detected role: ${this.role}`);
          
            const id = +this.route.snapshot.paramMap.get('id')!;
            if (!id) {
              console.error('ID not found in the URL');
              return;
            }
            console.log(`Detected ID: ${id}`);
          
            if (fullUrl.includes('create-order')) {
              this.mode = 'create';
            } else if (fullUrl.includes('modify-order')) {
              this.mode = 'edit';
              await this.loadDeliveryWithProducts(id, this.role);
            } else if (fullUrl.includes('review-order')) {
              this.mode = 'review'; // Asegúrate de que esto sea válido
              await this.loadDeliveryWithProducts(id, this.role);
            }
          }

        

        //Carga los datos básicos para el funcionamiento del formulario
        async loadInitialData(): Promise<void> {
          if (this.mode !== 'create') {
            console.log('Skipping data loading as the mode is not "create".');
            return;
          }
        
          try {
            const combinedData = await firstValueFrom(this.deliveryService.getCombinedData());
        
            this.warehouses = combinedData.warehouse || [];
            this.trucks = combinedData.truck || [];
            this.products = combinedData.productNames || [];
        
            console.log('Combined data loaded:', combinedData);
          } catch (error) {
            this.errorMessage = 'Error loading combined initial data.';
            console.error(error);
          }
        }


        //Carga los detalles del envío seleccionado (con ayuda de loadDeliveryProducts) y controla que las fechas sean de tipo Date
          async loadDeliveryWithProducts(id: number, role: string): Promise<void> {
            try {
              const response = await firstValueFrom(this.deliveryService.getDeliveryById(id, role));
              console.log('Response from backend:', response);
              const data = Array.isArray(response) ? response[0] : response;
          
              // Normalizar los datos recibidos del backend
              this.delivery = this.normalizeDeliveryFromBackend(data);
              console.log('Mapped delivery:', this.delivery);
          
              // Configurar los productos, asegurando que la cantidad se asigna correctamente
              this.orderDetails = (data.products || []).map((product: { product_name: string; product_quantity: number }) => ({
                product_name: product.product_name || '', // Asegurar que siempre haya un nombre
                quantity: product.product_quantity ?? 0, // Cambiar de `quantity` a `product_quantity`
                touched: false,
              }));
          
              // Verificar condiciones de editabilidad del formulario
              this.checkIfEditable();
          
              // Depuración en consola
              console.log('Order details:', this.orderDetails);
            } catch (error) {
              // Manejo de errores
              console.error('Failed to load delivery data:', error);
              this.errorMessage = 'Error loading delivery data.';
            }
          }

//-------------------------------
//FUNCIONES DE PROCESAMIENTO DE DATOS
//-------------------------------
        
        //Genera un objeto con los datos del pedido para enviar al back-end
            prepareDeliveryPayload(status: string): any {
              return {
                ...this.delivery,
                status,
                send_date: this.delivery.send_date
                  ? dayjs(this.delivery.send_date).format('YYYY-MM-DD HH:mm:ss')
                  : null,
                received_date: this.delivery.received_date
                  ? dayjs(this.delivery.received_date).format('YYYY-MM-DD HH:mm:ss')
                  : null,
                products: this.orderDetails.map((detail) => ({
                  product_name: detail.product_name || '',
                  product_quantity: detail.quantity, // Cambiar `quantity` a `product_quantity` para el backend
                })),
              };
            }
        
        

        //Comprueba las condiciones de editabilidad
          checkIfEditable(): void {
            const editableStatuses = ['pending', 'corrections needed'];
            const reviewStatuses = ['review', 'pending reception'];
          
            // General editability: no editable in review mode, otherwise depends on status
            this.isEditable = this.mode !== 'review' && editableStatuses.includes(this.delivery.status);
          
            // Enable buttons: only for edit mode with specific statuses or review mode for specific statuses
            this.areButtonsEnabled =
              (this.mode === 'edit' && editableStatuses.includes(this.delivery.status)) ||
              (this.mode === 'review' && reviewStatuses.includes(this.delivery.status));
          
            // Comment field editable only in review mode for specific statuses
            if (this.mode === 'review') {
              this.isCommentEditable = reviewStatuses.includes(this.delivery.status);
            } else {
              this.isCommentEditable = false;
            }
          
            // Buttons for adding/removing products only in create or edit modes
            this.canManageProducts = this.mode !== 'review' && this.isEditable;
          }
          
        //Normaliza los datos de un pedido para mostrarlos en la interfaz
          normalizeDeliveryFromBackend(data: any): Delivery {
            return {
              id_delivery: data.id_delivery,
              send_date: data.send_date ? new Date(data.send_date) : null,
              received_date: data.received_date ? new Date(data.received_date) : null,
              comments: data.comments || '',
              status: data.status || 'pending',
              origin_warehouse_name: data.origin_warehouse_name || null,
              destination_warehouse_name: data.destination_warehouse_name || null,
              plate: data.plate || null,
              products: (data.products || []).map((product: { product_name: string; product_quantity: number }) => ({
                product_name: product.product_name,
                quantity: product.product_quantity ?? 0, // Ajustar al nuevo campo `product_quantity`
              })),
            };
          }


//-------------------------------
//VALIDACIONES
//-------------------------------

        //Validar campos cumplimentados y productos mayores a 0
          validateForm(): boolean {
            if (
              !this.delivery.send_date ||
              !dayjs(this.delivery.send_date).isValid() ||
              !this.delivery.origin_warehouse_id ||
              !this.delivery.destination_warehouse_id ||
              !this.delivery.truck_id_truck
            ) {
              this.errorMessage = 'Please fill in all required fields with valid data.';
              return false;
            }
          
            const invalidProducts = this.orderDetails.some(
              (detail) => !detail.product_name || detail.quantity <= 0
            );
          
            if (invalidProducts) {
              this.errorMessage = 'All products must have a valid name and quantity greater than 0.';
              return false;
            }
          
            this.errorMessage = '';
            return true;
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
            await this.saveDeliveryByStatus('review'); // Cambia el status a 'review'
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
                alert(status === 'review' ? 'Order updated successfully!' : 'Draft updated successfully!');
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
          
            const newStatus = this.delivery.status === 'review' ? 'corrections needed' : 'not approved';
          
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
            const newStatus = this.delivery.status === 'review' ? 'ready for departure' : 'approved';
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
            this.router.navigate([`/${this.role}/order-list`]);
          }

}

