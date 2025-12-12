import React, { useEffect, useState } from "react"
import { Size } from "./types/Size"
import { ListItem } from "./constants/initTablesList"

import "./ConfigTables.css"
import { ListGridItem } from "./types/ListGridItem"
import { useProfile } from "src/shared/hooks/useProfile"
import { useGetMesasConfigQuery } from "src/gql/schema"
import TablesGrid from "./sections/RoomsGrid/TablesGrid"
import TablesList from "./sections/RoomsList/TablesList"

const ConfigTables = () => {
    const [columns, setColumns] = useState(1)
    const [rows, setRows] = useState(1)

    const [isPreviewMode, setisPreviewMode] = useState(false)

    const [tablesList, settablesList] = useState<ListItem[]>([])
    const [tablesGrid, setTablesGrid] = useState<ListGridItem[]>([])
    const [sizeSelected, setSizeSelected] = useState<Size>("xs")

    // Resetear estado al cambiar el tamaño de las cards
    useEffect(() => {
        // settablesList(initTablesList)
        // setColumns(1)
        // setRows(1)
    }, [sizeSelected])

    
    const {hotel_id} = useProfile()

    const {data} = useGetMesasConfigQuery({variables: {hotel_id}})

    useEffect(() => {
        if(!data) {
            return
        }
        settablesList(data.mesas.map(h => ({
            id: h.mesa_id || "",
            num_hab: h.numero_mesa,
            selected: false,
        })))
    }, [data])
    


    return (
        <div className="config-tables__container">
            <div>
                <button onClick={() => setisPreviewMode((m) => !m)}>Toggle preview mode</button>
            </div>
            <div>
                <button onClick={() => setRows((c) => c + 1)}>add row</button>
                <button onClick={() => setRows((c) => (c > 1 ? c - 1 : c))}>remove row</button>
            </div>
            <div>
                <button onClick={() => setColumns((c) => c + 1)}>add column</button>
                <button onClick={() => setColumns((c) => (c > 1 ? c - 1 : c))}>remove column</button>
            </div>
            <div>
                <select value={sizeSelected} onChange={(e) => setSizeSelected(e.target.value as Size)}>
                    <option value="xs">XS</option>
                    <option value="sm">SM</option>
                    <option value="md">MD</option>
                    <option value="lg">LG</option>
                    <option value="mxl">MXL</option>
                    <option value="xl">XL</option>
                </select>
            </div>

            <div>
                <p>Filas: {rows}</p>
                <p>Columnas: {columns}</p>
                <p>Modo: {isPreviewMode ? "Prueba" : "Editar"}</p>
            </div>
            <div className="config-tables__tables-wrapper">
                <TablesList tablesList={tablesList} />
                <TablesGrid
                    columns={columns}
                    rows={rows}
                    isPreviewMode={isPreviewMode}
                    tablesGrid={tablesGrid}
                    tablesList={tablesList}
                    setTablesGrid={setTablesGrid}
                    setTablesList={settablesList}
                    setSizeSelected={setSizeSelected}
                    sizeSelected={sizeSelected}
                />
            </div>
        </div>
    )
}

export default ConfigTables
