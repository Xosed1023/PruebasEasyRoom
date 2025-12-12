import { useEffect, useState } from "react"
import Description from "src/shared/components/data-display/description/Description"
import { Button } from "src/shared/components/forms"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { DetalleIncidenciaProps, ItemsIncidencia } from "./DetalleIncidencia.types"
import ModalCerrarIncidencia from "./ModalCerrarIncidencia"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { GetIncidenciaByIdQuery, useGetIncidenciaByIdLazyQuery, useReabrirIncidenciaMutation } from "src/gql/schema"
import { useNavigate } from "react-router-dom"
import "./DetalleIncidencia.css"
import { useDispatch, useSelector } from "react-redux"
import { toggleDrawer } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const DetalleIncidencia = ({ incidenciaId = "", onConfirm, onTipoIncidenciaChange }: DetalleIncidenciaProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [incidenciaItems, setIncidenciaItems] = useState<ItemsIncidencia[]>([])
    const [incidencia, setIncidencia] = useState<GetIncidenciaByIdQuery>()
    const { rolName } = useProfile()
    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

    const { showSnackbar } = useSnackbar()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { formatCustomDate } = useFormatDate()

    const [getIncidencia] = useGetIncidenciaByIdLazyQuery()
    const [reabrirIncidencia] = useReabrirIncidenciaMutation()

    useEffect(() => {
        if (incidenciaId) {
            getIncidencia({
                variables: {
                    incidencia_id: incidenciaId,
                },
            }).then(({ data }) => {
                const incidencia = data?.incidencias[0]
                if (incidencia) {
                    const itemsData = [
                        {
                            icon: "calendarFill",
                            label: "Fecha de registro",
                            value: formatCustomDate(incidencia.fecha_registro, "MMM, DD YYYY") || "-",

                        },
                        { icon: "timerFill", label: "Turno", value: incidencia?.turno?.nombre || "" },
                        {
                            icon: "alertFill",
                            label: "Urgencia",
                            value: capitalizeString(incidencia?.severidad || "") || "-",
                        },
                    ]
                    if (incidencia?.habitacion) {
                        const itemsHabitacion = [
                            { icon: "location", label: "Lugar o responsable", value: capitalizeString(incidencia?.area || "") || "-" },
                            {
                                icon: "BedFilled",
                                label: "Habitación",
                                value: `${incidencia?.habitacion?.tipo_habitacion?.nombre} ${incidencia?.habitacion?.numero_habitacion}`,
                            },
                        ]
                        itemsData.push(...itemsHabitacion)
                    }
                    itemsData.push({
                        icon: "surveyFill",
                        label: "Tipo",
                        value: capitalizeString(incidencia?.area || "") + " - " + incidencia?.tipo_incidencia || "-",
                    })

                    if (incidencia?.area === "huésped") {
                        const { matricula, vehiculo } = incidencia ?? {}
                        const { marca, modelo, color } = vehiculo ?? {}
                        const itemsHabitacion = [
                            {
                                icon: "userFilled",
                                label: "Nombre del responsable",
                                value: incidencia?.huesped || " - ",
                            },
                            {
                                icon: "car",
                                label:
                                    matricula && (marca || modelo || color) ? "Detalle de auto" : "Matrícula del auto",
                                value:
                                    matricula && (marca || modelo || color)
                                        ? [marca, modelo, color, matricula].filter(Boolean).join("/")
                                        : incidencia?.matricula
                                        ? incidencia.matricula
                                        : "-",
                            },
                        ]
                        itemsData.push(...itemsHabitacion)
                    } else if(incidencia?.area === "instalaciones"){
                        const itemsInstalaciones = [{ icon: "location", label: "Lugar o responsable", value: "Instalaciones" }]
                        itemsData.push(...itemsInstalaciones)
                    }
                    if (incidencia?.estado !== "activa") {
                        const itemsCerrada = {
                            icon: "checkFilled",
                            label: "Comentario de cierre",
                            value: incidencia?.comentario_cierre || "",
                        }
                        itemsData.push(itemsCerrada)
                        itemsData.splice(1, 0, {
                            icon: "calendarChecked",
                            label: "Fecha de cierre",
                            value: incidencia?.fecha_cierre
                                ? formatCustomDate(incidencia.fecha_cierre, "DD/MMM/YY")
                                : "-",
                        })

                    }

                    const itemsFinal = [
                        {
                            icon: "draft",
                            label: "Reportó",
                            value:
                                incidencia?.colaborador_reporta?.nombre +
                                " " +
                                incidencia?.colaborador_reporta?.apellido_materno,
                        },
                        { icon: "chat", label: "Descripción", value: incidencia?.detalle || "" },
                    ]
                    itemsData.push(...itemsFinal)
                    setIncidencia(data)
                    incidencia.tipo_incidencia && onTipoIncidenciaChange?.(incidencia.tipo_incidencia)

                    setIncidenciaItems(itemsData)
                }
            })
        }
    }, [incidenciaId, isDrawerOpen])

    const handleOpen = () => {
        reabrirIncidencia({
            variables: {
                datos_incidencia: {
                    incidencia_id: incidenciaId,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Incidencia reabierta",
                    status: "success",
                    text: `La incidencia **${incidencia?.incidencias[0].folio}** se reabrió exitosamente`,
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al abrir la incidencia",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                })
            })

        navigate("/u/incidencias")
        dispatch(toggleDrawer(false))
    }

    return (
        <div>
            <div
                className={
                    incidenciaItems?.length > 6
                        ? "detalle-incidencia__container"
                        : "detalle-incidencia__container__items detalle-incidencia__container"
                }
            >
                {incidenciaItems?.map(({ icon = "", label = "", value = "" }, index) => (
                    <Description icon={icon} label1={label} value1={value} key={index} />
                ))}
            </div>
            {rolName === RoleNames.mantenimiento ? (
                <>
                    {incidencia?.incidencias[0]?.estado === "activa" &&
                    incidencia?.incidencias[0]?.tipo_incidencia?.toLowerCase() === "mantenimiento" && (
                        <div className="detalle-incidencia__container-button">
                            <Button
                                className="detalle-incidencia__button"
                                text={"Cerrar incidencia"}
                                onClick={validateIsColabActive(() => setVisible(true))}
                                theme="primary-resumen"
                            />
                        </div>
                    )}

                    {incidencia?.incidencias[0]?.estado === "cerrada" &&
                    incidencia?.incidencias[0]?.tipo_incidencia?.toLowerCase() === "mantenimiento" && (
                        <div className="detalle-incidencia__container-button">
                            <Button
                                className="detalle-incidencia__button"
                                text={"Reabrir incidencia"}
                                onClick={validateIsColabActive(handleOpen)}
                                theme="primary-resumen"
                            />
                        </div>
                    )}
                </>
            ) : (
                <>
                    {rolName !== RoleNames.monitoreo && (
                        <>
                            {incidencia?.incidencias[0]?.estado === "activa" && (
                                <div className="detalle-incidencia__container-button">
                                    <Button
                                        className="detalle-incidencia__button"
                                        text={"Cerrar incidencia"}
                                        onClick={validateIsColabActive(() => setVisible(true))}
                                        theme="primary-resumen"
                                    />
                                </div>
                            )}

                            {incidencia?.incidencias[0]?.estado === "cerrada" && (
                                <div className="detalle-incidencia__container-button">
                                    <Button
                                        className="detalle-incidencia__button"
                                        text={"Reabrir incidencia"}
                                        onClick={validateIsColabActive(handleOpen)}
                                        theme="primary-resumen"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            <ModalCerrarIncidencia
                visible={visible}
                folio={incidencia?.incidencias[0].folio || ""}
                onClose={() => setVisible(false)}
                incidenciaId={incidenciaId}
                onConfirm={onConfirm}
                tipoIncidencia={incidencia?.incidencias[0].tipo_incidencia}
            />
            {InactiveModal}
        </div>
    )
}

export default DetalleIncidencia
