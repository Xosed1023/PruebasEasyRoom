import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form"
import {
    EstadosOrdenHistorial,
    TiposPagos,
    useCrearOrdenMutation,
    useAbonarSaldoEasyrewardsMutation,
    useDescontarSaldoEasyrewardsMutation,
    useGetEasyrewardsLazyQuery,
    ModalidadDePago,
} from "src/gql/schema"
import { minus, add, sum } from "src/shared/helpers/calculator"
import Screen from "src/shared/components/layout/screen/Screen"
import Ticket, { TicketContent, TicketBlock } from "src/shared/sections/ticket/Ticket"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import TypeOrdenModal from "./sections/modals/orden-type"
import CloseModal from "./sections/modals/CloseModal"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import useSnackbar from "src/shared/hooks/useSnackbar"
import EditAlertModal from "./sections/modals/edit-alert"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import { TicketCategory, Total, Subtotal, TicketPaymentMethods, TicketAbonarEasyRewards } from "./sections/Ticket"
import {
    AbonarEasyRewards,
    CardNumber,
    PaymentMethod,
    RoomSearch,
    PaymentType,
    Colaborador,
    ColaboradorConsumoInterno,
} from "./sections/Fields"
import { Table } from "./sections/Table"
import TipSection from "src/shared/sections/payment/propina/form-section"
import { ElementTicketSkeleton, TotalTicketSkeleton } from "../productos/sections/skeleton/TicketSkeleton"
import { useProfile } from "src/shared/hooks/useProfile"
import { useModulos } from "src/shared/hooks/useModulos"
import { getTax } from "src/shared/sections/payment/Payment.helpers"
import { getDetallesPago } from "src/shared/sections/payment/helpers/pagos"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { usePersonalList } from "src/shared/sections/payment/propina/input-personal/InputPersonal.hooks"
import { tiposPagosValidos, procesarMontos } from "src/pages/easyrewards/utils/AbonarEasyRewards"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import { useCompra, useCompraContext } from "./DetalleCompra.hooks"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { useRoomList } from "./hooks/useRoomList"
import { PAYMENT_METHODS } from "src/constants/payments"
import { typeList, defaultValues, PAYMENT_TYPE_VALUES, modalidadPagoMap } from "./DetalleCompra.constants"
import { DetalleCompraContentProps, FormValues, ModalStatus } from "./DetalleCompra.type"
import { usePrintTicket } from "src/shared/hooks/print"
import { getExtrasDetalle, removeItems } from "./DetalleCompra.helpers"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import "./DetalleCompra.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuthOnCortesiaSelect from "src/shared/hooks/useAuthOnCortesiaSelect"
import useAuthOnCortesiaFromMixtoSelect from "src/shared/hooks/useAuthOnCortesiaFromMixtoSelect"

function DetalleCompraContent({
    setLovePointsAmount,
    lovePointsAmount,
    loader,
}: DetalleCompraContentProps): JSX.Element {
    const navigate = useNavigate()
    const [ticketLoad, setTicketLoad] = useState<boolean>(true)
    const [typeOrden, setTypeOrden] = useState<boolean>(false)
    const [editModal, setEditModal] = useState<boolean>(false)
    const [load, setLoad] = useState<boolean>(false)
    const [stateMixto, setStateMixto] = useState<ModalStatus>({ visible: false, edited: false })

    const [crearOrden] = useCrearOrdenMutation()
    const [abonarSaldoEasyrewards] = useAbonarSaldoEasyrewardsMutation()

    const { fromRoomDetail, room, fromRestaurant, mesa, total } = useCompraContext()

    const { handlePrint } = usePrintTicket("snackbar-complete")

    const defaulValuesMostrador = {
        paymentMethod: PAYMENT_METHODS.efectivo.value,
        paymentType: "total",
        extra: [
            {
                number: "",
                amount: total,
                type: PAYMENT_METHODS.efectivo.value as TiposPagos,
            },
        ],
    }

    const defaulValuesHabitacion = {
        paymentMethod: "",
        paymentType: "pendiente",
        extra: [{ amount: total, type: PAYMENT_METHODS.pendiente.value as TiposPagos, number: "" }],
    }

    const methods = useForm<FormValues>({
        defaultValues: {
            ...defaultValues,
            type: !fromRoomDetail ? typeList[0].value : typeList[1].value,
            ...(defaultValues.type === typeList[0].value && !fromRoomDetail && !fromRestaurant
                ? defaulValuesMostrador
                : {}),
            ...(defaultValues.type === typeList[1].value || fromRoomDetail ? defaulValuesHabitacion : {}),
        },
    })

    const method = methods.watch("paymentMethod")
    const pagosList = methods.watch("extra")

    const { Modal: ModalAuthCortesia } = useAuthOnCortesiaSelect({
        setValue: (v) => methods.setValue("paymentMethod", v),
        tipoPago: method as TiposPagos,
    })

    const { Modal: ModalAuthCortesiaFromMixto } = useAuthOnCortesiaFromMixtoSelect({
        setValue: (v) => methods.setValue("extra", v),
        tipoPagoList: pagosList,
    })

    const { handleSubmit, control, getValues } = methods

    const { usuario_id, hotel_id } = useProfile()
    const { cocina: withCocina } = useModulos()
    const { easyRewards: withEasyrewards } = useModulos()

    const turno = useTurnoActual()
    const { data, dataConsumoInterno } = usePersonalList({ type: "roomservice" })

    useCompra(methods)

    const { occupiedRooms } = useRoomList()
    const { setOrdenMesa } = useRestaurantDarwer()

    const { showSnackbar } = useSnackbar()

    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()
    const rentaId = useWatch({ control, name: "renta" })

    const easyRewardsId = useMemo(() => {
        const currentRentaId = fromRoomDetail ? room?.rentaId : rentaId
        const selectedRoom = occupiedRooms.find((room) => room?.ultima_renta?.renta_id === currentRentaId)
        return selectedRoom?.ultima_renta?.pagos?.[0]?.detalles_pago?.[0]?.easyrewards_id ?? null
    }, [occupiedRooms, rentaId])

    const categoryList = methods.watch("categoryList") || []
    const totalGeneral = methods.watch("costs.total") || 0
    const extraPayments = methods.watch("extra") || []

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")

    const [getEasyrewards, { data: easyRewardsData }] = useGetEasyrewardsLazyQuery()

    const pagosValidos = extraPayments.reduce((total, payment) => {
        if (tiposPagosValidos.includes(payment.type as TiposPagos)) {
            return total + (payment.amount || 0)
        }
        return total
    }, 0)

    const totalPagosInvalidos = totalGeneral - pagosValidos

    //const productoComidaColaboradorId = "98703f3f-cf6d-43d6-863b-24a77b90ddb6"

    useEffect(() => {
        data.length > 0 && loader()
    }, [data])

    useEffect(() => {
        if (easyRewardsId) {
            getEasyrewards({ variables: { easyrewards_id: easyRewardsId } })
        }
    }, [easyRewardsId, getEasyrewards])

    useEffect(() => {
        if (
            (methods.getValues("type") === typeList[1].value && rentaId) ||
            (fromRoomDetail && easyRewardsId !== null)
        ) {
            if (easyRewardsId) {
                if (!lovePointsAmount || lovePointsAmount.id !== easyRewardsId) {
                    if (easyRewardsData && easyRewardsData.obten_saldo) {
                        setLovePointsAmount({
                            id: easyRewardsId,
                            saldo: easyRewardsData.obten_saldo.saldo || 0,
                        })
                    }
                }
            }
        }
    }, [easyRewardsId, lovePointsAmount, easyRewardsData])

    useEffect(() => {
        setLovePointsAmount(null)
    }, [methods.getValues("renta"), methods.getValues("type"), methods.getValues("paymentMethod"), extraPayments])

    useEscapeKey({
        onEscape: () => {
            if (stateMixto.visible) {
                return setStateMixto({ visible: false, edited: false })
            }
            navigate(-1)
        },
    })

    useEffect(() => {
        setTimeout(() => {
            setTicketLoad(false)
        }, 500)
    }, [])

    const getProductList = (products: any[]) => {
        const list = products.map(({ id = "", cost = 0, number, comment = "", extras = [] }) => {
            const iva = getTax(cost)
            const item = {
                almacen_articulo_id: id?.split("__")?.at(0),
                costo_con_iva: cost,
                costo_sin_iva: minus(cost, iva),
                monto_iva: iva,
                comentarios: comment || null,
                extra_detalle_orden: getExtrasDetalle(extras),
            }
            if (number > 1) {
                const repeatList: any[] = []
                for (let index = 0; index < number; index++) {
                    repeatList.push(item)
                }
                return repeatList
            } else {
                return [item]
            }
        })

        return list.flat(1)
    }

    const getGeneralIVA = (array: any[]) => {
        let iva = 0
        array.forEach(({ monto_iva = 0, extra_detalle_orden = [] }) => {
            iva += add(monto_iva, sum(extra_detalle_orden?.map((e) => e?.monto_iva * e?.cantidad)))
        })
        return { iva }
    }

    const getCategoryTotal = (categoryList: any[], categoryName: string) => {
        const category = categoryList.find((item) => item.nombre === categoryName)
        return category ? category.total : 0
    }

    const totalAlimentos = useMemo(() => getCategoryTotal(categoryList, "Alimentos"), [categoryList])
    const totalBebidas = useMemo(() => getCategoryTotal(categoryList, "Bebidas"), [categoryList])
    const totalSexAndSpa = useMemo(() => getCategoryTotal(categoryList, "Sex & Spa"), [categoryList])

    const { montoBebidas, montoAlimentos, montoSexAndSpa } = procesarMontos(
        pagosValidos,
        totalPagosInvalidos,
        totalBebidas,
        totalAlimentos,
        totalSexAndSpa
    )

    const disccountLovePoints = async (ticket_id: string, easyrewards_id: string, puntos_descontar: number) => {
        try {
            const response = await descontarSaldoEasyrewards({
                variables: {
                    easyrewards_id,
                    puntos_descontar,
                    folio_ticket: ticket_id,
                    hotel_id,
                },
            })

            const saldo = response.data?.descuenta_puntos?.saldo

            if (saldo !== undefined && saldo !== null) {
                return saldo
            }
            showSnackbar({
                title: "Error al descontar puntos",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
        } catch {
            showSnackbar({
                title: "Error al descontar puntos",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
        }
    }

    const disccountVerificationLovePoints = async (easyrewards_id: string) => {
        try {
            const response = await descontarSaldoEasyrewards({
                variables: {
                    easyrewards_id: easyrewards_id,
                    puntos_descontar: 1,
                    folio_ticket: "",
                    hotel_id,
                },
            })
            const saldo = response.data?.descuenta_puntos?.saldo
            return saldo !== undefined && saldo !== null
                ? { success: true, message: "" }
                : { success: false, message: "Error desconocido" }
        } catch (error: any) {
            const errorMessage =
                error?.graphQLErrors?.[0]?.message || typeof error.message === "string"
                    ? error.message.toLowerCase()
                    : ""

            const errorMessages = errorMessage.includes("el numero de transaccion no es valido")
                ? "El numero de transaccion no es valido"
                : errorMessage.includes("love points desactivados")
                ? "Love Points desactivados"
                : "Error desconocido"

            return { success: false, message: errorMessages }
        }
    }

    // auth para pago con transferencia
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.superadmin, RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    if (withCocina) {
                        const recetas =
                            Number(
                                methods.getValues().products.filter((p) => p?.type === "receta" && !p?.extra)?.length ||
                                    0
                            ) > 0
                        if (recetas || fromRestaurant) {
                            onCreateSubmit(methods.getValues(), "en_preparacion")
                        } else {
                            setTypeOrden(true)
                        }
                    } else {
                        onConfirmSubmit(methods.getValues())
                    }
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    const onSubmit = (values: FormValues) => {
        if (values.paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA) {
            onCreateSubmit(values, "entregada")
            return
        }

        if (extraPayments.some((m) => m.type === PAYMENT_METHODS.depositoOTransferencia.value)) {
            setisAuthModalOpen(true)
            return
        }
        if (withCocina) {
            const recetas = Number(values.products.filter((p) => p?.type === "receta" && !p?.extra)?.length || 0) > 0
            if (recetas || fromRestaurant) {
                onCreateSubmit(values, "en_preparacion")
            } else {
                setTypeOrden(true)
            }
        } else {
            onConfirmSubmit(values)
        }
    }

    const onConfirmSubmit = (values: FormValues) => {
        const formaDePago = values.paymentType

        onCreateSubmit(values, formaDePago === "pendiente" || formaDePago === "parcial" ? "en_entrega" : "entregada")
    }

    const onCreateSubmit = async (values: FormValues, estado_orden: string) => {
        if (load) {
            return
        }
        setLoad(true)

        const easyrewardsIdSubmit =
            lovePointsAmount?.id ?? values.extraAbonar?.[0]?.number ?? values.extra?.[0]?.number ?? ""
        const saldoDisponible = lovePointsAmount?.saldo || 0
        const lovePointsPayments = values.extra.filter((pago) => pago.type === "love_points")
        const totalLovePointsUsed = lovePointsPayments.reduce((acc, pago) => acc + pago.amount, 0)

        // Validar saldo
        if (lovePointsPayments.length > 0 && typeList && easyrewardsIdSubmit) {
            if (totalLovePointsUsed > saldoDisponible) {
                setModalMessage(
                    `Esta membresía <strong> ID ${easyrewardsIdSubmit} </strong>no tiene saldo suficiente para completar la transacción.<br>
                 Te recomendamos intentar nuevamente con otra forma de pago.<br>
                 Actualmente, el huésped cuenta con <strong> ${saldoDisponible} puntos</strong> en su cuenta.`
                )
                setIsModalVisible(true)
                setLoad(false)
                return
            }
            const disccountVerificationSuccess = await disccountVerificationLovePoints(easyrewardsIdSubmit)

            if (!disccountVerificationSuccess.success) {
                if (disccountVerificationSuccess.message === "Love Points desactivados") {
                    showSnackbar({
                        title: "Love Points desactivados",
                        text: "¡Ups! El huésped debe activar sus Love Points desde el portal.",
                        status: "error",
                    })
                    setLoad(false)
                    return
                }
                if (disccountVerificationSuccess.message !== "El numero de transaccion no es valido") {
                    showSnackbar({
                        title: "Error desconocido",
                        text: "¡Ups! Se ha producido un error inesperado. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    setLoad(false)
                    return
                }
            }
        }

        const detalles_orden = getProductList(values.products)
        const { iva } = getGeneralIVA(detalles_orden)
        const renta_id = fromRoomDetail ? room?.rentaId : values.renta || null

        if (values.paymentType === "parcial") {
            values.extra = values.extra.filter((p) => p.type === "love_points")
        }

        const detallesPago = getDetallesPago(
            values.extra.map((extra) => ({
                ...extra,
                easyrewards_id: easyrewardsIdSubmit,
            }))
        )
        if (values.paymentType === "pendiente" && easyrewardsIdSubmit) {
            detallesPago.forEach((detalle) => {
                detalle.easyrewards_id = easyrewardsIdSubmit
            })
        }
        const filterPropinas = values.propinas.filter((p) => p?.id && p?.value > 0)

        const objPropinas = {
            propina: {
                colaborador_id: values.colaborador_id,
                comentarios: "-",
                detalles_pago: getPropinaList(detallesPago, filterPropinas),
                hotel_id,
                usuario_id,
                turno_id: turno?.turno_id || "",
            },
        }

        const objPagos = {
            pago: {
                detallesPago,
                total:
                    values.paymentType === "parcial" && saldoDisponible < values.costs.general
                        ? saldoDisponible
                        : values.costs.general,
                hotel_id,
                usuario_id,
            },
        }
        const colaborador_id = fromRestaurant ? mesa?.colaborador_id : values.colaborador_id || null
        const colaborador_consumo_interno = values.consumo_interno_colaborador_id || null

        const modalidad_de_pago = modalidadPagoMap[values.paymentType] || ModalidadDePago.Total

        // Crear la orden
        const create_orden_input = {
            colaborador_id,
            corte_id: null,
            detalles_orden,
            hotel_id,
            monto_iva: iva,
            easyrewards_id:
                values.paymentType === "pendiente" || values.paymentType === "parcial" ? easyrewardsIdSubmit : null,
            modalidad_de_pago,
            ...((values.paymentType !== PAYMENT_TYPE_VALUES.PENDIENTE && !fromRestaurant) ||
            values.paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA
                ? objPagos
                : {}),

            ...(filterPropinas.length > 0 &&
            values.paymentMethod !== TiposPagos.Cortesia &&
            values.paymentMethod !== TiposPagos.ConsumoInterno
                ? objPropinas
                : {}),
            renta_id,
            mesa_id: fromRestaurant ? mesa?.mesa_id : null,
            total_con_iva: values.costs.general,
            total_sin_iva: minus(values.costs.general, iva),
            turno_id: turno?.turno_id || "",
            usuario_id,
            estado_orden: estado_orden as EstadosOrdenHistorial,
            consumo_interno_colaborador_id: colaborador_consumo_interno,
        }

        crearOrden({ variables: { create_orden_input } })
            .then(async ({ data }) => {
                const res = data?.crear_orden?.orden
                const ticket_id = res?.pago?.ticket_id
                const orden_id = res?.orden_id || ""
                const virtual_comanda_id = res?.virtual_comanda_id || ""
                const ticketIdLovePoints = values.paymentType === "parcial" && orden_id ? orden_id : ticket_id
                setLoad(false)

                if (orden_id) {
                    removeItems()
                    showSnackbar({
                        title: "Orden creada",
                        text: `La **orden ${res?.orden || ""}** se creó exitosamente.`,
                        status: "success",
                    })

                    // Redirigir al home o a restaurante, dependiendo de donde se origina
                    navigate(fromRestaurant ? "/u/restaurante-home" : !fromRoomDetail ? "/u/room-service-home" : "/u", {
                        replace: true,
                    })
                    if (ticket_id) {
                        handlePrint(ticket_id)
                    } else if (virtual_comanda_id) {
                        handlePrint(virtual_comanda_id, "custom", "3")
                    } else {
                        handlePrint(orden_id, "custom", "3")
                    }

                    if (fromRestaurant) setOrdenMesa(orden_id)

                    // Aplicar descuento de LovePoints
                    if (lovePointsPayments.length > 0 && easyrewardsIdSubmit) {
                        for (const pago of lovePointsPayments) {
                            if (ticketIdLovePoints) {
                                await disccountLovePoints(ticketIdLovePoints, easyrewardsIdSubmit, pago.amount)
                            }
                        }
                    }

                    // Abonar saldo
                    if (
                        withEasyrewards &&
                        ticket_id &&
                        easyrewardsIdSubmit &&
                        values.type === typeList[0].value &&
                        fromRoomDetail === false &&
                        (montoBebidas > 0 || montoAlimentos > 0 || montoSexAndSpa > 0)
                    ) {
                        const abonar = async () => {
                            try {
                                const { data } = await abonarSaldoEasyrewards({
                                    variables: {
                                        easyrewards_id: easyrewardsIdSubmit,
                                        hotel_id,
                                        folio_ticket: ticket_id,
                                        monto_alimentos: montoAlimentos,
                                        monto_bebidas: montoBebidas,
                                        monto_extras: 0,
                                        monto_habitacion: 0,
                                        monto_sexspa: montoSexAndSpa,
                                        origen: 0,
                                    },
                                })
                                if (data?.acumula_puntos?.saldo !== undefined && data?.acumula_puntos?.saldo !== null) {
                                    const montoAbono = (montoAlimentos + montoBebidas + montoSexAndSpa) * 0.05
                                    showSnackbar({
                                        status: "success",
                                        title: "Abono realizado con éxito",
                                        text: `Se abonaron <strong>${Math.round(
                                            montoAbono
                                        )} puntos</strong> al programa de lealtad <strong>ID ${easyrewardsIdSubmit}</strong>`,
                                    })
                                } else {
                                    showSnackbar({
                                        title: "Error al abonar puntos",
                                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                        status: "error",
                                    })
                                }
                            } catch {
                                showSnackbar({
                                    title: "Error al abonar puntos",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                    status: "error",
                                })
                            }
                        }
                        abonar()
                    }
                } else {
                    showSnackbar({ title: "Error al crear orden", status: "error" })
                }
            })
            .catch((e) => {
                console.error(e)
                setLoad(false)
                showSnackbar({ title: "Error al crear orden", status: "error" })
            })
    }

    return (
        <FormProvider {...methods}>
            <form className="detalle-compra__form" onSubmit={handleSubmit(onSubmit)}>
                <section className="detalle-compra__left">
                    {!fromRoomDetail && !fromRestaurant ? (
                        <div className="detalle-compra__section">
                            <div className="detalle-compra__section-head">{"Venta"}</div>
                            <div
                                className={
                                    fromRoomDetail ? "detalle-compra__inputs" : "detalle-compra__section-type-inputs"
                                }
                                style={{ margin: "16px 0 30px" }}
                            >
                                {!fromRoomDetail && (
                                    <Controller
                                        control={control}
                                        name={"type"}
                                        render={({ field: { value } }) => (
                                            <InputTabs
                                                containerClassName="detalle-compra__tabs"
                                                className="detalle-compra__tabs-content"
                                                label="Tipo"
                                                value={value}
                                                items={[
                                                    typeList[0],
                                                    {
                                                        ...typeList[1],
                                                        disabled: occupiedRooms.length === 0,
                                                    },
                                                ]}
                                                onChange={(value) => {
                                                    const values = methods.getValues()

                                                    methods.reset({
                                                        ...values,
                                                        costs: {
                                                            general: values.costs.general,
                                                            total: values.costs.general,
                                                            payment: 0,
                                                        },
                                                        propinas: [],
                                                        type: value,
                                                        renta: "",
                                                        ...(value === typeList[0].value
                                                            ? defaulValuesMostrador
                                                            : defaulValuesHabitacion),
                                                    })
                                                }}
                                            />
                                        )}
                                    />
                                )}
                                {!fromRoomDetail && (
                                    <RoomSearch
                                        rooms={
                                            occupiedRooms.map((room) => {
                                                return {
                                                    label: `${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}`,
                                                    value: room?.ultima_renta?.renta_id,
                                                }
                                            }) || []
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    ) : null}
                    <div
                        className={"detalle-compra__section"}
                        style={{ marginTop: fromRoomDetail ? 18 : 0, marginBottom: 40 }}
                    >
                        <div className="detalle-compra__section-head">{"Productos"}</div>
                        <Table editMode={false} isDetalleOrden={fromRestaurant} />
                    </div>
                    {!fromRestaurant ? (
                        <div className="detalle-compra__section">
                            <div className="detalle-compra__section-head">{"Pago"}</div>
                            <div
                                className="detalle-compra__inputs"
                                style={{ margin: 0, marginTop: "16px", rowGap: 20 }}
                            >
                                <PaymentType />
                                <PaymentMethod
                                    state={stateMixto}
                                    onClick={setStateMixto}
                                    setLovePointsAmount={setLovePointsAmount}
                                    lovePointsAmount={lovePointsAmount}
                                />
                                <CardNumber />
                                {withEasyrewards && (
                                    <AbonarEasyRewards
                                        setLovePointsAmount={setLovePointsAmount}
                                        lovePointsAmount={lovePointsAmount}
                                    />
                                )}
                                <ColaboradorConsumoInterno data={dataConsumoInterno} />
                                {/* Se removió el input para evitar que se duplique al elegir “Consumo interno” y “COMIDA COLABORADORES, el input se mostrará cada vez que se seleccione “Consumo interno”:
                                categoryList.some((categoria) =>
                                    categoria.products.some(
                                        (producto) => producto.id === productoComidaColaboradorId
                                    )
                                ) && <ColaboradorConsumoInterno data={dataConsumoInterno} />
                                */}
                                <Colaborador data={data} />
                            </div>
                        </div>
                    ) : null}
                    <TipSection />
                </section>
                <section>
                    <Ticket title={"Resumen"} className="detalle-compra__ticket" btnLabel={"Crear orden"}>
                        {!ticketLoad ? (
                            <TicketContent>
                                <TicketBlock className="detalle-compra__ticket__block">
                                    <TicketCategory />
                                    <TicketPaymentMethods
                                        onClick={() => setStateMixto({ visible: true, edited: true })}
                                    />
                                    {withEasyrewards && <TicketAbonarEasyRewards lovePointsAmount={lovePointsAmount} />}
                                </TicketBlock>
                                <div className="detalle-compra__ticket__currency">
                                    <Subtotal />
                                    <Total />
                                </div>
                            </TicketContent>
                        ) : (
                            <TicketContent>
                                <div className="element-ticket-skeleton-container">
                                    {[1, 2, 3, 4, 5, 6].map((index) => (
                                        <ElementTicketSkeleton key={index} />
                                    ))}
                                </div>
                                <div className="total-ticket-skeleton-container">
                                    {[1, 2, 3].map((index) => (
                                        <TotalTicketSkeleton key={index} />
                                    ))}
                                </div>
                            </TicketContent>
                        )}
                    </Ticket>
                </section>
            </form>
            <ModalMixto
                paymentOptions={[
                    PAYMENT_METHODS.efectivo,
                    PAYMENT_METHODS.visaOMasterCard,
                    PAYMENT_METHODS.amex,
                    PAYMENT_METHODS.depositoOTransferencia,
                    PAYMENT_METHODS.cortesia,
                    PAYMENT_METHODS.consumoInterno,
                ]}
                visible={stateMixto.visible}
                edited={stateMixto.edited}
                onClose={() => setStateMixto({ visible: false, edited: false })}
                onLovePointsChange={setLovePointsAmount}
            />
            <EditAlertModal
                visible={editModal}
                onClose={() => {
                    setEditModal(false)
                    navigate(-2)
                }}
            />
            <TypeOrdenModal
                isOpen={typeOrden}
                onClose={() => setTypeOrden(false)}
                onConfirm={(value) => {
                    setTypeOrden(false)
                    if (value === "entregada") {
                        onConfirmSubmit(getValues())
                    } else {
                        onCreateSubmit(getValues(), value)
                    }
                }}
            />
            <ModalLovePointsError
                isOpen={isModalVisible}
                setIsOpen={setIsModalVisible}
                description={modalMessage}
                onCloseDialog={() => setIsModalVisible(false)}
            />
            <LoaderComponent visible={load} />
            {Modal}
            {ModalAuthCortesia}
            {ModalAuthCortesiaFromMixto}
        </FormProvider>
    )
}

function DetalleCompra(): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const navigate = useNavigate()
    const { easyRewards: withEasyrewards } = useModulos()

    const { fromRoomDetail, fromRestaurant, room, mesa } = useCompraContext()
    const { occupiedRooms } = useRoomList()

    const easyRewardsId = useMemo(() => {
        const currentRoom = occupiedRooms?.find((r) => r.ultima_renta?.renta_id === room?.rentaId)
        return currentRoom?.ultima_renta?.pagos?.[0]?.detalles_pago?.[0]?.easyrewards_id ?? null
    }, [occupiedRooms, room])

    return (
        <Screen
            title={fromRestaurant ? `Detalle de orden - ${mesa?.nombre}` : `Detalle de compra`}
            className="detalle-compra"
            contentClassName={"detalle-compra__content"}
            back={true}
            close={true}
            onClose={() => setVisible(true)}
        >
            {fromRoomDetail && easyRewardsId !== null && withEasyrewards && (
                <div className="detalle-compra__content-subtitle">
                    <p>
                        <span>
                            ID EasyRewards: <strong>{easyRewardsId.toString().padStart(5, "0")}</strong>
                        </span>
                    </p>
                </div>
            )}
            <DetalleCompraContent
                setLovePointsAmount={setLovePointsAmount}
                lovePointsAmount={lovePointsAmount}
                loader={() => setIsLoading(false)}
            />
            <CloseModal
                visible={visible}
                editMode={false}
                onClose={() => setVisible(false)}
                onConfirm={() => {
                    removeItems()
                    navigate("/u", { replace: true })
                }}
            />
            <LoaderComponent visible={isLoading} />
        </Screen>
    )
}

export default DetalleCompra
