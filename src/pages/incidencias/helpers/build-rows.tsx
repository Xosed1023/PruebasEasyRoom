import React from "react"
import { IncidenciaRow } from "../Incidencia.types"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { CellEstado, CellUrgencia } from "../components/cell"
import { BuildCell } from "./build-cell"

const BuildRows = (rows: IncidenciaRow[]): FlexibleTableRow[] => {
    return rows?.map((row) => ({
        value: row?.value?.map(({ value }, index, arr) => ({
            value:
                index === 1 ? (
                    <CellEstado estado={value as string} />
                ) : index === arr.length - 1 ? (
                    <CellUrgencia urgencia={value as string} />
                ) : index === 4 ? (
                    <span className="incidencias__cell-overflow" style={{ maxWidth: 120 }}>
                        <BuildCell txt={value as string} />
                    </span>
                ) : (
                    <BuildCell txt={value as string} />
                ),
        })),
        goTo: row.goTo,
    }))
}

export default BuildRows
