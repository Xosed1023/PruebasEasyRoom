import { TiposAlojamientos, TiposEntradas } from "src/gql/schema"
import { DefaultValuesType } from "../VentaHabitacion"
import { entryTypes, scheduleTypes } from "../VentaHabitacion.constants"

export const ventaHabitacionDefaultValues: DefaultValuesType = {
    type: scheduleTypes[0].value as TiposAlojamientos,
    matricula: "",
    color: "",
    marca: "",
    montoPropina: 0,
    porcentajePropina: "",
    colaboradorRecibioPropina: {id: "", title: ""},
    modelo: "",
    date: [],
    earlyCheckIn: false,
    // tarifa_id seleccionada
    amount: "",
    extraHours: 0,
    extraHospedajes: 0,
    name: "",
    entryType: entryTypes[0].value as TiposEntradas,
    // Método de pago en el dropdown principal de pagos
    method: "",
    users: 0,
    extraUsers: 0,
    extra: [],
    costs: {
        // Costo de renta unitario
        room: 0,
        // Costo de persona extra unitario
        users: 0,
        // Costo de hora extra unitario
        hours: 0,
        // Total de impuestos unitario
        tax: 0,
        // (si es hotel (room * noches) si es motel (room)) + (hours * extraHours) + (users * extraUsers)
        total: 0,
        costoEarlyCheckIn: 0,
        // total - pagos
        general: 0,
        // total - pagos
        hospedajes: 0,
    },
}
