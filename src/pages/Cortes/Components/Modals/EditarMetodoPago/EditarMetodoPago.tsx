import { useEffect, useMemo, useState, useRef } from "react"
import { useForm, FormProvider } from "react-hook-form"
import {
    FormaDePagoDetailInput,
    TiposPagos,
    useEditarMetodoDePagoMovimientoMutation,
    useGetDataTicketQuery,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { usePrintTicket } from "src/shared/hooks/print"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { Modal } from "src/shared/components/layout/modal/Modal"
import Form from "./sections/form"
import Auth from "./sections/Auth"
import Icon from "src/shared/icons"
import { FormValues } from "./sections/form/Form.types"
import Skeleton from "./sections/Skeleton"
import MetodosEmpty from "./sections/Empty"
import "./EditarMetodoPago.css"

type EditarMetodoPagoProps = {
    movimiento: {
        ticket_id: string
        tipo_pago: string
        total: number
    }
    onClose: () => void
    onSuccess: () => void
}

function EditarMetodoPago({ onClose, onSuccess, movimiento }: EditarMetodoPagoProps): JSX.Element {
    const [auth, setAuth] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)
    const [isMixto, setIsMixto] = useState<boolean>(false)
    const { data, loading } = useGetDataTicketQuery({
        variables: {
            ticket_id: movimiento.ticket_id || "",
        },
    })

    const [editarMetodoDePagoMovimiento] = useEditarMetodoDePagoMovimientoMutation()

    const { showSnackbar } = useSnackbar()
    const { handlePrint } = usePrintTicket()

    const ref = useRef<HTMLDivElement>(null)

    const form = useForm<FormValues>({
        defaultValues: {
            metodo_pago: [],
        },
    })

    const getPropina = (tipo_pago: string, numero_referencia: string): number => {
        const propinas = data?.ticket.data?.propinas || []
        const propina = propinas.find((i) => {
            const propina_numero_referencia = i?.ultimos_digitos || i?.numero_referencia || ""
            return i?.tipo_pago === tipo_pago && propina_numero_referencia === numero_referencia
        })
        return Number(Number(propina?.total || 0).toFixed(2))
    }

    const metodo_pago = useMemo(() => {
        const array = data?.ticket.data?.metodos_pago || []

        return (
            array?.map((i, index) => {
                const numero_referencia = i?.ultimos_digitos || i?.numero_referencia || ""
                const tipo_pago = i?.tipo || ""
                return {
                    metodo_id: `${index}`,
                    subtotal: Number(i?.total || 0),
                    tipo_pago,
                    numero_referencia,
                    monto_propina: getPropina(tipo_pago, numero_referencia),
                }
            }) || []
        )
    }, [data?.ticket.data?.metodos_pago])

    useEffect(() => {
        if (metodo_pago.length > 0) {
            setIsMixto(metodo_pago.length >= 2)
            form.reset({ metodo_pago })
        }
    }, [metodo_pago])

    const getMessage = (): string => {
        const values = form.getValues("metodo_pago")
        const messages: string[] = []

        values.forEach((item) => {
            let message = ""
            const origen = metodo_pago.find((i) => i.metodo_id === item.metodo_id) || item

            const propina = item.monto_propina !== origen.monto_propina
            const numero_referencia =
                origen.numero_referencia && item.tipo_pago !== TiposPagos.Efectivo
                    ? item.numero_referencia !== origen.numero_referencia
                    : false
            const tipo = item.tipo_pago !== origen.tipo_pago

            if (propina && !numero_referencia && !tipo) message = "La **propina** fue **actualizada** exitosamente."
            if (tipo && !propina && !numero_referencia) message = "El **método de pago fue actualizado** exitosamente."
            if (numero_referencia && !tipo && !propina)
                message = "El **número de tarjeta o referencia** fue actualizado exitosamente."

            if (tipo && propina && !numero_referencia)
                message = "El **método de pago y la propina** fueron actualizados exitosamente."
            if (tipo && !propina && numero_referencia)
                message = "El **método de pago y el número de tarjeta o referencia** fueron actualizados exitosamente."
            if (tipo && propina && numero_referencia)
                message =
                    "El **método de pago, el número de tarjeta o referencia y la propina** fueron actualizados exitosamente."

            if (numero_referencia && propina && !tipo)
                message = "El **número de tarjeta o referencia y la propina** fueron actualizados exitosamente."

            if (message) {
                messages.push(message)
            }
        })

        return messages.length > 1 || isMixto
            ? "Los **métodos de pago** se actualizaron exitosamente. "
            : messages?.[0] || "El **método de pago fue actualizado** exitosamente."
    }

    const buildInput = (): FormaDePagoDetailInput[] => {
        const values = form.getValues("metodo_pago")

        const eliminados: FormaDePagoDetailInput[] = []
        const nuevos: FormaDePagoDetailInput[] = []
        const actualizados: FormaDePagoDetailInput[] = []

        metodo_pago.forEach((origen) => {
            const find = values.find((i) => origen.metodo_id === i.metodo_id)
            if (!find) {
                eliminados.push({
                    eliminar_tipo_pago: true,
                    eliminar_propina: true,
                    numero_referencia: origen.numero_referencia,
                    subtotal: origen.subtotal,
                    tipo_pago: origen.tipo_pago as TiposPagos,
                    ...(origen.monto_propina > 0 ? { monto_propina: origen.monto_propina } : {}),
                })
            }
        })

        values.forEach(({ monto_propina, numero_referencia, subtotal, tipo_pago, metodo_id }) => {
            const origen = metodo_pago.find((i) => metodo_id === i.metodo_id)
            if (!origen) {
                nuevos.push({
                    monto_propina: monto_propina || null,
                    numero_referencia: numero_referencia || null,
                    subtotal: subtotal,
                    tipo_pago: tipo_pago as TiposPagos,
                })
            } else {
                const eliminar_propina = {
                    eliminar_propina: true,
                    monto_propina: null,
                }
                actualizados.push({
                    numero_referencia: numero_referencia || null,
                    subtotal: subtotal,
                    tipo_pago: tipo_pago as TiposPagos,
                    monto_propina: monto_propina > 0 ? monto_propina : null,
                    ...(origen.monto_propina > 0 && monto_propina === 0 ? eliminar_propina : {}),
                })
            }
        })

        return [...actualizados, ...nuevos, ...eliminados]
    }

    const onSubmit = () => {
        setLoader(true)
        editarMetodoDePagoMovimiento({
            variables: {
                editMetodoPagoTicketInput: {
                    ticket_id: movimiento.ticket_id,
                    metodo_pago: buildInput(),
                },
            },
        })
            .then(({ data }) => {
                const ticket_id = data?.editar_metodo_pago?.ticket_id || ""
                if (ticket_id) {
                    showSnackbar({
                        title: "Cambios guardados",
                        text: getMessage(),
                        status: "success",
                    })
                    handlePrint(ticket_id, "custom", "8")
                    onSuccess()
                } else {
                    showSnackbar({ status: "error", title: "Error al cambiar metodo de pago" })
                }
            })
            .catch((e) => {
                console.log(e)
                showSnackbar({ status: "error", title: "Error al cambiar metodo de pago" })
            })
            .finally(() => {
                onClose()
                setLoader(false)
            })
    }

    const onNextPage = () => {
        setAuth(true)
        if (ref?.current) ref.current.style.transform = "translateX(-100%)"
    }

    const onBackPage = () => {
        setAuth(false)
        if (ref?.current) ref.current.style.transform = "translateX(0%)"
    }

    return (
        <Modal
            className="cortes__edicion-pago"
            style={{ padding: "24px 0" }}
            width={800}
            height={510}
            isOpen={true}
            withCloseButton
            onClose={onClose}
        >
            {auth ? (
                <div className="cortes__edicion-pago__back" onClick={onBackPage}>
                    <Icon name={"ChevronFill"} height={18} width={11} color={"var(--primary)"} />
                </div>
            ) : null}
            {!loading ? (
                data?.ticket ? (
                    <div className="cortes__edicion-pago__content">
                        <div className={"cortes__edicion-pago__wrapper"} ref={ref}>
                            <div className="cortes__edicion-pago__item">
                                <FormProvider {...form}>
                                    <Form
                                        className={""}
                                        tipo={movimiento.tipo_pago}
                                        total={movimiento.total}
                                        subtotal={metodo_pago.reduce(
                                            (prev, current) => Number(prev + current.subtotal),
                                            0
                                        )}
                                        data={metodo_pago}
                                        onSubmit={onNextPage}
                                        onClose={onClose}
                                        is_mixto={isMixto}
                                        onAddMetodo={() => setIsMixto(true)}
                                    />
                                </FormProvider>
                            </div>
                            <div className="cortes__edicion-pago__item">
                                <Auth className={""} visible={auth} onLoading={() => null} onAuthConfirm={onSubmit} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <MetodosEmpty tipo={movimiento.tipo_pago} total={movimiento.total} onClose={onClose} />
                )
            ) : (
                <Skeleton tipo={movimiento.tipo_pago} total={movimiento.total} onClose={onClose} />
            )}
            <LoaderComponent visible={loader} />
        </Modal>
    )
}

export default EditarMetodoPago
