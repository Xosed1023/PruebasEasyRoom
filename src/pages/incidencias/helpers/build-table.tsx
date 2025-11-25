import { GetIncidenciasQuery } from "src/gql/schema"
import { IncidenciaRow } from "../Incidencia.types"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { createDateUtils } from "src/shared/hooks/useDate"
import { getDateStringDMYH } from "src/utils/date"

function buildTable(data: GetIncidenciasQuery["incidencias"]) {
    const { UTCStringToLocalDate } = createDateUtils()
    const array: IncidenciaRow[] = []
    data?.map((incidencia) => {
        array.push({
            goTo: incidencia?.incidencia_id,
            value: [
                { value: incidencia?.folio + "" },
                { value: capitalizeString(incidencia?.estado || "") || "" },
                { value: getDateStringDMYH(UTCStringToLocalDate(incidencia?.fecha_registro), { hourFormat: true }) },
                {
                    value: `${incidencia?.area ? capitalizeString(incidencia?.area) : "N/A"}`,
                },
                {
                    value: capitalizeString(incidencia?.tipo_incidencia || "N/A"),
                },
                {
                    value: incidencia?.habitacion?.numero_habitacion || "N/A",
                },
                { value: incidencia?.matricula || "-" },
                { value: incidencia?.detalle || "-" },
                { value: capitalizeString(incidencia?.severidad) },
            ],
        })
    })
    return array
}

export default buildTable
