import  { Dispatch, SetStateAction, useEffect, useRef } from "react"
import { v4 as uuid } from "uuid"
import { ListGridItem } from "../../types/ListGridItem"
import { ListItem } from "../../constants/initRoomsList"
import ConfigCard from "../ConfigCard/ConfigCard"
import { Size } from "../../types/Size"

import "./RoomsGrid.css"
import { useSetCardsSize } from "../../hooks/useSetCardsSize"
import { Tamano, useUpdatePosicionHabitacionMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"

const RoomsGrid = ({
    isPreviewMode,
    columns,
    rows,
    setRoomsList,
    setRoomsGrid,
    setSizeSelected,
    sizeSelected,
    roomsGrid,
    roomsList
}: {
    isPreviewMode: boolean
    columns: number
    rows: number
    roomsList: ListItem[]
    setRoomsList: Dispatch<SetStateAction<ListItem[]>>
    setRoomsGrid: Dispatch<SetStateAction<ListGridItem[]>>
    roomsGrid: ListGridItem[]
    setSizeSelected: Dispatch<SetStateAction<Size>>
    sizeSelected: Size
}) => {
    const containerRef = useRef<HTMLDivElement>(null)

    const {showSnackbar} = useSnackbar()
    const [updatePositionHabitacion] = useUpdatePosicionHabitacionMutation()

    const updateRoom = ({habitacion_id, x, y}:{habitacion_id: string, x: number, y: number}) => {
        updatePositionHabitacion({
            variables: {
                updatePosicionHabitacionInput: {
                    habitacion_id,
                    posicion: {
                        tamano: Tamano.Xs,
                        x,
                        y
                    }
                }
            }
        }).then(() => {
            showSnackbar({
                status: "success",
                title: "Habitacion editada",
                text: "exitosamente"
            })
        })
    }

    useSetCardsSize({
        containerRef,
        setSize: setSizeSelected,
        size: sizeSelected,
        itemsCount: roomsGrid.length,
    })
    useEffect(() => {
        // Crear grid
        const roomsGridItems: ListGridItem[] = []
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                roomsGridItems.push({
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
        setRoomsList((list) =>
            list.map(({ id, num_hab, tipo }) => ({
                id,
                num_hab,
                selected: false,
                tipo
            }))
        )
        setRoomsGrid(roomsGridItems)
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
            habitacion_id: roomListItemId,
            x: coord.x,
            y: coord.y
        })
        // Verificar si ambos roomGridItemId y roomListItemId ya están seleccionados
        const isRoomGridItemSelected = roomsGrid.some(
            (room) => room.id === roomGridItemId && room.selected
        );
        const isRoomListItemSelected = roomsGrid.some(
            (room) => room.listItemId === roomListItemId && room.selected
        );
    
        // Si ambos ya están seleccionados, no hacer cambios
        if (isRoomGridItemSelected && isRoomListItemSelected) {
            return;
        }
    
        // Actualizar roomsGrid
        const updatedGridItems = roomsGrid.map((room) => {
            // Si el room ya está seleccionado y es el mismo que roomGridItemId, lo deseleccionamos
            if (room.selected && room.id === roomGridItemId) {
                return {
                    ...room,
                    listItemId: undefined,
                    coord,
                    selected: false,
                };
            }
    
            // Si el room no está seleccionado y es el mismo que roomGridItemId, lo seleccionamos
            if (!room.selected && room.id === roomGridItemId) {
                return {
                    ...room,
                    listItemId: roomListItemId,
                    coord,
                    selected: true,
                };
            }
    
            // Si el room está seleccionado y tiene el mismo roomListItemId, lo deseleccionamos
            if (room.selected && room.listItemId === roomListItemId) {
                return {
                    ...room,
                    listItemId: undefined,
                    selected: false,
                };
            }
    
            // Si no cumple ninguna de las condiciones anteriores, lo dejamos igual
            return room;
        });
    
        // Recolectar todos los listItemId definidos en roomsGrid
        const selectedListItemIds = updatedGridItems
            .map((room) => room.listItemId)
            .filter((listItemId) => listItemId !== undefined);
    
        // Actualizar roomsList
        const updatedListItems = roomsList.map((room) => {
            // Si el id del room está en la lista de listItemId seleccionados, lo marcamos como seleccionado
            if (selectedListItemIds.includes(room.id)) {
                return {
                    ...room,
                    selected: true,
                    coord: updatedGridItems.find((gridItem) => gridItem.listItemId === room.id)?.coord,
                };
            }
    
            // Si no está seleccionado, lo desmarcamos
            return {
                ...room,
                selected: false,
                coord: undefined,
            };
        });
    
        // Actualizar los estados
        setRoomsGrid(updatedGridItems);
        setRoomsList(updatedListItems);
    };

    return isPreviewMode ? (
        <div
            className="config-rooms__rooms-grid"
            ref={containerRef}
            style={{
                gridTemplate: `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`,
            }}
        >
            {roomsList
                .filter((room) => room.selected)
                .map((room) => (
                    <ConfigCard
                        isDraggable={!isPreviewMode}
                        key={room.id}
                        id={room.id}
                        size={sizeSelected}
                        selected={true}
                        coord={room.coord!}
                        onSelect={onSelect}
                    />
                ))}
        </div>
    ) : (
        <div
            ref={containerRef}
            className="config-rooms__rooms-grid"
            style={{
                gridTemplate: `repeat(${rows}, 1fr) / repeat(${columns}, 1fr)`,
            }}
        >
            {roomsGrid.map((room) => (
                <ConfigCard
                    isDraggable={!isPreviewMode}
                    key={room.id}
                    id={room.id}
                    size={sizeSelected}
                    roomListItemId={room.listItemId}
                    selected={room.selected}
                    coord={room.coord}
                    onSelect={onSelect}
                />
            ))}
        </div>
    )
}

export default RoomsGrid
