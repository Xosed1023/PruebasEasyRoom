import { useEffect, useMemo, useState } from "react"
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import "./KanbanBoard.css"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"
import { Column, Task } from "../types"
import ColumnContainer from "../ColumnContainer/ColumnContainer"
import TaskCard from "../TaskCard/TaskCard"
import { ColaboradoresPorHotelQuery, useAbrirTurnoColaboradorMutation, useCerrarTurnoColaboradorMutation } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { ApolloQueryResult } from "@apollo/client"

function KanbanBoard({
    admin,
    loading,
    startCols,
    startTasks,
    onDrag,
    reload,
    onConfirmSearch,
    onSwapTurnoOpen,
    puestos
}: {
    admin: boolean
    loading: boolean
    startCols: Column[]
    startTasks: Task[]
    onDrag: ({ task, column }: { task?: Task; column?: Column }) => void
    onConfirmSearch: ({ task, column }: { task?: Task; column?: Column }) => void
    reload: () => Promise<ApolloQueryResult<ColaboradoresPorHotelQuery>>
    puestos?: { __typename?: "Puesto" | undefined; puesto_id: string; nombre: string; }[]
    onSwapTurnoOpen?: () => void
}) {
    const [columns, setColumns] = useState<Column[]>(startCols)
    const columnsId = useMemo(() => columns.map((col) => col.id), [columns])
    const [isLoadingToggle, setisLoadingToggle] = useState<boolean>(false)

    const [tasks, setTasks] = useState<Task[]>(startTasks)

    const { showSnackbar } = useSnackbar()

    const { hotel_id, usuario_id } = useProfile()

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const [abrirTurnoColaborador] = useAbrirTurnoColaboradorMutation()
    const [cerrarTurnoColaborador] = useCerrarTurnoColaboradorMutation()

    const toggleIsInTurnoColaborador = ({
        id,
        isActive,
        idAsistencia,
        hasTareaActiva,
    }: {
        id: string
        isActive: boolean
        idAsistencia: string
        hasTareaActiva: boolean
    }) => {
        setisLoadingToggle(true)
        const colaborador = startTasks.find((c) => c.id === id)
        if (!isActive) {
            return abrirTurnoColaborador({
                variables: {
                    turnOnTurnoColaboradorInput: {
                        colaborador_id: id,
                        hotel_id,
                        usuario_id,
                    },
                },
            })
                .catch(() => {
                    showSnackbar({
                        title: "Error al abrir turno",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .then(() => {
                    showSnackbar({
                        status: "success",
                        title: "Turno activado",
                        text: `El turno de **${colaborador?.name}** ha sido **activado**`,
                    })
                })
                .finally(() => {
                    reload().then(() => setisLoadingToggle(false))
                })
        }
        cerrarTurnoColaborador({
            variables: {
                turnOffColaboradoresInput: {
                    asistencia_id: [idAsistencia],
                    colaborador_id: [id],
                    usuario_id,
                    hotel_id,
                },
            },
        })
            .catch(() => {
                showSnackbar({
                    title: "Error al cerrar turno",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Turno desactivado",
                    text: `El turno de **${colaborador?.name}** ha sido **desactivado**`,
                })
            })
            .finally(() => {
                reload().then(() => setisLoadingToggle(false))
            })
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    )

    useEffect(() => {
        setColumns(startCols)
    }, [startCols])

    useEffect(() => {
        setTasks(startTasks)
    }, [startTasks])

    const [eventEmitter, setEventEmitter] = useState<{ task?: Task; column?: Column }>()

    useEffect(() => {
        if (eventEmitter?.column) {
            onDrag(eventEmitter)
        }
    }, [eventEmitter])

    return (
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <div>
                <div className="board-colums-container">
                    <SortableContext items={columnsId}>
                        {columns.map((col, index) => (
                            <ColumnContainer
                                isLoadingToggle={isLoadingToggle}
                                withHelperText={index === 0}
                                admin={admin}
                                loading={loading}
                                key={col.id}
                                column={col}
                                onSwapTurnoOpen={() => onSwapTurnoOpen?.()}
                                allCols={startCols}
                                puestos={puestos}
                                // traer los colaboradores Exceptuando a los que ya están en esta coluna
                                allTasks={tasks.filter((task)  => task.columnId !== col.id)}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                onToggleSwitch={toggleIsInTurnoColaborador}
                                onConfirmSearch={({ column, task }) => onConfirmSearch?.({ column, task })}
                            />
                        ))}
                    </SortableContext>
                </div>
            </div>

            {createPortal(
                <DragOverlay>
                    {activeColumn && (
                        <ColumnContainer
                            admin={admin}
                            isLoadingToggle={isLoadingToggle}
                            puestos={puestos}
                            loading={loading}
                            allCols={startCols}
                            onSwapTurnoOpen={() => onSwapTurnoOpen?.()}
                            allTasks={tasks}
                            column={activeColumn}
                            tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                            onToggleSwitch={toggleIsInTurnoColaborador}
                            onConfirmSearch={({ column, task }) => onConfirmSearch?.({ column, task })}
                        />
                    )}
                    {activeTask && (
                        <TaskCard admin={admin} task={activeTask} onToggleSwitch={toggleIsInTurnoColaborador} isLoadingtoggle={isLoadingToggle} />
                    )}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    )

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event
        if (!over) return

        
        const fromColumn = columns.find(col => col.id === active?.data?.current?.task?.columnId)
        
        const toColumn = over?.data?.current?.type === "Column" ? over?.data?.current?.column : columns.find(col => col.id === over?.data?.current?.task?.columnId)
        
        if (fromColumn?.id === toColumn?.id) return
        
        
        setEventEmitter({task: active.data.current?.task, column: toColumn})
        
        const isActiveAColumn = active.data.current?.type === "Column"
        if (!isActiveAColumn) return

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === fromColumn?.id)

            const overColumnIndex = columns.findIndex((col) => col.id === toColumn?.id)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        // const isOverATask = over.data.current?.type === "Task"


        // const isOverAColumn = over.data.current?.type === "Column"

        // Im dropping a Task over another Task
        // if (isActiveATask && !isOverAColumn) {
        //     setTasks((tasks) => {
        //         const activeIndex = tasks.findIndex((t) => t.id === activeId)
        //         const overIndex = tasks.findIndex((t) => t.id === overId)

        //         if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        //             // Fix introduced after video recording
        //             tasks[activeIndex].columnId = tasks[overIndex].columnId
        //             // setEventEmitter({ task: tasks[activeIndex], column: undefined })
        //             return arrayMove(tasks, activeIndex, overIndex - 1)
        //         }

        //         return arrayMove(tasks, activeIndex, overIndex)
        //     })
        // }


        // Im dropping a Task over a column
        // if (isActiveATask && isOverAColumn) {
        //     setTasks((tasks) => {
        //         const activeIndex = tasks.findIndex((t) => t.id === activeId)

        //         // setEventEmitter({ task: tasks[activeIndex], column: undefined })
        //         // tasks[activeIndex].columnId = overId as string
        //         return arrayMove(tasks, activeIndex, activeIndex)
        //     })
        // }
    }
}

export default KanbanBoard
