import { useEffect, useRef, useState } from "react"
import { useForm, FormProvider, Controller } from "react-hook-form"
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom"
import {
    TiposPagos,
    useGetOrdenesPagosPendientesQuery,
    useGetRentaForPagosPendientesQuery,
    usePagarOrdenesMutation,
} from "src/gql/schema"
import Screen from "src/shared/components/layout/screen/Screen"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { PAYMENT_METHODS } from "src/constants/payments"
import TipSection from "src/shared/sections/payment/propina/form-section"
import Ticket, { TicketContent, TicketBlock } from "src/shared/sections/ticket/Ticket"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import useSnackbar from "src/shared/hooks/useSnackbar"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import { usePersonalList } from "src/shared/sections/payment/propina/input-personal/InputPersonal.hooks"
import { useProfile } from "src/shared/hooks/useProfile"
import { PaymentMethod, CardNumber, AbonarEasyRewards } from "./sections/Fields"
import { Table } from "./sections/Table"
import { getDetallesPago } from "src/shared/sections/payment/helpers/pagos"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { useTurnoActual } from "src/pages/home/room-detail/hooks/turnos"
import { TicketItems, Total, TicketPaymentMethods, SubTotal, TicketAbonarEasyRewards } from "./sections/Ticket"
import { getCurrencyFormat } from "src/utils/string"
import { usePago } from "./hooks/usePago"
import { useTable } from "./hooks/useTable"
import { useSort } from "./hooks/useSort"
import { defaultValues } from "./Pago.constants"
import { FormValues, ModalStatus, TabsPago } from "./Pago.type"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { useTotal } from "./hooks/useTotal"
import "./Pago.css"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { PAYMENT_TYPE_VALUES } from "../detalle-compra/DetalleCompra.constants"
import { useEstanciaFormatted } from "./hooks/useEstanciaFormatted"

const estados = ["cancelada", "devolucion"]
const estadosPago = ["cancelado", "finalizado", "pagado", "pagada"]

function PagoRoomService(): JSX.Element {
    const [loader, setLoader] = useState<boolean>(false)
    const [stateMixto, setStateMixto] = useState<ModalStatus>({ visible: false, edited: false })
    const [inputPersonal, setInputPersonal] = useState<{ extras: any[]; disbaled: boolean }>({
        extras: [],
        disbaled: false,
    })

    const navigate = useNavigate()
    const location = useLocation()
    const origen = location.state?.origen || "RoomService"
    const params = useParams()

    const renta_id = params?.renta_id && params?.renta_id !== "null" ? params?.renta_id : ""
    const orden_id = params?.orden_id || ""
    const [pagarOrdenes] = usePagarOrdenesMutation()

    const { data: res, loading: loadRenta } = useGetRentaForPagosPendientesQuery({
        variables: { renta_id },
        skip: !renta_id,
    })

    const { data: orden, loading: loadOrdenes } = useGetOrdenesPagosPendientesQuery({
        variables: { renta_id: renta_id || null, orden_id: orden_id ? [orden_id] : null },
    })
    const methods = useForm<FormValues>({ defaultValues })

    const { handleSubmit, control, setValue } = methods
    const { usuario_id, hotel_id, rolName } = useProfile()
    const turno = useTurnoActual()

    const [categoriaRS, setCategoriaRS] = useState<any[]>([])
    const [categoriaEstancia, setCategoriaEstancia] = useState<any[]>([])

    const [type, setType] = useState<TabsPago>("Estancia")

    const filteredTabs = [
        { label: "Estancia", path: "Estancia", number: categoriaEstancia.length || 0 },
        { label: "Room Service", path: "RoomService", number: categoriaRS.length || 0 },
    ].filter((tab) => tab.number > 0)

    const [checked, setChecked] = useState<boolean[]>([])
    const selectedOrdenes = type === "RoomService" ? categoriaRS?.filter((_, index) => checked[index]) : []
    const selectedEstancia = type === "Estancia" ? categoriaEstancia?.filter((_, index) => checked[index]) : []
    const formattedEstancia = useEstanciaFormatted(selectedEstancia)
    const selectedItems = [...selectedOrdenes, ...formattedEstancia]
    const prevSelectedItems = useRef("")
    const { data: personal } = usePersonalList({ type: type === "Estancia" ? "estancia" : "roomservice" })

    const { showSnackbar } = useSnackbar()
    const { showMiniSnackbar } = useMiniSnackbar()

    const { total } = useTotal({
        estancia: formattedEstancia,
        ordenes: selectedOrdenes,
        key: type,
    })

    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)

    const { rowsOrdenes, rowsEstancia } = useTable(categoriaRS, categoriaEstancia, type)

    const { orders: sortedOrders, categoryList } = useSort(type === "Estancia" ? formattedEstancia : selectedOrdenes)

    const extrasEstanciaId = formattedEstancia.flatMap((estancia) => estancia.extrasId || [])

    const pagoParcialLovePoints = selectedItems?.[0]?.easyrewards_id
        ? {
            pago: selectedItems[0].orden_id
                ? selectedItems[0].saldo_pendiente < selectedItems[0].total_con_iva
                    ? selectedItems[0].total_con_iva - selectedItems[0].saldo_pendiente
                    : 0
                : selectedItems[0].total < selectedItems[0].precio
                ? selectedItems[0].precio - selectedItems[0].total
                : 0,
            id: selectedItems[0].easyrewards_id, }
        : { pago: 0, id: "" }

    //Mostrar por defecto el usuario de valet(quien creo el pago pendiente) en el input "¿Quién atendió el servicio?"
    useEffect(() => {
        if (!personal || !res?.renta?.conceptos_pendientes) return
        const colaborador_id =
            res.renta.conceptos_pendientes.estancia_pendiente?.colaborador?.colaborador_id ||
            res.renta.conceptos_pendientes.extras_pendientes?.find((e) => e.colaborador)?.colaborador?.colaborador_id

        if (colaborador_id) {
            setValue("colaborador_id", colaborador_id)
        }
    }, [res, personal, setValue])

    //Guardar las ordenes con estados pendiente y en proceso en "categoriaRS"
    useEffect(() => {
        const ordenesFiltradas =
            orden?.ordenes?.filter(
                (i) => !estados.includes(i?.estado_orden || "") && !estadosPago.includes(i?.estado_pago || "")
            ) || []
        setCategoriaRS(ordenesFiltradas)
    }, [orden])

    useEffect(() => {
        const paymentType = methods.getValues("paymentType")
        if (selectedItems.length !== 1) {
            if (methods.getValues("paymentMethod") !== PAYMENT_METHODS.mixto.value) {
                methods.setValue("paymentType", PAYMENT_TYPE_VALUES.TOTAL)
                methods.setValue("paymentMethod", "")
                methods.setValue("extra", [])
            }
            return
        }

        const currentItem = selectedItems[0]
        const pagos = currentItem.detalle_pago_pre_cargado

        if (!pagos || pagos.length === 0 || type === "Estancia") {
            if (paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA) {
                methods.setValue("paymentType", PAYMENT_TYPE_VALUES.TOTAL)
                methods.setValue("paymentMethod", "")
                methods.setValue("extra", [])
            }
            return
        }

        if (pagos.length === 1) {
            const { subtotal, tipo_pago, numero_referencia, ultimos_digitos } = pagos[0]
            const tipoPagoLower = tipo_pago?.toLowerCase().trim()

            const metodoNormalizado = Object.values(PAYMENT_METHODS).find(
                (m) => m.label.toLowerCase() === tipoPagoLower || m.value.toLowerCase() === tipoPagoLower
            )?.value

            if (!metodoNormalizado) return
            methods.setValue("paymentType", PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA)
            methods.setValue("paymentMethod", metodoNormalizado)
            methods.setValue("extra", [
                {
                    amount: subtotal,
                    type: metodoNormalizado,
                    number: numero_referencia || ultimos_digitos || "",
                },
            ])
        } else {
            const extras = pagos.map(({ subtotal, tipo_pago, numero_referencia, ultimos_digitos }) => {
                const tipoPagoLower = tipo_pago?.toLowerCase().trim()
                const metodoNormalizado =
                    Object.values(PAYMENT_METHODS).find(
                        (m) => m.label.toLowerCase() === tipoPagoLower || m.value.toLowerCase() === tipoPagoLower
                    )?.value || "desconocido"

                return {
                    amount: subtotal,
                    type: metodoNormalizado,
                    number: numero_referencia || ultimos_digitos || "",
                }
            })

            methods.setValue("paymentType", PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA)
            methods.setValue("paymentMethod", PAYMENT_METHODS.mixto.value)
            methods.setValue("extra", extras)
        }
    }, [selectedItems, methods, total])

    // Actualiza los montos de detallesPago según el tab activo usando el campo total correspondiente
    useEffect(() => {
        const paymentMethod = methods.getValues("paymentMethod")
        const paymentType = methods.getValues("paymentType")

        if (selectedItems.length === 0) {
            methods.setValue("extra", [])
            prevSelectedItems.current = ""
            return
        }

        const currentIds = selectedItems.map((item) => item.orden_id || item.extra_id || item.folio || "").join(",")
        if (prevSelectedItems.current === currentIds) return
        if (paymentType === PAYMENT_TYPE_VALUES.DEPOSITO_GARANTIA) {
            prevSelectedItems.current = currentIds
            return
        }

        if (paymentMethod === PAYMENT_METHODS.mixto.value) {
            methods.setValue("extra", [])
            prevSelectedItems.current = currentIds
            return
        }

        const hasPreloadedPayments = selectedItems.some((item) => item.detalle_pago_pre_cargado?.length > 0)
        if (hasPreloadedPayments) {
            prevSelectedItems.current = currentIds
            return
        }
        const prevExtra = methods.getValues("extra")
        const updatedExtra = selectedItems.map((item, index) => ({
            amount: item.total || item.saldo_pendiente || 0,
            type: paymentMethod || "",
            number: prevExtra?.[index]?.number || "",
        }))

        methods.setValue("extra", updatedExtra)
        prevSelectedItems.current = currentIds
    }, [selectedItems, methods])

    //Guardar los conceptos de renta (estancia, personas, hospedajes) como objetos en 'categoriaEstancia', ya filtrados
    useEffect(() => {
        if (res?.renta) {
            const conceptosPendientes = res?.renta.conceptos_pendientes
            const conceptosEstancia = conceptosPendientes?.estancia_pendiente
                ? [conceptosPendientes.estancia_pendiente]
                : [] //Estancia
            const conceptosExtras = conceptosPendientes?.extras_pendientes || [] //Extras(Personas, hospedajes)
            const todosLosConceptos = [...conceptosEstancia, ...conceptosExtras]
            if (todosLosConceptos.length > 0) {
                setCategoriaEstancia(todosLosConceptos)
            }
        }
    }, [res?.renta])

    //Actualizar el tipo de tab a 'RoomService' si no hay categorías de 'Estancia'
    useEffect(() => {
        if (categoriaEstancia.length > 0) {
            setType("Estancia")
        } else if (categoriaRS.length > 0) {
            setType("RoomService")
        }
    }, [categoriaEstancia.length, categoriaRS.length])

    //Activar selección única en RS o Estancia, múltiple en otras pestañas
    useEffect(() => {
        if (type === "RoomService" || type === "Estancia") {
            const totalItems = type === "RoomService" ? categoriaRS : categoriaEstancia
            const position = 0
            setChecked(totalItems.map((_, index) => index === position))
            handleInputPersonal(position)
        } else {
            setChecked(new Array(categoriaEstancia.length).fill(true))
            setInputPersonal({
                extras: [],
                disbaled: false,
            })
        }
    }, [type, categoriaEstancia.length, categoriaRS.length])

    usePago(methods, total)

    //Actualizar saldo de LovePoints al seleccionar orden o estancia
    useEffect(() => {
        if (selectedOrdenes.length > 0 || formattedEstancia.length > 0) {
            const easyRewardsId = selectedOrdenes[0]?.easyrewards_id || formattedEstancia[0]?.easyrewards_id
            if (easyRewardsId && (!lovePointsAmount || lovePointsAmount.id !== easyRewardsId)) {
                setLovePointsAmount({
                    id: easyRewardsId,
                    saldo: lovePointsAmount?.saldo ?? 0,
                })
            }
        }
    }, [selectedOrdenes, formattedEstancia, lovePointsAmount])

    useEffect(() => {
        setLovePointsAmount(null)
    }, [methods.getValues("paymentMethod")])

    //Mostrar showSnackbar desde almacenamiento local
    useEffect(() => {
        const data = localStorage.getItem("pagoExitoso")
        if (data) {
            const { total } = JSON.parse(data)
            showSnackbar({
                status: "success",
                title: "Pago registrado",
                text: `Se registró un pago por **${getCurrencyFormat(total)}**`,
            })
            localStorage.removeItem("pagoExitoso")
        }
    }, [])

    const handleError = (text?: string) => {
        showSnackbar({
            status: "error",
            title: "Error al registrar pago",
            text: text || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
        })
    }

    // Selección de elemento de la tabla, se puede seleccionar solo uno o deseleccionar
    const handleSelectionChange = (index: number) => {
        if (type === "RoomService" || type === "Estancia") {
            setChecked((prev) => {
                if (prev[index]) {
                    return prev.map(() => false)
                } else {
                    return prev.map((_, i) => i === index)
                }
            })
            handleInputPersonal(index)
        } else {
            setChecked((prev) => {
                const updated = [...prev]
                updated[index] = !updated[index]
                return updated
            })
        }
    }

    const handleInputPersonal = (position: number) => {
        const element = categoriaRS?.[position]
        const colaborador_id = element?.colaborador_id || ""
        if (colaborador_id) {
            const find = personal.find((i) => i?.colaborador_id === colaborador_id)

            setInputPersonal({
                extras: !find && element?.colaborador_entrega ? [element?.colaborador_entrega] : [],
                disbaled: true,
            })
            methods.setValue("colaborador_id", colaborador_id)
        } else {
            setInputPersonal({
                extras: [],
                disbaled: false,
            })
            methods.setValue("colaborador_id", "")
        }
    }

    const onSubmit = (values: FormValues) => {
        if (
            values.paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value ||
            values.extra.some((v) => v.type === PAYMENT_METHODS.depositoOTransferencia.value)
        ) {
            setisAuthModalOpen(true)
            return
        }
        onConfirmSubmit(values)
    }

    const onConfirmSubmit = (values: FormValues) => {
        const easyrewardsId = lovePointsAmount?.id

        const detallesPago = getDetallesPago(
            values.extra.map((extra) => ({
                ...extra,
                easyrewards_id: easyrewardsId,
            }))
        )
        const filterPropinas = values.propinas.filter((p) => p?.id && p?.value > 0)
        const totalPropinas = values.propinas.reduce((sum, p) => sum + (p?.value || 0), 0)
        const totalPagado = values.costs.general + totalPropinas

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

        if (
            categoriaEstancia.some((item) => item.detalle === "Estancia") &&
            !selectedEstancia.some((item) => item.detalle === "Estancia")
        ) {
            if (selectedOrdenes.length > 0) {
                handleError("No es posible realizar el pago de Room Service hasta que se haya pagado la estancia.")
                return
            }

            if (selectedEstancia.some((item) => item.detalle !== "Estancia")) {
                handleError("No es posible realizar el pago de Extras hasta que se haya pagado la estancia.")
                return
            }
        }

        if (selectedItems.length === 0) {
            handleError("Debes seleccionar al menos una transaccion para continuar.")
            return
        }

        const pay_orden_input = {
            orden_id: selectedOrdenes.length > 0 ? selectedOrdenes.map(({ orden_id }) => orden_id) : [],
            pago: {
                detallesPago,
                total,
                hotel_id,
                usuario_id,
            },
            extra_id: extrasEstanciaId ? extrasEstanciaId : [],
            renta_id: renta_id || null,
            usuario_id,
            colaborador_id: values.colaborador_id,
            ...(filterPropinas.length > 0 &&
            values.paymentMethod !== TiposPagos.Cortesia &&
            values.paymentMethod !== TiposPagos.ConsumoInterno
                ? objPropinas
                : {}),
        }

        setLoader(true)

        pagarOrdenes({ variables: { pay_orden_input } })
            .then(({ data: res }) => {
                if (res) {
                    if (origen === "ModalPendiente") {
                        if (
                            categoriaRS.length === selectedOrdenes.length &&
                            categoriaEstancia.length === formattedEstancia.length
                        ) {
                            showSnackbar({
                                status: "success",
                                title: "Pago registrado",
                                text: `Se registró un pago por **${getCurrencyFormat(totalPagado)}**`,
                            })
                            navigate(`/u/detalle-habitacion/checkout/${location.state?.habitacionId}`, {
                                state: { origen: "pagoPendiente" },
                            })
                        } else {
                            navigate(0)
                            localStorage.setItem(
                                "pagoExitoso",
                                JSON.stringify({
                                    total: totalPagado,
                                })
                            )
                        }
                    } else {
                        navigate(-1)
                        showMiniSnackbar({
                            status: "success",
                            title: "Pago registrado",
                            text: `Se registró un pago por **${getCurrencyFormat(totalPagado)}**`,
                        })
                    }
                } else {
                    handleError()
                }
            })
            .catch(() => {
                handleError()
            })

            .finally(() => setLoader(false))
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal } = useAuth({
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

    return !loadRenta && !loadOrdenes ? (
        renta_id || orden_id ? (
            <Screen
                className={"rs-pago-screen-l"}
                title={`Pagos pendientes ${
                    res?.renta
                        ? `${res?.renta?.habitacion?.tipo_habitacion?.nombre} ${res?.renta?.habitacion?.numero_habitacion}`
                        : ""
                }`}
                contentClassName={"rs-pago__content"}
                close
            >
                <FormProvider {...methods}>
                    <form className="rs-pago__form" onSubmit={handleSubmit(onSubmit)}>
                        <section className="rs-pago__left">
                            <div className="rs-pago__section">
                                <TabMenu
                                    value={type}
                                    onChange={(value) => {
                                        setType(value as TabsPago)
                                        methods.reset({
                                            colaborador_id: "",
                                            costs: { general: total, total, payment: 0 },
                                            extra: [],
                                            paymentMethod: "",
                                            propinas: [],
                                        })
                                    }}
                                    tabList={filteredTabs}
                                    style={{ margin: "20px 0" }}
                                />
                            </div>
                            <div className="rs-pago__section">
                                <div className="rs-pago__section-head">{"Conceptos"}</div>
                                <Table
                                    data={type === "Estancia" && rolName !== RoleNames.roomService ? rowsEstancia : rowsOrdenes}
                                    checked={checked}
                                    onSelectionChange={handleSelectionChange}
                                />
                            </div>
                            <div className="rs-pago__section">
                                <div className="rs-pago__section-head">{"Pago"}</div>
                                <div className="rs-pago__inputs" style={{ margin: 0, marginTop: "16px" }}>
                                    <PaymentMethod state={stateMixto} onClick={setStateMixto} />
                                    <CardNumber />
                                    <AbonarEasyRewards
                                        setLovePointsAmount={setLovePointsAmount}
                                        lovePointsAmount={lovePointsAmount}
                                    />
                                </div>
                            </div>
                            <div className="rs-pago__section">
                                <div className="rs-pago__inputs__venta">
                                    <Controller
                                        rules={{ required: true }}
                                        control={control}
                                        name={"colaborador_id"}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <InputPersonal
                                                disabled={inputPersonal.disbaled}
                                                className="tip-form__drop"
                                                placement="top"
                                                customLabel="¿Quién atendió el servicio?"
                                                data={[...personal, ...inputPersonal.extras]}
                                                value={value}
                                                error={!!error}
                                                onChange={(e) => onChange(e)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <TipSection />
                        </section>
                        <section className="rs-pago__right">
                            <Ticket title={"Resumen"} className="rs-pago__ticket" btnLabel="Pagar">
                                <TicketContent clasName="rs-pago__ticket__content">
                                    <TicketBlock className="rs-pago__ticket__block">
                                        <TicketItems items={sortedOrders} />
                                        <TicketPaymentMethods
                                            onClick={() => setStateMixto({ visible: true, edited: true })}
                                            pagoParcial={pagoParcialLovePoints}
                                        />
                                        <TicketAbonarEasyRewards lovePointsAmount={lovePointsAmount} />
                                    </TicketBlock>
                                    <div className="rs-pago__ticket__currency">
                                        <SubTotal items={categoryList} pagoParcial={pagoParcialLovePoints} />
                                        <Total total={total} pagoParcial={pagoParcialLovePoints} />
                                    </div>
                                </TicketContent>
                            </Ticket>
                        </section>
                    </form>
                    <ModalMixto
                        paymentOptions={[
                            PAYMENT_METHODS.efectivo,
                            PAYMENT_METHODS.visaOMasterCard,
                            PAYMENT_METHODS.amex,
                            PAYMENT_METHODS.depositoOTransferencia,
                            PAYMENT_METHODS.cortesia, //Quitar este metodo cuando se pase a produccion
                        ]}
                        visible={stateMixto.visible}
                        edited={stateMixto.edited}
                        onClose={() => setStateMixto({ visible: false, edited: false })}
                    />
                </FormProvider>
                <LoaderComponent visible={loader} />
                {Modal}
            </Screen>
        ) : (
            <Navigate replace to={"/u/error"} />
        )
    ) : (
        <></>
    )
}

export default PagoRoomService
