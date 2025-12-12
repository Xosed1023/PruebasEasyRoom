import { createSlice } from "@reduxjs/toolkit"

export interface ColaboradorToPayPropina {
    selected: boolean
    id: string
    name: string
    rolName: string
    photoUrl: string
    montoAPagar: number
    porVentas: number
    fondo:  number
    comision: number
    pago: number
    comisionPorVentas: number
    puesto_id: string
    asignacion_propina_id: string
    asignacion_propina: any
}

export interface pagoPropinasState {
    // su segundo estado inicial son los colaboradores que vienen de la API pero con su valor de seleccionado en false
    colaboradoresToPayPropinas: ColaboradorToPayPropina[]
    isModalConfirmarPagoPropinaOpen: boolean
    totalPagoPropinas: number
    montoAcumulado: number
    lastColaboradorMontoAPagarEdited?: ColaboradorToPayPropina
    // solo valores serializables (No objetos Date)
    fechasPagoPropinas: string[],
    limiteDisponible: number
}

const initialState: pagoPropinasState = {
    colaboradoresToPayPropinas: [],
    isModalConfirmarPagoPropinaOpen: false,
    totalPagoPropinas: 0,
    montoAcumulado: 0,
    fechasPagoPropinas: [],
    limiteDisponible: 0
}

export const pendienteSupervisionSlice = createSlice({
    name: "pagoPropinas",
    initialState,
    reducers: {
        setColaboradoresToPayPropina: (state, action: { payload: ColaboradorToPayPropina[]; type: string }) => {
            state.colaboradoresToPayPropinas = action.payload
        },
        setTotalPagoPropinas: (state, action: { payload: number; type: string }) => {
            state.totalPagoPropinas = action.payload
        },
        setMontoAcumulado: (state, action: { payload: number; type: string }) => {
            state.montoAcumulado = action.payload
        },
        setLimiteDisponible: (state, action: { payload: number; type: string }) => {
            state.limiteDisponible = action.payload
        },
        toggleIsModalConfirmarPagoPropinaOpen: (state, action: { payload: boolean; type: string }) => {
            state.isModalConfirmarPagoPropinaOpen = action.payload
        },
        setFechasPagoPropinas: (state, action: { payload: string[]; type: string }) => {
            state.fechasPagoPropinas = action.payload
        },
        setLastColaboradorMontoAPagarEdited: (state, action: { payload: ColaboradorToPayPropina; type: string }) => {
            state.lastColaboradorMontoAPagarEdited = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setColaboradoresToPayPropina,
    toggleIsModalConfirmarPagoPropinaOpen,
    setTotalPagoPropinas,
    setFechasPagoPropinas,
    setLastColaboradorMontoAPagarEdited,
    setMontoAcumulado,
    setLimiteDisponible
} = pendienteSupervisionSlice.actions

export default pendienteSupervisionSlice.reducer
