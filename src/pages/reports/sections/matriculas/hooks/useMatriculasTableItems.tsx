import React from "react"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { TablaPlacasVehiculo } from "../Matriculas.type"
import Icon from "src/shared/icons"
import "./MatriculasTableItems.css"
import DeleteMatricula from "../sections/delete-matricula/DeleteMatricula"

const useMatriculasTableItems = ({
    rows,
    refetch,
    onEdit,
    canDelete,
}: {
    rows: TablaPlacasVehiculo[]
    onEdit: (v: TablaPlacasVehiculo) => void
    refetch: () => void
    canDelete: boolean
}) => {
    const tableItems: FlexibleTableRow[] = rows?.map((row, index) => ({
        value: [
            { value: row.turno, className: "reports-cell" },
            { value: row.matricula, className: "reports-cell" },
            { value: row.fecha_entrada, className: "reports-cell" },
            { value: row.color || "-", className: "reports-cell" },
            { value: row.marca || "-", className: "reports-cell" },
            { value: row.modelo || "-", className: "reports-cell" },
            { value: row.concepto || "-", className: "reports-cell" },
            {
                value: (
                    <div className="matriculas-table-items__actions">
                        <Icon
                            onClick={() => onEdit(row)}
                            name="editFill"
                            width={16}
                            height={16}
                            color="var(--primary)"
                            style={{ cursor: "pointer" }}
                        />
                        {canDelete && (
                            <DeleteMatricula refetch={refetch} historial_vehiculo_id={row.historial_vehiculo_id}>
                                <Icon name="trashFilled" width={16} height={16} color="var(--primary)" />
                            </DeleteMatricula>
                        )}
                    </div>
                )
            },
        ],

        key: index,
    }))
    return { tableItems }
}

export default useMatriculasTableItems
