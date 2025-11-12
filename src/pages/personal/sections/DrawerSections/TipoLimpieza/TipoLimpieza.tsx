import "./TipoLimpieza.css"
import DrawerWrappper from "src/pages/personal/components/DrawerWrapper/DrawerWrappper"
import { PrimaryButton, TouchableBoldCard } from "src/pages/home/room-detail/sections/elements/Elements"
import DrawerTitle from "src/pages/personal/components/DrawerTitle/DrawerTitle"
import DrawerContent from "src/pages/personal/components/Drawercontent/DrawerContent"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { useState } from "react"
import { assignColaborador } from "src/pages/home/room-detail/helpers/colaborador"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { Estados_Habitaciones, TiposTarea } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useCloseDrawer } from "src/pages/home/room-detail/helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useColaboradorSelected } from "src/pages/personal/pages/tabla-personal/hooks/useSelected"
import useLoadingState from "src/shared/hooks/useLoadingState"

const TipoLimpieza = ({handleRefetch}: {handleRefetch: () => void}) => {
    const { habitacionParaLimpiezaSeleccionada } = useSelector((root: RootState) => root.personal)
    const { colaboradorSelected } = useColaboradorSelected()

    const { showMiniSnackbar } = useMiniSnackbar()
    const { showSnackbar } = useSnackbar()
    const { usuario_id } = useProfile()
    const dispatch = useDispatch()
    const { isLoading, toggleIsLoading, isLoadingDelayed } = useLoadingState()

    const [value, setValue] = useState<{ value: string; label: string }>({ value: "", label: "" })

    const { closeDrawer } = useCloseDrawer(() => {
        toggleIsLoading({ value: false })
    })

    const confirmLimpieza = () => {
        if (isLoading || !value.value) {
            return
        }
        toggleIsLoading({ value: true })
        const description = `Limpieza de la habitación ${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.nombre} ${habitacionParaLimpiezaSeleccionada?.numero_habitacion}`

        assignColaborador({
            datos_tarea: {
                nombre: "Limpieza de habitación",
                descripcion: description,
                puesto_id: colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.puesto_id || "",
                tipo: TiposTarea.Limpieza,
            },
            datos_colaborador_tarea: {
                colaborador_ids: [colaboradorSelected?.colaborador_id || ""],
                descripcion_tarea: description,
                habitacion_id: habitacionParaLimpiezaSeleccionada?.habitacion_id || "",
                tipo_limpieza: value.value,
            },
            estadoHabitacion: Estados_Habitaciones.Limpieza,
            usuario_id,
        })
            .then(() => {
                dispatch(togglePersonalTurnoDrawer(false))
                showSnackbar({
                    title: "Limpieza de habitación",
                    text: `**${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno}** comenzará con la **${value.label}** en la habitación **${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.nombre} ${habitacionParaLimpiezaSeleccionada?.numero_habitacion}.**`,
                    status: "success",
                })
                toggleIsLoading({ value: false })
            })
            .catch(() => {
                showMiniSnackbar({
                    title: "Error al asignar camarista1",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
                toggleIsLoading({ value: false })
            })
            .finally(() => {
                handleRefetch()
                closeDrawer()
            })
    }

    return (
        <DrawerWrappper
            hasBackButton
            footerChildren={
                <PrimaryButton
                    text="Continuar"
                    onClick={() => confirmLimpieza()}
                    disabled={!value.value || isLoadingDelayed}
                />
            }
        >
            <DrawerTitle
                title="¿Qué tipo de limpieza vas a realizar?"
                hasBackButton
                titleStyle={{ textWrap: "wrap" } as any}
            />
            <DrawerContent>
                <div className="personal__room-to-clean__cols">
                    <span className="personal__room-to-clean__cols__label">Habitación</span>
                    <span className="personal__room-to-clean__cols__label">{"Tiempo"}</span>
                </div>
                <div className="personal__room-to-clean__tabs">
                    <TouchableBoldCard
                        style={{
                            margin: "12px 0",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 24,
                        }}
                        subtitleStyle={{ fontSize: 16, fontWeight: 600 }}
                        titleStyle={{ fontSize: 24, fontWeight: 600 }}
                        title={"Retoque"}
                        subtitle={`${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_retoque} min`}
                        onClick={() =>
                            setValue({
                                value: "retoque",
                                label: `Limpieza de ${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_retoque} min`,
                            })
                        }
                        active={value.value === "retoque"}
                    />
                    <TouchableBoldCard
                        style={{
                            margin: "12px 0",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 24,
                        }}
                        subtitleStyle={{ fontSize: 16, fontWeight: 600 }}
                        titleStyle={{ fontSize: 24, fontWeight: 600 }}
                        title={"Normal"}
                        subtitle={`${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_normal} min`}
                        onClick={() =>
                            setValue({
                                value: "normal",
                                label: `Limpieza de ${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_normal} min`,
                            })
                        }
                        active={value.value === "normal"}
                    />
                    <TouchableBoldCard
                        style={{
                            margin: "12px 0",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 24,
                        }}
                        subtitleStyle={{ fontSize: 16, fontWeight: 600 }}
                        titleStyle={{ fontSize: 24, fontWeight: 600 }}
                        title={"Detallada"}
                        subtitle={`${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_detallada} min`}
                        onClick={() =>
                            setValue({
                                value: "detallada",
                                label: `Limpieza de ${habitacionParaLimpiezaSeleccionada?.tipo_habitacion?.minutos_limpieza_detallada} min`,
                            })
                        }
                        active={value.value === "detallada"}
                    />
                </div>
                <LoaderComponent visible={isLoading} />
            </DrawerContent>
        </DrawerWrappper>
    )
}

export default TipoLimpieza
