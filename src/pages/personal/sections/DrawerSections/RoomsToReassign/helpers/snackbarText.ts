import { Colaborador, Habitacion } from "src/gql/schema"

interface SnackbarTextProps {
    room?: Habitacion
    colaborador?: Colaborador
    status: "mantenimiento" | "limpieza"
}

export const getSnackbarText = ({ room, colaborador, status }: SnackbarTextProps) => {
    if (status === "mantenimiento") {
        return `**${colaborador?.nombre} ${colaborador?.apellido_paterno} ${colaborador?.apellido_materno}** comenzará con el **mantenimiento** en la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}.**`
    }
    if (status === "limpieza") {
        return `**${colaborador?.nombre} ${colaborador?.apellido_paterno} ${colaborador?.apellido_materno}** comenzará con la **limpieza** en la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}.**`
    }
}
