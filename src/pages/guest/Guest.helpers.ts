import { OrigenRservas } from "src/gql/schema"

export const getParams = (params: any) => {
    return {
        fechaReserva: params?.fechaReserva || [new Date(), new Date()],
        tipoHabitacion: params?.tipoHabitacion?.nombre || "-",
        tipoHabitacionId: String(params?.tipoHabitacion.id) || "",
        codigoReserva: params?.codigoReserva || "",
        cantidadPersonasExtra: params?.cantidadPersonasExtra || 0,
        cantidadPersonas: params?.cantidadPersonas || 0,
        costoTarifa: Number(params?.costoTarifa) || 0,
        costoPersonaExtra: Number(params?.costoPersonaExtra) || 0,
        origenReserva: OrigenRservas[params?.origenReserva] || "",
        tipoTarifa: params?.tipoTarifa || "",
        horaCheckIn: params?.horaCheckIn,
        horaCheckOut: params?.horaCheckOut,
        experiencias: params?.experiencias || [],
        reservaIdSaved: String(params?.reservaIdSaved),
        folioSaved: Number(params?.folioSaved),
        experienciasSaved: params?.experienciasSaved || [],
        nombreHuespedSaved: params?.nombreHuespedSaved,
        telefonoHuespedSaved: params?.telefonoHuespedSaved,
        emailHuespedSaved: params?.emailHuespedSaved,
        totalSaved: Number(params?.totalSaved),
        pagosSaved: params?.pagosSaved,
        comentarioSaved : String(params?.comentarioSaved),
    }
}

export const getDays = (dateI, dateF) => {
    const datef = new Date(dateI)
    const datei = new Date(dateF)
    const time = datef.getTime() - datei.getTime()
    const days = Math.abs(time / (1000 * 60 * 60 * 24))

    return days
}
