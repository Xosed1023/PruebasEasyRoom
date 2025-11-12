import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Controller, useForm, FormProvider } from "react-hook-form"
import Screen from "src/shared/components/layout/screen/Screen"
import { InputTel, InputText, TextBox } from "src/shared/components/forms"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import ModalAcceptReservation from "./sections/ModalAcceptReservation.section"
import { ModalConfirm } from "src/shared/components/layout"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { PAYMENT_METHODS } from "src/constants/payments"

//import LoaderComponent from "src/shared/components/layout/loader/Loader"
import Icon from "src/shared/icons"
import { PaymentFields, PaymentSelect, AbonarEasyRewardsFields } from "./sections/Fields"
import { getParams } from "./Guest.helpers"
import { getDateStringMDY } from "src/utils/date"
import SnackBar from "src/shared/components/data-display/SnackBar/SnackBar"
import useMiniSnackbar from "src/shared/hooks/useMiniSnackbar"
import { payments, defaultValues, inputIconStyle, amountPayments, amountPaymentsEdit } from "./Guest.constants"
import { FormValues, ModalStatus } from "./Guest.types"
import "./Guest.css"
import {
    CreateReservaInput,
    UpdateReservaInput,
    DetallePagoPartialInfoObject,
    OrigenRservas,
    TiposPagos,
    useCrear_ReservaMutation,
    useActualizar_ReservaMutation,
    useGetExperienciasQuery,
    useGetIncidenciaByFiltersLazyQuery,
    EstadosReservas,
} from "src/gql/schema"
import { quitarParentesisYEspacios } from "src/shared/hooks/quitarParentecisySpace"
import { useProfile } from "src/shared/hooks/useProfile"
import { times, sum } from "src/shared/helpers/calculator"
import { useDate } from "src/shared/hooks/useDate"
import Resumen from "./sections/Resumen/Resumen"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import useLoadingState from "src/shared/hooks/useLoadingState"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { addDays } from "src/shared/helpers/addDays"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"
import useValidSameDayRent from "../venta-habitacion/hooks/useValidSameDayRent"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import AuthRequiredModal from "../inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"

function GuestScreen(): JSX.Element {
    const location = useLocation()
    const methods = useForm<FormValues>({
        defaultValues,
    })

    const costos = methods.watch("costs")
    const clientName = methods.watch("name")
    const tipoPago = methods.watch("payment")

    const { control, handleSubmit, setValue } = methods
    const [createReservaMutation] = useCrear_ReservaMutation()
    const [updateReservaMutation] = useActualizar_ReservaMutation()
    const [isModalConfirmOpen, setisModalConfirmOpen] = useState(false)
    const [isModalCancelOpen, setisModalCancelOpen] = useState(false)
    const [isModalEditCancelOpen, setisModalEditCancelOpen] = useState(false)
    const [isErrorCreateR, setIsErrorCreateR] = useState(false)
    const [isErrorUpdateR, setIsErrorUpdateR] = useState(false)

    const [codigoRes, setCodigoRes] = useState<string>("")
    const [reservaFolio, setReservaFolio] = useState<string>("")
    const [visibleToast, setVisibleToast] = useState<boolean>(false)
    const [stateMixto, setStateMixto] = useState<ModalStatus>({ visible: false, edited: false })
    const { hotel_id, usuario_id } = useProfile()

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)

    const [getIncidenciasHuesped, { loading, data: incidenciasHuesped }] = useGetIncidenciaByFiltersLazyQuery()

    const navigate = useNavigate()
    const { diffDays, setHHMMSS, localDateToUTCString } = useDate()

    const { showMiniSnackbar } = useMiniSnackbar()

    const {
        costoTarifa,
        costoPersonaExtra,
        cantidadPersonasExtra,
        fechaReserva,
        horaCheckIn,
        horaCheckOut,
        origenReserva,
        codigoReserva,
        cantidadPersonas,
        tipoHabitacion,
        tipoTarifa,
        experiencias,
        reservaIdSaved,
        folioSaved,
        experienciasSaved,
        nombreHuespedSaved,
        telefonoHuespedSaved,
        emailHuespedSaved,
        totalSaved,
        pagosSaved,
        comentarioSaved,
    } = getParams(location.state)

    const numNoches = fechaReserva.length === 1 ? 1 : diffDays(fechaReserva[0], fechaReserva[1])

    const { data: listaExperiencias } = useGetExperienciasQuery({
        variables: { hotel_id: hotel_id },
    })

    // Filtrar la lista de experiencias seleccionadas por el usuario
    const experienciasSeleccionadas =
        listaExperiencias?.experiencias
            ?.filter((exp) => experiencias.includes(exp.experiencia_id))
            ?.map((exp) => ({
                value: exp.precio,
                label: exp.nombre,
            })) || []

    const experienciasSeleccionadasIds = experiencias.filter((id) => !experienciasSaved.includes(id))

    // costo total de las experiencias seleccionadas
    const costoExperiencias = experienciasSeleccionadas.reduce((acc, exp) => acc + exp.value, 0)
    const totalResumen = sum([
        times(costoTarifa, numNoches < 1 ? 1 : numNoches),
        times(costoPersonaExtra * cantidadPersonasExtra, numNoches),
        costoExperiencias,
    ])

    const totalPagosSavedSum = (pagos: any[]) => {
        const totals = pagos.map((pago) => pago.total)
        return sum(totals)
    }
    const totalPagosSaved = pagosSaved ? totalPagosSavedSum(pagosSaved) : 0

    useEffect(() => {
        const costoExtra = costoPersonaExtra * cantidadPersonasExtra
        // Se agregó la operación: costo de la tarifa por el número de días. (Costo base)
        const costoHabitacion = times(costoTarifa, numNoches < 1 ? 1 : numNoches)
        const total = sum([costoHabitacion, times(costoExtra, numNoches), costoExperiencias])
        const total_general =
            totalPagosSaved > 0
                ? total - totalPagosSaved
                : total
        
        setValue("costs", {
            room: costoHabitacion,
            users: costoExtra,
            experiencias: costoExperiencias,
            total: total,
            general: total_general,
            payment: 0,
        })
        if (reservaIdSaved) {
            setValue("name", nombreHuespedSaved)
            setValue("phoneNumber", telefonoHuespedSaved)
            setValue("email", emailHuespedSaved)
            setValue("comment", comentarioSaved)
        }
    }, [tipoPago, methods, costoExperiencias])

    const onBack = (): void => (reservaIdSaved ? setisModalEditCancelOpen(true) : setisModalCancelOpen(true))

    const onConfirmSubmit = (values: FormValues) => {
        if (isLoading) {
            return
        }
        toggleIsLoading({ value: true })
        const user = usuario_id
        const params = location.state
        const {
            fechaReserva,
            cantidadPersonas,
            cantidadPersonasExtra,
            origenReserva,
            tipoTarifa,
            tipoHabitacionId,
            codigoReserva,
            folioSaved,
        } = getParams(params)
        let origenR: OrigenRservas = origenReserva
        let crearReservaInput: CreateReservaInput = {
            comentarios: [],
            correo_huesped: null,
            fecha_entrada: "",
            fecha_salida: "",
            hotel_id: "",
            nombre_huesped: "",
            numero_personas: 0,
            origen: OrigenRservas[origenReserva],
            codigo_ota: codigoReserva,
            tarifa_id: "",
            telefono_huesped: null,
            tipo_habitacion_id: "",
            total: 0,
            usuario_id: "",
            experiencias_ids: [],
        }
        let actualizarReservaInput: UpdateReservaInput = {
            reserva_id: reservaIdSaved,
            comentarios: [values.comment],
            correo_huesped: values.email?.length ? values.email : null,
            fecha_entrada: localDateToUTCString(
                setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckIn })
            ),
            fecha_salida: localDateToUTCString(
                addDays({ date: setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckOut }), days: 1 }) //se esta enviando asi porque solo es la fecha de la habitacion sin hospedaje extra, el hospedaje extra es aparte
            ),
            hotel_id: hotel_id,
            hospedajes_extra: numNoches - 1,
            nombre_huesped: values.name,
            numero_personas: cantidadPersonas,
            personas_extras: cantidadPersonasExtra,
            origen: origenR,
            codigo_ota: codigoReserva,
            tarifa_id: tipoTarifa.id,
            telefono_huesped: values.phoneNumber ? quitarParentesisYEspacios(values.phoneNumber) : null,
            tipo_habitacion_id: tipoHabitacionId,
            usuario_id: user,
            experiencias_ids: experienciasSeleccionadasIds,
            servicios_reserva: [],
            total: totalPagosSaved
        }

        if (Object.prototype.hasOwnProperty.call(OrigenRservas, origenReserva)) {
            origenR = OrigenRservas[origenReserva]
        }
        const totalCostos = costos?.general || 0
        if (reservaIdSaved && totalPagosSaved === totalCostos) {
            values.payment = "pendiente"
        }
        if (values.payment === "pendiente") {
            reservaIdSaved
                ? (actualizarReservaInput = {
                    ...actualizarReservaInput,
                    total: values.costs.general,
                    estado: EstadosReservas.SinAsignar,
                })
                : (crearReservaInput = {
                    comentarios: [values.comment],
                    correo_huesped: values.email?.length ? values.email : null,
                    fecha_entrada: localDateToUTCString(
                        setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckIn })
                    ),
                    fecha_salida: localDateToUTCString(
                        addDays({ date: setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckOut }), days: 1 })
                    ),
                    hotel_id: hotel_id,
                    hospedajes_extra: numNoches - 1,
                    nombre_huesped: values.name,
                    numero_personas: cantidadPersonas,
                    personas_extras: cantidadPersonasExtra,
                    origen: origenR,
                    codigo_ota: codigoReserva,
                    tarifa_id: tipoTarifa.id,
                    telefono_huesped: values.phoneNumber ? quitarParentesisYEspacios(values.phoneNumber) : null,
                    tipo_habitacion_id: tipoHabitacionId,
                    total: values.costs.general,
                    usuario_id: user,
                    experiencias_ids: experienciasSeleccionadasIds,
                })
        }
        const easyrewardsId = lovePointsAmount?.id
        const detalleDePago = values.extra.map((extra, index) => {
            const subtotalBase =
                values.payment === "total"
                    ? values.extra.length > 1
                        ? extra.amount
                        : values.costs.general
                    : values.payment === "parcial"
                    ? extra.amount
                    : 0
            // Verifica que value.type sea una clave válida en TiposPagos
            const detalle: DetallePagoPartialInfoObject = {
                tipo_pago: extra.type as TiposPagos,
                subtotal: subtotalBase,
                easyrewards_id: easyrewardsId,
            }

            if (extra.type !== "efectivo") {
                detalle.ultimos_digitos = values.transferNumber
            }

            if (extra.number !== "") {
                detalle.ultimos_digitos = extra.number
            }

            return detalle
        })
        if (values.payment === "total") {
            reservaIdSaved
                ? (actualizarReservaInput = {
                    ...actualizarReservaInput,
                    pago: {
                        total: sum([...detalleDePago.map((dp) => dp.subtotal)]),
                        detallesPago: detalleDePago,
                        hotel_id: hotel_id,
                        usuario_id: user,
                    },
                })
                : (crearReservaInput = {
                    comentarios: [values.comment],
                    correo_huesped: values.email?.length ? values.email : null,
                    fecha_entrada: localDateToUTCString(
                        setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckIn })
                    ),
                    fecha_salida: localDateToUTCString(
                        addDays({ date: setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckOut }), days: 1 })
                    ),
                    hotel_id: hotel_id,
                    hospedajes_extra: numNoches - 1,
                    nombre_huesped: values.name,
                    numero_personas: cantidadPersonas,
                    personas_extras: cantidadPersonasExtra,
                    origen: origenR,
                    codigo_ota: codigoReserva,
                    tarifa_id: tipoTarifa.id,
                    telefono_huesped: values.phoneNumber ? quitarParentesisYEspacios(values.phoneNumber) : null,
                    tipo_habitacion_id: tipoHabitacionId,
                    total: values.costs.general,
                    usuario_id: user,
                    pago: {
                        total: sum([...detalleDePago.map((dp) => dp.subtotal)]),
                        detallesPago: detalleDePago,
                        hotel_id: hotel_id,
                        usuario_id: user,
                    },
                    experiencias_ids: experienciasSeleccionadasIds,
                })
        }
        if (values.payment === "parcial") {
            reservaIdSaved
                ? (actualizarReservaInput = {
                    ...actualizarReservaInput,
                    pago: {
                        total: sum([...detalleDePago.map((dp) => dp.subtotal)]),
                        detallesPago: detalleDePago,
                        hotel_id: hotel_id,
                        usuario_id: user,
                    },
                })
                : (crearReservaInput = {
                    comentarios: [values.comment],
                    correo_huesped: values.email?.length ? values.email : null,
                    fecha_entrada: localDateToUTCString(
                        setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckIn })
                    ),
                    fecha_salida: localDateToUTCString(
                        addDays({ date: setHHMMSS({ startDate: fechaReserva[0], newHour: horaCheckOut }), days: 1 })
                    ),
                    hospedajes_extra: numNoches - 1,
                    hotel_id: hotel_id,
                    nombre_huesped: values.name,
                    numero_personas: cantidadPersonas,
                    personas_extras: cantidadPersonasExtra,
                    origen: origenR,
                    codigo_ota: codigoReserva,
                    tarifa_id: tipoTarifa.id,
                    telefono_huesped: values.phoneNumber ? quitarParentesisYEspacios(values.phoneNumber) : null,
                    tipo_habitacion_id: tipoHabitacionId,
                    total: values.costs.general,
                    usuario_id: user,
                    pago: {
                        total: sum([...detalleDePago.map((dp) => dp.subtotal)]),
                        detallesPago: detalleDePago,
                        hotel_id: hotel_id,
                        usuario_id: user,
                    },
                    experiencias_ids: experienciasSeleccionadasIds,
                })
        }

        reservaIdSaved
            ? updateReservaMutation({
                variables: { actualizarReservaInput },
            })
                .then((data) => {
                    setCodigoRes(String(codigoReserva || "-"))
                    setReservaFolio(`${folioSaved}`)
                    showMiniSnackbar({
                        title: "Reserva editada",
                        text: `Se actualizó la reserva **${folioSaved}** correctamente.`,
                        status: "success",
                    })
                    navigate("/u/reservaciones/table", { replace: true })
                })
                .catch((e) => {
                    console.log(e)
                    setVisibleToast(true)
                })
                .finally(() => {
                    toggleIsLoading({ value: false })
                })
            : createReservaMutation({
                variables: { crearReservaInput },
            })
                .then(({ data }) => {
                    setCodigoRes(String(codigoReserva || "-"))
                    setReservaFolio(`${data?.crear_reserva?.reserva?.folio || "-"}`)
                    setisModalConfirmOpen(true)
                    if (values.payment !== "pendiente") {
                        window.location.href = `print://${data?.crear_reserva?.ticket?.ticket_id?.[0] || ""}_0/`
                    }
                })
                .catch((e) => {
                    console.log(e)
                    setVisibleToast(true)
                })
                .finally(() => {
                    toggleIsLoading({ value: false })
                })
    }

    useEffect(() => {
        if (visibleToast) {
            setTimeout(() => setVisibleToast(false), 5000)
        }
    }, [visibleToast])

    const getEmailError = (): string => {
        const type = methods.formState.errors.email?.type
        return type === "required" ? "Ingresa un correo" : type === "pattern" ? "Ingresa un correo válido" : ""
    }

    useEscapeKey({
        onEscape: () => {
            navigate(reservaIdSaved ? `/u/registro-reserva/${location.state?.reservaIdSaved}` : `/u/registro-reserva`, {
                state: { ...getParams(location.state) },
            })
        },
    })

    const { isBetween12AMAndCheckInHour } = useValidSameDayRent(horaCheckIn, false, horaCheckOut)

    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const { Modal } = useAuth({
        authModal: (
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onAuthFilled={() => {
                    onConfirmSubmit(methods.getValues())
                    setisAuthModalOpen(false)
                }}
                onClose={() => setisAuthModalOpen(false)}
                authorizedRoles={[RoleNames.recepcionista, RoleNames.admin, RoleNames.gerente]}
                authorizedPins={[RoleNames.admin]}
            />
        ),
        authorizedRoles: [RoleNames.recepcionista, RoleNames.admin, RoleNames.gerente],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
        noNeedAuthModalRoles: [],
    })

    const onSubmit = (values: FormValues) => {
        // si fechaReserva.length === 1 es porque es una reserva del día de hoy de solo 1 estancia, y si es después de la hora de checkin lo debe autorizar el admin o gerente
        if (!isBetween12AMAndCheckInHour && fechaReserva.length === 1) {
            setisAuthModalOpen(true)
            return
        }
        onConfirmSubmit(values)
    }

    const showPagos = reservaIdSaved ? costos.general > 0 && totalPagosSaved !== costos.general : true

    return (
        <Screen
            title={reservaIdSaved ? `Edición de reservación ${folioSaved}` : "Registro de reserva"}
            className="guest-screen-container"
            contentClassName="guest-screen"
            onClose={onBack}
            onBack={() => {
                navigate(
                    reservaIdSaved ? `/u/registro-reserva/2/${location.state?.reservaIdSaved}` : `/u/registro-reserva`,
                    { state: { ...getParams(location.state) } }
                )
            }}
            back={true}
            close={true}
        >
            <FormProvider {...methods}>
                <form className="guest-screen__form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="guest-screen__col-left">
                        <div className="guest-screen__block" style={{ marginTop: "20px" }}>
                            <h5 className="guest-screen__subtitle">{"Huésped"}</h5>
                            <div className="guest-screen__row">
                                <Controller
                                    control={control}
                                    name={"name"}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputText
                                            className={"guest-screen__input-text"}
                                            label={"Nombre completo"}
                                            type={"text"}
                                            placeholder={"Nombre del huésped"}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            icon={Icon}
                                            iconProps={{
                                                name: "userFilled",
                                                ...inputIconStyle,
                                            }}
                                            loader={loading}
                                            onBlur={() => {
                                                getIncidenciasHuesped({
                                                    variables: {
                                                        hotel_id,
                                                        matricula: null,
                                                        huesped: clientName || null,
                                                    },
                                                })
                                            }}
                                            error={
                                                !!errors?.name || (!!clientName && !!incidenciasHuesped?.incidencias[0])
                                            }
                                            errorhinttext={
                                                errors?.name
                                                    ? "Agrega nombre del huésped"
                                                    : "Huésped con reporte de incidencia. Más detalle en el módulo de incidencias."
                                            }
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={"phoneNumber"}
                                    rules={{ required: false, validate: (v) => /^[^_]*$/.test(v) }}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputTel
                                            className={"guest-screen__input-text"}
                                            label={"Número de teléfono"}
                                            hinttext="Opcional"
                                            placeholder={"(55) 5555 5555"}
                                            telValue={value}
                                            prefixValue={"MX +52"}
                                            onPrefixChange={(e) => console.log(e.value)}
                                            onInputChange={(e) => onChange(e)}
                                            error={!!errors?.phoneNumber}
                                            errorhinttext={"Agrega número de teléfono"}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={"email"}
                                    rules={{ required: false, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputText
                                            className={"guest-screen__input-text"}
                                            label={"Correo"}
                                            hinttext="Opcional"
                                            type={"text"}
                                            placeholder={"ejemplo@correo.com"}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            icon={Icon}
                                            iconProps={{
                                                name: "openMailFill",
                                                ...inputIconStyle,
                                            }}
                                            error={!!errors?.email}
                                            errorhinttext={getEmailError()}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {showPagos ? (
                            <div className="guest-screen__block">
                                <h5 className="guest-screen__subtitle">{"Pago de reservación"}</h5>
                                <div className="guest-screen__row">
                                    <Controller
                                        control={control}
                                        name={"payment"}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange }, formState: { errors } }) => (
                                            <Dropdown
                                                icon={"dollarCircle"}
                                                iconInOptions={false}
                                                className={"guest-screen__select"}
                                                label={"Pago"}
                                                placeholder={"Selecciona una opción"}
                                                errorHintText={errors.payment ? "Selecciona una opción" : ""}
                                                options={reservaIdSaved ? amountPaymentsEdit : amountPayments}
                                                value={value}
                                                onClick={({ value }) => {
                                                    setValue("payment", value, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                    setValue("extra", [], { shouldValidate: true, shouldDirty: true })
                                                    setValue("cardNumber", "", {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                    setValue("advance", 0, { shouldValidate: true, shouldDirty: true })
                                                    onChange(value)
                                                }}
                                            />
                                        )}
                                    />
                                    <PaymentSelect control={control} state={stateMixto} onClick={setStateMixto} />
                                    <PaymentFields costoExperiencias={costoExperiencias || 0} />
                                    <AbonarEasyRewardsFields
                                        setLovePointsAmount={setLovePointsAmount}
                                        lovePointsAmount={lovePointsAmount}
                                    />
                                </div>
                            </div>
                        ) : null}
                        <div>
                            <h5 className="guest-screen__subtitle">{"Comentarios"}</h5>
                            <Controller
                                control={control}
                                name={"comment"}
                                render={({ field: { value, onChange } }) => (
                                    <TextBox
                                        className={"guest-screen__textarea"}
                                        placeholder={"Escribe un comentario..."}
                                        value={value}
                                        onChange={(e) => onChange(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <Resumen
                        disabled={isLoadingDelayed}
                        aux={{
                            numNoches: numNoches,
                        }}
                        costos={{
                            estancia: costos.room,
                            personasExtra: costos.users,
                            experiencias: costoExperiencias,
                            total: totalResumen,
                        }}
                        labels={{
                            clientName,
                            codigo: codigoReserva,
                            origen: origenReserva,
                            fechasEstancia: fechaReserva,
                            personas: cantidadPersonas,
                            personasExtra: cantidadPersonasExtra,
                            tipoHabitacion,
                            tipoTarifa: tipoTarifa.nombre,
                            correo: methods.watch("email"),
                            telefono: methods.watch("phoneNumber"),
                            experiencias: experienciasSeleccionadas,
                        }}
                        lovePointsAmount={lovePointsAmount}
                        onEditMixto={() => setStateMixto({ visible: true, edited: true })}
                        reservaSaved={{
                            reservaIdSaved: reservaIdSaved,
                            folioSaved: folioSaved,
                            pagosTotalSaved: totalPagosSaved,
                            pagosSaved: pagosSaved,
                            totalSaved: totalSaved,
                        }}
                    />
                </form>
                <ModalMixto
                    paymentOptions={[
                        PAYMENT_METHODS.efectivo,
                        PAYMENT_METHODS.visaOMasterCard,
                        PAYMENT_METHODS.amex,
                        PAYMENT_METHODS.depositoOTransferencia,
                    ]}
                    validateTotal={tipoPago !== payments[1].value}
                    visible={stateMixto.visible}
                    edited={stateMixto.edited}
                    onClose={() => setStateMixto({ visible: false, edited: false })}
                />
            </FormProvider>
            <ModalAcceptReservation
                isOpen={isModalConfirmOpen}
                reservationDate={
                    fechaReserva[1]
                        ? `${getDateStringMDY(fechaReserva[0])} - ${getDateStringMDY(fechaReserva[1])}`
                        : `${getDateStringMDY(fechaReserva[0])}`
                }
                OTACode={`#${codigoRes}`}
                folio={reservaFolio}
                onCancel={() => {
                    setisModalConfirmOpen(false)
                    navigate("/u/reservaciones/table", { replace: true })
                }}
            />
            <ModalConfirm
                isOpen={reservaIdSaved ? isErrorUpdateR : isErrorCreateR}
                title={reservaIdSaved ? "Error al editar reserva" : "Error al crear reserva"}
                description={reservaIdSaved ? "Error al editar reserva" : "Se ha creado un error al crear la reserva"}
                icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
                iconTheme="danger"
                onClose={() => (reservaIdSaved ? setIsErrorUpdateR(false) : setIsErrorCreateR(false))}
            />
            <ModalConfirm
                isOpen={reservaIdSaved ? isModalEditCancelOpen : isModalCancelOpen}
                title={reservaIdSaved ? "Abandonar la edición de reserva" : "Abandonar el registro"}
                description={
                    reservaIdSaved
                        ? "Si decides dar clic en “Continuar”, ten en cuenta que no se registrará la actualización de datos que se editaron en la reserva."
                        : "Si decides dar clic en 'Continuar', ten en cuenta que abandonarás el proceso y toda la información ingresada se perderá"
                }
                icon={<Icon name="Warning" color="var(--pink-ocupado)" />}
                iconTheme="danger"
                onCloseDialog={({ confirmed }) => {
                    if (confirmed) {
                        navigate("/u/reservaciones/table")
                    }
                    reservaIdSaved ? setisModalEditCancelOpen(false) : setisModalCancelOpen(false)
                }}
            />
            <SnackBar
                title={reservaIdSaved ? "Error al editar una reserva" : "Error al registrar una reserva"}
                isOpen={visibleToast}
                onClose={() => setVisibleToast(false)}
                status={"error"}
            >
                <p>¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.</p>
            </SnackBar>
            <LoaderComponent visible={isLoading} />
            {Modal}
        </Screen>
    )
}

export default GuestScreen
