import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
    CancelOperationsRentaInput,
    CancelRoomServiceRentaItemInput,
    Estados_Habitaciones,
    TiposExtras,
    useCancelarRentaHabitacionMutation,
    useGetTicketForCancelacionQuery,
    useGetTransaccionesForCancelacionQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { Modal } from "src/shared/components/layout/modal/Modal"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { RoleNames } from "src/shared/hooks/useAuth"
import Home from "./sections/Home"
import Ordenes from "./sections/Ordenes"
import Auth from "./sections/Auth"
import "./Cancelacion.css"

type ModalCancelacionProps = {
    movimiento: {
        ticket_id: string
        tipo: string
        folio: number
    }
    onClose: () => void
    onSuccess: () => void
}

function ModalCancelacion({ onClose, movimiento, onSuccess }: ModalCancelacionProps) {
    const { rolName, usuario_id, hotel_id } = useProfile()
    const [view, setView] = useState<"home" | "auth" | "ordenes">("home")
    const [load, setLoad] = useState<boolean>(false)

    const isRecepcion = rolName === RoleNames.recepcionista
    const modal = view === "home" ? { width: 572, height: 270 } : { width: 780, height: 360 }

    const navigate = useNavigate()
    const ref = useRef<HTMLDivElement>(null)
    const { showSnackbar } = useSnackbar()

    const ticket_id = movimiento?.ticket_id || ""

    const { data: ticket } = useGetTicketForCancelacionQuery({ variables: { ticket_id } })

    const renta = ticket?.ticket?.data?.origen_ticket?.renta
    const renta_id = ticket?.ticket?.data?.renta_id || ""

    const { data: transacciones } = useGetTransaccionesForCancelacionQuery({ variables: { renta_id }, skip: !renta })

    const ordenes_list = transacciones?.transacciones_renta?.ordenes || []
    const ordenes = ordenes_list.filter((i) => !i?.ticket?.ticket_id)

    const [cancelarRenta] = useCancelarRentaHabitacionMutation()

    const onCancelacion = (variables: CancelOperationsRentaInput) => {
        setLoad(true)
        cancelarRenta({ variables: { datos_cancelar: variables } })
            .then(() => {
                showSnackbar({
                    title: "Cancelación exitosa",
                    text: `Movimiento **${movimiento.folio}** cancelado exitosamente.`,
                    status: "success",
                })
                onSuccess()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cancelar movimiento",
                    status: "error",
                })
            })
            .finally(() => {
                onClose()
                setLoad(false)
            })
    }

    const onNextPage = (view: any, number: number) => {
        setView(view)
        if (ref?.current) ref.current.style.transform = `translateX(-${number}%)`
    }

    const onBackPage = () => {
        setView("home")
        if (ref?.current) ref.current.style.transform = "translateX(0%)"
    }

    const getExtras = () => {
        const extras: CancelOperationsRentaInput["extras"] = []
        transacciones?.transacciones_renta?.transacciones?.forEach((i) => {
            i.extras?.forEach((i) => {
                extras.push({ extra_id: i.extra_id, tipo_extra: i.tipo_extra })
            })
        })

        transacciones?.transacciones_renta?.transacciones_checkin?.forEach((i) => {
            i.extras?.forEach((i) => {
                extras.push({ extra_id: i.extra_id, tipo_extra: i.tipo_extra })
            })
        })

        return extras
    }

    const handleCancelacion = (ordenes?: CancelRoomServiceRentaItemInput[]) => {
        if (!ticket?.ticket) {
            showSnackbar({
                title: "Error al cancelar movimiento",
                status: "error",
            })
            onClose()
            return
        }

        const isExtra = movimiento.tipo?.includes("extra")
        const isOcupada =
            renta?.habitacion?.estado === Estados_Habitaciones.Ocupada &&
            renta?.habitacion?.ultima_renta?.renta_id === renta_id

        const extras = getExtras()
        const variables = {
            renta_id,
            usuario_id,
            hotel_id,
            motivo_cancelacion: "Error operativo",
            extras,
        }

        if (isExtra) {
            const tipo = movimiento.tipo?.split(" extra")?.[0] || ""

            const tipo_extra =
                tipo === "Personas" ? TiposExtras.Persona : tipo === "Horas" ? TiposExtras.Hora : TiposExtras.Hospedaje

            onCancelacion({
                ...variables,
                cancelar_renta: false,
                extras: [
                    {
                        extra_id: ticket?.ticket?.data?.origen_ticket?.id || "",
                        tipo_extra,
                    },
                ],
            })
            return
        }

        if (isOcupada) {
            navigate(`/u/cancelar-habitacion/${renta?.habitacion_id}`, {
                state: {
                    motivoCancelacion: variables.motivo_cancelacion,
                    extras,
                    renta_id,
                    codigo: "",
                    cancelar_estancia: true,
                    ordenes,
                    origen: "cortes",
                },
            })
            return
        }

        onCancelacion({
            ...variables,
            cancelar_renta: true,
            ordenes,
        })
    }

    const handleVerification = () => {
        if (ordenes.length > 0) {
            onNextPage("ordenes", 100)
            return
        }

        handleCancelacion()
    }

    const handleConfirm = () => {
        if (isRecepcion) {
            onNextPage("auth", 100)
            return
        }

        handleVerification()
    }

    return (
        <Modal className="cortes__cancelacion" isOpen={true} withCloseButton onClose={onClose} {...modal}>
            <section className="cortes__cancelacion__wrapper" ref={ref}>
                <Home load={load} onClose={onClose} onConfirm={handleConfirm} />
                {isRecepcion && (
                    <Auth
                        onLoading={() => null}
                        visible={view === "auth"}
                        onAuthConfirm={handleVerification}
                        onBack={onBackPage}
                    />
                )}
                <Ordenes
                    orders={ordenes}
                    selected={ordenes.map(({ orden_id = "" }) => orden_id)}
                    onChange={(v) => handleCancelacion(v)}
                />
            </section>
            <LoaderComponent visible={load} />
        </Modal>
    )
}

export default ModalCancelacion
