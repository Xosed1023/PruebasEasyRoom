import  { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { v4 as uuid } from "uuid"
import { ListGridItem } from "../../types/ListGridItem"
import { ListItem } from "../../constants/initTablesList"
import ConfigCard from "../ConfigCard/ConfigCard"
import { Size } from "../../types/Size"

import "./TablesGrid.css"
import { useSetCardsSize } from "../../hooks/useSetCardsSize"
import { TamanoMesa, useUpdatePosicionMesaMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"

const TablesGrid = ({
    isPreviewMode,
    columns,
    rows,
    setTablesList,
    setTablesGrid,
    setSizeSelected,
    sizeSelected,
    tablesGrid,
    tablesList
}: {
    isPreviewMode: boolean
    columns: number
    rows: number
    tablesList: ListItem[]
    setTablesList: Dispatch<SetStateAction<ListItem[]>>
    setTablesGrid: Dispatch<SetStateAction<ListGridItem[]>>
    tablesGrid: ListGridItem[]
    setSizeSelected: Dispatch<SetStateAction<Size>>
    sizeSelected: Size
}) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const {showSnackbar} = useSnackbar()
    const [updatePositionMesa] = useUpdatePosicionMesaMutation()

    const updateRoom = ({mesa_id, x, y}:{mesa_id: string, x: number, y: number}) => {
        updatePositionMesa({
            variables: {
                updatePosicionMesaInput: {
                    mesa_id,
                    posicion: {
                        tamano: TamanoMesa.Xl,
                        x,
                        y
                    }
                }
            }
        }).then(() => {
            showSnackbar({
                status: "success",
                title: "Mesa editada",
                text: "exitosamente"
            })
        }).catch(() => {
            showSnackbar({
                status: "error",
                title: "Error al editar mesa"
            })
        })
    }

    useSetCardsSize({
        containerRef,
        setSize: setSizeSelected,
        size: sizeSelected,
        itemsCount: tablesGrid.length,
    })
    useEffect(() => {
        // Crear grid
        const tablesGridItems: ListGridItem[] = []
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                tablesGridItems.push({
                    coord: {
                        x: j + 1,
                        y: i + 1
                    },
                    id: uuid(),
                    selected: false,
                })
            }
        }

        // Resetear habitaciones seleccionadas al cambiar filas o columnas
        setTablesList((list) =>
            list.map(({ id, num_hab }) => ({
                id,
                num_hab,
                selected: false,
            }))
        )
        setTablesGrid(tablesGridItems)
    }, [columns, rows])

    const onSelect = ({
        coord,
        roomGridItemId,
        roomListItemId,
    }: {
        roomGridItemId: string;
        roomListItemId: string;
        coord: {
            x: number,
            y: number
        };
    }) => {
        updateRoom({
            mesa_id: roomListItemId,
            x: coord?.x,
            y: coord?.y
        })
        // Verificar si ambos roomGridItemId y roomListItemId ya están seleccionados
        const isRoomGridItemSelected = tablesGrid.some(
            (table) => table.id === roomGridItemId && table.selected
        );
        const isRoomListItemSelected = tablesGrid.some(
            (table) => table.listItemId === roomListItemId && table.selected
        );
    
        // Si ambos ya están seleccionados, no hacer cambios
        if (isRoomGridItemSelected && isRoomListItemSelected) {
            return;
        }
    
        // Actualizar tablesGrid
        const updatedGridItems = tablesGrid.map((table) => {
            // Si el table ya está seleccionado y es el mismo que roomGridItemId, lo deseleccionamos
            if (table.selected && table.id === roomGridItemId) {
                return {
                    ...table,
                    listItemId: undefined,
                    coord,
                    selected: false,
                };
            }
    
            // Si el table no está seleccionado y es el mismo que roomGridItemId, lo seleccionamos
            if (!table.selected && table.id === roomGridItemId) {
                return {
                    ...table,
                    listItemId: roomListItemId,
                    coord,
                    selected: true,
                };
            }
    
            // Si el table está seleccionado y tiene el mismo roomListItemId, lo deseleccionamos
            if (table.selected && table.listItemId === roomListItemId) {
                return {
                    ...table,
                    listItemId: undefined,
                    selected: false,
                };
            }
    
            // Si no cumple ninguna de las condiciones anteriores, lo dejamos igual
            return table;
        });
    
        // Recolectar todos los listItemId definidos en tablesGrid
        const selectedListItemIds = updatedGridItems
            .map((table) => table.listItemId)
            .filter((listItemId) => listItemId !== undefined);
    
        // Actualizar tablesList
        const updatedListItems = tablesList.map((table) => {
            // Si el id del table está en la lista de listItemId seleccionados, lo marcamos como seleccionado
            if (selectedListItemIds.includes(table.id)) {
                return {
                    ...table,
                    selected: true,
                    coord: updatedGridItems.find((gridItem) => gridItem.listItemId === table.id)?.coord,
                };
            }
    
            // Si no está seleccionado, lo desmarcamos
            return {
                ...table,
                selected: false,
                coord: undefined,
            };
        });
    
        // Actualizar los estados
        setTablesGrid(updatedGridItems);
        setTablesList(updatedListItems);
    };

    return isPreviewMode ? (
        <div
            className="config-tables__tables-grid"
            ref={containerRef}
            style={{
                gridTemplate: `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`,
            }}
        >
            {tablesList
                .filter((table) => table.selected)
                .map((table) => (
                    <ConfigCard
                        isDraggable={!isPreviewMode}
                        key={table.id}
                        id={table.id}
                        size={sizeSelected}
                        selected={true}
                        coord={table.coord!}
                        onSelect={onSelect}
                    />
                ))}
        </div>
    ) : (
        <div
            ref={containerRef}
            className="config-tables__tables-grid"
            style={{
                gridTemplate: `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`,
            }}
        >
            {tablesGrid.map((table) => (
                <ConfigCard
                    isDraggable={!isPreviewMode}
                    key={table.id}
                    id={table.id}
                    size={sizeSelected}
                    roomListItemId={table.listItemId}
                    selected={table.selected}
                    coord={table.coord}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}

export default TablesGrid
