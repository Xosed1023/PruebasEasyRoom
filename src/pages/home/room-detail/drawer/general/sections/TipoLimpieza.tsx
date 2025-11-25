import React, { useState } from "react"
import { usePuestos } from "../../../hooks/usePuestos"
import { assignColaborador } from "../../../helpers/colaborador"
import { ListView } from "../../../sections/views/Views"
import { Block } from "../../../sections/elements/Elements"
import { useRoom } from "../../../hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import CardStaff from "src/shared/components/data-display/card-staff/CardStaff"
import { Puestos } from "src/constants/puestos"
import { useProfile } from "src/shared/hooks/useProfile"
import { Estados_Habitaciones, TiposTarea } from "src/gql/schema"
import { useCloseDrawer } from "../../../helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"

// Seleccion de tipo de limpieza para el detalle de ocupada (de ocupada a ocupada limpieza)
const TipoLimpieza = ({
    colaborador_ids,
    colaboradorNombre,
    onConfirm,
}: {
    colaborador_ids: string[]
    colaboradorNombre: string
    onConfirm?: () => void
}) => {
    const puestos = usePuestos()
    const { usuario_id, hotel_id } = useProfile()
    const [tipoLimpieza, setTipoLimpieza] = useState<{
        tipo: "normal" | "detallada" | "retoque" | null
        minutos: string
    }>({ tipo: null, minutos: "" })

    const room = useRoom()
    const { isLoading, toggleIsLoading } = useLoadingState()
    const { showSnackbar } = useSnackbar()
    const { closeDrawer } = useCloseDrawer(() => {
        toggleIsLoading({ value: false })
    })

    const confirmCamarista = (tipo: "normal" | "detallada" | "retoque", minutos: string) => {
        if (isLoading || !tipo) return
        toggleIsLoading({ value: true })

        setTipoLimpieza({ tipo, minutos })

        assignColaborador({
            datos_tarea: {
                nombre: "Limpieza de habitación",
                descripcion: "Limpieza de habitación",
                puesto_id: puestos.find((p) => p?.nombre === Puestos.RECAMARISTA)?.puesto_id || "",
                tipo: TiposTarea.Limpieza,
            },
            datos_colaborador_tarea: {
                colaborador_ids,
                descripcion_tarea: "Limpieza de habitación",
                habitacion_id: room?.habitacion_id,
                tipo_limpieza: tipo,
            },
            usuario_id,
            hotel_id,
            estadoHabitacion: Estados_Habitaciones.Ocupada,
        })
            .then(() => {
                if (colaborador_ids?.length <= 1) {
                    showSnackbar({
                        status: "success",
                        title: `Limpieza de habitación ${room.numero_habitacion}`,
                        text: `**${colaboradorNombre}** comenzará con la **limpieza ${tipo}** de **${minutos} min** en la habitación **${room.tipo_habitacion?.nombre} ${room.numero_habitacion}.**`,
                    })
                    return
                }
                showSnackbar({
                    title: "Limpieza de habitación",
                    text: `**${colaborador_ids.length} camaristas** comenzarán con la **${tipo}** de la habitación **${room?.nombre}**`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al crear asignar limpieza",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                onConfirm?.()
                closeDrawer()
            })
    }

    return (
        <ListView
            title="¿Qué tipo de limpieza vas a realizar?"
            subtitle="Camaristas disponibles"
            titleStyle={{ width: "80%" }}
            subtitleStyle={{ fontWeight: 400 }}
        >
            <Block list scroll className="detalle-h-general__clean__tipo-limpieza animante__opacity-transform__ease">
                <CardStaff
                    name="Retoque"
                    description={`Tiempo: **${room?.tipo_habitacion?.minutos_limpieza_retoque} min**`}
                    text=""
                    active={tipoLimpieza.tipo === "retoque"}
                    onClick={() => confirmCamarista("retoque", `${room?.tipo_habitacion?.minutos_limpieza_retoque}`)}
                />
                <CardStaff
                    name="Limpieza normal"
                    description={`Tiempo: **${room?.tipo_habitacion?.minutos_limpieza_normal} min**`}
                    text=""
                    active={tipoLimpieza.tipo === "normal"}
                    onClick={() => confirmCamarista("normal", `${room?.tipo_habitacion?.minutos_limpieza_normal}`)}
                />
                <CardStaff
                    name="Limpieza detallada"
                    description={`Tiempo: **${room?.tipo_habitacion?.minutos_limpieza_detallada} min**`}
                    text=""
                    active={tipoLimpieza.tipo === "detallada"}
                    onClick={() =>
                        confirmCamarista("detallada", `${room?.tipo_habitacion?.minutos_limpieza_detallada}`)
                    }
                />
            </Block>
            <LoaderComponent visible={isLoading} />
        </ListView>
    )
}

export default TipoLimpieza
