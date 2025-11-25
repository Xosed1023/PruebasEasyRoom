import React from "react"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { TablaPlacasVehiculo } from "../Matriculas.type"
import Icon from "src/shared/icons"
import './MatriculasTableItems.css'

const useMatriculasTableItems = ({ rows }: { rows: TablaPlacasVehiculo[] }) => {
    const tableItems: FlexibleTableRow[] = rows?.map((row) => ({
        value: [
            {value: row.turno, className: "reports-cell"},
            {value: row.matricula, className: "reports-cell"},
            {value: row.fecha_entrada, className: "reports-cell"},
            {value: row.color || "-", className: "reports-cell"},
            {value: row.marca || "-", className: "reports-cell"},
            {value: row.modelo || "-", className: "reports-cell"},
            {value: row.concepto || "-", className: "reports-cell"},
            {value: <div className="matriculas-table-items__actions">
                <Icon name="editFill" width={16} height={16} color="var(--primary)" />
                <Icon name="trashFilled" width={16} height={16} color="var(--primary)" />
            </div>},
        ],
    }))
    return { tableItems }
}

export default useMatriculasTableItems
