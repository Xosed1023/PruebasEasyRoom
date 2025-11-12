import React, { useEffect, useState } from "react"
import { Size } from "./types/Size"
import { ListItem } from "./constants/initRoomsList"

import "./ConfigRooms.css"
import RoomsGrid from "./sections/RoomsGrid/RoomsGrid"
import RoomsList from "./sections/RoomsList/RoomsList"
import { ListGridItem } from "./types/ListGridItem"
import { useProfile } from "src/shared/hooks/useProfile"
import { useActualizarHotelMinimalMutation, useHabitacionesConfigQuery } from "src/gql/schema"

const ConfigRooms = () => {
    const [columns, setColumns] = useState(1)
    const [rows, setRows] = useState(1)

    const [isPreviewMode, setisPreviewMode] = useState(false)

    const [roomsList, setroomsList] = useState<ListItem[]>([])
    const [roomsGrid, setRoomsGrid] = useState<ListGridItem[]>([])
    const [sizeSelected, setSizeSelected] = useState<Size>("xs")

    // Resetear estado al cambiar el tamaño de las cards
    useEffect(() => {
        // setroomsList(initRoomsList)
        // setColumns(1)
        // setRows(1)
    }, [sizeSelected])

    const { hotel_id } = useProfile()

    const { data } = useHabitacionesConfigQuery({ variables: { hotel_id } })

    useEffect(() => {
        if (!data) {
            return
        }
        setroomsList(
            data.habitaciones.map((h) => ({
                id: h.habitacion_id || "",
                num_hab: Number(h.numero_habitacion),
                selected: false,
                tipo: h.tipo_habitacion?.nombre || "",
            }))
        )
    }, [data])

    const [updateCardSize] = useActualizarHotelMinimalMutation()

    return (
        <div className="config-rooms__container">
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
                <label htmlFor="fixedSize">Tamaño fijo</label>
                <input
                    type="checkbox"
                    name="fixedSize"
                    onChange={(e) => {
                        updateCardSize({
                            variables: {
                                datos_hotel: {
                                    hotel_id,
                                    configurations: {
                                        cardHabitacion: {
                                            tamano_fijo: e.target.checked,
                                        },
                                    },
                                },
                            },
                        })
                    }}
                />
            </div>
            <div>
                <select
                    value={sizeSelected}
                    onChange={(e) => {
                        updateCardSize({
                            variables: {
                                datos_hotel: {
                                    hotel_id,
                                    configurations: {
                                        cardHabitacion: {
                                            tamano: e.target.value,
                                        },
                                    },
                                },
                            },
                        })
                        setSizeSelected(e.target.value as Size)
                    }}
                >
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
            <div className="config-rooms__rooms-wrapper">
                <RoomsList roomsList={roomsList} />
                <RoomsGrid
                    columns={columns}
                    rows={rows}
                    isPreviewMode={isPreviewMode}
                    roomsGrid={roomsGrid}
                    roomsList={roomsList}
                    setRoomsGrid={setRoomsGrid}
                    setRoomsList={setroomsList}
                    setSizeSelected={setSizeSelected}
                    sizeSelected={sizeSelected}
                />
            </div>
        </div>
    )
}

export default ConfigRooms
