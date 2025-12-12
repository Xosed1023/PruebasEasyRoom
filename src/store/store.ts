import { combineReducers, configureStore } from "@reduxjs/toolkit"
import incidentsSlice from "./incidents/incidentsSlice"
import navigationSlice from "./navigation/navigationSlice"
import profileSlice from "./profile/profileSlice"
import reservationsSlice from "./reservations/reservationsSlice"
import reservationSlice from "./roomDetails/reservadaSlice"
import roomsSlice from "./rooms/roomsSlice"
import snackbarSlice from "./snackbar/snackbarSlice"
import personalSlice from "./personal/personal.slice"
import ordersSlice from "./orders/ordersSlice"
import pendienteSupervisionSlice from "./roomDetails/pendienteSupervisionSlice"
import bloqueadaSlice from "./roomDetails/bloqueadaSlice"
import maintenanceSlice from "./roomDetails/maintenance.Slice"
import cleaningSlice from "./roomDetails/cleaningSlice"
import ventaHabitacionSlice from "./ventaHabitacion/ventaHabitacionSlice"
import turnSlice from "./turn/turnSlice"
import cortesSlice from "./cortes/cortesSlice"
import inventarioSlice from "./inventario/inventario.slice"
import gastosSlice from "./gastos/gastosSlice"
import pagoPropinasSlice from "./propinas/pagoPropinasSlice"
import hotelSlice from "./hotel/hotelSlice"
import cocinaSlice from "./cocina/cocinaSlice"
import ordersInPreparationSlice from "./ordersInPreparation/ordersInPreparationSlice"
import ordersToDeliverSlice from "./ordersToDeliver/ordersToDeliverSlice"
import restaurantSlice from "./restaurant/restaurantSlice"
import ocupadaSlice from "./roomDetails/ocupadaSlice"

export const store = configureStore({
    reducer: {
        rooms: roomsSlice,
        roomDetails: combineReducers({
            reservada: reservationSlice,
            pendienteSupervision: pendienteSupervisionSlice,
            bloqueada: bloqueadaSlice,
            maintenance: maintenanceSlice,
            cleaning: cleaningSlice,
            ocupada: ocupadaSlice
        }),
        propinas: combineReducers({
            pagoPropinas: pagoPropinasSlice,
        }),
        navigation: navigationSlice,
        reservations: reservationsSlice,
        profile: profileSlice,
        incidents: incidentsSlice,
        snackbar: snackbarSlice,
        personal: personalSlice,
        ventaHabitacion: ventaHabitacionSlice,
        orders: ordersSlice,
        turn: turnSlice,
        cortes: cortesSlice,
        inventario: inventarioSlice,
        gastos: gastosSlice,
        hotel: hotelSlice,
        cocina: cocinaSlice,
        ordersInPreparation: ordersInPreparationSlice,
        ordersToDeliver: ordersToDeliverSlice,
        restaurant: restaurantSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
