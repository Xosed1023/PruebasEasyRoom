import React, { useEffect, useState, useMemo } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import cx from "classnames"

import "./HorasExta.css"
import { HorasExtraProps, FormValues } from "./HorasExtra.type"
import IconBorder from "src/shared/components/data-display/IconBorder/IconBorder"
import Counter from "src/shared/components/forms/counter/Counter"
import Icon from "src/shared/icons"
import { Button } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { formatLongDate } from "src/shared/helpers/formatLongDate"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { useDate } from "src/shared/hooks/useDate"
import { InputCardNumber } from "src/shared/sections/payment/InputCardNumber"
import { valueIsCard } from "src/shared/helpers/valueIsCard"
import { TiposPagos, useAgregar_Horas_RentaMutation, useDescontarSaldoEasyrewardsMutation, useGetAreasQuery, useGetColaboradoresByAreasLazyQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { useRoom } from "../../../hooks"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import ModalBody from "src/shared/components/modal/sections/ModalBody/ModalBody"
import ModalContent from "src/shared/components/modal/sections/ModalContent/ModalContent"
import ModalRow from "src/shared/components/modal/sections/ModalRow/ModalRow"
import ModalFooter from "src/shared/components/modal/sections/ModalFooter/ModalFooter"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { LovePointsSection } from "src/pages/room-service/detalle-compra/sections/Fields"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import { InputAbonarEasyRewards } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards"
import ModalLovePointsError from "src/pages/easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import { minus, times } from "src/shared/helpers/calculator"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import TipSection from "src/shared/sections/payment/propina/form-section"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import { defaultValues } from "src/pages/room-service/pago/Pago.constants"
import { usePrintTicket } from "src/shared/hooks/print"
import InputPersonal from "src/shared/sections/payment/propina/input-personal"
import { getName } from "src/pages/propinas/home/helpers/name"

const HorasExtra = ({
    isShowing,
    onClose,
    endDate,
    costoHoraExtra,
    horasExtraStart,
    horasExtraMax,
    onConfirmed,
}: HorasExtraProps) => {
    const { addHours } = useDate()
    const [agregaHoras] = useAgregar_Horas_RentaMutation()
    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()
    const { usuario_id, hotel_id, rolName, colaborador } = useProfile()
    const { showSnackbar } = useSnackbar()
    const dispatch = useDispatch()
    const room = useRoom()

    const methods = useForm<FormValues>({
        defaultValues: {
            ...defaultValues,
            costs: {
                ...defaultValues.costs,
                general: times(costoHoraExtra, 2),
            },
            abonarEasyRewards: "",
            horasExtra: 2,
            cardNumber: "",
        },
    })
    const { control, handleSubmit } = methods

    const { handlePrint } = usePrintTicket()
    const paymentMethod = methods.watch("paymentMethod")
    const horasExtra = methods.watch("horasExtra")
    const extra = methods.watch("extra")
    const propinas = useWatch({ control, name: "propinas" })
    const [state, setState] = useState({ visible: false, edited: false })
    const [isSubmitLoading, setisSubmitLoading] = useState(false)
    const [tipoPago, setTipoPago] = useState<string>("total")
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [modalMessage, setModalMessage] = useState<string>("")
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
    const [isInitialModalViewState, setIsInitialModalViewState] = useState(true)

    const total_propinas = useMemo(() => {
        if (tipoPago !== "total") return 0
        if (!Array.isArray(propinas) || propinas.length === 0) return 0
        return propinas.reduce((acum, current) => acum + (current?.value || 0), 0)
    }, [propinas, tipoPago, costoHoraExtra])

    useEffect(() => {
        methods.setValue("costs.general", times(costoHoraExtra, horasExtra))
        methods.reset({ ...methods.getValues(), paymentMethod: "" })
    }, [costoHoraExtra, horasExtra])

    useEffect(() => {
        if (paymentMethod === PAYMENT_METHODS.mixto.value) {
            setIsInitialModalViewState(false)
            setState({ visible: true, edited: false })
        }
    }, [paymentMethod])

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

    const onConfirmSubmit = async (values: FormValues) => {
        if (isSubmitLoading) {
            return
        }
        setisSubmitLoading(true)
        const s = values.horasExtra > 0 ? "s" : ""

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

        agregaHoras({
            variables: {
                addHorasExtrasRentaInput: {
                    cantidad: values.horasExtra,
                    colaborador_id: values.colaborador_id,
                    hotel_id,
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
                    const { ticket_id, extra_id } = data.agregar_horas_renta
                    const ticket = ticket_id || extra_id

                    const type = ticket_id !== null ? "0" : "5"
                    if (ticket) handlePrint(ticket, "custom", type)
                }
                showSnackbar({
                    title: `Hora${s} extra${s} agregada${s}`,
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
                    title: "Error al agregar horas extra",
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
                authorizedPins={[RoleNames.admin, RoleNames.gerente]}
                isOpen={isAuthModalOpen}
                onAuthFilled={(value, sampleData) => {
                    setisAuthModalOpen(false)
                    methods.handleSubmit(onConfirmSubmit)()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        noNeedAuthModalRoles: [],
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.valet, RoleNames.gerente],
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
            width={700}
            height={"fit-content"}
            className="horas-extra__wrapper"
            isCancelableOnClickOutside={false}
        >
            <FormProvider {...methods}>
                <form
                    className={cx(
                        "horas-extra__body__form",
                        isInitialModalViewState ? "" : state.visible ? "horas-extra__body-trigger--left" : "horas-extra__body-trigger--right"
                    )}
                    onSubmit={methods.handleSubmit(onSubmit)}
                >   
                    <ModalContent style={{flex: "0 0 100%"}}>
                        <ModalRow className="horas-extra__header">
                            <IconBorder primaryBgColor="var(--fondo-close)" primaryBgDiameter={60}>
                                <Icon name="Clock" color="var(--deep-purple)" width={30} height={30} />
                            </IconBorder>
                            <p className="horas-extra__header__title">Horas extra</p>
                            <p className="horas-extra__header__end-date">
                                Salida {formatLongDate(addHours(endDate || new Date(), horasExtra))}
                            </p>
                        </ModalRow>
                        <ModalBody className="horas-extra__body">
                            <Controller
                                control={methods.control}
                                rules={{ required: true }}
                                name={"horasExtra"}
                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                    <Counter
                                        onClick={(v) => {
                                            onChange(v)
                                            if (v.value !== "total") {
                                                methods.setValue("propinas", [])
                                            }
                                        }}
                                        value={value}
                                        min={2}
                                        max={minus(horasExtraMax, horasExtraStart)}
                                        stepCount={2}
                                        errorHintText={
                                            value >= horasExtraMax || horasExtraStart >= horasExtraMax
                                                ? "Has alcanzado el límite de venta de horas extras para esta habitación"
                                                : ""
                                        }
                                    />
                                )}
                            />
                            <p className="horas-extra__body-monto">
                                Monto:{" "}
                                <span>{formatCurrency(times(horasExtra, costoHoraExtra || 0) + total_propinas)}</span>
                            </p>
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
                                    rolName === "VALETPARKING"
                                        ? [{ label: "Pendiente", value: "pendiente" }]
                                        : [
                                            { label: "Total", value: "total" },
                                            { label: "Pendiente", value: "pendiente" },
                                        ]
                                }
                                placeholder="Selecciona una opción"
                            />
                            {rolName !== "VALETPARKING" && tipoPago === "total" && (
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
                                            rules={{ required: true }}
                                            name={"paymentMethod"}
                                            render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                <Dropdown
                                                    disabled={horasExtraStart >= horasExtraMax || horasExtra < 1}
                                                    onClick={(v) => onChange(v.value)}
                                                    value={value}
                                                    errorHintText={
                                                        error?.type === "required" ? "Ingresa una forma de pago" : ""
                                                    }
                                                    label="Forma de pago"
                                                    className="horas-extra__body-pago"
                                                    icon="creditCard"
                                                    options={[
                                                        PAYMENT_METHODS.efectivo,
                                                        PAYMENT_METHODS.visaOMasterCard,
                                                        PAYMENT_METHODS.amex,
                                                        PAYMENT_METHODS.depositoOTransferencia,
                                                        PAYMENT_METHODS.cortesia,
                                                        PAYMENT_METHODS.consumoInterno,
                                                        PAYMENT_METHODS.mixto,
                                                    ]}
                                                    placeholder="Selecciona una opción"
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
                                                rules={{ required: true }}
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
                                      rolName !== "ADMINISTRADOR" &&
                                      rolName !== "RECEPCIONISTA" ? (
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
                                        <div className="pay-input-full-width horas-extra-propinas">
                                            <TipSection label={"Incluir propina (opcional)"} modalExtra={true} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                className="horas-extra__footer__button"
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
                        className={cx("modal__mixto-horas-extra")}
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
                        onBack={() => setState({ visible: false, edited: false })}
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

export default HorasExtra
