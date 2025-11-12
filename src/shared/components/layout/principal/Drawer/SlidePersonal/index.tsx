import { useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { Puestos } from "src/constants/puestos"
import DrawerAccordion from "src/shared/components/data-display/drawer-accordion/DrawerAccordion"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import Drawer from "../../../drawer/Drawer"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import profileDefault from "src/assets/webp/profile_default.webp"
import { formatTimeAgoNumberWord } from "src/utils/timeago"
import "./index.css"

type Label = {
    plural: string
    singular: string
    tarea: number
}

function SlidePersonal({ onClose }): JSX.Element {
    const { isSlidePersonalOpen } = useSelector((state: RootState) => state.navigation)

    const [value, setValue] = useState<string>(Puestos.SUPERVISOR)

    const disponibles = useMemo(
        () => isSlidePersonalOpen?.disponible?.filter(({ puesto = "" }) => puesto === value) || [],
        [value]
    )

    const colaboradores_tareas = useMemo(
        () => isSlidePersonalOpen?.asignado?.filter(({ puesto = "" }) => puesto === value) || [],
        [value]
    )

    const label: Label = useMemo(() => {
        const collection = {
            [Puestos.SUPERVISOR]: {
                plural: "Supervisor",
                singular: "Supervisores",
                tarea: -"supervisiòn",
            },
            [Puestos.RECAMARISTA]: {
                plural: "Camarista",
                singular: "Camaristas",
                tarea: -"limpieza",
            },
            [Puestos.MESERO]: {
                plural: "Mesero",
                singular: "Meseros",
                tarea: -"servicio",
            },
            [Puestos.MANTENIMIENTO]: {
                plural: "Personal",
                singular: "Personal",
                tarea: -"mantenimiento",
            },
        }
        return collection?.[value] || collection["Mantenimiento"]
    }, [value])

    return (
        <Drawer
            visible
            placement={"right"}
            className="slide-personal"
            bgClassName="slide-personal__blur"
            withCloseButton
            onClose={onClose}
        >
            <p className="slide-personal__title">{"Personal activo en turno"}</p>
            <TabMenu
                className="slide-personal__tabs"
                darkMode
                value={value}
                tabList={[
                    { label: "Supervisores", path: Puestos.SUPERVISOR },
                    { label: "Camaristas", path: Puestos.RECAMARISTA },
                    { label: "Meseros", path: Puestos.MESERO },
                    { label: "Mantenimiento", path: Puestos.MANTENIMIENTO },
                ]}
                onChange={setValue}
            />
            <div className="slide-personal__content">
                <DrawerAccordion
                    className="slide-personal__accordion"
                    title={`${label.singular} disponible${value !== Puestos.MANTENIMIENTO ? "s" : ""} (${
                        disponibles.length
                    })`}
                    isEmpty={!disponibles.length}
                    emptyDescription="No hay personal disponible"
                    emptyIcon={"accountBoxFill"}
                >
                    {disponibles.map((c, index) => (
                        <CardStaff
                            className={"slide-personal__item"}
                            key={index}
                            name={c?.name || ""}
                            picture={c?.image || profileDefault}
                            description={`Disponible desde hace: **${
                                value === Puestos.MESERO
                                    ? c?.fecha_mesa_anterior
                                        ? formatTimeAgoNumberWord(c?.fecha_mesa_anterior)
                                        : "-"
                                    : c?.fecha_habitacion_anterior
                                    ? formatTimeAgoNumberWord(c?.fecha_habitacion_anterior)
                                    : "-"
                            }**`}
                            text={
                                value === Puestos.MESERO
                                    ? `Últ. servicio: **${c?.mesa || "-"}**`
                                    : `Últ. habitación asignada: **${c?.room || "-"}**`
                            }
                            active={false}
                        />
                    ))}
                </DrawerAccordion>
                <DrawerAccordion
                    className="slide-personal__accordion"
                    title={`${label.plural} con tareas en curso (${colaboradores_tareas.length})`}
                    isEmpty={!colaboradores_tareas.length}
                    emptyDescription="No hay personal con tareas en curso"
                    emptyIcon={"accountBoxFill"}
                >
                    {colaboradores_tareas.map((c, index) => (
                        <CardStaff
                            className={"slide-personal__item"}
                            key={index}
                            name={c?.name || ""}
                            picture={c?.image || profileDefault}
                            description={`En ${label.tarea || "servicio"}: **${
                                value === Puestos.MESERO ? c?.mesa || "-" : c?.room || "-"
                            }**`}
                            active={false}
                        />
                    ))}
                </DrawerAccordion>
            </div>
        </Drawer>
    )
}

export default SlidePersonal
