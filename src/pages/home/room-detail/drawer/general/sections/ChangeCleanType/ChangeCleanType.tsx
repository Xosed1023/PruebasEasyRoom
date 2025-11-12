import React from "react"
import { ListView } from "src/pages/home/room-detail/sections/views/Views"
import { Block, TouchableBoldCard } from "src/pages/home/room-detail/sections/elements/Elements"
import { useRoom } from "src/pages/home/room-detail/hooks"
import useLoadingState from "src/shared/hooks/useLoadingState"
import { useCleaningTypes } from "src/pages/home/room-detail/hooks/limpieza"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { TiposLimpiezas, useCambiar_Tipo_LimpiezaMutation } from "src/gql/schema"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { formatTimeAgoNumberWord } from "src/utils/timeago"
import { addTimeByCleaningType } from "src/shared/helpers/addTimeByCleaningType"

const ChangeCleanType = ({ onConfirm }: { onConfirm: () => void }) => {
    const room = useRoom()
    const { showMiniSnackbar } = useMiniSnackbar()
    const { isLoading, toggleIsLoading } = useLoadingState()
    const data = useCleaningTypes()
    const [cambiarTipoLimpieza] = useCambiar_Tipo_LimpiezaMutation()

    const handleSelectType = async (label: string, value: string, minutes: string) => {
        if (isLoading) return
        toggleIsLoading({ value: true })

        try {
            const result = await cambiarTipoLimpieza({
                variables: {
                    updateTipoLimpiezaInput: {
                        colaboradores_tareas_ids: room?.colaborador_tareas_sin_finalizar?.map(
                            (t) => t.colaborador_tarea_id
                        ),
                        tipo_limpieza: value as TiposLimpiezas,
                    },
                },
            })

            const dateShouldEnd = addTimeByCleaningType({
                date: result.data?.actualizar_tipo_limpieza[0].fecha_registro,
                cleaningType: value as TiposLimpiezas,
                tiempoLimpiezaDetallada: room?.tipo_habitacion?.minutos_limpieza_detallada,
                tiempoLimpiezaNormal: room?.tipo_habitacion?.minutos_limpieza_normal,
                tiempoLimpiezaRetoque: room?.tipo_habitacion?.minutos_limpieza_retoque,
            })

            showMiniSnackbar({
                status: "success",
                title: "Tipo de limpieza actualizado",
                text: `**Se actualizó** a tipo de limpieza ${label} y quedan ${formatTimeAgoNumberWord(
                    dateShouldEnd
                )} restantes.`,
            })
        } catch (error) {
            showMiniSnackbar({
                status: "error",
                title: "Error al cambiar tipo de limpieza",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
            })
        } finally {
            toggleIsLoading({ value: false })
            onConfirm()
        }
    }

    return (
        <ListView title="¿Qué tipo de limpieza vas a realizar?">
            <div className="detalle-h-general__clean-type__box">
                <Block list scroll className="detalle-h-general__block-mg">
                    {data
                        .filter(
                            (tipoLimpieza) =>
                                tipoLimpieza.value !== room?.colaborador_tareas_sin_finalizar?.[0]?.tipo_limpieza
                        )
                        .map(({ label = "", value = "", minutes = "" }, index) => (
                            <TouchableBoldCard
                                key={index}
                                subtitleStyle={{ fontSize: 12, fontWeight: 400 }}
                                title={label}
                                subtitle={`Tiempo: **${minutes}**`}
                                onClick={() => handleSelectType(label, value, minutes)}
                            />
                        ))}
                </Block>
                <LoaderComponent visible={isLoading} />
            </div>
        </ListView>
    )
}

export default ChangeCleanType
