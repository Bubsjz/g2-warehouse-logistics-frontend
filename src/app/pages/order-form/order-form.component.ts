  // Importaciones básicas de Angular
  import { Component, OnInit } from '@angular/core'; // Decorador para definir el componente y su ciclo de vida
  import { ActivatedRoute, Router } from '@angular/router'; // Herramientas para manejo de rutas y navegación
  import { FormsModule } from '@angular/forms'; // Funcionalidades para trabajar con formularios
  import { CommonModule } from '@angular/common'; // Funcionalidades comunes de Angular
  import { NgForm } from '@angular/forms'; // Tipo para formularios reactivos
  import { firstValueFrom } from 'rxjs';
  import { HttpErrorResponse } from '@angular/common/http';
  import dayjs from 'dayjs';
  import Swal from 'sweetalert2';


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
      product_quantity: number; 
      touched: boolean; 
    }[] = [
      { product_id: null, product_quantity: 0, touched: false },
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
          }


//-------------------------------
//DETECCIÓN DE MODO Y CARGA DE DATOS
//-------------------------------

        //Determina el modo del formulario y carga los datos correspondiente
            async detectMode(): Promise<void> {
              const fullUrl = this.router.url;
            
              // Detectar el rol
              this.role = fullUrl.includes('/manager/') ? 'manager' : 'operator';
              console.log(`Role detected: ${this.role}`);
            
              // Detectar el modo
              if (fullUrl.includes('create-order')) {
                this.mode = 'create';
                console.log(`Mode detected: ${this.mode}`);
                await this.loadInitialData();
              } else if (fullUrl.includes('modify-order')) {
                this.mode = 'edit';
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
                console.log(`Detected ID: ${id}`);
                await this.loadDeliveryWithProducts(id, this.role);
            
                // Confirmar carga exitosa del estado
                if (!this.delivery.status) {
                  console.error('Status is missing after data load.');
                  this.errorMessage = 'Failed to load valid delivery data.';
                } else {
                  console.log('Loaded delivery status:', this.delivery.status);
                }
              }
            }

        //Carga los datos básicos para el funcionamiento del formulario y asiganción de los datos al HTML
          async loadInitialData(): Promise<void> {
            try {
              //Uso de firstValueFrom para manejar el observable del servicio y transformar en promesa
              const combinedData = await firstValueFrom(this.deliveryService.getCombinedData());
              console.log('Combined data loaded:', combinedData);

              //Asignación de datos al HTML
              this.warehouses = combinedData.warehouse || [];
              this.trucks = combinedData.truck || [];
              this.products = combinedData.productNames || [];
          
              console.log('Combined data asigned to HTML:', this.warehouses, this.trucks, this.products);

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
              //Petición al back-end de los detalles del envío según el ID y el rol
              const response = await firstValueFrom(this.deliveryService.getDeliveryById(id, role));
              console.log('Petition getDeliveryById response:', response);

              //Si el response es un array, toma el primer elemento (Revisar si requiere dee ajsutes en base a respuesta del back-end)
              const data = Array.isArray(response) ? response[0] : response;
              console.log('Response from backend:', data);
          
              // Normalizar los datos recibidos del backend para que coincidan con los datos del formulario (normalizeDeliveryFromBackend)
              const normalizedData = this.normalizeDeliveryFromBackend(data);
              this.delivery = normalizedData.delivery;
              this.orderDetails = normalizedData.orderDetails;
              console.log('Mapped delivery:', this.delivery);
              console.log('Mapped order details:', this.orderDetails);
              
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
            return {
              delivery: {
                id_delivery: data.id_delivery,
                send_date: this.onDateChangeTransform(data.send_date),
                received_date: this.onDateChangeTransform(data.received_date),
                comments: data.comments || '',
                status: data.status || 'null',
                origin_warehouse_name: data.origin_warehouse_name || null,
                destination_warehouse_name: data.destination_warehouse_name || null,
                plate: data.plate || null,
                products: [],
              },
              orderDetails: (data.products || []).map((product: { product_name: string; product_quantity: number }) => ({
                product_name: product.product_name || '',
                product_quantity: product.product_quantity ?? 0,
                touched: false,
              })),
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
              !this.delivery.plate
            ) {
              this.errorMessage = 'Please fill in all required fields with valid data.';
              return false;
            }
            //Control únicodel los productos
            const invalidProducts = this.orderDetails.some(
              (detail) => !detail.product_name || detail.product_quantity <= 0
            );
            //Aviso para cuando no hay unidades
            if (invalidProducts) {
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
            // Marcar el formulario como enviado para activar las validaciones visuales
            this.submitted = true;
          
            // Llamada a validateForm para comprobar validez del formulario
            if (!this.validateForm()) {
              console.log('Form submission blocked due to validation errors.');
              return;
            }
          
            console.log('Form submitted successfully with data:', this.delivery, this.orderDetails);
          
            // Envío de los datos al back por otra función saveDelivery
            try {
              await this.processModeSpecificActions('save');
            } catch (error) {
              console.error('Error during save:', error);
              this.errorMessage = 'An error occurred while saving the delivery.';
            }
          }

        //Procesa las acciones específicas del modo en los botones paraenvío al back de los datos (approve y reject a la espera por si se implementa)
            async processModeSpecificActions(action: 'save' | 'submit' | 'update' | 'approve' | 'reject', status?: string): Promise<void> {
              if (action === 'save') {
                  if (this.mode === 'create') {
                      // Crear pedido nuevo (POST)
                      await this.handleCreateAction(status || 'pending');
                  } else {
                      console.error(`Invalid action '${action}' for mode '${this.mode}'.`);
                  }
                  return;
              }
          
              if (action === 'update') {
                  if (this.mode === 'edit') {
                      // Actualizar pedido existente (PUT)
                      await this.handleEditAction(status || 'review');
                  } else {
                      console.error(`Invalid action '${action}' for mode '${this.mode}'.`);
                  }
                  return;
              }

              if (this.mode === 'review') {
                if (['submit', 'approve', 'reject'].includes(action)) {
                    // Manejo de acciones específicas de revisión
                    await this.handleReviewAction(action as 'submit' | 'approve' | 'reject');
                } else {
                    console.error(`Invalid review action '${action}' for mode '${this.mode}'.`);
                }
                return;
              }
          
              console.error(`Unsupported action '${action}' in mode '${this.mode}'.`);
          }

          //Modo creación
              async handleCreateAction(status: string): Promise<void> {
                const deliveryPayload = this.prepareDeliveryPayload(status);
                console.log('Creating delivery with payload:', deliveryPayload);
            
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
              console.log('Updating delivery with payload:', deliveryPayload);
          
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
              const comments = action === 'submit' ? this.delivery.comments : null;
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
              // Llama al servicio updateDeliveryStatus pasando el rol actual
              await firstValueFrom(this.deliveryService.updateDeliveryStatus(
                  this.delivery.id_delivery,
                  newStatus,
                  comments || this.delivery.comments,
              ));
              console.log(`Delivery status updated to "${newStatus}".`);
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

            // En caso de haber fallo en obtener datos del back-end o estado del pedido no está definido, deshabilita todos los campos y botones excepto "Back"
            if (this.errorMessage || (this.mode !== 'create' && !this.delivery.status)) {
              console.warn('Error detected or missing status. Disabling all fields and buttons except "Back".');
              this.isEditable = false;
              this.areButtonsEnabled = false;
              this.isCommentEditable = false;
              this.canManageProducts = false;
              return;
            }

            // Controla la editabilidad del formulario, no disponible en modo de revisión y depende del estado del pedido
            this.isEditable = this.mode !== 'review' && editableStatuses.includes(this.delivery.status);
          
            // Botones visibles en función del modo y el estado del pedido
            this.areButtonsEnabled =
              (this.mode === 'edit' && editableStatuses.includes(this.delivery.status)) ||
              (this.mode === 'review' && reviewStatuses.includes(this.delivery.status));
          
            // Comentarios editables solo en modo review y dependiente del estado del pedido
            if (this.mode === 'review') {
              this.isCommentEditable = reviewStatuses.includes(this.delivery.status);
            } else {
              this.isCommentEditable = false;
            }
          
            // Buttons for adding/removing products only in create or edit modes
            this.canManageProducts = this.mode !== 'review' && this.isEditable;
          }

        //Agrega un nuevo producto al pedido
          addProduct(): void {
            // Inserta un nuevo producto con valores iniciales en la lista de detalles
            this.orderDetails.push({ 
              product_id: null,
              product_quantity: 0,
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