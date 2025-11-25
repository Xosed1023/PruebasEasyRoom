import { useEffect, useMemo, useState } from "react"
import { useForm, FormProvider, Controller, useWatch } from "react-hook-form"
import {
    EstadoMesa,
    TiposPagos,
    useActualizarMesaMutation,
    useAbonarSaldoEasyrewardsMutation,
    useDescontarSaldoEasyrewardsMutation,
    useGetAreaRestauranteLazyQuery,
    useGetEasyrewardsLazyQuery,
    useGetRestaurantAreaColaboradoresLazyQuery,
    useGetRestaurantOrdenQuery,
    usePagarOrdenesMutation,
} from "src/gql/schema"
import Ticket, { TicketContent, TicketBlock } from "src/shared/sections/ticket/Ticket"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import TipSection from "src/shared/sections/payment/propina/form-section"
import { useModulos } from "src/shared/hooks/useModulos"
import { useCompraContext } from "src/pages/room-service/detalle-compra/DetalleCompra.hooks"
import { TicketPaymentMethods } from "src/pages/room-service/detalle-compra/sections/Ticket"
import {
    ElementTicketSkeleton,
    TotalTicketSkeleton,
} from "src/pages/room-service/productos/sections/skeleton/TicketSkeleton"
import { ModalStatus } from "src/pages/venta-habitacion/VentaHabitacion.types"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { CerrarCuentaContentProps, FormValues } from "../index.type"
import { useMesa } from "src/pages/restaurante/detail/hooks/mesa"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { useProfile } from "src/shared/hooks/useProfile"
import { getName } from "src/pages/propinas/home/helpers/name"
import Icon from "src/shared/icons"
import { headers } from "../CerrarCuenta.constants"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { TicketAbonarEasyRewards } from "src/pages/room-service/pago/sections/Ticket"
import { defaultValues } from "src/pages/room-service/pago/Pago.constants"
import { AbonarEasyRewards, CardNumber, PaymentMethod } from "src/pages/room-service/pago/sections/Fields"
import { getDetallesPago } from "src/shared/sections/payment/helpers/pagos"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useNavigate } from "react-router-dom"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { sum } from "src/shared/helpers/calculator"
import {
    RestaurantPaymentMethodField,
    RestaurantPaymentTypeField,
} from "src/pages/restaurante/components/FieldsRestaurant/FieldsRestaurant"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuthOnCortesiaSelect from "src/shared/hooks/useAuthOnCortesiaSelect"
import useAuthOnCortesiaFromMixtoSelect from "src/shared/hooks/useAuthOnCortesiaFromMixtoSelect"

function CerrarCuentaContent({ loader }: CerrarCuentaContentProps): JSX.Element {
    const { asignacion_actual } = useMesa()

    const { hotel_id, usuario_id, rolName } = useProfile()
    const turno = useTurnoActual()
    const navigate = useNavigate()

    const mesa = useMesa()
    const [pasarSuciaMesa] = useActualizarMesaMutation()

    const [pagarOrdenes] = usePagarOrdenesMutation()
    const { showSnackbar } = useSnackbar()

    const [data, setData] = useState<any>([])
    const orden_id = asignacion_actual?.orden_id || ""

    const { data: orden } = useGetRestaurantOrdenQuery({
        variables: { orden_id, hotel_id },
        skip: !asignacion_actual?.orden_id,
    })

    const [ticketLoad, setTicketLoad] = useState<boolean>(true)
    const [stateMixto, setStateMixto] = useState<ModalStatus>({ visible: false, edited: false })

    const { fromRoomDetail } = useCompraContext()

    const methods = useForm<FormValues>({
        defaultValues: {
            ...defaultValues,
            colaborador_id: asignacion_actual?.colaborador_asignado_id || "",
            paymentType: rolName === RoleNames.restaurante ? PAYMENT_TYPES.pendiente : "",
        },
    })

    const method = methods.watch("paymentMethod")
    const pagosList = methods.watch("extra")
    
    const { Modal: ModalAuthCortesia } = useAuthOnCortesiaSelect({
        setValue: (v) => methods.setValue("paymentMethod", v),
        tipoPago: method as TiposPagos
    })
    
    const { Modal: ModalAuthCortesiaFromMixto } = useAuthOnCortesiaFromMixtoSelect({
        setValue: (v) => methods.setValue("extra", v),
        tipoPagoList: pagosList
    })

    const { handleSubmit, control, setValue } = methods
    const { onClose } = useRestaurantDarwer()

    const propinas = useWatch({ control, name: "propinas" })
    const paymentMethod = useWatch({ control, name: "paymentMethod" })

    const total_propinas = useMemo(() => propinas.reduce((acum, current) => (acum += (current?.value || 0)), 0), [propinas])
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const [getEasyrewards, { data: easyRewardsData }] = useGetEasyrewardsLazyQuery()
    const [abonarSaldoEasyrewards] = useAbonarSaldoEasyrewardsMutation()
    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState("")
    getEasyrewards
    const { easyRewards: withEasyrewards } = useModulos()

    const [areas] = useGetAreaRestauranteLazyQuery()
    const [colaboradores] = useGetRestaurantAreaColaboradoresLazyQuery()

    const [load, setLoad] = useState<boolean>(false)

    const totalPagadoLovePoints =
        orden?.orden?.pagos && orden.orden.pagos.length > 0
            ? sum(orden?.orden?.pagos?.flatMap((pago) => pago?.detalles_pago?.map((dp) => dp.subtotal) || []) || [])
            : 0
    const totalPagadoParcial =
        paymentMethod === PAYMENT_METHODS.lovePoints.value && lovePointsAmount?.saldo
            ? lovePointsAmount.saldo > (orden?.orden?.total_con_iva || 0)
                ? orden?.orden?.total_con_iva || 0
                : lovePointsAmount.saldo
            : 0
    const totalPagado =
        totalPagadoLovePoints > 0 ? totalPagadoLovePoints : totalPagadoParcial > 0 ? totalPagadoParcial : 0

    useEffect(() => {
        if (orden?.orden) {
            setValue("costs.general", (orden?.orden.total_con_iva || 0) - totalPagado)
            setValue("costs.total", (orden?.orden.total_con_iva || 0) - totalPagado)
        }
    }, [orden])

    useEffect(() => {
        areas({ variables: { hotel_id, nombre: "Alimentos y Bebidas" } })
            .then(({ data }) => {
                const area_id = data?.areas?.[0]?.area_id || ""
                if (area_id) {
                    colaboradores({ variables: { hotel_id, area_id } })
                        .then(({ data }) => {
                            if (data?.colaboradores) {
                                setData(
                                    data?.colaboradores.map((c) => {
                                        return {
                                            nombre: getName(c),
                                            colaborador_id: c.colaborador_id,
                                            foto: c?.foto || "",
                                        }
                                    })
                                )
                            }
                        })
                        .catch((e) => console.log(e))
                        .finally(() => loader(false))
                } else {
                    loader(false)
                }
            })
            .catch((e) => {
                console.log(e)
                loader(false)
            })
    }, [])

    useEffect(() => {
        setTimeout(() => {
            setTicketLoad(false)
        }, 500)
    }, [])

    useEffect(() => {
        if (!lovePointsAmount && lovePointsAmount !== null) {
            if (easyRewardsData && easyRewardsData.obten_saldo) {
                setLovePointsAmount({
                    id: lovePointsAmount,
                    saldo: easyRewardsData.obten_saldo.saldo || 0,
                })
            }
        }
    }, [lovePointsAmount, easyRewardsData])

    const rows = (() => {
        if (!orden?.orden || !orden.orden.comandas?.length) return []

        return orden.orden.comandas.map((comanda) => {
            const orderNumber = orden.orden.orden.split("-")[1]
            const folio = String(comanda.folio).padStart(3, "0")

            return {
                value: [
                    { value: `RS-${orderNumber}-${folio}` },
                    { value: comanda.detalles_orden?.map((item) => item.almacen_articulo?.articulo?.nombre || "N/A") },
                    {
                        value: comanda.detalles_orden?.map(
                            (item) => item.almacen_articulo?.articulo?.precio?.monto || 0
                        ),
                    },
                    { value: comanda.detalles_orden?.map((item) => item.cantidad || 0) },
                    { value: comanda.detalles_orden?.map((item) => item.monto_iva || 0) },
                    { value: comanda.detalles_orden?.map((item) => item.costo_con_iva || 0) },
                ],
            }
        })
    })()

    const totales = (() => {
        if (!orden?.orden || !orden.orden.comandas?.length) return []

        const totales = {
            "Total alimentos:": 0,
            "Total bebidas:": 0,
            "Total otros:": 0,
        }
        orden.orden.comandas.forEach((comanda) => {
            comanda.detalles_orden?.forEach((detalle) => {
                const categoria_articulo = detalle.almacen_articulo?.articulo?.categoria_articulo?.nombre
                const total = detalle.costo_con_iva
                if (categoria_articulo === "Alimentos") {
                    totales["Total alimentos:"] += total
                } else if (categoria_articulo === "Bebidas") {
                    totales["Total bebidas:"] += total
                } else {
                    totales["Total otros:"] += total
                }
            })
        })
        return Object.entries(totales).map(([name, total]) => ({ name, total }))
    })()

    const details = (value, index) => {
        return index === 1 || index === 3
            ? value
            : value.map((v) => {
                return formatCurrency(v)
            })
    }

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

    function calcularMontosAbonar(
        totalAlimentos: number,
        totalBebidas: number,
        totalSexspa: number,
        totalPagadoParcial: number
    ) {
        let restante = totalPagadoParcial
        let monto_alimentos = 0
        let monto_bebidas = 0
        let monto_sexspa = 0

        if (restante < totalAlimentos) {
            monto_alimentos = totalAlimentos - restante
            monto_bebidas = totalBebidas
            monto_sexspa = totalSexspa
        } else {
            restante -= totalAlimentos
            monto_alimentos = 0

            if (restante < totalBebidas) {
                monto_bebidas = totalBebidas - restante
                monto_sexspa = totalSexspa
            } else {
                restante -= totalBebidas
                monto_bebidas = 0

                if (restante < totalSexspa) {
                    monto_sexspa = totalSexspa - restante
                } else {
                    monto_sexspa = 0
                }
            }
        }

        return { monto_alimentos, monto_bebidas, monto_sexspa }
    }

    const onSubmit = (values: FormValues) => {
        if (
            values.paymentType === PAYMENT_METHODS.depositoOTransferencia.value ||
            values.extra.some((p) => p.type === PAYMENT_METHODS.depositoOTransferencia.value)
        ) {
            setisAuthModalOpen(true)
            return
        }
        onConfirmSubmit(values)
    }

    const onConfirmSubmit = async (values: FormValues) => {
        const easyrewardsId = lovePointsAmount?.id
        const easyrewardsIdSubmit =
            lovePointsAmount?.id ?? values.extraAbonar?.[0]?.number ?? values.extra?.[0]?.number ?? ""
        const saldoDisponible = values.paymentType === PAYMENT_METHODS.lovePoints.value || values.extra.some((p) => p.type === PAYMENT_METHODS.lovePoints.value) ? lovePointsAmount?.saldo || 0 : 0
        const lovePointsPayments = values.extra.filter((pago) => pago.type === "love_points")
        const totalLovePointsUsed = lovePointsPayments.reduce((acc, pago) => acc + pago.amount, 0)
        const pagoParcialConLovePoints =
            lovePointsPayments.length > 0 && saldoDisponible > 0 && saldoDisponible < values.costs.general
        const pagoTotal = pagoParcialConLovePoints ? saldoDisponible : values.costs.general

        if (values.paymentType === PAYMENT_TYPES.pendiente) {
            setDirty(false)
            return
        }

        // Validar saldo
        if (lovePointsPayments.length > 0 && easyrewardsIdSubmit) {
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

        let detallesPago = getDetallesPago(
            values.extra.map((extra) => ({
                ...extra,
                easyrewards_id: easyrewardsId,
            }))
        )
        if (saldoDisponible && saldoDisponible < values.costs.general) {
            const pagosParciales = values.extra.filter((extra) => extra.type === "love_points")
            detallesPago = getDetallesPago(
                pagosParciales.map((extra) => ({
                    ...extra,
                    easyrewards_id: easyrewardsId,
                }))
            )
        } else {
            detallesPago = getDetallesPago(
                values.extra.map((extra) => ({
                    ...extra,
                    easyrewards_id: easyrewardsId,
                }))
            )
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

        const pay_orden_input = {
            orden_id: [orden_id],
            pago: {
                detallesPago,
                total: pagoTotal,
                hotel_id,
                usuario_id,
            },
            extra_id: [],
            renta_id: null,
            mesa_id: mesa.mesa_id,
            usuario_id,
            colaborador_id: values.colaborador_id,
            ...(filterPropinas.length > 0 &&
            values.paymentMethod !== TiposPagos.Cortesia &&
            values.paymentMethod !== TiposPagos.ConsumoInterno
                ? objPropinas
                : {}),
        }

        loader(true)

        pagarOrdenes({ variables: { pay_orden_input } })
            .then(async ({ data: res }) => {
                const ticket_id = orden?.orden?.orden_id || ""
                if (res) {
                    if (lovePointsPayments.length > 0 && easyrewardsIdSubmit) {
                        for (const pago of lovePointsPayments) {
                            if (ticket_id) {
                                await disccountLovePoints(ticket_id, easyrewardsIdSubmit, pago.amount)
                            }
                        }
                        setDirty(pagoParcialConLovePoints)
                    } else if (
                        easyrewardsId &&
                        paymentMethod !== PAYMENT_METHODS.cortesia.value &&
                        paymentMethod !== PAYMENT_METHODS.consumoInterno.value
                    ) {
                        const totalAlimentos = totales.find((t) => t.name === "Total alimentos:")?.total || 0
                        const totalBebidas = totales.find((t) => t.name === "Total bebidas:")?.total || 0
                        const totalSexspa = totales.find((t) => t.name === "Total otros:")?.total || 0

                        const { monto_alimentos, monto_bebidas, monto_sexspa } = calcularMontosAbonar(
                            totalAlimentos,
                            totalBebidas,
                            totalSexspa,
                            totalPagadoParcial
                        )
                        await abonarSaldoEasyrewards({
                            variables: {
                                easyrewards_id: easyrewardsId,
                                hotel_id,
                                folio_ticket: ticket_id,
                                monto_alimentos: monto_alimentos,
                                monto_bebidas: monto_bebidas,
                                monto_extras: 0,
                                monto_habitacion: 0,
                                monto_sexspa: monto_sexspa,
                                origen: 1,
                            },
                        }).catch(() => undefined)
                        setDirty(false)
                    } else {
                        setDirty(false)
                    }
                } else {
                    console.log("error, ", res)
                    showSnackbar({
                        status: "error",
                        title: "Error al registrar pago",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                    loader(false)
                }
            })
            .catch((e) => {
                console.log(e?.message)
                showSnackbar({
                    status: "error",
                    title: "Error al registrar pago",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
                loader(false)
            })
    }

    const setDirty = (pagoParcialConLovePoints?: boolean) => {
        pasarSuciaMesa({
            variables: {
                updateMesaInput: {
                    mesa_id: mesa.mesa_id,
                    estado: pagoParcialConLovePoints ? EstadoMesa.EnServicio : EstadoMesa.Sucia,
                    usuario_modifico_id: usuario_id,
                },
            },
        })
            .then(() => {
                if (pagoParcialConLovePoints) {
                    showSnackbar({
                        title: "Pago parcial registrado",
                        status: "success",
                        text: `Se registró un pago con EasyRewards a la cuenta de **Mesa ${mesa.numero_mesa}** exitosamente.`,
                    })
                } else {
                    showSnackbar({
                        title: "Área cerrada",
                        status: "success",
                        text: `**Mesa ${mesa.numero_mesa}** se cerró exitosamente.`,
                    })
                }
                navigate(-1)
            })
            .catch((e) => {
                showSnackbar({
                    title: "Error al cerrar área",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                loader(false)
                onClose()
            })
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal: AuthModal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.superadmin, RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    methods.handleSubmit(onConfirmSubmit)()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [RoleNames.superadmin, RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <FormProvider {...methods}>
            <form className="cerrar-cuenta__form" onSubmit={handleSubmit(onSubmit)}>
                <section className="detalle-compra__left">
                    <div
                        className={"detalle-compra__section"}
                        style={{ marginTop: fromRoomDetail ? 18 : 0, marginBottom: 40 }}
                    >
                        <div className="detalle-compra__section-head" style={{ marginBottom: 30 }}>
                            {"Comandas"}
                        </div>
                        <FlexibleTable
                            className="cerrar_cuenta-table"
                            tableItems={{
                                ...{
                                    headers,
                                    rows: rows.map((row) => ({
                                        value: row.value.map(({ value }, index) => ({
                                            value:
                                                index === 0
                                                    ? value
                                                    : details(value, index).map((detail, i) => (
                                                        <div key={i}>{detail}</div>
                                                    )),
                                        })),
                                    })),
                                },
                            }}
                            emptyState={{
                                titile: "Sin resultados",
                                subTitle: "No hay resultados. Intenta de nuevo.",
                                headerIcon: "dollarCircle",
                            }}
                        ></FlexibleTable>
                    </div>
                    <div className="detalle-compra__section">
                        <div className="detalle-compra__section-head">{"Pago"}</div>
                        <div className="detalle-compra__inputs" style={{ margin: 0, marginTop: "16px" }}>
                            {rolName === RoleNames.restaurante ? (
                                <>
                                    <RestaurantPaymentTypeField
                                        setLovePointsAmount={setLovePointsAmount}
                                        lovePointsAmount={lovePointsAmount}
                                    />
                                    <RestaurantPaymentMethodField
                                        setLovePointsAmount={setLovePointsAmount}
                                        lovePointsAmount={lovePointsAmount}
                                    />
                                </>
                            ) : (
                                <PaymentMethod state={stateMixto} onClick={setStateMixto} />
                            )}

                            <CardNumber />
                            <AbonarEasyRewards
                                setLovePointsAmount={setLovePointsAmount}
                                lovePointsAmount={lovePointsAmount}
                            />
                        </div>
                    </div>
                    <Controller
                        rules={{ required: true }}
                        control={control}
                        name={"colaborador_id"}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <InputPersonal
                                style={{ maxWidth: "250px" }}
                                className="tip-form__drop"
                                placement="top"
                                data={data}
                                value={value}
                                error={!!error}
                                onChange={(e) => onChange(e)}
                                disabled={asignacion_actual?.colaborador_asignado_id}
                            />
                        )}
                    />
                    <TipSection />
                </section>
                <section>
                    <Ticket title={"Resumen"} className="cerrar-cuenta__ticket" btnLabel={"Pagar cuenta"}>
                        {!ticketLoad ? (
                            <TicketContent>
                                <TicketBlock className="cerrar_cuenta__ticket__block">
                                    {orden?.orden.comandas?.map((comanda, index) => (
                                        <div className="cerrar_cuenta__ticket__comanda" key={index}>
                                            <div className="cerrar_cuenta__ticket__info">
                                                <Icon name="draft" />
                                                <p className="cerrar_cuenta__ticket__info_text">{`RS-${
                                                    orden.orden.orden.split("-")[1]
                                                }-${String(comanda.folio).padStart(3, "0")}`}</p>
                                            </div>

                                            <p className="cerrar_cuenta__ticket__info_text">
                                                {formatCurrency(comanda?.total_comanda || 0)}
                                            </p>
                                        </div>
                                    ))}
                                    <TicketPaymentMethods
                                        onClick={() => setStateMixto({ visible: true, edited: true })}
                                        pagoLovePoints={totalPagadoLovePoints}
                                        lovePointsAmount={
                                            orden?.orden?.pagos
                                                ?.flatMap((pago) => pago?.detalles_pago ?? [])
                                                ?.find((detalle) => detalle?.easyrewards_id)?.easyrewards_id ?? ""
                                        }
                                    />
                                    {withEasyrewards && <TicketAbonarEasyRewards lovePointsAmount={lovePointsAmount} />}
                                </TicketBlock>
                                <div className="detalle-compra__ticket__currency">
                                    {totales.map((total, index) => (
                                        <div className="cerrar-cuenta__ticket_totals_container" key={index}>
                                            <p className="cerrar-cuenta__ticket_subtotal_text">{total.name}</p>
                                            <p className="cerrar-cuenta__ticket_subtotal_text">
                                                {formatCurrency(total.total || 0)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="cerrar-cuenta__ticket_totals_container">
                                        <p className="cerrar-cuenta__ticket_impuestos_text">Impuestos</p>
                                        <p className="cerrar-cuenta__ticket_impuestos_text">
                                            {formatCurrency(
                                                (orden?.orden.total_con_iva || 0) - (orden?.orden.total_sin_iva || 0)
                                            )}
                                        </p>
                                    </div>
                                    {total_propinas > 0 && (
                                        <div className="cerrar-cuenta__ticket_totals_container">
                                            <p className="cerrar-cuenta__ticket_subtotal_text">{"Propinas"}</p>
                                            <p className="cerrar-cuenta__ticket_subtotal_text">
                                                {formatCurrency(total_propinas)}
                                            </p>
                                        </div>
                                    )}
                                    {totalPagado > 0 && (
                                        <div className="cerrar-cuenta__ticket_totals_container">
                                            <p className="cerrar-cuenta__ticket_subtotal_text">{"Total Pagado"}</p>
                                            <p className="cerrar-cuenta__ticket_subtotal_text">
                                                -{formatCurrency(totalPagado)}
                                            </p>
                                        </div>
                                    )}
                                    <div className="cerrar-cuenta__ticket_total_container">
                                        <p className="cerrar-cuenta__ticket_total_text">
                                            {totalPagado > 0 ? "Por Pagar" : "Total"}
                                        </p>
                                        <p className="cerrar-cuenta__ticket_total_text">
                                            {formatCurrency(
                                                Number(orden?.orden.total_con_iva || 0) + total_propinas - totalPagado
                                            )}
                                        </p>
                                    </div>
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
                    PAYMENT_METHODS.cortesia,
                    PAYMENT_METHODS.consumoInterno,
                    PAYMENT_METHODS.depositoOTransferencia,
                ]}
                visible={stateMixto.visible}
                edited={stateMixto.edited}
                onClose={() => setStateMixto({ visible: false, edited: false })}
                onLovePointsChange={setLovePointsAmount}
            />
            <ModalLovePointsError
                isOpen={isModalVisible}
                setIsOpen={setIsModalVisible}
                description={modalMessage}
                onCloseDialog={() => setIsModalVisible(false)}
            />
            <LoaderComponent visible={load} />
            {AuthModal}
            {ModalAuthCortesia}
            {ModalAuthCortesiaFromMixto}
        </FormProvider>
    )
}

export default CerrarCuentaContent
