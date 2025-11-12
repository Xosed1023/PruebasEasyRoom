import { useQuery } from "@apollo/client"
import { GET_TURNO } from "../../Cortes-Graphql/queries/getTurno"
import { GET_USUARIO } from "../../Cortes-Graphql/queries/getUsuario"

export const getTurnoUsuario = (turno_id) => {
    let turnoUsuario = ""
    try {
        const { data: turno } = useQuery(GET_TURNO, {
            variables: {
                turno_id,
            },
        })
        turnoUsuario = turno.nombre
    } catch (error) {
        console.log(error)
    }

    return turnoUsuario
}

export const getNameUsuario = (id) => {
    const { data: usuario } = useQuery(GET_USUARIO, {
        variables: {
            id,
        },
    })
    return usuario?.usuario?.nombre + usuario?.usuario?.apellido_paterno + usuario?.usuario?.apellido_materno
}
