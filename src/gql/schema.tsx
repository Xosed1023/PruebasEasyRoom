import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
import * as ApolloReactComponents from '@apollo/client/react/components';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Buffer: { input: any; output: any; }
  DateTime: { input: any; output: any; }
}

export enum AccionesEdicion {
  Agregar = 'agregar',
  Eliminar = 'eliminar',
  Modificar = 'modificar'
}

export interface AcumulaPuntosInput {
  data: Array<AcumulaPuntosPartialInfoInput>;
  easyrewards_id: Scalars['String']['input'];
  hotel_id: Scalars['ID']['input'];
}

export interface AcumulaPuntosPartialInfoInput {
  /** ID del ticket */
  folio_ticket: Scalars['String']['input'];
  monto_alimentos?: Scalars['Float']['input'];
  monto_bebidas?: Scalars['Float']['input'];
  monto_extras?: Scalars['Float']['input'];
  monto_habitacion?: Scalars['Float']['input'];
  monto_sexspa?: Scalars['Float']['input'];
  /** 0 = default, 1 = restaurante */
  origen: Scalars['Float']['input'];
}

export interface AddColaboradorInHotelInput {
  area_id: Scalars['ID']['input'];
  colaborador_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  puesto_id: Scalars['ID']['input'];
}

export interface AddComentarioHabitacionInput {
  comentario: ComentarioHabitacionInput;
  habitacion_id: Scalars['ID']['input'];
}

export interface AddComentarioIncidenciaInput {
  comentario: Scalars['String']['input'];
  indicencia_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AddComentarioRentaInput {
  comentario: Scalars['String']['input'];
  renta_id: Scalars['ID']['input'];
}

export interface AddComentarioReservaInput {
  comentario: Scalars['String']['input'];
  reserva_id: Scalars['ID']['input'];
}

export interface AddCommentToTaskInput {
  colaborador_tarea_id: Scalars['ID']['input'];
  comentarios: Array<CommentTaskInput>;
}

export interface AddExtrasReservaInput {
  hospedajes_extras_plus: Scalars['Int']['input'];
  pago_hospedajes?: InputMaybe<CreatePagoInput>;
  pago_personas?: InputMaybe<CreatePagoInput>;
  personas_extras_plus: Scalars['Int']['input'];
  reserva_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AddHorasExtrasRentaInput {
  cantidad: Scalars['Float']['input'];
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  propina?: InputMaybe<AddPropinaVentaInput>;
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AddHospedajesExtrasRentaInput {
  cantidad_hospedajes: Scalars['Float']['input'];
  cantidad_personas: Scalars['Float']['input'];
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  propina?: InputMaybe<AddPropinaVentaInput>;
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AddImageInput {
  image: ImagenIncidenciaInput;
  indicencia_id: Scalars['ID']['input'];
}

export interface AddPersonasExtrasRentaInput {
  cantidad: Scalars['Float']['input'];
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  propina?: InputMaybe<AddPropinaVentaInput>;
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AddPropinaVentaInput {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  detalles_pago: Array<DetallePagoPartialInfoObject>;
}

export interface AddRoomToBookingInput {
  habitacion_id: Scalars['ID']['input'];
  reserva_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AjustarAsignacionPropinaInput {
  colaborador_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  ingreso_hotel?: InputMaybe<Scalars['Boolean']['input']>;
  monto_ajuste: Scalars['Float']['input'];
  puesto_id: Scalars['ID']['input'];
}

export interface AjustarAsignacionPropinaOutput {
  __typename?: 'AjustarAsignacionPropinaOutput';
  limite_disponible: Scalars['Float']['output'];
  monto_recaudado: Scalars['Float']['output'];
  propinas_ajustadas: Array<RepartoPropinaItemOutput>;
}

export interface AlertasCorteOutput {
  __typename?: 'AlertasCorteOutput';
  alerta_por_pagos_pendientes: Scalars['Boolean']['output'];
  registros_pendientes: AlertasPorRegistrosPendientesDetailOutput;
}

export interface AlertasPorRegistrosPendientesDetailOutput {
  __typename?: 'AlertasPorRegistrosPendientesDetailOutput';
  alerta_por_mantenimiento_pendiente: Scalars['Boolean']['output'];
  alerta_por_placas_pendientes: Scalars['Boolean']['output'];
  registro_obligatorio: Scalars['Boolean']['output'];
}

export interface Almacen {
  __typename?: 'Almacen';
  almacen_id: Scalars['ID']['output'];
  categorias_almacenes: Array<CategoriaArticulo>;
  descripcion: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  estado: EstadoAlmacen;
  fecha_creacion: Scalars['DateTime']['output'];
  fecha_modificacion?: Maybe<Scalars['DateTime']['output']>;
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  /** Cantidad de articulos que tiene en stock el almacen */
  stock?: Maybe<Scalars['Int']['output']>;
  tipo_almacen: TipoAlmacen;
  usuario_modifico_id: Scalars['ID']['output'];
}

export interface AlmacenArticulo {
  __typename?: 'AlmacenArticulo';
  /** Almacen al que pertenece el articulo */
  almacen?: Maybe<Almacen>;
  almacen_articulo_id: Scalars['ID']['output'];
  almacen_id: Scalars['ID']['output'];
  articulo?: Maybe<Articulo>;
  articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Float']['output'];
  categoria_id?: Maybe<Scalars['ID']['output']>;
  costo: Scalars['Float']['output'];
  eliminado: Scalars['Boolean']['output'];
  estado: EstadosAlmacenesArticulos;
  fecha_movimiento: Scalars['DateTime']['output'];
  hotel_id?: Maybe<Scalars['String']['output']>;
  precio: Scalars['Float']['output'];
  /** Retorna la fecha de la ultima preparacion registrada para articulos de tipo receta o proceso */
  ultima_preparacion?: Maybe<Scalars['DateTime']['output']>;
  /** Registro del surtido mas reciente del articulo en su respectivo almacen */
  ultimo_surtido?: Maybe<Surtido>;
}

export interface ApiKey {
  __typename?: 'ApiKey';
  activo: Scalars['Boolean']['output'];
  api_key_id: Scalars['ID']['output'];
  colaborador_id?: Maybe<Scalars['ID']['output']>;
  descripcion?: Maybe<Scalars['String']['output']>;
  fecha_actualizacion: Scalars['DateTime']['output'];
  fecha_creacion: Scalars['DateTime']['output'];
  key: Scalars['String']['output'];
  tipo_autenticacion: TiposAutenticacion;
  usuario_id?: Maybe<Scalars['ID']['output']>;
}

export interface AportacionPropinaRsDetailInput {
  categoria_id: Scalars['ID']['input'];
  porcentaje_aportacion_propinas: Scalars['Float']['input'];
}

export interface Area {
  __typename?: 'Area';
  area_id: Scalars['ID']['output'];
  eliminado: Scalars['Boolean']['output'];
  estado: Scalars['ID']['output'];
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  puestos?: Maybe<Array<Puesto>>;
}

export interface AreasPuestos {
  __typename?: 'AreasPuestos';
  /** Información del área */
  area: Area;
  /** Id del área */
  area_id: Scalars['ID']['output'];
  /** Area Puesto Id */
  area_puesto_id: Scalars['ID']['output'];
  /** Información del puesto */
  puesto: Puesto;
  /** Id del puesto */
  puesto_id: Scalars['ID']['output'];
}

export interface Articulo {
  __typename?: 'Articulo';
  /** Todos los almacenes-articulos del hotel donde se encuentra el articulo */
  almacenes_articulos: Array<AlmacenArticulo>;
  articulo_id: Scalars['ID']['output'];
  cantidad_minima?: Maybe<Scalars['Float']['output']>;
  cantidad_vendida: Scalars['Float']['output'];
  categoria_articulo?: Maybe<CategoriaArticulo>;
  categoria_id?: Maybe<Scalars['ID']['output']>;
  contenido: Scalars['Float']['output'];
  costo?: Maybe<Costo>;
  descripcion?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  estado: EstadosArticulo;
  extra: Scalars['Boolean']['output'];
  fecha_eliminado?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  folio?: Maybe<Scalars['String']['output']>;
  folio_articulo?: Maybe<Scalars['String']['output']>;
  foto?: Maybe<Scalars['String']['output']>;
  imas_id?: Maybe<Scalars['String']['output']>;
  marca?: Maybe<Scalars['String']['output']>;
  nombre: Scalars['String']['output'];
  precio?: Maybe<Precio>;
  sku?: Maybe<Scalars['String']['output']>;
  stock?: Maybe<Scalars['Float']['output']>;
  tipo: TipoArticulo;
  unidad: UnidadMedidasArticulo;
  /** Unidades en las que puede ser usado el articulo, tanto para recetas como procesos */
  unidades_disponibles?: Maybe<Array<UnidadMedidasArticulo>>;
}


export interface ArticuloAlmacenes_ArticulosArgs {
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface ArticuloCantidad_VendidaArgs {
  fecha_registro?: InputMaybe<DateSearchInput>;
}


export interface ArticuloCategoria_ArticuloArgs {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface ArticuloPrecioArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface ArticuloStockArgs {
  almacen_id?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface ArticuloExtraTicket {
  __typename?: 'ArticuloExtraTicket';
  /** Traer información de articulo del extra del ticket */
  articulo?: Maybe<Articulo>;
  articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Float']['output'];
  costo: Scalars['Float']['output'];
  nombre: Scalars['String']['output'];
}

export interface ArticuloTicket {
  __typename?: 'ArticuloTicket';
  /** Información detallada de los artículos en el ticket, incluyendo unidad */
  articulo?: Maybe<Articulo>;
  articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Int']['output'];
  costo: Scalars['Float']['output'];
  extras: Array<ArticuloExtraTicket>;
  nombre: Scalars['String']['output'];
}

export interface ArticulosResponse {
  __typename?: 'ArticulosResponse';
  articulo_id: Scalars['String']['output'];
  cantidad: Scalars['Float']['output'];
  contenido: Scalars['String']['output'];
  nombre: Scalars['String']['output'];
  precio: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  unidad: Scalars['String']['output'];
}

export interface AsignacionPropina {
  __typename?: 'AsignacionPropina';
  asignacion_propina_id: Scalars['ID']['output'];
  colaborador_id: Scalars['ID']['output'];
  comision_bancaria: Scalars['Float']['output'];
  fecha_asignacion: Scalars['DateTime']['output'];
  fondo_de_propina: Scalars['Float']['output'];
  fondo_original: Scalars['Float']['output'];
  fondo_propina_a_repartir: Scalars['Float']['output'];
  /** Bandera que indica si el monto del ajuste para el colaborador se aparto para el hotel */
  ingreso_hotel?: Maybe<Scalars['Boolean']['output']>;
  monto_acumulado_propinas_id: Scalars['ID']['output'];
  monto_bonus: Scalars['Float']['output'];
  pagado: Scalars['Boolean']['output'];
  penalizacion: Scalars['Float']['output'];
  puesto_id: Scalars['ID']['output'];
  remanente_por_ajuste: Scalars['Float']['output'];
}

export interface Asistencia {
  __typename?: 'Asistencia';
  asistencia_id: Scalars['ID']['output'];
  asistio: Scalars['Boolean']['output'];
  /** Información del colaborador */
  colaborador: Colaborador;
  colaborador_id: Scalars['ID']['output'];
  comentario?: Maybe<Scalars['String']['output']>;
  fecha_entrada: Scalars['DateTime']['output'];
  fecha_salida?: Maybe<Scalars['DateTime']['output']>;
  /** Información del hotel */
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
}

export interface AuthLoginInput {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}

export interface AuthLoginResponse {
  __typename?: 'AuthLoginResponse';
  colaborador_activo?: Maybe<Scalars['Boolean']['output']>;
  token: Scalars['String']['output'];
  ultimo_hotel_id?: Maybe<Scalars['ID']['output']>;
  usuario_id?: Maybe<Scalars['ID']['output']>;
}

export interface AuthenticateCredencialInput {
  template_sample: Scalars['String']['input'];
}

export interface AuthenticateCredentialOutput {
  __typename?: 'AuthenticateCredentialOutput';
  usuario_id: Scalars['ID']['output'];
}

export interface AutorizarFajillaInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  fajilla_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface AuxPartialInfoRentaResponse {
  __typename?: 'AuxPartialInfoRentaResponse';
  extra_id?: Maybe<Scalars['ID']['output']>;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface BandejaNotificaciones {
  __typename?: 'BandejaNotificaciones';
  bandeja_notificaciones_id: Scalars['ID']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id?: Maybe<Scalars['ID']['output']>;
  incidencia?: Maybe<Incidencia>;
  incidencia_id?: Maybe<Scalars['ID']['output']>;
  leido: Scalars['Boolean']['output'];
  mensaje: Scalars['String']['output'];
  tipo: TipoNotificacion;
  usuario_id: Scalars['ID']['output'];
}

export interface BillingPerMonthGroupedByCategoryOutput {
  __typename?: 'BillingPerMonthGroupedByCategoryOutput';
  categoria: CategoriaGasto;
  porcentaje: Scalars['Float']['output'];
  subcategorias?: Maybe<Array<SubcategoriaGasto>>;
  total_gasto: Scalars['Float']['output'];
}

export interface BillingPerMonthGroupedByCategoryWithMonthOutput {
  __typename?: 'BillingPerMonthGroupedByCategoryWithMonthOutput';
  gastos_por_categoria: Array<BillingPerMonthGroupedByCategoryOutput>;
  month: Scalars['String']['output'];
}

export interface BillingPerMonthOutput {
  __typename?: 'BillingPerMonthOutput';
  gastos?: Maybe<Array<Gastos>>;
  total_gasto?: Maybe<Scalars['Float']['output']>;
}

export interface Cama {
  __typename?: 'Cama';
  numero: Scalars['Int']['output'];
  tipo: TiposCamas;
}

export interface CamaArgs {
  numero?: InputMaybe<Scalars['Int']['input']>;
  tipo?: InputMaybe<TiposCamas>;
}

export interface CamaInput {
  numero: Scalars['Int']['input'];
  tipo: TiposCamas;
}

export interface CambiarMesaAsignadaInput {
  colaborador_asignado_id?: InputMaybe<Scalars['ID']['input']>;
  mesa_asignada_id: Scalars['ID']['input'];
  mesa_id: Scalars['ID']['input'];
  usuario_modifico_id: Scalars['ID']['input'];
}

export interface CancelComandaInput {
  cancelaciones: CancelDetallesOrdenInput;
  comanda_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
}

export interface CancelComandaOutput {
  __typename?: 'CancelComandaOutput';
  comanda: Comanda;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface CancelDetalleOrdenDetailInput {
  detalle_orden_id: Scalars['ID']['input'];
  devolucion_a_inventario: Scalars['Boolean']['input'];
  merma: Scalars['Boolean']['input'];
}

export interface CancelDetalleOrdenInput {
  detalle_orden_id: Scalars['ID']['input'];
  tipo_cancelacion: TiposCancelaciones;
}

export interface CancelDetallesOrdenInput {
  detalles_orden: Array<CancelDetalleOrdenDetailInput>;
  extras?: InputMaybe<Array<CancelExtraDetalleOrdenDetailInput>>;
  motivo_cancelacion: Scalars['String']['input'];
}

export interface CancelExtraDetalleOrdenDetailInput {
  devolucion_a_inventario: Scalars['Boolean']['input'];
  extra_detalle_orden_id: Scalars['ID']['input'];
  merma: Scalars['Boolean']['input'];
}

export interface CancelExtraDetalleOrdenInput {
  cantidad: Scalars['Int']['input'];
  extra_detalle_orden_id: Scalars['ID']['input'];
  tipo_cancelacion: TiposCancelaciones;
}

export interface CancelExtraInput {
  extra_id: Scalars['ID']['input'];
  motivo_cancelacion: Scalars['String']['input'];
}

export interface CancelOperationRentaItemInput {
  extra_id: Scalars['ID']['input'];
  tipo_extra: TiposExtras;
}

export interface CancelOperationsRentaInput {
  cancelar_renta: Scalars['Boolean']['input'];
  extras?: InputMaybe<Array<CancelOperationRentaItemInput>>;
  hotel_id: Scalars['ID']['input'];
  motivo_cancelacion?: InputMaybe<Scalars['String']['input']>;
  ordenes?: InputMaybe<Array<CancelRoomServiceRentaItemInput>>;
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CancelOperationsRentaOutput {
  __typename?: 'CancelOperationsRentaOutput';
  extras_cancelled: Array<Extra>;
  renta: Renta;
  ticket_id: Array<Scalars['ID']['output']>;
}

export interface CancelOrdenInput {
  cancelaciones: CancelDetallesOrdenInput;
  orden_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CancelOrdenOutput {
  __typename?: 'CancelOrdenOutput';
  orden: Orden;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface CancelRentaInput {
  hotel_id: Scalars['ID']['input'];
  monto_devuelto_cancelacion?: InputMaybe<Scalars['Float']['input']>;
  motivo_cancelacion: Scalars['String']['input'];
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CancelRentaOutput {
  __typename?: 'CancelRentaOutput';
  renta: Renta;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface CancelReservaInput {
  monto_devuelto_cancelacion?: InputMaybe<Scalars['Float']['input']>;
  motivo_cancelacion: Scalars['String']['input'];
  reserva_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CancelReservaResponse {
  __typename?: 'CancelReservaResponse';
  ticket_ids: Array<Scalars['String']['output']>;
}

export interface CancelRoomServiceRentaItemInput {
  cancelaciones_detalles?: InputMaybe<Array<CancelDetalleOrdenDetailInput>>;
  cancelaciones_extras?: InputMaybe<Array<CancelExtraDetalleOrdenDetailInput>>;
  orden_id: Scalars['ID']['input'];
}

export interface CardHabitacion {
  __typename?: 'CardHabitacion';
  tamano?: Maybe<Scalars['String']['output']>;
  tamano_fijo?: Maybe<Scalars['Boolean']['output']>;
}

export interface CardHabitacionInput {
  tamano?: InputMaybe<Scalars['String']['input']>;
  tamano_fijo?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface CategoriaArticulo {
  __typename?: 'CategoriaArticulo';
  categoria_id: Scalars['ID']['output'];
  descripcion: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  porcentaje_aportacion_propinas: Scalars['Float']['output'];
  subcategorias?: Maybe<Array<SubcategoriaProducto>>;
  /** Indica si la categoria ya esta siendo surtida por otro almacen que no este eliminado ni desactivado */
  surtida_por_otro_almacen?: Maybe<Scalars['Boolean']['output']>;
  total_articulos?: Maybe<Scalars['Int']['output']>;
}

export interface CategoriaArticuloFilterArgs {
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
}

export interface CategoriaGasto {
  __typename?: 'CategoriaGasto';
  categoria: Scalars['String']['output'];
  categoria_id: Scalars['ID']['output'];
  eliminado: Scalars['Boolean']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  limite_mensual: Scalars['Float']['output'];
  predeterminado?: Maybe<Scalars['Boolean']['output']>;
  presupuesto: Scalars['Float']['output'];
  subcategorias_de_categoria: Array<SubcategoriaGasto>;
  subcategorias_gasto?: Maybe<Array<SubcategoriaGasto>>;
  usuario_id: Scalars['ID']['output'];
}

export interface ChangeHabitacionReservaInput {
  habitacion_id: Scalars['ID']['input'];
  reserva_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface ChangePasswordInput {
  email: Scalars['String']['input'];
  new_password: Scalars['String']['input'];
  old_password?: InputMaybe<Scalars['String']['input']>;
}

export interface CheckInInput {
  early_checkin: Scalars['Boolean']['input'];
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  fecha_salida: Scalars['DateTime']['input'];
  horas_extra_renta: Scalars['Int']['input'];
  hospedajes_extra_renta: Scalars['Int']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  personas_extra_renta: Scalars['Int']['input'];
  propina?: InputMaybe<CreatePropinaFromSale>;
  reserva_id: Scalars['ID']['input'];
  tipo_entrada: TiposEntradas;
  usuario_id: Scalars['ID']['input'];
  vehiculo?: InputMaybe<DataVehiculoInput>;
}

export interface CheckOutInput {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  estado_habitacion: Estados_Habitaciones;
  extra_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  fecha_estado: Scalars['DateTime']['input'];
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  pago?: InputMaybe<CreatePagoInput>;
  propina?: InputMaybe<CreatePropinaPartialInput>;
  renta_id: Scalars['ID']['input'];
  subestado_habitacion?: InputMaybe<SubestadosHabitaciones>;
  usuario_id: Scalars['ID']['input'];
}

export interface CheckReserveLimitOutput {
  __typename?: 'CheckReserveLimitOutput';
  alerta_por_limite_reservas: Scalars['Boolean']['output'];
  fecha_conflicto?: Maybe<Scalars['DateTime']['output']>;
  tipo_habitacion?: Maybe<Scalars['ID']['output']>;
}

export interface ClaveTipoBloqueo {
  __typename?: 'ClaveTipoBloqueo';
  /** Clave asociada al tamaño de la card */
  clave: Scalars['String']['output'];
  /** Tamaño de la card de habitación */
  tamano: Scalars['String']['output'];
}

export interface ClaveTipoBloqueoArgs {
  /** Clave asociada al tamaño */
  clave: Scalars['String']['input'];
  /** Tamaño de la card de habitación */
  tamano: Scalars['String']['input'];
}

export interface ClaveTipoBloqueoInput {
  /** Clave asociada a la card */
  clave: Scalars['String']['input'];
  /** Tamaño de la card de habitación */
  tamano: Scalars['String']['input'];
}

export interface ClaveTipoMantenimiento {
  __typename?: 'ClaveTipoMantenimiento';
  /** Clave asociada al tamaño de la card */
  clave: Scalars['String']['output'];
  /** Tamaño de la card de habitación */
  tamano: Scalars['String']['output'];
}

export interface ClaveTipoMantenimientoInput {
  /** Clave asociada a la card */
  clave: Scalars['String']['input'];
  /** Tamaño de la card de habitación */
  tamano: Scalars['String']['input'];
}

export interface Cliente {
  __typename?: 'Cliente';
  /** Cliente id */
  cliente_id: Scalars['ID']['output'];
  /** Correo del cliente */
  correo?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  /** Nombre del cliente */
  nombre: Scalars['String']['output'];
  /** Número de cliente */
  numero_cliente?: Maybe<Scalars['Float']['output']>;
  /** Teléfono del cliente */
  telefono?: Maybe<Scalars['String']['output']>;
}

export interface CloseBillMesaAsignadaInput {
  mesa_asignada_id: Scalars['ID']['input'];
}

export interface CloseCorteInput {
  corte_id: Scalars['ID']['input'];
  efectivo_ingresado: Scalars['Float']['input'];
  usuario_cierra_corte: Scalars['ID']['input'];
}

export interface CloseIncidenciaInput {
  colaborador_id_cierra: Scalars['ID']['input'];
  comentario_cierre?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  incidencia_id: Scalars['ID']['input'];
}

export interface CloseMesaAsignadInput {
  mesa_asignada_id: Scalars['ID']['input'];
}

export interface CloseTaskInput {
  colaboradores_tareas_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  comentarios_tarea?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estados_Habitaciones>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CloseTurnoInput {
  hotel_id: Scalars['ID']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface Colaborador {
  __typename?: 'Colaborador';
  apellido_materno: Scalars['String']['output'];
  apellido_paterno: Scalars['String']['output'];
  area?: Maybe<Area>;
  asistencia_abierta?: Maybe<Asistencia>;
  /** Numero de ordenes atendidas del colaborador por su turno diario */
  cantidad_ordenes?: Maybe<Scalars['Float']['output']>;
  colaborador_id: Scalars['ID']['output'];
  colaborador_in_hotel?: Maybe<Array<HotelColaborador>>;
  correo?: Maybe<Scalars['String']['output']>;
  direccion?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  en_turno: Scalars['Boolean']['output'];
  /** Indica si el colaborador tiene habilitadas las funciones de supervision (Puesto Supervisor) */
  es_supervisor?: Maybe<Scalars['Boolean']['output']>;
  estado: Scalars['String']['output'];
  fecha_baja?: Maybe<Scalars['DateTime']['output']>;
  fecha_cumpleanios: Scalars['DateTime']['output'];
  fecha_ingreso: Scalars['DateTime']['output'];
  foto?: Maybe<Scalars['String']['output']>;
  /** Retorna al menos 1 mesa-asignada activa para el colaborador, si es que existe */
  mesa_asignada_activa?: Maybe<HasActiveMesaAsignadaOutput>;
  nombre: Scalars['String']['output'];
  /** Numero de tareas asignadas al colaborador en el turno */
  numero_asignaciones?: Maybe<Scalars['Int']['output']>;
  numero_colaborador: Scalars['String']['output'];
  numero_id: Scalars['String']['output'];
  ordenes?: Maybe<Array<Orden>>;
  puesto?: Maybe<Puesto>;
  sueldo?: Maybe<Scalars['Float']['output']>;
  telefono_emergencia?: Maybe<Scalars['String']['output']>;
  telefono_personal: Scalars['String']['output'];
  turno: Turno;
  turno_id: Scalars['ID']['output'];
  ultima_asistencia_cerrada?: Maybe<Asistencia>;
  ultima_orden?: Maybe<Orden>;
  ultima_tarea?: Maybe<ColaboradorTarea>;
  usuario?: Maybe<Usuario>;
  usuario_id?: Maybe<Scalars['ID']['output']>;
}


export interface ColaboradorEs_SupervisorArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface ColaboradorNumero_AsignacionesArgs {
  DateSearchInput: DateSearchInput;
}


export interface ColaboradorOrdenesArgs {
  estado?: InputMaybe<Array<EstadosOrdenHistorial>>;
}

export interface ColaboradorReportePropinaDetailOutput {
  __typename?: 'ColaboradorReportePropinaDetailOutput';
  colaborador?: Maybe<Colaborador>;
  colaborador_id: Scalars['ID']['output'];
  comision_bancaria_tarjeta: Scalars['Float']['output'];
  comision_por_puntos: Scalars['Float']['output'];
  propinas_tarjetas_por_venta_rs: Scalars['Float']['output'];
  puntos_a_pagar: Scalars['Float']['output'];
  total_a_repartir: Scalars['Float']['output'];
  ventas_por_categoria: Array<VentaColaboradorPorCategoriaDetailOutput>;
}

export interface ColaboradorTarea {
  __typename?: 'ColaboradorTarea';
  colaborador?: Maybe<Colaborador>;
  colaborador_id?: Maybe<Scalars['String']['output']>;
  colaborador_tarea_id: Scalars['ID']['output'];
  comentarios?: Maybe<Array<ComentarioTarea>>;
  descripcion_tarea?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  fecha_inicio: Scalars['DateTime']['output'];
  fecha_registro?: Maybe<Scalars['DateTime']['output']>;
  fecha_termino?: Maybe<Scalars['DateTime']['output']>;
  habitacion?: Maybe<Habitacion>;
  habitacion_id?: Maybe<Scalars['String']['output']>;
  /** Datos del colaborador que creo la tarea en primer instancia */
  reportada_por?: Maybe<Colaborador>;
  tarea: Tarea;
  tarea_id?: Maybe<Scalars['String']['output']>;
  tipo_limpieza?: Maybe<TiposLimpiezas>;
  /** Tipo de tarea en curso para el colaborador-tarea */
  tipo_tarea?: Maybe<TiposTarea>;
  turno_id?: Maybe<Scalars['ID']['output']>;
}

export interface Comanda {
  __typename?: 'Comanda';
  comanda_id: Scalars['ID']['output'];
  detalles_orden?: Maybe<Array<DetalleOrden>>;
  estado_comanda?: Maybe<EstadosComandaHistorial>;
  fecha_modificacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Float']['output'];
  /** Orden a la que pertenece la comanda */
  orden?: Maybe<Orden>;
  orden_id: Scalars['ID']['output'];
  /** Bandera que indica si la comanda sera o no mostrada en el panel de cocina */
  panel_no_visible: Scalars['Boolean']['output'];
  total_comanda: Scalars['Float']['output'];
  usuario_id: Scalars['ID']['output'];
}


export interface ComandaDetalles_OrdenArgs {
  estado?: InputMaybe<Array<EstadosDetalleOrden>>;
  filter_articulos_categoria_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface ComentarioHabitacion {
  __typename?: 'ComentarioHabitacion';
  comentario: Scalars['String']['output'];
  comentario_id: Scalars['ID']['output'];
  fecha: Scalars['String']['output'];
  usuario_id: Scalars['ID']['output'];
}

export interface ComentarioHabitacionInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  fecha?: InputMaybe<Scalars['String']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface ComentarioIncidenciaEntity {
  __typename?: 'ComentarioIncidenciaEntity';
  comentario: Scalars['String']['output'];
  fecha: Scalars['DateTime']['output'];
  usuario_id: Scalars['ID']['output'];
}

export interface ComentarioTarea {
  __typename?: 'ComentarioTarea';
  comentario?: Maybe<Scalars['String']['output']>;
  fecha?: Maybe<Scalars['String']['output']>;
  usuario_id?: Maybe<Scalars['ID']['output']>;
}

export interface ComentariosInfoRenta {
  __typename?: 'ComentariosInfoRenta';
  comentario: Scalars['String']['output'];
  fecha: Scalars['DateTime']['output'];
}

export interface ComentariosInfoReserva {
  __typename?: 'ComentariosInfoReserva';
  comentario: Scalars['String']['output'];
  fecha: Scalars['DateTime']['output'];
}

export interface CommentTaskInput {
  comentario: Scalars['String']['input'];
  fecha: Scalars['String']['input'];
  usuario_id: Scalars['ID']['input'];
}

export enum ConceptosConfiguracionesCortes {
  RegistroEnergeticos = 'registro_energeticos',
  RegistroPlacas = 'registro_placas'
}

export interface ConceptosInclusionFilterArgs {
  in?: InputMaybe<Array<ConceptosConfiguracionesCortes>>;
}

export interface ConfiguracionCorte {
  __typename?: 'ConfiguracionCorte';
  activo: Scalars['Boolean']['output'];
  concepto: ConceptosConfiguracionesCortes;
  configuracion_corte_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
}

export interface ConfiguracionFajilla {
  __typename?: 'ConfiguracionFajilla';
  configuracion_fajilla_id: Scalars['ID']['output'];
  eliminado: Scalars['Boolean']['output'];
  fecha_creacion: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  usuario_id: Scalars['ID']['output'];
  valor: Scalars['Float']['output'];
}

export interface ConfiguracionInventario {
  __typename?: 'ConfiguracionInventario';
  configuracion_inventario_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  inventario_negativo: Scalars['Boolean']['output'];
}

export interface ConfiguracionNotificacionesOutput {
  __typename?: 'ConfiguracionNotificacionesOutput';
  cortes: CortesNotificacionesConfigOutput;
  gastos: GastosNotificacionesConfigOutput;
  habitaciones: HabitacionesNotificacionesConfigOutput;
  incidencias: IncidenciasNotificacionesConfigOutput;
}

export interface ConfiguracionPropina {
  __typename?: 'ConfiguracionPropina';
  configuracion_propina_id: Scalars['ID']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  porcentaje_aportacion_vendedores: Scalars['Float']['output'];
  porcentaje_comision_por_puntos: Scalars['Float']['output'];
  porcentaje_venta_efectivo: Scalars['Float']['output'];
  porcentaje_venta_tarjeta: Scalars['Float']['output'];
}

export interface Configurations {
  __typename?: 'Configurations';
  /** Configuraciones de la habitación */
  cardHabitacion: CardHabitacion;
  /** Configuraciones del panel */
  panel: Panel;
}

export interface ConfigurationsInput {
  cardHabitacion?: InputMaybe<CardHabitacionInput>;
  panel?: InputMaybe<PanelInput>;
}

export interface ConteosOrdenesDetailsOutput {
  __typename?: 'ConteosOrdenesDetailsOutput';
  mostrador?: Maybe<Scalars['Int']['output']>;
  restaurante?: Maybe<Scalars['Int']['output']>;
  room_service?: Maybe<Scalars['Int']['output']>;
  total?: Maybe<Scalars['Int']['output']>;
}

export interface Corte {
  __typename?: 'Corte';
  anticipos_reservas?: Maybe<Scalars['Float']['output']>;
  colaboradores: Array<Colaborador>;
  corte_id: Scalars['ID']['output'];
  efectivo_ingresado: Scalars['Float']['output'];
  estatus: EstatusCorte;
  fecha_cierre_corte?: Maybe<Scalars['String']['output']>;
  /** Representa la fecha del dia a la que pertenece el corte sin importar cuando se cerro */
  fecha_corte?: Maybe<Scalars['String']['output']>;
  fecha_fin_corte?: Maybe<Scalars['String']['output']>;
  fecha_inicio_corte: Scalars['String']['output'];
  folio: Scalars['Int']['output'];
  habitaciones_vendidas?: Maybe<Scalars['Float']['output']>;
  hotel_id: Scalars['ID']['output'];
  incidencias?: Maybe<Array<Incidencia>>;
  ingresos_hotel?: Maybe<IngresosHotelOutput>;
  ingresos_room_service?: Maybe<IngresosRoomServiceOutput>;
  metodos_pago?: Maybe<MetodosPago>;
  resumen_utilidad?: Maybe<ResumenUtilidadOutput>;
  saldos_reservas: Scalars['Float']['output'];
  total_caja: Scalars['Float']['output'];
  total_consumo_interno: Scalars['Float']['output'];
  total_corte: Scalars['Float']['output'];
  total_cortesias: Scalars['Float']['output'];
  total_depositos: Scalars['Float']['output'];
  total_fajillas: Scalars['Float']['output'];
  total_gastos: Scalars['Float']['output'];
  total_pagos_pendientes: Scalars['Float']['output'];
  total_propinas_efectivo: Scalars['Float']['output'];
  total_propinas_habitacion: Scalars['Float']['output'];
  total_propinas_restaurantes: Scalars['Float']['output'];
  total_propinas_room_service: Scalars['Float']['output'];
  total_propinas_tarjeta: Scalars['Float']['output'];
  total_venta_efectivo: Scalars['Float']['output'];
  total_venta_habitaciones: Scalars['Float']['output'];
  total_venta_horas_extra: Scalars['Float']['output'];
  total_venta_hospedajes_extra: Scalars['Float']['output'];
  total_venta_paquetes: Scalars['Float']['output'];
  total_venta_personas_extra: Scalars['Float']['output'];
  total_venta_restaurante: Scalars['Float']['output'];
  total_venta_room_service: Scalars['Float']['output'];
  total_venta_tarjetas: Scalars['Float']['output'];
  turno: Turno;
  turno_id: Scalars['ID']['output'];
  /** Usuario que cierra el corte */
  usuario_cierra?: Maybe<Usuario>;
  usuario_cierra_corte?: Maybe<Scalars['ID']['output']>;
  /** Usuario creador del corte */
  usuario_crea?: Maybe<Usuario>;
  usuario_realiza_corte: Scalars['ID']['output'];
}

export interface CortesNotificacionesConfigOutput {
  __typename?: 'CortesNotificacionesConfigOutput';
  caratula_mensual: Scalars['Boolean']['output'];
  cortes_diarios: Scalars['Boolean']['output'];
}

export interface CortesSummaryByMonthResponse {
  __typename?: 'CortesSummaryByMonthResponse';
  cortes_cerrados: Scalars['Float']['output'];
  gastos: Scalars['Float']['output'];
  incidencias: Scalars['Float']['output'];
  ingresos: Scalars['Float']['output'];
  mes: Scalars['Float']['output'];
  utilidad: Scalars['Float']['output'];
}

export interface Costo {
  __typename?: 'Costo';
  activo: Scalars['Boolean']['output'];
  articulo_id: Scalars['ID']['output'];
  costo_id: Scalars['ID']['output'];
  fecha_fin?: Maybe<Scalars['DateTime']['output']>;
  fecha_inicio: Scalars['DateTime']['output'];
  monto: Scalars['Float']['output'];
}

export interface CreateAlmacenArticuloInput {
  almacen_id: Scalars['ID']['input'];
  articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  costo: Scalars['Float']['input'];
  precio: Scalars['Float']['input'];
}

export interface CreateAlmacenInput {
  categorias_articulos_id: Array<Scalars['ID']['input']>;
  descripcion: Scalars['String']['input'];
  estado: EstadoAlmacen;
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['String']['input'];
  tipo_almacen: TipoAlmacen;
  usuario_modifico_id: Scalars['ID']['input'];
}

export interface CreateApiKeyInput {
  descripcion: Scalars['String']['input'];
}

export interface CreateApiKeyOutput {
  __typename?: 'CreateApiKeyOutput';
  api_key_details: ApiKey;
  key: Scalars['String']['output'];
}

export interface CreateAreaInput {
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['String']['input'];
}

export interface CreateArticuloInput {
  almacen_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad: Scalars['Float']['input'];
  cantidad_minima?: InputMaybe<Scalars['Float']['input']>;
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  contenido: Scalars['Float']['input'];
  costo?: InputMaybe<Scalars['Float']['input']>;
  estado: EstadosArticulo;
  extra: Scalars['Boolean']['input'];
  folio?: InputMaybe<Scalars['String']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  imas_id?: InputMaybe<Scalars['String']['input']>;
  marca?: InputMaybe<Scalars['String']['input']>;
  nombre: Scalars['String']['input'];
  precio?: InputMaybe<Scalars['Float']['input']>;
  promocion_id?: InputMaybe<Scalars['ID']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<TipoArticulo>;
  unidad: UnidadMedidasArticulo;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateCategoriaArticuloInput {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['String']['input'];
  porcentaje_aportacion_propinas?: InputMaybe<Scalars['Float']['input']>;
}

export interface CreateCategoriasGastosInput {
  categoria: Scalars['String']['input'];
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id: Scalars['String']['input'];
  limite_mensual: Scalars['Float']['input'];
  presupuesto: Scalars['Float']['input'];
  usuario_id: Scalars['String']['input'];
}

export interface CreateClienteInput {
  correo?: InputMaybe<Scalars['String']['input']>;
  nombre: Scalars['String']['input'];
  telefono?: InputMaybe<Scalars['String']['input']>;
}

export interface CreateColaboradorInput {
  apellido_materno: Scalars['String']['input'];
  apellido_paterno: Scalars['String']['input'];
  area_id: Scalars['ID']['input'];
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  /** Habilita/Deshabilita funciones de supervision (puesto Supervisor) para el colaborador */
  es_supervisor?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_cumpleanios: Scalars['DateTime']['input'];
  fecha_ingreso: Scalars['DateTime']['input'];
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['String']['input'];
  numero_colaborador: Scalars['String']['input'];
  numero_id: Scalars['String']['input'];
  puesto_id: Scalars['ID']['input'];
  sueldo?: InputMaybe<Scalars['Float']['input']>;
  telefono_emergencia?: InputMaybe<Scalars['String']['input']>;
  telefono_personal: Scalars['String']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface CreateColaboradorTareaInput {
  colaborador_id: Array<Scalars['ID']['input']>;
  descripcion_tarea?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estados_Habitaciones>;
  fecha_inicio: Scalars['DateTime']['input'];
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  reasignacion?: InputMaybe<Scalars['Boolean']['input']>;
  tarea: CreateTareaInput;
  tarea_id?: InputMaybe<Scalars['String']['input']>;
  tipo_limpieza?: InputMaybe<TiposLimpiezas>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateColaboradorUsuarioInput {
  apellido_materno: Scalars['String']['input'];
  apellido_paterno: Scalars['String']['input'];
  area_id: Scalars['ID']['input'];
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  direccion: Scalars['String']['input'];
  /** Habilita/Deshabilita funciones de supervision (puesto Supervisor) para el colaborador */
  es_supervisor?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_cumpleanios: Scalars['DateTime']['input'];
  fecha_ingreso: Scalars['DateTime']['input'];
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['String']['input'];
  nombre: Scalars['String']['input'];
  numero_colaborador: Scalars['String']['input'];
  numero_id: Scalars['String']['input'];
  puesto_id: Scalars['ID']['input'];
  rol_id?: InputMaybe<Scalars['ID']['input']>;
  sueldo?: InputMaybe<Scalars['Float']['input']>;
  telefono_emergencia: Scalars['String']['input'];
  telefono_personal: Scalars['String']['input'];
  template_sample?: InputMaybe<Array<Scalars['String']['input']>>;
  turno_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface CreateComandaInput {
  folio: Scalars['Float']['input'];
  orden_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateConfiguracionCorteItemInput {
  activo: Scalars['Boolean']['input'];
  concepto: ConceptosConfiguracionesCortes;
}

export interface CreateConfiguracionFajillaInput {
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
  valor: Scalars['Float']['input'];
}

export interface CreateConfiguracionInventarioInput {
  hotel_id: Scalars['ID']['input'];
  inventario_negativo: Scalars['Boolean']['input'];
}

export interface CreateConfiguracionPropinaInput {
  hotel_id: Scalars['ID']['input'];
  porcentaje_aportacion_vendedores: Scalars['Float']['input'];
  porcentaje_comision_por_puntos?: InputMaybe<Scalars['Float']['input']>;
  porcentaje_venta_efectivo: Scalars['Float']['input'];
  porcentaje_venta_tarjeta: Scalars['Float']['input'];
}

export interface CreateConfiguracionesCorteInput {
  conceptos: Array<CreateConfiguracionCorteItemInput>;
  hotel_id: Scalars['ID']['input'];
}

export interface CreateCredencialInput {
  template_sample: Array<Scalars['String']['input']>;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateDetalleOrdenPartialInfoInput {
  almacen_articulo_id: Scalars['ID']['input'];
  comanda_id?: InputMaybe<Scalars['ID']['input']>;
  comentarios?: InputMaybe<Scalars['String']['input']>;
  costo_con_iva: Scalars['Float']['input'];
  costo_sin_iva: Scalars['Float']['input'];
  detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  extra_detalle_orden?: InputMaybe<Array<PartialInfoExtraDetalleOrdenInput>>;
  monto_iva: Scalars['Float']['input'];
}

export interface CreateDigestKeyInput {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  correo: Scalars['String']['input'];
  descripcion: Scalars['String']['input'];
  password: Scalars['String']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface CreateDigestKeyOutput {
  __typename?: 'CreateDigestKeyOutput';
  digest_key: Scalars['String']['output'];
  digest_key_details: ApiKey;
}

export interface CreateExtraInput {
  extras: Array<CreateExtraPartialInfoObject>;
  fecha_pago?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_solicitud: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateExtraPartialInfoObject {
  monto_extra: Scalars['Float']['input'];
  numero?: Scalars['Int']['input'];
  tipo_extra: TiposExtras;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateFajillaInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  configuracion_fajilla_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  monto: Scalars['Float']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_creo_id: Scalars['ID']['input'];
}

export interface CreateGastoInput {
  caja_chica: Scalars['Boolean']['input'];
  categoria_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_gasto: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
  metodo_pago: Scalars['String']['input'];
  monto: Scalars['Float']['input'];
  subcategoria_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateGastoResponse {
  __typename?: 'CreateGastoResponse';
  gasto: Gastos;
  ticket_id: Scalars['ID']['output'];
}

export interface CreateGrupoHotelInput {
  nombre_grupo: Scalars['String']['input'];
}

export interface CreateHabitacionInput {
  hotel_id: Scalars['ID']['input'];
  numero_habitacion: Scalars['String']['input'];
  piso: Scalars['String']['input'];
  tipo_habitacion_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateHotelInput {
  calle: Scalars['String']['input'];
  ciudad: Scalars['String']['input'];
  colonia: Scalars['String']['input'];
  configurations?: InputMaybe<ConfigurationsInput>;
  correo: Scalars['String']['input'];
  cp: Scalars['String']['input'];
  easyrewards_sucursal_id?: InputMaybe<Scalars['String']['input']>;
  estado: Scalars['String']['input'];
  grupo_hotel_id: Scalars['ID']['input'];
  logo_hotel?: InputMaybe<Scalars['String']['input']>;
  nombre_hotel: Scalars['String']['input'];
  numero_exterior: Scalars['String']['input'];
  numero_interior: Scalars['String']['input'];
  razon_social: Scalars['String']['input'];
  rfc: Scalars['String']['input'];
  telefono: Scalars['String']['input'];
  /** zona horaria del hotel */
  zona_horaria?: InputMaybe<Scalars['String']['input']>;
}

export interface CreateIncidenciaInput {
  area?: InputMaybe<Scalars['String']['input']>;
  cliente_url?: InputMaybe<Scalars['String']['input']>;
  colaborador_id_reporta: Scalars['ID']['input'];
  detalle: Scalars['String']['input'];
  fecha_registro: Scalars['DateTime']['input'];
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  huesped?: InputMaybe<Scalars['String']['input']>;
  imagenes?: InputMaybe<Array<ImagenIncidenciaInput>>;
  matricula?: InputMaybe<Scalars['String']['input']>;
  severidad: Scalars['String']['input'];
  tipo_incidencia?: InputMaybe<Scalars['String']['input']>;
  turno_id: Scalars['ID']['input'];
}

export interface CreateMantenimientoInput {
  /** Consumo de agua */
  agua: Scalars['Float']['input'];
  colaborador_id: Scalars['ID']['input'];
  /** Consumo de gas */
  gas: Scalars['Float']['input'];
  /** Consumo de luz */
  luz: Scalars['Float']['input'];
  /** ID del turno */
  turno_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface CreateManyPagosPropinasInput {
  caja_chica: Scalars['Boolean']['input'];
  descripcion: Scalars['String']['input'];
  detalles_pago: DetallePagoPartialInfoObject;
  hotel_id: Scalars['ID']['input'];
  limite_disponible: Scalars['Float']['input'];
  pagos_propinas: Array<PagoPropinaItemInput>;
  periodo_pago: Scalars['String']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateManySurtidosInput {
  hotel_id: Scalars['ID']['input'];
  numero_orden_factura?: InputMaybe<Scalars['String']['input']>;
  surtidos: Array<CreateSurtidoPartialDetailInput>;
  usuario_autorizo_id: Scalars['ID']['input'];
}

export interface CreateManySurtidosOutput {
  __typename?: 'CreateManySurtidosOutput';
  numero_articulos_surtidos: Scalars['Int']['output'];
  surtidos: Array<Surtido>;
}

export interface CreateMesaAsignadaInput {
  colaborador_asignado_id: Scalars['ID']['input'];
  mesa_id: Scalars['ID']['input'];
  orden_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_autorizo_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface CreateMesaInput {
  cantidad_personas: Scalars['Float']['input'];
  estado: EstadoMesa;
  hotel_id: Scalars['ID']['input'];
  numero_mesa: Scalars['String']['input'];
  usuario_modifico_id: Scalars['ID']['input'];
}

export interface CreateMotivoIngresoVehiculoDto {
  /** Identificador del hotel al que pertenece el motivo de ingreso */
  hotel_id: Scalars['ID']['input'];
  /** Nombre del motivo de ingreso de un vehículo  */
  nombre: Scalars['String']['input'];
}

export interface CreateOrdenInput {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  consumo_interno_colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  detalles_orden: Array<CreateDetalleOrdenPartialInfoInput>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado_orden?: InputMaybe<EstadosOrdenHistorial>;
  hotel_id: Scalars['ID']['input'];
  mesa_id?: InputMaybe<Scalars['ID']['input']>;
  modalidad_de_pago?: InputMaybe<ModalidadDePago>;
  monto_iva: Scalars['Float']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  propina?: InputMaybe<CreatePropinaPartialInput>;
  renta_id?: InputMaybe<Scalars['ID']['input']>;
  total_con_iva: Scalars['Float']['input'];
  total_sin_iva: Scalars['Float']['input'];
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateOrdenResponse {
  __typename?: 'CreateOrdenResponse';
  orden: Orden;
  ticket: ReturnIdTicketResponse;
}

export interface CreatePagoInput {
  detallesPago: Array<DetallePagoPartialInfoObject>;
  hotel_id: Scalars['ID']['input'];
  total: Scalars['Float']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreatePagoRentaInput {
  pago_id: Scalars['ID']['input'];
  renta_id: Scalars['ID']['input'];
}

export interface CreatePagoReservaInput {
  pago_id: Scalars['ID']['input'];
  reserva_id: Scalars['ID']['input'];
}

export interface CreateProductionProcesoInput {
  almacen_destino_id: Scalars['ID']['input'];
  articulo_id: Scalars['ID']['input'];
  cantidad_produccion_final: Scalars['Float']['input'];
  costo_produccion: Scalars['Float']['input'];
  hotel_id: Scalars['ID']['input'];
  usuario_autorizo_id: Scalars['ID']['input'];
}

export interface CreateProductionProcesoOutput {
  __typename?: 'CreateProductionProcesoOutput';
  articulo: Articulo;
  cantidad_produccion_final: Scalars['Float']['output'];
  costo_produccion: Scalars['Float']['output'];
}

export interface CreatePropinaFromSale {
  colaborador_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  detalles_pago: Array<DetallePagoPartialInfoObject>;
  turno_id: Scalars['ID']['input'];
}

export interface CreatePropinaInput {
  colaborador_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  detalles_pago: Array<DetallePagoPartialInfoObject>;
  hotel_id: Scalars['ID']['input'];
  procedencia: ProcedenciaPropina;
  procedencia_id?: InputMaybe<Scalars['ID']['input']>;
  total: Scalars['Float']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreatePropinaPartialInput {
  colaborador_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  detalles_pago: Array<DetallePagoPartialInfoObject>;
  hotel_id: Scalars['ID']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreatePuestoInput {
  /** UUID de las areas */
  areas_id: Array<Scalars['ID']['input']>;
  /** Descripción del puesto */
  descripcion: Scalars['String']['input'];
  /** Nombre del puesto */
  nombre: Scalars['String']['input'];
  /** Porcentaje que le corresponde del total de propinas recaudadas */
  porcentaje_propina?: InputMaybe<Scalars['Float']['input']>;
}

export interface CreateRecetaInput {
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  contenido: Scalars['Float']['input'];
  costo_actual?: InputMaybe<Scalars['Float']['input']>;
  estado: EstadosArticulo;
  extra: Scalars['Boolean']['input'];
  folio?: InputMaybe<Scalars['String']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  ingredientes: Array<IngredienteRecetaInput>;
  marca?: InputMaybe<Scalars['String']['input']>;
  nombre: Scalars['String']['input'];
  precio?: InputMaybe<Scalars['Float']['input']>;
  tipo: TipoArticulo;
  unidad: UnidadMedidasArticulo;
  usuario_id: Scalars['ID']['input'];
}

export interface CreateRentaInput {
  cliente_id?: InputMaybe<Scalars['ID']['input']>;
  comentarios: Array<Scalars['String']['input']>;
  early_checkin: Scalars['Boolean']['input'];
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  fecha_checkin: Scalars['DateTime']['input'];
  fecha_fin?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id: Scalars['ID']['input'];
  horas_extra: Scalars['Int']['input'];
  hospedajes_extra: Scalars['Int']['input'];
  hotel_id: Scalars['ID']['input'];
  nombre_huesped?: InputMaybe<Scalars['String']['input']>;
  numero_personas: Scalars['Int']['input'];
  pago?: InputMaybe<CreatePagoInput>;
  personas_extra: Scalars['Int']['input'];
  propina?: InputMaybe<CreatePropinaPartialInput>;
  tarifa_id: Scalars['ID']['input'];
  tipo_alojamiento: TiposAlojamientos;
  tipo_entrada: TiposEntradas;
  total: Scalars['Float']['input'];
  usuario_id: Scalars['ID']['input'];
  vehiculo?: InputMaybe<DataVehiculoInput>;
}

export interface CreateRentaResponse {
  __typename?: 'CreateRentaResponse';
  renta: Renta;
  ticket: ReturnIdTicketResponse;
}

export interface CreateReservaInput {
  cliente_id?: InputMaybe<Scalars['ID']['input']>;
  codigo_ota?: InputMaybe<Scalars['String']['input']>;
  comentarios: Array<Scalars['String']['input']>;
  correo_huesped?: InputMaybe<Scalars['String']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  experiencias_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  fecha_entrada: Scalars['DateTime']['input'];
  fecha_salida: Scalars['DateTime']['input'];
  hospedajes_extra?: Scalars['Int']['input'];
  hotel_id: Scalars['ID']['input'];
  nombre_huesped: Scalars['String']['input'];
  numero_personas: Scalars['Int']['input'];
  origen: OrigenRservas;
  pago?: InputMaybe<CreatePagoInput>;
  personas_extras?: Scalars['Int']['input'];
  servicios_reserva?: InputMaybe<Array<Scalars['String']['input']>>;
  tarifa_id: Scalars['ID']['input'];
  telefono_huesped?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id: Scalars['ID']['input'];
  total: Scalars['Float']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateReservaResponse {
  __typename?: 'CreateReservaResponse';
  reserva: Reserva;
  ticket: ReturnIdTicketResponse;
}

export interface CreateRolInput {
  /** UUID de las funcionalidades */
  funcionalidades_id: Array<Scalars['ID']['input']>;
  /** UUID del grupo hotel al que pertenece el rol */
  grupo_hotel_id: Scalars['ID']['input'];
  /** Nombre del rol */
  nombre: Scalars['String']['input'];
}

export interface CreateSalidaInput {
  almacen_articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  colaborador_id: Scalars['ID']['input'];
  comentario?: InputMaybe<Scalars['String']['input']>;
  detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  motivo: Motivo;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}

export interface CreateServicioInput {
  hotel_id: Scalars['ID']['input'];
  /** Nombre del servicio */
  nombre: Scalars['String']['input'];
}

export interface CreateSubcategoriaProductoInput {
  categoria_id: Scalars['ID']['input'];
  subcategoria: Scalars['String']['input'];
}

export interface CreateSubcategoriasGastosInput {
  categoria_id: Scalars['ID']['input'];
  subcategoria: Scalars['String']['input'];
}

export interface CreateSurtidoInput {
  almacen_articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  colaborador_id: Scalars['ID']['input'];
  comentario?: InputMaybe<Scalars['String']['input']>;
  costo_total: Scalars['Float']['input'];
  costo_unitario: Scalars['Float']['input'];
  hotel_id: Scalars['ID']['input'];
  numero_orden_factura?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<TiposSurtido>;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}

export interface CreateSurtidoPartialDetailInput {
  a_surtir: Scalars['Float']['input'];
  almacen_destino_id: Scalars['ID']['input'];
  articulo_id: Scalars['ID']['input'];
  costo_unitario: Scalars['Float']['input'];
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}

export interface CreateSuscripcionInput {
  estatus: Scalars['String']['input'];
  fecha_expiracion: Scalars['DateTime']['input'];
  fecha_inicio: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}

export interface CreateTareaInput {
  descripcion: Scalars['String']['input'];
  nombre: Scalars['String']['input'];
  puesto_id: Scalars['ID']['input'];
  tipo?: InputMaybe<TiposTarea>;
}

export interface CreateTarifaDto {
  costo_early_checkin: Scalars['Float']['input'];
  costo_habitacion: Scalars['Float']['input'];
  costo_hora_extra: Scalars['Float']['input'];
  costo_hospedaje_extra: Scalars['Float']['input'];
  costo_persona_extra: Scalars['Float']['input'];
  dias_disponibles: Array<DiasDisponibles>;
  duracion_renta: Scalars['Float']['input'];
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicio: Scalars['DateTime']['input'];
  hora_checkin: Scalars['String']['input'];
  hora_checkout: Scalars['String']['input'];
  hora_final: Scalars['String']['input'];
  hora_inicio: Scalars['String']['input'];
  horas_extra_max: Scalars['Float']['input'];
  hospedajes_extra_max: Scalars['Float']['input'];
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['String']['input'];
  pantalla_disponibilidad: Scalars['Boolean']['input'];
  personas_extra_max: Scalars['Float']['input'];
  tipo_alojamiento: TiposAlojamientos;
  tipo_habitacion_id: Scalars['ID']['input'];
  tipo_tarifa: TipoTarifa;
}

export interface CreateTipoBloqueoDto {
  /** Listado de claves del tipo de bloqueo */
  claves: Array<ClaveTipoBloqueoInput>;
  /** Identificador del hotel al que pertenece el tipo de bloqueo */
  hotel_id: Scalars['ID']['input'];
  /** Nombre del tipo de bloqueo */
  nombre: Scalars['String']['input'];
}

export interface CreateTipoHabitacionDto {
  amenidades: Array<Scalars['String']['input']>;
  camas: Array<CamaInput>;
  clave: Scalars['String']['input'];
  descripcion: Scalars['String']['input'];
  hotel_id: Scalars['ID']['input'];
  /** Limite de reservas por dia */
  limite_reservas: Scalars['Float']['input'];
  minutos_entrada: Scalars['Float']['input'];
  minutos_limpieza_detallada: Scalars['Float']['input'];
  minutos_limpieza_normal: Scalars['Float']['input'];
  minutos_limpieza_retoque: Scalars['Float']['input'];
  minutos_pendiente_supervision: Scalars['Float']['input'];
  minutos_sucia: Scalars['Float']['input'];
  minutos_supervision: Scalars['Float']['input'];
  nombre: Scalars['String']['input'];
  personas_incluidas: Scalars['Int']['input'];
}

export interface CreateTipoMantenimientoDto {
  /** Listado de claves del tipo de mantenimiento */
  claves: Array<ClaveTipoMantenimientoInput>;
  /** Identificador del hotel al que pertenece el tipo de mantenimiento */
  hotel_id: Scalars['ID']['input'];
  /** Nombre del tipo de mantenimiento */
  nombre: Scalars['String']['input'];
}

export interface CreateTurnoAtencionInput {
  estado: EstadosTurnosAtencion;
  hotel_id: Scalars['ID']['input'];
  nombre_o_matricula?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface CreateTurnoInput {
  hora_entrada: Scalars['String']['input'];
  hora_salida: Scalars['String']['input'];
  hotel_id: Scalars['ID']['input'];
  nombre: Scalars['ID']['input'];
}

export interface CreateUsuarioInput {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  cliente_url?: InputMaybe<Scalars['String']['input']>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo: Scalars['String']['input'];
  empresa_hotel: Scalars['String']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre: Scalars['String']['input'];
  origen?: InputMaybe<Origen>;
  pais: Scalars['String']['input'];
  password?: InputMaybe<Scalars['String']['input']>;
  puesto_rol?: InputMaybe<PuestoRol>;
  rol_id?: InputMaybe<Scalars['ID']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['String']['input']>;
}

export interface DataConceptoResumenUtilidad {
  __typename?: 'DataConceptoResumenUtilidad';
  concepto: Scalars['String']['output'];
  porcentaje_diario: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
}

export interface DataConceptoResumenUtilidadPorcentaje {
  __typename?: 'DataConceptoResumenUtilidadPorcentaje';
  concepto: Scalars['String']['output'];
  total: Scalars['Float']['output'];
}

export interface DataConceptoResumenUtilidadTotales {
  __typename?: 'DataConceptoResumenUtilidadTotales';
  gastos: DataConceptoResumenUtilidadTotalesGastos;
  ingresos: DataConceptoResumenUtilidadTotalesIngresos;
}

export interface DataConceptoResumenUtilidadTotalesGastos {
  __typename?: 'DataConceptoResumenUtilidadTotalesGastos';
  total: Scalars['Float']['output'];
}

export interface DataConceptoResumenUtilidadTotalesIngresos {
  __typename?: 'DataConceptoResumenUtilidadTotalesIngresos';
  porcentaje_diario: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
}

export interface DataHistorialCambiosTicket {
  __typename?: 'DataHistorialCambiosTicket';
  /** Métodos de pago anteriores */
  metodos_pago: Array<MetodosPagoTicket>;
}

export interface DataIngresosHotelOutput {
  __typename?: 'DataIngresosHotelOutput';
  cantidad: Scalars['Float']['output'];
  concepto: Scalars['String']['output'];
  precio_promedio: Scalars['Float']['output'];
  total_de_venta: Scalars['Float']['output'];
}

export interface DataRoomService {
  __typename?: 'DataRoomService';
  cantidad: Scalars['Float']['output'];
  concepto: Scalars['String']['output'];
  precio_promedio: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
}

export interface DataSubtotales {
  __typename?: 'DataSubtotales';
  total_early_checkin: Scalars['Float']['output'];
  total_habitacion: Scalars['Float']['output'];
  total_horas_extra: Scalars['Float']['output'];
  total_hospedajes_extra: Scalars['Float']['output'];
  total_personas_extra: Scalars['Float']['output'];
}

export interface DataTicket {
  __typename?: 'DataTicket';
  articulos: Array<ArticuloTicket>;
  experiencias: Array<ExperienciasTicket>;
  extras: Array<ExtraTicket>;
  habitaciones: Array<HabitacionTicket>;
  metodos_pago: Array<MetodosPagoTicket>;
  nombre_tarifa?: Maybe<Scalars['String']['output']>;
  orden_id?: Maybe<Array<Scalars['ID']['output']>>;
  origen_ticket: OrigenTicket;
  propinas: Array<PropinasDetalleTicket>;
  renta: Array<RentaTicket>;
  renta_id?: Maybe<Scalars['ID']['output']>;
}

export interface DataVehiculoInput {
  /** Color del vehiculo */
  color: Scalars['String']['input'];
  /** Marca del vehiculo */
  marca: Scalars['String']['input'];
  /** Numero de vehiculo */
  matricula: Scalars['String']['input'];
  /** Modelo del vehiculo */
  modelo: Scalars['String']['input'];
}

/** Datos de vehiculo */
export interface Data_Vehiculo {
  __typename?: 'Data_Vehiculo';
  /** Color del vehiculo */
  color: Scalars['String']['output'];
  /** Marca del vehiculo */
  marca: Scalars['String']['output'];
  /** Numero de vehiculo */
  matricula: Scalars['String']['output'];
  /** Modelo del vehiculo */
  modelo: Scalars['String']['output'];
}

export interface DateSearchInput {
  after?: InputMaybe<Scalars['DateTime']['input']>;
  before?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_final?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_inicial?: InputMaybe<Scalars['DateTime']['input']>;
}

export interface DatosHabitacion {
  __typename?: 'DatosHabitacion';
  ultima_limpieza?: Maybe<Array<ColaboradorTarea>>;
  ultima_supervision?: Maybe<ColaboradorTarea>;
  ultimo_mantenimiento?: Maybe<ColaboradorTarea>;
}

export interface DatosPaginationOutput {
  __typename?: 'DatosPaginationOutput';
  pagina_actual: Scalars['Int']['output'];
  total_paginas: Scalars['Int']['output'];
  total_registros: Scalars['Int']['output'];
}

export interface DaySearchInput {
  dia_final: Scalars['String']['input'];
  dia_inicial: Scalars['String']['input'];
}

export interface DeleteAlmacenInput {
  almacen_id: Array<Scalars['ID']['input']>;
}

export interface DeleteAlmacenesArticulosInput {
  almacen_articulo_id: Array<Scalars['ID']['input']>;
}

export interface DeleteApiKeyInput {
  api_key_id: Scalars['String']['input'];
}

export interface DeleteAreaInput {
  area_id: Scalars['ID']['input'];
}

export interface DeleteArticuloInput {
  articulo_id: Scalars['ID']['input'];
}

export interface DeleteCategoriaArticuloInput {
  categoria_id: Scalars['ID']['input'];
}

export interface DeleteCategoriaGastosInput {
  categoria_id: Scalars['ID']['input'];
}

export interface DeleteClienteInput {
  cliente_id: Scalars['ID']['input'];
}

export interface DeleteColaboradorInput {
  colaborador_id: Scalars['ID']['input'];
}

export interface DeleteColaboradorTareaInput {
  colaborador_tarea_id: Scalars['ID']['input'];
}

export interface DeleteComandaInput {
  comanda_id: Array<Scalars['ID']['input']>;
}

export interface DeleteComentarioHabitacionInput {
  comentario_id: Scalars['ID']['input'];
  habitacion_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface DeleteConfiguracionFajillaInput {
  configuracion_fajilla_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface DeleteCredencialInput {
  usuario_id: Scalars['ID']['input'];
}

export interface DeleteCredentialHuellaPinInput {
  credenciales: Array<HuellaOPin>;
  usuario_id: Scalars['ID']['input'];
}

export interface DeleteGastoInput {
  gasto_id: Scalars['ID']['input'];
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface DeleteHabitacionInput {
  habitacion_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface DeleteHotelInput {
  hotel_id: Scalars['ID']['input'];
}

export interface DeleteImageInput {
  image: ImagenIncidenciaInput;
  indicencia_id: Scalars['ID']['input'];
}

export interface DeleteMantenimientoInput {
  /** ID del mantenimiento a eliminar */
  mantenimiento_id: Scalars['ID']['input'];
}

export interface DeleteMesaInput {
  mesa_id: Scalars['ID']['input'];
}

export interface DeleteMetodoDePagoInput {
  metododepago_id: Scalars['ID']['input'];
}

export interface DeleteMotivoIngresoVehiculoArgs {
  motivo_ingreso_id: Scalars['ID']['input'];
}

export interface DeletePropinaInput {
  propina_id: Scalars['ID']['input'];
}

export interface DeletePuestoInput {
  puesto_id: Scalars['ID']['input'];
}

export interface DeleteRecetaInput {
  articulo_id: Array<Scalars['ID']['input']>;
}

export interface DeleteRolInput {
  rol_id: Scalars['ID']['input'];
}

export interface DeleteSalidaInput {
  salida_id: Scalars['ID']['input'];
}

export interface DeleteServicioInput {
  hotel_id: Scalars['ID']['input'];
  servicio_id: Scalars['ID']['input'];
}

export interface DeleteSubcategoriaGastoInput {
  subcategoria_gasto_id: Scalars['ID']['input'];
}

export interface DeleteSubcategoriaProductoInput {
  subcategoria_id: Scalars['ID']['input'];
}

export interface DeleteSuscripcionInput {
  suscripcion_id: Scalars['ID']['input'];
}

export interface DeleteTareaInput {
  tarea_id: Scalars['ID']['input'];
}

export interface DeleteTarifaDto {
  tarifa_id: Scalars['ID']['input'];
}

export interface DeleteTipoBloqueoArgs {
  tipo_bloqueo_id: Scalars['ID']['input'];
}

export interface DeleteTipoHabitacionArgs {
  tipo_habitacion_id: Scalars['ID']['input'];
}

export interface DeleteTipoMantenimientoArgs {
  tipo_mantenimiento_id: Scalars['ID']['input'];
}

export interface DeleteTurnoAtencionInput {
  turno_atencion_id: Scalars['ID']['input'];
}

export interface DeleteTurnoInput {
  turno_id: Scalars['ID']['input'];
}

export interface DeleteUsuarioInput {
  usuario_id: Scalars['ID']['input'];
}

export interface DescuentaPuntosInput {
  easyrewards_id: Scalars['String']['input'];
  folio_ticket: Scalars['String']['input'];
  hotel_id: Scalars['ID']['input'];
  puntos_descontar: Scalars['Float']['input'];
}

export interface DetalleOrden {
  __typename?: 'DetalleOrden';
  almacen_articulo?: Maybe<AlmacenArticulo>;
  almacen_articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Int']['output'];
  comanda_id?: Maybe<Scalars['ID']['output']>;
  comentarios?: Maybe<Scalars['String']['output']>;
  costo_con_iva: Scalars['Float']['output'];
  costo_sin_iva: Scalars['Float']['output'];
  detalle_orden_id: Scalars['ID']['output'];
  estado: EstadosDetalleOrden;
  /** Representa el estado previo a la cancelacion del articulo. Sirve para poder filtrar el detalle en el panel de cocina */
  estado_anterior?: Maybe<EstadosDetalleOrden>;
  extras?: Maybe<Array<ExtraDetalleOrden>>;
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_devolucion?: Maybe<Scalars['DateTime']['output']>;
  merma?: Maybe<Scalars['Boolean']['output']>;
  monto_iva: Scalars['Float']['output'];
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  orden_id: Scalars['ID']['output'];
  reembolso?: Maybe<Scalars['Boolean']['output']>;
}

export interface DetallePago {
  __typename?: 'DetallePago';
  cancelado: Scalars['Boolean']['output'];
  detalle_pago_id: Scalars['ID']['output'];
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  fecha_pago: Scalars['DateTime']['output'];
  numero_referencia?: Maybe<Scalars['String']['output']>;
  origen_orden: OrigenOrden;
  pago?: Maybe<Pago>;
  pago_id: Scalars['ID']['output'];
  subtotal: Scalars['Float']['output'];
  tipo_pago: TiposPagos;
  ultimos_digitos?: Maybe<Scalars['String']['output']>;
}

export interface DetallePagoPartialInfoObject {
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  numero_referencia?: InputMaybe<Scalars['String']['input']>;
  subtotal: Scalars['Float']['input'];
  tipo_pago: TiposPagos;
  ultimos_digitos?: InputMaybe<Scalars['String']['input']>;
}

export interface DetallePagoPreCargadoOutput {
  __typename?: 'DetallePagoPreCargadoOutput';
  easyrewards_id?: Maybe<Scalars['ID']['output']>;
  numero_referencia?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  tipo_pago: TiposPagos;
  ultimos_digitos?: Maybe<Scalars['String']['output']>;
}

export interface DetalleRepartoPropinaItemOutput {
  __typename?: 'DetalleRepartoPropinaItemOutput';
  aportacion_a_fondo: Scalars['Float']['output'];
  colaborador?: Maybe<Colaborador>;
  colaborador_id: Scalars['ID']['output'];
  comision_bancaria_propina_por_venta: Scalars['Float']['output'];
  comision_bancaria_sobre_fondo: Scalars['Float']['output'];
  desglose_aportacion_a_fondo: Array<VentaColaboradorPorCategoriaDetailOutput>;
  desglose_propina_recolectada: Array<PropinaRecolectadaColaboradorDetailOutput>;
  fondo_de_propina: Scalars['Float']['output'];
  neto_propina_por_ventas: Scalars['Float']['output'];
  pago_correspondiente: Scalars['Float']['output'];
  propina_recolectada: Scalars['Float']['output'];
  subtotal_propina_por_ventas: Scalars['Float']['output'];
}

export interface DetalleRepartoPropinasOutput {
  __typename?: 'DetalleRepartoPropinasOutput';
  detalle_reparto_propinas: Array<DetalleRepartoPropinaItemOutput>;
  monto_recaudado: Scalars['Float']['output'];
  totales: TotalesRepartoPropinasItemOutput;
}

export interface DetallesPagoPartialInfoOutput {
  __typename?: 'DetallesPagoPartialInfoOutput';
  numero_referencia?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  tipo_pago: TiposPagos;
  ultimos_digitos?: Maybe<Scalars['String']['output']>;
}

export enum DiasDisponibles {
  Domingo = 'domingo',
  Jueves = 'jueves',
  Lunes = 'lunes',
  Martes = 'martes',
  Miercoles = 'miercoles',
  Sabado = 'sabado',
  Viernes = 'viernes'
}

export enum DisponibilidadPanelAction {
  Actualizar = 'actualizar',
  Agregar = 'agregar',
  Remover = 'remover'
}

export interface EditComandaInput {
  cancelaciones_detalles?: InputMaybe<Array<CancelDetalleOrdenInput>>;
  cancelaciones_extras?: InputMaybe<Array<CancelExtraDetalleOrdenInput>>;
  comanda_id: Scalars['ID']['input'];
  detalles?: InputMaybe<Array<EditDetalleOrdenInput>>;
  hotel_id: Scalars['ID']['input'];
}

export interface EditConfiguracionCorteItemInput {
  activo?: InputMaybe<Scalars['Boolean']['input']>;
  concepto?: InputMaybe<ConceptosConfiguracionesCortes>;
  configuracion_corte_id: Scalars['ID']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface EditConfiguracionesCorteInput {
  configuraciones_corte: Array<EditConfiguracionCorteItemInput>;
}

export interface EditDetalleOrdenInput {
  accion: AccionesEdicion;
  almacen_articulo_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  extras?: InputMaybe<Array<EditExtraDetalleOrdenInput>>;
}

export interface EditExtraDetalleOrdenInput {
  accion: AccionesEdicion;
  almacen_articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Int']['input'];
  extra_detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface EditMetodoPagoTicketInput {
  metodo_pago: Array<FormaDePagoDetailInput>;
  ticket_id: Scalars['ID']['input'];
}

export interface EditMetodoPagoTicketOutput {
  __typename?: 'EditMetodoPagoTicketOutput';
  metodo_pago: Array<FormaDePagoDetailOutput>;
  ticket_id: Scalars['ID']['output'];
}

export interface EditOrdenInput {
  cancelaciones_detalles?: InputMaybe<Array<CancelDetalleOrdenInput>>;
  cancelaciones_extras?: InputMaybe<Array<CancelExtraDetalleOrdenInput>>;
  detalles?: InputMaybe<Array<EditDetalleOrdenInput>>;
  hotel_id: Scalars['ID']['input'];
  orden_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['String']['input']>;
}

export interface EditVehiculoDataInput {
  renta_id: Scalars['ID']['input'];
  vehiculo: VehiculoDataEditDetailInput;
}

export enum EstadoAlmacen {
  Activado = 'activado',
  Desactivado = 'desactivado'
}

export enum EstadoMesa {
  Bloqueada = 'bloqueada',
  Disponible = 'disponible',
  EnServicio = 'en_servicio',
  Sucia = 'sucia'
}

export enum EstadoPagoOrdenes {
  Deposito = 'deposito',
  NoPagada = 'no_pagada',
  Pagada = 'pagada',
  PagoParcial = 'pago_parcial'
}

export enum EstadosAlmacenesArticulos {
  Activado = 'activado',
  Agotado = 'agotado',
  Desactivado = 'desactivado',
  Disponible = 'disponible',
  PorAgotarse = 'por_agotarse'
}

export enum EstadosArticulo {
  Activado = 'activado',
  Desactivado = 'desactivado'
}

export enum EstadosComandaHistorial {
  Cancelada = 'cancelada',
  Devolucion = 'devolucion',
  EnEntrega = 'en_entrega',
  EnPreparacion = 'en_preparacion',
  Entregada = 'entregada',
  PorEntregar = 'por_entregar'
}

export enum EstadosDetalleOrden {
  Cancelada = 'cancelada',
  CanceladaEdicion = 'cancelada_edicion',
  Devolucion = 'devolucion',
  EnEntrega = 'en_entrega',
  EnPreparacion = 'en_preparacion',
  Entregada = 'entregada',
  PorEntregar = 'por_entregar'
}

export enum EstadosDinamicosMesa {
  EnPreparacion = 'en_preparacion',
  PagoPendiente = 'pago_pendiente',
  PorEntregar = 'por_entregar'
}

export enum EstadosExperiencias {
  Desactivado = 'desactivado',
  Disponible = 'disponible'
}

export enum EstadosExperienciasReservas {
  Cancelada = 'cancelada',
  Pagado = 'pagado',
  PagoParcial = 'pago_parcial',
  SinPagos = 'sin_pagos'
}

export enum EstadosOrdenHistorial {
  Cancelada = 'cancelada',
  CanceladaEdicion = 'cancelada_edicion',
  Devolucion = 'devolucion',
  EnEntrega = 'en_entrega',
  EnPreparacion = 'en_preparacion',
  Entregada = 'entregada',
  PorEntregar = 'por_entregar'
}

export enum EstadosRentas {
  Cancelado = 'cancelado',
  Finalizado = 'finalizado',
  Pagado = 'pagado',
  PendientePago = 'pendiente_pago'
}

export enum EstadosReservas {
  Asignada = 'asignada',
  Cancelada = 'cancelada',
  CheckIn = 'check_in',
  NoShow = 'no_show',
  SinAsignar = 'sin_asignar'
}

export enum EstadosTurno {
  Abierto = 'abierto',
  Cerrado = 'cerrado'
}

export enum EstadosTurnosAtencion {
  Cancelado = 'cancelado',
  EnCurso = 'en_curso',
  EnEspera = 'en_espera',
  Finalizado = 'finalizado'
}

export enum EstadpPago {
  Pagado = 'pagado',
  PagoParcial = 'pago_parcial',
  SinPagos = 'sin_pagos'
}

export interface EstanciaPendienteRentaDetailOutput {
  __typename?: 'EstanciaPendienteRentaDetailOutput';
  cantidad: Scalars['Int']['output'];
  /** Datos del colaborador que registro el movimiento */
  colaborador?: Maybe<Colaborador>;
  detalle: Scalars['String']['output'];
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  extras_checkin: Array<ExtraPendienteRentaDetailOutput>;
  folio: Scalars['String']['output'];
  iva: Scalars['Float']['output'];
  precio: Scalars['Float']['output'];
  renta_id: Scalars['ID']['output'];
  total: Scalars['Float']['output'];
  usuario_id?: Maybe<Scalars['ID']['output']>;
}

export enum EstatusCorte {
  Cerrado = 'cerrado',
  Pendiente = 'pendiente'
}

export enum EstatusFajillas {
  Cancelada = 'cancelada',
  Creada = 'creada',
  Rechazada = 'rechazada',
  Recibida = 'recibida',
  RecibirFajilla = 'recibir_fajilla'
}

export enum EstatusTarifa {
  Activa = 'Activa',
  Inactiva = 'Inactiva'
}

export interface Experiencia {
  __typename?: 'Experiencia';
  cobro_unico: Scalars['Boolean']['output'];
  descripcion?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  estado: EstadosExperiencias;
  experiencia_id: Scalars['ID']['output'];
  fecha_fin: Scalars['DateTime']['output'];
  fecha_inicio: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  precio: Scalars['Float']['output'];
  usuario_id: Scalars['ID']['output'];
}

export interface ExperienciaReserva {
  __typename?: 'ExperienciaReserva';
  estado: EstadosExperienciasReservas;
  experiencia?: Maybe<Experiencia>;
  experiencia_id: Scalars['ID']['output'];
  experiencia_reserva_id: Scalars['ID']['output'];
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  monto_cancelacion?: Maybe<Scalars['Float']['output']>;
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  reserva_id: Scalars['ID']['output'];
  total: Scalars['Float']['output'];
}

export interface ExperienciasTicket {
  __typename?: 'ExperienciasTicket';
  nombre: Scalars['String']['output'];
  total: Scalars['Float']['output'];
}

export interface Extra {
  __typename?: 'Extra';
  corte_id?: Maybe<Scalars['ID']['output']>;
  extra_id: Scalars['ID']['output'];
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_pago?: Maybe<Scalars['DateTime']['output']>;
  fecha_solicitud: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  monto_devuelto_cancelacion?: Maybe<Scalars['Float']['output']>;
  monto_extra: Scalars['Float']['output'];
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  numero: Scalars['Int']['output'];
  /** Es la propina recibida y asociada en la compra del extra */
  propina?: Maybe<Propina>;
  renta?: Maybe<Renta>;
  renta_id: Scalars['ID']['output'];
  ticket_id?: Maybe<Scalars['String']['output']>;
  tipo_extra: TiposExtras;
  /** Es el total del extra + propina (si es que tiene) */
  total_con_propina: Scalars['Float']['output'];
  /** Total del monto de extras tipo hora en la misma venta */
  total_venta_extra_horas?: Maybe<Scalars['Float']['output']>;
  /** Total del monto de extras tipo hospedaje en la misma venta */
  total_venta_extra_hospedajes?: Maybe<Scalars['Float']['output']>;
  /** Total del monto de extras tipo persona en la misma venta */
  total_venta_extra_personas?: Maybe<Scalars['Float']['output']>;
  usuario_cancelacion_id?: Maybe<Scalars['ID']['output']>;
  usuario_id?: Maybe<Scalars['ID']['output']>;
  venta_checkin?: Maybe<Scalars['Boolean']['output']>;
  /** Cantidad de horas en extra relacionado a si fueron en una misma venta */
  venta_extra_horas?: Maybe<Scalars['Float']['output']>;
  /** Cantidad de hospedajes en extra relacionado a si fueron en una misma venta */
  venta_extra_hospedajes?: Maybe<Scalars['Float']['output']>;
  /** Cantidad de personas en extra relacionado a si fueron en una misma venta */
  venta_extra_personas?: Maybe<Scalars['Float']['output']>;
  venta_id?: Maybe<Scalars['ID']['output']>;
}

export interface ExtraDetalleOrden {
  __typename?: 'ExtraDetalleOrden';
  almacen_articulo?: Maybe<AlmacenArticulo>;
  almacen_articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Float']['output'];
  costo_con_iva: Scalars['Float']['output'];
  costo_sin_iva: Scalars['Float']['output'];
  detalle_orden_id: Scalars['ID']['output'];
  extra_detalle_orden_id: Scalars['ID']['output'];
  monto_iva: Scalars['Float']['output'];
}

export interface ExtraPendienteRentaDetailOutput {
  __typename?: 'ExtraPendienteRentaDetailOutput';
  cantidad: Scalars['Int']['output'];
  /** Datos del colaborador que registro el movimiento */
  colaborador?: Maybe<Colaborador>;
  detalle: Scalars['String']['output'];
  extra_id: Scalars['ID']['output'];
  folio?: Maybe<Scalars['String']['output']>;
  iva: Scalars['Float']['output'];
  precio: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  usuario_id?: Maybe<Scalars['ID']['output']>;
  venta_checkin: Scalars['Boolean']['output'];
  venta_id: Scalars['ID']['output'];
}

export interface ExtraTicket {
  __typename?: 'ExtraTicket';
  cantidad: Scalars['Int']['output'];
  costo: Scalars['Float']['output'];
  tipo: Scalars['String']['output'];
}

export interface Fajilla {
  __typename?: 'Fajilla';
  comentario?: Maybe<Scalars['String']['output']>;
  /** Información de la Configuracion-Fajilla de la Fajilla */
  configuracion_fajilla?: Maybe<ConfiguracionFajilla>;
  configuracion_fajilla_id?: Maybe<Scalars['ID']['output']>;
  /** Identificador generado por la maquina de efectivo que registro la fajilla */
  deposito_id?: Maybe<Scalars['String']['output']>;
  estatus: EstatusFajillas;
  fajilla_id: Scalars['ID']['output'];
  fecha_autorizaicion?: Maybe<Scalars['DateTime']['output']>;
  fecha_creacion: Scalars['DateTime']['output'];
  folio: Scalars['Float']['output'];
  hotel_id: Scalars['ID']['output'];
  monto: Scalars['Float']['output'];
  origen: OrigenesFajillas;
  ticket_id: Scalars['ID']['output'];
  turno_id: Scalars['ID']['output'];
  /** Usuario que autorizo la fajilla */
  usuario_autorizo?: Maybe<Usuario>;
  usuario_autorizo_id?: Maybe<Scalars['ID']['output']>;
  /** Usuario creador de la fajilla */
  usuario_creo?: Maybe<Usuario>;
  usuario_creo_id: Scalars['ID']['output'];
}

export interface FindAllColaboradoresTareaRequest {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  colaboradores_tareas_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  descripcion_tarea?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_inicio?: InputMaybe<DateSearchInput>;
  fecha_termino?: InputMaybe<DateSearchInput>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  tarea_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_limpieza?: InputMaybe<TiposLimpiezas>;
}

export interface FindAllHistorialMovimientosInventarioOutput {
  __typename?: 'FindAllHistorialMovimientosInventarioOutput';
  historial_movimientos_inventario: Array<HistorialMovimientosInventario>;
  paginacion: DatosPaginationOutput;
}

export interface FindAllPaginatedOutput {
  __typename?: 'FindAllPaginatedOutput';
  colaboradores: Array<Colaborador>;
  paginacion?: Maybe<DatosPaginationOutput>;
}

export interface FingerPrintLoginInput {
  template_sample: Scalars['String']['input'];
}

export interface FingerPrintLoginOutput {
  __typename?: 'FingerPrintLoginOutput';
  token: Scalars['String']['output'];
}

export interface FolioArticuloFiltersArgs {
  /** Ordena los resultados de forma ASC o DESC en base al folio del articulo */
  order?: InputMaybe<TipoOrdenamiento>;
}

export interface FormaDePagoDetailInput {
  eliminar_propina?: InputMaybe<Scalars['Boolean']['input']>;
  eliminar_tipo_pago?: InputMaybe<Scalars['Boolean']['input']>;
  monto_propina?: InputMaybe<Scalars['Float']['input']>;
  numero_referencia?: InputMaybe<Scalars['String']['input']>;
  subtotal: Scalars['Float']['input'];
  tipo_pago: TiposPagos;
}

export interface FormaDePagoDetailOutput {
  __typename?: 'FormaDePagoDetailOutput';
  eliminar_propina?: Maybe<Scalars['Boolean']['output']>;
  monto_propina?: Maybe<Scalars['Float']['output']>;
  numero_referencia?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  tipo_pago: TiposPagos;
}

export interface Funcionalidad {
  __typename?: 'Funcionalidad';
  descripcion: Scalars['String']['output'];
  funcionalidad_id: Scalars['ID']['output'];
  modulo: Modulo;
  modulo_id: Scalars['ID']['output'];
  nombre_funcionalidad: Scalars['String']['output'];
}

export interface GastoTicket {
  __typename?: 'GastoTicket';
  caja_chica: Scalars['Boolean']['output'];
  cantidad: Scalars['Int']['output'];
  categoria: Scalars['String']['output'];
  concepto: Scalars['String']['output'];
  folio: Scalars['String']['output'];
  monto: Scalars['Float']['output'];
}

export interface Gastos {
  __typename?: 'Gastos';
  caja_chica: Scalars['Boolean']['output'];
  /** Categoria a la que pertenece el gasto */
  categoria_gasto: CategoriaGasto;
  categoria_id: Scalars['ID']['output'];
  comentarios?: Maybe<Scalars['String']['output']>;
  corte_id?: Maybe<Scalars['ID']['output']>;
  eliminado: Scalars['Boolean']['output'];
  fecha_gasto: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  gasto_id: Scalars['ID']['output'];
  /** Hotel asociado al gasto */
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  metodo_pago: Scalars['String']['output'];
  monto: Scalars['Float']['output'];
  /** Sub-categoria a la que pertenece el gasto */
  subcategoria_gasto?: Maybe<SubcategoriaGasto>;
  subcategoria_id?: Maybe<Scalars['ID']['output']>;
  /** Usuario que registra el gasto */
  usuario: Usuario;
  usuario_id: Scalars['ID']['output'];
}

export interface GastosNotificacionesConfigOutput {
  __typename?: 'GastosNotificacionesConfigOutput';
  presupuesto_excedido: Scalars['Boolean']['output'];
}

export interface GetAggregationsAlmacenesArticulosOutput {
  __typename?: 'GetAggregationsAlmacenesArticulosOutput';
  total_procesos: Scalars['Int']['output'];
  total_recetas_alimentos: Scalars['Int']['output'];
  total_recetas_bebidas: Scalars['Int']['output'];
  total_recetas_procesos: Scalars['Int']['output'];
}

export interface GetCancelableAmountsRentaOutput {
  __typename?: 'GetCancelableAmountsRentaOutput';
  parcial: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
}

export interface GetConceptosPendientesRentaOutput {
  __typename?: 'GetConceptosPendientesRentaOutput';
  estancia_pendiente?: Maybe<EstanciaPendienteRentaDetailOutput>;
  extras_pendientes: Array<VentaExtraRentaDetailOutput>;
}

export interface GetGoogleUserInput {
  client_id: Scalars['String']['input'];
  token: Scalars['String']['input'];
}

export interface GetInformeHistorialMovimientosInventarioOutput {
  __typename?: 'GetInformeHistorialMovimientosInventarioOutput';
  entradas_insumos: MovimientoInformeDetailOutput;
  entradas_productos: MovimientoInformeDetailOutput;
  merma: MovimientoInformeDetailOutput;
  salidas_insumos: MovimientoInformeDetailOutput;
  salidas_venta: MovimientoInformeDetailOutput;
}

export interface GetInformeInventarioOutput {
  __typename?: 'GetInformeInventarioOutput';
  articulos_agotados: Scalars['Int']['output'];
  articulos_por_agotarse: Scalars['Int']['output'];
  cantidad_articulos: Scalars['Int']['output'];
  costo_total_inventario: Scalars['Float']['output'];
  valor_comercial: Scalars['Float']['output'];
}

export interface GetKpisHistorialProduccionesInventarioByArticuloIdOutput {
  __typename?: 'GetKpisHistorialProduccionesInventarioByArticuloIdOutput';
  articulo_id: Scalars['String']['output'];
  costo_total_inventario: Scalars['String']['output'];
  costo_unitario_promedio: Scalars['String']['output'];
  fecha_ultima_produccion?: Maybe<Scalars['DateTime']['output']>;
  produccion_receta: Scalars['String']['output'];
  unidad: UnidadMedidasArticulo;
  unidades_inventario: Scalars['String']['output'];
}

export interface GetKpisMantenimientoOutput {
  __typename?: 'GetKpisMantenimientoOutput';
  habitaciones_bloqueadas: Scalars['Int']['output'];
  incidencias_cerradas: Scalars['Int']['output'];
  incidencias_pendientes: Scalars['Int']['output'];
  total_agua: Scalars['Float']['output'];
  total_gas: Scalars['Float']['output'];
  total_luz: Scalars['Float']['output'];
}

export interface GetLastOrdenOutput {
  __typename?: 'GetLastOrdenOutput';
  estado_orden: EstadosOrdenHistorial;
  orden?: Maybe<Orden>;
  orden_activa: Scalars['Boolean']['output'];
}

export interface GetMesaDynamicStateOutput {
  __typename?: 'GetMesaDynamicStateOutput';
  comanda_activa?: Maybe<Comanda>;
  estado_activo?: Maybe<EstadosDinamicosMesa>;
}

export interface GetMovementsCountBeforeCorteOutput {
  __typename?: 'GetMovementsCountBeforeCorteOutput';
  numero_total_movimientos: Scalars['Float']['output'];
  suma_total_montos: Scalars['Float']['output'];
}

export interface GetRentaTransactionsOutput {
  __typename?: 'GetRentaTransactionsOutput';
  ordenes?: Maybe<Array<RentaOrdenTransactionItemOutput>>;
  renta?: Maybe<Renta>;
  transacciones?: Maybe<Array<RentaTransactionItemOutput>>;
  transacciones_checkin: Array<RentaTransactionItemOutput>;
}

export interface GetReportePropinasOutput {
  __typename?: 'GetReportePropinasOutput';
  reporte_propinas: Array<ReportePropinasPorPuestoDetailOutput>;
}

export interface GetTodayRentalSales {
  __typename?: 'GetTodayRentalSales';
  acumulado_rentas: Array<SalesByTurno>;
}

export interface GetTodaySalesInput {
  fecha_final?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_inicial?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id: Scalars['ID']['input'];
}

export interface GetVehiculoDataByPlacaInput {
  /** Placa del vehículo */
  placa: Scalars['String']['input'];
}

export interface GetVehiculoDataByPlacaOutput {
  __typename?: 'GetVehiculoDataByPlacaOutput';
  /** Datos del vehículo */
  vehiculo?: Maybe<Data_Vehiculo>;
}

export interface GoogleUserResponse {
  __typename?: 'GoogleUserResponse';
  email: Scalars['String']['output'];
  family_name: Scalars['String']['output'];
  given_name: Scalars['String']['output'];
  picture: Scalars['String']['output'];
}

export interface GroupCortes {
  __typename?: 'GroupCortes';
  cortes: Array<Corte>;
  fecha: Scalars['DateTime']['output'];
  total_corte: Scalars['Float']['output'];
}

export interface GrupoHotel {
  __typename?: 'GrupoHotel';
  eliminado: Scalars['Boolean']['output'];
  estatus: Scalars['String']['output'];
  grupo_hotel_id: Scalars['ID']['output'];
  hotel?: Maybe<Hotel>;
  nombre_grupo: Scalars['String']['output'];
  numero_hoteles: Scalars['Int']['output'];
}

export interface Habitacion {
  __typename?: 'Habitacion';
  /** Retorna la primer incidencia de la habitacion, del tipo indicado en los argumentos */
  alerta_incidencia?: Maybe<Incidencia>;
  /** Ultimas tareas de colaborador asignadas a la habitacion */
  colaborador_tarea?: Maybe<Array<ColaboradorTarea>>;
  /** Tareas de colaborador asignadas a la habitacion que no han terminado */
  colaborador_tareas_sin_finalizar?: Maybe<Array<ColaboradorTarea>>;
  comentario_estado?: Maybe<Scalars['String']['output']>;
  comentarios?: Maybe<Array<ComentarioHabitacion>>;
  eliminado: Scalars['Boolean']['output'];
  estado: Estados_Habitaciones;
  fecha_estado?: Maybe<Scalars['DateTime']['output']>;
  habitacion_id: Scalars['ID']['output'];
  /** Información del Hotel de la Habitación */
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  /** Incidencias de la habitacion por tipo de estado */
  incidencias?: Maybe<Array<Incidencia>>;
  incidencias_activas?: Maybe<Scalars['Float']['output']>;
  /** Cantidad de incidencias activas registradas por el usuario para la habitacion */
  incidencias_activas_usuario: Scalars['Float']['output'];
  numero_habitacion: Scalars['String']['output'];
  piso: Scalars['String']['output'];
  posicion?: Maybe<Posicion>;
  /** Renta pasada de la habitacion */
  renta_pasada?: Maybe<Renta>;
  rentas_today?: Maybe<Scalars['Int']['output']>;
  reservas_today?: Maybe<Scalars['Int']['output']>;
  subestado?: Maybe<SubestadosHabitaciones>;
  /** Datos asociados al primer registro de colaborador-tarea en curso para la habitacion */
  tarea_en_curso?: Maybe<ColaboradorTarea>;
  /** Información del tipo habitación de la Habitación */
  tipo_habitacion?: Maybe<TipoHabitacion>;
  tipo_habitacion_id: Scalars['ID']['output'];
  /** Ultima Renta de la habitacion */
  ultima_renta?: Maybe<Renta>;
  /** Ultima reserva de la habitacion */
  ultima_reserva?: Maybe<UltimaReserva>;
  ultimas_rentas?: Maybe<Array<Renta>>;
  ultimos_datos?: Maybe<DatosHabitacion>;
  /** Informacion del Usuario asociado a la habitacion */
  usuario: Usuario;
  usuario_id: Scalars['ID']['output'];
}


export interface HabitacionAlerta_IncidenciaArgs {
  tipo_incidencia?: InputMaybe<Array<TiposIncidencias>>;
}


export interface HabitacionIncidenciasArgs {
  estado?: InputMaybe<Estados_Incidencias>;
}


export interface HabitacionIncidencias_Activas_UsuarioArgs {
  usuario_id: Scalars['ID']['input'];
}

export interface HabitacionTicket {
  __typename?: 'HabitacionTicket';
  costo: Scalars['Float']['output'];
  early_checkin: Scalars['Float']['output'];
  numero: Scalars['Int']['output'];
  tipo: Scalars['String']['output'];
}

export interface HabitacionesMesasOutput {
  __typename?: 'HabitacionesMesasOutput';
  habitaciones: Array<Habitacion>;
  mesas: Array<Mesa>;
}

export interface HabitacionesNotificacionesConfigOutput {
  __typename?: 'HabitacionesNotificacionesConfigOutput';
  ocupacion_maxima_alcanzada: Scalars['Boolean']['output'];
  sin_habitaciones_disponibles: Scalars['Boolean']['output'];
}

export interface HasActiveMesaAsignadaOutput {
  __typename?: 'HasActiveMesaAsignadaOutput';
  has_mesa_activa: Scalars['Boolean']['output'];
  mesa_asignada?: Maybe<MesaAsignada>;
}

export interface HistorialEstadoComanda {
  __typename?: 'HistorialEstadoComanda';
  comanda?: Maybe<Comanda>;
  comanda_id: Scalars['ID']['output'];
  estado_comanda: EstadosComandaHistorial;
  fecha_fin: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  historial_estado_comanda_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  tiempo_en_preparacion?: Maybe<Scalars['String']['output']>;
  tiempo_por_entregar?: Maybe<Scalars['String']['output']>;
  tiempo_total?: Maybe<Scalars['String']['output']>;
}

export interface HistorialEstadoOrden {
  __typename?: 'HistorialEstadoOrden';
  estado_orden: EstadosOrdenHistorial;
  fecha_fin: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  historial_estado_orden_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  orden?: Maybe<Orden>;
  orden_id: Scalars['ID']['output'];
  tiempo_en_entrega?: Maybe<Scalars['String']['output']>;
  tiempo_en_preparacion?: Maybe<Scalars['String']['output']>;
  tiempo_por_entregar?: Maybe<Scalars['String']['output']>;
  tiempo_total?: Maybe<Scalars['String']['output']>;
}

export interface HistorialHabitacion {
  __typename?: 'HistorialHabitacion';
  accion: Scalars['String']['output'];
  data?: Maybe<HistorialHabitacionData>;
  fecha: Scalars['DateTime']['output'];
  habitacion: Habitacion;
  habitacion_id: Scalars['ID']['output'];
  historial_habitacion_id: Scalars['ID']['output'];
  hotel?: Maybe<Hotel>;
  tipoHabitacion?: Maybe<TipoHabitacion>;
  usuario?: Maybe<Usuario>;
  usuario_id: Scalars['ID']['output'];
}

export interface HistorialHabitacionData {
  __typename?: 'HistorialHabitacionData';
  comentario_estado?: Maybe<Scalars['String']['output']>;
  eliminado: Scalars['Boolean']['output'];
  estado_id?: Maybe<Scalars['ID']['output']>;
  fecha_estado?: Maybe<Scalars['DateTime']['output']>;
  hotel_id: Scalars['ID']['output'];
  numero_habitacion: Scalars['String']['output'];
  piso: Scalars['String']['output'];
  subestado?: Maybe<Scalars['String']['output']>;
  tipo_habitacion_id: Scalars['ID']['output'];
}

export interface HistorialHabitacionesData {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_estado?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_habitacion?: InputMaybe<Scalars['String']['input']>;
  piso?: InputMaybe<Scalars['String']['input']>;
  subestado?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface HistorialMovimientosInventario {
  __typename?: 'HistorialMovimientosInventario';
  almacen_articulo_id?: Maybe<Scalars['String']['output']>;
  articulo?: Maybe<Articulo>;
  articulo_id: Scalars['ID']['output'];
  cantidad: Scalars['Float']['output'];
  costo_actual: Scalars['Float']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  historial_movimiento_inventario_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  movimiento: MovimientoHistorialInventario;
  nombre_articulo: Scalars['String']['output'];
  /** Almacen(es) de origen y destino dependiendo del tipo de movimiento del historial */
  origen_destino?: Maybe<Scalars['String']['output']>;
  precio: Scalars['Float']['output'];
  responsable?: Maybe<Colaborador>;
  salida_id?: Maybe<Scalars['ID']['output']>;
  surtido_id?: Maybe<Scalars['ID']['output']>;
  tipo: TipoMovimientoHistorialInventario;
}

export interface HistorialProduccionInventario {
  __typename?: 'HistorialProduccionInventario';
  articulo_id: Scalars['ID']['output'];
  cantidad_producida: Scalars['Float']['output'];
  colaborador_id: Scalars['ID']['output'];
  costo_produccion: Scalars['Float']['output'];
  costo_unidad_minima_produccion: Scalars['Float']['output'];
  fecha_produccion: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  historial_produccion_inventario_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  /** Colaborador que autorizo la acción de producción */
  responsable?: Maybe<Colaborador>;
  unidad: UnidadMedidasProduccion;
}

export interface HistorialVehiculo {
  __typename?: 'HistorialVehiculo';
  concepto?: Maybe<Scalars['String']['output']>;
  fecha_entrada: Scalars['DateTime']['output'];
  historial_vehiculo_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  renta_id?: Maybe<Scalars['ID']['output']>;
  turno_id: Scalars['ID']['output'];
  /** Datos del vehiculo asociado al registro de entrada */
  vehiculo: Vehiculo;
  vehiculo_id: Scalars['ID']['output'];
}

export interface Hotel {
  __typename?: 'Hotel';
  calle: Scalars['String']['output'];
  ciudad: Scalars['String']['output'];
  colonia: Scalars['String']['output'];
  /** Configuraciones del hotel */
  configurations?: Maybe<Configurations>;
  correo: Scalars['String']['output'];
  cp: Scalars['String']['output'];
  /** Sucursal EasyRewards */
  easyrewards_sucursal_id: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  estado: Scalars['String']['output'];
  estatus: Scalars['String']['output'];
  fecha_creacion: Scalars['DateTime']['output'];
  fecha_modificacion: Scalars['DateTime']['output'];
  grupo_hotel: GrupoHotel;
  grupo_hotel_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  imas_config: ImasConfiguration;
  imas_transaccion_status: Scalars['Boolean']['output'];
  /** Logo del hotel */
  logo_hotel?: Maybe<Scalars['String']['output']>;
  nombre_hotel: Scalars['String']['output'];
  numero_exterior: Scalars['String']['output'];
  numero_interior: Scalars['String']['output'];
  razon_social: Scalars['String']['output'];
  rfc: Scalars['String']['output'];
  suscripciones?: Maybe<Array<Suscripcion>>;
  telefono: Scalars['String']['output'];
  /** zona horaria del hotel */
  zona_horaria?: Maybe<Scalars['String']['output']>;
}

export interface HotelColaborador {
  __typename?: 'HotelColaborador';
  area_id: Scalars['ID']['output'];
  colaborador: Colaborador;
  colaborador_id: Scalars['ID']['output'];
  eliminado: Scalars['Boolean']['output'];
  hotel: Hotel;
  hotel_colaborador_id: Scalars['ID']['output'];
  hotel_id: Scalars['ID']['output'];
  puesto?: Maybe<Puesto>;
  puesto_id: Scalars['ID']['output'];
}

export enum HuellaOPin {
  Huella = 'huella',
  Pin = 'pin'
}

export interface ImageIncidenciaEntity {
  __typename?: 'ImageIncidenciaEntity';
  id?: Maybe<Scalars['String']['output']>;
  imagen?: Maybe<Scalars['String']['output']>;
}

export interface ImagenIncidenciaInput {
  id?: InputMaybe<Scalars['ID']['input']>;
  imagen?: InputMaybe<Scalars['String']['input']>;
}

export interface ImasConfiguration {
  __typename?: 'ImasConfiguration';
  iAlmacen: Scalars['Int']['output'];
  iEmpresa: Scalars['Int']['output'];
  iSucursal: Scalars['Int']['output'];
  sBD: Scalars['String']['output'];
  sLinea: Scalars['String']['output'];
}

export interface Incidencia {
  __typename?: 'Incidencia';
  area?: Maybe<Scalars['String']['output']>;
  colaborador_cierra?: Maybe<Colaborador>;
  colaborador_id_cierra?: Maybe<Scalars['ID']['output']>;
  colaborador_id_reporta: Scalars['ID']['output'];
  colaborador_reporta: Colaborador;
  comentario_cierre?: Maybe<Scalars['String']['output']>;
  comentarios: Array<ComentarioIncidenciaEntity>;
  detalle: Scalars['String']['output'];
  estado?: Maybe<Estados_Incidencias>;
  fecha_cierre?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  fecha_ultima_apertura?: Maybe<Scalars['DateTime']['output']>;
  folio: Scalars['Int']['output'];
  habitacion?: Maybe<Habitacion>;
  habitacion_id?: Maybe<Scalars['ID']['output']>;
  hotel_id: Scalars['ID']['output'];
  huesped?: Maybe<Scalars['String']['output']>;
  imagenes?: Maybe<Array<ImageIncidenciaEntity>>;
  incidencia_id: Scalars['ID']['output'];
  matricula?: Maybe<Scalars['String']['output']>;
  severidad: Scalars['String']['output'];
  tipo_incidencia?: Maybe<Scalars['String']['output']>;
  turno: Turno;
  turno_id: Scalars['ID']['output'];
  /** Vehículo asociado a la incidencia mediante la matrícula */
  vehiculo?: Maybe<Data_Vehiculo>;
}

export interface IncidenciasNotificacionesConfigOutput {
  __typename?: 'IncidenciasNotificacionesConfigOutput';
  incidencias_altas: Scalars['Boolean']['output'];
}

export interface InclusionSearchInput {
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  not_in?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface IngredienteReceta {
  __typename?: 'IngredienteReceta';
  almacen_articulo?: Maybe<AlmacenArticulo>;
  almacen_articulo_id: Scalars['ID']['output'];
  articulo?: Maybe<Articulo>;
  cantidad: Scalars['Float']['output'];
  /** Cantidad equivalente del ingrediente, en la medida de la existencia del articulo */
  cantidad_equivalente: Scalars['Float']['output'];
  /** Costo equivalente del uso de la cantidad especificada del ingrediente */
  costo_por_cantidad_ingrediente?: Maybe<Scalars['Float']['output']>;
  /** Resultado entre la cantidad en almacen x el contenido del articulo */
  disponible_inventario: Scalars['Float']['output'];
  ingrediente_receta_id: Scalars['ID']['output'];
  receta_id: Scalars['ID']['output'];
  unidad: UnidadMedidasArticulo;
}

export interface IngredienteRecetaInput {
  almacen_articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  ingrediente_receta_id?: InputMaybe<Scalars['ID']['input']>;
  receta_id?: InputMaybe<Scalars['ID']['input']>;
  unidad: UnidadMedidasArticulo;
}

export interface IngresosHotelOutput {
  __typename?: 'IngresosHotelOutput';
  desgloce: Array<DataIngresosHotelOutput>;
  totales: TotalesHotelOutput;
}

export interface IngresosRoomServiceOutput {
  __typename?: 'IngresosRoomServiceOutput';
  desgloce: Array<DataRoomService>;
  totales: TotalesRoomService;
}

export interface ListenDisponibilidadHabitacionesSubOutput {
  __typename?: 'ListenDisponibilidadHabitacionesSubOutput';
  disponibilidad_habitaciones?: Maybe<TipoHabitacionSubDetail>;
  lista_de_espera?: Maybe<TurnosAtencionSubModesOutput>;
}

export interface ListenOrdenesStateSubOutput {
  __typename?: 'ListenOrdenesStateSubOutput';
  error_message?: Maybe<Scalars['String']['output']>;
  orden_en_preparacion?: Maybe<OrdenSubDetail>;
  orden_por_entregar?: Maybe<OrdenSubDetail>;
  status?: Maybe<Scalars['String']['output']>;
}

export interface LockHabitacionInput {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface LoginGoogleInput {
  client_id: Scalars['String']['input'];
  token: Scalars['String']['input'];
}

export interface LoginGoogleResponse {
  __typename?: 'LoginGoogleResponse';
  token: Scalars['ID']['output'];
  ultimo_hotel_id?: Maybe<Scalars['ID']['output']>;
  usuario_id?: Maybe<Scalars['ID']['output']>;
}

export interface LovePointsResponse {
  __typename?: 'LovePointsResponse';
  saldo?: Maybe<Scalars['Float']['output']>;
}

export interface Mantenimiento {
  __typename?: 'Mantenimiento';
  agua: Scalars['Float']['output'];
  colaborador: Colaborador;
  colaborador_id: Scalars['ID']['output'];
  corte: Corte;
  corte_id?: Maybe<Scalars['ID']['output']>;
  fecha_actualizacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  gas: Scalars['Float']['output'];
  luz: Scalars['Float']['output'];
  mantenimiento_id: Scalars['ID']['output'];
  turno: Turno;
  turno_id: Scalars['ID']['output'];
  usuario_id: Scalars['ID']['output'];
}

export interface MensajePlantilla {
  __typename?: 'MensajePlantilla';
  general?: Maybe<Scalars['String']['output']>;
  habitacion?: Maybe<Scalars['String']['output']>;
  huesped?: Maybe<Scalars['String']['output']>;
}

export interface MensajePlantillaPushNotification {
  __typename?: 'MensajePlantillaPushNotification';
  general?: Maybe<Scalars['String']['output']>;
  habitacion?: Maybe<Scalars['String']['output']>;
  huesped?: Maybe<Scalars['String']['output']>;
}

export interface Mesa {
  __typename?: 'Mesa';
  /** Asignacion actual/en curso de la mesa */
  asignacion_actual?: Maybe<MesaAsignada>;
  cantidad_personas: Scalars['Float']['output'];
  eliminado: Scalars['Boolean']['output'];
  estado: EstadoMesa;
  /** Retorna el estado de la mesa de forma dinámica y la comanda activa para la orden actual de la mesa */
  estado_dinamico?: Maybe<GetMesaDynamicStateOutput>;
  fecha_modificacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  mesa_id: Scalars['ID']['output'];
  motivo_bloqueo?: Maybe<Scalars['String']['output']>;
  numero_mesa: Scalars['String']['output'];
  posicion?: Maybe<PosicionMesa>;
  /** Asignación mas reciente de la mesa */
  ultima_asignacion?: Maybe<MesaAsignada>;
  usuario_modifico_id?: Maybe<Scalars['ID']['output']>;
}

export interface MesaAsignada {
  __typename?: 'MesaAsignada';
  colaborador_asignado_id: Scalars['ID']['output'];
  /** Colaborador que atendio la mesa */
  colaborador_atendio?: Maybe<Colaborador>;
  fecha_cuenta_cerrada?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  fecha_salida?: Maybe<Scalars['DateTime']['output']>;
  mesa_asignada_id: Scalars['ID']['output'];
  mesa_id: Scalars['ID']['output'];
  /** Orden de la mesa */
  orden?: Maybe<Orden>;
  orden_id?: Maybe<Scalars['ID']['output']>;
}

export interface MetodoDePago {
  __typename?: 'MetodoDePago';
  default: Scalars['Boolean']['output'];
  eliminado: Scalars['Boolean']['output'];
  estatus: Scalars['String']['output'];
  metododepago_id: Scalars['ID']['output'];
  payment_token: Scalars['String']['output'];
  usuario: Usuario;
  usuario_id: Scalars['ID']['output'];
}

export interface MetodoDePagoInput {
  default: Scalars['Boolean']['input'];
  payment_token: Scalars['String']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface MetodoDePagoUpdateInput {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  metododepago_id: Scalars['ID']['input'];
  payment_token?: InputMaybe<Scalars['String']['input']>;
}

export interface MetodosPago {
  __typename?: 'MetodosPago';
  amex: Scalars['Float']['output'];
  deposito_o_transferencia: Scalars['Float']['output'];
  efectivo: Scalars['Float']['output'];
  visa_o_mastercard: Scalars['Float']['output'];
}

export interface MetodosPagoTicket {
  __typename?: 'MetodosPagoTicket';
  numero_referencia?: Maybe<Scalars['String']['output']>;
  tipo: Scalars['String']['output'];
  total: Scalars['Float']['output'];
  ultimos_digitos?: Maybe<Scalars['String']['output']>;
}

export enum ModalidadDePago {
  DepositoEnGarantia = 'deposito_en_garantia',
  Parcial = 'parcial',
  Pendiente = 'pendiente',
  Total = 'total'
}

export interface Modulo {
  __typename?: 'Modulo';
  descripcion: Scalars['String']['output'];
  funcionalidades?: Maybe<Array<Funcionalidad>>;
  modulo_id: Scalars['ID']['output'];
  nombre_modulo: Scalars['String']['output'];
}

export interface MonthSearchInput {
  mes_y_anio: Scalars['String']['input'];
}

export enum Motivo {
  Caducado = 'caducado',
  ConsumoInterno = 'consumo_interno',
  Faltante = 'faltante',
  Merma = 'merma',
  Proceso = 'proceso',
  Receta = 'receta',
  Transferencia = 'transferencia',
  Venta = 'venta'
}

export interface MotivoIngresoVehiculo {
  __typename?: 'MotivoIngresoVehiculo';
  /** Indica si el registro está eliminado */
  eliminado: Scalars['Boolean']['output'];
  /** Identificador del hotel al que pertenece */
  hotel_id: Scalars['ID']['output'];
  /** Identificador único del motivo de ingreso de un vehículo */
  motivo_ingreso_id: Scalars['ID']['output'];
  /** Nombre del motivo de ingreso del vehículo */
  nombre: Scalars['String']['output'];
}

export enum MovimientoHistorialInventario {
  Entrada = 'entrada',
  Salida = 'salida'
}

export interface MovimientoInformeDetailOutput {
  __typename?: 'MovimientoInformeDetailOutput';
  total: Scalars['Float']['output'];
  unidades: Scalars['Int']['output'];
}

export interface Mutation {
  __typename?: 'Mutation';
  CheckOut: PartialInfoCheckoutResponseOutput;
  abrir_turno: Scalars['String']['output'];
  abrir_turno_colaborador: Colaborador;
  actualizar_almacen: Array<Almacen>;
  actualizar_almacen_articulo: Array<AlmacenArticulo>;
  actualizar_aportaciones_propinas_por_categoria: Array<CategoriaArticulo>;
  actualizar_area: Area;
  actualizar_articulo: Articulo;
  actualizar_asistencia: Asistencia;
  actualizar_categoria_articulo: CategoriaArticulo;
  actualizar_categoria_gasto: CategoriaGasto;
  actualizar_cliente: Cliente;
  actualizar_colaborador_turno: Colaborador;
  actualizar_colaboradores_tareas: Array<ColaboradorTarea>;
  actualizar_comanda: Comanda;
  actualizar_comentario_habitacion: Habitacion;
  actualizar_configuracion_fajilla: ConfiguracionFajilla;
  actualizar_configuracion_inventario: ConfiguracionInventario;
  /** Actualiza la configuracion de notificaciones para el usuario en la app mobile */
  actualizar_configuracion_notificaciones?: Maybe<Array<UsuariosNotificacionesConfigOutput>>;
  actualizar_configuracion_propina: ConfiguracionPropina;
  /** Actualiza el estado de una orden completa, comanda completa o solo de algún detalle-orden */
  actualizar_estado_orden_o_detalle?: Maybe<UpdateEstadoOrdenOrDetalleOutput>;
  actualizar_extra: Extra;
  actualizar_extra_detalle_orden: Scalars['String']['output'];
  actualizar_extras_detalle_orden_detalle_orden_id: UpdateExtrasByDetalleOrdenIdResponse;
  actualizar_fajilla: Fajilla;
  actualizar_gasto: Gastos;
  actualizar_grupo_hotel: GrupoHotel;
  actualizar_habitacion: Habitacion;
  actualizar_habitacion_en_renta: Renta;
  actualizar_habitacion_estado: Habitacion;
  actualizar_habitacion_hotel: Habitacion;
  actualizar_habitacion_tipoHabitacion: Habitacion;
  actualizar_historialHabitacion: HistorialHabitacion;
  actualizar_hotel: Hotel;
  actualizar_huella: Scalars['String']['output'];
  actualizar_incidencia: Incidencia;
  actualizar_mantenimiento: Mantenimiento;
  actualizar_mesa: Mesa;
  actualizar_mesa_asignada: MesaAsignada;
  actualizar_metodo_de_pago: MetodoDePago;
  actualizar_motivo_ingreso_vehiculo: MotivoIngresoVehiculo;
  actualizar_orden: Scalars['String']['output'];
  actualizar_pago: Pago;
  actualizar_posicion_habitacion: Habitacion;
  actualizar_posicion_mesa: Mesa;
  actualizar_puesto: Puesto;
  actualizar_receta: Receta;
  actualizar_renta: Renta;
  actualizar_reserva: UpdateReservaResponse;
  actualizar_rol: Rol;
  actualizar_salida_inventario: Salida;
  actualizar_servicio: Servicio;
  actualizar_subcategoria_producto: SubcategoriaProducto;
  actualizar_surtido: Surtido;
  actualizar_suscripcion: Suscripcion;
  actualizar_tarea: Tarea;
  actualizar_tarifa: Tarifa;
  actualizar_tipo_bloqueo: TipoBloqueo;
  actualizar_tipo_habitacion: TipoHabitacion;
  /** Es la actualizacion de la tipo de limpieza de una tarea de colaborador */
  actualizar_tipo_limpieza: Array<ColaboradorTarea>;
  actualizar_tipo_mantenimiento: TipoMantenimiento;
  actualizar_turno: Turno;
  actualizar_turno_atencion: TurnoAtencion;
  actualizar_usuario: Usuario;
  actualizar_varios_articulos: Scalars['Boolean']['output'];
  actulizar_subcategoria_gasto: SubcategoriaGasto;
  acumula_puntos: LovePointsResponse;
  agregar_colaborador_a_hotel: HotelColaborador;
  agregar_comentario: Scalars['String']['output'];
  agregar_comentario_habitacion: Habitacion;
  agregar_comentario_renta: Scalars['String']['output'];
  agregar_comentario_reserva: Scalars['String']['output'];
  agregar_comentarios_a_tarea: ColaboradorTarea;
  agregar_extras_reserva: Array<Scalars['String']['output']>;
  agregar_horas_renta: AuxPartialInfoRentaResponse;
  agregar_hospedajes_renta: AuxPartialInfoRentaResponse;
  agregar_imagen_incidencia: Scalars['String']['output'];
  agregar_personas_renta: AuxPartialInfoRentaResponse;
  /** Ajusta/Modifica el monto a pagar por aportaciones de propinas a colaboradores que participan en el esquema de reparticion */
  ajustar_asignacion_propina: AjustarAsignacionPropinaOutput;
  asignar_habitacion_a_reserva: Reserva;
  autenticar_huella: AuthenticateCredentialOutput;
  autorizar_fajilla: Scalars['String']['output'];
  bloquear_habitacion: Habitacion;
  borrar_gasto: Gastos;
  /** Elimina de forma física el registro de entrada del vehiculo */
  borrar_historial_vehiculo: Scalars['Boolean']['output'];
  cambiar_habitacion_reserva: Scalars['String']['output'];
  cambiar_mesa_asignada: MesaAsignada;
  cambiar_tarea_con_estado: Scalars['String']['output'];
  cambiar_tarea_entre_colaboradores: Scalars['String']['output'];
  cambiar_tarea_habitacion: Scalars['String']['output'];
  cancelar_comanda: CancelComandaOutput;
  cancelar_extra: Scalars['String']['output'];
  /** Permite cancelar una renta completa o parcialmente */
  cancelar_operaciones_renta: CancelOperationsRentaOutput;
  /** Cancela una orden completa en base al ID de la misma */
  cancelar_orden?: Maybe<CancelOrdenOutput>;
  cancelar_renta: CancelRentaOutput;
  cancelar_reserva: CancelReservaResponse;
  cerrar_corte?: Maybe<Corte>;
  /** Cierra la cuenta de la mesa pero la mesa se mantiene en_servicio */
  cerrar_cuenta_mesa_asignada: MesaAsignada;
  cerrar_incidencia: Incidencia;
  /** Cierra la cuenta y la asignacion/servicio de la mesa */
  cerrar_mesa_asignada: MesaAsignada;
  cerrar_turno: Scalars['String']['output'];
  cerrar_turno_colaborador: Array<Colaborador>;
  changePassword: Scalars['String']['output'];
  checkIn: Array<Scalars['String']['output']>;
  crear_almacen: Almacen;
  crear_almacen_articulo: AlmacenArticulo;
  crear_area: Area;
  crear_articulo: Articulo;
  crear_categoria_articulo: CategoriaArticulo;
  crear_categoria_gasto: CategoriaGasto;
  crear_cliente: Cliente;
  crear_colaborador: Colaborador;
  crear_colaborador_tarea: Array<ColaboradorTarea>;
  crear_colaborador_usuario: Colaborador;
  crear_comanda: Comanda;
  crear_configuracion_fajilla: ConfiguracionFajilla;
  crear_configuracion_inventario: ConfiguracionInventario;
  crear_configuracion_propina: ConfiguracionPropina;
  /** Registra conceptos de configuracion de corte para el hotel */
  crear_configuraciones_corte: Scalars['Boolean']['output'];
  /** Crea una llave de autenticacion HTTP de tipo digest_ha1 para autenticar/autorizar peticiones HTTP */
  crear_digest_key: CreateDigestKeyOutput;
  crear_extra: Extra;
  crear_fajilla: Fajilla;
  crear_gasto: CreateGastoResponse;
  crear_grupo_hotel: GrupoHotel;
  crear_habitacion: Habitacion;
  crear_hotel: Hotel;
  crear_incidencia: Incidencia;
  crear_mantenimiento: Mantenimiento;
  crear_mesa: Mesa;
  crear_mesa_asignada: MesaAsignada;
  crear_metodo_de_pago: MetodoDePago;
  crear_motivo_ingreso_vehiculo: MotivoIngresoVehiculo;
  crear_orden: CreateOrdenResponse;
  crear_orden_parcial_lovepoints: CreateOrdenResponse;
  /** Genera las salidas de insumos/ingredientes del proceso y la produccion resultante se surte al almacen destino */
  crear_produccion_proceso: CreateProductionProcesoOutput;
  crear_propina: Propina;
  crear_puesto: Puesto;
  crear_receta: Receta;
  crear_renta: CreateRentaResponse;
  crear_reserva: CreateReservaResponse;
  crear_rol: Rol;
  crear_salida_inventario: Salida;
  crear_servicio: Servicio;
  crear_subcategoria_gasto: SubcategoriaGasto;
  crear_subcategoria_producto: SubcategoriaProducto;
  crear_surtido: Surtido;
  /** Crea "n" registros de surtidos para "n" almacenes */
  crear_surtidos: CreateManySurtidosOutput;
  crear_suscripcion: Suscripcion;
  crear_tarea: Tarea;
  crear_tarifa: Tarifa;
  crear_tipo_bloqueo: TipoBloqueo;
  crear_tipo_habitacion: TipoHabitacion;
  crear_tipo_mantenimiento: TipoMantenimiento;
  crear_turno: Turno;
  crear_turno_atencion: TurnoAtencion;
  crear_usuario: Usuario;
  createPagoRenta: PagosRentas;
  createPagosReservas: Array<PagosReservas>;
  create_api_key: CreateApiKeyOutput;
  deleteApiKey: Scalars['String']['output'];
  descuenta_puntos: LovePointsResponse;
  devolucion_orden: Orden;
  editar_colaborador: Colaborador;
  /** Permite editar los detalles de la comanda, incluyendo sus extras */
  editar_comanda: Comanda;
  /** Modifica las configuraciones de cortes en base a la clave primaria */
  editar_configuraciones_corte: Scalars['Boolean']['output'];
  /** Permite modificar los datos del vehiculo registrado para la renta */
  editar_datos_vehiculo: VehiculoDataEditDetailOutput;
  /** Edita los datos de registro de entrada de vehiculo */
  editar_historial_vehiculo: Scalars['Boolean']['output'];
  /** Edita el metodo de pago del ticket y sus registros asociados (detalle-pago, propina, reporte_propinas) */
  editar_metodo_pago: EditMetodoPagoTicketOutput;
  /** Permite editar los detalles de la orden, incluyendo sus extras */
  editar_orden: Orden;
  eliminar_almacen: Scalars['String']['output'];
  eliminar_almacen_articulo: Scalars['String']['output'];
  eliminar_area: Scalars['String']['output'];
  eliminar_articulo: Scalars['String']['output'];
  eliminar_categoria_articulo: CategoriaArticulo;
  eliminar_categoria_gasto: CategoriaGasto;
  eliminar_cliente: Cliente;
  eliminar_colaborador: Colaborador;
  eliminar_colaborador_de_hotel: HotelColaborador;
  eliminar_colaborador_tarea: ColaboradorTarea;
  eliminar_comanda: Scalars['String']['output'];
  eliminar_comentario_habitacion: Habitacion;
  eliminar_configuracion_fajilla: Scalars['String']['output'];
  eliminar_habitacion: Scalars['String']['output'];
  eliminar_hotel: Scalars['Boolean']['output'];
  eliminar_huella: Scalars['String']['output'];
  eliminar_huella_pin: Scalars['String']['output'];
  eliminar_imagen_incidencia: Scalars['String']['output'];
  eliminar_mantenimiento: Scalars['Boolean']['output'];
  eliminar_mesa: Scalars['String']['output'];
  eliminar_metodo_de_pago: Scalars['Boolean']['output'];
  eliminar_motivo_ingreso_vehiculo: MotivoIngresoVehiculo;
  eliminar_propina: Propina;
  eliminar_puesto: Puesto;
  eliminar_receta: Scalars['String']['output'];
  eliminar_rol: Rol;
  eliminar_salida_inventario: Salida;
  eliminar_servicio: Servicio;
  eliminar_subcategoria_gasto: SubcategoriaGasto;
  eliminar_subcategoria_producto: SubcategoriaProducto;
  eliminar_suscripcion: Suscripcion;
  eliminar_tarea: Tarea;
  eliminar_tarifa: Tarifa;
  eliminar_tipo_bloqueo: TipoBloqueo;
  eliminar_tipo_habitacion: TipoHabitacion;
  eliminar_tipo_mantenimiento: TipoMantenimiento;
  eliminar_turno: Scalars['String']['output'];
  eliminar_turno_atencion: Scalars['String']['output'];
  eliminar_usuario: Scalars['Boolean']['output'];
  liberar_habitacion: Habitacion;
  login: AuthLoginResponse;
  login_google: LoginGoogleResponse;
  login_huella: FingerPrintLoginOutput;
  logout: Scalars['String']['output'];
  marcar_como_leida: Scalars['Boolean']['output'];
  /** Esquema de repartición de porcentaje de propinas que corresponde a cada puesto */
  modificar_esquema_propinas: Array<Puesto>;
  obtener_usuario_google: GoogleUserResponse;
  pagar_extra: PagoExtra;
  pagar_ordenes_pendientes: Array<Scalars['String']['output']>;
  /** Registro de pagos de propinas y generación del gasto correspondiente al pago */
  pagar_propinas: Array<PagoPropina>;
  /** Realiza el pago de propinas por ventas y retorna el id del reporte creado y almacenado */
  pagar_propinas_ventas: PayPropinasVentasOutput;
  pagar_renta: Array<Scalars['String']['output']>;
  pagar_reserva: Array<Scalars['String']['output']>;
  pendiente_autorizar_fajilla: Scalars['String']['output'];
  reabrir_incidencia: Incidencia;
  rechazar_fajilla: Scalars['String']['output'];
  /** Registra eventos en el historial de login */
  registrar_evento_login: Scalars['Boolean']['output'];
  registrar_huella: Scalars['String']['output'];
  /** Registra/Actualiza un dispositivo del usuario donde tenga instancia de la app */
  registrar_usuario_dispositivo: Scalars['Boolean']['output'];
  /** Deshace las operaciones por ajustes en el pago de propinas */
  reiniciar_asignaciones_propinas: Scalars['Boolean']['output'];
  /** Remueve el puesto indicado del esquema de repartición de propinas */
  remover_puesto_esquema_propinas: Puesto;
  remover_reserva_de_habitacion: Scalars['String']['output'];
  sendChangePasswordViaEmail: Scalars['String']['output'];
  sendNotificationCaratulaMensual: Scalars['String']['output'];
  sincronizar_inventarios_imas: Scalars['String']['output'];
  /** Transfiere articulos de "n" almacenes origen a "n" almacenes destino */
  transferir_articulos: TransferArticulosOutput;
  updateApiKey: Scalars['String']['output'];
  updatePagoRenta: PagosRentas;
  updatePagosReservas: PagosReservas;
  /**
   *
   *     Valida si el usuario esta autorizado para ejecutar ciertas operaciones
   *     a traves del codigo de autorizacion o huella.
   *     Si es administrador se salta la validacion.
   */
  validar_codigo_huella_autorizacion: ValidarCodigoAutorizacionOutput;
}


export interface MutationCheckOutArgs {
  checkOutInput: CheckOutInput;
}


export interface MutationAbrir_TurnoArgs {
  open_turno_input: OpenTurnoInput;
}


export interface MutationAbrir_Turno_ColaboradorArgs {
  turnOnTurnoColaboradorInput: TurnOnTurnoColaboradorInput;
}


export interface MutationActualizar_AlmacenArgs {
  updateAlmacenInput: UpdateAlmacenInput;
}


export interface MutationActualizar_Almacen_ArticuloArgs {
  updateAlmacenArticuloInput: UpdateAlmacenesArticulosInput;
}


export interface MutationActualizar_Aportaciones_Propinas_Por_CategoriaArgs {
  aportaciones_roomservice: UpdateAportacionesPropinasRsInput;
}


export interface MutationActualizar_AreaArgs {
  actualizar_area_input: UpdateAreaInput;
}


export interface MutationActualizar_ArticuloArgs {
  updateArticuloInput: UpdateArticuloInput;
}


export interface MutationActualizar_AsistenciaArgs {
  datos_asistencia: UpdateAsistenciaInput;
}


export interface MutationActualizar_Categoria_ArticuloArgs {
  datos_categoria: UpdateCategoriaArticuloInput;
}


export interface MutationActualizar_Categoria_GastoArgs {
  categoria_gasto_data: UpdateCategoriaGastosInput;
}


export interface MutationActualizar_ClienteArgs {
  datos_cliente: UpdateClienteInput;
}


export interface MutationActualizar_Colaborador_TurnoArgs {
  updateColaboradorTurnoInput: UpdateColaboradorTurnoInput;
}


export interface MutationActualizar_Colaboradores_TareasArgs {
  datos_tarea: CloseTaskInput;
}


export interface MutationActualizar_ComandaArgs {
  UpdateComandaInput: UpdateComandaInput;
}


export interface MutationActualizar_Comentario_HabitacionArgs {
  actualizar_comentario_habitacion_input: UpdateComentarioHabitacionInput;
}


export interface MutationActualizar_Configuracion_FajillaArgs {
  actualizar_configuracion_fajilla_input: UpdateConfiguracionFajillaInput;
}


export interface MutationActualizar_Configuracion_InventarioArgs {
  update_configuracion_inventario: UpdateConfiguracionInventarioInput;
}


export interface MutationActualizar_Configuracion_NotificacionesArgs {
  configNotificacionesInput: UpdateUsuariosNotificacionesInput;
}


export interface MutationActualizar_Configuracion_PropinaArgs {
  UpdateConfiguracionPropinaInput: UpdateConfiguracionPropinaInput;
}


export interface MutationActualizar_Estado_Orden_O_DetalleArgs {
  update_estado_data: UpdateEstadoOrdenOrDetalleInput;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationActualizar_ExtraArgs {
  actualizar_extra_input: UpdateExtraInput;
}


export interface MutationActualizar_Extra_Detalle_OrdenArgs {
  updateExtraDetalleOrdenInput: UpdateExtraDetalleOrdenInput;
}


export interface MutationActualizar_Extras_Detalle_Orden_Detalle_Orden_IdArgs {
  updateExtrasByDetalleOrdenIdInput: UpdateExtrasByDetalleOrdenIdRequest;
}


export interface MutationActualizar_FajillaArgs {
  actualizar_fajilla_input: UpdateFajillaInput;
}


export interface MutationActualizar_GastoArgs {
  datos_gastos: UpdateGastoInput;
}


export interface MutationActualizar_Grupo_HotelArgs {
  actualizar_grupo_hotel_input: UpdateGrupoHotelInput;
}


export interface MutationActualizar_HabitacionArgs {
  actualizar_habitacion_input: UpdateHabitacionInput;
}


export interface MutationActualizar_Habitacion_En_RentaArgs {
  datos_renta: UpdateHabitacionInRentaInput;
}


export interface MutationActualizar_Habitacion_EstadoArgs {
  actualizar_habitacion_estado_input: UpdateEstadoHabitacionInput;
}


export interface MutationActualizar_Habitacion_HotelArgs {
  actualizar_habitacion_hotel_input: UpdateHabitacionHotelInput;
}


export interface MutationActualizar_Habitacion_TipoHabitacionArgs {
  actualizar_habitacion_tipoHabitacion_input: UpdateHabitacionTipoHabitacionInput;
}


export interface MutationActualizar_HistorialHabitacionArgs {
  datos_historialHabitacion: UpdateHistorialHabitacionDto;
}


export interface MutationActualizar_HotelArgs {
  datos_hotel: UpdateHotelInput;
}


export interface MutationActualizar_HuellaArgs {
  UpdateCredencialInput: UpdateCredencialInput;
}


export interface MutationActualizar_IncidenciaArgs {
  updateIncidenciaInput: UpdateIncidenciaInput;
}


export interface MutationActualizar_MantenimientoArgs {
  datos_mantenimiento: UpdateMantenimientoInput;
}


export interface MutationActualizar_MesaArgs {
  UpdateMesaInput: UpdateMesaInput;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationActualizar_Mesa_AsignadaArgs {
  UpdateMesaAsignadaInput: UpdateMesaAsignadaInput;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationActualizar_Metodo_De_PagoArgs {
  datos_metodos_de_pago: MetodoDePagoUpdateInput;
}


export interface MutationActualizar_Motivo_Ingreso_VehiculoArgs {
  datos_motivo_ingreso: UpdateMotivoIngresoVehiculoDto;
}


export interface MutationActualizar_OrdenArgs {
  UpdateOrdenInput: UpdateOrdenInput;
}


export interface MutationActualizar_PagoArgs {
  actualizar_pago_input: UpdatePagoInput;
}


export interface MutationActualizar_Posicion_HabitacionArgs {
  updatePosicionHabitacionRequest: UpdatePosicionHabitacionInput;
}


export interface MutationActualizar_Posicion_MesaArgs {
  updatePosicionMesaRequest: UpdatePosicionMesaInput;
}


export interface MutationActualizar_PuestoArgs {
  datos_puesto: UpdatePuestoInput;
}


export interface MutationActualizar_RecetaArgs {
  updateRecetaInput: UpdateRecetaInput;
}


export interface MutationActualizar_RentaArgs {
  datos_renta: UpdateRentaInput;
}


export interface MutationActualizar_ReservaArgs {
  actualizar_reserva_input: UpdateReservaInput;
}


export interface MutationActualizar_RolArgs {
  datos_rol: UpdateRolInput;
}


export interface MutationActualizar_Salida_InventarioArgs {
  updateSalidaInput: UpdateSalidaInput;
}


export interface MutationActualizar_ServicioArgs {
  datos_servicio: UpdateServicioInput;
}


export interface MutationActualizar_Subcategoria_ProductoArgs {
  datos_subcategoria: UpdateSubcategoriaProductoInput;
}


export interface MutationActualizar_SurtidoArgs {
  updateSurtidoInput: UpdateSurtidoInput;
}


export interface MutationActualizar_SuscripcionArgs {
  datos_suscripcion: UpdateSuscripcionInput;
}


export interface MutationActualizar_TareaArgs {
  datos_tarea: UpdateTareaInput;
}


export interface MutationActualizar_TarifaArgs {
  datos_tarifa: UpdateTarifaDto;
}


export interface MutationActualizar_Tipo_BloqueoArgs {
  datos_tipo_bloqueo: UpdateTipoBloqueoDto;
}


export interface MutationActualizar_Tipo_HabitacionArgs {
  datos_tipo_habitacion: UpdateTipoHabitacionDto;
}


export interface MutationActualizar_Tipo_LimpiezaArgs {
  updateTipoLimpiezaInput: UpdateTipoLimpiezaInput;
}


export interface MutationActualizar_Tipo_MantenimientoArgs {
  datos_tipo_mantenimiento: UpdateTipoMantenimientoDto;
}


export interface MutationActualizar_TurnoArgs {
  actualizar_turno_input: UpdateTurnoInput;
}


export interface MutationActualizar_Turno_AtencionArgs {
  actualizar_turno_atencion_input: UpdateTurnoAtencionInput;
}


export interface MutationActualizar_UsuarioArgs {
  datos_usuario: UpdateUsuarioInput;
}


export interface MutationActualizar_Varios_ArticulosArgs {
  datos_articulos: UpdateArticulosInput;
}


export interface MutationActulizar_Subcategoria_GastoArgs {
  subcategoria_gasto_data: UpdateSubcategoriaGastosInput;
}


export interface MutationAcumula_PuntosArgs {
  AcumulaPuntosInput: AcumulaPuntosInput;
}


export interface MutationAgregar_Colaborador_A_HotelArgs {
  datos_hotel_colaborador: AddColaboradorInHotelInput;
}


export interface MutationAgregar_ComentarioArgs {
  addComentarioInput: AddComentarioIncidenciaInput;
}


export interface MutationAgregar_Comentario_HabitacionArgs {
  agregar_comentario_habitacion_input: AddComentarioHabitacionInput;
}


export interface MutationAgregar_Comentario_RentaArgs {
  AddComentarioRentaInput: AddComentarioRentaInput;
}


export interface MutationAgregar_Comentario_ReservaArgs {
  AddComentarioReservaInput: AddComentarioReservaInput;
}


export interface MutationAgregar_Comentarios_A_TareaArgs {
  comentarios: AddCommentToTaskInput;
}


export interface MutationAgregar_Extras_ReservaArgs {
  add_extras_reserva_input: AddExtrasReservaInput;
}


export interface MutationAgregar_Horas_RentaArgs {
  AddHorasExtrasRentaInput: AddHorasExtrasRentaInput;
}


export interface MutationAgregar_Hospedajes_RentaArgs {
  AddHospedajesExtrasRentaInput: AddHospedajesExtrasRentaInput;
}


export interface MutationAgregar_Imagen_IncidenciaArgs {
  addImageInput: AddImageInput;
}


export interface MutationAgregar_Personas_RentaArgs {
  AddPersonasExtrasRentaInput: AddPersonasExtrasRentaInput;
}


export interface MutationAjustar_Asignacion_PropinaArgs {
  ajustarAsignacionPropinaInput: AjustarAsignacionPropinaInput;
}


export interface MutationAsignar_Habitacion_A_ReservaArgs {
  datos_reserva: AddRoomToBookingInput;
}


export interface MutationAutenticar_HuellaArgs {
  AuthenticateCredencialInput: AuthenticateCredencialInput;
}


export interface MutationAutorizar_FajillaArgs {
  autorizar_fajilla_input: AutorizarFajillaInput;
}


export interface MutationBloquear_HabitacionArgs {
  bloquear_habitacion_input: LockHabitacionInput;
  codigo?: InputMaybe<Scalars['String']['input']>;
  template_sample?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationBorrar_GastoArgs {
  datos_gasto: DeleteGastoInput;
}


export interface MutationBorrar_Historial_VehiculoArgs {
  historial_vehiculo_id: Scalars['ID']['input'];
}


export interface MutationCambiar_Habitacion_ReservaArgs {
  cambiar_habitacion_reserva_input: ChangeHabitacionReservaInput;
}


export interface MutationCambiar_Mesa_AsignadaArgs {
  CambiarMesaAsignadaInput: CambiarMesaAsignadaInput;
  codigo?: InputMaybe<Scalars['String']['input']>;
  template_sample?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCambiar_Tarea_Con_EstadoArgs {
  switch_task_with_room_state_input: SwitchTaskWithRoomStateInput;
}


export interface MutationCambiar_Tarea_Entre_ColaboradoresArgs {
  switch_task_btw_colab_input: SwitchTaskBtwColabInput;
}


export interface MutationCambiar_Tarea_HabitacionArgs {
  switch_task_room_input: SwitchTaskRoomInput;
}


export interface MutationCancelar_ComandaArgs {
  CancelComandaInput: CancelComandaInput;
}


export interface MutationCancelar_ExtraArgs {
  cancelar_extra_input: CancelExtraInput;
}


export interface MutationCancelar_Operaciones_RentaArgs {
  cancelar_renta_input: CancelOperationsRentaInput;
}


export interface MutationCancelar_OrdenArgs {
  cancel_orden_input: CancelOrdenInput;
}


export interface MutationCancelar_RentaArgs {
  cancelar_renta_input: CancelRentaInput;
  codigo?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCancelar_ReservaArgs {
  cancelar_reserva_input: CancelReservaInput;
  codigo?: InputMaybe<Scalars['String']['input']>;
  template_sample?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCerrar_CorteArgs {
  datos_corte: CloseCorteInput;
  hotel_id: Scalars['ID']['input'];
}


export interface MutationCerrar_Cuenta_Mesa_AsignadaArgs {
  cerrarCuentaMesaAsignadaInput: CloseBillMesaAsignadaInput;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCerrar_IncidenciaArgs {
  closeIncidenciaInput: CloseIncidenciaInput;
}


export interface MutationCerrar_Mesa_AsignadaArgs {
  closeMesaAsignadInput: CloseMesaAsignadInput;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCerrar_TurnoArgs {
  close_turno_input: CloseTurnoInput;
}


export interface MutationCerrar_Turno_ColaboradorArgs {
  turnOffColaboradorInput: TurnOffTurnoColaboradoresInput;
}


export interface MutationChangePasswordArgs {
  changePasswordInput: ChangePasswordInput;
}


export interface MutationCheckInArgs {
  ChekInInput: CheckInInput;
}


export interface MutationCrear_AlmacenArgs {
  createAlmacenInput: CreateAlmacenInput;
}


export interface MutationCrear_Almacen_ArticuloArgs {
  createAlmacenArticuloInput: CreateAlmacenArticuloInput;
}


export interface MutationCrear_AreaArgs {
  crear_area_input: CreateAreaInput;
}


export interface MutationCrear_ArticuloArgs {
  createArticuloInput: CreateArticuloInput;
}


export interface MutationCrear_Categoria_ArticuloArgs {
  datos_categoria: CreateCategoriaArticuloInput;
}


export interface MutationCrear_Categoria_GastoArgs {
  categoria_gasto_data: CreateCategoriasGastosInput;
}


export interface MutationCrear_ClienteArgs {
  datos_cliente: CreateClienteInput;
}


export interface MutationCrear_ColaboradorArgs {
  datos_colaborador: CreateColaboradorInput;
}


export interface MutationCrear_Colaborador_TareaArgs {
  datos_colaborador_tarea: CreateColaboradorTareaInput;
}


export interface MutationCrear_Colaborador_UsuarioArgs {
  datos_colaborador: CreateColaboradorUsuarioInput;
}


export interface MutationCrear_ComandaArgs {
  CreateComandaInput: CreateComandaInput;
}


export interface MutationCrear_Configuracion_FajillaArgs {
  crear_configuracion_fajilla_input: CreateConfiguracionFajillaInput;
}


export interface MutationCrear_Configuracion_InventarioArgs {
  create_configuracion_inventario: CreateConfiguracionInventarioInput;
}


export interface MutationCrear_Configuracion_PropinaArgs {
  CreateConfiguracionPropinaInput: CreateConfiguracionPropinaInput;
}


export interface MutationCrear_Configuraciones_CorteArgs {
  input: CreateConfiguracionesCorteInput;
}


export interface MutationCrear_Digest_KeyArgs {
  input: CreateDigestKeyInput;
}


export interface MutationCrear_ExtraArgs {
  crear_extra_input: CreateExtraInput;
}


export interface MutationCrear_FajillaArgs {
  crear_fajilla_input: CreateFajillaInput;
}


export interface MutationCrear_GastoArgs {
  datos_gastos: CreateGastoInput;
}


export interface MutationCrear_Grupo_HotelArgs {
  crear_grupo_hotel_input: CreateGrupoHotelInput;
}


export interface MutationCrear_HabitacionArgs {
  crear_habitacion_input: CreateHabitacionInput;
}


export interface MutationCrear_HotelArgs {
  datos_hotel: CreateHotelInput;
}


export interface MutationCrear_IncidenciaArgs {
  createIncidenciaInput: CreateIncidenciaInput;
}


export interface MutationCrear_MantenimientoArgs {
  datos_mantenimiento: CreateMantenimientoInput;
}


export interface MutationCrear_MesaArgs {
  CreateMesaInput: CreateMesaInput;
}


export interface MutationCrear_Mesa_AsignadaArgs {
  CreateMesaAsignadaInput: CreateMesaAsignadaInput;
}


export interface MutationCrear_Metodo_De_PagoArgs {
  datos_metodo_de_pago: MetodoDePagoInput;
}


export interface MutationCrear_Motivo_Ingreso_VehiculoArgs {
  datos_motivo_ingreso: CreateMotivoIngresoVehiculoDto;
}


export interface MutationCrear_OrdenArgs {
  create_orden_input: CreateOrdenInput;
  template_sample?: InputMaybe<Scalars['String']['input']>;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCrear_Orden_Parcial_LovepointsArgs {
  create_orden_input: CreateOrdenInput;
  template_sample?: InputMaybe<Scalars['String']['input']>;
  usuario_autorizo_id?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationCrear_Produccion_ProcesoArgs {
  createProductionProceso: CreateProductionProcesoInput;
}


export interface MutationCrear_PropinaArgs {
  CreatePropinaInput: CreatePropinaInput;
}


export interface MutationCrear_PuestoArgs {
  datos_puesto: CreatePuestoInput;
}


export interface MutationCrear_RecetaArgs {
  createRecetaInput: CreateRecetaInput;
}


export interface MutationCrear_RentaArgs {
  datos_renta: CreateRentaInput;
}


export interface MutationCrear_ReservaArgs {
  crear_reserva_input: CreateReservaInput;
}


export interface MutationCrear_RolArgs {
  datos_rol: CreateRolInput;
}


export interface MutationCrear_Salida_InventarioArgs {
  createSalidaInput: CreateSalidaInput;
}


export interface MutationCrear_ServicioArgs {
  datos_servicio: CreateServicioInput;
}


export interface MutationCrear_Subcategoria_GastoArgs {
  subcategoria_gasto_data: CreateSubcategoriasGastosInput;
}


export interface MutationCrear_Subcategoria_ProductoArgs {
  datos_subcategoria: CreateSubcategoriaProductoInput;
}


export interface MutationCrear_SurtidoArgs {
  createSurtidoInput: CreateSurtidoInput;
}


export interface MutationCrear_SurtidosArgs {
  createManySurtidosInput: CreateManySurtidosInput;
}


export interface MutationCrear_SuscripcionArgs {
  datos_suscripcion: CreateSuscripcionInput;
}


export interface MutationCrear_TareaArgs {
  datos_tarea: CreateTareaInput;
}


export interface MutationCrear_TarifaArgs {
  datos_tarifa: CreateTarifaDto;
}


export interface MutationCrear_Tipo_BloqueoArgs {
  datos_tipo_bloqueo: CreateTipoBloqueoDto;
}


export interface MutationCrear_Tipo_HabitacionArgs {
  datos_tipo_habitacion: CreateTipoHabitacionDto;
}


export interface MutationCrear_Tipo_MantenimientoArgs {
  datos_tipo_mantenimiento: CreateTipoMantenimientoDto;
}


export interface MutationCrear_TurnoArgs {
  crear_turno_input: CreateTurnoInput;
}


export interface MutationCrear_Turno_AtencionArgs {
  crear_turno_atencion_input: CreateTurnoAtencionInput;
}


export interface MutationCrear_UsuarioArgs {
  datos_usuario: CreateUsuarioInput;
}


export interface MutationCreatePagoRentaArgs {
  pago_renta_data: CreatePagoRentaInput;
}


export interface MutationCreatePagosReservasArgs {
  pagos_reserva_data: CreatePagoReservaInput;
}


export interface MutationCreate_Api_KeyArgs {
  createApiKeyInput: CreateApiKeyInput;
}


export interface MutationDeleteApiKeyArgs {
  deleteApiKeyInput: DeleteApiKeyInput;
}


export interface MutationDescuenta_PuntosArgs {
  DescuentaPuntosInput: DescuentaPuntosInput;
}


export interface MutationDevolucion_OrdenArgs {
  refund_orden_input: RefundOrdenInput;
}


export interface MutationEditar_ColaboradorArgs {
  datos_colaborador: UpdateColaboradorInput;
}


export interface MutationEditar_ComandaArgs {
  editComandaInput: EditComandaInput;
}


export interface MutationEditar_Configuraciones_CorteArgs {
  input: EditConfiguracionesCorteInput;
}


export interface MutationEditar_Datos_VehiculoArgs {
  EditVehiculoDataInput: EditVehiculoDataInput;
}


export interface MutationEditar_Historial_VehiculoArgs {
  input: UpdateHistorialVehiculoInput;
}


export interface MutationEditar_Metodo_PagoArgs {
  editMetodoPagoTicketInput: EditMetodoPagoTicketInput;
}


export interface MutationEditar_OrdenArgs {
  EditOrdenInput: EditOrdenInput;
}


export interface MutationEliminar_AlmacenArgs {
  deleteAlmacenInput: DeleteAlmacenInput;
}


export interface MutationEliminar_Almacen_ArticuloArgs {
  deleteAlmacenArticuloInput: DeleteAlmacenesArticulosInput;
}


export interface MutationEliminar_AreaArgs {
  eliminar_area_input: DeleteAreaInput;
}


export interface MutationEliminar_ArticuloArgs {
  deleteArticuloInput: DeleteArticuloInput;
}


export interface MutationEliminar_Categoria_ArticuloArgs {
  datos_categoria: DeleteCategoriaArticuloInput;
}


export interface MutationEliminar_Categoria_GastoArgs {
  categoria_gasto_data: DeleteCategoriaGastosInput;
}


export interface MutationEliminar_ClienteArgs {
  cliente: DeleteClienteInput;
}


export interface MutationEliminar_ColaboradorArgs {
  colaborador: DeleteColaboradorInput;
}


export interface MutationEliminar_Colaborador_De_HotelArgs {
  datos_hotel_colaborador: RemoveColaboradorFromHotelInput;
}


export interface MutationEliminar_Colaborador_TareaArgs {
  colaborador_tarea: DeleteColaboradorTareaInput;
}


export interface MutationEliminar_ComandaArgs {
  DeleteComandaInput: DeleteComandaInput;
}


export interface MutationEliminar_Comentario_HabitacionArgs {
  eliminar_comentario_habitacion_input: DeleteComentarioHabitacionInput;
}


export interface MutationEliminar_Configuracion_FajillaArgs {
  delete_configuracion_fajilla_input: DeleteConfiguracionFajillaInput;
}


export interface MutationEliminar_HabitacionArgs {
  eliminar_habitacion_input: DeleteHabitacionInput;
}


export interface MutationEliminar_HotelArgs {
  hotel: DeleteHotelInput;
}


export interface MutationEliminar_HuellaArgs {
  DeleteCredencialInput: DeleteCredencialInput;
}


export interface MutationEliminar_Huella_PinArgs {
  deleteCredentialhuellaPinInput: DeleteCredentialHuellaPinInput;
}


export interface MutationEliminar_Imagen_IncidenciaArgs {
  deleteImageInput: DeleteImageInput;
}


export interface MutationEliminar_MantenimientoArgs {
  mantenimiento: DeleteMantenimientoInput;
}


export interface MutationEliminar_MesaArgs {
  DeleteMesaInput: DeleteMesaInput;
}


export interface MutationEliminar_Metodo_De_PagoArgs {
  metodo_de_pago: DeleteMetodoDePagoInput;
}


export interface MutationEliminar_Motivo_Ingreso_VehiculoArgs {
  motivo_ingreso: DeleteMotivoIngresoVehiculoArgs;
}


export interface MutationEliminar_PropinaArgs {
  DeletePropinaInput: DeletePropinaInput;
  codigo?: InputMaybe<Scalars['String']['input']>;
  template_sample?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationEliminar_PuestoArgs {
  puesto: DeletePuestoInput;
}


export interface MutationEliminar_RecetaArgs {
  deleteRecetaInput: DeleteRecetaInput;
}


export interface MutationEliminar_RolArgs {
  rol: DeleteRolInput;
}


export interface MutationEliminar_Salida_InventarioArgs {
  deleteSalidaInput: DeleteSalidaInput;
}


export interface MutationEliminar_ServicioArgs {
  datos_servicio: DeleteServicioInput;
}


export interface MutationEliminar_Subcategoria_GastoArgs {
  subcategoria_gasto_data: DeleteSubcategoriaGastoInput;
}


export interface MutationEliminar_Subcategoria_ProductoArgs {
  datos_subcategoria: DeleteSubcategoriaProductoInput;
}


export interface MutationEliminar_SuscripcionArgs {
  suscripcion: DeleteSuscripcionInput;
}


export interface MutationEliminar_TareaArgs {
  tarea: DeleteTareaInput;
}


export interface MutationEliminar_TarifaArgs {
  tarifaO: DeleteTarifaDto;
}


export interface MutationEliminar_Tipo_BloqueoArgs {
  tipo_bloqueo: DeleteTipoBloqueoArgs;
}


export interface MutationEliminar_Tipo_HabitacionArgs {
  tipo_habitacion: DeleteTipoHabitacionArgs;
}


export interface MutationEliminar_Tipo_MantenimientoArgs {
  tipo_mantenimiento: DeleteTipoMantenimientoArgs;
}


export interface MutationEliminar_TurnoArgs {
  eliminar_turno_input: DeleteTurnoInput;
}


export interface MutationEliminar_Turno_AtencionArgs {
  eliminar_turno_atencion_input: DeleteTurnoAtencionInput;
}


export interface MutationEliminar_UsuarioArgs {
  usuario: DeleteUsuarioInput;
}


export interface MutationLiberar_HabitacionArgs {
  codigo?: InputMaybe<Scalars['String']['input']>;
  liberar_habitacion_input: ReleaseHabitacionInput;
  template_sample?: InputMaybe<Scalars['String']['input']>;
}


export interface MutationLoginArgs {
  loginInput: AuthLoginInput;
}


export interface MutationLogin_GoogleArgs {
  loginGoogleInput: LoginGoogleInput;
}


export interface MutationLogin_HuellaArgs {
  FingerPrintLoginInput: FingerPrintLoginInput;
}


export interface MutationLogoutArgs {
  cerrar_turno?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['String']['input']>;
  sesion_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface MutationMarcar_Como_LeidaArgs {
  bandeja_notificaciones_id: Scalars['String']['input'];
}


export interface MutationModificar_Esquema_PropinasArgs {
  propinas_esquema: UpdatePropinasEsquemaInput;
}


export interface MutationObtener_Usuario_GoogleArgs {
  getGoogleUserInput: GetGoogleUserInput;
}


export interface MutationPagar_ExtraArgs {
  pago_extra_detalles: PayPagoExtraInput;
}


export interface MutationPagar_Ordenes_PendientesArgs {
  PayOrdenInput: PayRentaInput;
}


export interface MutationPagar_PropinasArgs {
  pagos_propinas: CreateManyPagosPropinasInput;
}


export interface MutationPagar_Propinas_VentasArgs {
  payPropinasVentasInput: PayPropinasVentasInput;
}


export interface MutationPagar_RentaArgs {
  PayRentaInput: PayRentaInput;
}


export interface MutationPagar_ReservaArgs {
  datos_reserva: PayReservaInput;
}


export interface MutationPendiente_Autorizar_FajillaArgs {
  pendiente_autorizar_fajilla_input: PendienteAutorizarInput;
}


export interface MutationReabrir_IncidenciaArgs {
  datos_incidencia: OpenIncidenciaInput;
}


export interface MutationRechazar_FajillaArgs {
  rechazar_fajilla_input: RechazarFajillaInput;
}


export interface MutationRegistrar_Evento_LoginArgs {
  input: TraceStartHistorialLoginInput;
}


export interface MutationRegistrar_HuellaArgs {
  CreateCredencialInput: CreateCredencialInput;
}


export interface MutationRegistrar_Usuario_DispositivoArgs {
  registerUsuarioDispositivoInput: RegisterUsuarioDispositivoInput;
}


export interface MutationReiniciar_Asignaciones_PropinasArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface MutationRemover_Puesto_Esquema_PropinasArgs {
  puesto_id: Scalars['String']['input'];
}


export interface MutationRemover_Reserva_De_HabitacionArgs {
  remover_reserva_de_habitacion_input: RemoveBookingFromRoomInput;
}


export interface MutationSendChangePasswordViaEmailArgs {
  sendChangePasswordViaEmailInput: SendChangePasswordViaEmailInput;
}


export interface MutationSendNotificationCaratulaMensualArgs {
  sendNotificationCaratulaMensualInput: SendNotificationInput;
}


export interface MutationTransferir_ArticulosArgs {
  transferArticulosInput: TransferArticulosInput;
}


export interface MutationUpdateApiKeyArgs {
  updateApiKeyInput: UpdateApiKeyInput;
}


export interface MutationUpdatePagoRentaArgs {
  pago_renta_data: UpdatePagoRentaInput;
}


export interface MutationUpdatePagosReservasArgs {
  pagos_reserva_data: UpdatePagoReservasInput;
}


export interface MutationValidar_Codigo_Huella_AutorizacionArgs {
  codigo?: InputMaybe<Scalars['String']['input']>;
  huella?: InputMaybe<Scalars['String']['input']>;
}

export interface NombreArticuloFilterArgs {
  like?: InputMaybe<Scalars['String']['input']>;
  /** Ordena los resultados de forma ASC o DESC en base al nombre del articulo */
  order?: InputMaybe<TipoOrdenamiento>;
}

export interface NombreColaboradorFilterArgs {
  like?: InputMaybe<Scalars['String']['input']>;
  /** Ordena los resultados de forma ASC o DESC en base al nombre del colaborador */
  order?: InputMaybe<TipoOrdenamiento>;
}

export interface Notificacion {
  __typename?: 'Notificacion';
  hotel_id: Scalars['ID']['output'];
  mensaje_plantilla: MensajePlantilla;
  mensaje_plantilla_push_notification: MensajePlantillaPushNotification;
  notificacion_id: Scalars['ID']['output'];
  tipo: TipoNotificacion;
  topic: Scalars['String']['output'];
}

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export interface ObtenSaldoOutput {
  __typename?: 'ObtenSaldoOutput';
  saldo?: Maybe<Scalars['Float']['output']>;
}

export interface OpenIncidenciaInput {
  incidencia_id: Scalars['ID']['input'];
}

export interface OpenTurnoInput {
  hotel_id: Scalars['ID']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface Orden {
  __typename?: 'Orden';
  articulos?: Maybe<Array<ArticulosResponse>>;
  /** Colaborador que hizo el consumo interno */
  colaborador_consumo_interno?: Maybe<Colaborador>;
  /** Colaborador que hizo la entrega de la orden de room-service */
  colaborador_entrega?: Maybe<Colaborador>;
  /** ID del colaborador que hizo la entrega de la orden de room-service */
  colaborador_id?: Maybe<Scalars['ID']['output']>;
  /** Comanda asociada a la orden */
  comanda?: Maybe<Comanda>;
  /** Comandas asociadas a la orden */
  comandas?: Maybe<Array<Comanda>>;
  comentario?: Maybe<Scalars['String']['output']>;
  /** ID del colaborador asociado al consumo interno */
  consumo_interno_colaborador_id?: Maybe<Scalars['ID']['output']>;
  corte_id?: Maybe<Scalars['ID']['output']>;
  /** Devuelve `true` si se trata de una orden con estado_pago `deposito` */
  deposito?: Maybe<Scalars['Boolean']['output']>;
  /** Retorna los detalles del pago pre-cargado al comprar el articulo con modalidad de pago Deposito en garantia */
  detalle_pago_pre_cargado?: Maybe<Array<DetallePagoPreCargadoOutput>>;
  detalles_orden?: Maybe<Array<DetalleOrden>>;
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  estado_orden?: Maybe<EstadosOrdenHistorial>;
  estado_pago: EstadoPagoOrdenes;
  fecha_cobro?: Maybe<Scalars['DateTime']['output']>;
  fecha_modificacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  /** Mesa asociada a la orden */
  mesa?: Maybe<Mesa>;
  monto_iva: Scalars['Float']['output'];
  orden: Scalars['String']['output'];
  orden_id: Scalars['ID']['output'];
  /** Modulo donde se creo la orden (room-service, mostrador o restaurante) */
  origen_orden?: Maybe<Scalars['String']['output']>;
  pago?: Maybe<Pago>;
  pago_id?: Maybe<Scalars['ID']['output']>;
  /** Retorna todos los pagos de la orden(totales y parciales) */
  pagos: Array<Pago>;
  /** Bandera que indica si la orden sera o no mostrada en el panel de cocina */
  panel_no_visible: Scalars['Boolean']['output'];
  /** Es la propina recibida y asociada a la orden en caso de que la hubo */
  propina?: Maybe<Propina>;
  renta?: Maybe<Renta>;
  renta_id?: Maybe<Scalars['ID']['output']>;
  saldo_pendiente?: Maybe<Scalars['Float']['output']>;
  total_con_iva: Scalars['Float']['output'];
  total_productos: Scalars['Int']['output'];
  total_sin_iva: Scalars['Float']['output'];
  /** Turno en el que se registro la orden */
  turno?: Maybe<Turno>;
  turno_id?: Maybe<Scalars['ID']['output']>;
  usuario: Usuario;
  usuario_id: Scalars['ID']['output'];
  /** Propiedad calculada para obtener la relación con la comanda */
  virtual_comanda_id?: Maybe<Scalars['ID']['output']>;
}


export interface OrdenDetalles_OrdenArgs {
  estado?: InputMaybe<Array<EstadosDetalleOrden>>;
  filter_articulos_categoria_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface OrdenSubDetail {
  __typename?: 'OrdenSubDetail';
  accion: OrdenesPanelAction;
  orden: Orden;
  tipo: TipoOrdenPanelCocina;
}

export enum OrdenesPanelAction {
  Actualizar = 'actualizar',
  Agregar = 'agregar',
  Cancelar = 'cancelar',
  Editar = 'editar',
  Remover = 'remover'
}

export enum Origen {
  Email = 'email',
  Google = 'google'
}

export enum OrigenOrden {
  Deposito = 'deposito',
  ExtrasRenta = 'extras_renta',
  ExtrasReserva = 'extras_reserva',
  Renta = 'renta',
  Reserva = 'reserva',
  Restaurante = 'restaurante',
  RoomService = 'room_service'
}

export enum OrigenRservas {
  Bestday = 'bestday',
  Booking = 'booking',
  Checkfront = 'checkfront',
  Despegar = 'despegar',
  Email = 'email',
  Expedia = 'expedia',
  Hotels = 'hotels',
  Hotwire = 'hotwire',
  Kayak = 'kayak',
  Otros = 'otros',
  Priceline = 'priceline',
  Recepcion = 'recepcion',
  Telefono = 'telefono',
  Tripadvisor = 'tripadvisor',
  Trivago = 'trivago'
}

export interface OrigenTicket {
  __typename?: 'OrigenTicket';
  /** Datos de los extras asociados al ticket de compra/pago */
  extras?: Maybe<Array<Extra>>;
  id: Scalars['String']['output'];
  origen: OrigenesTicket;
  /** Datos de la renta asociada al ticket de compra/pago */
  renta?: Maybe<Renta>;
}

export enum OrigenesFajillas {
  Manual = 'manual',
  MaquinaEfectivo = 'maquina_efectivo'
}

export enum OrigenesOrden {
  Mostrador = 'mostrador',
  Restaurante = 'restaurante',
  RoomService = 'room_service'
}

export enum OrigenesTicket {
  ExtraRenta = 'extra_renta',
  ExtraReserva = 'extra_reserva',
  Gasto = 'gasto',
  Propina = 'propina',
  Renta = 'renta',
  Reserva = 'reserva',
  Restaurante = 'restaurante',
  RoomService = 'room_service'
}

export interface PageMetaDto {
  __typename?: 'PageMetaDto';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  itemCount: Scalars['Int']['output'];
  page: Scalars['Int']['output'];
  pageCount: Scalars['Int']['output'];
  take: Scalars['Int']['output'];
}

export interface PageOptionsArgs {
  order?: InputMaybe<Order>;
  page?: Scalars['Int']['input'];
  take?: Scalars['Int']['input'];
}

export interface PaginatedSearchOrdenesOutput {
  __typename?: 'PaginatedSearchOrdenesOutput';
  conteos: ConteosOrdenesDetailsOutput;
  ordenes: Array<Orden>;
  paginacion: DatosPaginationOutput;
}

export interface PaginationColaboradoresTareaDto {
  __typename?: 'PaginationColaboradoresTareaDto';
  colaboradores_tarea: Array<ColaboradorTarea>;
  pageMetaDto: PageMetaDto;
}

export interface Pago {
  __typename?: 'Pago';
  detalles_pago?: Maybe<Array<DetallePago>>;
  extras?: Maybe<Array<Extra>>;
  fecha_pago: Scalars['DateTime']['output'];
  hotel?: Maybe<Hotel>;
  hotel_id: Scalars['ID']['output'];
  pago_id: Scalars['ID']['output'];
  rentas?: Maybe<Array<Renta>>;
  reservas?: Maybe<Array<Reserva>>;
  ticket_id?: Maybe<Scalars['ID']['output']>;
  total: Scalars['Float']['output'];
  usuario?: Maybe<Usuario>;
  usuario_id: Scalars['ID']['output'];
}

export interface PagoExtra {
  __typename?: 'PagoExtra';
  extra_id: Scalars['ID']['output'];
  pago_extra_id: Scalars['ID']['output'];
  pago_id: Scalars['ID']['output'];
}

export interface PagoPropina {
  __typename?: 'PagoPropina';
  /** Retorna los datos de la propina asignada por reparticion de aportaciones de propinas */
  asignacion_propina?: Maybe<AsignacionPropina>;
  asignacion_propina_id: Scalars['ID']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  hotel_id: Scalars['ID']['output'];
  pago_propina_id: Scalars['ID']['output'];
  periodo_pago: Scalars['String']['output'];
  /** Personal que recibió el pago de propina */
  personal?: Maybe<Colaborador>;
}

export interface PagoPropinaItemInput {
  asignacion_propina_id: Scalars['ID']['input'];
  colaborador_id: Scalars['ID']['input'];
  comision_bancaria_propina_por_venta: Scalars['Float']['input'];
  comision_bancaria_sobre_fondo: Scalars['Float']['input'];
  monto_pagado: Scalars['Float']['input'];
}

export interface PagosRentas {
  __typename?: 'PagosRentas';
  pago_id: Scalars['ID']['output'];
  pago_renta_id: Scalars['ID']['output'];
  renta?: Maybe<Renta>;
  renta_id: Scalars['ID']['output'];
}

export interface PagosReservas {
  __typename?: 'PagosReservas';
  pago_id: Scalars['ID']['output'];
  pago_reserva_id: Scalars['ID']['output'];
  reserva?: Maybe<Reserva>;
  reserva_id: Scalars['ID']['output'];
}

export interface Panel {
  __typename?: 'Panel';
  banner?: Maybe<Scalars['String']['output']>;
  imagen_promo?: Maybe<Array<Scalars['String']['output']>>;
}

export interface PanelInput {
  banner?: InputMaybe<Scalars['String']['input']>;
  imagen_promo?: InputMaybe<Array<Scalars['String']['input']>>;
}

export interface PartialInfoCheckoutResponseOutput {
  __typename?: 'PartialInfoCheckoutResponseOutput';
  habitacion?: Maybe<Habitacion>;
  ticket_id?: Maybe<Array<Scalars['String']['output']>>;
}

export interface PartialInfoExtraDetalleOrdenInput {
  almacen_articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  costo_con_iva: Scalars['Float']['input'];
  costo_sin_iva: Scalars['Float']['input'];
  extra_detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  monto_iva: Scalars['Float']['input'];
}

export interface PayPagoExtraInput {
  detallesPago: Array<DetallePagoPartialInfoObject>;
  extra_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  total: Scalars['Float']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface PayPropinasVentasInput {
  hotel_id: Scalars['ID']['input'];
}

export interface PayPropinasVentasOutput {
  __typename?: 'PayPropinasVentasOutput';
  reporte_propina_venta_id?: Maybe<Scalars['ID']['output']>;
}

export interface PayRentaInput {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  extra_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  mesa_id?: InputMaybe<Scalars['ID']['input']>;
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  pago: CreatePagoInput;
  propina?: InputMaybe<CreatePropinaPartialInput>;
  renta_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id: Scalars['ID']['input'];
}

export interface PayReservaInput {
  pago: CreatePagoInput;
  reserva_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface PendienteAutorizarInput {
  fajilla_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface Posicion {
  __typename?: 'Posicion';
  tamano: Tamano;
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
}

export interface PosicionInput {
  tamano: Tamano;
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
}

export interface PosicionMesa {
  __typename?: 'PosicionMesa';
  tamano: TamanoMesa;
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
}

export interface PosicionMesaInput {
  tamano: TamanoMesa;
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
}

export interface Precio {
  __typename?: 'Precio';
  activo: Scalars['Boolean']['output'];
  almacen_articulo_id: Scalars['ID']['output'];
  fecha_fin?: Maybe<Scalars['DateTime']['output']>;
  fecha_inicio?: Maybe<Scalars['DateTime']['output']>;
  monto: Scalars['Float']['output'];
  precio_id: Scalars['ID']['output'];
}

export enum ProcedenciaPropina {
  ExtraRenta = 'extra_renta',
  Otro = 'otro',
  Renta = 'renta',
  Reserva = 'reserva',
  Restaurante = 'restaurante',
  Roomservice = 'roomservice'
}

export interface Propina {
  __typename?: 'Propina';
  /** Información del colaborador que recibió la propina */
  colaborador?: Maybe<Colaborador>;
  colaborador_id: Scalars['ID']['output'];
  comentarios?: Maybe<Scalars['String']['output']>;
  corte_id?: Maybe<Scalars['ID']['output']>;
  detalles_pago: Array<DetallesPagoPartialInfoOutput>;
  eliminado: Scalars['Boolean']['output'];
  /** Estado del pago de la propina */
  estado?: Maybe<Scalars['String']['output']>;
  fecha_eliminado?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Float']['output'];
  /** Información de la habitacion asociada al pago de la propina en renta, reserva u orden */
  habitacion?: Maybe<Habitacion>;
  hotel_id: Scalars['ID']['output'];
  /** Información de la mesa asociada al pago de la propina en restaurante */
  mesa?: Maybe<Mesa>;
  procedencia: ProcedenciaPropina;
  procedencia_id?: Maybe<Scalars['ID']['output']>;
  propina_id: Scalars['ID']['output'];
  ticket_id?: Maybe<Scalars['ID']['output']>;
  total: Scalars['Float']['output'];
  /** Información del turno en el que fue registrada la propina */
  turno?: Maybe<Turno>;
  turno_id: Scalars['ID']['output'];
}

export interface PropinaEsquemaItemInput {
  porcentaje_propina: Scalars['Float']['input'];
  puesto_id: Scalars['ID']['input'];
}

export interface PropinaRecolectadaColaboradorDetailOutput {
  __typename?: 'PropinaRecolectadaColaboradorDetailOutput';
  categoria: Scalars['String']['output'];
  monto: Scalars['String']['output'];
}

export interface PropinasDetalleTicket {
  __typename?: 'PropinasDetalleTicket';
  numero_referencia?: Maybe<Scalars['String']['output']>;
  procedencia: ProcedenciaPropina;
  tipo_pago: TiposPagos;
  total: Scalars['Float']['output'];
  ultimos_digitos?: Maybe<Scalars['String']['output']>;
}

export interface Puesto {
  __typename?: 'Puesto';
  /** Devuelve la primer area asociada al puesto */
  area?: Maybe<Area>;
  areas?: Maybe<Array<Area>>;
  /** Descripción del puesto */
  descripcion: Scalars['String']['output'];
  /** Indica si el puesto está eliminado */
  eliminado: Scalars['Boolean']['output'];
  /** Estado del puesto */
  estado?: Maybe<Scalars['String']['output']>;
  /** Nombre del puesto */
  nombre: Scalars['String']['output'];
  /** Porcentaje que le corresponde del total de propinas recaudadas */
  porcentaje_propina: Scalars['Float']['output'];
  /** Puesto id */
  puesto_id: Scalars['ID']['output'];
}

export enum PuestoRol {
  Administrador = 'administrador',
  Colaborador = 'colaborador',
  Otro = 'otro',
  SocioODuenoDeHotel = 'socio_o_dueno_de_hotel'
}

export interface Query {
  __typename?: 'Query';
  /** Retorna conteos sobre la tabla de almacenes-articulos. Ej. total_procesos, total_recetas_alimentos, etc. */
  agregaciones_almacenes_articulos?: Maybe<GetAggregationsAlmacenesArticulosOutput>;
  /** Indica si hay alertas activas por pagos pendientes, placas pendientes o energeticos pendientes en el cierre de corte */
  alertas_corte: AlertasCorteOutput;
  almacen: Almacen;
  almacen_articulo: AlmacenArticulo;
  almacenes: Array<Almacen>;
  almacenes_articulos: SearchAlmacenesArticulosOutput;
  area: Area;
  areas: Array<Area>;
  areasPuestos: Array<AreasPuestos>;
  articulo: Articulo;
  articulos: Array<Articulo>;
  asistencia: Asistencia;
  asistencias: Array<Asistencia>;
  /** Retorna los valores de la repartición de propinas correspondientes a cada colaborador por corte */
  calcular_reparto_propinas: RepartoPropinasOutput;
  categoria_articulo: CategoriaArticulo;
  categoria_gasto: CategoriaGasto;
  categorias_articulos: Array<CategoriaArticulo>;
  categorias_gasto: Array<CategoriaGasto>;
  cliente: Cliente;
  clientes: Array<Cliente>;
  colaborador: Colaborador;
  colaborador_tarea: ColaboradorTarea;
  colaboradores: Array<Colaborador>;
  colaboradores_by_area: FindAllPaginatedOutput;
  colaboradores_disponibles_por_puesto?: Maybe<Array<Colaborador>>;
  colaboradores_disponibles_por_puestos: Array<Colaborador>;
  colaboradores_por_id: Array<Colaborador>;
  colaboradores_tareas?: Maybe<Array<ColaboradorTarea>>;
  comanda: Comanda;
  comandas: Array<Comanda>;
  configuracion_fajilla: ConfiguracionFajilla;
  configuracion_propina: ConfiguracionPropina;
  /** Configuraciones para acciones durante el cierre de corte de turno en el hotel */
  configuraciones_corte: Array<ConfiguracionCorte>;
  configuraciones_fajilla: Array<ConfiguracionFajilla>;
  configuraciones_inventario: Array<ConfiguracionInventario>;
  configuraciones_propina: Array<ConfiguracionPropina>;
  /** Retorna el detalle de reparto de propinas del turno para perfiles de venta en base al ID */
  consultar_reporte_propinas?: Maybe<GetReportePropinasOutput>;
  corte: Corte;
  cortes: Array<Corte>;
  cortes_agrupados: Array<GroupCortes>;
  cortes_por_anio: Array<CortesSummaryByMonthResponse>;
  detalle_orden: DetalleOrden;
  detalle_pago: DetallePago;
  /** Retorna el desglose a detalle de la repartición de propinas */
  detalle_reparto_propinas?: Maybe<DetalleRepartoPropinasOutput>;
  detalles_orden: Array<DetalleOrden>;
  detalles_pago: Array<DetallePago>;
  /** Verifica si hay alertas por habitaciones disponibles vs reservas del dia por tipo de habitación y por turnos de atencion en espera */
  disponibilidad_habitacion: RoomAvailabilityOutput;
  /** Información de los tipos de habitaciones existentes y su disponibilidad en el hotel */
  disponibilidad_habitaciones?: Maybe<Array<TipoHabitacionPartialDetail>>;
  existe_hotel: Scalars['Boolean']['output'];
  existe_metodo_de_pago: Scalars['Boolean']['output'];
  existe_usuario: Scalars['Boolean']['output'];
  experiencias: Array<Experiencia>;
  extra: Extra;
  extras: Array<Extra>;
  fajilla: Fajilla;
  fajillas: Array<Fajilla>;
  findAllPagoRenta: Array<PagosRentas>;
  findAllPagosReservas: Array<PagosReservas>;
  findOnePagosReservasByIdInput: PagosReservas;
  funcionalidad: Funcionalidad;
  funcionalidades: Array<Funcionalidad>;
  gasto: Gastos;
  gastos: Array<Gastos>;
  gastos_categoria_por_mes?: Maybe<Array<BillingPerMonthGroupedByCategoryOutput>>;
  gastos_categoria_por_meses?: Maybe<Array<BillingPerMonthGroupedByCategoryWithMonthOutput>>;
  gastos_por_mes?: Maybe<BillingPerMonthOutput>;
  generar_pin: Scalars['String']['output'];
  /** Obtiene los datos del vehículo por placa */
  getVehiculoDataByPlaca?: Maybe<GetVehiculoDataByPlacaOutput>;
  grupo_hotel: GrupoHotel;
  grupos_hoteles: Array<GrupoHotel>;
  habitacion: Habitacion;
  habitacion_mas_vendida?: Maybe<Habitacion>;
  habitacion_top_rentas_del_dia?: Maybe<TopRentalRoom>;
  habitacion_top_reservas_del_dia: TopBookingRoom;
  habitaciones: Array<Habitacion>;
  habitaciones_mesas: HabitacionesMesasOutput;
  /** Retorna el historial de estados de las comandas y los intervalos de tiempo por estado */
  historial_estados_comanda: SearchHistorialEstadosComandaOutput;
  /** Retorna el historial de estados de las ordenes y los intervalos de tiempo por estado */
  historial_estados_orden: SearchHistorialEstadosOrdenOutput;
  historial_habitacion: HistorialHabitacion;
  historial_habitaciones: Array<HistorialHabitacion>;
  historial_movimiento_inventario: HistorialMovimientosInventario;
  historial_movimientos_inventario: FindAllHistorialMovimientosInventarioOutput;
  /** Retorna 1 registro del historial de producciones del inventario en base a su ID */
  historial_produccion_inventario?: Maybe<HistorialProduccionInventario>;
  /** Retorna el historial de producciones del inventario, tanto de forma general como con filtros */
  historial_producciones_inventarios?: Maybe<Array<HistorialProduccionInventario>>;
  hotel: Hotel;
  hotel_colaborador?: Maybe<HotelColaborador>;
  hotel_colaboradores?: Maybe<Array<HotelColaborador>>;
  hoteles: Array<Hotel>;
  incidencia: Incidencia;
  incidencias: Array<Incidencia>;
  informe_historial_movimientos_inventario: GetInformeHistorialMovimientosInventarioOutput;
  informe_inventario?: Maybe<GetInformeInventarioOutput>;
  ingredientes_recetas: Array<IngredienteReceta>;
  /** Retorna los KPIs de producción de un articulo en base a su ID */
  kpis_historial_producciones_inventarios?: Maybe<GetKpisHistorialProduccionesInventarioByArticuloIdOutput>;
  /** Obtiene los KPIs de mantenimientos (agua, luz, gas, incidencias pendientes y cerradas) para un hotel en un rango de fechas */
  kpis_mantenimientos: GetKpisMantenimientoOutput;
  mantenimiento: Mantenimiento;
  mantenimientos: Array<Mantenimiento>;
  mesa: Mesa;
  mesa_asignada: MesaAsignada;
  mesas: Array<Mesa>;
  mesas_asignadas: Array<MesaAsignada>;
  metodo_de_pago: MetodoDePago;
  metodos_de_pago: Array<MetodoDePago>;
  mi_perfil: Usuario;
  modulo: Modulo;
  modulos: Array<Modulo>;
  motivo_ingreso_vehiculo: MotivoIngresoVehiculo;
  motivos_ingreso_vehiculos: Array<MotivoIngresoVehiculo>;
  movimientos_antes_corte: GetMovementsCountBeforeCorteOutput;
  notificaciones: Array<Notificacion>;
  /** Devolver booleano si hay notificaciones no leidas */
  notificaciones_no_leidas_alerta?: Maybe<Scalars['Boolean']['output']>;
  obten_saldo: ObtenSaldoOutput;
  /** Obtener bandeja de incidencias */
  obtener_bandeja_incidencias?: Maybe<Array<BandejaNotificaciones>>;
  /** Obtener bandeja de notificaciones */
  obtener_bandeja_notificaciones?: Maybe<Array<BandejaNotificaciones>>;
  obtener_ordenes_no_pagadas: Array<Orden>;
  obtener_porcentaje_promedio_ocupacion: Scalars['Float']['output'];
  obtener_ventas: Array<SalesTicketsByTurno>;
  obtener_ventas_extras: TodayExtrasSales;
  obtener_ventas_ordenes: TodayOrdenesSales;
  obtener_ventas_rentas: GetTodayRentalSales;
  obtener_ventas_reservas?: Maybe<TodayReservasSales>;
  orden: Orden;
  ordenes: Array<Orden>;
  /** Devuelve la lista de ordenes con datos de paginacion incluidos */
  ordenes_paginadas: PaginatedSearchOrdenesOutput;
  paginacion_colaboradores_tarea?: Maybe<PaginationColaboradoresTareaDto>;
  pagos: Array<Pago>;
  /** Historial de pagos de propinas por colaborador */
  pagos_propinas: Array<PagoPropina>;
  /** Retorna las entradas de placas que faltan por completar para el hotel */
  placas_pendientes: Array<HistorialVehiculo>;
  propinas: Array<Propina>;
  puesto: Puesto;
  puestos: Array<Puesto>;
  puestos_de_hotel: Array<HotelColaborador>;
  receta: Receta;
  recetas: Array<Receta>;
  renta: Renta;
  rentas: Array<Renta>;
  /** Retorna el detalle de reparto de propinas del turno para perfiles de venta con los datos actuales */
  reporte_propinas?: Maybe<GetReportePropinasOutput>;
  reserva: Reserva;
  reservas: Array<Reserva>;
  reservas_sin_asignar_del_dia: Array<Reserva>;
  rol: Rol;
  roles: Array<Rol>;
  salida_inventario: Salida;
  salidas_inventario: SearchSalidasOutput;
  /** Fecha actual del servidor (UTC) */
  serverDate: Scalars['DateTime']['output'];
  servicio: Servicio;
  servicios: Array<Servicio>;
  subcategoria_gasto: SubcategoriaGasto;
  subcategoria_producto: SubcategoriaProducto;
  subcategorias_gasto: Array<SubcategoriaGasto>;
  subcategorias_productos: Array<SubcategoriaProducto>;
  surtido: Surtido;
  surtidos: Array<Surtido>;
  suscripcion: Suscripcion;
  suscripciones: Array<Suscripcion>;
  tarea: Tarea;
  tareas: Array<Tarea>;
  tarifa: Tarifa;
  tarifas: Array<Tarifa>;
  ticket: Ticket;
  tickets: Array<Ticket>;
  tipo_bloqueo: TipoBloqueo;
  tipo_habitacion: TipoHabitacion;
  tipo_habitaciones: Array<TipoHabitacion>;
  tipo_mantenimiento: TipoMantenimiento;
  tipos_bloqueo: Array<TipoBloqueo>;
  tipos_mantenimiento: Array<TipoMantenimiento>;
  total_gastos_por_dia_recepcionista: TotalBillingPerDayRecepcionstOutput;
  totales_propinas: TotalesPropinasOutput;
  transaccion: Transaccion;
  transacciones: Array<Transaccion>;
  /** Retorna toda la información de las transacciones de la renta (pagadas y pendientes) para cancelacion */
  transacciones_renta?: Maybe<GetRentaTransactionsOutput>;
  turno: Turno;
  turno_atencion: TurnoAtencion;
  turnos: Array<Turno>;
  turnos_atencion: Array<TurnoAtencion>;
  ultima_tarea_asignada_a_colaborador?: Maybe<Array<ColaboradorTarea>>;
  ultimo_corte?: Maybe<Corte>;
  unidades_conversion_articulos: Array<UnidadConversionArticulo>;
  usuario: Usuario;
  usuarios: Array<Usuario>;
  /** Obtiene la configuracion de notificaciones para el usuario */
  usuarios_notificaciones?: Maybe<Array<UsuariosNotificacionesConfigOutput>>;
  validateApiKey: ApiKey;
  /** Verifica si se sobrepasa el limite de reservas por dia de acuerdo al tipo de habitación */
  verificar_limite_reservas: CheckReserveLimitOutput;
}


export interface QueryAgregaciones_Almacenes_ArticulosArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryAlertas_CorteArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryAlmacenArgs {
  almacen_id: Scalars['ID']['input'];
}


export interface QueryAlmacen_ArticuloArgs {
  almacen_articulo_id: Scalars['ID']['input'];
}


export interface QueryAlmacenesArgs {
  almacen_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadoAlmacen>;
  fecha_creacion?: InputMaybe<DateSearchInput>;
  fecha_modificacion?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_almacen?: InputMaybe<TipoAlmacen>;
  usuario_modifico_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryAlmacenes_ArticulosArgs {
  almacen_articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  almacen_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  categoria_articulo_filters?: InputMaybe<CategoriaArticuloFilterArgs>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado_almacen_articulo?: InputMaybe<Array<EstadosAlmacenesArticulos>>;
  fecha_movimiento?: InputMaybe<DateSearchInput>;
  filter_duplicados?: InputMaybe<Scalars['Boolean']['input']>;
  filter_estado_articulo?: InputMaybe<EstadosArticulo>;
  filter_extra_articulo?: InputMaybe<Scalars['Boolean']['input']>;
  filter_producciones?: InputMaybe<Scalars['Boolean']['input']>;
  filter_tipo_almacen?: InputMaybe<TipoAlmacen>;
  filter_tipo_articulo?: InputMaybe<Array<TipoArticulo>>;
  folio_articulo_filters?: InputMaybe<FolioArticuloFiltersArgs>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre_articulo_filters?: InputMaybe<NombreArticuloFilterArgs>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
}


export interface QueryAreaArgs {
  area_id: Scalars['ID']['input'];
}


export interface QueryAreasArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryAreasPuestosArgs {
  area_id?: InputMaybe<Scalars['ID']['input']>;
  area_puesto_id?: InputMaybe<Scalars['ID']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryArticuloArgs {
  articulo_id: Scalars['ID']['input'];
}


export interface QueryArticulosArgs {
  articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  cantidad_minima?: InputMaybe<Scalars['Float']['input']>;
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  contenido?: InputMaybe<Scalars['Float']['input']>;
  costo_actual?: InputMaybe<Scalars['Float']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadosArticulo>;
  fecha_eliminado?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['String']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  insumo?: InputMaybe<Scalars['Boolean']['input']>;
  marca?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Float']['input']>;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}


export interface QueryAsistenciaArgs {
  asistencia_id: Scalars['ID']['input'];
}


export interface QueryAsistenciasArgs {
  asistencia_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  asistio?: InputMaybe<Scalars['Boolean']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  comentario?: InputMaybe<Scalars['String']['input']>;
  dia?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_entrada?: InputMaybe<DateSearchInput>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryCalcular_Reparto_PropinasArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryCategoria_ArticuloArgs {
  categoria_id: Scalars['ID']['input'];
}


export interface QueryCategoria_GastoArgs {
  categoria_id: Scalars['ID']['input'];
}


export interface QueryCategorias_ArticulosArgs {
  categoria_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryCategorias_GastoArgs {
  categoria?: InputMaybe<Scalars['String']['input']>;
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  limite_mensual?: InputMaybe<Scalars['Float']['input']>;
  predeterminado?: InputMaybe<Scalars['Boolean']['input']>;
  presupuesto?: InputMaybe<Scalars['Float']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryClienteArgs {
  cliente_id: Scalars['ID']['input'];
}


export interface QueryClientesArgs {
  correo?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  numero_cliente?: InputMaybe<Scalars['Float']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryColaboradorArgs {
  colaborador_id: Scalars['ID']['input'];
}


export interface QueryColaborador_TareaArgs {
  colaborador_tarea_id: Scalars['ID']['input'];
}


export interface QueryColaboradoresArgs {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['ID']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  en_turno?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  fecha_baja?: InputMaybe<DateSearchInput>;
  fecha_cumpleanios?: InputMaybe<DateSearchInput>;
  fecha_ingreso?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  numero_colaborador?: InputMaybe<Scalars['String']['input']>;
  numero_id?: InputMaybe<Scalars['String']['input']>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
  telefono_emergencia?: InputMaybe<Scalars['String']['input']>;
  telefono_personal?: InputMaybe<Scalars['String']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryColaboradores_By_AreaArgs {
  area_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  en_turno?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre_colaborador_filter?: InputMaybe<NombreColaboradorFilterArgs>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  puesto_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryColaboradores_Disponibles_Por_PuestoArgs {
  datos_busqueda: SearchColaboradoresForTaskInput;
}


export interface QueryColaboradores_Disponibles_Por_PuestosArgs {
  datos_busqueda: SearchColaboradoresForTaskByNombrePuestosInput;
}


export interface QueryColaboradores_Por_IdArgs {
  colaboradores_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryColaboradores_TareasArgs {
  search_colaboradores_tareas_args: FindAllColaboradoresTareaRequest;
}


export interface QueryComandaArgs {
  comanda_id: Scalars['ID']['input'];
}


export interface QueryComandasArgs {
  comanda_id: Array<Scalars['ID']['input']>;
  fecha_modificacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  folio?: InputMaybe<Scalars['Float']['input']>;
  orden_id: Array<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryConfiguracion_FajillaArgs {
  configuracion_fajilla_id: Scalars['ID']['input'];
}


export interface QueryConfiguracion_PropinaArgs {
  configuracion_propina_id: Scalars['ID']['input'];
}


export interface QueryConfiguraciones_CorteArgs {
  activo?: InputMaybe<Scalars['Boolean']['input']>;
  concepto?: InputMaybe<ConceptosInclusionFilterArgs>;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryConfiguraciones_FajillaArgs {
  fecha_creacion?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
  valor?: InputMaybe<Scalars['Float']['input']>;
}


export interface QueryConfiguraciones_InventarioArgs {
  configuracion_inventario_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  inventario_negativo?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryConfiguraciones_PropinaArgs {
  configuracion_propina_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryConsultar_Reporte_PropinasArgs {
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  reporte_propina_venta_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryCorteArgs {
  corte_id: Scalars['ID']['input'];
}


export interface QueryCortesArgs {
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  estatus?: InputMaybe<EstatusCorte>;
  fecha_cierre_corte?: InputMaybe<DateSearchInput>;
  fecha_corte?: InputMaybe<DaySearchInput>;
  fecha_fin_corte?: InputMaybe<DateSearchInput>;
  fecha_inicio_corte?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['Float']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  total_corte?: InputMaybe<Scalars['Float']['input']>;
  total_venta_habitaciones?: InputMaybe<Scalars['Float']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_cierra_corte?: InputMaybe<Scalars['String']['input']>;
  usuario_realiza_corte?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryCortes_AgrupadosArgs {
  fecha_cierre_corte?: InputMaybe<DateSearchInput>;
  fecha_fin_corte?: InputMaybe<DateSearchInput>;
  fecha_inicio_corte?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
  unidad_tiempo?: InputMaybe<UnidadTiempoFiltro>;
}


export interface QueryCortes_Por_AnioArgs {
  fecha_inicio_corte?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryDetalle_OrdenArgs {
  detalle_orden_id: Scalars['ID']['input'];
}


export interface QueryDetalle_PagoArgs {
  detalle_pago_id: Scalars['ID']['input'];
}


export interface QueryDetalle_Reparto_PropinasArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryDetalles_OrdenArgs {
  almacen_articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  detalle_orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  estado?: InputMaybe<Array<EstadosDetalleOrden>>;
  fecha_cancelacion?: InputMaybe<DateSearchInput>;
  fecha_devolucion?: InputMaybe<DateSearchInput>;
  merma?: InputMaybe<Scalars['Boolean']['input']>;
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  reembolso?: InputMaybe<Scalars['Boolean']['input']>;
}


export interface QueryDetalles_PagoArgs {
  cancelado?: InputMaybe<Scalars['Boolean']['input']>;
  detalle_pago_id?: InputMaybe<Scalars['ID']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  fecha_pago?: InputMaybe<DateSearchInput>;
  numero_referencia?: InputMaybe<Scalars['String']['input']>;
  origen_orden: OrigenOrden;
  pago_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_pago?: InputMaybe<TiposPagos>;
  ultimos_digitos?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryDisponibilidad_HabitacionArgs {
  hotel_id: Scalars['ID']['input'];
  tipo_habitacion_id: Scalars['ID']['input'];
}


export interface QueryDisponibilidad_HabitacionesArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryExiste_HotelArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryExiste_Metodo_De_PagoArgs {
  metodo_de_pago_id: Scalars['ID']['input'];
}


export interface QueryExiste_UsuarioArgs {
  usuario_id: Scalars['ID']['input'];
}


export interface QueryExperienciasArgs {
  cobro_unico?: InputMaybe<Scalars['Boolean']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadosExperiencias>;
  experiencia_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryExtraArgs {
  extra_id: Scalars['ID']['input'];
}


export interface QueryExtrasArgs {
  extra_id: Array<Scalars['ID']['input']>;
  fecha_cancelacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_pago?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_solicitud?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  monto_devuelto_cancelacion?: InputMaybe<Scalars['Float']['input']>;
  monto_extra?: InputMaybe<Scalars['Float']['input']>;
  motivo_cancelacion?: InputMaybe<Scalars['String']['input']>;
  numero?: InputMaybe<Scalars['Int']['input']>;
  renta_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_extra?: InputMaybe<TiposExtras>;
  venta_checkin?: InputMaybe<Scalars['Boolean']['input']>;
  venta_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryFajillaArgs {
  fajilla_id: Scalars['ID']['input'];
}


export interface QueryFajillasArgs {
  configuracion_fajilla_id?: InputMaybe<Scalars['ID']['input']>;
  estatus?: InputMaybe<EstatusFajillas>;
  estatus_not_in?: InputMaybe<Array<EstatusFajillas>>;
  fecha_autorizaicion?: InputMaybe<DateSearchInput>;
  fecha_creacion?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  monto?: InputMaybe<Scalars['Float']['input']>;
  origen?: InputMaybe<OrigenesFajillas>;
  ticket_id?: InputMaybe<Scalars['ID']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_autorizo_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_creo_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryFindAllPagoRentaArgs {
  pago_id: Array<Scalars['ID']['input']>;
  renta_id: Array<Scalars['ID']['input']>;
}


export interface QueryFindAllPagosReservasArgs {
  pago_id: Array<Scalars['ID']['input']>;
  reserva_id: Array<Scalars['ID']['input']>;
}


export interface QueryFindOnePagosReservasByIdInputArgs {
  pago_reserva_id: Scalars['ID']['input'];
}


export interface QueryFuncionalidadArgs {
  funcionalidad_id: Scalars['ID']['input'];
}


export interface QueryFuncionalidadesArgs {
  modulo_id?: InputMaybe<Scalars['ID']['input']>;
  nombre_funcionalidad?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryGastoArgs {
  gasto_id: Scalars['ID']['input'];
}


export interface QueryGastosArgs {
  caja_chica?: InputMaybe<Scalars['Boolean']['input']>;
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_gasto?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['Float']['input']>;
  gasto_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  metodo_pago?: InputMaybe<Scalars['String']['input']>;
  monto?: InputMaybe<Scalars['Float']['input']>;
  subcategoria_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryGastos_Categoria_Por_MesArgs {
  caja_chica?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  month: Scalars['String']['input'];
}


export interface QueryGastos_Categoria_Por_MesesArgs {
  caja_chica?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  month: Array<Scalars['String']['input']>;
}


export interface QueryGastos_Por_MesArgs {
  caja_chica?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  month: Scalars['String']['input'];
}


export interface QueryGetVehiculoDataByPlacaArgs {
  placa: GetVehiculoDataByPlacaInput;
}


export interface QueryGrupo_HotelArgs {
  grupo_hotel_id: Scalars['ID']['input'];
}


export interface QueryGrupos_HotelesArgs {
  nombre_grupo?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryHabitacionArgs {
  habitacion_id: Scalars['ID']['input'];
}


export interface QueryHabitacion_Mas_VendidaArgs {
  hotel_id: Scalars['String']['input'];
}


export interface QueryHabitacion_Top_Rentas_Del_DiaArgs {
  hotel_id: Scalars['String']['input'];
}


export interface QueryHabitacion_Top_Reservas_Del_DiaArgs {
  hotel_id: Scalars['String']['input'];
}


export interface QueryHabitacionesArgs {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Estados_Habitaciones>;
  fecha_estado?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_habitacion?: InputMaybe<Scalars['String']['input']>;
  piso?: InputMaybe<Scalars['String']['input']>;
  subestado?: InputMaybe<SubestadosHabitaciones>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryHabitaciones_MesasArgs {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Estados_Habitaciones>;
  fecha_estado?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_habitacion?: InputMaybe<Scalars['String']['input']>;
  piso?: InputMaybe<Scalars['String']['input']>;
  subestado?: InputMaybe<SubestadosHabitaciones>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryHistorial_Estados_ComandaArgs {
  comanda_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  estado_comanda?: InputMaybe<EstadosComandaHistorial>;
  fecha_fin?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  historial_estado_comanda_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_mesa?: InputMaybe<Scalars['String']['input']>;
  numero_orden?: InputMaybe<Scalars['String']['input']>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
}


export interface QueryHistorial_Estados_OrdenArgs {
  estado_orden?: InputMaybe<Array<EstadosOrdenHistorial>>;
  fecha_fin?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  historial_estado_orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_orden?: InputMaybe<Scalars['String']['input']>;
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  tipo_orden?: InputMaybe<TipoOrden>;
}


export interface QueryHistorial_HabitacionArgs {
  historial_habitacion_id: Scalars['ID']['input'];
}


export interface QueryHistorial_HabitacionesArgs {
  accion?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<HistorialHabitacionesData>;
  fecha?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  historial_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryHistorial_Movimiento_InventarioArgs {
  historial_movimiento_inventario_id: Scalars['ID']['input'];
}


export interface QueryHistorial_Movimientos_InventarioArgs {
  articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  costo_actual?: InputMaybe<Scalars['Float']['input']>;
  fecha_registro?: InputMaybe<MonthSearchInput>;
  folio?: InputMaybe<Scalars['Int']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  movimiento?: InputMaybe<MovimientoHistorialInventario>;
  nombre_articulo?: InputMaybe<Scalars['String']['input']>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  precio?: InputMaybe<Scalars['Float']['input']>;
  salida_id?: InputMaybe<Scalars['ID']['input']>;
  surtido_id?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<TipoMovimientoHistorialInventario>;
  tipo_articulo?: InputMaybe<TipoArticulo>;
}


export interface QueryHistorial_Produccion_InventarioArgs {
  historial_produccion_inventario_id: Scalars['ID']['input'];
}


export interface QueryHistorial_Producciones_InventariosArgs {
  articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_produccion?: InputMaybe<MonthSearchInput>;
  folio?: InputMaybe<Scalars['Int']['input']>;
  historial_produccion_inventario_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryHotelArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryHotel_ColaboradorArgs {
  hotel_colaborador_id: Scalars['ID']['input'];
}


export interface QueryHotel_ColaboradoresArgs {
  area_id?: InputMaybe<Scalars['ID']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryHotelesArgs {
  calle?: InputMaybe<Scalars['String']['input']>;
  ciudad?: InputMaybe<Scalars['String']['input']>;
  colonia?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  cp?: InputMaybe<Scalars['String']['input']>;
  easyrewards_sucursal_id?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  fecha_creacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_modificacion?: InputMaybe<Scalars['DateTime']['input']>;
  grupo_hotel_id?: InputMaybe<Scalars['ID']['input']>;
  logo_hotel?: InputMaybe<Scalars['String']['input']>;
  nombre_hotel?: InputMaybe<Scalars['String']['input']>;
  numero_exterior?: InputMaybe<Scalars['String']['input']>;
  numero_interior?: InputMaybe<Scalars['String']['input']>;
  razon_social?: InputMaybe<Scalars['String']['input']>;
  rfc?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
  zona_horaria?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryIncidenciaArgs {
  incidencia_id: Scalars['ID']['input'];
}


export interface QueryIncidenciasArgs {
  area?: InputMaybe<Scalars['String']['input']>;
  colaborador_id_cierra?: InputMaybe<Scalars['ID']['input']>;
  colaborador_id_reporta?: InputMaybe<Scalars['ID']['input']>;
  detalle?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Estados_Incidencias>;
  fecha_cierre?: InputMaybe<DateSearchInput>;
  fecha_operacion?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['Int']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  huesped?: InputMaybe<Scalars['String']['input']>;
  incidencia_id?: InputMaybe<Scalars['ID']['input']>;
  matricula?: InputMaybe<Scalars['String']['input']>;
  severidad?: InputMaybe<Scalars['String']['input']>;
  tipo_incidencia?: InputMaybe<Scalars['String']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryInforme_Historial_Movimientos_InventarioArgs {
  fecha_registro?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryInforme_InventarioArgs {
  almacen_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryIngredientes_RecetasArgs {
  articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  ingrediente_receta_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  receta_id?: InputMaybe<Scalars['ID']['input']>;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}


export interface QueryKpis_Historial_Producciones_InventariosArgs {
  articulo_id: Scalars['ID']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryKpis_MantenimientosArgs {
  fecha_registro: DateSearchInput;
  hotel_id: Scalars['ID']['input'];
}


export interface QueryMantenimientoArgs {
  mantenimiento_id: Scalars['ID']['input'];
}


export interface QueryMantenimientosArgs {
  agua?: InputMaybe<Scalars['Float']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_actualizacion?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  gas?: InputMaybe<Scalars['Float']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  luz?: InputMaybe<Scalars['Float']['input']>;
  mantenimiento_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  turno_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryMesaArgs {
  mesa_id: Scalars['ID']['input'];
}


export interface QueryMesa_AsignadaArgs {
  mesa_asignada_id: Scalars['ID']['input'];
}


export interface QueryMesasArgs {
  cantidad_personas?: InputMaybe<Scalars['Float']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Array<EstadoMesa>>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  mesa_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  numero_mesa?: InputMaybe<Scalars['String']['input']>;
  usuario_modifico_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryMesas_AsignadasArgs {
  colaborador_asignado_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  mesa_asignada_id?: InputMaybe<Scalars['ID']['input']>;
  mesa_id?: InputMaybe<Scalars['ID']['input']>;
  orden_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryMetodo_De_PagoArgs {
  metododepago_id: Scalars['ID']['input'];
}


export interface QueryMetodos_De_PagoArgs {
  default?: InputMaybe<Scalars['Boolean']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  metododepago_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryModuloArgs {
  modulo_id: Scalars['ID']['input'];
}


export interface QueryModulosArgs {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  nombre_modulo?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryMotivo_Ingreso_VehiculoArgs {
  motivo_ingreso_id: Scalars['ID']['input'];
}


export interface QueryMotivos_Ingreso_VehiculosArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  motivo_ingreso_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryMovimientos_Antes_CorteArgs {
  fecha_fin: Scalars['DateTime']['input'];
  fecha_inicio: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryNotificacionesArgs {
  hotel_id?: InputMaybe<Array<Scalars['String']['input']>>;
  notificacion_id?: InputMaybe<Array<Scalars['String']['input']>>;
  tipo?: InputMaybe<TipoNotificacion>;
  topic?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryNotificaciones_No_Leidas_AlertaArgs {
  hotel_id: Scalars['String']['input'];
  usuario_id: Scalars['String']['input'];
}


export interface QueryObten_SaldoArgs {
  easyrewards_id: Scalars['String']['input'];
}


export interface QueryObtener_Bandeja_IncidenciasArgs {
  bandeja_notificaciones_id?: InputMaybe<Scalars['String']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Array<Scalars['String']['input']>>;
  incidencia_id?: InputMaybe<Scalars['String']['input']>;
  leido?: InputMaybe<Scalars['Boolean']['input']>;
  notificacion_id?: InputMaybe<Array<Scalars['String']['input']>>;
  tipo?: InputMaybe<Array<TipoNotificacion>>;
  usuario_id?: InputMaybe<Array<Scalars['String']['input']>>;
}


export interface QueryObtener_Bandeja_NotificacionesArgs {
  bandeja_notificaciones_id?: InputMaybe<Scalars['String']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Array<Scalars['String']['input']>>;
  incidencia_id?: InputMaybe<Scalars['String']['input']>;
  leido?: InputMaybe<Scalars['Boolean']['input']>;
  notificacion_id?: InputMaybe<Array<Scalars['String']['input']>>;
  tipo?: InputMaybe<Array<TipoNotificacion>>;
  usuario_id?: InputMaybe<Array<Scalars['String']['input']>>;
}


export interface QueryObtener_Ordenes_No_PagadasArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryObtener_Porcentaje_Promedio_OcupacionArgs {
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryObtener_VentasArgs {
  get_today_sales_input: GetTodaySalesInput;
}


export interface QueryObtener_Ventas_ExtrasArgs {
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryObtener_Ventas_OrdenesArgs {
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryObtener_Ventas_RentasArgs {
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryObtener_Ventas_ReservasArgs {
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}


export interface QueryOrdenArgs {
  orden_id: Scalars['ID']['input'];
}


export interface QueryOrdenesArgs {
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  consumo_interno_colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado_orden?: InputMaybe<EstadosOrdenHistorial>;
  estado_pago?: InputMaybe<Array<EstadoPagoOrdenes>>;
  fecha_cobro?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  filter_by_detalle_orden_state?: InputMaybe<Array<EstadosDetalleOrden>>;
  filter_comanda?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  orden?: InputMaybe<Scalars['String']['input']>;
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  pago_id?: InputMaybe<Scalars['ID']['input']>;
  panel_no_visible?: InputMaybe<Scalars['Boolean']['input']>;
  renta_id?: InputMaybe<Scalars['ID']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryOrdenes_PaginadasArgs {
  estado?: InputMaybe<EstadosOrdenHistorial>;
  estado_pago?: InputMaybe<EstadoPagoOrdenes>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  orden?: InputMaybe<Scalars['String']['input']>;
  origen?: InputMaybe<OrigenesOrden>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryPaginacion_Colaboradores_TareaArgs {
  pageOptions?: InputMaybe<PageOptionsArgs>;
  search?: InputMaybe<FindAllColaboradoresTareaRequest>;
}


export interface QueryPagosArgs {
  cancelados?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  not_in_origen_orden?: InputMaybe<Array<OrigenOrden>>;
  pago_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  ticket_id?: InputMaybe<Scalars['ID']['input']>;
  total?: InputMaybe<Scalars['Float']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryPagos_PropinasArgs {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_registro?: InputMaybe<MonthSearchInput>;
  hotel_id: Scalars['ID']['input'];
  pago_propina_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryPlacas_PendientesArgs {
  hotel_id: Scalars['ID']['input'];
  limite?: InputMaybe<Scalars['Int']['input']>;
  matricula: Scalars['String']['input'];
}


export interface QueryPropinasArgs {
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_eliminado?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Array<Scalars['Float']['input']>>;
  hotel_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  procedencia?: InputMaybe<Array<ProcedenciaPropina>>;
  procedencia_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  propina_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryPuestoArgs {
  puesto_id: Scalars['ID']['input'];
}


export interface QueryPuestosArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  esquema_propinas_activo?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryPuestos_De_HotelArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryRecetaArgs {
  articulo_id: Scalars['ID']['input'];
}


export interface QueryRecetasArgs {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  articulo_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryRentaArgs {
  renta_id: Scalars['ID']['input'];
}


export interface QueryRentasArgs {
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<EstadosRentas>;
  fecha_cancelacion?: InputMaybe<DateSearchInput>;
  fecha_condensada?: InputMaybe<DateSearchInput>;
  fecha_fin?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  horas_extra?: InputMaybe<Scalars['Float']['input']>;
  hospedajes_extra?: InputMaybe<Scalars['Float']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  monto_devuelto_cancelacion?: InputMaybe<Scalars['Float']['input']>;
  numero_personas?: InputMaybe<Scalars['Float']['input']>;
  personas_extra?: InputMaybe<Scalars['Float']['input']>;
  placas?: InputMaybe<Scalars['String']['input']>;
  renta_id: Array<Scalars['ID']['input']>;
  reserva_id?: InputMaybe<Scalars['ID']['input']>;
  tarifa_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_alojamiento?: InputMaybe<TiposAlojamientos>;
  tipo_entrada?: InputMaybe<TiposEntradas>;
  tipos_alojamientos?: InputMaybe<TiposAlojamientos>;
  total?: InputMaybe<Scalars['Float']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryReporte_PropinasArgs {
  hotel_id: Scalars['ID']['input'];
}


export interface QueryReservaArgs {
  reserva_id: Scalars['ID']['input'];
}


export interface QueryReservasArgs {
  cliente_id?: InputMaybe<Scalars['ID']['input']>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  codigo_ota?: InputMaybe<Scalars['String']['input']>;
  correo_huesped?: InputMaybe<Scalars['String']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<EstadosReservas>;
  estado_pago?: InputMaybe<EstadpPago>;
  fecha_cancelacion?: InputMaybe<DateSearchInput>;
  fecha_entrada?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['String']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre_huesped?: InputMaybe<Scalars['String']['input']>;
  numero_personas?: InputMaybe<Scalars['Int']['input']>;
  origen?: InputMaybe<OrigenRservas>;
  personas_extras?: InputMaybe<Scalars['Int']['input']>;
  reserva_id: Array<Scalars['ID']['input']>;
  tarifa_id?: InputMaybe<Scalars['ID']['input']>;
  telefono_huesped?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryReservas_Sin_Asignar_Del_DiaArgs {
  fecha_entrada: Scalars['DateTime']['input'];
  hotel_id: Scalars['String']['input'];
  tipo_habitacion_id?: InputMaybe<Scalars['String']['input']>;
}


export interface QueryRolArgs {
  rol_id: Scalars['ID']['input'];
}


export interface QueryRolesArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  grupo_hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
}


export interface QuerySalida_InventarioArgs {
  salida_id: Scalars['ID']['input'];
}


export interface QuerySalidas_InventarioArgs {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  detalle_orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  motivo?: InputMaybe<Motivo>;
  salida_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryServicioArgs {
  servicio_id: Scalars['ID']['input'];
}


export interface QueryServiciosArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  servicio_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QuerySubcategoria_GastoArgs {
  subcategoria_gasto_id: Scalars['ID']['input'];
}


export interface QuerySubcategoria_ProductoArgs {
  subcategoria_id: Scalars['ID']['input'];
}


export interface QuerySubcategorias_GastoArgs {
  categoria_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  subcategoria?: InputMaybe<Scalars['String']['input']>;
  subcategoria_gasto_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QuerySubcategorias_ProductosArgs {
  categoria_id: Array<Scalars['ID']['input']>;
  subcategoria?: InputMaybe<Scalars['String']['input']>;
  subcategoria_id: Array<Scalars['ID']['input']>;
}


export interface QuerySurtidoArgs {
  surtido_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QuerySurtidosArgs {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  comentario?: InputMaybe<Scalars['String']['input']>;
  costo_total?: InputMaybe<Scalars['Float']['input']>;
  costo_unitario?: InputMaybe<Scalars['Float']['input']>;
  fecha_ingreso?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_orden_factura?: InputMaybe<Scalars['String']['input']>;
  surtido_id?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<TiposSurtido>;
}


export interface QuerySuscripcionArgs {
  suscripcion_id: Scalars['ID']['input'];
}


export interface QuerySuscripcionesArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  fecha_expiracion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_inicio?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  suscripcion_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTareaArgs {
  tarea_id: Scalars['ID']['input'];
}


export interface QueryTareasArgs {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
  tarea_id?: InputMaybe<Scalars['ID']['input']>;
  tipo?: InputMaybe<TiposTarea>;
}


export interface QueryTarifaArgs {
  tarifa_id: Scalars['ID']['input'];
}


export interface QueryTarifasArgs {
  costo_habitacion?: InputMaybe<Scalars['Float']['input']>;
  costo_hora_extra?: InputMaybe<Scalars['Float']['input']>;
  costo_hospedaje_extra?: InputMaybe<Scalars['Float']['input']>;
  costo_persona_extra?: InputMaybe<Scalars['Float']['input']>;
  dias_disponibles?: InputMaybe<Array<DiasDisponibles>>;
  domingo?: InputMaybe<Scalars['Boolean']['input']>;
  duracion_renta?: InputMaybe<Scalars['Float']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<EstatusTarifa>;
  fecha_final?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_inicio?: InputMaybe<Scalars['DateTime']['input']>;
  hora_final?: InputMaybe<Scalars['String']['input']>;
  hora_inicio?: InputMaybe<Scalars['String']['input']>;
  horas_extra_max?: InputMaybe<Scalars['Float']['input']>;
  hospedajes_extra_max?: InputMaybe<Scalars['Float']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  jueves?: InputMaybe<Scalars['Boolean']['input']>;
  lunes?: InputMaybe<Scalars['Boolean']['input']>;
  martes?: InputMaybe<Scalars['Boolean']['input']>;
  miercoles?: InputMaybe<Scalars['Boolean']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  pantalla_disponibilidad?: InputMaybe<Scalars['Boolean']['input']>;
  personas_extra_max?: InputMaybe<Scalars['Float']['input']>;
  sabado?: InputMaybe<Scalars['Boolean']['input']>;
  tarifa_id?: InputMaybe<Scalars['ID']['input']>;
  tarifa_imas?: InputMaybe<Scalars['String']['input']>;
  tipo_alojamiento?: InputMaybe<TiposAlojamientos>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_tarifa?: InputMaybe<TipoTarifa>;
  viernes?: InputMaybe<Scalars['Boolean']['input']>;
}


export interface QueryTicketArgs {
  ticket_id: Scalars['ID']['input'];
}


export interface QueryTicketsArgs {
  cancelado?: InputMaybe<Scalars['Boolean']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  consumo_interno?: InputMaybe<Scalars['Boolean']['input']>;
  corte_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  cortesia?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_cancelacion?: InputMaybe<DateSearchInput>;
  fecha_impresion?: InputMaybe<DateSearchInput>;
  folio?: InputMaybe<Scalars['Int']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  reserva_id?: InputMaybe<Scalars['ID']['input']>;
  ticket_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  usuario_cancelacion_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTipo_BloqueoArgs {
  tipo_bloqueo_id: Scalars['ID']['input'];
}


export interface QueryTipo_HabitacionArgs {
  tipo_habitacion_id: Scalars['ID']['input'];
}


export interface QueryTipo_HabitacionesArgs {
  amenidades?: InputMaybe<Array<Scalars['String']['input']>>;
  camas?: InputMaybe<Array<CamaArgs>>;
  clave?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  personas_incluidas?: InputMaybe<Scalars['Int']['input']>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTipo_MantenimientoArgs {
  tipo_mantenimiento_id: Scalars['ID']['input'];
}


export interface QueryTipos_BloqueoArgs {
  claves?: InputMaybe<Array<ClaveTipoBloqueoArgs>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_bloqueo_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTipos_MantenimientoArgs {
  claves?: InputMaybe<Array<ClaveTipoMantenimientoInput>>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_mantenimiento_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTotales_PropinasArgs {
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_propina?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTransaccionArgs {
  transaccion_id: Scalars['ID']['input'];
}


export interface QueryTransaccionesArgs {
  cantidad?: InputMaybe<Scalars['Int']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  fecha_creacion?: InputMaybe<Scalars['DateTime']['input']>;
  metododepago_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryTransacciones_RentaArgs {
  renta_id: Scalars['ID']['input'];
}


export interface QueryTurnoArgs {
  turno_id: Scalars['ID']['input'];
}


export interface QueryTurno_AtencionArgs {
  turno_atencion_id: Scalars['ID']['input'];
}


export interface QueryTurnosArgs {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadosTurno>;
  hora_entrada?: InputMaybe<Scalars['String']['input']>;
  hora_salida?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  turno_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryTurnos_AtencionArgs {
  estado?: InputMaybe<Array<EstadosTurnosAtencion>>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
  tipo_habitacion_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  turno_atencion_id?: InputMaybe<Array<Scalars['ID']['input']>>;
}


export interface QueryUltima_Tarea_Asignada_A_ColaboradorArgs {
  colaboradores_ids: Array<Scalars['ID']['input']>;
}


export interface QueryUltimo_CorteArgs {
  hotel_id: Scalars['ID']['input'];
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface QueryUsuarioArgs {
  usuario_id: Scalars['ID']['input'];
}


export interface QueryUsuariosArgs {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  fecha_modificacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  origen?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  puesto?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['String']['input']>;
  verificado?: InputMaybe<Scalars['Boolean']['input']>;
}


export interface QueryUsuarios_NotificacionesArgs {
  hotel_id: Scalars['String']['input'];
  usuario_id: Scalars['String']['input'];
}


export interface QueryValidateApiKeyArgs {
  input: ValidateApiKeyInput;
}


export interface QueryVerificar_Limite_ReservasArgs {
  fechas_reserva: DateSearchInput;
  hotel_id: Scalars['ID']['input'];
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface Receta {
  __typename?: 'Receta';
  articulo?: Maybe<Articulo>;
  articulo_id: Scalars['ID']['output'];
  ingredientes?: Maybe<Array<IngredienteReceta>>;
  ingredientes_recetas?: Maybe<Array<IngredienteReceta>>;
  precio?: Maybe<Scalars['Float']['output']>;
}


export interface RecetaPrecioArgs {
  almacen_articulo_id?: InputMaybe<Scalars['String']['input']>;
}

export interface RechazarFajillaInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  fajilla_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface RefundDetalleOrdenDetailInput {
  detalle_orden_id: Scalars['ID']['input'];
  merma: Scalars['Boolean']['input'];
  reembolso: Scalars['Boolean']['input'];
}

export interface RefundDetallesOrdenInput {
  detalles_orden: Array<RefundDetalleOrdenDetailInput>;
  motivo_cancelacion: Scalars['String']['input'];
}

export interface RefundOrdenInput {
  detalles_orden?: InputMaybe<RefundDetallesOrdenInput>;
  orden_id: Scalars['ID']['input'];
}

export interface RegisterUsuarioDispositivoInput {
  dispositivo_id: Scalars['ID']['input'];
  token_fcm: Scalars['String']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface ReleaseHabitacionInput {
  estado: Release_Estados_Habitaciones;
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface RemoveBookingFromRoomInput {
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface RemoveColaboradorFromHotelInput {
  area_id: Scalars['ID']['input'];
  colaborador_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  puesto_id: Scalars['ID']['input'];
}

export interface Renta {
  __typename?: 'Renta';
  cliente_id?: Maybe<Scalars['ID']['output']>;
  comentarios: Array<ComentariosInfoRenta>;
  /** Conceptos pendientes de la renta (estancia y/o extras) */
  conceptos_pendientes?: Maybe<GetConceptosPendientesRentaOutput>;
  corte_id?: Maybe<Scalars['String']['output']>;
  early_checkin?: Maybe<Scalars['Boolean']['output']>;
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  /** Indica si la renta puede ser cancelada según las reglas de cancelacion entre cortes */
  es_renta_cancelable: Scalars['Boolean']['output'];
  estado: EstadosRentas;
  extras?: Maybe<Array<Extra>>;
  /** Fecha más antigua en la que una orden asociada a la renta pasó a estado en_entrega */
  fecha_antigua_en_entrega?: Maybe<Scalars['DateTime']['output']>;
  /** Fecha más antigua en la que una orden asociada a la renta pasó a estado por_entregar */
  fecha_antigua_por_entregar?: Maybe<Scalars['DateTime']['output']>;
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  /** Fecha en la que final de la renta condensando las horas y hospedajes extras */
  fecha_condensada: Scalars['DateTime']['output'];
  /** Fecha fin de la renta */
  fecha_fin: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  /** Fecha en la que sale el cliente */
  fecha_salida?: Maybe<Scalars['DateTime']['output']>;
  folio: Scalars['Int']['output'];
  habitacion?: Maybe<Habitacion>;
  habitacion_id: Scalars['ID']['output'];
  horas_extra: Scalars['Float']['output'];
  hospedajes_extra: Scalars['Float']['output'];
  hotel?: Maybe<Hotel>;
  hotel_id: Scalars['ID']['output'];
  monto_devuelto_cancelacion?: Maybe<Scalars['Float']['output']>;
  /** Montos calculados de cancelacion total o parcial de renta */
  montos_cancelacion?: Maybe<GetCancelableAmountsRentaOutput>;
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  nombre_huesped?: Maybe<Scalars['String']['output']>;
  numero_personas: Scalars['Float']['output'];
  ordenes?: Maybe<Array<Orden>>;
  pagos?: Maybe<Array<Pago>>;
  personas_extra: Scalars['Float']['output'];
  /** Es la propina recibida y asociada a la renta en caso de que la hubo */
  propina?: Maybe<Propina>;
  /** Retorna todas las propinas de la renta (estancia y extras) */
  propinas?: Maybe<Array<Propina>>;
  renta_id: Scalars['ID']['output'];
  reserva?: Maybe<Reserva>;
  reserva_id?: Maybe<Scalars['ID']['output']>;
  saldo?: Maybe<Scalars['Float']['output']>;
  /** Total por saldar del pago de la estancia */
  saldo_pendiente_estancia: Scalars['Float']['output'];
  /** Monto pendiente de pago de ordenes de la habitación */
  saldo_pendiente_ordenes: Scalars['Float']['output'];
  subtotales: DataSubtotales;
  tarifa?: Maybe<Tarifa>;
  tarifa_id: Scalars['ID']['output'];
  ticket_id?: Maybe<Scalars['String']['output']>;
  /** Indica si la renta tiene al menos 1 ticket/venta cancelable */
  tiene_ventas_cancelables: Scalars['Boolean']['output'];
  tipo_alojamiento: TiposAlojamientos;
  tipo_entrada: TiposEntradas;
  total: Scalars['Float']['output'];
  /** Ultima orden registrada y activa(en_preparacion, por_entregar) para la habitacion */
  ultima_orden?: Maybe<GetLastOrdenOutput>;
  /** Retorna el concepto mas antiguo por cada tipo(renta, orden, extra) para la renta si es que tiene */
  ultimos_conceptos_pendientes?: Maybe<UltimosConceptosPendientesDetailOutput>;
  usuario?: Maybe<Usuario>;
  usuario_id: Scalars['ID']['output'];
  /** Vehiculo registrado para la renta */
  vehiculo?: Maybe<Data_Vehiculo>;
}

export interface RentaOrdenTransactionItemOutput {
  __typename?: 'RentaOrdenTransactionItemOutput';
  /** Retorna toda la información de la orden del ticket/transacción */
  orden?: Maybe<Orden>;
  orden_id: Scalars['ID']['output'];
  /** Retorna toda la información del ticket de la transacción */
  ticket?: Maybe<Ticket>;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface RentaTicket {
  __typename?: 'RentaTicket';
  descripcion: Scalars['String']['output'];
  habitacion_id: Scalars['ID']['output'];
  numero_habitacion: Scalars['String']['output'];
}

export interface RentaTransactionItemOutput {
  __typename?: 'RentaTransactionItemOutput';
  /** Retorna toda la información de los extras del ticket/transacción */
  extras?: Maybe<Array<Extra>>;
  extras_ids: Array<Scalars['ID']['output']>;
  /** Retorna toda la información del ticket de la transacción */
  ticket?: Maybe<Ticket>;
  ticket_id?: Maybe<Scalars['ID']['output']>;
}

export interface RepartoPropinaItemOutput {
  __typename?: 'RepartoPropinaItemOutput';
  asignacion_propina?: Maybe<AsignacionPropina>;
  asignacion_propina_id: Scalars['ID']['output'];
  colaborador?: Maybe<Colaborador>;
  colaborador_id: Scalars['ID']['output'];
  comision_bancaria_propina_por_venta: Scalars['Float']['output'];
  comision_bancaria_sobre_fondo: Scalars['Float']['output'];
  fondo_de_propinas: Scalars['Float']['output'];
  pago_correspondiente: Scalars['Float']['output'];
  propina_por_ventas: Scalars['Float']['output'];
}

export interface RepartoPropinasOutput {
  __typename?: 'RepartoPropinasOutput';
  limite_disponible: Scalars['Float']['output'];
  monto_recaudado: Scalars['Float']['output'];
  reparto_propinas: Array<RepartoPropinaItemOutput>;
}

export interface ReportePropinasPorPuestoDetailOutput {
  __typename?: 'ReportePropinasPorPuestoDetailOutput';
  puesto?: Maybe<Puesto>;
  puesto_id: Scalars['ID']['output'];
  reporte_colaboradores: Array<ColaboradorReportePropinaDetailOutput>;
}

export interface Reserva {
  __typename?: 'Reserva';
  /** Información del cliente asociado a la reserva */
  cliente: Cliente;
  cliente_id?: Maybe<Scalars['ID']['output']>;
  codigo_ota: Scalars['String']['output'];
  comentarios: Array<ComentariosInfoReserva>;
  correo_huesped?: Maybe<Scalars['String']['output']>;
  corte_id?: Maybe<Scalars['ID']['output']>;
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  estado: EstadosReservas;
  estado_pago: EstadpPago;
  /** Experiencias compradas para la reserva */
  experiencias_reserva: Array<ExperienciaReserva>;
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_entrada: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  fecha_salida: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  /** Informacion de la habitacion asociada a la reserva */
  habitacion: Habitacion;
  habitacion_id?: Maybe<Scalars['ID']['output']>;
  hospedajes_extra: Scalars['Int']['output'];
  /** Informacion del hotel asociado a la reserva */
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  monto_devuelto_cancelacion?: Maybe<Scalars['Float']['output']>;
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  nombre_huesped: Scalars['String']['output'];
  numero_personas: Scalars['Int']['output'];
  origen: OrigenRservas;
  pagos?: Maybe<Array<Pago>>;
  personas_extras: Scalars['Int']['output'];
  reserva_id: Scalars['ID']['output'];
  saldo: Scalars['Float']['output'];
  subtotales: SubtotalesReserva;
  /** Informacion de la tarifa asociada a la reserva */
  tarifa?: Maybe<Tarifa>;
  tarifa_id: Scalars['ID']['output'];
  telefono_huesped: Scalars['String']['output'];
  tipo_de_habitacion: TipoHabitacion;
  tipo_habitacion_id: Scalars['ID']['output'];
  total: Scalars['Float']['output'];
  /** Información del usuario asociado a la reserva */
  usuario: Usuario;
  usuario_id: Scalars['ID']['output'];
}

export interface ResumenUtilidadOutput {
  __typename?: 'ResumenUtilidadOutput';
  gastos: Array<DataConceptoResumenUtilidadPorcentaje>;
  ingresos: Array<DataConceptoResumenUtilidad>;
  totales: DataConceptoResumenUtilidadTotales;
}

export interface ReturnIdTicketResponse {
  __typename?: 'ReturnIdTicketResponse';
  ticket_id: Array<Scalars['ID']['output']>;
}

export interface Rol {
  __typename?: 'Rol';
  /** Indica si el rol está eliminado */
  eliminado: Scalars['Boolean']['output'];
  funcionalidades?: Maybe<Array<Funcionalidad>>;
  grupo_hotel: GrupoHotel;
  /** Id del grupo hotel */
  grupo_hotel_id: Scalars['String']['output'];
  /** Nombre del rol */
  nombre: Scalars['String']['output'];
  /** Rol id */
  rol_id: Scalars['ID']['output'];
}

export interface RoomAvailabilityOutput {
  __typename?: 'RoomAvailabilityOutput';
  alerta_por_disponibilidad: Scalars['Boolean']['output'];
  alerta_por_turnos_atencion?: Maybe<Scalars['Boolean']['output']>;
  reservas_del_dia: Scalars['Float']['output'];
  tipo_habitacion: Scalars['String']['output'];
  turnos_en_espera?: Maybe<Scalars['Float']['output']>;
}

export interface SalesByTurno {
  __typename?: 'SalesByTurno';
  subtotal: Scalars['Float']['output'];
  turno: Scalars['String']['output'];
}

export interface SalesTicketsByTurno {
  __typename?: 'SalesTicketsByTurno';
  nombre: Scalars['String']['output'];
  total_extras: Scalars['Float']['output'];
  total_ordenes: Scalars['Float']['output'];
  total_propinas: Scalars['Float']['output'];
  total_rentas: Scalars['Float']['output'];
  total_reservas: Scalars['Float']['output'];
  total_restaurante: Scalars['Float']['output'];
}

export interface Salida {
  __typename?: 'Salida';
  /** Almacen-articulo sobre el cual se efectuó el movimiento de salida */
  almacen_articulo?: Maybe<AlmacenArticulo>;
  almacen_articulo_id: Scalars['ID']['output'];
  articulo?: Maybe<Articulo>;
  cantidad: Scalars['Float']['output'];
  colaborador_id: Scalars['ID']['output'];
  comentario?: Maybe<Scalars['String']['output']>;
  detalle_orden_id?: Maybe<Scalars['ID']['output']>;
  fecha_salida: Scalars['DateTime']['output'];
  hotel_id: Scalars['ID']['output'];
  motivo: Motivo;
  responsable?: Maybe<Colaborador>;
  salida_id: Scalars['ID']['output'];
}

export interface SearchAlmacenesArticulosOutput {
  __typename?: 'SearchAlmacenesArticulosOutput';
  almacenes_articulos: Array<AlmacenArticulo>;
  paginacion: DatosPaginationOutput;
}

export interface SearchColaboradoresForTaskByNombrePuestosInput {
  hotel_id: Scalars['ID']['input'];
  nombre_puesto: Array<Scalars['String']['input']>;
}

export interface SearchColaboradoresForTaskInput {
  hotel_id: Scalars['ID']['input'];
  nombre_puesto?: InputMaybe<Scalars['String']['input']>;
  nombres_puestos?: InputMaybe<InclusionSearchInput>;
}

export interface SearchHistorialEstadosComandaOutput {
  __typename?: 'SearchHistorialEstadosComandaOutput';
  historial_estados_comanda: Array<HistorialEstadoComanda>;
  paginacion: DatosPaginationOutput;
}

export interface SearchHistorialEstadosOrdenOutput {
  __typename?: 'SearchHistorialEstadosOrdenOutput';
  historial_estados_orden: Array<HistorialEstadoOrden>;
  paginacion: DatosPaginationOutput;
}

export interface SearchSalidasOutput {
  __typename?: 'SearchSalidasOutput';
  salidas: Array<Salida>;
}

export interface SendNotificationInput {
  notificacion_id: Scalars['ID']['input'];
}

export interface Servicio {
  __typename?: 'Servicio';
  eliminado: Scalars['Boolean']['output'];
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  /** Nombre del servicio */
  nombre: Scalars['String']['output'];
  servicio_id: Scalars['ID']['output'];
}

export interface SubcategoriaGasto {
  __typename?: 'SubcategoriaGasto';
  categoria_gasto: CategoriaGasto;
  categoria_id: Scalars['ID']['output'];
  eliminado: Scalars['Boolean']['output'];
  monto: Scalars['Float']['output'];
  subcategoria: Scalars['String']['output'];
  subcategoria_gasto_id: Scalars['ID']['output'];
}

export interface SubcategoriaProducto {
  __typename?: 'SubcategoriaProducto';
  categoria: CategoriaArticulo;
  categoria_id: Scalars['ID']['output'];
  subcategoria: Scalars['String']['output'];
  subcategoria_id: Scalars['ID']['output'];
}

export enum SubestadosHabitaciones {
  OcupadaLimpieza = 'ocupada_limpieza'
}

export interface Subscription {
  __typename?: 'Subscription';
  checkColaborador: Colaborador;
  checkColaboradores: Array<Colaborador>;
  /** Suscripción para obtener la disponibilidad de habitaciones en tiempo real */
  checkDisponibilidadHabitaciones?: Maybe<ListenDisponibilidadHabitacionesSubOutput>;
  checkHabitaciones: Array<Habitacion>;
  checkHotel: Hotel;
  checkMesas: Mesa;
  checkOrdenes?: Maybe<ListenOrdenesStateSubOutput>;
}


export interface SubscriptionCheckColaboradorArgs {
  colaborador_id: Scalars['ID']['input'];
}


export interface SubscriptionCheckColaboradoresArgs {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['ID']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  en_turno?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  fecha_baja?: InputMaybe<DateSearchInput>;
  fecha_cumpleanios?: InputMaybe<DateSearchInput>;
  fecha_ingreso?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  hotel_id_filter: Scalars['ID']['input'];
  nombre?: InputMaybe<Scalars['String']['input']>;
  numero_colaborador?: InputMaybe<Scalars['String']['input']>;
  numero_id?: InputMaybe<Scalars['String']['input']>;
  pagination_options?: InputMaybe<PageOptionsArgs>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
  telefono_emergencia?: InputMaybe<Scalars['String']['input']>;
  telefono_personal?: InputMaybe<Scalars['String']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}


export interface SubscriptionCheckHabitacionesArgs {
  hotel_id_filter: Scalars['ID']['input'];
}


export interface SubscriptionCheckHotelArgs {
  hotel_id_filter: Scalars['ID']['input'];
}


export interface SubscriptionCheckOrdenesArgs {
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  consumo_interno_colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado_orden?: InputMaybe<EstadosOrdenHistorial>;
  estado_pago?: InputMaybe<Array<EstadoPagoOrdenes>>;
  fecha_cobro?: InputMaybe<DateSearchInput>;
  fecha_registro?: InputMaybe<DateSearchInput>;
  filter_by_detalle_orden_state?: InputMaybe<Array<EstadosDetalleOrden>>;
  filter_comanda?: InputMaybe<Scalars['Boolean']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  orden?: InputMaybe<Scalars['String']['input']>;
  orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  pago_id?: InputMaybe<Scalars['ID']['input']>;
  panel_no_visible?: InputMaybe<Scalars['Boolean']['input']>;
  renta_id?: InputMaybe<Scalars['ID']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface SubtotalesReserva {
  __typename?: 'SubtotalesReserva';
  total_experiencias: Scalars['Float']['output'];
  total_habitacion: Scalars['Float']['output'];
  total_hospedajes_extra: Scalars['Float']['output'];
  total_personas_extra: Scalars['Float']['output'];
}

export interface Surtido {
  __typename?: 'Surtido';
  almacen: Almacen;
  /** Almacen-articulo sobre el cual se efectuó el movimiento de surtido */
  almacen_articulo?: Maybe<AlmacenArticulo>;
  almacen_articulo_id: Scalars['ID']['output'];
  articulo: Articulo;
  cantidad: Scalars['Float']['output'];
  colaborador: Colaborador;
  colaborador_id: Scalars['String']['output'];
  comentario?: Maybe<Scalars['String']['output']>;
  costo_total: Scalars['Float']['output'];
  costo_unitario: Scalars['Float']['output'];
  fecha_ingreso: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  numero_orden_factura?: Maybe<Scalars['String']['output']>;
  surtido_id: Scalars['ID']['output'];
  tipo: TiposSurtido;
}

export interface Suscripcion {
  __typename?: 'Suscripcion';
  eliminado: Scalars['Boolean']['output'];
  estatus: Scalars['String']['output'];
  fecha_expiracion: Scalars['DateTime']['output'];
  fecha_inicio: Scalars['DateTime']['output'];
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  modulos?: Maybe<Array<Modulo>>;
  suscripcion_id: Scalars['ID']['output'];
}

export interface SwitchTaskBtwColabInput {
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  colaborador_tarea_id: Array<Scalars['ID']['input']>;
  descripcion_tarea: Scalars['String']['input'];
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  sin_personal_asignado: Scalars['Boolean']['input'];
  tarea: CreateTareaInput;
  tarea_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_limpieza?: InputMaybe<TiposLimpiezas>;
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface SwitchTaskPartialInput {
  colaborador_id: Scalars['ID']['input'];
  colaborador_tarea_id: Scalars['ID']['input'];
}

export interface SwitchTaskRoomInput {
  estado_habitacion_actual: Estados_Habitaciones;
  estado_habitacion_nueva: Estados_Habitaciones;
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  switch_colaboradores: Array<SwitchTaskPartialInput>;
  usuario_id: Scalars['ID']['input'];
}

export interface SwitchTaskWithRoomStateInput {
  colaborador_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  colaborador_tarea_id: Array<Scalars['ID']['input']>;
  comentarios?: InputMaybe<Array<CommentTaskInput>>;
  estado_habitacion: Estados_Habitaciones;
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  tarea: CreateTareaInput;
  tarea_id?: InputMaybe<Scalars['ID']['input']>;
  tipo_limpieza?: InputMaybe<TiposLimpiezas>;
  usuario_id: Scalars['ID']['input'];
}

export enum Tamano {
  Lg = 'lg',
  Md = 'md',
  Mxl = 'mxl',
  Sm = 'sm',
  Xl = 'xl',
  Xs = 'xs'
}

export enum TamanoMesa {
  Lg = 'lg',
  Md = 'md',
  Mxl = 'mxl',
  Sm = 'sm',
  Xl = 'xl',
  Xs = 'xs'
}

export interface Tarea {
  __typename?: 'Tarea';
  descripcion: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  nombre: Scalars['String']['output'];
  /** Puesto de trabajo asociado a la tarea */
  puesto?: Maybe<Puesto>;
  puesto_id: Scalars['ID']['output'];
  tarea_id: Scalars['ID']['output'];
  tipo: TiposTarea;
}

export interface Tarifa {
  __typename?: 'Tarifa';
  costo_early_checkin: Scalars['Float']['output'];
  costo_habitacion: Scalars['Float']['output'];
  costo_hora_extra: Scalars['Float']['output'];
  costo_hospedaje_extra: Scalars['Float']['output'];
  costo_persona_extra: Scalars['Float']['output'];
  /** Costo de la reserva para la tarifa según los dias de disponibilidad */
  costo_reserva?: Maybe<Scalars['Float']['output']>;
  dias_disponibles: Array<DiasDisponibles>;
  duracion_renta: Scalars['Float']['output'];
  eliminado: Scalars['Boolean']['output'];
  estatus: EstatusTarifa;
  fecha_final: Scalars['DateTime']['output'];
  fecha_inicio: Scalars['DateTime']['output'];
  hora_checkin: Scalars['String']['output'];
  hora_checkout: Scalars['String']['output'];
  hora_final: Scalars['String']['output'];
  hora_inicio: Scalars['String']['output'];
  horas_extra_max?: Maybe<Scalars['Float']['output']>;
  hospedajes_extra_max?: Maybe<Scalars['Float']['output']>;
  hotel: Hotel;
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  pantalla_disponibilidad?: Maybe<Scalars['Boolean']['output']>;
  personas_extra_max?: Maybe<Scalars['Float']['output']>;
  tarifa_id: Scalars['ID']['output'];
  tarifa_imas?: Maybe<Scalars['String']['output']>;
  tipo_alojamiento: TiposAlojamientos;
  tipo_habitacion_id: Scalars['ID']['output'];
  tipo_tarifa: TipoTarifa;
}

export interface Ticket {
  __typename?: 'Ticket';
  anticipo?: Maybe<Scalars['Float']['output']>;
  anticipos_validos?: Maybe<Scalars['Float']['output']>;
  cancelado: Scalars['Boolean']['output'];
  /** colaborador_id responsable/asociado a la venta del ticket */
  colaborador_id?: Maybe<Scalars['ID']['output']>;
  comanda?: Maybe<Scalars['String']['output']>;
  consumo_interno: Scalars['Boolean']['output'];
  /** corte_id al que pertenece el ticket */
  corte_id?: Maybe<Scalars['ID']['output']>;
  cortesia: Scalars['Boolean']['output'];
  data: DataTicket;
  easyrewards_id?: Maybe<Scalars['String']['output']>;
  /** Obtiene los extras asociados al ticket cuando el origen es extra_renta */
  extras_ids?: Maybe<Array<Extra>>;
  fecha_cancelacion?: Maybe<Scalars['DateTime']['output']>;
  fecha_impresion: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  folio_orden?: Maybe<Scalars['String']['output']>;
  folio_renta?: Maybe<Scalars['String']['output']>;
  gasto?: Maybe<GastoTicket>;
  historial_cambios?: Maybe<DataHistorialCambiosTicket>;
  /** Información del Hotel de la Habitación */
  hotel?: Maybe<Hotel>;
  hotel_id: Scalars['ID']['output'];
  monto_fajilla?: Maybe<Scalars['Float']['output']>;
  motivo_cancelacion?: Maybe<Scalars['String']['output']>;
  numero_mesa?: Maybe<Scalars['String']['output']>;
  /** Información de la Reserva asociada al ticket */
  reserva?: Maybe<Reserva>;
  reserva_id?: Maybe<Scalars['ID']['output']>;
  saldo?: Maybe<Scalars['Float']['output']>;
  ticket_id: Scalars['ID']['output'];
  usuario?: Maybe<Usuario>;
  /** Usuario que autorizo/ejecuto la cancelacion del ticket */
  usuario_cancelacion_id?: Maybe<Scalars['ID']['output']>;
  usuario_id: Scalars['ID']['output'];
}

export enum TipoAlmacen {
  Deposito = 'deposito',
  Suministro = 'suministro'
}

export enum TipoArticulo {
  Insumo = 'insumo',
  Proceso = 'proceso',
  Receta = 'receta',
  Venta = 'venta'
}

export interface TipoBloqueo {
  __typename?: 'TipoBloqueo';
  /** Listado de claves para abreviaciones en cards */
  claves?: Maybe<Array<ClaveTipoBloqueo>>;
  /** Indica si el registro está eliminado */
  eliminado: Scalars['Boolean']['output'];
  /** Identificador del hotel al que pertenece */
  hotel_id: Scalars['ID']['output'];
  /** Nombre del tipo de bloqueo */
  nombre: Scalars['String']['output'];
  /** Identificador único del tipo de bloqueo */
  tipo_bloqueo_id: Scalars['ID']['output'];
}

export interface TipoHabitacion {
  __typename?: 'TipoHabitacion';
  amenidades: Array<Scalars['String']['output']>;
  camas: Array<Cama>;
  clave: Scalars['String']['output'];
  descripcion: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  foto?: Maybe<Scalars['String']['output']>;
  habitaciones?: Maybe<Array<Habitacion>>;
  hotel_id: Scalars['ID']['output'];
  /** Limite de reservas por dia */
  limite_reservas: Scalars['Float']['output'];
  minutos_entrada: Scalars['Float']['output'];
  minutos_limpieza_detallada: Scalars['Float']['output'];
  minutos_limpieza_normal: Scalars['Float']['output'];
  minutos_limpieza_retoque: Scalars['Float']['output'];
  minutos_pendiente_supervision: Scalars['Float']['output'];
  minutos_sucia: Scalars['Float']['output'];
  minutos_supervision: Scalars['Float']['output'];
  nombre: Scalars['String']['output'];
  nomenclatura?: Maybe<Scalars['String']['output']>;
  personas_incluidas: Scalars['Int']['output'];
  tipo_habitacion_id: Scalars['ID']['output'];
}

export interface TipoHabitacionPartialDetail {
  __typename?: 'TipoHabitacionPartialDetail';
  amenidades: Array<Scalars['String']['output']>;
  camas: Array<Cama>;
  clave: Scalars['String']['output'];
  descripcion: Scalars['String']['output'];
  /** Numero de habitaciones disponibles del tipo de habitacion */
  disponibles?: Maybe<Scalars['Int']['output']>;
  eliminado: Scalars['Boolean']['output'];
  foto?: Maybe<Scalars['String']['output']>;
  habitaciones?: Maybe<Array<Habitacion>>;
  hotel_id: Scalars['ID']['output'];
  /** Limite de reservas por dia */
  limite_reservas: Scalars['Float']['output'];
  minutos_entrada: Scalars['Float']['output'];
  minutos_limpieza_detallada: Scalars['Float']['output'];
  minutos_limpieza_normal: Scalars['Float']['output'];
  minutos_limpieza_retoque: Scalars['Float']['output'];
  minutos_pendiente_supervision: Scalars['Float']['output'];
  minutos_sucia: Scalars['Float']['output'];
  minutos_supervision: Scalars['Float']['output'];
  nombre: Scalars['String']['output'];
  nomenclatura?: Maybe<Scalars['String']['output']>;
  personas_incluidas: Scalars['Int']['output'];
  /** Tarifa, de tipo renta por defecto, para el tipo de habitacion */
  tarifa?: Maybe<Tarifa>;
  tarifa_id?: Maybe<Scalars['ID']['output']>;
  tipo_habitacion_id: Scalars['ID']['output'];
  /** Todos los turnos en_espera y en_curso para el tipo de habitacion */
  turnos_atencion?: Maybe<Array<TurnoAtencion>>;
}


export interface TipoHabitacionPartialDetailTurnos_AtencionArgs {
  estado?: InputMaybe<Array<EstadosTurnosAtencion>>;
}

export interface TipoHabitacionSubDetail {
  __typename?: 'TipoHabitacionSubDetail';
  accion: DisponibilidadPanelAction;
  tipo_habitacion: TipoHabitacionPartialDetail;
}

export interface TipoMantenimiento {
  __typename?: 'TipoMantenimiento';
  /** Listado de claves para abreviaciones en cards */
  claves?: Maybe<Array<ClaveTipoMantenimiento>>;
  /** Indica si el registro está eliminado */
  eliminado: Scalars['Boolean']['output'];
  /** Identificador del hotel al que pertenece */
  hotel_id: Scalars['ID']['output'];
  /** Nombre del tipo de mantenimiento */
  nombre: Scalars['String']['output'];
  /** Identificador único del tipo de mantenimiento */
  tipo_mantenimiento_id: Scalars['ID']['output'];
}

export enum TipoMovimientoHistorialInventario {
  Caducado = 'caducado',
  ConsumoInterno = 'consumo_interno',
  Devolucion = 'devolucion',
  Faltante = 'faltante',
  Merma = 'merma',
  Nuevo = 'nuevo',
  Proceso = 'proceso',
  Receta = 'receta',
  Resurtido = 'resurtido',
  Transferencia = 'transferencia',
  Venta = 'venta'
}

export enum TipoNotificacion {
  CortesCaratulaMensual = 'cortes_caratula_mensual',
  CortesCortesDiarios = 'cortes_cortes_diarios',
  GastosPresupuestoExcedido = 'gastos_presupuesto_excedido',
  HabitacionesOcupacionMaximaAlcanzada = 'habitaciones_ocupacion_maxima_alcanzada',
  HabitacionesSinHabitacionesDisponibles = 'habitaciones_sin_habitaciones_disponibles',
  IncidenciasGeneral = 'incidencias_general',
  IncidenciasIncidenciasAltas = 'incidencias_incidencias_altas'
}

export enum TipoOrden {
  Mostrador = 'mostrador',
  Restaurante = 'restaurante',
  RoomService = 'room_service'
}

export enum TipoOrdenPanelCocina {
  Comanda = 'comanda',
  Orden = 'orden'
}

export enum TipoOrdenamiento {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum TipoTarifa {
  Renta = 'renta',
  RentaReserva = 'renta_reserva',
  Reserva = 'reserva'
}

export enum TiposAlojamientos {
  Hotel = 'hotel',
  Motel = 'motel'
}

export enum TiposAutenticacion {
  ApiKey = 'API_KEY',
  DigestAuth = 'DIGEST_AUTH'
}

export enum TiposCamas {
  Individual = 'individual',
  King = 'king',
  Matrimonial = 'matrimonial',
  PresidentialKing = 'presidential_king',
  Queen = 'queen'
}

export enum TiposCancelaciones {
  Devolucion = 'devolucion',
  Merma = 'merma'
}

export enum TiposEntradas {
  APie = 'A_Pie',
  Auto = 'Auto'
}

export enum TiposExtras {
  Hora = 'hora',
  Hospedaje = 'hospedaje',
  Persona = 'persona'
}

export enum TiposIncidencias {
  Limpieza = 'limpieza',
  MalComportamiento = 'mal_comportamiento',
  Mantenimiento = 'mantenimiento',
  ObjetoOlvidado = 'objeto_olvidado'
}

export enum TiposLimpiezas {
  Detallada = 'detallada',
  Normal = 'normal',
  Retoque = 'retoque'
}

export enum TiposPagos {
  Amex = 'amex',
  ConsumoInterno = 'consumo_interno',
  Cortesia = 'cortesia',
  DepositoOTransferencia = 'deposito_o_transferencia',
  Efectivo = 'efectivo',
  LovePoints = 'love_points',
  VisaOMastercard = 'visa_o_mastercard'
}

export enum TiposSurtido {
  Surtido = 'surtido',
  Transferencia = 'transferencia'
}

export enum TiposTarea {
  Limpieza = 'limpieza',
  Mantenimiento = 'mantenimiento',
  Supervision = 'supervision'
}

export interface TodayExtrasSales {
  __typename?: 'TodayExtrasSales';
  acumulado_extras: Array<SalesByTurno>;
}

export interface TodayOrdenesSales {
  __typename?: 'TodayOrdenesSales';
  acumulado_ordenes: Array<SalesByTurno>;
}

export interface TodayReservasSales {
  __typename?: 'TodayReservasSales';
  acumulado_reservas: Array<SalesByTurno>;
}

export interface TopBookingRoom {
  __typename?: 'TopBookingRoom';
  habitacion_id: Scalars['ID']['output'];
  ventas: Scalars['Float']['output'];
}

export interface TopRentalRoom {
  __typename?: 'TopRentalRoom';
  habitacion: Habitacion;
  ventas: Scalars['Float']['output'];
}

export interface TotalBillingPerDayRecepcionstOutput {
  __typename?: 'TotalBillingPerDayRecepcionstOutput';
  total_gasto: Scalars['Float']['output'];
}

export interface TotalesHotelOutput {
  __typename?: 'TotalesHotelOutput';
  cantidad_total: Scalars['Float']['output'];
  sumatoria_total: Scalars['Float']['output'];
}

export interface TotalesPropinasOutput {
  __typename?: 'TotalesPropinasOutput';
  total_efectivo: Scalars['Float']['output'];
  total_otros: Scalars['Float']['output'];
  total_propinas_recaudadas: Scalars['Float']['output'];
  total_roomservice: Scalars['Float']['output'];
  total_tarjeta: Scalars['Float']['output'];
  total_venta_habitacion: Scalars['Float']['output'];
}

export interface TotalesRepartoPropinasItemOutput {
  __typename?: 'TotalesRepartoPropinasItemOutput';
  total_aportaciones_a_fondo: Scalars['Float']['output'];
  total_comisiones_bancarias_propinas_por_ventas: Scalars['Float']['output'];
  total_comisiones_bancarias_sobre_fondo: Scalars['Float']['output'];
  total_fondos_de_propina: Scalars['Float']['output'];
  total_neto_propinas_por_ventas: Scalars['Float']['output'];
  total_pagos_correspondientes: Scalars['Float']['output'];
  total_propinas_recolectadas: Scalars['Float']['output'];
  total_subtotales_propina_por_ventas: Scalars['Float']['output'];
}

export interface TotalesRoomService {
  __typename?: 'TotalesRoomService';
  cantidad_total: Scalars['Float']['output'];
  monto_total: Scalars['Float']['output'];
}

export interface TraceStartHistorialLoginInput {
  hotel_id: Scalars['ID']['input'];
  sesion_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface Transaccion {
  __typename?: 'Transaccion';
  cantidad: Scalars['Float']['output'];
  eliminado: Scalars['Boolean']['output'];
  estatus: Scalars['String']['output'];
  fecha_creacion: Scalars['DateTime']['output'];
  metododepago_id: Scalars['ID']['output'];
  transaccion_id: Scalars['ID']['output'];
}

export interface TransferArticuloPartialDetailInput {
  almacen_destino_id: Scalars['ID']['input'];
  almacen_origen_id: Scalars['ID']['input'];
  articulo_id: Scalars['ID']['input'];
  cantidad: Scalars['Float']['input'];
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}

export interface TransferArticulosInput {
  hotel_id: Scalars['ID']['input'];
  transferencias: Array<TransferArticuloPartialDetailInput>;
  usuario_autorizo_id: Scalars['ID']['input'];
}

export interface TransferArticulosOutput {
  __typename?: 'TransferArticulosOutput';
  numero_articulos_transferidos: Scalars['Int']['output'];
}

export interface TurnOffTurnoColaboradoresInput {
  asistencia_id: Array<Scalars['ID']['input']>;
  colaborador_id: Array<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface TurnOnTurnoColaboradorInput {
  colaborador_id: Scalars['ID']['input'];
  comentarios?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface Turno {
  __typename?: 'Turno';
  eliminado: Scalars['Boolean']['output'];
  estado: EstadosTurno;
  hora_entrada: Scalars['String']['output'];
  hora_salida: Scalars['String']['output'];
  hotel_id: Scalars['ID']['output'];
  nombre: Scalars['String']['output'];
  turno_id: Scalars['ID']['output'];
}

export interface TurnoAtencion {
  __typename?: 'TurnoAtencion';
  colaborador?: Maybe<Colaborador>;
  estado: EstadosTurnosAtencion;
  fecha_registro: Scalars['DateTime']['output'];
  folio: Scalars['Int']['output'];
  /** Folio nomenclatura del tipo de habitacion con el numero de turno */
  folio_turno?: Maybe<Scalars['String']['output']>;
  hotel?: Maybe<Hotel>;
  hotel_id: Scalars['ID']['output'];
  nombre_o_matricula?: Maybe<Scalars['String']['output']>;
  tipo_habitacion?: Maybe<TipoHabitacion>;
  tipo_habitacion_id: Scalars['ID']['output'];
  turno_atencion_id: Scalars['ID']['output'];
  usuario_id: Scalars['ID']['output'];
}

export interface TurnosAtencionSubModesOutput {
  __typename?: 'TurnosAtencionSubModesOutput';
  evento?: Maybe<TipoHabitacionSubDetail>;
  lista?: Maybe<Array<TipoHabitacionPartialDetail>>;
  turno_en_curso?: Maybe<TurnoAtencion>;
}

export interface UltimaReserva {
  __typename?: 'UltimaReserva';
  reserva?: Maybe<Reserva>;
}

export interface UltimosConceptosPendientesDetailOutput {
  __typename?: 'UltimosConceptosPendientesDetailOutput';
  extra?: Maybe<Extra>;
  extra_id?: Maybe<Scalars['ID']['output']>;
  orden?: Maybe<Orden>;
  orden_id?: Maybe<Scalars['ID']['output']>;
  renta?: Maybe<Renta>;
  renta_id?: Maybe<Scalars['ID']['output']>;
}

export interface UnidadConversionArticulo {
  __typename?: 'UnidadConversionArticulo';
  eliminado: Scalars['Boolean']['output'];
  factor_conversion: Scalars['Float']['output'];
  fecha_eliminado?: Maybe<Scalars['DateTime']['output']>;
  fecha_registro: Scalars['DateTime']['output'];
  unidad_conversion_articulo_id: Scalars['ID']['output'];
  unidad_destino: Scalars['String']['output'];
  unidad_origen: Scalars['String']['output'];
}

export enum UnidadMedidasArticulo {
  Kg = 'Kg',
  L = 'L',
  Pz = 'Pz',
  G = 'g',
  M = 'm',
  ML = 'mL',
  Mg = 'mg',
  Mm = 'mm',
  Oz = 'oz'
}

export enum UnidadMedidasProduccion {
  Kg = 'Kg',
  L = 'L',
  Pz = 'Pz',
  G = 'g',
  M = 'm',
  ML = 'mL',
  Mg = 'mg',
  Mm = 'mm',
  Oz = 'oz'
}

export enum UnidadTiempoFiltro {
  Dia = 'dia',
  Mes = 'mes'
}

export interface UpdateAlmacenInput {
  almacen_id: Array<Scalars['ID']['input']>;
  categorias_articulos_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadoAlmacen>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_almacen?: InputMaybe<TipoAlmacen>;
  usuario_modifico_id: Scalars['ID']['input'];
}

export interface UpdateAlmacenesArticulosInput {
  almacen_articulo_id: Array<Scalars['ID']['input']>;
  almacen_id?: InputMaybe<Scalars['ID']['input']>;
  articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  costo?: InputMaybe<Scalars['Float']['input']>;
  fecha_movimiento?: InputMaybe<Scalars['DateTime']['input']>;
  precio?: InputMaybe<Scalars['Float']['input']>;
}

export interface UpdateApiKeyInput {
  activo?: InputMaybe<Scalars['Boolean']['input']>;
  api_key_id: Scalars['String']['input'];
  descripcion?: InputMaybe<Scalars['String']['input']>;
  key: Scalars['String']['input'];
}

export interface UpdateAportacionesPropinasRsInput {
  aportaciones_propinas_by_categoria: Array<AportacionPropinaRsDetailInput>;
}

/** Campos que pueden ser directamente modificados de la entidad Area */
export interface UpdateAreaInput {
  area_id: Scalars['ID']['input'];
  estado?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateArticuloInput {
  almacen_id?: InputMaybe<Scalars['ID']['input']>;
  articulo_id: Scalars['ID']['input'];
  cantidad_minima?: InputMaybe<Scalars['Float']['input']>;
  categoria_id?: InputMaybe<Scalars['String']['input']>;
  contenido?: InputMaybe<Scalars['Float']['input']>;
  costo?: InputMaybe<Scalars['Float']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadosArticulo>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_eliminado?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  folio?: InputMaybe<Scalars['String']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  imas_id?: InputMaybe<Scalars['String']['input']>;
  marca?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Float']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<TipoArticulo>;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
}

export interface UpdateArticulosInput {
  articulos: Array<UpdateArticuloInput>;
}

export interface UpdateAsistenciaInput {
  asistencia_id: Scalars['ID']['input'];
  asistio?: InputMaybe<Scalars['Boolean']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  comentario?: InputMaybe<Scalars['String']['input']>;
  hora_salida?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateCategoriaArticuloInput {
  categoria_id: Scalars['ID']['input'];
  descripcion?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  porcentaje_aportacion_propinas?: InputMaybe<Scalars['Float']['input']>;
}

export interface UpdateCategoriaGastosInput {
  categoria?: InputMaybe<Scalars['String']['input']>;
  categoria_id: Scalars['ID']['input'];
  limite_mensual?: InputMaybe<Scalars['Float']['input']>;
  presupuesto?: InputMaybe<Scalars['Float']['input']>;
}

export interface UpdateClienteInput {
  cliente_id: Scalars['ID']['input'];
  correo?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateColaboradorInput {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  area_id?: InputMaybe<Scalars['ID']['input']>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  colaborador_id: Scalars['ID']['input'];
  correo?: InputMaybe<Scalars['String']['input']>;
  direccion?: InputMaybe<Scalars['String']['input']>;
  en_turno?: InputMaybe<Scalars['Boolean']['input']>;
  /** Habilita/Deshabilita funciones de supervision (puesto Supervisor) para el colaborador */
  es_supervisor?: InputMaybe<Scalars['Boolean']['input']>;
  fecha_baja?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_cumpleanios?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_ingreso?: InputMaybe<Scalars['DateTime']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  nombre?: InputMaybe<Scalars['String']['input']>;
  numero_colaborador?: InputMaybe<Scalars['String']['input']>;
  numero_id?: InputMaybe<Scalars['String']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
  remover_foto?: InputMaybe<Scalars['Boolean']['input']>;
  rol_id?: InputMaybe<Scalars['ID']['input']>;
  sueldo?: InputMaybe<Scalars['Float']['input']>;
  telefono_emergencia?: InputMaybe<Scalars['String']['input']>;
  telefono_personal?: InputMaybe<Scalars['String']['input']>;
  template_sample?: InputMaybe<Array<Scalars['String']['input']>>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateColaboradorTurnoInput {
  colaborador_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  turno_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface UpdateComandaInput {
  comanda_id: Scalars['ID']['input'];
  fecha_modificacion?: InputMaybe<Scalars['DateTime']['input']>;
  folio?: InputMaybe<Scalars['Float']['input']>;
  orden_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateComentarioHabitacionInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  comentario_id: Scalars['ID']['input'];
  habitacion_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateConfiguracionFajillaInput {
  configuracion_fajilla_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
  valor: Scalars['Float']['input'];
}

export interface UpdateConfiguracionInventarioInput {
  configuracion_inventario_id: Scalars['ID']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  inventario_negativo?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface UpdateConfiguracionPropinaInput {
  configuracion_propina_id: Scalars['ID']['input'];
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  porcentaje_aportacion_vendedores?: InputMaybe<Scalars['Float']['input']>;
  porcentaje_comision_por_puntos?: InputMaybe<Scalars['Float']['input']>;
  porcentaje_venta_efectivo?: InputMaybe<Scalars['Float']['input']>;
  porcentaje_venta_tarjeta?: InputMaybe<Scalars['Float']['input']>;
}

export interface UpdateCredencialInput {
  activo?: InputMaybe<Scalars['Boolean']['input']>;
  /** Se debe enviar cuatro huellas */
  template_sample: Array<Scalars['String']['input']>;
  usuario_id: Scalars['ID']['input'];
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface UpdateEstadoHabitacionInput {
  comentario_estado?: InputMaybe<Scalars['String']['input']>;
  estado: Estados_Habitaciones;
  fecha_estado: Scalars['DateTime']['input'];
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  subestado?: InputMaybe<SubestadosHabitaciones>;
  usuario_id: Scalars['ID']['input'];
}

export interface UpdateEstadoOrdenOrDetalleInput {
  comanda_id?: InputMaybe<Scalars['ID']['input']>;
  detalle_orden_id?: InputMaybe<Array<Scalars['ID']['input']>>;
  estado: EstadosOrdenHistorial;
  orden_id?: InputMaybe<Scalars['ID']['input']>;
  /** Marca una orden para que ya no sea mostrada en el panel de cocina */
  panel_no_visible?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface UpdateEstadoOrdenOrDetalleOutput {
  __typename?: 'UpdateEstadoOrdenOrDetalleOutput';
  estado_destino: EstadosOrdenHistorial;
  estado_origen: EstadosOrdenHistorial;
  folio_orden?: Maybe<Scalars['String']['output']>;
  nombre_articulo?: Maybe<Scalars['String']['output']>;
  orden: Orden;
}

export interface UpdateExtraDetalleOrdenInput {
  extra_detalle_orden: Array<UpdateExtraDetalleOrdenPartialInfo>;
}

export interface UpdateExtraDetalleOrdenPartialInfo {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad: Scalars['Float']['input'];
  costo_con_iva: Scalars['Float']['input'];
  costo_sin_iva: Scalars['Float']['input'];
  detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  extra_detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  monto_iva: Scalars['Float']['input'];
}

export interface UpdateExtraDetalleOrdenPartialInfoOutput {
  __typename?: 'UpdateExtraDetalleOrdenPartialInfoOutput';
  almacen_articulo_id?: Maybe<Scalars['ID']['output']>;
  cantidad: Scalars['Float']['output'];
  costo_con_iva: Scalars['Float']['output'];
  costo_sin_iva: Scalars['Float']['output'];
  detalle_orden_id?: Maybe<Scalars['ID']['output']>;
  extra_detalle_orden_id: Scalars['ID']['output'];
  monto_iva: Scalars['Float']['output'];
}

export interface UpdateExtraInput {
  extra_id: Scalars['ID']['input'];
  fecha_pago?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id: Scalars['ID']['input'];
  motivo_cancelacion?: InputMaybe<Scalars['String']['input']>;
  numero?: InputMaybe<Scalars['Int']['input']>;
  tipo_extra?: InputMaybe<TiposExtras>;
}

export interface UpdateExtrasByDetalleOrdenIdRequest {
  detalle_orden_id: Scalars['ID']['input'];
  extra_detalle_orden: Array<UpdateExtraDetalleOrdenPartialInfo>;
}

export interface UpdateExtrasByDetalleOrdenIdResponse {
  __typename?: 'UpdateExtrasByDetalleOrdenIdResponse';
  detalle_orden_id: Scalars['ID']['output'];
  extra_detalle_orden: Array<UpdateExtraDetalleOrdenPartialInfoOutput>;
}

export interface UpdateFajillaInput {
  comentario?: InputMaybe<Scalars['String']['input']>;
  configuracion_fajilla_id: Scalars['ID']['input'];
  fajilla_id: Scalars['ID']['input'];
  monto: Scalars['Float']['input'];
  turno_id: Scalars['ID']['input'];
}

export interface UpdateGastoInput {
  caja_chica: Scalars['Boolean']['input'];
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  comentarios?: InputMaybe<Scalars['String']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_gasto?: InputMaybe<Scalars['DateTime']['input']>;
  gasto_id: Scalars['ID']['input'];
  metodo_pago?: InputMaybe<Scalars['String']['input']>;
  monto?: InputMaybe<Scalars['Float']['input']>;
  subcategoria_id?: InputMaybe<Scalars['String']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface UpdateGrupoHotelInput {
  grupo_hotel_id: Scalars['ID']['input'];
  nombre_grupo: Scalars['String']['input'];
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface UpdateHabitacionHotelInput {
  habitacion_id: Scalars['ID']['input'];
  hotel_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface UpdateHabitacionInRentaInput {
  habitacion_id: Scalars['ID']['input'];
  renta_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface UpdateHabitacionInput {
  habitacion_id: Scalars['ID']['input'];
  numero_habitacion?: InputMaybe<Scalars['String']['input']>;
  piso?: InputMaybe<Scalars['String']['input']>;
  usuario_id: Scalars['ID']['input'];
}

/** Campos que pueden ser directamente modificados de la entidad Habitacion */
export interface UpdateHabitacionTipoHabitacionInput {
  habitacion_id: Scalars['ID']['input'];
  tipo_habitacion_id: Scalars['ID']['input'];
  usuario_id: Scalars['ID']['input'];
}

export interface UpdateHistorialHabitacionDto {
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_estado?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  historial_habitacion_id: Scalars['ID']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  numero_habitacion?: InputMaybe<Scalars['String']['input']>;
  piso?: InputMaybe<Scalars['String']['input']>;
  subestado?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateHistorialVehiculoInput {
  habitacion?: InputMaybe<Scalars['String']['input']>;
  historial_vehiculo_id: Scalars['ID']['input'];
  motivo_entrada?: InputMaybe<Scalars['String']['input']>;
  vehiculo: VehiculoDataEditDetailInput;
}

export interface UpdateHotelInput {
  calle?: InputMaybe<Scalars['String']['input']>;
  ciudad?: InputMaybe<Scalars['String']['input']>;
  colonia?: InputMaybe<Scalars['String']['input']>;
  configurations?: InputMaybe<ConfigurationsInput>;
  correo?: InputMaybe<Scalars['String']['input']>;
  cp?: InputMaybe<Scalars['String']['input']>;
  easyrewards_sucursal_id?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  logo_hotel?: InputMaybe<Scalars['String']['input']>;
  nombre_hotel?: InputMaybe<Scalars['String']['input']>;
  numero_exterior?: InputMaybe<Scalars['Float']['input']>;
  numero_interior?: InputMaybe<Scalars['String']['input']>;
  razon_social?: InputMaybe<Scalars['String']['input']>;
  rfc?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
  /** zona horaria del hotel */
  zona_horaria?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateIncidenciaInput {
  area?: InputMaybe<Scalars['String']['input']>;
  detalle?: InputMaybe<Scalars['String']['input']>;
  habitacion_id?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  huesped?: InputMaybe<Scalars['String']['input']>;
  imagenes?: InputMaybe<Array<ImagenIncidenciaInput>>;
  incidencia_id: Scalars['ID']['input'];
  matricula?: InputMaybe<Scalars['String']['input']>;
  severidad?: InputMaybe<Scalars['String']['input']>;
  tipo_incidencia?: InputMaybe<Scalars['String']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateMantenimientoInput {
  /** Consumo de agua */
  agua?: InputMaybe<Scalars['Float']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_actualizacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  /** Consumo de gas */
  gas?: InputMaybe<Scalars['Float']['input']>;
  /** Consumo de luz */
  luz?: InputMaybe<Scalars['Float']['input']>;
  mantenimiento_id: Scalars['ID']['input'];
  turno_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateMesaAsignadaInput {
  colaborador_asignado_id?: InputMaybe<Scalars['ID']['input']>;
  mesa_asignada_id: Scalars['ID']['input'];
  mesa_id?: InputMaybe<Scalars['ID']['input']>;
  orden_id?: InputMaybe<Scalars['ID']['input']>;
  usuario_modifico_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateMesaInput {
  cantidad_personas?: InputMaybe<Scalars['Float']['input']>;
  eliminado?: InputMaybe<Scalars['Boolean']['input']>;
  estado?: InputMaybe<EstadoMesa>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  mesa_id: Scalars['ID']['input'];
  motivo_bloqueo?: InputMaybe<Scalars['String']['input']>;
  numero_mesa?: InputMaybe<Scalars['String']['input']>;
  usuario_modifico_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateMotivoIngresoVehiculoDto {
  /** Identificador del hotel al que pertenece el motivo de ingreso */
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  motivo_ingreso_id: Scalars['ID']['input'];
  /** Nombre del motivo de ingreso */
  nombre?: InputMaybe<Scalars['String']['input']>;
}

export interface UpdateOrdenInput {
  consumo_interno_colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  detalles_orden: Array<CreateDetalleOrdenPartialInfoInput>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  hotel_id: Scalars['ID']['input'];
  monto_iva: Scalars['Float']['input'];
  orden_id: Scalars['ID']['input'];
  /** Marca una orden para que ya no sea mostrada en el panel de cocina */
  panel_no_visible?: InputMaybe<Scalars['Boolean']['input']>;
  total_con_iva: Scalars['Float']['input'];
  total_sin_iva: Scalars['Float']['input'];
  usuario_id: Scalars['String']['input'];
}

export interface UpdatePagoInput {
  fecha_pago?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  pago_id: Scalars['ID']['input'];
  total?: InputMaybe<Scalars['Float']['input']>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdatePagoRentaInput {
  pago_id?: InputMaybe<Scalars['ID']['input']>;
  pago_renta_id: Scalars['ID']['input'];
  renta_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdatePagoReservasInput {
  pago_id?: InputMaybe<Scalars['ID']['input']>;
  pago_reserva_id: Scalars['ID']['input'];
  reserva_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdatePosicionHabitacionInput {
  habitacion_id: Scalars['ID']['input'];
  posicion: PosicionInput;
}

export interface UpdatePosicionMesaInput {
  mesa_id: Scalars['ID']['input'];
  posicion: PosicionMesaInput;
}

export interface UpdatePropinasEsquemaInput {
  propinas_esquema: Array<PropinaEsquemaItemInput>;
}

export interface UpdatePuestoInput {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  /** Porcentaje que le corresponde del total de propinas recaudadas */
  porcentaje_propina?: InputMaybe<Scalars['Float']['input']>;
  puesto_id: Scalars['ID']['input'];
}

export interface UpdateRecetaInput {
  articulo_id: Scalars['ID']['input'];
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  contenido?: InputMaybe<Scalars['Float']['input']>;
  costo_actual?: InputMaybe<Scalars['Float']['input']>;
  estado?: InputMaybe<EstadosArticulo>;
  extra?: InputMaybe<Scalars['Boolean']['input']>;
  folio?: InputMaybe<Scalars['String']['input']>;
  foto?: InputMaybe<Scalars['String']['input']>;
  ingredientes?: InputMaybe<Array<IngredienteRecetaInput>>;
  marca?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  precio?: InputMaybe<Scalars['Float']['input']>;
  unidad?: InputMaybe<UnidadMedidasArticulo>;
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateRentaInput {
  comentarios?: InputMaybe<Scalars['String']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<EstadosRentas>;
  fecha_cancelacion?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_fin?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_salida?: InputMaybe<Scalars['DateTime']['input']>;
  horas_extra?: InputMaybe<Scalars['Float']['input']>;
  hospedajes_extra?: InputMaybe<Scalars['Float']['input']>;
  monto_devuelto_cancelacion?: InputMaybe<Scalars['Float']['input']>;
  motivo_cancelacion?: InputMaybe<Scalars['String']['input']>;
  nombre_huesped?: InputMaybe<Scalars['String']['input']>;
  numero_personas?: InputMaybe<Scalars['Float']['input']>;
  personas_extra?: InputMaybe<Scalars['Float']['input']>;
  placas?: InputMaybe<Scalars['String']['input']>;
  renta_id: Scalars['ID']['input'];
  tipo_entrada?: InputMaybe<TiposEntradas>;
  total?: InputMaybe<Scalars['Float']['input']>;
}

export interface UpdateReservaInput {
  cliente_id?: InputMaybe<Scalars['ID']['input']>;
  codigo_ota?: InputMaybe<Scalars['String']['input']>;
  comentarios: Array<Scalars['String']['input']>;
  correo_huesped?: InputMaybe<Scalars['String']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
  easyrewards_id?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<EstadosReservas>;
  experiencias_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  fecha_entrada?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_salida?: InputMaybe<Scalars['DateTime']['input']>;
  habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  hospedajes_extra?: Scalars['Int']['input'];
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre_huesped: Scalars['String']['input'];
  numero_personas?: InputMaybe<Scalars['Int']['input']>;
  origen?: InputMaybe<OrigenRservas>;
  pago?: InputMaybe<CreatePagoInput>;
  personas_extras?: InputMaybe<Scalars['Int']['input']>;
  reserva_id: Scalars['ID']['input'];
  servicios_reserva: Array<Scalars['String']['input']>;
  tarifa_id?: InputMaybe<Scalars['ID']['input']>;
  telefono_huesped?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id: Scalars['ID']['input'];
  total: Scalars['Float']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UpdateReservaResponse {
  __typename?: 'UpdateReservaResponse';
  reserva: Reserva;
  ticket: ReturnIdTicketResponse;
}

export interface UpdateRolInput {
  nombre: Scalars['String']['input'];
  rol_id: Scalars['ID']['input'];
}

export interface UpdateSalidaInput {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  colaborador_id?: InputMaybe<Scalars['ID']['input']>;
  comentario?: InputMaybe<Scalars['String']['input']>;
  detalle_orden_id?: InputMaybe<Scalars['ID']['input']>;
  fecha_salida?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  motivo?: InputMaybe<Motivo>;
  salida_id: Array<Scalars['ID']['input']>;
}

export interface UpdateServicioInput {
  hotel_id: Scalars['ID']['input'];
  /** Nombre del servicio */
  nombre?: InputMaybe<Scalars['String']['input']>;
  servicio_id: Scalars['ID']['input'];
}

export interface UpdateSubcategoriaGastosInput {
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  subcategoria?: InputMaybe<Scalars['String']['input']>;
  subcategoria_gasto_id: Scalars['ID']['input'];
}

export interface UpdateSubcategoriaProductoInput {
  categoria_id?: InputMaybe<Scalars['ID']['input']>;
  subcategoria?: InputMaybe<Scalars['String']['input']>;
  subcategoria_id: Scalars['ID']['input'];
}

export interface UpdateSurtidoInput {
  almacen_articulo_id?: InputMaybe<Scalars['ID']['input']>;
  cantidad?: InputMaybe<Scalars['Float']['input']>;
  colaborador_id: Scalars['ID']['input'];
  comentario?: InputMaybe<Scalars['String']['input']>;
  costo_total?: InputMaybe<Scalars['Float']['input']>;
  costo_unitario?: InputMaybe<Scalars['Float']['input']>;
  fecha_ingreso?: InputMaybe<Scalars['DateTime']['input']>;
  hotel_id: Scalars['ID']['input'];
  numero_orden_factura?: InputMaybe<Scalars['String']['input']>;
  surtido_id: Scalars['ID']['input'];
  tipo?: InputMaybe<TiposSurtido>;
}

export interface UpdateSuscripcionInput {
  estatus?: InputMaybe<Scalars['String']['input']>;
  fecha_expiracion?: InputMaybe<Scalars['DateTime']['input']>;
  suscripcion_id: Scalars['ID']['input'];
}

export interface UpdateTareaInput {
  descripcion?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  puesto_id?: InputMaybe<Scalars['ID']['input']>;
  tarea_id: Scalars['ID']['input'];
  tipo?: InputMaybe<TiposTarea>;
}

export interface UpdateTarifaDto {
  costo_early_checkin?: InputMaybe<Scalars['Float']['input']>;
  costo_habitacion?: InputMaybe<Scalars['Float']['input']>;
  costo_hora_extra?: InputMaybe<Scalars['Float']['input']>;
  costo_hospedaje_extra?: InputMaybe<Scalars['Float']['input']>;
  costo_persona_extra?: InputMaybe<Scalars['Float']['input']>;
  dias_disponibles?: InputMaybe<Array<DiasDisponibles>>;
  duracion_renta?: InputMaybe<Scalars['Float']['input']>;
  fecha_final?: InputMaybe<Scalars['DateTime']['input']>;
  fecha_inicio?: InputMaybe<Scalars['DateTime']['input']>;
  hora_checkin?: InputMaybe<Scalars['String']['input']>;
  hora_checkout?: InputMaybe<Scalars['String']['input']>;
  hora_final?: InputMaybe<Scalars['String']['input']>;
  hora_inicio?: InputMaybe<Scalars['String']['input']>;
  horas_extra_max?: InputMaybe<Scalars['Float']['input']>;
  hospedajes_extra_max?: InputMaybe<Scalars['Float']['input']>;
  nombre: Scalars['String']['input'];
  pantalla_disponibilidad?: InputMaybe<Scalars['Boolean']['input']>;
  personas_extra_max?: InputMaybe<Scalars['Float']['input']>;
  tarifa_id: Scalars['ID']['input'];
  tipo_alojamiento?: InputMaybe<TiposAlojamientos>;
  tipo_tarifa?: InputMaybe<TipoTarifa>;
}

export interface UpdateTipoBloqueoDto {
  /** Listado de claves del tipo de bloqueo */
  claves?: InputMaybe<Array<ClaveTipoBloqueoInput>>;
  /** Identificador del hotel al que pertenece el tipo de bloqueo */
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  /** Nombre del tipo de bloqueo */
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_bloqueo_id: Scalars['ID']['input'];
}

export interface UpdateTipoHabitacionDto {
  amenidades: Array<Scalars['String']['input']>;
  camas?: InputMaybe<Array<CamaInput>>;
  clave?: InputMaybe<Scalars['String']['input']>;
  descripcion?: InputMaybe<Scalars['String']['input']>;
  /** Limite de reservas por dia */
  limite_reservas?: InputMaybe<Scalars['Float']['input']>;
  minutos_entrada?: InputMaybe<Scalars['Float']['input']>;
  minutos_limpieza_detallada?: InputMaybe<Scalars['Float']['input']>;
  minutos_limpieza_normal?: InputMaybe<Scalars['Float']['input']>;
  minutos_limpieza_retoque?: InputMaybe<Scalars['Float']['input']>;
  minutos_pendiente_supervision: Scalars['Float']['input'];
  minutos_sucia: Scalars['Float']['input'];
  minutos_supervision: Scalars['Float']['input'];
  nombre?: InputMaybe<Scalars['String']['input']>;
  personas_incluidas: Scalars['Int']['input'];
  tipo_habitacion_id: Scalars['ID']['input'];
}

export interface UpdateTipoLimpiezaInput {
  colaboradores_tareas_ids: Array<Scalars['ID']['input']>;
  hotel_id: Scalars['ID']['input'];
  tipo_limpieza?: InputMaybe<TiposLimpiezas>;
}

export interface UpdateTipoMantenimientoDto {
  /** Listado de claves del tipo de mantenimiento */
  claves?: InputMaybe<Array<ClaveTipoMantenimientoInput>>;
  /** Identificador del hotel al que pertenece el tipo de mantenimiento */
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  /** Nombre del tipo de mantenimiento */
  nombre?: InputMaybe<Scalars['String']['input']>;
  tipo_mantenimiento_id: Scalars['ID']['input'];
}

export interface UpdateTurnoAtencionInput {
  estado?: InputMaybe<EstadosTurnosAtencion>;
  fecha_registro?: InputMaybe<Scalars['DateTime']['input']>;
  folio?: InputMaybe<Scalars['Int']['input']>;
  nombre_o_matricula?: InputMaybe<Scalars['String']['input']>;
  tipo_habitacion_id?: InputMaybe<Scalars['ID']['input']>;
  turno_atencion_id: Scalars['ID']['input'];
  usuario_id?: InputMaybe<Scalars['ID']['input']>;
}

/** Campos que pueden ser directamente modificados de la entidad Turno */
export interface UpdateTurnoInput {
  estado?: InputMaybe<Scalars['String']['input']>;
  hora_entrada?: InputMaybe<Scalars['String']['input']>;
  hora_salida?: InputMaybe<Scalars['String']['input']>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  turno_id: Scalars['ID']['input'];
}

export interface UpdateUsuarioInput {
  apellido_materno?: InputMaybe<Scalars['String']['input']>;
  apellido_paterno?: InputMaybe<Scalars['String']['input']>;
  cliente_url?: InputMaybe<Scalars['String']['input']>;
  codigo?: InputMaybe<Scalars['String']['input']>;
  correo?: InputMaybe<Scalars['String']['input']>;
  estatus?: InputMaybe<Scalars['String']['input']>;
  nombre?: InputMaybe<Scalars['String']['input']>;
  origen?: InputMaybe<Scalars['String']['input']>;
  pais?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  puesto?: InputMaybe<Scalars['String']['input']>;
  telefono?: InputMaybe<Scalars['String']['input']>;
  usuario?: InputMaybe<Scalars['String']['input']>;
  usuario_id: Scalars['ID']['input'];
  verificado?: InputMaybe<Scalars['Boolean']['input']>;
}

export interface UpdateUsuariosNotificacionesInput {
  hotel_id?: InputMaybe<Scalars['String']['input']>;
  notificacion_id?: InputMaybe<Scalars['String']['input']>;
  /** Array de notificaciones a activar */
  notificaciones_activar?: InputMaybe<Array<TipoNotificacion>>;
  /** Array de notificaciones a desactivar */
  notificaciones_desactivar?: InputMaybe<Array<TipoNotificacion>>;
  usuario_id?: InputMaybe<Scalars['String']['input']>;
  usuario_notificaciones_id?: InputMaybe<Scalars['String']['input']>;
}

export interface Usuario {
  __typename?: 'Usuario';
  apellido_materno?: Maybe<Scalars['String']['output']>;
  apellido_paterno?: Maybe<Scalars['String']['output']>;
  codigo: Scalars['String']['output'];
  colaborador?: Maybe<Colaborador>;
  /** Configuración de las notificaciones del usuario en app mobile */
  configuracion_notificaciones?: Maybe<ConfiguracionNotificacionesOutput>;
  correo: Scalars['String']['output'];
  eliminado: Scalars['Boolean']['output'];
  /** dato estadístico */
  empresa_hotel: Scalars['String']['output'];
  estatus: Scalars['String']['output'];
  fecha_modificacion: Scalars['DateTime']['output'];
  fecha_registro: Scalars['DateTime']['output'];
  hotel?: Maybe<Array<Hotel>>;
  metodos_de_pago?: Maybe<Array<MetodoDePago>>;
  nombre: Scalars['String']['output'];
  origen?: Maybe<Origen>;
  pais: Scalars['String']['output'];
  /** dato estadístico */
  puesto_rol?: Maybe<PuestoRol>;
  roles?: Maybe<Array<Rol>>;
  telefono?: Maybe<Scalars['String']['output']>;
  tiene_huella?: Maybe<Scalars['Boolean']['output']>;
  turno?: Maybe<Turno>;
  usuario?: Maybe<Scalars['String']['output']>;
  usuario_id: Scalars['ID']['output'];
  verificado: Scalars['Boolean']['output'];
}


export interface UsuarioHotelArgs {
  sesion_id?: InputMaybe<Scalars['ID']['input']>;
}

export interface UsuariosNotificacionesConfigOutput {
  __typename?: 'UsuariosNotificacionesConfigOutput';
  activado: Scalars['Boolean']['output'];
  tipo: TipoNotificacion;
  usuario_notificaciones_id?: Maybe<Scalars['String']['output']>;
}

export interface ValidarCodigoAutorizacionOutput {
  __typename?: 'ValidarCodigoAutorizacionOutput';
  usuario?: Maybe<Usuario>;
  usuario_autorizado: Scalars['Boolean']['output'];
}

export interface ValidateApiKeyInput {
  key: Scalars['String']['input'];
}

export interface Vehiculo {
  __typename?: 'Vehiculo';
  data: Data_Vehiculo;
  vehiculo_id: Scalars['ID']['output'];
}

export interface VehiculoDataEditDetailInput {
  color?: InputMaybe<Scalars['String']['input']>;
  marca?: InputMaybe<Scalars['String']['input']>;
  matricula?: InputMaybe<Scalars['String']['input']>;
  modelo?: InputMaybe<Scalars['String']['input']>;
}

export interface VehiculoDataEditDetailOutput {
  __typename?: 'VehiculoDataEditDetailOutput';
  color?: Maybe<Scalars['String']['output']>;
  marca?: Maybe<Scalars['String']['output']>;
  matricula?: Maybe<Scalars['String']['output']>;
  modelo?: Maybe<Scalars['String']['output']>;
}

export interface VentaColaboradorPorCategoriaDetailOutput {
  __typename?: 'VentaColaboradorPorCategoriaDetailOutput';
  aportacion?: Maybe<Scalars['Float']['output']>;
  categoria: Scalars['ID']['output'];
  monto: Scalars['Float']['output'];
}

export interface VentaExtraRentaDetailOutput {
  __typename?: 'VentaExtraRentaDetailOutput';
  /** Datos del colaborador que registro la venta */
  colaborador?: Maybe<Colaborador>;
  conceptos: Array<ExtraPendienteRentaDetailOutput>;
  folio: Scalars['String']['output'];
  usuario_id?: Maybe<Scalars['ID']['output']>;
  venta_id: Scalars['ID']['output'];
}

export enum Estados_Habitaciones {
  ALaVenta = 'a_la_venta',
  Bloqueada = 'bloqueada',
  Limpieza = 'limpieza',
  Mantenimiento = 'mantenimiento',
  Ocupada = 'ocupada',
  Preparada = 'preparada',
  Reservada = 'reservada',
  RoomService = 'room_service',
  Sucia = 'sucia',
  Supervision = 'supervision',
  SupervisionEnCurso = 'supervision_en_curso',
  SupervisionPendiente = 'supervision_pendiente'
}

export enum Estados_Incidencias {
  Activa = 'activa',
  Cerrada = 'cerrada'
}

export enum Release_Estados_Habitaciones {
  ALaVenta = 'a_la_venta',
  Preparada = 'preparada'
}

export interface SendChangePasswordViaEmailInput {
  email: Scalars['String']['input'];
  link: Scalars['String']['input'];
}

export type LoginMutationVariables = Exact<{
  loginInput: AuthLoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthLoginResponse', token: string } };

export type LoginGoogleMutationVariables = Exact<{
  loginGoogleInput: LoginGoogleInput;
}>;


export type LoginGoogleMutation = { __typename?: 'Mutation', login_google: { __typename?: 'LoginGoogleResponse', token: string } };

export type LoginHuellaMutationVariables = Exact<{
  template_sample: Scalars['String']['input'];
}>;


export type LoginHuellaMutation = { __typename?: 'Mutation', login_huella: { __typename?: 'FingerPrintLoginOutput', token: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: string };

export type SendChangePasswordViaEmailMutationVariables = Exact<{
  sendChangePasswordViaEmailInput: SendChangePasswordViaEmailInput;
}>;


export type SendChangePasswordViaEmailMutation = { __typename?: 'Mutation', sendChangePasswordViaEmail: string };

export type ChangePasswordMutationVariables = Exact<{
  changePasswordInput: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: string };

export type ColaboradoresQueryVariables = Exact<{
  usuario_id: Scalars['ID']['input'];
}>;


export type ColaboradoresQuery = { __typename?: 'Query', colaboradores: Array<{ __typename?: 'Colaborador', colaborador_id: string }> };

export type ListenMyColaboradorSubscriptionVariables = Exact<{
  colaborador_id: Scalars['ID']['input'];
}>;


export type ListenMyColaboradorSubscription = { __typename?: 'Subscription', checkColaborador: { __typename?: 'Colaborador', colaborador_id: string, en_turno: boolean, foto?: string | null } };

export type GetCortesAgrupadosQueryVariables = Exact<{
  hotel_id: Scalars['ID']['input'];
  unidad_tiempo: UnidadTiempoFiltro;
  fecha_inicio_corte?: InputMaybe<DateSearchInput>;
  fecha_fin_corte?: InputMaybe<DateSearchInput>;
  fecha_cierre_corte?: InputMaybe<DateSearchInput>;
}>;


export type GetCortesAgrupadosQuery = { __typename?: 'Query', cortes_agrupados: Array<{ __typename?: 'GroupCortes', fecha: any, total_corte: number, cortes: Array<{ __typename: 'Corte', corte_id: string, turno_id: string, folio: number, fecha_inicio_corte: string, fecha_fin_corte?: string | null, fecha_cierre_corte?: string | null, turno: { __typename?: 'Turno', nombre: string } }> }> };

export type GetCorteTurnoPdfQueryVariables = Exact<{
  corte_id: Scalars['ID']['input'];
}>;


export type GetCorteTurnoPdfQuery = { __typename?: 'Query', corte: { __typename?: 'Corte', corte_id: string, fecha_inicio_corte: string, fecha_fin_corte?: string | null, folio: number, turno_id: string, usuario_realiza_corte: string, turno: { __typename?: 'Turno', nombre: string }, usuario_crea?: { __typename?: 'Usuario', apellido_materno?: string | null, apellido_paterno?: string | null, nombre: string } | null } };

export type AlmacenCorteQueryVariables = Exact<{
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AlmacenCorteQuery = { __typename?: 'Query', almacenes: Array<{ __typename?: 'Almacen', almacen_id: string, nombre: string }> };

export type ConsultarReportePropinasVentasQueryVariables = Exact<{
  reporte_propina_venta_id?: InputMaybe<Scalars['ID']['input']>;
  corte_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ConsultarReportePropinasVentasQuery = { __typename?: 'Query', consultar_reporte_propinas?: { __typename?: 'GetReportePropinasOutput', reporte_propinas: Array<{ __typename?: 'ReportePropinasPorPuestoDetailOutput', puesto_id: string, puesto?: { __typename?: 'Puesto', nombre: string } | null, reporte_colaboradores: Array<{ __typename?: 'ColaboradorReportePropinaDetailOutput', colaborador_id: string, propinas_tarjetas_por_venta_rs: number, puntos_a_pagar: number, comision_bancaria_tarjeta: number, total_a_repartir: number, colaborador?: { __typename?: 'Colaborador', nombre: string, apellido_paterno: string, apellido_materno: string } | null, ventas_por_categoria: Array<{ __typename?: 'VentaColaboradorPorCategoriaDetailOutput', categoria: string, monto: number }> }> }> } | null };

export type ReportePropinasQueryVariables = Exact<{
  hotel_id: Scalars['ID']['input'];
}>;


export type ReportePropinasQuery = { __typename?: 'Query', reporte_propinas?: { __typename?: 'GetReportePropinasOutput', reporte_propinas: Array<{ __typename?: 'ReportePropinasPorPuestoDetailOutput', puesto_id: string, puesto?: { __typename?: 'Puesto', nombre: string } | null, reporte_colaboradores: Array<{ __typename?: 'ColaboradorReportePropinaDetailOutput', colaborador_id: string, propinas_tarjetas_por_venta_rs: number, puntos_a_pagar: number, comision_bancaria_tarjeta: number, total_a_repartir: number, colaborador?: { __typename?: 'Colaborador', nombre: string, apellido_paterno: string, apellido_materno: string } | null, ventas_por_categoria: Array<{ __typename?: 'VentaColaboradorPorCategoriaDetailOutput', categoria: string, monto: number }> }> }> } | null };

export type GetCortesHistorialQueryVariables = Exact<{
  fecha_inicio_corte?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  estatus?: InputMaybe<EstatusCorte>;
}>;


export type GetCortesHistorialQuery = { __typename?: 'Query', cortes: Array<{ __typename?: 'Corte', corte_id: string, folio: number, total_corte: number, turno_id: string, turno: { __typename?: 'Turno', nombre: string } }> };

export type GetGastosCategorasPorMesQueryVariables = Exact<{
  gastosCategoria: Array<Scalars['String']['input']> | Scalars['String']['input'];
  hotel_id: Scalars['ID']['input'];
}>;


export type GetGastosCategorasPorMesQuery = { __typename?: 'Query', gastos_categoria_por_meses?: Array<{ __typename?: 'BillingPerMonthGroupedByCategoryWithMonthOutput', month: string, gastos_por_categoria: Array<{ __typename: 'BillingPerMonthGroupedByCategoryOutput', porcentaje: number, total_gasto: number, categoria: { __typename: 'CategoriaGasto', categoria: string, presupuesto: number } }> }> | null };

export type Hotel_ColaboradoresQueryVariables = Exact<{
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type Hotel_ColaboradoresQuery = { __typename?: 'Query', colaboradores: Array<{ __typename?: 'Colaborador', colaborador_id: string, nombre: string, usuario_id?: string | null, apellido_paterno: string, turno_id: string, foto?: string | null, en_turno: boolean, ultima_tarea?: { __typename?: 'ColaboradorTarea', fecha_inicio: any, fecha_termino?: any | null } | null, mesa_asignada_activa?: { __typename?: 'HasActiveMesaAsignadaOutput', has_mesa_activa: boolean } | null, puesto?: { __typename?: 'Puesto', nombre: string } | null }> };

export type IncidenciasQueryVariables = Exact<{
  fecha_registro?: InputMaybe<DateSearchInput>;
  hotel_id?: InputMaybe<Scalars['ID']['input']>;
  turno_id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type IncidenciasQuery = { __typename?: 'Query', incidencias: Array<{ __typename?: 'Incidencia', estado?: Estados_Incidencias | null, severidad: string, fecha_registro: any, turno_id: string, turno: { __typename?: 'Turno', nombre: string } }> };

export type GetMonthPercentQueryVariables = Exact<{
  fecha_final: Scalars['DateTime']['input'];
  fecha_inicial: Scalars['DateTime']['input'];
  hotel_id: Scalars['ID']['input'];
}>;


export type GetMonthPercentQuery = { __typename?: 'Query', obtener_porcentaje_promedio_ocupacion: number };

export type RentasQueryVariables = Exact<{
  renta_id: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
  fecha_registro?: InputMaybe<DateSearchInput>;
  fecha_salida?: InputMaybe<DateSearchInput>;
  hotel_id: Scalars['ID']['input'];
}>;


export type RentasQuery = { __typename?: 'Query', rentas: Array<{ __typename?: 'Renta', renta_id: string, fecha_registro: any, numero_personas: number, personas_extra: number, tipo_entrada: TiposEntradas, reserva_id?: string | null, habitacion_id: string, habitacion?: { __typename?: 'Habitacion', hotel_id: string } | null, extras?: Array<{ __typename?: 'Extra', monto_extra: number, tipo_extra: TiposExtras, fecha_pago?: any | null }> | null }> };

export type GetHabitacionesQueryVariables = Exact<{
  hotelIdFilter: Scalars['ID']['input'];
}>;


export type GetHabitacionesQuery = { __typename?: 'Query', habitaciones: Array<{ __typename?: 'Habitacion', estado: Estados_Habitaciones, habitacion_id: string, numero_habitacion: string, ultima_renta?: { __typename?: 'Renta', renta_id: string, fecha_condensada: any } | null }> };

export type GetTurnosQueryVariables = Exact<{
  hotel_id?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  estado?: InputMaybe<EstadosTurno>;
}>;


export type GetTurnosQuery = { __typename?: 'Query', turnos: Array<{ __typename?: 'Turno', nombre: string, hora_entrada: string, hora_salida: string, hotel_id: string, turno_id: string, estado: EstadosTurno }> };

export type ListenHabitacionesSubscriptionVariables = Exact<{
  hotelIdFilter: Scalars['ID']['input'];
}>;


export type ListenHabitacionesSubscription = { __typename?: 'Subscription', checkHabitaciones: Array<{ __typename?: 'Habitacion', estado: Estados_Habitaciones, habitacion_id: string }> };

export type Obtener_VentasQueryVariables = Exact<{
  get_today_sales_input: GetTodaySalesInput;
}>;


export type Obtener_VentasQuery = { __typename?: 'Query', obtener_ventas: Array<{ __typename?: 'SalesTicketsByTurno', nombre: string, total_extras: number, total_ordenes: number, total_restaurante: number, total_propinas: number, total_rentas: number, total_reservas: number }> };

export type GetIncidenciasQueryVariables = Exact<{
  hotel_id: Scalars['ID']['input'];
  fecha_operacion?: InputMaybe<DateSearchInput>;
}>;


export type GetIncidenciasQuery = { __typename?: 'Query', incidencias: Array<{ __typename?: 'Incidencia', incidencia_id: string, detalle: string, habitacion_id?: string | null, folio: number, fecha_registro: any, fecha_cierre?: any | null, colaborador_id_reporta: string, estado?: Estados_Incidencias | null, huesped?: string | null, matricula?: string | null, tipo_incidencia?: string | null, colaborador_id_cierra?: string | null, area?: string | null, severidad: string, turno_id: string, colaborador_reporta: { __typename?: 'Colaborador', nombre: string, apellido_paterno: string, apellido_materno: string, puesto?: { __typename?: 'Puesto', nombre: string } | null }, colaborador_cierra?: { __typename?: 'Colaborador', nombre: string, apellido_paterno: string, apellido_materno: string } | null, turno: { __typename?: 'Turno', nombre: string }, habitacion?: { __typename?: 'Habitacion', habitacion_id: string, numero_habitacion: string, tipo_habitacion_id: string, tipo_habitacion?: { __typename?: 'TipoHabitacion', tipo_habitacion_id: string, nombre: string } | null } | null, imagenes?: Array<{ __typename?: 'ImageIncidenciaEntity', imagen?: string | null }> | null }> };

export type ObtenerBandejaIncidenciasQueryVariables = Exact<{
  usuarioId: Array<Scalars['String']['input']> | Scalars['String']['input'];
  hotelId?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type ObtenerBandejaIncidenciasQuery = { __typename?: 'Query', obtener_bandeja_incidencias?: Array<{ __typename?: 'BandejaNotificaciones', bandeja_notificaciones_id: string, hotel_id?: string | null, leido: boolean, incidencia_id?: string | null, incidencia?: { __typename?: 'Incidencia', incidencia_id: string, detalle: string, habitacion_id?: string | null, tipo_incidencia?: string | null } | null }> | null };

export type MarcarComoLeidaMutationVariables = Exact<{
  bandejaNotificacionesId: Scalars['String']['input'];
}>;


export type MarcarComoLeidaMutation = { __typename?: 'Mutation', marcar_como_leida: boolean };

export type GetUsuariosNotificacionesActivosQueryVariables = Exact<{
  usuario_id: Scalars['String']['input'];
  hotel_id: Scalars['String']['input'];
}>;


export type GetUsuariosNotificacionesActivosQuery = { __typename?: 'Query', notificaciones_no_leidas_alerta?: boolean | null };

export type ObtenerBandejaNotificacionesQueryVariables = Exact<{
  usuarioId: Array<Scalars['String']['input']> | Scalars['String']['input'];
  hotelId: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;


export type ObtenerBandejaNotificacionesQuery = { __typename?: 'Query', obtener_bandeja_notificaciones?: Array<{ __typename?: 'BandejaNotificaciones', bandeja_notificaciones_id: string, fecha_registro: any, hotel_id?: string | null, leido: boolean, mensaje: string, tipo: TipoNotificacion, usuario_id: string }> | null };

export type MarcarNotificacionComoLeidaMutationVariables = Exact<{
  bandejaNotificacionId: Scalars['String']['input'];
}>;


export type MarcarNotificacionComoLeidaMutation = { __typename?: 'Mutation', marcar_como_leida: boolean };

export type GetUsuariosNotificacionesQueryVariables = Exact<{
  usuario_id: Scalars['String']['input'];
  hotel_id: Scalars['String']['input'];
}>;


export type GetUsuariosNotificacionesQuery = { __typename?: 'Query', usuarios_notificaciones?: Array<{ __typename?: 'UsuariosNotificacionesConfigOutput', tipo: TipoNotificacion, activado: boolean }> | null };

export type ActualizarConfiguracionNotificacionesMutationVariables = Exact<{
  configNotificacionesInput: UpdateUsuariosNotificacionesInput;
}>;


export type ActualizarConfiguracionNotificacionesMutation = { __typename?: 'Mutation', actualizar_configuracion_notificaciones?: Array<{ __typename?: 'UsuariosNotificacionesConfigOutput', activado: boolean, tipo: TipoNotificacion, usuario_notificaciones_id?: string | null }> | null };

export type NotificacionesQueryVariables = Exact<{
  hotelIds?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type NotificacionesQuery = { __typename?: 'Query', notificaciones: Array<{ __typename?: 'Notificacion', hotel_id: string, notificacion_id: string, tipo: TipoNotificacion, topic: string }> };

export type GetPerfilQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPerfilQuery = { __typename?: 'Query', mi_perfil: { __typename?: 'Usuario', usuario_id: string, nombre: string, apellido_paterno?: string | null, apellido_materno?: string | null, correo: string, fecha_registro: any, fecha_modificacion: any, eliminado: boolean, telefono?: string | null, estatus: string, hotel?: Array<{ __typename?: 'Hotel', nombre_hotel: string, hotel_id: string, zona_horaria?: string | null, logo_hotel?: string | null }> | null, roles?: Array<{ __typename?: 'Rol', rol_id: string, grupo_hotel_id: string, nombre: string, eliminado: boolean, grupo_hotel: { __typename?: 'GrupoHotel', grupo_hotel_id: string } }> | null, turno?: { __typename?: 'Turno', nombre: string, turno_id: string } | null, colaborador?: { __typename?: 'Colaborador', colaborador_id: string, foto?: string | null } | null } };

export type UpdatePerfilColaboradorMutationVariables = Exact<{
  input: UpdateColaboradorInput;
}>;


export type UpdatePerfilColaboradorMutation = { __typename?: 'Mutation', editar_colaborador: { __typename?: 'Colaborador', colaborador_id: string, foto?: string | null } };

export type CurrentDateQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentDateQuery = { __typename?: 'Query', serverDate: any };

export type Ultimo_CorteQueryVariables = Exact<{
  hotel_id: Scalars['ID']['input'];
}>;


export type Ultimo_CorteQuery = { __typename?: 'Query', ultimo_corte?: { __typename?: 'Corte', corte_id: string, fecha_cierre_corte?: string | null, fecha_fin_corte?: string | null, fecha_inicio_corte: string, efectivo_ingresado: number, folio: number, turno_id: string, usuario_cierra_corte?: string | null, usuario_realiza_corte: string, total_corte: number, turno: { __typename?: 'Turno', nombre: string }, incidencias?: Array<{ __typename?: 'Incidencia', incidencia_id: string }> | null, usuario_crea?: { __typename?: 'Usuario', apellido_materno?: string | null, apellido_paterno?: string | null, nombre: string } | null, usuario_cierra?: { __typename?: 'Usuario', apellido_materno?: string | null, apellido_paterno?: string | null, nombre: string } | null } | null };


export const LoginDocument = gql`
    mutation Login($loginInput: AuthLoginInput!) {
  login(loginInput: $loginInput) {
    token
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;
export type LoginComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LoginMutation, LoginMutationVariables>, 'mutation'>;

    export const LoginComponent = (props: LoginComponentProps) => (
      <ApolloReactComponents.Mutation<LoginMutation, LoginMutationVariables> mutation={LoginDocument} {...props} />
    );
    

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LoginGoogleDocument = gql`
    mutation LoginGoogle($loginGoogleInput: LoginGoogleInput!) {
  login_google(loginGoogleInput: $loginGoogleInput) {
    token
  }
}
    `;
export type LoginGoogleMutationFn = Apollo.MutationFunction<LoginGoogleMutation, LoginGoogleMutationVariables>;
export type LoginGoogleComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LoginGoogleMutation, LoginGoogleMutationVariables>, 'mutation'>;

    export const LoginGoogleComponent = (props: LoginGoogleComponentProps) => (
      <ApolloReactComponents.Mutation<LoginGoogleMutation, LoginGoogleMutationVariables> mutation={LoginGoogleDocument} {...props} />
    );
    

/**
 * __useLoginGoogleMutation__
 *
 * To run a mutation, you first call `useLoginGoogleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginGoogleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginGoogleMutation, { data, loading, error }] = useLoginGoogleMutation({
 *   variables: {
 *      loginGoogleInput: // value for 'loginGoogleInput'
 *   },
 * });
 */
export function useLoginGoogleMutation(baseOptions?: Apollo.MutationHookOptions<LoginGoogleMutation, LoginGoogleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginGoogleMutation, LoginGoogleMutationVariables>(LoginGoogleDocument, options);
      }
export type LoginGoogleMutationHookResult = ReturnType<typeof useLoginGoogleMutation>;
export type LoginGoogleMutationResult = Apollo.MutationResult<LoginGoogleMutation>;
export type LoginGoogleMutationOptions = Apollo.BaseMutationOptions<LoginGoogleMutation, LoginGoogleMutationVariables>;
export const LoginHuellaDocument = gql`
    mutation LoginHuella($template_sample: String!) {
  login_huella(FingerPrintLoginInput: {template_sample: $template_sample}) {
    token
  }
}
    `;
export type LoginHuellaMutationFn = Apollo.MutationFunction<LoginHuellaMutation, LoginHuellaMutationVariables>;
export type LoginHuellaComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LoginHuellaMutation, LoginHuellaMutationVariables>, 'mutation'>;

    export const LoginHuellaComponent = (props: LoginHuellaComponentProps) => (
      <ApolloReactComponents.Mutation<LoginHuellaMutation, LoginHuellaMutationVariables> mutation={LoginHuellaDocument} {...props} />
    );
    

/**
 * __useLoginHuellaMutation__
 *
 * To run a mutation, you first call `useLoginHuellaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginHuellaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginHuellaMutation, { data, loading, error }] = useLoginHuellaMutation({
 *   variables: {
 *      template_sample: // value for 'template_sample'
 *   },
 * });
 */
export function useLoginHuellaMutation(baseOptions?: Apollo.MutationHookOptions<LoginHuellaMutation, LoginHuellaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginHuellaMutation, LoginHuellaMutationVariables>(LoginHuellaDocument, options);
      }
export type LoginHuellaMutationHookResult = ReturnType<typeof useLoginHuellaMutation>;
export type LoginHuellaMutationResult = Apollo.MutationResult<LoginHuellaMutation>;
export type LoginHuellaMutationOptions = Apollo.BaseMutationOptions<LoginHuellaMutation, LoginHuellaMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;
export type LogoutComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<LogoutMutation, LogoutMutationVariables>, 'mutation'>;

    export const LogoutComponent = (props: LogoutComponentProps) => (
      <ApolloReactComponents.Mutation<LogoutMutation, LogoutMutationVariables> mutation={LogoutDocument} {...props} />
    );
    

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const SendChangePasswordViaEmailDocument = gql`
    mutation SendChangePasswordViaEmail($sendChangePasswordViaEmailInput: sendChangePasswordViaEmailInput!) {
  sendChangePasswordViaEmail(
    sendChangePasswordViaEmailInput: $sendChangePasswordViaEmailInput
  )
}
    `;
export type SendChangePasswordViaEmailMutationFn = Apollo.MutationFunction<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables>;
export type SendChangePasswordViaEmailComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables>, 'mutation'>;

    export const SendChangePasswordViaEmailComponent = (props: SendChangePasswordViaEmailComponentProps) => (
      <ApolloReactComponents.Mutation<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables> mutation={SendChangePasswordViaEmailDocument} {...props} />
    );
    

/**
 * __useSendChangePasswordViaEmailMutation__
 *
 * To run a mutation, you first call `useSendChangePasswordViaEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendChangePasswordViaEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendChangePasswordViaEmailMutation, { data, loading, error }] = useSendChangePasswordViaEmailMutation({
 *   variables: {
 *      sendChangePasswordViaEmailInput: // value for 'sendChangePasswordViaEmailInput'
 *   },
 * });
 */
export function useSendChangePasswordViaEmailMutation(baseOptions?: Apollo.MutationHookOptions<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables>(SendChangePasswordViaEmailDocument, options);
      }
export type SendChangePasswordViaEmailMutationHookResult = ReturnType<typeof useSendChangePasswordViaEmailMutation>;
export type SendChangePasswordViaEmailMutationResult = Apollo.MutationResult<SendChangePasswordViaEmailMutation>;
export type SendChangePasswordViaEmailMutationOptions = Apollo.BaseMutationOptions<SendChangePasswordViaEmailMutation, SendChangePasswordViaEmailMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($changePasswordInput: ChangePasswordInput!) {
  changePassword(changePasswordInput: $changePasswordInput)
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;
export type ChangePasswordComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ChangePasswordMutation, ChangePasswordMutationVariables>, 'mutation'>;

    export const ChangePasswordComponent = (props: ChangePasswordComponentProps) => (
      <ApolloReactComponents.Mutation<ChangePasswordMutation, ChangePasswordMutationVariables> mutation={ChangePasswordDocument} {...props} />
    );
    

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      changePasswordInput: // value for 'changePasswordInput'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ColaboradoresDocument = gql`
    query Colaboradores($usuario_id: ID!) {
  colaboradores(usuario_id: $usuario_id, eliminado: false) {
    colaborador_id
  }
}
    `;
export type ColaboradoresComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ColaboradoresQuery, ColaboradoresQueryVariables>, 'query'> & ({ variables: ColaboradoresQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const ColaboradoresComponent = (props: ColaboradoresComponentProps) => (
      <ApolloReactComponents.Query<ColaboradoresQuery, ColaboradoresQueryVariables> query={ColaboradoresDocument} {...props} />
    );
    

/**
 * __useColaboradoresQuery__
 *
 * To run a query within a React component, call `useColaboradoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useColaboradoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useColaboradoresQuery({
 *   variables: {
 *      usuario_id: // value for 'usuario_id'
 *   },
 * });
 */
export function useColaboradoresQuery(baseOptions: Apollo.QueryHookOptions<ColaboradoresQuery, ColaboradoresQueryVariables> & ({ variables: ColaboradoresQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ColaboradoresQuery, ColaboradoresQueryVariables>(ColaboradoresDocument, options);
      }
export function useColaboradoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ColaboradoresQuery, ColaboradoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ColaboradoresQuery, ColaboradoresQueryVariables>(ColaboradoresDocument, options);
        }
export function useColaboradoresSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ColaboradoresQuery, ColaboradoresQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ColaboradoresQuery, ColaboradoresQueryVariables>(ColaboradoresDocument, options);
        }
export type ColaboradoresQueryHookResult = ReturnType<typeof useColaboradoresQuery>;
export type ColaboradoresLazyQueryHookResult = ReturnType<typeof useColaboradoresLazyQuery>;
export type ColaboradoresSuspenseQueryHookResult = ReturnType<typeof useColaboradoresSuspenseQuery>;
export type ColaboradoresQueryResult = Apollo.QueryResult<ColaboradoresQuery, ColaboradoresQueryVariables>;
export const ListenMyColaboradorDocument = gql`
    subscription ListenMyColaborador($colaborador_id: ID!) {
  checkColaborador(colaborador_id: $colaborador_id) {
    colaborador_id
    en_turno
    foto
  }
}
    `;
export type ListenMyColaboradorComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<ListenMyColaboradorSubscription, ListenMyColaboradorSubscriptionVariables>, 'subscription'>;

    export const ListenMyColaboradorComponent = (props: ListenMyColaboradorComponentProps) => (
      <ApolloReactComponents.Subscription<ListenMyColaboradorSubscription, ListenMyColaboradorSubscriptionVariables> subscription={ListenMyColaboradorDocument} {...props} />
    );
    

/**
 * __useListenMyColaboradorSubscription__
 *
 * To run a query within a React component, call `useListenMyColaboradorSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenMyColaboradorSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenMyColaboradorSubscription({
 *   variables: {
 *      colaborador_id: // value for 'colaborador_id'
 *   },
 * });
 */
export function useListenMyColaboradorSubscription(baseOptions: Apollo.SubscriptionHookOptions<ListenMyColaboradorSubscription, ListenMyColaboradorSubscriptionVariables> & ({ variables: ListenMyColaboradorSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ListenMyColaboradorSubscription, ListenMyColaboradorSubscriptionVariables>(ListenMyColaboradorDocument, options);
      }
export type ListenMyColaboradorSubscriptionHookResult = ReturnType<typeof useListenMyColaboradorSubscription>;
export type ListenMyColaboradorSubscriptionResult = Apollo.SubscriptionResult<ListenMyColaboradorSubscription>;
export const GetCortesAgrupadosDocument = gql`
    query GetCortesAgrupados($hotel_id: ID!, $unidad_tiempo: UnidadTiempoFiltro!, $fecha_inicio_corte: DateSearchInput, $fecha_fin_corte: DateSearchInput, $fecha_cierre_corte: DateSearchInput) {
  cortes_agrupados(
    hotel_id: $hotel_id
    unidad_tiempo: $unidad_tiempo
    fecha_inicio_corte: $fecha_inicio_corte
    fecha_fin_corte: $fecha_fin_corte
    fecha_cierre_corte: $fecha_cierre_corte
  ) {
    cortes {
      corte_id
      turno_id
      folio
      turno {
        nombre
      }
      fecha_inicio_corte
      fecha_fin_corte
      fecha_cierre_corte
      __typename
    }
    fecha
    total_corte
  }
}
    `;
export type GetCortesAgrupadosComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>, 'query'> & ({ variables: GetCortesAgrupadosQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetCortesAgrupadosComponent = (props: GetCortesAgrupadosComponentProps) => (
      <ApolloReactComponents.Query<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables> query={GetCortesAgrupadosDocument} {...props} />
    );
    

/**
 * __useGetCortesAgrupadosQuery__
 *
 * To run a query within a React component, call `useGetCortesAgrupadosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCortesAgrupadosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCortesAgrupadosQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *      unidad_tiempo: // value for 'unidad_tiempo'
 *      fecha_inicio_corte: // value for 'fecha_inicio_corte'
 *      fecha_fin_corte: // value for 'fecha_fin_corte'
 *      fecha_cierre_corte: // value for 'fecha_cierre_corte'
 *   },
 * });
 */
export function useGetCortesAgrupadosQuery(baseOptions: Apollo.QueryHookOptions<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables> & ({ variables: GetCortesAgrupadosQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>(GetCortesAgrupadosDocument, options);
      }
export function useGetCortesAgrupadosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>(GetCortesAgrupadosDocument, options);
        }
export function useGetCortesAgrupadosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>(GetCortesAgrupadosDocument, options);
        }
export type GetCortesAgrupadosQueryHookResult = ReturnType<typeof useGetCortesAgrupadosQuery>;
export type GetCortesAgrupadosLazyQueryHookResult = ReturnType<typeof useGetCortesAgrupadosLazyQuery>;
export type GetCortesAgrupadosSuspenseQueryHookResult = ReturnType<typeof useGetCortesAgrupadosSuspenseQuery>;
export type GetCortesAgrupadosQueryResult = Apollo.QueryResult<GetCortesAgrupadosQuery, GetCortesAgrupadosQueryVariables>;
export const GetCorteTurnoPdfDocument = gql`
    query getCorteTurnoPDF($corte_id: ID!) {
  corte(corte_id: $corte_id) {
    corte_id
    fecha_inicio_corte
    fecha_fin_corte
    folio
    turno_id
    turno {
      nombre
    }
    usuario_realiza_corte
    usuario_crea {
      apellido_materno
      apellido_paterno
      nombre
    }
  }
}
    `;
export type GetCorteTurnoPdfComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>, 'query'> & ({ variables: GetCorteTurnoPdfQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetCorteTurnoPdfComponent = (props: GetCorteTurnoPdfComponentProps) => (
      <ApolloReactComponents.Query<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables> query={GetCorteTurnoPdfDocument} {...props} />
    );
    

/**
 * __useGetCorteTurnoPdfQuery__
 *
 * To run a query within a React component, call `useGetCorteTurnoPdfQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCorteTurnoPdfQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCorteTurnoPdfQuery({
 *   variables: {
 *      corte_id: // value for 'corte_id'
 *   },
 * });
 */
export function useGetCorteTurnoPdfQuery(baseOptions: Apollo.QueryHookOptions<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables> & ({ variables: GetCorteTurnoPdfQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>(GetCorteTurnoPdfDocument, options);
      }
export function useGetCorteTurnoPdfLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>(GetCorteTurnoPdfDocument, options);
        }
export function useGetCorteTurnoPdfSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>(GetCorteTurnoPdfDocument, options);
        }
export type GetCorteTurnoPdfQueryHookResult = ReturnType<typeof useGetCorteTurnoPdfQuery>;
export type GetCorteTurnoPdfLazyQueryHookResult = ReturnType<typeof useGetCorteTurnoPdfLazyQuery>;
export type GetCorteTurnoPdfSuspenseQueryHookResult = ReturnType<typeof useGetCorteTurnoPdfSuspenseQuery>;
export type GetCorteTurnoPdfQueryResult = Apollo.QueryResult<GetCorteTurnoPdfQuery, GetCorteTurnoPdfQueryVariables>;
export const AlmacenCorteDocument = gql`
    query AlmacenCorte($hotel_id: ID) {
  almacenes(almacen_id: [], hotel_id: $hotel_id) {
    almacen_id
    nombre
  }
}
    `;
export type AlmacenCorteComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<AlmacenCorteQuery, AlmacenCorteQueryVariables>, 'query'>;

    export const AlmacenCorteComponent = (props: AlmacenCorteComponentProps) => (
      <ApolloReactComponents.Query<AlmacenCorteQuery, AlmacenCorteQueryVariables> query={AlmacenCorteDocument} {...props} />
    );
    

/**
 * __useAlmacenCorteQuery__
 *
 * To run a query within a React component, call `useAlmacenCorteQuery` and pass it any options that fit your needs.
 * When your component renders, `useAlmacenCorteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAlmacenCorteQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useAlmacenCorteQuery(baseOptions?: Apollo.QueryHookOptions<AlmacenCorteQuery, AlmacenCorteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AlmacenCorteQuery, AlmacenCorteQueryVariables>(AlmacenCorteDocument, options);
      }
export function useAlmacenCorteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AlmacenCorteQuery, AlmacenCorteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AlmacenCorteQuery, AlmacenCorteQueryVariables>(AlmacenCorteDocument, options);
        }
export function useAlmacenCorteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<AlmacenCorteQuery, AlmacenCorteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<AlmacenCorteQuery, AlmacenCorteQueryVariables>(AlmacenCorteDocument, options);
        }
export type AlmacenCorteQueryHookResult = ReturnType<typeof useAlmacenCorteQuery>;
export type AlmacenCorteLazyQueryHookResult = ReturnType<typeof useAlmacenCorteLazyQuery>;
export type AlmacenCorteSuspenseQueryHookResult = ReturnType<typeof useAlmacenCorteSuspenseQuery>;
export type AlmacenCorteQueryResult = Apollo.QueryResult<AlmacenCorteQuery, AlmacenCorteQueryVariables>;
export const ConsultarReportePropinasVentasDocument = gql`
    query ConsultarReportePropinasVentas($reporte_propina_venta_id: ID, $corte_id: ID) {
  consultar_reporte_propinas(
    reporte_propina_venta_id: $reporte_propina_venta_id
    corte_id: $corte_id
  ) {
    reporte_propinas {
      puesto_id
      puesto {
        nombre
      }
      reporte_colaboradores {
        colaborador_id
        colaborador {
          nombre
          apellido_paterno
          apellido_materno
        }
        ventas_por_categoria {
          categoria
          monto
        }
        propinas_tarjetas_por_venta_rs
        puntos_a_pagar
        comision_bancaria_tarjeta
        total_a_repartir
      }
    }
  }
}
    `;
export type ConsultarReportePropinasVentasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>, 'query'>;

    export const ConsultarReportePropinasVentasComponent = (props: ConsultarReportePropinasVentasComponentProps) => (
      <ApolloReactComponents.Query<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables> query={ConsultarReportePropinasVentasDocument} {...props} />
    );
    

/**
 * __useConsultarReportePropinasVentasQuery__
 *
 * To run a query within a React component, call `useConsultarReportePropinasVentasQuery` and pass it any options that fit your needs.
 * When your component renders, `useConsultarReportePropinasVentasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConsultarReportePropinasVentasQuery({
 *   variables: {
 *      reporte_propina_venta_id: // value for 'reporte_propina_venta_id'
 *      corte_id: // value for 'corte_id'
 *   },
 * });
 */
export function useConsultarReportePropinasVentasQuery(baseOptions?: Apollo.QueryHookOptions<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>(ConsultarReportePropinasVentasDocument, options);
      }
export function useConsultarReportePropinasVentasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>(ConsultarReportePropinasVentasDocument, options);
        }
export function useConsultarReportePropinasVentasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>(ConsultarReportePropinasVentasDocument, options);
        }
export type ConsultarReportePropinasVentasQueryHookResult = ReturnType<typeof useConsultarReportePropinasVentasQuery>;
export type ConsultarReportePropinasVentasLazyQueryHookResult = ReturnType<typeof useConsultarReportePropinasVentasLazyQuery>;
export type ConsultarReportePropinasVentasSuspenseQueryHookResult = ReturnType<typeof useConsultarReportePropinasVentasSuspenseQuery>;
export type ConsultarReportePropinasVentasQueryResult = Apollo.QueryResult<ConsultarReportePropinasVentasQuery, ConsultarReportePropinasVentasQueryVariables>;
export const ReportePropinasDocument = gql`
    query ReportePropinas($hotel_id: ID!) {
  reporte_propinas(hotel_id: $hotel_id) {
    reporte_propinas {
      puesto_id
      puesto {
        nombre
      }
      reporte_colaboradores {
        colaborador_id
        colaborador {
          nombre
          apellido_paterno
          apellido_materno
        }
        ventas_por_categoria {
          categoria
          monto
        }
        propinas_tarjetas_por_venta_rs
        puntos_a_pagar
        comision_bancaria_tarjeta
        total_a_repartir
      }
    }
  }
}
    `;
export type ReportePropinasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ReportePropinasQuery, ReportePropinasQueryVariables>, 'query'> & ({ variables: ReportePropinasQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const ReportePropinasComponent = (props: ReportePropinasComponentProps) => (
      <ApolloReactComponents.Query<ReportePropinasQuery, ReportePropinasQueryVariables> query={ReportePropinasDocument} {...props} />
    );
    

/**
 * __useReportePropinasQuery__
 *
 * To run a query within a React component, call `useReportePropinasQuery` and pass it any options that fit your needs.
 * When your component renders, `useReportePropinasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReportePropinasQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useReportePropinasQuery(baseOptions: Apollo.QueryHookOptions<ReportePropinasQuery, ReportePropinasQueryVariables> & ({ variables: ReportePropinasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ReportePropinasQuery, ReportePropinasQueryVariables>(ReportePropinasDocument, options);
      }
export function useReportePropinasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ReportePropinasQuery, ReportePropinasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ReportePropinasQuery, ReportePropinasQueryVariables>(ReportePropinasDocument, options);
        }
export function useReportePropinasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ReportePropinasQuery, ReportePropinasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ReportePropinasQuery, ReportePropinasQueryVariables>(ReportePropinasDocument, options);
        }
export type ReportePropinasQueryHookResult = ReturnType<typeof useReportePropinasQuery>;
export type ReportePropinasLazyQueryHookResult = ReturnType<typeof useReportePropinasLazyQuery>;
export type ReportePropinasSuspenseQueryHookResult = ReturnType<typeof useReportePropinasSuspenseQuery>;
export type ReportePropinasQueryResult = Apollo.QueryResult<ReportePropinasQuery, ReportePropinasQueryVariables>;
export const GetCortesHistorialDocument = gql`
    query GetCortesHistorial($fecha_inicio_corte: DateSearchInput, $hotel_id: ID, $estatus: EstatusCorte) {
  cortes(
    fecha_inicio_corte: $fecha_inicio_corte
    hotel_id: $hotel_id
    estatus: $estatus
  ) {
    corte_id
    folio
    total_corte
    turno_id
    turno {
      nombre
    }
  }
}
    `;
export type GetCortesHistorialComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>, 'query'>;

    export const GetCortesHistorialComponent = (props: GetCortesHistorialComponentProps) => (
      <ApolloReactComponents.Query<GetCortesHistorialQuery, GetCortesHistorialQueryVariables> query={GetCortesHistorialDocument} {...props} />
    );
    

/**
 * __useGetCortesHistorialQuery__
 *
 * To run a query within a React component, call `useGetCortesHistorialQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCortesHistorialQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCortesHistorialQuery({
 *   variables: {
 *      fecha_inicio_corte: // value for 'fecha_inicio_corte'
 *      hotel_id: // value for 'hotel_id'
 *      estatus: // value for 'estatus'
 *   },
 * });
 */
export function useGetCortesHistorialQuery(baseOptions?: Apollo.QueryHookOptions<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>(GetCortesHistorialDocument, options);
      }
export function useGetCortesHistorialLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>(GetCortesHistorialDocument, options);
        }
export function useGetCortesHistorialSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>(GetCortesHistorialDocument, options);
        }
export type GetCortesHistorialQueryHookResult = ReturnType<typeof useGetCortesHistorialQuery>;
export type GetCortesHistorialLazyQueryHookResult = ReturnType<typeof useGetCortesHistorialLazyQuery>;
export type GetCortesHistorialSuspenseQueryHookResult = ReturnType<typeof useGetCortesHistorialSuspenseQuery>;
export type GetCortesHistorialQueryResult = Apollo.QueryResult<GetCortesHistorialQuery, GetCortesHistorialQueryVariables>;
export const GetGastosCategorasPorMesDocument = gql`
    query getGastosCategorasPorMes($gastosCategoria: [String!]!, $hotel_id: ID!) {
  gastos_categoria_por_meses(month: $gastosCategoria, hotel_id: $hotel_id) {
    gastos_por_categoria {
      porcentaje
      total_gasto
      categoria {
        categoria
        presupuesto
        __typename
      }
      __typename
    }
    month
  }
}
    `;
export type GetGastosCategorasPorMesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>, 'query'> & ({ variables: GetGastosCategorasPorMesQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetGastosCategorasPorMesComponent = (props: GetGastosCategorasPorMesComponentProps) => (
      <ApolloReactComponents.Query<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables> query={GetGastosCategorasPorMesDocument} {...props} />
    );
    

/**
 * __useGetGastosCategorasPorMesQuery__
 *
 * To run a query within a React component, call `useGetGastosCategorasPorMesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGastosCategorasPorMesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGastosCategorasPorMesQuery({
 *   variables: {
 *      gastosCategoria: // value for 'gastosCategoria'
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useGetGastosCategorasPorMesQuery(baseOptions: Apollo.QueryHookOptions<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables> & ({ variables: GetGastosCategorasPorMesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>(GetGastosCategorasPorMesDocument, options);
      }
export function useGetGastosCategorasPorMesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>(GetGastosCategorasPorMesDocument, options);
        }
export function useGetGastosCategorasPorMesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>(GetGastosCategorasPorMesDocument, options);
        }
export type GetGastosCategorasPorMesQueryHookResult = ReturnType<typeof useGetGastosCategorasPorMesQuery>;
export type GetGastosCategorasPorMesLazyQueryHookResult = ReturnType<typeof useGetGastosCategorasPorMesLazyQuery>;
export type GetGastosCategorasPorMesSuspenseQueryHookResult = ReturnType<typeof useGetGastosCategorasPorMesSuspenseQuery>;
export type GetGastosCategorasPorMesQueryResult = Apollo.QueryResult<GetGastosCategorasPorMesQuery, GetGastosCategorasPorMesQueryVariables>;
export const Hotel_ColaboradoresDocument = gql`
    query Hotel_colaboradores($hotel_id: ID) {
  colaboradores(hotel_id: $hotel_id, eliminado: false, en_turno: true) {
    colaborador_id
    nombre
    usuario_id
    apellido_paterno
    turno_id
    foto
    en_turno
    colaborador_id
    ultima_tarea {
      fecha_inicio
      fecha_termino
    }
    mesa_asignada_activa {
      has_mesa_activa
    }
    puesto {
      nombre
    }
  }
}
    `;
export type Hotel_ColaboradoresComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>, 'query'>;

    export const Hotel_ColaboradoresComponent = (props: Hotel_ColaboradoresComponentProps) => (
      <ApolloReactComponents.Query<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables> query={Hotel_ColaboradoresDocument} {...props} />
    );
    

/**
 * __useHotel_ColaboradoresQuery__
 *
 * To run a query within a React component, call `useHotel_ColaboradoresQuery` and pass it any options that fit your needs.
 * When your component renders, `useHotel_ColaboradoresQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHotel_ColaboradoresQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useHotel_ColaboradoresQuery(baseOptions?: Apollo.QueryHookOptions<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>(Hotel_ColaboradoresDocument, options);
      }
export function useHotel_ColaboradoresLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>(Hotel_ColaboradoresDocument, options);
        }
export function useHotel_ColaboradoresSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>(Hotel_ColaboradoresDocument, options);
        }
export type Hotel_ColaboradoresQueryHookResult = ReturnType<typeof useHotel_ColaboradoresQuery>;
export type Hotel_ColaboradoresLazyQueryHookResult = ReturnType<typeof useHotel_ColaboradoresLazyQuery>;
export type Hotel_ColaboradoresSuspenseQueryHookResult = ReturnType<typeof useHotel_ColaboradoresSuspenseQuery>;
export type Hotel_ColaboradoresQueryResult = Apollo.QueryResult<Hotel_ColaboradoresQuery, Hotel_ColaboradoresQueryVariables>;
export const IncidenciasDocument = gql`
    query Incidencias($fecha_registro: DateSearchInput, $hotel_id: ID, $turno_id: ID) {
  incidencias(
    fecha_registro: $fecha_registro
    hotel_id: $hotel_id
    turno_id: $turno_id
  ) {
    estado
    severidad
    fecha_registro
    turno_id
    turno {
      nombre
    }
  }
}
    `;
export type IncidenciasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<IncidenciasQuery, IncidenciasQueryVariables>, 'query'>;

    export const IncidenciasComponent = (props: IncidenciasComponentProps) => (
      <ApolloReactComponents.Query<IncidenciasQuery, IncidenciasQueryVariables> query={IncidenciasDocument} {...props} />
    );
    

/**
 * __useIncidenciasQuery__
 *
 * To run a query within a React component, call `useIncidenciasQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncidenciasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIncidenciasQuery({
 *   variables: {
 *      fecha_registro: // value for 'fecha_registro'
 *      hotel_id: // value for 'hotel_id'
 *      turno_id: // value for 'turno_id'
 *   },
 * });
 */
export function useIncidenciasQuery(baseOptions?: Apollo.QueryHookOptions<IncidenciasQuery, IncidenciasQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IncidenciasQuery, IncidenciasQueryVariables>(IncidenciasDocument, options);
      }
export function useIncidenciasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IncidenciasQuery, IncidenciasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IncidenciasQuery, IncidenciasQueryVariables>(IncidenciasDocument, options);
        }
export function useIncidenciasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IncidenciasQuery, IncidenciasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IncidenciasQuery, IncidenciasQueryVariables>(IncidenciasDocument, options);
        }
export type IncidenciasQueryHookResult = ReturnType<typeof useIncidenciasQuery>;
export type IncidenciasLazyQueryHookResult = ReturnType<typeof useIncidenciasLazyQuery>;
export type IncidenciasSuspenseQueryHookResult = ReturnType<typeof useIncidenciasSuspenseQuery>;
export type IncidenciasQueryResult = Apollo.QueryResult<IncidenciasQuery, IncidenciasQueryVariables>;
export const GetMonthPercentDocument = gql`
    query getMonthPercent($fecha_final: DateTime!, $fecha_inicial: DateTime!, $hotel_id: ID!) {
  obtener_porcentaje_promedio_ocupacion(
    fecha_final: $fecha_final
    fecha_inicial: $fecha_inicial
    hotel_id: $hotel_id
  )
}
    `;
export type GetMonthPercentComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetMonthPercentQuery, GetMonthPercentQueryVariables>, 'query'> & ({ variables: GetMonthPercentQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetMonthPercentComponent = (props: GetMonthPercentComponentProps) => (
      <ApolloReactComponents.Query<GetMonthPercentQuery, GetMonthPercentQueryVariables> query={GetMonthPercentDocument} {...props} />
    );
    

/**
 * __useGetMonthPercentQuery__
 *
 * To run a query within a React component, call `useGetMonthPercentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMonthPercentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMonthPercentQuery({
 *   variables: {
 *      fecha_final: // value for 'fecha_final'
 *      fecha_inicial: // value for 'fecha_inicial'
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useGetMonthPercentQuery(baseOptions: Apollo.QueryHookOptions<GetMonthPercentQuery, GetMonthPercentQueryVariables> & ({ variables: GetMonthPercentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMonthPercentQuery, GetMonthPercentQueryVariables>(GetMonthPercentDocument, options);
      }
export function useGetMonthPercentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMonthPercentQuery, GetMonthPercentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMonthPercentQuery, GetMonthPercentQueryVariables>(GetMonthPercentDocument, options);
        }
export function useGetMonthPercentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMonthPercentQuery, GetMonthPercentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMonthPercentQuery, GetMonthPercentQueryVariables>(GetMonthPercentDocument, options);
        }
export type GetMonthPercentQueryHookResult = ReturnType<typeof useGetMonthPercentQuery>;
export type GetMonthPercentLazyQueryHookResult = ReturnType<typeof useGetMonthPercentLazyQuery>;
export type GetMonthPercentSuspenseQueryHookResult = ReturnType<typeof useGetMonthPercentSuspenseQuery>;
export type GetMonthPercentQueryResult = Apollo.QueryResult<GetMonthPercentQuery, GetMonthPercentQueryVariables>;
export const RentasDocument = gql`
    query Rentas($renta_id: [ID!]!, $fecha_registro: DateSearchInput, $fecha_salida: DateSearchInput, $hotel_id: ID!) {
  rentas(
    renta_id: $renta_id
    fecha_registro: $fecha_registro
    fecha_salida: $fecha_salida
    hotel_id: $hotel_id
  ) {
    renta_id
    fecha_registro
    numero_personas
    personas_extra
    tipo_entrada
    reserva_id
    habitacion_id
    habitacion {
      hotel_id
    }
    extras {
      monto_extra
      tipo_extra
      fecha_pago
    }
  }
}
    `;
export type RentasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<RentasQuery, RentasQueryVariables>, 'query'> & ({ variables: RentasQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const RentasComponent = (props: RentasComponentProps) => (
      <ApolloReactComponents.Query<RentasQuery, RentasQueryVariables> query={RentasDocument} {...props} />
    );
    

/**
 * __useRentasQuery__
 *
 * To run a query within a React component, call `useRentasQuery` and pass it any options that fit your needs.
 * When your component renders, `useRentasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRentasQuery({
 *   variables: {
 *      renta_id: // value for 'renta_id'
 *      fecha_registro: // value for 'fecha_registro'
 *      fecha_salida: // value for 'fecha_salida'
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useRentasQuery(baseOptions: Apollo.QueryHookOptions<RentasQuery, RentasQueryVariables> & ({ variables: RentasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RentasQuery, RentasQueryVariables>(RentasDocument, options);
      }
export function useRentasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RentasQuery, RentasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RentasQuery, RentasQueryVariables>(RentasDocument, options);
        }
export function useRentasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<RentasQuery, RentasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<RentasQuery, RentasQueryVariables>(RentasDocument, options);
        }
export type RentasQueryHookResult = ReturnType<typeof useRentasQuery>;
export type RentasLazyQueryHookResult = ReturnType<typeof useRentasLazyQuery>;
export type RentasSuspenseQueryHookResult = ReturnType<typeof useRentasSuspenseQuery>;
export type RentasQueryResult = Apollo.QueryResult<RentasQuery, RentasQueryVariables>;
export const GetHabitacionesDocument = gql`
    query getHabitaciones($hotelIdFilter: ID!) {
  habitaciones(hotel_id: $hotelIdFilter) {
    estado
    habitacion_id
    numero_habitacion
    ultima_renta {
      renta_id
      fecha_condensada
    }
  }
}
    `;
export type GetHabitacionesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetHabitacionesQuery, GetHabitacionesQueryVariables>, 'query'> & ({ variables: GetHabitacionesQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetHabitacionesComponent = (props: GetHabitacionesComponentProps) => (
      <ApolloReactComponents.Query<GetHabitacionesQuery, GetHabitacionesQueryVariables> query={GetHabitacionesDocument} {...props} />
    );
    

/**
 * __useGetHabitacionesQuery__
 *
 * To run a query within a React component, call `useGetHabitacionesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetHabitacionesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetHabitacionesQuery({
 *   variables: {
 *      hotelIdFilter: // value for 'hotelIdFilter'
 *   },
 * });
 */
export function useGetHabitacionesQuery(baseOptions: Apollo.QueryHookOptions<GetHabitacionesQuery, GetHabitacionesQueryVariables> & ({ variables: GetHabitacionesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetHabitacionesQuery, GetHabitacionesQueryVariables>(GetHabitacionesDocument, options);
      }
export function useGetHabitacionesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetHabitacionesQuery, GetHabitacionesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetHabitacionesQuery, GetHabitacionesQueryVariables>(GetHabitacionesDocument, options);
        }
export function useGetHabitacionesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetHabitacionesQuery, GetHabitacionesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetHabitacionesQuery, GetHabitacionesQueryVariables>(GetHabitacionesDocument, options);
        }
export type GetHabitacionesQueryHookResult = ReturnType<typeof useGetHabitacionesQuery>;
export type GetHabitacionesLazyQueryHookResult = ReturnType<typeof useGetHabitacionesLazyQuery>;
export type GetHabitacionesSuspenseQueryHookResult = ReturnType<typeof useGetHabitacionesSuspenseQuery>;
export type GetHabitacionesQueryResult = Apollo.QueryResult<GetHabitacionesQuery, GetHabitacionesQueryVariables>;
export const GetTurnosDocument = gql`
    query getTurnos($hotel_id: [ID!], $estado: EstadosTurno) {
  turnos(hotel_id: $hotel_id, estado: $estado) {
    nombre
    hora_entrada
    hora_salida
    hotel_id
    turno_id
    estado
  }
}
    `;
export type GetTurnosComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetTurnosQuery, GetTurnosQueryVariables>, 'query'>;

    export const GetTurnosComponent = (props: GetTurnosComponentProps) => (
      <ApolloReactComponents.Query<GetTurnosQuery, GetTurnosQueryVariables> query={GetTurnosDocument} {...props} />
    );
    

/**
 * __useGetTurnosQuery__
 *
 * To run a query within a React component, call `useGetTurnosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTurnosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTurnosQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *      estado: // value for 'estado'
 *   },
 * });
 */
export function useGetTurnosQuery(baseOptions?: Apollo.QueryHookOptions<GetTurnosQuery, GetTurnosQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTurnosQuery, GetTurnosQueryVariables>(GetTurnosDocument, options);
      }
export function useGetTurnosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTurnosQuery, GetTurnosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTurnosQuery, GetTurnosQueryVariables>(GetTurnosDocument, options);
        }
export function useGetTurnosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTurnosQuery, GetTurnosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTurnosQuery, GetTurnosQueryVariables>(GetTurnosDocument, options);
        }
export type GetTurnosQueryHookResult = ReturnType<typeof useGetTurnosQuery>;
export type GetTurnosLazyQueryHookResult = ReturnType<typeof useGetTurnosLazyQuery>;
export type GetTurnosSuspenseQueryHookResult = ReturnType<typeof useGetTurnosSuspenseQuery>;
export type GetTurnosQueryResult = Apollo.QueryResult<GetTurnosQuery, GetTurnosQueryVariables>;
export const ListenHabitacionesDocument = gql`
    subscription ListenHabitaciones($hotelIdFilter: ID!) {
  checkHabitaciones(hotel_id_filter: $hotelIdFilter) {
    estado
    habitacion_id
  }
}
    `;
export type ListenHabitacionesComponentProps = Omit<ApolloReactComponents.SubscriptionComponentOptions<ListenHabitacionesSubscription, ListenHabitacionesSubscriptionVariables>, 'subscription'>;

    export const ListenHabitacionesComponent = (props: ListenHabitacionesComponentProps) => (
      <ApolloReactComponents.Subscription<ListenHabitacionesSubscription, ListenHabitacionesSubscriptionVariables> subscription={ListenHabitacionesDocument} {...props} />
    );
    

/**
 * __useListenHabitacionesSubscription__
 *
 * To run a query within a React component, call `useListenHabitacionesSubscription` and pass it any options that fit your needs.
 * When your component renders, `useListenHabitacionesSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListenHabitacionesSubscription({
 *   variables: {
 *      hotelIdFilter: // value for 'hotelIdFilter'
 *   },
 * });
 */
export function useListenHabitacionesSubscription(baseOptions: Apollo.SubscriptionHookOptions<ListenHabitacionesSubscription, ListenHabitacionesSubscriptionVariables> & ({ variables: ListenHabitacionesSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<ListenHabitacionesSubscription, ListenHabitacionesSubscriptionVariables>(ListenHabitacionesDocument, options);
      }
export type ListenHabitacionesSubscriptionHookResult = ReturnType<typeof useListenHabitacionesSubscription>;
export type ListenHabitacionesSubscriptionResult = Apollo.SubscriptionResult<ListenHabitacionesSubscription>;
export const Obtener_VentasDocument = gql`
    query Obtener_ventas($get_today_sales_input: GetTodaySalesInput!) {
  obtener_ventas(get_today_sales_input: $get_today_sales_input) {
    nombre
    total_extras
    total_ordenes
    total_restaurante
    total_propinas
    total_rentas
    total_reservas
  }
}
    `;
export type Obtener_VentasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<Obtener_VentasQuery, Obtener_VentasQueryVariables>, 'query'> & ({ variables: Obtener_VentasQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const Obtener_VentasComponent = (props: Obtener_VentasComponentProps) => (
      <ApolloReactComponents.Query<Obtener_VentasQuery, Obtener_VentasQueryVariables> query={Obtener_VentasDocument} {...props} />
    );
    

/**
 * __useObtener_VentasQuery__
 *
 * To run a query within a React component, call `useObtener_VentasQuery` and pass it any options that fit your needs.
 * When your component renders, `useObtener_VentasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useObtener_VentasQuery({
 *   variables: {
 *      get_today_sales_input: // value for 'get_today_sales_input'
 *   },
 * });
 */
export function useObtener_VentasQuery(baseOptions: Apollo.QueryHookOptions<Obtener_VentasQuery, Obtener_VentasQueryVariables> & ({ variables: Obtener_VentasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Obtener_VentasQuery, Obtener_VentasQueryVariables>(Obtener_VentasDocument, options);
      }
export function useObtener_VentasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Obtener_VentasQuery, Obtener_VentasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Obtener_VentasQuery, Obtener_VentasQueryVariables>(Obtener_VentasDocument, options);
        }
export function useObtener_VentasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Obtener_VentasQuery, Obtener_VentasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Obtener_VentasQuery, Obtener_VentasQueryVariables>(Obtener_VentasDocument, options);
        }
export type Obtener_VentasQueryHookResult = ReturnType<typeof useObtener_VentasQuery>;
export type Obtener_VentasLazyQueryHookResult = ReturnType<typeof useObtener_VentasLazyQuery>;
export type Obtener_VentasSuspenseQueryHookResult = ReturnType<typeof useObtener_VentasSuspenseQuery>;
export type Obtener_VentasQueryResult = Apollo.QueryResult<Obtener_VentasQuery, Obtener_VentasQueryVariables>;
export const GetIncidenciasDocument = gql`
    query GetIncidencias($hotel_id: ID!, $fecha_operacion: DateSearchInput) {
  incidencias(hotel_id: $hotel_id, fecha_operacion: $fecha_operacion) {
    incidencia_id
    detalle
    habitacion_id
    folio
    fecha_registro
    fecha_cierre
    colaborador_id_reporta
    estado
    huesped
    matricula
    tipo_incidencia
    colaborador_reporta {
      nombre
      apellido_paterno
      apellido_materno
      puesto {
        nombre
      }
    }
    colaborador_id_cierra
    colaborador_cierra {
      nombre
      apellido_paterno
      apellido_materno
    }
    area
    severidad
    turno_id
    turno {
      nombre
    }
    habitacion {
      habitacion_id
      numero_habitacion
      tipo_habitacion_id
      tipo_habitacion {
        tipo_habitacion_id
        nombre
      }
    }
    imagenes {
      imagen
    }
  }
}
    `;
export type GetIncidenciasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetIncidenciasQuery, GetIncidenciasQueryVariables>, 'query'> & ({ variables: GetIncidenciasQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetIncidenciasComponent = (props: GetIncidenciasComponentProps) => (
      <ApolloReactComponents.Query<GetIncidenciasQuery, GetIncidenciasQueryVariables> query={GetIncidenciasDocument} {...props} />
    );
    

/**
 * __useGetIncidenciasQuery__
 *
 * To run a query within a React component, call `useGetIncidenciasQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIncidenciasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIncidenciasQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *      fecha_operacion: // value for 'fecha_operacion'
 *   },
 * });
 */
export function useGetIncidenciasQuery(baseOptions: Apollo.QueryHookOptions<GetIncidenciasQuery, GetIncidenciasQueryVariables> & ({ variables: GetIncidenciasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIncidenciasQuery, GetIncidenciasQueryVariables>(GetIncidenciasDocument, options);
      }
export function useGetIncidenciasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIncidenciasQuery, GetIncidenciasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIncidenciasQuery, GetIncidenciasQueryVariables>(GetIncidenciasDocument, options);
        }
export function useGetIncidenciasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetIncidenciasQuery, GetIncidenciasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetIncidenciasQuery, GetIncidenciasQueryVariables>(GetIncidenciasDocument, options);
        }
export type GetIncidenciasQueryHookResult = ReturnType<typeof useGetIncidenciasQuery>;
export type GetIncidenciasLazyQueryHookResult = ReturnType<typeof useGetIncidenciasLazyQuery>;
export type GetIncidenciasSuspenseQueryHookResult = ReturnType<typeof useGetIncidenciasSuspenseQuery>;
export type GetIncidenciasQueryResult = Apollo.QueryResult<GetIncidenciasQuery, GetIncidenciasQueryVariables>;
export const ObtenerBandejaIncidenciasDocument = gql`
    query ObtenerBandejaIncidencias($usuarioId: [String!]!, $hotelId: [String!]) {
  obtener_bandeja_incidencias(usuario_id: $usuarioId, hotel_id: $hotelId) {
    bandeja_notificaciones_id
    hotel_id
    leido
    incidencia_id
    incidencia {
      incidencia_id
      detalle
      habitacion_id
      tipo_incidencia
    }
  }
}
    `;
export type ObtenerBandejaIncidenciasComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>, 'query'> & ({ variables: ObtenerBandejaIncidenciasQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const ObtenerBandejaIncidenciasComponent = (props: ObtenerBandejaIncidenciasComponentProps) => (
      <ApolloReactComponents.Query<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables> query={ObtenerBandejaIncidenciasDocument} {...props} />
    );
    

/**
 * __useObtenerBandejaIncidenciasQuery__
 *
 * To run a query within a React component, call `useObtenerBandejaIncidenciasQuery` and pass it any options that fit your needs.
 * When your component renders, `useObtenerBandejaIncidenciasQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useObtenerBandejaIncidenciasQuery({
 *   variables: {
 *      usuarioId: // value for 'usuarioId'
 *      hotelId: // value for 'hotelId'
 *   },
 * });
 */
export function useObtenerBandejaIncidenciasQuery(baseOptions: Apollo.QueryHookOptions<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables> & ({ variables: ObtenerBandejaIncidenciasQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>(ObtenerBandejaIncidenciasDocument, options);
      }
export function useObtenerBandejaIncidenciasLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>(ObtenerBandejaIncidenciasDocument, options);
        }
export function useObtenerBandejaIncidenciasSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>(ObtenerBandejaIncidenciasDocument, options);
        }
export type ObtenerBandejaIncidenciasQueryHookResult = ReturnType<typeof useObtenerBandejaIncidenciasQuery>;
export type ObtenerBandejaIncidenciasLazyQueryHookResult = ReturnType<typeof useObtenerBandejaIncidenciasLazyQuery>;
export type ObtenerBandejaIncidenciasSuspenseQueryHookResult = ReturnType<typeof useObtenerBandejaIncidenciasSuspenseQuery>;
export type ObtenerBandejaIncidenciasQueryResult = Apollo.QueryResult<ObtenerBandejaIncidenciasQuery, ObtenerBandejaIncidenciasQueryVariables>;
export const MarcarComoLeidaDocument = gql`
    mutation marcarComoLeida($bandejaNotificacionesId: String!) {
  marcar_como_leida(bandeja_notificaciones_id: $bandejaNotificacionesId)
}
    `;
export type MarcarComoLeidaMutationFn = Apollo.MutationFunction<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables>;
export type MarcarComoLeidaComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables>, 'mutation'>;

    export const MarcarComoLeidaComponent = (props: MarcarComoLeidaComponentProps) => (
      <ApolloReactComponents.Mutation<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables> mutation={MarcarComoLeidaDocument} {...props} />
    );
    

/**
 * __useMarcarComoLeidaMutation__
 *
 * To run a mutation, you first call `useMarcarComoLeidaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarcarComoLeidaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [marcarComoLeidaMutation, { data, loading, error }] = useMarcarComoLeidaMutation({
 *   variables: {
 *      bandejaNotificacionesId: // value for 'bandejaNotificacionesId'
 *   },
 * });
 */
export function useMarcarComoLeidaMutation(baseOptions?: Apollo.MutationHookOptions<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables>(MarcarComoLeidaDocument, options);
      }
export type MarcarComoLeidaMutationHookResult = ReturnType<typeof useMarcarComoLeidaMutation>;
export type MarcarComoLeidaMutationResult = Apollo.MutationResult<MarcarComoLeidaMutation>;
export type MarcarComoLeidaMutationOptions = Apollo.BaseMutationOptions<MarcarComoLeidaMutation, MarcarComoLeidaMutationVariables>;
export const GetUsuariosNotificacionesActivosDocument = gql`
    query GetUsuariosNotificacionesActivos($usuario_id: String!, $hotel_id: String!) {
  notificaciones_no_leidas_alerta(usuario_id: $usuario_id, hotel_id: $hotel_id)
}
    `;
export type GetUsuariosNotificacionesActivosComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>, 'query'> & ({ variables: GetUsuariosNotificacionesActivosQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetUsuariosNotificacionesActivosComponent = (props: GetUsuariosNotificacionesActivosComponentProps) => (
      <ApolloReactComponents.Query<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables> query={GetUsuariosNotificacionesActivosDocument} {...props} />
    );
    

/**
 * __useGetUsuariosNotificacionesActivosQuery__
 *
 * To run a query within a React component, call `useGetUsuariosNotificacionesActivosQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsuariosNotificacionesActivosQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsuariosNotificacionesActivosQuery({
 *   variables: {
 *      usuario_id: // value for 'usuario_id'
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useGetUsuariosNotificacionesActivosQuery(baseOptions: Apollo.QueryHookOptions<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables> & ({ variables: GetUsuariosNotificacionesActivosQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>(GetUsuariosNotificacionesActivosDocument, options);
      }
export function useGetUsuariosNotificacionesActivosLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>(GetUsuariosNotificacionesActivosDocument, options);
        }
export function useGetUsuariosNotificacionesActivosSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>(GetUsuariosNotificacionesActivosDocument, options);
        }
export type GetUsuariosNotificacionesActivosQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesActivosQuery>;
export type GetUsuariosNotificacionesActivosLazyQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesActivosLazyQuery>;
export type GetUsuariosNotificacionesActivosSuspenseQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesActivosSuspenseQuery>;
export type GetUsuariosNotificacionesActivosQueryResult = Apollo.QueryResult<GetUsuariosNotificacionesActivosQuery, GetUsuariosNotificacionesActivosQueryVariables>;
export const ObtenerBandejaNotificacionesDocument = gql`
    query ObtenerBandejaNotificaciones($usuarioId: [String!]!, $hotelId: [String!]!) {
  obtener_bandeja_notificaciones(usuario_id: $usuarioId, hotel_id: $hotelId) {
    bandeja_notificaciones_id
    fecha_registro
    hotel_id
    leido
    mensaje
    tipo
    usuario_id
  }
}
    `;
export type ObtenerBandejaNotificacionesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>, 'query'> & ({ variables: ObtenerBandejaNotificacionesQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const ObtenerBandejaNotificacionesComponent = (props: ObtenerBandejaNotificacionesComponentProps) => (
      <ApolloReactComponents.Query<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables> query={ObtenerBandejaNotificacionesDocument} {...props} />
    );
    

/**
 * __useObtenerBandejaNotificacionesQuery__
 *
 * To run a query within a React component, call `useObtenerBandejaNotificacionesQuery` and pass it any options that fit your needs.
 * When your component renders, `useObtenerBandejaNotificacionesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useObtenerBandejaNotificacionesQuery({
 *   variables: {
 *      usuarioId: // value for 'usuarioId'
 *      hotelId: // value for 'hotelId'
 *   },
 * });
 */
export function useObtenerBandejaNotificacionesQuery(baseOptions: Apollo.QueryHookOptions<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables> & ({ variables: ObtenerBandejaNotificacionesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>(ObtenerBandejaNotificacionesDocument, options);
      }
export function useObtenerBandejaNotificacionesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>(ObtenerBandejaNotificacionesDocument, options);
        }
export function useObtenerBandejaNotificacionesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>(ObtenerBandejaNotificacionesDocument, options);
        }
export type ObtenerBandejaNotificacionesQueryHookResult = ReturnType<typeof useObtenerBandejaNotificacionesQuery>;
export type ObtenerBandejaNotificacionesLazyQueryHookResult = ReturnType<typeof useObtenerBandejaNotificacionesLazyQuery>;
export type ObtenerBandejaNotificacionesSuspenseQueryHookResult = ReturnType<typeof useObtenerBandejaNotificacionesSuspenseQuery>;
export type ObtenerBandejaNotificacionesQueryResult = Apollo.QueryResult<ObtenerBandejaNotificacionesQuery, ObtenerBandejaNotificacionesQueryVariables>;
export const MarcarNotificacionComoLeidaDocument = gql`
    mutation MarcarNotificacionComoLeida($bandejaNotificacionId: String!) {
  marcar_como_leida(bandeja_notificaciones_id: $bandejaNotificacionId)
}
    `;
export type MarcarNotificacionComoLeidaMutationFn = Apollo.MutationFunction<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables>;
export type MarcarNotificacionComoLeidaComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables>, 'mutation'>;

    export const MarcarNotificacionComoLeidaComponent = (props: MarcarNotificacionComoLeidaComponentProps) => (
      <ApolloReactComponents.Mutation<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables> mutation={MarcarNotificacionComoLeidaDocument} {...props} />
    );
    

/**
 * __useMarcarNotificacionComoLeidaMutation__
 *
 * To run a mutation, you first call `useMarcarNotificacionComoLeidaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarcarNotificacionComoLeidaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [marcarNotificacionComoLeidaMutation, { data, loading, error }] = useMarcarNotificacionComoLeidaMutation({
 *   variables: {
 *      bandejaNotificacionId: // value for 'bandejaNotificacionId'
 *   },
 * });
 */
export function useMarcarNotificacionComoLeidaMutation(baseOptions?: Apollo.MutationHookOptions<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables>(MarcarNotificacionComoLeidaDocument, options);
      }
export type MarcarNotificacionComoLeidaMutationHookResult = ReturnType<typeof useMarcarNotificacionComoLeidaMutation>;
export type MarcarNotificacionComoLeidaMutationResult = Apollo.MutationResult<MarcarNotificacionComoLeidaMutation>;
export type MarcarNotificacionComoLeidaMutationOptions = Apollo.BaseMutationOptions<MarcarNotificacionComoLeidaMutation, MarcarNotificacionComoLeidaMutationVariables>;
export const GetUsuariosNotificacionesDocument = gql`
    query GetUsuariosNotificaciones($usuario_id: String!, $hotel_id: String!) {
  usuarios_notificaciones(usuario_id: $usuario_id, hotel_id: $hotel_id) {
    tipo
    activado
  }
}
    `;
export type GetUsuariosNotificacionesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>, 'query'> & ({ variables: GetUsuariosNotificacionesQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const GetUsuariosNotificacionesComponent = (props: GetUsuariosNotificacionesComponentProps) => (
      <ApolloReactComponents.Query<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables> query={GetUsuariosNotificacionesDocument} {...props} />
    );
    

/**
 * __useGetUsuariosNotificacionesQuery__
 *
 * To run a query within a React component, call `useGetUsuariosNotificacionesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsuariosNotificacionesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsuariosNotificacionesQuery({
 *   variables: {
 *      usuario_id: // value for 'usuario_id'
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useGetUsuariosNotificacionesQuery(baseOptions: Apollo.QueryHookOptions<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables> & ({ variables: GetUsuariosNotificacionesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>(GetUsuariosNotificacionesDocument, options);
      }
export function useGetUsuariosNotificacionesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>(GetUsuariosNotificacionesDocument, options);
        }
export function useGetUsuariosNotificacionesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>(GetUsuariosNotificacionesDocument, options);
        }
export type GetUsuariosNotificacionesQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesQuery>;
export type GetUsuariosNotificacionesLazyQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesLazyQuery>;
export type GetUsuariosNotificacionesSuspenseQueryHookResult = ReturnType<typeof useGetUsuariosNotificacionesSuspenseQuery>;
export type GetUsuariosNotificacionesQueryResult = Apollo.QueryResult<GetUsuariosNotificacionesQuery, GetUsuariosNotificacionesQueryVariables>;
export const ActualizarConfiguracionNotificacionesDocument = gql`
    mutation ActualizarConfiguracionNotificaciones($configNotificacionesInput: UpdateUsuariosNotificacionesInput!) {
  actualizar_configuracion_notificaciones(
    configNotificacionesInput: $configNotificacionesInput
  ) {
    activado
    tipo
    usuario_notificaciones_id
  }
}
    `;
export type ActualizarConfiguracionNotificacionesMutationFn = Apollo.MutationFunction<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables>;
export type ActualizarConfiguracionNotificacionesComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables>, 'mutation'>;

    export const ActualizarConfiguracionNotificacionesComponent = (props: ActualizarConfiguracionNotificacionesComponentProps) => (
      <ApolloReactComponents.Mutation<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables> mutation={ActualizarConfiguracionNotificacionesDocument} {...props} />
    );
    

/**
 * __useActualizarConfiguracionNotificacionesMutation__
 *
 * To run a mutation, you first call `useActualizarConfiguracionNotificacionesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActualizarConfiguracionNotificacionesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [actualizarConfiguracionNotificacionesMutation, { data, loading, error }] = useActualizarConfiguracionNotificacionesMutation({
 *   variables: {
 *      configNotificacionesInput: // value for 'configNotificacionesInput'
 *   },
 * });
 */
export function useActualizarConfiguracionNotificacionesMutation(baseOptions?: Apollo.MutationHookOptions<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables>(ActualizarConfiguracionNotificacionesDocument, options);
      }
export type ActualizarConfiguracionNotificacionesMutationHookResult = ReturnType<typeof useActualizarConfiguracionNotificacionesMutation>;
export type ActualizarConfiguracionNotificacionesMutationResult = Apollo.MutationResult<ActualizarConfiguracionNotificacionesMutation>;
export type ActualizarConfiguracionNotificacionesMutationOptions = Apollo.BaseMutationOptions<ActualizarConfiguracionNotificacionesMutation, ActualizarConfiguracionNotificacionesMutationVariables>;
export const NotificacionesDocument = gql`
    query Notificaciones($hotelIds: [String!]) {
  notificaciones(hotel_id: $hotelIds) {
    hotel_id
    notificacion_id
    tipo
    topic
  }
}
    `;
export type NotificacionesComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<NotificacionesQuery, NotificacionesQueryVariables>, 'query'>;

    export const NotificacionesComponent = (props: NotificacionesComponentProps) => (
      <ApolloReactComponents.Query<NotificacionesQuery, NotificacionesQueryVariables> query={NotificacionesDocument} {...props} />
    );
    

/**
 * __useNotificacionesQuery__
 *
 * To run a query within a React component, call `useNotificacionesQuery` and pass it any options that fit your needs.
 * When your component renders, `useNotificacionesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificacionesQuery({
 *   variables: {
 *      hotelIds: // value for 'hotelIds'
 *   },
 * });
 */
export function useNotificacionesQuery(baseOptions?: Apollo.QueryHookOptions<NotificacionesQuery, NotificacionesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NotificacionesQuery, NotificacionesQueryVariables>(NotificacionesDocument, options);
      }
export function useNotificacionesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NotificacionesQuery, NotificacionesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NotificacionesQuery, NotificacionesQueryVariables>(NotificacionesDocument, options);
        }
export function useNotificacionesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NotificacionesQuery, NotificacionesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NotificacionesQuery, NotificacionesQueryVariables>(NotificacionesDocument, options);
        }
export type NotificacionesQueryHookResult = ReturnType<typeof useNotificacionesQuery>;
export type NotificacionesLazyQueryHookResult = ReturnType<typeof useNotificacionesLazyQuery>;
export type NotificacionesSuspenseQueryHookResult = ReturnType<typeof useNotificacionesSuspenseQuery>;
export type NotificacionesQueryResult = Apollo.QueryResult<NotificacionesQuery, NotificacionesQueryVariables>;
export const GetPerfilDocument = gql`
    query GetPerfil {
  mi_perfil {
    usuario_id
    nombre
    apellido_paterno
    apellido_materno
    correo
    fecha_registro
    fecha_modificacion
    eliminado
    telefono
    estatus
    hotel {
      nombre_hotel
      hotel_id
      zona_horaria
      logo_hotel
    }
    roles {
      rol_id
      grupo_hotel_id
      nombre
      eliminado
      grupo_hotel {
        grupo_hotel_id
      }
    }
    turno {
      nombre
      turno_id
    }
    colaborador {
      colaborador_id
      foto
    }
  }
}
    `;
export type GetPerfilComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<GetPerfilQuery, GetPerfilQueryVariables>, 'query'>;

    export const GetPerfilComponent = (props: GetPerfilComponentProps) => (
      <ApolloReactComponents.Query<GetPerfilQuery, GetPerfilQueryVariables> query={GetPerfilDocument} {...props} />
    );
    

/**
 * __useGetPerfilQuery__
 *
 * To run a query within a React component, call `useGetPerfilQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPerfilQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPerfilQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPerfilQuery(baseOptions?: Apollo.QueryHookOptions<GetPerfilQuery, GetPerfilQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPerfilQuery, GetPerfilQueryVariables>(GetPerfilDocument, options);
      }
export function useGetPerfilLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPerfilQuery, GetPerfilQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPerfilQuery, GetPerfilQueryVariables>(GetPerfilDocument, options);
        }
export function useGetPerfilSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetPerfilQuery, GetPerfilQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetPerfilQuery, GetPerfilQueryVariables>(GetPerfilDocument, options);
        }
export type GetPerfilQueryHookResult = ReturnType<typeof useGetPerfilQuery>;
export type GetPerfilLazyQueryHookResult = ReturnType<typeof useGetPerfilLazyQuery>;
export type GetPerfilSuspenseQueryHookResult = ReturnType<typeof useGetPerfilSuspenseQuery>;
export type GetPerfilQueryResult = Apollo.QueryResult<GetPerfilQuery, GetPerfilQueryVariables>;
export const UpdatePerfilColaboradorDocument = gql`
    mutation UpdatePerfilColaborador($input: UpdateColaboradorInput!) {
  editar_colaborador(datos_colaborador: $input) {
    colaborador_id
    foto
  }
}
    `;
export type UpdatePerfilColaboradorMutationFn = Apollo.MutationFunction<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables>;
export type UpdatePerfilColaboradorComponentProps = Omit<ApolloReactComponents.MutationComponentOptions<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables>, 'mutation'>;

    export const UpdatePerfilColaboradorComponent = (props: UpdatePerfilColaboradorComponentProps) => (
      <ApolloReactComponents.Mutation<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables> mutation={UpdatePerfilColaboradorDocument} {...props} />
    );
    

/**
 * __useUpdatePerfilColaboradorMutation__
 *
 * To run a mutation, you first call `useUpdatePerfilColaboradorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePerfilColaboradorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePerfilColaboradorMutation, { data, loading, error }] = useUpdatePerfilColaboradorMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePerfilColaboradorMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables>(UpdatePerfilColaboradorDocument, options);
      }
export type UpdatePerfilColaboradorMutationHookResult = ReturnType<typeof useUpdatePerfilColaboradorMutation>;
export type UpdatePerfilColaboradorMutationResult = Apollo.MutationResult<UpdatePerfilColaboradorMutation>;
export type UpdatePerfilColaboradorMutationOptions = Apollo.BaseMutationOptions<UpdatePerfilColaboradorMutation, UpdatePerfilColaboradorMutationVariables>;
export const CurrentDateDocument = gql`
    query currentDate {
  serverDate
}
    `;
export type CurrentDateComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<CurrentDateQuery, CurrentDateQueryVariables>, 'query'>;

    export const CurrentDateComponent = (props: CurrentDateComponentProps) => (
      <ApolloReactComponents.Query<CurrentDateQuery, CurrentDateQueryVariables> query={CurrentDateDocument} {...props} />
    );
    

/**
 * __useCurrentDateQuery__
 *
 * To run a query within a React component, call `useCurrentDateQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentDateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentDateQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentDateQuery(baseOptions?: Apollo.QueryHookOptions<CurrentDateQuery, CurrentDateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentDateQuery, CurrentDateQueryVariables>(CurrentDateDocument, options);
      }
export function useCurrentDateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentDateQuery, CurrentDateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentDateQuery, CurrentDateQueryVariables>(CurrentDateDocument, options);
        }
export function useCurrentDateSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentDateQuery, CurrentDateQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentDateQuery, CurrentDateQueryVariables>(CurrentDateDocument, options);
        }
export type CurrentDateQueryHookResult = ReturnType<typeof useCurrentDateQuery>;
export type CurrentDateLazyQueryHookResult = ReturnType<typeof useCurrentDateLazyQuery>;
export type CurrentDateSuspenseQueryHookResult = ReturnType<typeof useCurrentDateSuspenseQuery>;
export type CurrentDateQueryResult = Apollo.QueryResult<CurrentDateQuery, CurrentDateQueryVariables>;
export const Ultimo_CorteDocument = gql`
    query Ultimo_corte($hotel_id: ID!) {
  ultimo_corte(hotel_id: $hotel_id) {
    corte_id
    fecha_cierre_corte
    fecha_fin_corte
    fecha_inicio_corte
    efectivo_ingresado
    folio
    turno_id
    turno {
      nombre
    }
    usuario_cierra_corte
    usuario_realiza_corte
    total_corte
    incidencias {
      incidencia_id
    }
    usuario_crea {
      apellido_materno
      apellido_paterno
      nombre
    }
    usuario_cierra {
      apellido_materno
      apellido_paterno
      nombre
    }
  }
}
    `;
export type Ultimo_CorteComponentProps = Omit<ApolloReactComponents.QueryComponentOptions<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>, 'query'> & ({ variables: Ultimo_CorteQueryVariables; skip?: boolean; } | { skip: boolean; });

    export const Ultimo_CorteComponent = (props: Ultimo_CorteComponentProps) => (
      <ApolloReactComponents.Query<Ultimo_CorteQuery, Ultimo_CorteQueryVariables> query={Ultimo_CorteDocument} {...props} />
    );
    

/**
 * __useUltimo_CorteQuery__
 *
 * To run a query within a React component, call `useUltimo_CorteQuery` and pass it any options that fit your needs.
 * When your component renders, `useUltimo_CorteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUltimo_CorteQuery({
 *   variables: {
 *      hotel_id: // value for 'hotel_id'
 *   },
 * });
 */
export function useUltimo_CorteQuery(baseOptions: Apollo.QueryHookOptions<Ultimo_CorteQuery, Ultimo_CorteQueryVariables> & ({ variables: Ultimo_CorteQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>(Ultimo_CorteDocument, options);
      }
export function useUltimo_CorteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>(Ultimo_CorteDocument, options);
        }
export function useUltimo_CorteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>(Ultimo_CorteDocument, options);
        }
export type Ultimo_CorteQueryHookResult = ReturnType<typeof useUltimo_CorteQuery>;
export type Ultimo_CorteLazyQueryHookResult = ReturnType<typeof useUltimo_CorteLazyQuery>;
export type Ultimo_CorteSuspenseQueryHookResult = ReturnType<typeof useUltimo_CorteSuspenseQuery>;
export type Ultimo_CorteQueryResult = Apollo.QueryResult<Ultimo_CorteQuery, Ultimo_CorteQueryVariables>;