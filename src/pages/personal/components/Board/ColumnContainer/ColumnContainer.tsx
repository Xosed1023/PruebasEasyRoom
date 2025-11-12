import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMemo, useState } from "react"
import InputTextSuggestions, {
    InputTextSuggestion,
} from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import searchsm from "src/shared/icons/search-sm"
import EmptyColumn from "../EmptyColumn/EmptyColumn"
import CardSkeleton from "../../CardSkeleton/CardSkeleton"
import ColumnFooter, { getNextSchedule } from "../ColumnFooter/ColumnFooter"
import { Column, Task } from "../types"
import TaskCard from "../TaskCard/TaskCard"

import "./ColumnContainer.css"
import { EstadosTurno, useAbrirTurnoMutation, useCerrarTurnoMutation } from "src/gql/schema"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import Icon from "src/shared/icons"
import { Puestos } from "src/constants/puestos"
import { ModalConfirm } from "src/shared/components/layout"
import { formatTime12hrs } from "src/shared/helpers/formatTime12hrs"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"

interface Props {
    column: Column
    allCols: Column[]
    tasks: Task[]
    allTasks: Task[]
    loading: boolean
    admin: boolean
    isLoadingToggle: boolean
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
    onConfirmSearch: ({ task, column }: { task?: Task; column?: Column }) => void
    onSwapTurnoOpen?: () => void
    withHelperText?: boolean
    puestos?: { __typename?: "Puesto" | undefined; puesto_id: string; nombre: string }[]
}

function ColumnContainer({
    column,
    tasks,
    admin,
    loading,
    onToggleSwitch,
    allTasks,
    onConfirmSearch,
    allCols,
    onSwapTurnoOpen,
    withHelperText,
    puestos,
    isLoadingToggle,
}: Props) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id)
    }, [tasks])

    const { setNodeRef, transform, transition } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        border: column?.estado === EstadosTurno.Abierto ? "1px solid var(--primary)" : "",
    }

    const [searchValue, setsearchValue] = useState<InputTextSuggestion>({id: "", title: ""})
    const { showSnackbar } = useSnackbar()
    const [isModalConfirmCerrarTurnoOpen, setIsModalConfirmCerrarTurnoOpen] = useState(false)

    const [path, setPath] = useState(Puestos.RECAMARISTA)

    const [openNextTurno] = useAbrirTurnoMutation()
    const [closeTurno] = useCerrarTurnoMutation()
    const { hotel_id, usuario_id } = useProfile()

    const cambiarTurno = () => {
        const nextTurno = getNextSchedule(allCols, column)
        closeTurno({
            variables: {
                cerrar_turno_input: {
                    hotel_id,
                    usuario_id,
                    turno_id: column.id,
                },
            },
        })
            .then(() => {
                openNextTurno({
                    variables: {
                        open_turno_input: {
                            hotel_id,
                            usuario_id,
                            turno_id: nextTurno.id,
                        },
                    },
                })
                    .then(() => {
                        showSnackbar({
                            title: "Turno cerrado exitosamente",
                            status: "success",
                            text: `El turno **${column.title}** de **${formatTime12hrs(
                                column.hora_entrada || ""
                            )}** a **${formatTime12hrs(
                                column.hora_salida || ""
                            )}** se ha cerrado exitosamente para abrir el turno **${
                                nextTurno.title
                            }** de **${formatTime12hrs(nextTurno.hora_entrada || "")}** a **${formatTime12hrs(
                                nextTurno.hora_salida || ""
                            )}**`,
                        })
                    })
                    .finally(() => onSwapTurnoOpen?.())
            })
            .catch(() => {
                showSnackbar({
                    title: "Error el cambiar turno",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
    }

    return (
        <div ref={setNodeRef} style={style} className="board-column-container">
            <div className="flex gap-2 board-column-header">
                <div>
                    <InputTextSuggestions
                        suggestionsListWidth="239px"
                        suggestions={allTasks.map((t) => ({
                            title: t.name,
                            photoUrl: t.img,
                            subtitle: t.job,
                            id: t.id,
                        }))}
                        inputTextConfig={{
                            style: { width: "100%" },
                            placeholder: "Busca por nombre ",
                            type: "text",
                            icon: searchsm,
                            className: "",
                        }}
                        updateInputTextValueOnSelectItem={false}
                        onChange={(data) => {
                            const selectedTask = allTasks.find(
                                (t) => (t as unknown as InputTextSuggestion).id === (data as InputTextSuggestion).id
                            )

                            if (selectedTask) {
                                onConfirmSearch({ column, task: selectedTask })
                                setsearchValue({id: "", title: ""})
                            }
                        }}
                        value={searchValue}
                    />
                </div>
            </div>
            {!tasks?.length ? (
                <EmptyColumn
                    style={{
                        height:
                            column?.estado === EstadosTurno.Abierto ? "calc(100dvh - 515px)" : "calc(100dvh - 435px)",
                    }}
                />
            ) : (
                <>
                    <div style={{ width: "100%", overflowX: "scroll", padding: "3px 0" }}>
                        <TabMenu
                            tabList={puestos?.map((p) => ({
                                label: p.nombre,
                                path: p.nombre,
                                number: tasks.filter((t) => t.job === p.nombre).length,
                            }))}
                            style={{ padding: "0 24px" }}
                            value={path}
                            showNumerOnNoItems
                            onChange={(path) => {
                                setPath(path as Puestos)
                            }}
                        />
                    </div>
                    <div
                        className="board-column-main"
                        style={{
                            height:
                                column?.estado === EstadosTurno.Abierto
                                    ? "calc(100dvh - 525px)"
                                    : "calc(100dvh - 445px)",
                        }}
                    >
                        {!loading ? (
                            <SortableContext items={tasksIds || []}>
                                {tasks
                                    ?.filter((t) => t.job === path)
                                    .map((task) => (
                                        <TaskCard
                                            admin={admin}
                                            key={task.id}
                                            task={{ ...task, isInTurnoActual: column?.estado === EstadosTurno.Abierto }}
                                            isLoadingtoggle={isLoadingToggle}
                                            onToggleSwitch={onToggleSwitch}
                                        />
                                    ))}
                                {withHelperText && tasks.filter((t) => t.job === path).length <= 1 && (
                                    <div className="board-column-helper-container">
                                        <Icon
                                            name="DragDropFill"
                                            color="var(--morado---morado---primario)"
                                            width={24}
                                            height={24}
                                        />
                                        <span className="board-column-helper__description">
                                            Arrastra y suelta la card de tu personal para cambiarlo de turno o para
                                            iniciar otro turno
                                        </span>
                                    </div>
                                )}
                            </SortableContext>
                        ) : (
                            <CardSkeleton />
                        )}
                    </div>
                </>
            )}
            {column?.estado === EstadosTurno.Abierto && (
                <ColumnFooter
                    cambiarTurno={() => setIsModalConfirmCerrarTurnoOpen(true)}
                    turnos={allCols}
                    turnoActual={column}
                />
            )}
            <ModalConfirm
                isOpen={isModalConfirmCerrarTurnoOpen}
                iconTheme="danger"
                icon={<Icon name="ExclamationFilled" color="var(--pink-ocupado)" height={24} width={24} />}
                title="Cierre de turno"
                description={
                    <div>
                        <span className="modal-cierre-turno__description">¿Deseas cerrar el </span>
                        <span className="modal-cierre-turno__description--bold">
                            turno {column.title} de {formatTime12hrs(column?.hora_entrada || "")} a{" "}
                            {formatTime12hrs(column?.hora_salida || "")}
                        </span>
                        <span className="modal-cierre-turno__description"> con </span>
                        <span className="modal-cierre-turno__description--bold">
                            {tasks.filter((t) => t.job === Puestos.RECAMARISTA).length} turnos de camaristas y{" "}
                            {tasks.filter((t) => t.job === Puestos.MANTENIMIENTO).length} turnos de mantenimiento?
                        </span>
                    </div>
                }
                confirmLabel="Cerrar turno"
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        cambiarTurno()
                    }
                    setIsModalConfirmCerrarTurnoOpen(false)
                }}
            />
        </div>
    )
}

export default ColumnContainer
