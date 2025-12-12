/* eslint-disable indent */
import React, { useEffect, useState, useMemo } from "react"
import cx from "classnames"

import "./PersonasExtra.css"
import { PersonasExtraProps, FormValues } from "./PersonasExtra.type"
import { Modal as LayoutModal } from "src/shared/components/layout/modal/Modal"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Icon from "src/shared/icons"
import Counter from "src/shared/components/forms/counter/Counter"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { PrimaryButton } from "../../sections/elements/Elements"
import { InputText } from "src/shared/components/forms"
import { validateOnlyNumbers } from "src/shared/sections/payment/Payment.helpers"
import { useRoom } from "../../hooks"
import { useProfile } from "src/shared/hooks/useProfile"
import useSnackbar from "src/shared/hooks/useSnackbar"
import {
    TiposPagos,
    useAgregarPersonasExtraMutation,
    useGetAreasQuery,
    useGetColaboradoresByAreasLazyQuery,
    useDescontarSaldoEasyrewardsMutation,
} from "src/gql/schema"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import { useDate } from "src/shared/hooks/useDate"
import { times } from "src/shared/helpers/calculator"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import TipSection from "src/shared/sections/payment/propina/form-section"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { defaultValues } from "src/pages/room-service/pago/Pago.constants"
import { usePrintTicket } from "src/shared/hooks/print"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import { getName } from "src/pages/propinas/home/helpers/name"
import LovePointsInput from "src/pages/easyrewards/components/LovePointsInput/LovePointsInput"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"

const PersonasExtra = ({ onClose }: PersonasExtraProps) => {
    const methods = useForm<FormValues>({
        defaultValues: {
            ...defaultValues,
            abonarEasyRewards: "",
            personaExtra: 1,
            cardNumber: "",
        },
    })
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = methods

    const { handlePrint } = usePrintTicket()
    const paymentMethod = methods.watch("paymentMethod")
    const extra = methods.watch("extra")
    const personaExtra = methods.watch("personaExtra")
    const costoTotal = methods.watch("costs.general")
    const propinas = useWatch({ control, name: "propinas" })
    const { diffDays, setHHMMSS, UTCStringToLocalDate } = useDate()
    const room = useRoom()
    const { hotel_id, usuario_id, rolName, colaborador } = useProfile()
    const dispatch = useDispatch()

    const [costoExtra, setCostoExtra] = useState(room?.ultima_renta?.tarifa?.costo_persona_extra)
    const { showSnackbar } = useSnackbar()
    const [isSubmitLoading, setisSubmitLoading] = useState(false)
    const [tipoPago, setTipoPago] = useState<string>("total")
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const tipoPagoRoll = rolName === RoleNames.valet ? "pendiente" : tipoPago
    const personasExtraMax = room?.ultima_renta?.tarifa?.personas_extra_max - room?.ultima_renta?.personas_extra
    const [isInitialModalViewState, setIsInitialModalViewState] = useState(true)

    const [addPersonaExtra] = useAgregarPersonasExtraMutation()
    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()

    const [state, setState] = useState({ visible: false, edited: false })
    const [modalMessage, setModalMessage] = useState<string>("")
    const [isModalLovePointsErrorOpen, setModalLovePointsErrorOpen] = useState(false)
    const [lovePointsAmountGlobal, setLovePointsAmountGlobal] = useState<LovePoint | null>(null)

    const total_propinas = useMemo(() => {
        if (tipoPago !== "total") return 0
        if (!Array.isArray(propinas) || propinas.length === 0) return 0
        return propinas.reduce((acum, current) => acum + (current?.value || 0), 0)
    }, [propinas, tipoPago, costoExtra])

    useEffect(() => {
        methods.setValue("costs.general", costoExtra)
    }, [personaExtra, costoExtra])

    const { data } = useGetAreasQuery({
        variables: {
            hotel_id,
        },
    })
    const [getColaboradores, colaboradores] = useGetColaboradoresByAreasLazyQuery()

    useEffect(() => {
        const areasFilter =
            data?.areas
                .filter((a) => ["Hospedaje", "Alimentos y Bebidas", "Recepción"].includes(a.nombre))
                .map((a) => a.area_id) || []

        if (data?.areas.length) {
            getColaboradores({
                variables: {
                    area_id: areasFilter,
                },
            }).then(() => {
                if (colaborador?.colaborador_id) {
                    methods.setValue("colaborador_id", colaborador.colaborador_id)
                }
            })
        }
    }, [data])

    useEffect(() => {
        setCostoExtra(
            Math.abs(
                times(
                    times(1, room?.ultima_renta?.tarifa?.costo_persona_extra || 0),
                    diffDays(
                        setHHMMSS({
                            startDate: new Date(),
                            newHour: room?.ultima_renta?.tarifa?.hora_checkin,
                            isNewHourInUTC: true,
                        }),
                        UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada)
                    ) || 1
                )
            )
        )
    }, [])

    useEffect(() => {
        if (paymentMethod === PAYMENT_METHODS.mixto.value) {
            setIsInitialModalViewState(false)
            setState({ visible: true, edited: false })
        }
    }, [paymentMethod])

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                authorizedPins={[RoleNames.admin, RoleNames.gerente, RoleNames.superadmin]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    handleSubmit(onSubmit)()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [
            RoleNames.admin,
            RoleNames.recepcionista,
            RoleNames.valet,
            RoleNames.gerente,
            RoleNames.superadmin,
        ],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    /**funcion aplicar mutacion descuento de lovePoints */
    const disccountLovePoints = async (ticket_id: string, easyrewards_id: string, puntos_descontar: number) => {
        try {
            const response = await descontarSaldoEasyrewards({
                variables: {
                    easyrewards_id: easyrewards_id,
                    puntos_descontar: puntos_descontar,
                    folio_ticket: ticket_id,
                    hotel_id,
                },
            })

            if (
                response.data?.descuenta_puntos?.saldo !== undefined &&
                response.data?.descuenta_puntos?.saldo !== null
            ) {
                return response.data.descuenta_puntos.saldo
            } else {
                showSnackbar({
                    title: "Error al descontar puntos",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
                return null
            }
        } catch {
            showSnackbar({
                title: "Error al descontar puntos",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
            return null
        }
    }

    /**funcion para verificar si estan activos los puntos de lovePoints */
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

    const onSubmit = async (data: FormValues) => {
        const contadorPersonas = data.personaExtra
        if (!contadorPersonas || (!data.paymentMethod && tipoPago === "total") || isSubmitLoading) {
            return
        }
        setisSubmitLoading(true)

        const easyRewardsId = lovePointsAmount?.id

        // Verificar los pagos con LovePoints
        const lovePointsPayments = data.extra.filter((pago) => pago.type === "love_points")
        const totalLovePointsUsed = lovePointsPayments.reduce((acc, pago) => acc + pago.amount, 0)

        // Saldo y ID disponibles
        const saldoDisponible = lovePointsAmountGlobal?.saldo || lovePointsAmount?.saldo || 0
        const idMembresia = lovePointsAmountGlobal?.id || lovePointsAmount?.id || "N/A"

        // Validar si el saldo es suficiente
        if (lovePointsPayments.length > 0 && easyRewardsId) {
            if (totalLovePointsUsed > saldoDisponible) {
                setModalMessage(
                    `Esta membresía <strong>ID ${idMembresia} </strong> no tiene saldo suficiente para completar la transacción. <br>
                     Te recomendamos intentar nuevamente con otra forma de pago.<br>
                     Actualmente, el huésped cuenta con <strong> ${saldoDisponible} puntos </strong> en su cuenta.`
                )
                setModalLovePointsErrorOpen(true)
                setisSubmitLoading(false)
                return
            }

            const disccountVerificationSuccess = await disccountVerificationLovePoints(easyRewardsId)
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
            data.paymentMethod === PAYMENT_TYPES.mixto
                ? data.extra.map((pago) => ({
                      tipo_pago: pago.type,
                      ...(pago.number ? { ultimos_digitos: pago.number } : { ultimos_digitos: null }),
                      subtotal: pago.amount,
                      easyrewards_id: data.abonarEasyRewards || "",
                  }))
                : [
                      {
                          tipo_pago: data.paymentMethod as TiposPagos,
                          subtotal: costoExtra,
                          easyrewards_id: data.abonarEasyRewards || "",
                          ...(data.cardNumber ? { ultimos_digitos: data.cardNumber } : { ultimos_digitos: null }),
                      },
                  ]

        const filterPropinas = data.propinas.filter((p) => p?.id && p?.value > 0)
        const objPropinas = {
            propina: {
                detalles_pago: getPropinaList(detallesPago, filterPropinas),
            },
        }

        addPersonaExtra({
            variables: {
                datos_renta: {
                    colaborador_id: data.colaborador_id,
                    cantidad: contadorPersonas,
                    hotel_id,
                    renta_id: room?.ultima_renta?.renta_id,
                    usuario_id,
                    ...(tipoPagoRoll === "total" && {
                        pago: {
                            detallesPago: detallesPago,
                            hotel_id,
                            total: costoExtra,
                            usuario_id,
                        },
                    }),
                    ...(filterPropinas.length > 0 &&
                    data.paymentMethod !== TiposPagos.Cortesia &&
                    data.paymentMethod !== TiposPagos.ConsumoInterno
                        ? objPropinas
                        : {}),
                },
            },
            onCompleted: async (responseData) => {
                console.log("🚀 ~ onSubmit ~ responseData:", responseData)
                if (responseData) {
                    //si no trae ticket id quiere decir que es pago pendiente y se manda extra_id
                    const { ticket_id, extra_id } = responseData.agregar_personas_renta
                    const ticket = ticket_id || extra_id
                    // Descontar LovePoints si hay pagos con LovePoints
                    const hasLovePointsPm = data.extra.filter(
                        (pago: { type: TiposPagos }) => pago.type === TiposPagos.LovePoints
                    )

                    // Si el pago es LovePoints pero no mixto, usar lovePointsAmount
                    if (data.paymentMethod === TiposPagos.LovePoints && lovePointsAmount && hasLovePointsPm.length === 0) {
                        const folioToSend = ticket_id || extra_id || ""
                        const result = await disccountLovePoints(folioToSend, lovePointsAmount.id, costoExtra)

                        if (result === null) {
                            showSnackbar({
                                title: "Error al descontar puntos",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                            setisSubmitLoading(false)
                            return
                        }
                    } else if (hasLovePointsPm.length > 0) {
                        // Si es pago mixto con LovePoints
                        for (const pago of hasLovePointsPm) {
                            const folioToSend = ticket_id || extra_id || ""
                            const result = await disccountLovePoints(folioToSend, pago.number || "", pago.amount)

                            if (result === null) {
                                showSnackbar({
                                    title: "Error al descontar puntos",
                                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                    status: "error",
                                })
                                setisSubmitLoading(false)
                                return
                            }
                        }
                    }

                    const type = ticket_id !== null ? "0" : "5"
                    if (ticket) handlePrint(ticket, "custom", type)
                }
                showSnackbar({
                    title: "Persona extra agregada",
                    status: "success",
                    text: `Se han registrado **${contadorPersonas}** personas extras a la habitación **${room?.tipo_habitacion?.nombre} ${room?.numero_habitacion}**`,
                })
                onClose?.(responseData)
                setisSubmitLoading(false)
                dispatch(toggleRoomDetailsDrawer(false))
            },
            onError: (data) => {
                showSnackbar({
                    title: "Error al agregar personas extra",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
                onClose?.(data)
                setisSubmitLoading(false)
            },
        })
    }

    return (
        <LayoutModal
            height={"fit-content"}
            width={700}
            withCloseButton
            withBackButton={state.visible}
            isOpen={true}
            isCancelableOnClickOutside={false}
            onClose={() => onClose?.()}
            className="persona-extra-modal-container"
            onBack={() => {
                setState({ visible: false, edited: false })
                methods.setValue("paymentMethod", "")
                methods.setValue("extra", [])
            }}
        >
            <FormProvider {...methods}>
                <form
                    className={cx(
                        "modal__personas-extra__container",
                        isInitialModalViewState
                            ? ""
                            : state.visible
                            ? "persona-extra__body-trigger--left"
                            : "persona-extra__body-trigger--right"
                    )}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <ModalContent style={{ flex: "0 0 100%" }}>
                        <ModalRow>
                            <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                                <Icon
                                    name="UserParentFill"
                                    width={30}
                                    height={30}
                                    color="var(--purple-drawer-primario)"
                                />
                            </IconBorder>
                            <span className="modal__personas-extra__title">Agregar personas extras</span>
                        </ModalRow>
                        <ModalBody>
                            <Controller
                                control={methods.control}
                                name="personaExtra"
                                rules={{ required: true, min: 1 }}
                                defaultValue={1}
                                render={({ field: { value, onChange } }) => (
                                    <Counter
                                        min={1}
                                        //max={room?.ultima_renta?.tarifa?.personas_extra_max - room?.ultima_renta?.personas_extra}
                                        onClick={(value) => {
                                            const valorInicial = Math.max(value, 1)
                                            let costoExtra = times(
                                                valorInicial,
                                                room?.ultima_renta?.tarifa?.costo_persona_extra || 0
                                            )
                                            const todayWithCheckinHour = setHHMMSS({
                                                startDate: new Date(),
                                                newHour: room?.ultima_renta?.tarifa?.hora_checkin,
                                                isNewHourInUTC: true,
                                            })
                                            const nochesRenta =
                                                diffDays(
                                                    todayWithCheckinHour,
                                                    UTCStringToLocalDate(room?.ultima_renta?.fecha_condensada)
                                                ) || 1
                                            costoExtra = Math.abs(times(costoExtra, nochesRenta))
                                            setCostoExtra(costoExtra)
                                            onChange(valorInicial)
                                        }}
                                        disable={false}
                                        value={value}
                                        errorHintText={
                                            (errors.personaExtra ? "*El número de personas es requerido" : "") ||
                                            (personaExtra > personasExtraMax
                                                ? "Límite de personas extra superado, necesitarás PIN para vender"
                                                : "")
                                        }
                                    />
                                )}
                            />

                            <div className="modal__personas-extra__costos">
                                <span className="modal__personas-extra__label">Costo extra</span>
                                <span className="modal__personas-extra__value">${costoTotal + total_propinas}</span>
                            </div>
                            <Dropdown
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
                            {rolName !== RoleNames.valet && tipoPagoRoll === "total" && (
                                <div className="noches-extra__body-pago-total">
                                    <div
                                        className={
                                            paymentMethod === TiposPagos.VisaOMastercard ||
                                            paymentMethod === TiposPagos.Amex ||
                                            paymentMethod === TiposPagos.DepositoOTransferencia ||
                                            paymentMethod === PAYMENT_METHODS.lovePoints.value
                                                ? "pay-input-half-width"
                                                : "pay-input-full-width"
                                        }
                                    >
                                        <Controller
                                            name="paymentMethod"
                                            control={control}
                                            rules={{ required: tipoPago === "total" ? true : false }}
                                            render={({ field: { onChange, value } }) => (
                                                <Dropdown
                                                    icon="creditCard"
                                                    value={value}
                                                    options={[
                                                        PAYMENT_METHODS.efectivo,
                                                        PAYMENT_METHODS.visaOMasterCard,
                                                        PAYMENT_METHODS.amex,
                                                        PAYMENT_METHODS.depositoOTransferencia,
                                                        PAYMENT_METHODS.mixto,
                                                        PAYMENT_METHODS.cortesia,
                                                        PAYMENT_METHODS.consumoInterno,
                                                        PAYMENT_METHODS.lovePoints,
                                                        // no hay pago pendiente para madero
                                                        // { label: "Pago pendiente", value: "pendiente" },
                                                    ]}
                                                    placeholder="Selecciona el pago"
                                                    onClick={(data) => onChange(data.value)}
                                                    label={"Forma de pago"}
                                                    errorHintText={
                                                        errors.paymentMethod ? "Selecciona un método de pago" : ""
                                                    }
                                                />
                                            )}
                                        />
                                    </div>

                                    {paymentMethod &&
                                        (paymentMethod === PAYMENT_METHODS.visaOMasterCard.value ||
                                            paymentMethod === PAYMENT_METHODS.amex.value ||
                                            paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value) && (
                                            <div
                                                className={
                                                    paymentMethod === PAYMENT_METHODS.visaOMasterCard.value ||
                                                    paymentMethod === PAYMENT_METHODS.amex.value ||
                                                    paymentMethod === PAYMENT_METHODS.depositoOTransferencia.value
                                                        ? "pay-input-half-width persona-extra-modal-input-text-half"
                                                        : "pay-input-full-width persona-extra-modal-input-text"
                                                }
                                            >
                                                <Controller
                                                    control={control}
                                                    name={"cardNumber"}
                                                    rules={{ required: true, minLength: 4 }}
                                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                                        <InputText
                                                            label={
                                                                paymentMethod ===
                                                                PAYMENT_METHODS.depositoOTransferencia.value
                                                                    ? "Número de clabe o referencia"
                                                                    : "Número de tarjeta o referencia"
                                                            }
                                                            type={"text"}
                                                            placeholder={
                                                                paymentMethod ===
                                                                PAYMENT_METHODS.depositoOTransferencia.value
                                                                    ? "Ingresa número"
                                                                    : "Máximo 10 dígitos"
                                                            }
                                                            errorhinttext={"Ingresa mínimo 4 dígitos"}
                                                            error={!!errors?.cardNumber}
                                                            value={value}
                                                            icon={Icon}
                                                            iconProps={{
                                                                name: "iconHash",
                                                                color: "var(--header-dark)",
                                                                height: 16,
                                                                width: 16,
                                                            }}
                                                            onChange={(e) => {
                                                                const value = e.target.value
                                                                if (validateOnlyNumbers(value, 10)) onChange(value)
                                                            }}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        )}

                                    {paymentMethod === PAYMENT_METHODS.lovePoints.value && (
                                        <div className="pay-input-half-width persona-extra-modal-input-text-half lovepoints-extra-wrapper">
                                            <LovePointsInput
                                                index={0}
                                                setLovePointsAmount={setLovePointsAmount}
                                                className="persona-extra-modal-input-text-half"
                                            />
                                        </div>
                                    )}

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
                                                    colaboradores.data?.colaboradores_by_area.colaboradores.map(
                                                        (c) => ({
                                                            nombre: getName(c),
                                                            colaborador_id: c.colaborador_id,
                                                            foto: c?.foto || "",
                                                        })
                                                    ) || []
                                                }
                                                value={value || ""}
                                                error={!!error}
                                                onChange={(e) => onChange(e)}
                                            />
                                        )}
                                    />
                                    {rolName !== RoleNames.admin &&
                                        rolName !== RoleNames.superadmin &&
                                        rolName !== RoleNames.recepcionista && (
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
                                                    control={control}
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
                                        )}
                                    {paymentMethod &&
                                        paymentMethod !== PAYMENT_METHODS.lovePoints.value &&
                                        paymentMethod !== PAYMENT_METHODS.cortesia.value &&
                                        paymentMethod !== PAYMENT_METHODS.consumoInterno.value && (
                                            <div className="pay-input-full-width persona-extra-propinas">
                                                <TipSection label={"Incluir propina (opcional)"} modalExtra={true} />
                                            </div>
                                        )}
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <PrimaryButton
                                type="button"
                                text="Agregar persona extra"
                                className="persona-extra-modal-button"
                                disabled={isSubmitLoading}
                                onClick={() => {
                                    if (
                                        (personasExtraMax && personaExtra > personasExtraMax) ||
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
                        className="modal__mixto-personas-extra"
                        isAlreadyInModal={true}
                        withCancelButton={false}
                        validateTotal={tipoPagoRoll === "total"}
                        paymentOptions={[
                            PAYMENT_METHODS.efectivo,
                            PAYMENT_METHODS.visaOMasterCard,
                            PAYMENT_METHODS.amex,
                            PAYMENT_METHODS.depositoOTransferencia,
                            PAYMENT_METHODS.lovePoints,
                        ]}
                        visible={state.visible}
                        edited={state.edited}
                        onClose={() => setState({ visible: false, edited: false })}
                        onLovePointsChange={(value) => setLovePointsAmountGlobal(value)}
                    />
                    <LoaderComponent visible={isSubmitLoading} />
                </form>
                {Modal}
            </FormProvider>
            <ModalLovePointsError
                isOpen={isModalLovePointsErrorOpen}
                setIsOpen={setModalLovePointsErrorOpen}
                description={modalMessage}
                onCloseDialog={() => setModalLovePointsErrorOpen(false)}
            />
        </LayoutModal>
    )
}

export default PersonasExtra
