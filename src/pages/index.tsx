import { Suspense, lazy } from "react"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Provider } from "react-redux"
import { ApolloProvider } from "@apollo/client"
import { client } from "src/graphql"
import { store } from "../store/store"

import PublicRoute from "src/router/Public"
import PrivateRoute from "src/router/Private"

import LoginLoad from "./auth/login/Login.load"
import LayoutLoad from "src/shared/components/layout/principal/Principal.load"
import LayoutDocs from "src/shared/components/layout/principal/Principal.Docs"

import Home from "./home"
import FreeRoom from "./home/room-detail/pages/FreeRoom/FreeRoom"
import FreeRoomSucia from "./home/room-detail/pages/FreeRoomSucia/FreeRoomSucia"
import FreeRoomSupervision from "./home/room-detail/pages/FreeRoomSupervision/FreeRoomSupervision"
import FreeRoomMantenimiento from "./home/room-detail/pages/FreeRoomMantenimiento/FreeRoomMantenimiento"
import Checkout from "./home/room-detail/pages/Checkout/Checkout"
import EndCheckout from "./home/room-detail/pages/EndCheckout/EndCheckout"
import PendingPayments from "./home/room-detail/pages/PendingPayments/PendingPayments"
import FreeRoomPendienteSupervision from "./home/room-detail/pages/FreeRoomPendienteSupervision/FreeRoomPendienteSupervision"
import FreeRoomBloqueada from "./home/room-detail/pages/FreeRoomBloqueada/FreeRoomBloqueada"
import CleanRoomSupervision from "./home/room-detail/drawer/limpieza/sections/CleanSupervision"
import Guest from "./guest"
import RegistroReservas from "./reservaciones/registro-reservas/RegistroReservas"
import { Reservaciones } from "./reservaciones/inicio"
import VentaHabitacion from "./venta-habitacion/VentaHabitacion"

import Gastos from "./gastos"
import { ConfiguracionGastos } from "./gastos/configuracion/Configuracion"
import GastosMayorCategoria from "./gastos/GastosMayorCategoria/GastosMayorCategoria"
import Incidencias from "./incidencias"
import RegistroIncidencia from "./incidencias/registro-incidencia"
import IncidenciasHabitacion from "./incidencias/incidencias-habitacion"
import Personal from "./personal/pages/tabla-personal"
import PersonalTable from "./personal/pages/administracion-personal/Table/PersonalTable"
import OnboardingConfiguracionDigital from "./personal/pages/onboarding-configuracion-digital/OnboardingConfiguracionDigital"

import CortesMovimientos from "./Cortes/home"
import Fajillas from "./Cortes/Sections/Fajillas/Fajillas"
import CrearCorte from "./Cortes/crear-corte"
import TodosCortes from "./Cortes/Sections/TodosCortes/TodosCortes"
import ResumenTurno from "./Cortes/Sections/ResumenTurno/ResumenTurno"
import Movimientos from "./Cortes/Sections/Consulta/Movimientos"
import EjmPDF from "./Cortes/EjmPDF/pdf"
import CaratulaPeriodo from "./Cortes/EjmPDF/sections/CaratulaPeriodo"
import CaratulaMensual from "./Cortes/caratulas/mensual"
import CaratulaFecha from "./Cortes/caratulas/fecha"
import CortesPendientes from "./Cortes/cortes-pendientes"
import DiaOTurnoCortePDF from "./Cortes/EjmPDF/sections/DiaOTurnoCortePDF"
import HistorialCortesSemanal from "./Cortes/historial-cortes"

import Ordenes from "./room-service/ordenes"
import CancelacionesRoomService from "./room-service/cancelacion"
import RoomService from "./room-service/productos"
import DetalleCompra from "./room-service/detalle-compra"
import PagoRoomService from "./room-service/pago"

import Error from "./error/Error"

import Registry from "./auth/registry"
import RegistryData from "./auth/registry/RegistryData"
import Verification from "./auth/registry/Verification"
import Verified from "./auth/registry/Verified"
import EmptyState from "./auth/empty-state"
import Expiration from "./auth/expiration"
import Forgot from "./auth/forgot-password/forgot"
import ChangePassword from "./auth/forgot-password/change"

import Inventario from "./inventario"
import AssortmentHistory from "./inventario/sections/assortment-history/AssortmentHistory"
import AgregarProducto from "./inventario/producto/agregar"
import EditarProducto from "./inventario/producto/editar"
import MovementHistory from "./inventario/sections/movement-history/MovementHistory"
import Propinas from "./propinas/home"

import { useListenerConnection } from "src/shared/hooks/connection"
import RoomsProvider from "src/shared/providers/RoomsProvider"
import RegistroPersonal from "./personal/pages/administracion-personal/RegistroPersonal"
import ReservasDia from "./reservaciones/reservas-dia/ReservasDia"
import PagoPropinas from "./propinas/pago-propinas/PagoPropinas"
import DetallePagoPropinas from "./propinas/pago-propinas/detalle"
import PropinasPDF from "./propinas/pago-propinas/pdf/detalle"
import ReportePropinasPDF from "./propinas/pago-propinas/pdf/reporte"
import HistorialPagoPropinas from "./propinas/historial-pago-propinas/HistorialPagoPropinas"
import ConfigPropinas from "./propinas/config-propinas/ConfigPropinas"
import HotelImasStatusProvider from "src/shared/providers/HotelImasStatusProvider"
import Cancelada from "./home/room-detail/drawer/cancelada"
import TransferItems from "./inventario/sections/transfer-items/TransferItems"
import AddRecipe from "./inventario/recipes-process/recipes/add-recipe/AddRecipe"
import AddProcess from "./inventario/recipes-process/process/add-process/AddProcess"
import HomeRecipesProcess from "./inventario/recipes-process/home/HomeRecipesProcess"
import AssortmentItems from "./inventario/sections/assortment-items/AssortmentItems"
import Disponibilidad from "./disponibilidad"
import Cocina from "./cocina"
import { ConfiguracionCategoria } from "./room-service/categorias/Configuracion"
import { ConfiguracionAlmacenes } from "./inventario/almacenes/Configuracion"
import HistorialProduccion from "./inventario/recipes-process/sections/HistorialProduccion/HistorialProduccion"
import ProduccionProcesos from "./inventario/recipes-process/produccion"

import HistorialRS from "./room-service/historial"
import DetalleOrden from "./room-service/editar-orden/detalle"
import EditarOrden from "./room-service/editar-orden/productos"

import AuthPinWrapper from "./inventario/producto/wrapper"
import OrdersProvider from "src/shared/providers/OrdersProvider"
import Restaurante from "./restaurante/Restaurante"
import { useProfile } from "src/shared/hooks/useProfile"
import ConfigRooms from "./home/config/ConfigRooms"
import { RoleNames } from "src/shared/hooks/useAuth"
import TablesProvider from "src/shared/providers/TablesProvider"
import CerrarCuenta from "./restaurante/detail/drawer/general/cerrar-cuenta"
import ConfigTables from "./restaurante/config/ConfigTables"
import DetalleComanda from "./restaurante/comanda/detalle-comanda"
import EditarComanda from "./restaurante/comanda/editar-comanda"
import { CurrentdateProvider } from "src/shared/providers/CurrentdateProvider"
import Mantenimiento from "./mantenimiento/Mantenimiento"
import Reports from "./reports/Reports"
import ColaboradorProvider from "src/shared/providers/ColaboradorProvider"
import { MotivosBloqueoProvider } from "src/shared/providers/MotivosBloqueoProvider"
import { TiposMantenimientoProvider } from "src/shared/providers/TiposMantenimientoProvider"

const Login = lazy(() => import("./auth/login"))
const AboutUs = lazy(() => import("./public/AboutUs/AboutUs"))
const Layout = lazy(() => import("src/shared/components/layout/principal"))

//RUTAS
const routesReservacion = [
    { path: "registro-reserva/huesped", element: <Guest /> },
    { path: "registro-reserva/huesped/:reserva_id", element: <Guest /> },
    { path: "registro-reserva", element: <RegistroReservas /> },
    {
        path: "registro-reserva/:reserva_id",
        element: (
            <AuthPinWrapper authorizedRoles={[RoleNames.recepcionista, RoleNames.admin, RoleNames.superadmin]} skipRoles={[RoleNames.admin, RoleNames.superadmin]}>
                <RegistroReservas />
            </AuthPinWrapper>
        ),
    },
    {
        path: "registro-reserva/2/:reserva_id",
        element: (
            <CurrentdateProvider>
                <RegistroReservas />
            </CurrentdateProvider>
        ),
    },
    { path: "reservaciones", element: <Navigate to={"table"} /> },
    {
        path: "reservaciones/:view",
        element: (
            <CurrentdateProvider>
                <Reservaciones />
            </CurrentdateProvider>
        ),
    },
    {
        path: "reservas/calenderio/:date",
        element: (
            <CurrentdateProvider>
                <ReservasDia />
            </CurrentdateProvider>
        ),
    },
]

const routesPersonal = [
    {
        path: "personal",
        element: (
            <CurrentdateProvider>
                <Personal />
            </CurrentdateProvider>
        ),
    },
    { path: "addPerson", element: <RegistroPersonal /> },
    { path: "tablePerson", element: <PersonalTable /> },
    { path: "onboardingConfiguracionDigital", element: <OnboardingConfiguracionDigital /> },
]

const routesCortes = [
    { path: "cortes", element: <CortesMovimientos /> },
    { path: "cortes/resumen/movimientos", element: <CortesMovimientos isDetail={true} /> },
    { path: "cortes/fajillas", element: <Fajillas /> },
    { path: "cortes/crear-corte/:corte_id?", element: <CrearCorte /> },
    { path: "cortes/crear-incidencia", element: <RegistroIncidencia /> },
    { path: "cortes/todosCortes", element: <TodosCortes /> },
    { path: "cortes/resumen", element: <ResumenTurno /> },
    { path: "cortes/resumen/:corte_id?", element: <ResumenTurno /> },
    { path: "cortes/consulta/movimientos", element: <Movimientos /> },
    { path: "cortes/caratula/mensual", element: <CaratulaMensual /> },
    { path: "cortes/caratula/fecha/:date?", element: <CaratulaFecha /> },
    { path: "cortes/pendientes", element: <CortesPendientes /> },
    { path: "cortes/historial-cortes", element: <HistorialCortesSemanal /> },
]

const routesHabitacion = [
    { path: "venta-habitacion/:habitacion_id", element: <VentaHabitacion /> },
    { path: "habitacion-detalle/liberar/:habitacion_id", element: <FreeRoom /> },
    { path: "detalle-habitacion/liberar-sucia/:habitacion_id", element: <FreeRoomSucia /> },
    { path: "detalle-habitacion/liberar-supervision/:habitacion_id", element: <FreeRoomSupervision /> },
    { path: "detalle-habitacion/liberar-mantenimiento/:habitacion_id", element: <FreeRoomMantenimiento /> },
    { path: "detalle-habitacion/finish-clean/:habitacion_id", element: <CleanRoomSupervision /> },
    { path: "detalle-habitacion/liberar-bloqueada/:habitacion_id", element: <FreeRoomBloqueada /> },
    {
        path: "detalle-habitacion/liberar-pending-supervision/:habitacion_id",
        element: <FreeRoomPendienteSupervision />,
    },
    { path: "detalle-habitacion/checkout/:habitacion_id", element: <Checkout /> },
    { path: "detalle-habitacion/end-checkout/:habitacion_id", element: <EndCheckout /> },
    { path: "cancelar-habitacion/:habitacion_id", element: <Cancelada /> },
    { path: "detalle-habitacion/pending-payments/:habitacion_id", element: <PendingPayments /> },
]

const routesGastos = [
    { path: "gastos", element: <Navigate to={"table"} /> },
    {
        path: "gastos/:view",
        element: (
            <CurrentdateProvider>
                <Gastos />
            </CurrentdateProvider>
        ),
    },
    { path: "gastos/config", element: <ConfiguracionGastos /> },
    { path: "gastos/categoria/:month", element: <GastosMayorCategoria /> },
]

const routesIncidencias = [
    { path: "incidencias", element: <Incidencias /> },
    { path: "registro-incidencia", element: <RegistroIncidencia /> },
    { path: "incidencias-activas/:habitacion_id", element: <IncidenciasHabitacion /> },
]
const routesRoomService = [
    { path: "room-service/ordenes", element: <Ordenes /> },
    {
        path: "room-service/cancelacion/:orden_comanda_id/order",
        element: (
            <AuthPinWrapper authorizedRoles={[RoleNames.admin, RoleNames.roomService, RoleNames.superadmin]} skipRoles={[RoleNames.admin, RoleNames.superadmin]}>
                <CancelacionesRoomService />
            </AuthPinWrapper>
        ),
    },
    {
        path: "room-service/cancelacion/:orden_comanda_id/comanda",
        element: (
            <AuthPinWrapper authorizedRoles={[RoleNames.restaurante, RoleNames.admin, RoleNames.superadmin]} skipRoles={[RoleNames.admin, RoleNames.superadmin]}>
                <CancelacionesRoomService />
            </AuthPinWrapper>
        ),
    },
    { path: "room-service-home", element: <RoomService /> },
    { path: "room-service-fullscreen/:habitacion_id", element: <RoomService fullscreen={true} /> },
    { path: "room-service/detalle-compra", element: <DetalleCompra /> },
    { path: "room-service/editar-orden/:orden_id", element: <EditarOrden /> },
    { path: "room-service/detalle-orden/:orden_id", element: <DetalleOrden /> },
    { path: "room-service/pago/:renta_id/:orden_id?", element: <PagoRoomService /> },
    { path: "room-service/categorias", element: <ConfiguracionCategoria /> },
    { path: "room-service/historial", element: <HistorialRS /> },
]

const routesInventario = [
    { path: "inventario", element: <Inventario /> },
    { path: "inventario/transfer-items", element: <TransferItems /> },
    { path: "inventario/surtido-articulos", element: <AssortmentItems /> },
    { path: "inventario/historial-surtido/:almacen_articulo_id", element: <AssortmentHistory /> },
    { path: "inventario/historial-movimientos", element: <MovementHistory /> },
    { path: "inventario/categoria", element: <ConfiguracionAlmacenes /> },
    {
        path: "inventario/producto/agregar",
        element: (
            <AuthPinWrapper
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar]}
                skipRoles={[RoleNames.admin, RoleNames.superadmin]}
                authorizedPins={[RoleNames.admin, RoleNames.superadmin]}
            >
                <AgregarProducto />
            </AuthPinWrapper>
        ),
    },
    {
        path: "inventario/producto/editar/:articulo_id",
        element: (
            <AuthPinWrapper
                authorizedRoles={[RoleNames.admin, RoleNames.superadmin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar]}
                skipRoles={[RoleNames.admin, RoleNames.superadmin]}
                authorizedPins={[RoleNames.admin, RoleNames.superadmin]}
            >
                <EditarProducto />
            </AuthPinWrapper>
        ),
    },
    { path: "inventario/receta-proceso", element: <HomeRecipesProcess /> },
    { path: "inventario/receta/agregar", element: <AddRecipe /> },
    { path: "inventario/receta/editar/:articulo_id", element: <AddRecipe /> },
    { path: "inventario/proceso/agregar", element: <AddProcess /> },
    { path: "inventario/proceso/editar/:articulo_id", element: <AddProcess /> },
    { path: "inventario/historial-produccion/:articulo_id", element: <HistorialProduccion /> },
    { path: "inventario/produccion/:almacen_articulo_id/:articulo_id", element: <ProduccionProcesos /> },
]

const routesPropinas = [
    { path: "propinas", element: <Propinas /> },
    { path: "propinas/pago-propinas/:date", element: <PagoPropinas /> },
    { path: "propinas/detalle-propinas/:date", element: <DetallePagoPropinas /> },
    { path: "propinas/historial-pagos", element: <HistorialPagoPropinas /> },
    { path: "propinas/config-propinas", element: <ConfigPropinas /> },
]

const routesCocina = [
    {
        path: "cocina",
        element: (
            <OrdersProvider>
                <CurrentdateProvider>
                    <Cocina />
                </CurrentdateProvider>
            </OrdersProvider>
        ),
    },
]

const routesRestaurante = [
    {
        path: "restaurante-home",
        element: (
            <TablesProvider>
                <CurrentdateProvider>
                    <Restaurante />
                </CurrentdateProvider>
            </TablesProvider>
        ),
    },
    { path: "restaurante/articulos", element: <RoomService restaurantMode={true} fullscreen={true} /> },
    { path: "restaurante/detalle-compra", element: <DetalleCompra /> },
    { path: "restaurante/cerrar-cuenta", element: <CerrarCuenta /> },
    { path: "restaurante/editar-comanda/:comanda_id", element: <EditarComanda /> },
    { path: "restaurante/detalle-comanda/:comanda_id", element: <DetalleComanda /> },
]

const routesMantenimiento = [
    {
        path: "mantenimiento",
        element: <Mantenimiento />,
    },
]

const routesReports = [
    {
        path: "reports",
        element: <Reports />,
    },
]

const routesRolAdmin = [
    ...routesReservacion,
    ...routesPersonal,
    ...routesCortes,
    ...routesHabitacion,
    ...routesGastos,
    ...routesIncidencias,
    ...routesRoomService,
    ...routesInventario,
    ...routesPropinas,
    ...routesCocina,
    ...routesRestaurante,
    ...routesMantenimiento,
    ...routesReports,
]

const routesRolRoomService = [...routesReservacion, ...routesCocina, ...routesIncidencias, ...routesRoomService]

const routesRolCocina = [...routesCocina, ...routesInventario]

const routesRolRestaurante = [
    ...routesReservacion,
    ...routesIncidencias,
    ...routesCocina,
    ...routesRoomService,
    ...routesRestaurante,
]
const routesRolMantenimiento = [...routesReservacion, ...routesHabitacion,  ...routesIncidencias,  ...routesMantenimiento, ]

function Pages() {
    const { rolName } = useProfile()
    return (
        <Routes>
            {/* - Auth / Public routes */}
            <Route
                path="/"
                element={
                    <PublicRoute>
                        <Suspense fallback={<LoginLoad />}>
                            <Login />
                        </Suspense>
                    </PublicRoute>
                }
            />
            <Route path="/auth">
                <Route path="registry" element={<Registry />} />
                <Route path="registry/data" element={<RegistryData />} />
                <Route path="registry/verification" element={<Verification />} />
                <Route path="registry/verified" element={<Verified />} />
                <Route path="forgot-password" element={<Forgot />} />
                <Route path="change-password" element={<ChangePassword />} />
            </Route>
            {/* - Authenticated / Private routes */}
            <Route
                path="config/rooms"
                element={
                    <PrivateRoute>
                        <ConfigRooms />
                    </PrivateRoute>
                }
            />
            <Route
                path="config/tables"
                element={
                    <PrivateRoute>
                        <ConfigTables />
                    </PrivateRoute>
                }
            />
            <Route
                path="/u"
                element={
                    <PrivateRoute>
                        <Suspense fallback={<LayoutLoad />}>
                            <RoomsProvider>
                                <MotivosBloqueoProvider>
                                    <TiposMantenimientoProvider>
                                        <ColaboradorProvider>
                                            <HotelImasStatusProvider>
                                                <Layout />
                                            </HotelImasStatusProvider>
                                        </ColaboradorProvider>
                                    </TiposMantenimientoProvider>
                                </MotivosBloqueoProvider>
                            </RoomsProvider>
                        </Suspense>
                    </PrivateRoute>
                }
            >
                <Route
                    index
                    element={rolName === RoleNames.restaurante ? <Navigate to="/u/restaurante-home" replace /> : <Home />}
                />

                {rolName === RoleNames.valet && (
                    <>
                        <Route path="venta-habitacion/:habitacion_id" element={<VentaHabitacion />} />
                        {routesIncidencias.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                        <Route path="habitacion-detalle/liberar/:habitacion_id" element={<FreeRoom />} />
                        <Route path="detalle-habitacion/liberar-sucia/:habitacion_id" element={<FreeRoomSucia />} />
                        <Route
                            path="detalle-habitacion/liberar-supervision/:habitacion_id"
                            element={<FreeRoomSupervision />}
                        />
                        {routesReservacion.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}
                {rolName === RoleNames.cocina && (
                    <>
                        <Route
                            index
                            element={
                                <OrdersProvider>
                                    <CurrentdateProvider>
                                        <Cocina />
                                    </CurrentdateProvider>
                                </OrdersProvider>
                            }
                        />
                        {routesRolCocina.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}

                {rolName === RoleNames.roomService && (
                    <>
                        {routesRolRoomService.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}
                {rolName === RoleNames.restaurante && (
                    <>
                        {routesRolRestaurante.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}
                {rolName !== RoleNames.valet &&
                    rolName !== RoleNames.cocina &&
                    rolName !== RoleNames.roomService &&
                    rolName !== RoleNames.restaurante && 
                    rolName !== RoleNames.mantenimiento && (
                    <>
                        {routesRolAdmin.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}
                {rolName === RoleNames.mantenimiento && (
                    <>
                        {routesRolMantenimiento.map(({ path, element }) => (
                            <Route key={path} path={path} element={element} />
                        ))}
                    </>
                )}

                <Route path="*" element={<Error code={404} />} />
                <Route path="empty-state" element={<EmptyState />} />
            </Route>

            <Route
                path="/pdf"
                element={
                    <PrivateRoute>
                        <Suspense fallback={<LayoutLoad />}>
                            <LayoutDocs />
                        </Suspense>
                    </PrivateRoute>
                }
            >
                <Route path="example" element={<EjmPDF />} />
                <Route path="caratula-periodo/:month/:year" element={<CaratulaPeriodo />} />
                <Route path="dia-corte" element={<DiaOTurnoCortePDF />} />
                <Route path="turno-corte" element={<DiaOTurnoCortePDF />} />
                <Route path="resumen-corte" element={<DiaOTurnoCortePDF />} />
                <Route path="propinas/:date" element={<PropinasPDF />} />
                <Route path="reporte-propinas" element={<ReportePropinasPDF />} />
            </Route>
            <Route path="*" element={<Error code={404} />} />
            <Route path="400" element={<Error code={400} />} />
            <Route path="expiration" element={<Expiration />} />
            <Route
                path="/fullscreen"
                element={
                    <PrivateRoute>
                        <Suspense fallback={<LayoutLoad />}>
                            <Outlet />
                        </Suspense>
                    </PrivateRoute>
                }
            >
                <Route path="disponibilidad" element={<Disponibilidad />} />
            </Route>
            <Route
                path="/public"
                element={
                    <Suspense fallback={<LayoutLoad />}>
                        <Outlet />
                    </Suspense>
                }
            >
                <Route path="about" element={<AboutUs />} />
            </Route>
        </Routes>
    )
}

const AppNavigator = () => {
    const { onLine } = useListenerConnection()

    return onLine ? <Pages /> : <Error code={400} />
}

const App = () => (
    <Provider store={store}>
        <ApolloProvider client={client}>
            <BrowserRouter>
                <AppNavigator />
            </BrowserRouter>
        </ApolloProvider>
    </Provider>
)

export default App
