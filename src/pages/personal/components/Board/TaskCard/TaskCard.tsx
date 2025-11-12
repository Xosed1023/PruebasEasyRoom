import React, { useEffect, useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Switch from "src/shared/components/forms/switch/Switch"
import Icon from "src/shared/icons"
import { Task } from "../types"

import "./TaskCard.css"
import { useDispatch } from "react-redux"
import {
    selectColaborador,
    selectPersonalDrawerSection,
    togglePersonalTurnoDrawer,
} from "src/store/personal/personal.slice"

interface Props {
    task: Task
    admin: boolean
    isLoadingtoggle: boolean
    onToggleSwitch: ({
        id,
        isActive,
        idAsistencia,
    }: {
        id: string
        isActive: boolean
        idAsistencia: string
        hasTareaActiva: boolean
    }) => void
}

function TaskCard({ task, admin, onToggleSwitch, isLoadingtoggle }: Props) {
    const [isActive, setIsActive] = useState(task.active)

    useEffect(() => {
        setIsActive(task.active)
    }, [task.active])

    const dispatch = useDispatch()

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
        disabled: false,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      "
            />
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`border-task-card-container ${task.active && "switchCard"}`}
            onClick={(e) => {
                dispatch(togglePersonalTurnoDrawer(true))
                dispatch(selectPersonalDrawerSection("home"))
                dispatch(selectColaborador(task.colaborador))
            }}
        >
            <div className="border-task-card-img__container">
                <img className="border-task-card-img" src={task.img} alt="avatar" />
            </div>
            <div className={`border-task-card-info`}>
                <p className="border-task-card-name">{task.name}</p>
                <div className="border-task-card-name__con">
                    <p className="border-task-card-job">
                        {task.active && <Icon name="HotelFilled" style={{ marginRight: "3px" }} />}
                        {task.habitacionUltimaTarea ? task.habitacionUltimaTarea : task.job}
                    </p>

                    {admin && (
                        <div className="border-task-card-job-icons">
                            {task.isInTurnoActual && (
                                <Switch
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isLoadingtoggle}
                                    onChange={(value) => {
                                        onToggleSwitch({
                                            id: task.id,
                                            isActive: task.active,
                                            idAsistencia: task.idAsistencia,
                                            hasTareaActiva: task.hasTareaActiva,
                                        })
                                        if (!task.hasTareaActiva) {
                                            setIsActive(!isActive)
                                        }
                                    }}
                                    value={isActive}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TaskCard
