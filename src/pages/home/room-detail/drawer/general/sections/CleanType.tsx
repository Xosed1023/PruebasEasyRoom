import { ListView } from "../../../sections/views/Views"
import { Block, TouchableBoldCard } from "../../../sections/elements/Elements"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { SectionProps } from "../index.type"
import { useRoom } from "../../../hooks"
import { assignColaborador } from "../../../helpers/colaborador"
import { useCleaningTypes } from "../../../hooks/limpieza"
import { usePuestos } from "../../../hooks/usePuestos"
import { Puestos } from "src/constants/puestos"
import { useProfile } from "src/shared/hooks/useProfile"
import { Estados_Habitaciones, TiposTarea } from "src/gql/schema"
import { useCloseDrawer } from "../../../helpers/useCloseDrawer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useLoadingState from "src/shared/hooks/useLoadingState"

const CleanType = ({ state }: SectionProps) => {
    const room = useRoom()
    const { isLoading, toggleIsLoading } = useLoadingState()
    const { closeDrawer } = useCloseDrawer(() => {
        toggleIsLoading({ value: false })
    })
    const { usuario_id, hotel_id } = useProfile()
    const puestos = usePuestos()

    const puestoId =
        puestos.find(
            (p) => p?.nombre === Puestos.RECAMARISTA || p?.nombre === Puestos.SUPERVISOR
        )?.puesto_id || ""

    const { showMiniSnackbar } = useMiniSnackbar()
    const data = useCleaningTypes()

    const handleError = () => {
        showMiniSnackbar({
            title: "Error al asignar habitación a limpieza",
            status: "error",
        })
        toggleIsLoading({ value: false })
    }

    const handleSelectCleaningType = async (label: string, value: string, minutes: string) => {
        if (isLoading) return
        toggleIsLoading({ value: true })

        const labelCompleta = `${label} de ${minutes}`
        const description = `Limpieza de la habitación ${room?.nombre}`

        try {
            await assignColaborador({
                datos_tarea: {
                    nombre: "Limpieza de habitación",
                    descripcion: description,
                    puesto_id: puestoId,
                    tipo: TiposTarea.Limpieza,
                },
                datos_colaborador_tarea: {
                    colaborador_ids: state.colaboradores.map((c) => c.colaborador_id),
                    descripcion_tarea: description,
                    habitacion_id: room?.habitacion_id,
                    tipo_limpieza: value,
                },
                usuario_id,
                hotel_id,
                estadoHabitacion: Estados_Habitaciones.Limpieza,
            })

            const nombreColab = state.colaboradores?.[0]?.nombre
            showMiniSnackbar({
                title: "Limpieza de habitación",
                text:
                    state.colaboradores.length <= 1
                        ? `**${nombreColab}** comenzará con la **${labelCompleta}** de la habitación **${room?.nombre}**`
                        : `**${state.colaboradores.length} camaristas** comenzarán con la **${labelCompleta}** de la habitación **${room?.nombre}**`,
                status: "success",
            })
        } catch (e) {
            handleError()
            console.log(e)
        } finally {
            closeDrawer()
        }
    }

    return (
        <ListView title="¿Qué tipo de limpieza vas a realizar?">
            <div className="detalle-h-general__clean-type__box">
                <Block list scroll className="detalle-h-general__block-mg">
                    {data.map(({ label = "", value = "", minutes = "" }, index) => (
                        <TouchableBoldCard
                            key={index}
                            subtitleStyle={{ fontSize: 12, fontWeight: 400 }}
                            title={label}
                            subtitle={`Tiempo: **${minutes}**`}
                            onClick={() => handleSelectCleaningType(label, value, minutes)}
                        />
                    ))}
                </Block>
                <LoaderComponent visible={isLoading} />
            </div>
        </ListView>
    )
}

export default CleanType
