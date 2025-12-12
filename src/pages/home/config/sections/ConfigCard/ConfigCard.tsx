import React, { useEffect, useState } from "react"

import "./ConfigCard.css"

import { Size } from "../../types/Size"

export type onSelectFn = ({
    coord,
    roomGridItemId,
    roomListItemId,
}: {
    roomGridItemId: string
    roomListItemId: string
    coord: {
        x: number,
        y: number
    }
}) => void

const ConfigCard = ({
    size,
    isDraggable,
    selected,
    coord,
    onSelect,
    id,
    roomListItemId,
}: {
    size: Size
    isDraggable: boolean
    selected: boolean
    coord: {
        x: number,
        y: number
    }
    roomListItemId?: string
    onSelect: onSelectFn
    id: string
}) => {
    const [isDraggingOver, setisDraggingOver] = useState(selected)

    useEffect(() => {
        setisDraggingOver(false)
    }, [selected])

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault()
                setisDraggingOver(true)
            }}
            onDragLeave={(e) => {
                setisDraggingOver(false)
            }}
            onDrop={(e) => {
                if (e.dataTransfer.getData("roomListItemIdFromGrid")) {
                    onSelect({
                        roomGridItemId: id,
                        roomListItemId: e.dataTransfer.getData("roomListItemIdFromGrid"),
                        coord,
                    })
                    return
                }
                onSelect({
                    roomGridItemId: id,
                    roomListItemId: e.dataTransfer.getData("roomListItemId"),
                    coord,
                })
            }}
            draggable
            onDragStart={(e) => {
                if (!isDraggable || !selected) {
                    e.preventDefault()
                }
                e.dataTransfer.setData("roomListItemIdFromGrid", roomListItemId || "")
            }}
            className="config-rooms__card-item"
            style={{
                width:
                    size === "xs"
                        ? 106
                        : size === "sm"
                        ? 129
                        : size === "md"
                        ? 161
                        : size === "lg"
                        ? 263
                        : size === "xl"
                        ? 266
                        : size === "mxl"
                        ? 180
                        : 0,
                height:
                    size === "xs"
                        ? 70
                        : size === "sm"
                        ? 92
                        : size === "md"
                        ? 118
                        : size === "lg"
                        ? 103
                        : size === "xl"
                        ? 242
                        : size === "mxl"
                        ? 146
                        : 0,
                gridArea: `${coord.y}/ ${coord.x} / span 1 / span 1`,
                cursor: selected && isDraggable ? "pointer" : "",
                backgroundColor: !selected ? (isDraggingOver ? "red" : "purple") : "",
            }}
        >
            {selected ? <span>Seleccionado {roomListItemId}</span> : <span>No Seleccionado {roomListItemId}</span>}
        </div>
    )
}

export default ConfigCard
