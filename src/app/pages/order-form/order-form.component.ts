  import { Component, OnInit } from '@angular/core';
  import { ActivatedRoute, Router } from '@angular/router';
  import { FormsModule } from '@angular/forms';
  import { CommonModule } from '@angular/common';
  import { NgForm } from '@angular/forms';
  import { firstValueFrom } from 'rxjs';
  import { HttpErrorResponse } from '@angular/common/http';
  import dayjs from 'dayjs';
  import Swal from 'sweetalert2';
  import { DeliveryService } from '../../services/order.service';
  import { Delivery, Warehouse, Truck, Product } from '../../interfaces/order.interface';
  import { AuthService } from '../../services/token.service';

  
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
      product_name: string | null;
      product_quantity: number; 
      touched: boolean; 
    }[] = [
      { product_name: null, product_quantity: 0, touched: false },
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
    role: string = '';
  
    // Constructor para inyectar dependencias
    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private deliveryService: DeliveryService,
      private authService: AuthService
    ) {}

    

//-------------------------------
//ARRANQUE
//-------------------------------

          ngOnInit(): void {
            this.detectMode()
          }


//-------------------------------
//DETECCIÓN DE MODO Y CARGA DE DATOS
//-------------------------------

        //Determina el rol y modo del formulario y carga los datos correspondientes
          private async detectMode(): Promise<void> {

            // Obtener el rol del token
            const userRole = this.authService.getUserRole();
            if (!userRole) {
              console.error('User role not found in token. Redirecting to login.');
              this.router.navigate(['/login']);
              return;
            }
            this.role = userRole;

            // Si el rol es 'operator', asignar la matrícula del token al formulario
            const userPlate = this.authService.getUserPlate();
            if (this.role === 'operator' && userPlate) {
              this.delivery.plate = userPlate;
            }
              
            // Detectar el modo y carga de datos de selectores
            const fullUrl = this.router.url;
            if (fullUrl.includes('create-order')) {
              this.mode = 'create';
              await this.loadInitialData();
            } else if (fullUrl.includes('modify-order')) {
              this.mode = 'edit';
              await this.loadInitialData();
            } else if (fullUrl.includes('review-order')) {
              this.mode = 'review';
            } else {
              console.error('Invalid mode detected. Defaulting to "create".');
              this.mode = 'create';
            }
            
            // Si no es "create", cargar datos del pedido
            if (this.mode !== 'create') {
              const id = +this.route.snapshot.paramMap.get('id')!;
              if (!id) {
                console.error('Missing ID for non-create mode.');
                return;
              }
              await this.loadDeliveryWithProducts(id, this.role);
            
              // Confirmar carga exitosa del estado
              if (!this.delivery.status) {
                console.error('Status is missing after data load.');
                this.errorMessage = 'Failed to load valid delivery data.';
              }
            }
          }

        //Carga los datos básicos para el funcionamiento del formulario y asiganción de los datos al HTML
          async loadInitialData(): Promise<void> {
            try {
              //Uso de firstValueFrom para manejar el observable del servicio y transformar en promesa
              const combinedData = await firstValueFrom(this.deliveryService.getCombinedData());

              if (Array.isArray(combinedData) && combinedData.length > 0) {
                const data = combinedData[0];

              //Asignación de datos al HTML
              this.warehouses = data.warehouse || [];
              this.trucks = data.truck || [];
              this.products = data.productNames || [];
              } else {
                console.error('Unexpected structure in the data received from the back:', combinedData);
              }

            } catch (error: unknown) {
              console.error('Error loading combined initial data:', error);
              if (this.isHttpErrorResponse(error) && error.status === 500) {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to load the necessary data for the form. Redirecting...',
                  icon: 'error',
                  confirmButtonText: 'Accept',
                }).then(() => {
                  this.router.navigate([`/${this.role}/order-list`]);
                });
              }
            }
          }

        //Carga los detalles del envío seleccionado los formatea y establece su estado en el formulario
          async loadDeliveryWithProducts(id: number, role: string): Promise<void> {
            try {
              const response = await firstValueFrom(this.deliveryService.getDeliveryById(id, role));

              //Si el response es un array, toma el primer elemento
              const data = Array.isArray(response) ? response[0] : response;
          
              // Normalizar los datos recibidos del backend para que coincidan con los datos del formulario
              const normalizedData = this.normalizeDeliveryFromBackend(data);
              this.delivery = normalizedData.delivery;
              this.orderDetails = normalizedData.orderDetails;
              
              if (!this.orderDetails || this.orderDetails.length === 0) {
                console.warn('No products found for this delivery.');
              }

              // Verificar condiciones de editabilidad del formulario
              this.checkIfEditable();
          
            } catch (error: unknown) {
              console.error('Error loading delivery with products:', error);
              if (this.isHttpErrorResponse(error) && error.status === 500) {
                Swal.fire({
                  title: 'Error',
                  text: 'Failed to load order data. Redirecting...',
                  icon: 'error',
                  confirmButtonText: 'Accept',
                }).then(() => {
                  this.router.navigate([`/${this.role}/order-list`]);
                });
              }
            }
          }


//-------------------------------
//FUNCIONES DE PROCESAMIENTO DE DATOS
//-------------------------------
        
        //Normalización de datos del back para poder trabajarlos y transformarlos en el formulario
          normalizeDeliveryFromBackend(data: any): { 
            delivery: Delivery; 
            orderDetails: { product_id: null; product_name: string; product_quantity: number; touched: boolean }[] 
          } {
            // Procesar los productos recibidos o establecer un producto vacío si no hay datos
            const orderDetails = (data.products || []).map((product: { product_name: string; product_quantity: number }) => ({
              product_name: product.product_name || '',
              product_quantity: product.product_quantity ?? 0,
              touched: false,
            }));
          
            // Si no hay productos, añadir un campo vacío
            if (orderDetails.length === 0) {
              orderDetails.push({
                product_name: null,
                product_quantity: 0,
                touched: false,
              });
            }
            
            return {
              delivery: {
                id_delivery: data.id_delivery,
                send_date: this.onDateChangeTransform(data.send_date),
                received_date: this.onDateChangeTransform(data.received_date),
                comments: data.comments || null,
                status: data.status || null,
                origin_warehouse_name: data.origin_warehouse_name || null,
                destination_warehouse_name: data.destination_warehouse_name || null,
                plate: data.plate || null,
                products: [],
              },
              orderDetails,
            };
          }       

        //Genera un objeto con los datos del pedido para enviar al back-end
          prepareDeliveryPayload(status: string): any {
            return {
              ...this.delivery,
              status,
              send_date: this.delivery.send_date
                ? this.toDateTimeFormat(dayjs(this.delivery.send_date).format('YYYY-MM-DD'))
                : null,
              received_date: this.delivery.received_date
                ? this.toDateTimeFormat(dayjs(this.delivery.received_date).format('YYYY-MM-DD'))
                : null,
              products: this.orderDetails.map((detail) => ({
                product_name: detail.product_name || '',
                product_quantity: detail.product_quantity,
              })),
              plate: this.delivery.plate || null,
            };
          }
        

//-------------------------------
//PROCESADO DE FECHAS
//-------------------------------

        // Formateo de fechas en formato dd/mm/yyyy en normalizeDeliveryFromBackend
          onDateChangeTransform(dateString: string | null): Date | null {
            return dateString ? dayjs(dateString, 'YYYY-MM-DD HH:mm:ss').toDate() : null;
          }

        //Convierte formato Date en String en el HTML
          formatDateForInput(date: Date): string {
            return dayjs(date).format('YYYY-MM-DD');
          }

        //Controla cambios de fecha en inputs del HTML
          onDateChange(field: 'send_date' | 'received_date', value: string | null): void {
            this.delivery[field] = value ? dayjs(value).toDate() : null;
          }
          
        //Convierte una fecha en formato yyyy-MM-dd a formato datetime para el back-end
          toDateTimeFormat(dateString: string, time: string = '00:00:00'): string {
            return dayjs(`${dateString}T${time}`).format('YYYY-MM-DD HH:mm:ss');
          }


//-------------------------------
//VALIDACIONES
//-------------------------------

        //Validación de campos y datos para envío al back-end en modo create o edit
          validateForm(): boolean {

            // En modo review no se validan los campos porque solo se puede interactuar con comentarios, que son opcionales
            if (this.mode === 'review') {
              return true;
            }
            //Control de los campos
            if (
              !this.delivery.send_date ||
              !dayjs(this.delivery.send_date).isValid() ||
              !this.delivery.received_date || 
              !dayjs(this.delivery.received_date).isValid() ||
              !this.delivery.origin_warehouse_name ||
              !this.delivery.destination_warehouse_name ||
              (this.role === 'operator' && !this.delivery.plate)
            ) {
              this.errorMessage = 'Please fill in all required fields with valid data.';
              return false;
            }
            //Control únicodel los productos
            const invalidProducts = this.orderDetails.some(
              (detail) => !detail.product_name || detail.product_quantity <= 0
            );
            //Aviso para cuando no hay unidades
            if (invalidProducts || this.orderDetails.length === 0) {
              this.errorMessage = 'All products must have a valid name and quantity greater than 0.';
              return false;
            }
          
            this.errorMessage = '';
            return true;
          }

          private isHttpErrorResponse(error: unknown): error is HttpErrorResponse {
            return error instanceof HttpErrorResponse;
          }

//-------------------------------
//ENVÍOS Y APROBACIONES
//-------------------------------

        //Enviar el formulario (crear o actualizar un pedido)
          async onSubmit(form: NgForm): Promise<void> {
            this.submitted = true;
          
            // Llamada a validateForm para comprobar validez del formulario
            if (!this.validateForm()) {
              return;
            }
          
            // Constrol de estado para asignar respuesta al back-end
            try {
              await this.processModeSpecificActions('save');
            } catch (error) {
              console.error('Error during save:', error);
              this.errorMessage = 'An error occurred while saving the delivery.';
            }
          }

        //Procesa las acciones específicas del modo en los botones para envío al back de los datos
          async processModeSpecificActions(action: 'save' | 'submit' | 'update' | 'approve' | 'reject', status?: string): Promise<void> {
              
            if (action === 'save' && this.mode === 'create') {
              await this.handleCreateAction(status || 'pending');
              return;
            }

            if (action === 'update' && this.mode === 'edit') {
              await this.handleEditAction(status || 'review');
              return;
            }

            if (this.mode === 'review' && ['submit', 'approve', 'reject'].includes(action)) {
              await this.handleReviewAction(action as 'submit' | 'approve' | 'reject');
              return;
            }
          }

        //Modo creación
          async handleCreateAction(status: string): Promise<void> {
              const deliveryPayload = this.prepareDeliveryPayload(status);
              try {
                  await firstValueFrom(this.deliveryService.createDelivery(deliveryPayload));
                  const message = status === 'pending' ? 'Draft saved successfully!' : 'Order created successfully!';
                  Swal.fire('Success', message, 'success');
                  this.router.navigate([`/${this.role}/order-list`]);
              } catch (error) {
                  this.errorMessage = status === 'pending' ? 'Failed to save draft.' : 'Failed to create order.';
                  Swal.fire('Error', this.errorMessage, 'error');
                  console.error('Error during delivery creation:', error);
              }
            }


        //Modo edición
          async handleEditAction(status: string): Promise<void> {
              const deliveryPayload = this.prepareDeliveryPayload(status);
              try {
                await firstValueFrom(this.deliveryService.updateDelivery(this.delivery.id_delivery!, deliveryPayload));
                const message = this.delivery.status === 'pending' ? 'Order created successfully!' : 'Order updated successfully!';
                Swal.fire('Success', message, 'success');
                this.router.navigate([`/${this.role}/order-list`]);
              } catch (error) {
                this.errorMessage = 'Failed to update order.';
                Swal.fire('Error', this.errorMessage, 'error');
                console.error('Error during delivery update:', error);
              }
          }

        //Cambio de estado de un pedido en proceso de envío
          async handleStatusChange(): Promise<void> {
            try {
              const nextStatus = this.delivery.status === 'ready for departure' ? 'in transit' : 'delivered';
              const confirm = await Swal.fire({
                title: 'Confirm Action',
                text: `Are you sure you want to mark this order as "${nextStatus}"?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'Cancel',
              });
              if (!confirm.isConfirmed) {
                return;
              }
          
              // Enviar datos actualizados al backend
              const deliveryPayload = this.prepareDeliveryPayload(nextStatus);       
              await firstValueFrom(this.deliveryService.updateDelivery(this.delivery.id_delivery!, deliveryPayload));
              Swal.fire('Success', `Order marked as "${nextStatus}".`, 'success');
              this.router.navigate([`/${this.role}/order-list`]);
            } catch (error) {
              console.error('Error updating delivery status:', error);
              Swal.fire('Error', 'Failed to update order status. Please try again later.', 'error');
            }
          }


        //Manejo de respuesta en modo revisión previo envío
          async handleReviewAction(action: 'approve' | 'submit' | 'reject'): Promise<void> {
            // Configuración de acciones
            const actionHandlers: Record<string, { status: string; confirmationText: string }> = {
              approve: {
                status: this.delivery.status === 'review' ? 'ready for departure' : 'approved',
                confirmationText: `Are you sure you want to approve this order?`,
              },
              submit: {
                status: this.delivery.status === 'review' ? 'corrections needed' : 'not approved',
                confirmationText: 'Are you sure you want to submit your comments?',
              },
              reject: {
                status: 'not approved',
                confirmationText: 'Are you sure you want to reject this order?',
              },
            };
            
            // Comprobación específica para "reject"
            if (action === 'reject' && this.delivery.status !== 'pending reception') {
              Swal.fire({
                title: 'Action Not Allowed',
                text: 'The order can only be rejected if its current status is "pending reception".',
                icon: 'error',
                confirmButtonText: 'OK',
              });
              return;
            }
            
            // Obtener configuración de la acción
            const handler = actionHandlers[action];
            if (!handler) {
              console.error('Unknown action:', action);
              return;
            }
            
            // Confirmación del usuario
            const confirm = await Swal.fire({
              title: 'Confirm Action',
              text: handler.confirmationText,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, proceed!',
              cancelButtonText: 'Cancel',
            });
            
            if (!confirm.isConfirmed) {
              return;
            }
            
          // Actualización del estado
            try {
              const comments = this.delivery.comments;
              await this.updateDeliveryStatus(handler.status, comments);
              Swal.fire('Success', `Order status updated to "${handler.status}".`, 'success');
              this.router.navigate([`/${this.role}/order-list`]);
            } catch (error) {
              this.errorMessage = `Failed to perform action: ${action}.`;
              Swal.fire('Error', this.errorMessage, 'error');
              console.error('Error during review action:', error);
            }
          }

        //Actualiza el estado de un pedido en modo review
          async updateDeliveryStatus(newStatus: string, comments?: string | null): Promise<void> {
            if (!this.delivery.id_delivery) {
              console.error('Delivery ID is missing.');
              return;
            }
            try {
              await firstValueFrom(this.deliveryService.updateDeliveryStatus(
                  this.delivery.id_delivery,
                  newStatus,
                  comments || this.delivery.comments,
              ));
            } catch (error) {
              console.error('Error during status update:', error);
              throw error;
            }
          }

        // Para mandar datos en modo review  
          async updateReview(): Promise<void> {
            await this.handleReviewAction('submit');
          }

        //Elimina un pedido
          async deleteDelivery(): Promise<void> {
            const confirm = await Swal.fire({
              title: 'Confirm Deletion',
              text: 'Are you sure you want to delete this order? This action cannot be undone.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete it!',
              cancelButtonText: 'Cancel',
            });
          
            if (!confirm.isConfirmed) {
              return;
            }
            try {
              await firstValueFrom(this.deliveryService.deleteDelivery(this.delivery.id_delivery!));
              Swal.fire('Success', 'Order deleted successfully.', 'success');
              this.router.navigate(['/operator/order-list']);
            } catch (error) {
              this.errorMessage = 'Failed to delete the order. Please try again later.';
              console.error('Error during deletion:', error);
            }
          }


//------------------------------- 
//ACCIONES EN EL FORMULARIO
//-------------------------------

        //Comprueba las condiciones de editabilidad
          checkIfEditable(): void {
            const editableStatuses = ['pending', 'corrections needed'];
            const reviewStatuses = ['review', 'pending reception'];
            const nonEditableStatuses = ['ready for departure', 'in transit'];
            
            // Modo creación
            if (this.mode === 'create') {
              this.isEditable = true;
              this.isCommentEditable = false;
              this.areButtonsEnabled = this.role === 'operator';
              this.canManageProducts = true;
              return;
            }
            
            // Modo edición
            if (this.mode === 'edit') {
              this.isEditable = this.role === 'operator' && editableStatuses.includes(this.delivery.status);
              this.isCommentEditable = false;
              this.areButtonsEnabled = this.role === 'operator' && editableStatuses.includes(this.delivery.status);
              this.canManageProducts = this.isEditable;
              return;
            }
            
            // Modo review
            if (this.mode === 'review') {
              this.isEditable = false;
              this.isCommentEditable = this.role === 'manager' && reviewStatuses.includes(this.delivery.status);
              this.areButtonsEnabled = this.role === 'manager' && reviewStatuses.includes(this.delivery.status);
              this.canManageProducts = false;
              return;
            }
            
            // Cambios de status (ready for departure, in transit)
            if (nonEditableStatuses.includes(this.delivery.status)) {
              this.isEditable = false;
              this.isCommentEditable = false;
              this.areButtonsEnabled = this.role === 'operator';
              this.canManageProducts = false;
              return;
            }
            
            // Resto de situaciones
            this.isEditable = false;
            this.isCommentEditable = false;
            this.areButtonsEnabled = false;
            this.canManageProducts = false;
          }

        //Agrega un nuevo producto al pedido
          addProduct(): void {
            this.orderDetails.push({ 
              product_name: '',
              product_quantity: 0,
              touched: false,
            });
          }
        
        //Elimina un producto del pedido, verificando que no se elimine el último producto
          removeProduct(index: number): void {
            if (this.orderDetails.length > 1) {
              this.orderDetails.splice(index, 1);
            } else {
              alert('You must have at least one product in the order.');
            }
          }

        //Salida sin enviar el formulario
          cancel(): void {
            this.router.navigate([`/${this.role}/order-list`]);
          }
        
        //Contenido del título del formulario en base al modo y status del pedido
          getTitle(): string {
            if (this.mode === 'create') {
              return 'Create Order';
            } else if (this.mode === 'edit') {
              if (this.delivery.status === 'pending') {
                return 'Draft Order';
              } else if (this.delivery.status === 'corrections needed') {
                return 'Modify Order';
              }
            } else if (this.mode === 'review') {
              if (this.delivery.status === 'review') {
                return 'Review output Order';
              } else if (this.delivery.status === 'pending reception') {
                return 'Review entry Order';
              } else {
                return 'Review Order';
              }
            }
            return 'Order Management';
          }

}