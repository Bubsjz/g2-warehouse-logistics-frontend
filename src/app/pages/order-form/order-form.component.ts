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
      this.detectMode()
      this.loadInitialData();
    }


//-------------------------------
//DETECCIÓN DE MODO Y CARGA DE DATOS
//-------------------------------

        //Determina el modo del formulario y carga los datos correspondientes
          async detectMode(): Promise<void> {
            // Detectar el rol desde la URL
            const fullUrl = this.router.url;
            if (fullUrl.includes('/operator/')) {
              this.role = 'operator';
            } else if (fullUrl.includes('/manager/')) {
              this.role = 'manager';
            } else {
              console.error('Role not detected in the URL. Defaulting to operator.');
              this.role = 'operator'; // Rol por defecto
            }
            console.log(`Detected role: ${this.role}`);

            // Detectar el ID desde los parámetros
            const id = +this.route.snapshot.paramMap.get('id')!;
            if (!id) {
              console.error('ID not found in the URL');
              return;
            }
            console.log(`Detected ID: ${id}`);

            // Determinar el modo
            if (fullUrl.includes('create-order')) {
              this.mode = 'create';
            } else if (fullUrl.includes('modify-order')) {
              this.mode = 'edit';
              await this.loadDeliveryWithProducts(id, this.role);
            } else if (fullUrl.includes('review-order')) {
              this.mode = 'review';
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
              const data = Array.isArray(response) ? response[0] : response;
                
              // Mapear los datos directamente
              this.delivery = this.normalizeDeliveryFromBackend(data);
                
              // Poblar selectores con datos combinados
              this.warehouses = data.warehouse || [];
              this.trucks = data.truck || [];
              this.products = data.productNames || [];
                
              // Configurar los productos del envío
              this.orderDetails = (data.products || []).map((product: { product_id: number; quantity: number }) => ({
                product_id: product.product_id,
                quantity: Number(product.quantity),
                touched: false,
              }));
                
              this.checkIfEditable();
              console.log('Delivery loaded:', this.delivery);
              } catch (error) {
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
                product_id: detail.product_id ? Number(detail.product_id) : null,
                quantity: Number(detail.quantity), // Forzar conversión a número
              })),
              // Enviar directamente los nombres y la placa
              origin_warehouse_name: this.delivery.origin_warehouse_name,
              destination_warehouse_name: this.delivery.destination_warehouse_name,
              plate: this.delivery.plate,
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
              id_delivery: data.id_delivery,
              send_date: data.send_date ? new Date(data.send_date) : null,
              received_date: data.received_date ? new Date(data.received_date) : null,
              comments: data.comments || '',
              status: data.status || 'pending',
              products: data.products.map((product: { product_id: number; quantity: string | number }) => ({
                product_id: product.product_id,
                quantity: Number(product.quantity),
              })),
              origin_warehouse_name: data.origin_warehouse_name,
              destination_warehouse_name: data.destination_warehouse_name,
              plate: data.plate,
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
              !this.delivery.origin_warehouse_name ||
              !this.delivery.destination_warehouse_name ||
              !this.delivery.plate
            ) {
              this.errorMessage = 'Please fill in all required fields with valid data.';
              console.log('Form validation failed: Missing required fields.');
              return false;
            }
          
            // Validar productos
            const invalidProducts = this.orderDetails.some(
              (detail) => !detail.product_id || detail.quantity <= 0 || isNaN(Number(detail.quantity))
            );
          
            if (invalidProducts) {
              this.errorMessage = 'All products must have a valid type and quantity greater than 0.';
              console.log('Form validation failed: Invalid products.', this.orderDetails);
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
            this.router.navigate(['/${this.role}/order-list'], { relativeTo: this.route });
          }

}

