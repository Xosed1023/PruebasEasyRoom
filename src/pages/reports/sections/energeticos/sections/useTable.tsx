import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { EnergeticosItems } from "../Energeticos.type"

const useTable = ({ data }: { data: EnergeticosItems }) => {
    const tableItems: FlexibleTableRow[] = data?.respuesta.tabla_mantto?.map((hab) => ({
        value: [
            { value: hab.no_corte, className: "reports-cell" },
            { value: hab.fecha_registro, className: "reports-cell" },
            { value: hab.turno, className: "reports-cell" },
            { value: hab.agua, className: "reports-cell" },
            { value: hab.gas, className: "reports-cell" },
            { value: hab.luz, className: "reports-cell" },
            { value: hab.reponsable, className: "reports-cell" },
            { value: "Acciones" },
        ],
    }))

    return {
        tableItems,
    }
}

export default useTable
