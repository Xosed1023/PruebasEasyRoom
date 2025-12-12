import React, { useEffect, useState, useMemo } from "react"
import cx from "classnames"

import "./HospedajesExtra.css"
import { HospedajesExtraProps, FormValues } from "./HospedajesExtra.type"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import {
    TiposPagos,
    TiposAlojamientos,
    useAgregarNochesExtraMutation,
    useDescontarSaldoEasyrewardsMutation,
    useGetAreasQuery,
    useGetColaboradoresByAreasLazyQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useRoom } from "../../../hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useDispatch } from "react-redux"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import Counter from "src/shared/components/forms/counter/Counter"
import { addDays } from "src/shared/helpers/addDays"
import { add, minus, times } from "src/shared/helpers/calculator"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { valueIsCard } from "src/shared/helpers/valueIsCard"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import { Button } from "src/shared/components/forms"
import { useDate } from "src/shared/hooks/useDate"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { LovePointsSection } from "src/pages/room-service/detalle-compra/sections/Fields"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import TipSection from "src/shared/sections/payment/propina/form-section"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { defaultValues } from "src/pages/room-service/pago/Pago.constants"
import { usePrintTicket } from "src/shared/hooks/print"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import { getName } from "src/pages/propinas/home/helpers/name"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const HospedajesExtra = ({
    tipoAlojamiento,
    duracionEstancia,
    isShowing,
    onClose,
    endDate,
    numPersonas,
    numPersonasExtrasMax,
    costoPersonaExtra,
    costoHospedajeExtra,
    onConfirmed,
}: HospedajesExtraProps) => {
    const { addHours } = useDate()
    const methods = useForm<FormValues>({
        defaultValues: {
            ...defaultValues,
            abonarEasyRewards: "",
            numPersonas: 0,
            nochesExtra: tipoAlojamiento === TiposAlojamientos.Hotel ? 0 : duracionEstancia,
            cardNumber: "",
        },
    })
    const { control, handleSubmit } = methods
    const { handlePrint } = usePrintTicket()
    const nochesExtra = methods.watch("nochesExtra")
    const numPersonasField = methods.watch("numPersonas")
    const paymentMethod = methods.watch("paymentMethod")
    const extra = methods.watch("extra")
    const costoTotal = methods.watch("costs.general")
    const propinas = useWatch({ control, name: "propinas" })
    const [state, setState] = useState({ visible: false, edited: false })
    const [isSubmitLoading, setisSubmitLoading] = useState(false)
    const [errors, setErrors] = useState<string>("")
    const [total, setTotal] = useState<number>(costoHospedajeExtra)
    const [tipoPago, setTipoPago] = useState<string>("total")
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("")
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isInitialModalViewState, setIsInitialModalViewState] = useState(true)
    const { formatCustomDate } = useFormatDate()

    const { showSnackbar } = useSnackbar()
    const room = useRoom()
    const { hotel_id, usuario_id, rolName, colaborador } = useProfile()
    const [agregarNoches] = useAgregarNochesExtraMutation()
    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()
    const dispatch = useDispatch()
    const {data} = useGetAreasQuery({
        variables: {
            hotel_id
        }
    })
    const [getColaboradores, colaboradores] = useGetColaboradoresByAreasLazyQuery()

    useEffect(() => {
        const areasFilter = data?.areas.filter(a => ["Hospedaje", "Alimentos y Bebidas", "Recepción"].includes(a.nombre)).map(a => a.area_id) || []
        
        if (data?.areas.length) {
            getColaboradores({
                variables: {
                    area_id: areasFilter,
                },
            }).then(() => {
                if(colaborador?.colaborador_id) {
                    methods.setValue("colaborador_id", colaborador.colaborador_id)
                }
            })
        }
    }, [data])

    const total_propinas = useMemo(() => {
        if (tipoPago !== "total") return 0
        if (!Array.isArray(propinas) || propinas.length === 0) return 0
        return propinas.reduce((acum, current) => acum + (current?.value || 0), 0)
    }, [propinas, tipoPago, total])

    useEffect(() => {
        methods.reset({
            ...methods.getValues(),
            extra: [],
            costs: {
                total: 0,
                general: 0,
                payment: 0,
            },
            paymentMethod: "",
            numPersonas: 0,
            cardNumber: "",
        })
    }, [nochesExtra])

    const [usersList, setUsersList] = useState<
        {
            value: string | number
            label: string | number
        }[]
    >([])

    useEffect(() => {
        let users = new Array(numPersonas + numPersonasExtrasMax).fill(0)
        users = users.map((_u, index) => {
            if (index < numPersonas) {
                return {
                    value: index + 1,
                    label: index + 1,
                }
            }
            return {
                label: `${index + 1} (+$${
                    tipoAlojamiento === TiposAlojamientos.Hotel
                        ? times(times(costoPersonaExtra, nochesExtra), index + 1 - numPersonas)
                        : times(costoPersonaExtra, index + 1 - numPersonas)
                })`,
                value: index + 1,
            }
        })
        setUsersList(users)
    }, [numPersonas, numPersonasExtrasMax, nochesExtra])

    useEffect(() => {
        methods.setValue(
            "costs.general",
            add(
                // Costo de hospedajes extra
                tipoAlojamiento === TiposAlojamientos.Hotel ? times(nochesExtra || 0, costoHospedajeExtra || 0) : total,
                // Costo de personas extra * hospedajes
                numPersonasField > numPersonas
                    ? tipoAlojamiento === TiposAlojamientos.Hotel
                        ? times(times(costoPersonaExtra, nochesExtra), numPersonasField - numPersonas)
                        : times(costoPersonaExtra, numPersonasField - numPersonas)
                    : 0
            )
        )
    }, [numPersonasField, nochesExtra])

    useEffect(() => {
        if (paymentMethod === PAYMENT_METHODS.mixto.value) {
            setIsInitialModalViewState(false)
            setState({ visible: true, edited: false })
        }
    }, [paymentMethod])

    const onSubmit = (values: FormValues) => {
        if (
            paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value ||
            values.extra.some((p) => p.type === PAYMENT_METHODS.depositoOTransferencia.value)
        ) {
            setisAuthModalOpen(true)
            return
        }
        onConfirmSubmit(values)
    }

    const onConfirmSubmit = (values: FormValues) => {
        if (isSubmitLoading) {
            return
        }

        if (nochesExtra || tipoAlojamiento !== TiposAlojamientos.Hotel) {
            if (numPersonasField) {
                if (tipoPago === "pendiente") {
                    addData(values)
                    return
                } else if (paymentMethod) {
                    if (
                        paymentMethod === PAYMENT_TYPES.VisaOMastercard ||
                        paymentMethod === PAYMENT_TYPES.amex ||
                        paymentMethod === PAYMENT_TYPES.DepositoOTransferencia
                    ) {
                        if (values.cardNumber) {
                            addData(values)
                        } else {
                            setErrors("num_tarjeta")
                        }
                        return
                    }
                    addData(values)
                } else {
                    setErrors("forma_pago")
                    console.log("error forma_pago")
                }
            } else {
                setErrors("num_personas")
                console.log("error num_personas")
            }
        } else {
            setErrors("noche_extra")
            console.log("error noche_extra")
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

    const addData = async (values: FormValues) => {
        setisSubmitLoading(true)
        const s = values.nochesExtra > 0 ? "s" : ""

        const easyrewardsIdSubmit = values.abonarEasyRewards
        const saldoDisponible = lovePointsAmount?.saldo || 0
        const lovePointsPayments = values.extra.filter((pago) => pago.type === "love_points")
        const totalLovePointsUsed = lovePointsPayments.reduce((acc, pago) => acc + pago.amount, 0)

        // Validar saldo
        if (lovePointsPayments.length > 0 && easyrewardsIdSubmit) {
            if (totalLovePointsUsed > saldoDisponible) {
                setModalMessage(
                    `Esta membresía <strong> ID ${easyrewardsIdSubmit} </strong>no tiene saldo suficiente para completar la transacción.<br>
                 Te recomendamos intentar nuevamente con otra forma de pago.<br>
                 Actualmente, el huésped cuenta con <strong> ${saldoDisponible} puntos</strong> en su cuenta.`
                )
                setIsModalVisible(true)
                setisSubmitLoading(false)
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
                    setisSubmitLoading(false)
                    return
                }
                if (disccountVerificationSuccess.message !== "El numero de transaccion no es valido") {
                    showSnackbar({
                        title: "Error desconocido",
                        text: "¡Ups! Se ha producido un error inesperado. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    setisSubmitLoading(false)
                    return
                }
            }
        }

        const detallesPago =
            values.paymentMethod === PAYMENT_TYPES.mixto
                ? values.extra.map((pago) => ({
                    tipo_pago: pago.type,
                    ...(pago.number ? { ultimos_digitos: pago.number } : {ultimos_digitos: null}),
                    subtotal: pago.amount,
                    easyrewards_id: values.abonarEasyRewards,
                }))
                : [
                    {
                        tipo_pago: values.paymentMethod as TiposPagos,
                        ...(values.cardNumber ? { ultimos_digitos: values.cardNumber } : {ultimos_digitos: null}),
                        subtotal: values.costs.general,
                        easyrewards_id: values.abonarEasyRewards,
                    },
                ]

        const filterPropinas = values.propinas.filter((p) => p?.id && p?.value > 0)
        const objPropinas = {
            propina: {
                detalles_pago: getPropinaList(detallesPago, filterPropinas),
            },
        }

        agregarNoches({
            variables: {
                datos_extra: {
                    colaborador_id: values.colaborador_id || "",
                    cantidad_hospedajes:
                        tipoAlojamiento === TiposAlojamientos.Hotel
                            ? values.nochesExtra
                            : values.nochesExtra / duracionEstancia,
                    hotel_id,
                    cantidad_personas:
                        minus(values.numPersonas, numPersonas) < 0 ? 0 : minus(values.numPersonas, numPersonas),
                    renta_id: room?.ultima_renta?.renta_id,
                    usuario_id,
                    ...(tipoPago === "total" && {
                        pago: {
                            detallesPago: detallesPago,
                            hotel_id,
                            total: values.costs.general,
                            usuario_id,
                        },
                    }),
                    ...(filterPropinas.length > 0 &&
                    values.paymentMethod !== TiposPagos.Cortesia &&
                    values.paymentMethod !== TiposPagos.ConsumoInterno
                        ? objPropinas
                        : {}),
                },
            },
            onCompleted: (data) => {
                if (data) {
                    //si no trae ticket id quiere decir que es pago pendiente y se manda extra_id
                    const { ticket_id, extra_id } = data.agregar_hospedajes_renta
                    const ticket = ticket_id || extra_id

                    const type = ticket_id !== null ? "0" : "5"
                    if (ticket) handlePrint(ticket, "custom", type)
                }
                showSnackbar({
                    title: `Noche${s} extra${s} agregada${s}`,
                    status: "success",
                    text: `Se registró un **pago por ${formatCurrency(values.costs.general + total_propinas)}**`,
                })
                onClose?.()
                onConfirmed?.()
                dispatch(toggleRoomDetailsDrawer(false))
                setisSubmitLoading(false)
            },
            onError: (data) => {
                showSnackbar({
                    title: "Error al agregar noche extra",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
                onClose?.()
                setisSubmitLoading(false)
            },
        })
    }

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal: AuthModal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente, RoleNames.superadmin]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    methods.handleSubmit(onConfirmSubmit)()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente, RoleNames.superadmin],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <Modal
            withCloseButton
            withBackButton={state.visible}
            onBack={() => {
                setState({ visible: false, edited: false })
                methods.setValue("paymentMethod", "")
                methods.setValue("extra", [])
            }}
            onClose={onClose}
            isOpen={isShowing}
            className="noches-extra__wrapper"
            width={700}
            height={"fit-content"}
            isCancelableOnClickOutside={false}
        >
            <FormProvider {...methods}>
                <form
                    className={cx(
                        "noches-extra__body__form",
                        isInitialModalViewState
                            ? ""
                            : state.visible
                            ? "hospedajes-extra__body-trigger--left"
                            : "hospedajes-extra__body-trigger--right"
                    )}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >
                    <ModalContent style={{ flex: "0 0 100%" }}>
                        <ModalRow className="noches-extra__header">
                            <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                                <Icon name="MoonFill" color="var(--deep-purple)" width={30} height={30} />
                            </IconBorder>
                            <p className="noches-extra__header__title">
                                {tipoAlojamiento === TiposAlojamientos.Hotel ? "Noches extra" : "Estancia"}
                            </p>
                            <p className="noches-extra__header__end-date">
                             Salida{" "}
                                {formatCustomDate(
                                    tipoAlojamiento === TiposAlojamientos.Hotel
                                        ? addDays({ date: endDate || new Date(), days: nochesExtra })
                                        : addHours(endDate || new Date(), duracionEstancia),
                                    "MMM, DD YYYY - h:mm A"
                                )}
                            </p>
                        </ModalRow>
                        <ModalBody>
                            {tipoAlojamiento === TiposAlojamientos.Hotel ? (
                                <Controller
                                    control={methods.control}
                                    name={"nochesExtra"}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <Counter
                                            onClick={(v) => {
                                                setErrors("")
                                                onChange(v)
                                                if (v.value !== "total") {
                                                    methods.setValue("propinas", [])
                                                }
                                            }}
                                            value={value}
                                        />
                                    )}
                                />
                            ) : (
                                <Controller
                                    control={methods.control}
                                    name={"nochesExtra"}
                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                        <Counter
                                            min={duracionEstancia}
                                            onClick={(v) => {
                                                setErrors("")
                                                onChange(v)
                                                setTotal(costoHospedajeExtra * (v / duracionEstancia))
                                                if (v.value !== "total") {
                                                    methods.setValue("propinas", [])
                                                }
                                            }}
                                            value={value}
                                            stepCount={duracionEstancia}
                                            counterText="horas"
                                        />
                                    )}
                                />
                            )}
                            {errors === "noche_extra" && (
                                <div className="counter__limit">*El número de noches extras es requerido</div>
                            )}
                            <p className="noches-extra__body-monto">
                                Monto: <span>{formatCurrency(costoTotal + total_propinas)}</span>
                            </p>
                            <Controller
                                control={methods.control}
                                name={"numPersonas"}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Dropdown
                                        disabled={!nochesExtra && tipoAlojamiento === TiposAlojamientos.Hotel}
                                        onClick={(v) => {
                                            setErrors("")
                                            onChange(v.value)
                                        }}
                                        value={value}
                                        label="No. de personas"
                                        className="noches-extra__body-pago"
                                        icon="UserParentFill"
                                        options={usersList}
                                        placeholder="Selecciona una opción"
                                        errorHintText={errors === "num_personas" ? "Selecciona una opción" : ""}
                                    />
                                )}
                            />
                            <Dropdown
                                disabled={!nochesExtra && tipoAlojamiento === TiposAlojamientos.Hotel}
                                onClick={(v) => {
                                    setTipoPago(v.value)
                                    if (v.value !== "total") {
                                        methods.setValue("propinas", [])
                                    }
                                }}
                                value={tipoPago}
                                label="Tipo de pago"
                                className="noches-extra__body-pago"
                                icon="creditCard"
                                options={
                                    rolName === RoleNames.valet
                                        ? [{ label: "Pendiente", value: "pendiente" }]
                                        : [
                                            { label: "Total", value: "total" },
                                            { label: "Pendiente", value: "pendiente" },
                                        ]
                                }
                                placeholder="Selecciona una opción"
                            />
                            {rolName !== RoleNames.valet && tipoPago === "total" && (
                                <div className="noches-extra__body-pago-total">
                                    <div
                                        className={
                                            paymentMethod === PAYMENT_METHODS.visaOMasterCard.value ||
                                            paymentMethod === PAYMENT_METHODS.amex.value ||
                                            paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value
                                                ? "pay-input-half-width"
                                                : "pay-input-full-width"
                                        }
                                    >
                                        <Controller
                                            control={methods.control}
                                            name={"paymentMethod"}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <Dropdown
                                                    disabled={
                                                        !nochesExtra && tipoAlojamiento === TiposAlojamientos.Hotel
                                                    }
                                                    onClick={(v) => {
                                                        setErrors("")
                                                        onChange(v.value)
                                                    }}
                                                    value={value}
                                                    label="Forma de pago"
                                                    className="noches-extra__body-pago"
                                                    icon="creditCard"
                                                    options={[
                                                        PAYMENT_METHODS.efectivo,
                                                        PAYMENT_METHODS.visaOMasterCard,
                                                        PAYMENT_METHODS.amex,
                                                        PAYMENT_METHODS.depositoOTransferencia,
                                                        PAYMENT_METHODS.mixto,
                                                        ...(rolName !== RoleNames.admin && rolName !== RoleNames.recepcionista && rolName !== RoleNames.superadmin
                                                            ? [PAYMENT_METHODS.lovePoints]
                                                            : []),
                                                        PAYMENT_METHODS.cortesia,
                                                        PAYMENT_METHODS.consumoInterno,
                                                    ]}
                                                    placeholder="Selecciona una opción"
                                                    errorHintText={
                                                        errors === "forma_pago" && tipoPago === "total"
                                                            ? "Selecciona una opción"
                                                            : ""
                                                    }
                                                />
                                            )}
                                        />
                                    </div>
                                    {valueIsCard(paymentMethod) && (
                                        <div
                                            className={
                                                paymentMethod === PAYMENT_METHODS.visaOMasterCard.value ||
                                                paymentMethod === PAYMENT_METHODS.amex.value ||
                                                paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value
                                                    ? "pay-input-half-width"
                                                    : "pay-input-full-width"
                                            }
                                        >
                                            <Controller
                                                control={methods.control}
                                                name={"cardNumber"}
                                                render={({ field, fieldState: { error } }) => (
                                                    <InputCardNumber
                                                        label={
                                                            paymentMethod ===
                                                            PAYMENT_METHODS.depositoOTransferencia.value
                                                                ? "Número de clabe o referencia"
                                                                : "Número de tarjeta o referencia"
                                                        }
                                                        placeholder={
                                                            paymentMethod ===
                                                            PAYMENT_METHODS.depositoOTransferencia.value
                                                                ? "Ingresa número"
                                                                : "Máximo 10 dígitos"
                                                        }
                                                        error={errors === "num_tarjeta"}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </div>
                                    )}
                                    {paymentMethod === PAYMENT_METHODS.lovePoints.value ? (
                                        <div className="noches-extra__body-love-points pay-input-half-width">
                                            <LovePointsSection
                                                setLovePointsAmount={setLovePointsAmount}
                                                isModalOpen={isModalOpen}
                                                setModalOpen={setIsModalOpen}
                                                lovePointsAmount={lovePointsAmount}
                                            />
                                        </div>
                                    ) : paymentMethod !== PAYMENT_METHODS.cortesia.value &&
                                      paymentMethod !== PAYMENT_METHODS.consumoInterno.value &&
                                    rolName !== RoleNames.admin &&
                                    rolName !== RoleNames.superadmin &&
                                    rolName !== RoleNames.recepcionista ? (
                                        <div
                                            className={
                                                paymentMethod === PAYMENT_METHODS.visaOMasterCard.value ||
                                                paymentMethod === PAYMENT_METHODS.amex.value ||
                                                paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value
                                                    ? "pay-input-full-width"
                                                    : "pay-input-half-width"
                                            }
                                        >
                                            <Controller
                                                control={methods.control}
                                                name={"abonarEasyRewards"}
                                                rules={{ maxLength: 5 }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <InputAbonarEasyRewards
                                                        value={lovePointsAmount?.id ?? value}
                                                        onChange={onChange}
                                                        error={!!error}
                                                        setLovePointsAmount={setLovePointsAmount}
                                                        lovePointsAmount={lovePointsAmount}
                                                    />
                                                )}
                                            />
                                        </div>
                                    ) : null}
                                    <Controller
                                        rules={{ required: true }}
                                        control={control}
                                        name={"colaborador_id"}
                                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                                            <InputPersonal
                                                disabled={false}
                                                className="tip-form__drop"
                                                placement="top"
                                                errorHintText="Elige al personal"
                                                customLabel="¿Quién atendió el servicio?"
                                                data={
                                                    colaboradores.data?.colaboradores_by_area.colaboradores.map((c) => ({
                                                        nombre: getName(c),
                                                        colaborador_id: c.colaborador_id,
                                                        foto: c?.foto || "",
                                                    })) || []
                                                }
                                                value={value}
                                                error={!!error}
                                                onChange={(e) => onChange(e)}
                                            />
                                        )}
                                    />
                                    {paymentMethod &&
                                        paymentMethod !== PAYMENT_METHODS.lovePoints.value &&
                                        paymentMethod !== PAYMENT_METHODS.cortesia.value &&
                                        paymentMethod !== PAYMENT_METHODS.consumoInterno.value && (
                                        <div className="pay-input-full-width hospedaje-extra-propinas">
                                            <TipSection label={"Incluir propina (opcional)"} modalExtra={true} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="noches-extra__footer__button"
                                text="Renovar estancia"
                                type="button"
                                onClick={() => {
                                    if (
                                        paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value ||
                                        extra.some((m) => m.type === PAYMENT_METHODS.depositoOTransferencia.value)
                                    ) {
                                        setisAuthModalOpen(true)
                                        return
                                    }
                                    handleSubmit(onSubmit)()
                                }}
                            />
                        </ModalFooter>
                    </ModalContent>
                    <ModalMixto
                        className={"modal__mixto-hospedajes-extra"}
                        isAlreadyInModal={true}
                        withCancelButton={false}
                        validateTotal={tipoPago === "total"}
                        paymentOptions={[
                            PAYMENT_METHODS.efectivo,
                            PAYMENT_METHODS.visaOMasterCard,
                            PAYMENT_METHODS.amex,
                            PAYMENT_METHODS.depositoOTransferencia,
                        ]}
                        visible={state.visible}
                        edited={state.edited}
                        onClose={() => setState({ visible: false, edited: false })}
                    />
                </form>
            </FormProvider>
            <LoaderComponent visible={isSubmitLoading} />
            <ModalLovePointsError
                isOpen={isModalVisible}
                setIsOpen={setIsModalVisible}
                description={modalMessage}
                onCloseDialog={() => setIsModalVisible(false)}
            />
            {AuthModal}
        </Modal>
    )
}

export default HospedajesExtra
