import { GetAreasQuery, GetPuestosByHotelIdQuery } from "src/gql/schema"

const useTableHeaders = ({ areas, puestos }: { areas?: GetAreasQuery; puestos?: GetPuestosByHotelIdQuery }) => {
    return [
        {
            value: "#",
        },
        {
            value: "Fecha de pago",
        },
        {
            value: "Periodo pagado",
        },
        {
            value: "Personal",
        },
        {
            value: "Área",
            filterMenu: areas?.areas.map((a) => ({ value: a.nombre, valueToDisplay: a.nombre })),
        },
        {
            value: "Puesto",
            filterMenu: puestos?.puestos.map((p) => ({
                value: p.nombre,
                valueToDisplay: p.nombre,
            })),
        },
        {
            value: "Total pagado",
        },
    ]
}

export default useTableHeaders
