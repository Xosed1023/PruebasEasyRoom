import React, { useEffect, useState } from "react"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import { Modal } from "src/shared/components/layout/modal/Modal"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import Icon from "src/shared/icons"

import "./CancelarRenta.css"
import MultipleSelectDropdown, {
    Option,
} from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Button, TextBox } from "src/shared/components/forms"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { Controller, useForm } from "react-hook-form"
import { optionsWithOTA } from "../CancelarReserva/CancelarReserva.constants"
import {
    CancelOperationRentaItemInput,
    CancelRoomServiceRentaItemInput,
    RentaOrdenTransactionItemOutput,
    TiposExtras,
    useCancelarRentaHabitacionMutation,
    useTransacciones_RentaQuery,
    useValidar_Codigo_AutorizacionMutation,
} from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useRoom } from "../../hooks"
import { useDate } from "src/shared/hooks/useDate"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { formatExtra } from "./helpers"
import { sum } from "src/shared/helpers/calculator"
import { useProfile } from "src/shared/hooks/useProfile"
import { usePrintTicket } from "src/shared/hooks/print"
import { RoleNames } from "src/shared/hooks/useAuth"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import CancelarOrdenes from "./CancelarOrdenes"
import { getCurrencyFormat } from "src/utils/string"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

type TipoExtra = TiposExtras | "orden" | "orden_pendiente" | "todo" | "estancia"

export interface Cancel {
    motivoCancelacion: string
    descriptionMotivo?: string
    codigoVerificacion: string
    extras?: { extra_id: string; tipo_extra: TipoExtra }[]
    cancelar_estancia: boolean
    ordenes: CancelRoomServiceRentaItemInput[] | null
}

type operacionACancelarType = { extra_id: string; tipo_extra: TipoExtra }[]

interface DefaultValues<T> {
    operacionACancelar: T[]
    motivoCancelacion: string | "otro"
    codigoVerificacion?: string
    template_sample?: string
    descriptionMotivo: string
}

const defaultValues: DefaultValues<operacionACancelarType> = {
    operacionACancelar: [],
    motivoCancelacion: "",
    descriptionMotivo: "",
    codigoVerificacion: "",
    template_sample: "",
}

const CancelarRenta = ({
    isOpen,
    onConfirm,
    onClose,
}: {
    isOpen: boolean
    onConfirm: (v?: Cancel) => void
    onClose: () => void
}) => {
    const [showArticulos, setShowArticulos] = useState<boolean>(false)
    const [animation, setAnimation] = useState<boolean>(false)
    const [ordenes, setOrdenes] = useState<string[]>([])
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [disabledButton, setDisabledButton] = useState<boolean>(false)

    const { control, handleSubmit, watch, reset, setValue, trigger, getValues } = useForm({ defaultValues })
    const { showSnackbar } = useSnackbar()
    const { UTCStringToLocalDate } = useDate()
    const room = useRoom()
    const { usuario_id, rolName, hotel_id } = useProfile()
    const { handlePrint } = usePrintTicket()

    const { data: transacciones } = useTransacciones_RentaQuery({
        variables: { renta_id: room?.ultima_renta?.renta_id },
    })

    const [cancelationList, setcancelationList] = useState<Option<operacionACancelarType>[]>([])

    const [cancelarRenta] = useCancelarRentaHabitacionMutation()

    const [validateCode] = useValidar_Codigo_AutorizacionMutation()
    const { formatCustomDate } = useFormatDate()

    const motivoCancelacion = watch("motivoCancelacion")
    const operacionACancelar = watch("operacionACancelar")
    const template_sample = watch("template_sample")

    useEffect(() => {
        if (!template_sample) {
            return
        }
        setValue("codigoVerificacion", "")
        trigger("codigoVerificacion")
    }, [template_sample])

    useEffect(() => {
        if (template_sample) {
            onSubmit(getValues())
        }
    }, [template_sample])

    useEffect(() => {
        if (isOpen) {
            if (rolName === RoleNames.admin || rolName === RoleNames.superadmin) {
                return
            }
            return startAcquisition()
        }
        return () => {
            stopAcquisition()
        }
    }, [isOpen])

    useEffect(() => {
        if (!transacciones?.transacciones_renta) return

        const transaccionRenta = transacciones.transacciones_renta.renta
        const transaccionExtrasRenta = transacciones.transacciones_renta.transacciones_checkin
        const transaccionesExtras = transacciones.transacciones_renta.transacciones
        const transaccionOrdenes = transacciones.transacciones_renta.ordenes || []

        const estadoPagoRenta = transaccionRenta?.estado === "pendiente_pago" ? "(Pendiente de pago)" : "(Pagado)"
        let estadoPago = "(Pagado)"

        const estadoTransaccion = (corte: any, ticket: any) =>
            corte !== null ? (ticket === null ? "corte_pendiente" : "corte_cerrado") : "corte_abierto"

        const { ordenes_pagadas, ordenes_pendientes, folios_pendientes } = getOrdenes(transaccionOrdenes)

        const extrasCount: { tipo_extra: string; numero: number }[] = []
        ;[...(transaccionExtrasRenta || []), ...(transaccionesExtras || [])].forEach((transaccion) => {
            transaccion.extras?.forEach((extra) => {
                extrasCount.push({
                    tipo_extra: formatExtra({
                        tipo_extra: extra.tipo_extra,
                        tipo_hospedaje: room?.ultima_renta?.tarifa?.tipo_alojamiento,
                    }),
                    numero: extra.numero,
                })
            })
        })

        const ordenesCount = folios_pendientes.length
        const hasPendientes =
            (estadoPagoRenta.includes("Pendiente") || ordenesCount > 0) && transaccionRenta?.es_renta_cancelable

        const cancelacionTotal: Option<operacionACancelarType>[] = transaccionRenta?.es_renta_cancelable
            ? [
                {
                    value: [{ extra_id: "todo", tipo_extra: "todo" as TipoExtra }],
                    withCheckbox: true,
                    subtitle: `Pagos de estancia y pagos pendientes (estancia y room service)`,
                    label: `Cancelación total - ${formatCurrency(transaccionRenta?.montos_cancelacion?.total || 0)}`,
                    description: "",
                    showInLabelOnSelected: true,
                },
            ]
            : []

        const cancelacionEstancia: Option<operacionACancelarType>[] = hasPendientes
            ? [
                {
                    value: [{ extra_id: "estancia", tipo_extra: "estancia" as TipoExtra }],
                    withCheckbox: true,
                    subtitle: "Pago de Check-in y pagos pendientes (estancia y room service) ",
                    label: `Cancelación de estancia inicial - ${formatCurrency(
                        transaccionRenta?.montos_cancelacion?.parcial || 0
                    )}`,
                    description: "",
                    showInLabelOnSelected: true,
                },
            ]
            : []

        const extras: Option<operacionACancelarType>[] =
            transaccionesExtras?.map((transaction) => {
                const monto = sum(transaction.extras?.map((t) => t.total_con_propina) || [])
                const folio = transaction.ticket?.folio
                const estado = estadoTransaccion(transaction.extras?.[0]?.corte_id, transaction.ticket)
                estadoPago = folio ? "(Pagado)" : "(Pendiente de pago)"
                return {
                    value:
                        transaction.extras?.map((t) => ({ extra_id: t.extra_id, tipo_extra: t.tipo_extra, folio })) ||
                        [],
                    withCheckbox: true,
                    label: `Ticket${
                        folio
                            ? `: ${folio} - ${formatCurrency(monto)} ${estadoPago}`
                            : ` ${formatCurrency(monto)} ${estadoPago}`
                    }`,
                    subtitle: transaction.extras?.reduce(
                        (acc, cur, index) =>
                            `${acc}${index === 0 ? "" : ","} (${cur?.numero}) ${formatExtra({
                                tipo_extra: cur?.tipo_extra,
                                tipo_hospedaje: room?.ultima_renta?.tarifa?.tipo_alojamiento,
                            })}`,
                        ""
                    ),
                    description: `Fecha de venta: ${
                    transaction.ticket?.fecha_impresion
                        ? formatCustomDate(
                            UTCStringToLocalDate(transaction.ticket.fecha_impresion),
                            "DD/MMM/YY"
                        )
                        : "-"
                    }`,

                    available:
                        estado === "corte_abierto" ||
                        rolName === RoleNames.admin ||
                        (rolName === RoleNames.superadmin && estado === "corte_pendiente"),
                }
            }) || []

        const ordenes: Option<operacionACancelarType>[] = [...ordenes_pendientes, ...ordenes_pagadas].map((i) => {
            estadoPago = i?.ticket_id ? "(Pagado)" : "(Pendiente de pago)"
            const estado = estadoTransaccion(i?.orden?.corte_id, i?.ticket)
            return {
                value: [
                    {
                        extra_id: i?.orden_id,
                        tipo_extra: (i?.ticket_id ? "orden" : "orden_pendiente") as TipoExtra,
                        folio: i?.ticket?.folio,
                    },
                ],
                withCheckbox: true,
                label: `Room service ${
                    i?.ticket_id
                        ? `orden: ${i?.ticket?.folio} - ${getCurrencyFormat(
                            i?.orden?.total_con_iva || 0
                        )} ${estadoPago}`
                        : `${getCurrencyFormat(i?.orden?.total_con_iva || 0)} ${estadoPago}`
                }`,
                subtitle: i?.orden?.orden,
                description: `Fecha de venta: ${
                    i?.orden?.fecha_registro
                        ? formatCustomDate(UTCStringToLocalDate(i.orden.fecha_registro), "DD/MMM/YY")
                        : "-"
                }`,
                available:
                    estado === "corte_abierto" ||
                    rolName === RoleNames.admin ||
                    (rolName === RoleNames.superadmin && estado === "corte_pendiente"),
            }
        })

        setcancelationList([...cancelacionTotal, ...cancelacionEstancia, ...extras, ...ordenes])
    }, [transacciones])

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        if (!isOpen) {
            return
        }
        if (!motivoCancelacion || !operacionACancelar) {
            showSnackbar({
                status: "error",
                title: "Para continuar selecciona un motivo y operación a cancelar",
            })
            return
        }
        setValue("template_sample", JSON.parse(fingerprint.samples)[0]?.Data)
    }

    const { startAcquisition, stopAcquisition } = useFingerprint({
        client: "UareU",
        onAcquisition,
    })

    const getOrdenes = (ordenes: any[]) => {
        const ordenes_pagadas: RentaOrdenTransactionItemOutput[] = []
        const ordenes_pendientes: RentaOrdenTransactionItemOutput[] = []
        const folios_pendientes: string[] = []
        const ids_pendientes: any[] = []

        if (rolName === RoleNames.admin || rolName === RoleNames.superadmin) {
            ordenes.forEach((i) => {
                if (!i?.ticket?.ticket_id) {
                    ordenes_pendientes.push(i)
                    folios_pendientes.push(i?.orden?.orden || "")
                    ids_pendientes.push({ extra_id: i?.orden_id, tipo_extra: "orden_pendiente" as TipoExtra })
                } else {
                    ordenes_pagadas.push(i)
                }
            })
        }

        return {
            ordenes_pagadas,
            ordenes_pendientes,
            folios_pendientes,
            ids_pendientes,
        }
    }

    const onAfterSubmit = (v: DefaultValues<operacionACancelarType>) => {
        const orderList: string[] = []
        const array = v.operacionACancelar.flat(1)
        const findAll = array.find((i) => i?.tipo_extra === "todo")
        const findEstancia = array.find((i) => i?.tipo_extra === "estancia")

        const { ids_pendientes } = getOrdenes(transacciones?.transacciones_renta?.ordenes || [])
        const allExtras =
            transacciones?.transacciones_renta?.transacciones?.flatMap(
                (tr) => tr.extras?.map((e) => ({ extra_id: e.extra_id, tipo_extra: e.tipo_extra })) || []
            ) || []
        const allExtrasPendientes =
            transacciones?.transacciones_renta?.transacciones
                ?.filter((tr) => !tr.ticket)
                ?.flatMap(
                    (tr) =>
                        tr.extras?.map((e) => ({
                            extra_id: e.extra_id,
                            tipo_extra: e.tipo_extra,
                        })) || []
                ) || []

        let list: typeof array = []

        if (findAll) {
            list = [...allExtras, ...ids_pendientes]
        } else if (findEstancia) {
            list = [...allExtrasPendientes, ...ids_pendientes]
        } else {
            list = array
        }

        list.forEach(({ tipo_extra, extra_id }) => {
            if (tipo_extra.includes("orden")) orderList.push(extra_id)
        })

        if (orderList.length > 0) {
            setOrdenes(orderList)
            setShowArticulos(true)
            setAnimation(true)
            return
        }

        handleCancelarRenta(v, [])
    }

    const onSubmit = (v: DefaultValues<operacionACancelarType>) => {
        const authorizedRoles = [RoleNames.admin, RoleNames.superadmin]
        setDisabledButton(true)

        if (rolName === RoleNames.admin || rolName === RoleNames.superadmin) {
            onAfterSubmit(v)
            return
        }
        validateCode({
            variables: {
                codigo: v.codigoVerificacion || "",
                huella: v.template_sample || "",
            },
        }).then((resp) => {
            if (
                !authorizedRoles.find(
                    (r) => r === resp?.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre
                )
            ) {
                if (v.template_sample) {
                    return showSnackbar({
                        status: "error",
                        title: "Huella inválida",
                        text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
                    })
                }
                showSnackbar({ status: "error", title: "Código inválido", text: "Intente de nuevo" })
                return
            }
            handleCancelarRenta(v, [])
        })
    }

    const getOrdenesKeys = (ordenes: any[]) => {
        let ordenes_keys = ""
        ordenes.forEach(({ extra_id }, i) => {
            const find = transacciones?.transacciones_renta?.ordenes?.find((f) => f.orden_id === extra_id)
            if (find?.orden?.orden) {
                ordenes_keys += `Orden ${find?.orden?.orden}${
                    i !== ordenes.length - 1 ? ", " : i === ordenes.length - 2 ? " y " : ""
                }`
            }
        })
        return ordenes_keys
    }

    const handleCancelarRenta = (
        v: DefaultValues<operacionACancelarType>,
        ordenes: CancelRoomServiceRentaItemInput[]
    ) => {
        const isCancelarEstancia = v.operacionACancelar?.some((e) =>
            e.some((v) => v.tipo_extra === "todo" || v.tipo_extra === "estancia")
        )
        const array = v.operacionACancelar?.flat(1)
        const exclude = ["todo", "orden", "orden_pendiente", "estancia"]
        const filterExtras = array?.filter(
            (op) => op && !exclude.includes(op.tipo_extra)
        ) as CancelOperationRentaItemInput[]

        const extras = filterExtras.map(({ extra_id, tipo_extra }) => {
            return {
                extra_id,
                tipo_extra,
            }
        })

        if (!isCancelarEstancia) {
            cancelarRenta({
                variables: {
                    datos_cancelar: {
                        cancelar_renta: isCancelarEstancia,
                        motivo_cancelacion: v.motivoCancelacion === "otro" ? v.descriptionMotivo : v.motivoCancelacion,
                        renta_id: transacciones?.transacciones_renta?.renta?.renta_id || "",
                        hotel_id,
                        usuario_id,
                        extras,
                        ordenes: ordenes.length > 0 ? ordenes : null,
                    },
                },
            })
                .then((data) => {
                    const ticket_id = data.data?.cancelar_operaciones_renta.ticket_id
                    if (ticket_id) {
                        ticket_id.map((ticket) => {
                            handlePrint(ticket, "original")
                        })
                    }

                    const resObj = extras.reduce((acc, cur) => {
                        return acc[cur.tipo_extra]
                            ? { [cur.tipo_extra]: acc[cur.tipo_extra] + 1 }
                            : { ...acc, [cur.tipo_extra]: 1 }
                    }, {} as any)

                    const resText = Object.entries(resObj).reduce((acc, [key, value], index) => {
                        return `${acc} ${index === 0 ? "" : ", "}${value} ${formatExtra({
                            tipo_extra: key as TiposExtras,
                            tipo_hospedaje: room?.ultima_renta?.tarifa?.tipo_alojamiento,
                        })}`
                    }, "")

                    const ordenes_keys = getOrdenesKeys(v.operacionACancelar?.flat(1))

                    showSnackbar({
                        title: "Cancelación exitosa",
                        status: "success",
                        text: `**${resText}${ordenes_keys || ""}** fueron cancelados exitosamente.`,
                    })
                })
                .catch(() => {
                    showSnackbar({
                        title: "Cancelación exitosa",
                        status: "error",
                    })
                })
                .finally(() => {
                    onClose()
                    onConfirm()
                })
            return
        }

        onConfirm({
            motivoCancelacion: v.motivoCancelacion === "otro" ? v.descriptionMotivo : v.motivoCancelacion,
            codigoVerificacion: v?.codigoVerificacion || "",
            cancelar_estancia: isCancelarEstancia,
            extras,
            ordenes: ordenes.length > 0 ? ordenes : null,
        })
        onClose()
    }

    const handleSelectCancelOperation = (
        v: operacionACancelarType[],
        onChange: (valueToOnChange: operacionACancelarType[]) => void
    ) => {
        const value: operacionACancelarType[] = []
        const array = v.flat(1)
        const ids = array.map((i) => i.extra_id)
        const todoSelected = ids.find((item) => item === "todo" || item === "estancia") ? true : false

        const findItems = selectedIds.filter((id) => ids.includes(id))
        const findItem = findItems?.[0] || ""
        const find_id = findItems.length > 1 ? findItem : ""
        const selected_list = find_id ? ids.filter((id) => id !== find_id) : ids

        cancelationList.forEach((cl) => {
            if (cl.value.some((v) => selected_list.includes(v.extra_id))) {
                value.push(cl.value)
            }
        })

        if (findItem === "todo" || findItem === "estancia") {
            setcancelationList(
                cancelationList.map((item) => ({
                    ...item,
                    available: true,
                    checked: false,
                    showInLabelOnSelected: true,
                }))
            )
            onChange([])
            setSelectedIds([])
            return
        }

        if (todoSelected && array.some((i) => i.tipo_extra === "todo")) {
            const updatedCancelationList = cancelationList.map((item) => {
                if (item.value.some((v) => v.tipo_extra === "todo")) {
                    return { ...item, checked: true, showInLabelOnSelected: true }
                }
                if (item.value.some((v) => v.tipo_extra === "orden" && v?.["folio"])) {
                    return { ...item, available: false, checked: false, showInLabelOnSelected: false }
                }
                return {
                    ...item,
                    available: false,
                    checked: true,
                    showInLabelOnSelected: false,
                }
            })

            setcancelationList(updatedCancelationList)
            onChange(updatedCancelationList.filter((i) => i.checked).map((op) => op.value))
            setSelectedIds(selected_list)
            return
        }

        if (todoSelected && array.some((i) => i.tipo_extra === "estancia")) {
            const updatedCancelationList = cancelationList.map((item) => {
                if (item.value.some((v) => v.tipo_extra === "estancia")) {
                    return { ...item, checked: true, available: true, showInLabelOnSelected: true }
                }
                if (item.value.some((v) => v.tipo_extra === "todo")) {
                    return { ...item, checked: false, available: false, showInLabelOnSelected: false }
                }
                if (item.value.some((v) => v.tipo_extra && v?.["folio"])) {
                    return { ...item, checked: false, available: false, showInLabelOnSelected: false }
                }
                return { ...item, checked: true, available: false, showInLabelOnSelected: false }
            })

            setcancelationList(updatedCancelationList)
            onChange(updatedCancelationList.filter((i) => i.checked).map((op) => op.value))
            setSelectedIds(selected_list)
            return
        }
        setcancelationList(
            cancelationList.map((item) => ({ ...item, checked: false, available: true, showInLabelOnSelected: true }))
        )
        onChange(value)
        setSelectedIds(selected_list)
    }

    return (
        <Modal
            width={780}
            style={{ padding: "16px 0", boxSizing: "border-box", overflow: "hidden" }}
            isOpen={isOpen}
            onClose={() => {
                reset(defaultValues)
                onClose?.()
            }}
            isCancelableOnClickOutside={false}
            withCloseButton
        >
            <section className="modal__cancelar-renta__container">
                <div
                    className={`modal__cancelar-renta__wrapper${
                        !showArticulos
                            ? animation
                                ? " modal__cancelar-renta__transition--left"
                                : ""
                            : " modal__cancelar-renta__transition--right"
                    }`}
                >
                    <ModalContent
                        className="modal__cancelar-renta__slide"
                        isForm
                        formProps={{ onSubmit: handleSubmit(onSubmit) }}
                    >
                        <ModalRow>
                            <IconBorder primaryBgColor="var(--ocupada-card-1)" primaryBgDiameter={60}>
                                <Icon name="ExclamationFilled" color="var(--timer-ocupada)" width={30} height={30} />
                            </IconBorder>
                            <p className="modal__cancelar-renta__title">Cancelaciones</p>
                            <p className="modal__cancelar-renta__subtitle">{room?.nombre}</p>
                        </ModalRow>
                        <ModalBody
                            style={{ padding: "0 30px", boxSizing: "border-box" }}
                            styleContent={{ width: "100%" }}
                        >
                            <Controller
                                control={control}
                                name="operacionACancelar"
                                rules={{ required: true }}
                                render={({ field: { onChange, value }, fieldState: { error } }) => (
                                    <MultipleSelectDropdown<operacionACancelarType>
                                        className="modal__cancelar__input"
                                        containerClassName="modal__cancelar__operaciones"
                                        options={cancelationList}
                                        errorHintText={error ? "Selecciona una opción" : ""}
                                        icon="CloseCircle"
                                        onChange={(v) => handleSelectCancelOperation(v, onChange)}
                                        value={value}
                                        placeholder="Selecciona una opción"
                                        label="Operación a cancelar"
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name="motivoCancelacion"
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        className="modal__cancelar__input"
                                        errorHintText={error ? "Selecciouna una opción" : ""}
                                        options={optionsWithOTA}
                                        value={value}
                                        onClick={({ value }) => onChange(value)}
                                        icon="DocumentExcelFilled"
                                        placeholder="Selecciona una opción"
                                        label="Motivo de cancelación"
                                    />
                                )}
                            />
                            {motivoCancelacion === "Otro" && (
                                <Controller
                                    control={control}
                                    name="descriptionMotivo"
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <TextBox
                                            onChange={onChange}
                                            description="Descripción del motivo"
                                            placeholder="Escribe un motivo..."
                                            className="modal__cancelar__input-textarea"
                                            value={value}
                                            error={!!error}
                                            errorHintText={
                                                error?.type === "required" ? "Escribe el motivo de cancelación" : ""
                                            }
                                        />
                                    )}
                                />
                            )}
                            {rolName !== RoleNames.admin && rolName !== RoleNames.superadmin && (
                                <Controller
                                    control={control}
                                    name="codigoVerificacion"
                                    rules={{ required: !template_sample, minLength: 4 }}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <InputVerification
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e)
                                                setValue("template_sample", "")
                                            }}
                                            label="Código de autorización o huella dactilar"
                                            hintText={
                                                error
                                                    ? error.type === "minLength"
                                                        ? "Escribe el código completo"
                                                        : "Escribe el código"
                                                    : ""
                                            }
                                            className="modal__cancelar__input-veification"
                                        />
                                    )}
                                />
                            )}
                        </ModalBody>
                        <ModalFooter
                            style={{ padding: "0 30px", boxSizing: "border-box", borderTop: "1px solid #efefef" }}
                        >
                            <Button
                                disabled={disabledButton}
                                theme="primary"
                                type="submit"
                                text="Procesar cancelación"
                                className="modal__cancelar__button"
                            />
                        </ModalFooter>
                    </ModalContent>
                    <CancelarOrdenes
                        orders={transacciones?.transacciones_renta?.ordenes || []}
                        selected={ordenes}
                        onBack={() => setShowArticulos(false)}
                        onChange={(v) => handleCancelarRenta(getValues(), v)}
                    />
                </div>
            </section>
        </Modal>
    )
}

export default CancelarRenta
