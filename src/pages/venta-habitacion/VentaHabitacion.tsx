/* eslint-disable indent */
import React, { useEffect, useRef, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import "./VentaHabitacion.css"
import Resumen from "./sections/Resumen/Resumen"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import LabelTitle from "./components/LabelTitle/LabelTitle"
import {
    Reserva,
    Tarifa,
    TiposAlojamientos,
    TiposEntradas,
    TiposPagos,
    useCheckInMutation,
    useCreateRentaMutation,
    useGetHabitacionQuery,
    useTarifasLazyQuery,
    useGetIncidenciaByFiltersLazyQuery,
    useGetColaboradoresQuery,
    CreateRentaInput,
    EstatusTarifa,
    useDescontarSaldoEasyrewardsMutation,
    useGetHabitacionTurnosAtencionQuery,
    useActualizarTurnoAtencionMutation,
    EstadosTurnosAtencion,
} from "src/gql/schema"
import { v4 as uuid } from "uuid"
import FormSection from "./components/FormSection/FormSection"
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useProfile } from "src/shared/hooks/useProfile"
import { getCurrencyFormat } from "src/utils/string"
import Counter from "src/shared/components/forms/counter/Counter"
import { InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import usePaymentOptions, { entryTypes, inputIconStyle, scheduleTypes } from "./VentaHabitacion.constants"
import { CardNumberField } from "./components/CardNumberField/CardNumberField"
import FormSectionRow from "./components/FormSectionRow/FormSectionRow"
import { PAYMENT_METHODS, PAYMENT_TYPES } from "src/constants/payments"
import ModalMixto from "src/shared/sections/payment/mixto/ModalMixto"
import { useDispatch, useSelector } from "react-redux"
import { getPropinaList } from "src/shared/sections/payment/helpers/propinas"
import {
    selectTarifa,
    setTarifas,
    toggleModalPagoMixtoEdited,
    toggleModalPagoMixtoOpen,
} from "src/store/ventaHabitacion/ventaHabitacionSlice"
import { RootState } from "src/store/store"
import useSetCosts from "./hooks/useSetCosts"
import useResetPayments from "./hooks/useResetPayments"
import useResetForm from "./hooks/useResetForm"
import { useDate } from "src/shared/hooks/useDate"
import { getPaymentList } from "src/shared/sections/payment/Payment.helpers"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import useReservaPayments from "./hooks/useReservaPayments"
import useSetFormStateFromReserva from "./hooks/useSetFormStateFromReserva"
import { addCurrentTime } from "src/shared/helpers/addCurrentTime"
import { sum, times } from "src/shared/helpers/calculator"
import InputDate from "src/shared/components/forms/input-date/InputDate"
import { addDays } from "src/shared/helpers/addDays"
import { substractDays } from "src/shared/helpers/substractDays"
import useShowPago from "./hooks/useShowPago"
import useShowPagoReserva from "./hooks/useShowPagoReserva"
import Switch from "src/shared/components/forms/switch/Switch"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import useValidSameDayRent from "./hooks/useValidSameDayRent"
import { ventaHabitacionDefaultValues } from "./helpers/genDefaultValues"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import ModalMatricula, { ModalMatriculaProps } from "./sections/ModalMatricula/ModalMatricula"
import useModalMatricula from "./hooks/useModalMatricula"
import InputTextSuggestions, {
    InputTextSuggestion,
} from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import { isValidPropina } from "./helpers/isVisibleCardNumber"
import InputMoney from "src/shared/components/forms/InputMoney/InputMoney"
import DollarCircle from "src/shared/icons/DollarCircle"
import accountBoxFill from "src/shared/icons/accountBoxFill"
import { DetallePago } from "src/shared/sections/payment/types/pagos"
import { AbonarEasyRewardsField } from "../easyrewards/components/AbonarEasyRewardsField/AbonarEasyRewardsField"
import useIsLoadingData from "./hooks/useIsLoadingData"
import { LovePoint } from "src/pages/easyrewards/components/InputAbonarEasyRewards/InputAbonarEasyRewards.types"

import ModalLovePointsError from "../easyrewards/components/ModalLovePointsError/ModalLovePointsError"
import { useModulos } from "src/shared/hooks/useModulos"
import ModalPagoMixtoLovePoints from "../easyrewards/components/ModalPagoMixtoLovePoints/ModalPagoMixtoLovePoints"
import { useTarifasValidation } from "../reservaciones/registro-reservas/hooks/useTarifasValidation"
import { CardNumber } from "../room-service/detalle-compra/sections/Fields"
import { PaymentMethodField, PaymentTypeField } from "./sections/FieldsValetParking"
import useAuthOnTarifaNocheSelect from "./hooks/useAuthOnTarifaNocheSelect"
import useAuthOnCortesiaSelect from "../../shared/hooks/useAuthOnCortesiaSelect"
import useAuthOnCortesiaFromMixtoSelect from "../../shared/hooks/useAuthOnCortesiaFromMixtoSelect"
import { useDateWithUTCHour } from "./hooks/useDateWithUTCHour"
import { RoleNames } from "src/shared/hooks/useAuth"

export interface DefaultValuesType extends Partial<ModalMatriculaProps> {
    type: TiposAlojamientos
    date: Date[]
    amount: string
    extraHours: number
    extraHospedajes: number
    name: string
    entryType: TiposEntradas
    method: string
    users: number
    earlyCheckIn: boolean
    extraUsers: number
    // Propina de un unico pago
    porcentajePropina: string
    montoPropina?: number
    // Propina de pagos mixtos
    propinas?: {
        // id: index del pago al que hace referencia la propina
        id: string
        // monto de la propina por pago
        value: number
    }[]
    colaboradorRecibioPropina?: InputTextSuggestion
    extra: {
        amount: number
        type: TiposPagos
        number?: string
        easyrewards_id?: string
    }[]
    costs: {
        room: number
        users: number
        hours: number
        hospedajes: number
        costoEarlyCheckIn: number
        tax: number
        total: number
        general: number
    }
    paymentType?: string
}

const VentaHabitacion = () => {
    const { habitacion_id = "" } = useParams()
    const navigate = useNavigate()
    const [getTarifas] = useTarifasLazyQuery()
    const { hotel_id, turno_hotel_id, usuario_id } = useProfile()
    const { localDateToUTCString, diffDays, areSameDay, setHHMMSS, UTCStringToLocalDate } = useDate()
    const dispatch = useDispatch()
    const [crearRenta] = useCreateRentaMutation()
    const [actualizarListaEspera] = useActualizarTurnoAtencionMutation()

    const { showSnackbar } = useSnackbar()
    const location = useLocation()
    // hook para crear una renta cuando viene de una reserva
    const [checkIn] = useCheckInMutation()
    const [newScheduleTypes, setNewScheduleTypes] = useState<any>(scheduleTypes)

    const { isLoading: isDataLoading, setIsLoading } = useIsLoadingData()

    const { isModalPagoMixtoEdited, isModalPagoMixtoOpen, tarifas, tarifaSeleccionada } = useSelector(
        (root: RootState) => root.ventaHabitacion
    )
    const experienciasSeleccionadas = location?.state?.reservaSeleccionada?.experiencias_reserva || []
    const experiencias = experienciasSeleccionadas.map((exp) => ({
        experiencia: { nombre: exp.experiencia?.nombre },
        total: exp.total || 0,
    }))

    const methods = useForm({ defaultValues: ventaHabitacionDefaultValues })

    const tipoHospedaje = methods.watch("type")
    const tarifa_id = methods.watch("amount")
    const extraHours = methods.watch("extraHours")
    const extraHospedajes = methods.watch("extraHospedajes")

    const extraUsers = methods.watch("extraUsers")
    const dateRange = methods.watch("date")
    const costoEarlyCheckIn = methods.watch("costs.costoEarlyCheckIn")
    const costoGeneral = methods.watch("costs.general")
    const isEarlyCheckIn = methods.watch("earlyCheckIn")
    const tipoEntrada = methods.watch("entryType")
    const pagos = useWatch({ control: methods.control, name: "extra" })

    const matricula = methods.watch("matricula")
    const modeloAuto = methods.watch("modelo")
    const marcaAuto = methods.watch("marca")
    const colorAuto = methods.watch("color")

    const nombreHuesped = methods.watch("name")
    const method = methods.watch("method")
    const personas = methods.watch("users")
    const porcentajePropina = methods.watch("porcentajePropina")
    const montoPropina = methods.watch("montoPropina")
    const costos = methods.watch("costs")
    const propinas = methods.watch("propinas")

    const [propinasFormatted, setpropinasFormatted] = useState<DetallePago[]>([])
    const ticketIdRef = useRef<string>("")
    const [lovePointsAmount, setLovePointsAmount] = useState<LovePoint | null>(null)
    const [lovePointsAmountGlobal, setLovePointsAmountGlobal] = useState<LovePoint | null>(null)
    const [easyRewardsIdReserva, setEasyRewardsIdReserva] = useState<string | null>(null)
    const { rolName } = useProfile()

    const { isBetween12AMAndCheckInHour, isBetween12AMAndCheckOutHour } = useValidSameDayRent(
        tarifaSeleccionada?.hora_checkin,
        !!location?.state?.reservaSeleccionada,
        tarifaSeleccionada?.hora_checkout
    )
    const [getIncidenciasHuesped, { loading, data: incidenciasHuesped }] = useGetIncidenciaByFiltersLazyQuery()
    const [getIncidenciasMatricula, { data: incidenciasMatricula }] = useGetIncidenciaByFiltersLazyQuery()
    const [modalMessage, setModalMessage] = useState<string>("")
    const [isModalPagoMixtoLovePointsOpen, setModalPagoMixtoLovePointsOpen] = useState(false)
    const [isModalLovePointsErrorOpen, setModalLovePointsErrorOpen] = useState(false)
    const { easyRewards: withEasyrewards } = useModulos()

    const [descontarSaldoEasyrewards] = useDescontarSaldoEasyrewardsMutation()

    const { data: colaboradores } = useGetColaboradoresQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: habitacion } = useGetHabitacionQuery({
        variables: {
            habitacion_id,
            usuario_id,
            hotel_id
        },
        onError: () => {
            navigate("/u")
        },
        onCompleted: (data) => {
            setIsLoading({ key: "habitacion", value: false })
            getTarifas({
                variables: {
                    hotel_id,
                    tipo_habitacion_id: data.habitacion.tipo_habitacion_id,
                },
            }).then((t) => {
                setIsLoading({ key: "tarifa", value: false })
                dispatch(
                    setTarifas(
                        (location?.state?.reservaSeleccionada?.tarifa?.tarifa_id
                            ? t.data?.tarifas.filter(
                                  (tt) => tt.tarifa_id === location.state.reservaSeleccionada.tarifa.tarifa_id
                              )
                            : t.data?.tarifas
                                  .filter((t) => t.estatus === EstatusTarifa.Activa && !t.eliminado)
                                  .filter(({ tipo_tarifa = "" }) => tipo_tarifa.includes("renta")) || []) as Tarifa[]
                    )
                )
            })

            const easyRewardsReserva =
                data.habitacion?.ultima_reserva?.reserva?.pagos?.[0]?.detalles_pago?.[0]?.easyrewards_id || null
            setEasyRewardsIdReserva(easyRewardsReserva)
        },
    })

    const turnoAtencionId = location?.state?.folio_turno_id
    const { data: dataListaEspera } = useGetHabitacionTurnosAtencionQuery({
        variables: {
            hotel_id,
            turno_atencion_id: [turnoAtencionId || ""],
        },
    })
    const folioListaEspera = dataListaEspera?.turnos_atencion?.[0]?.folio_turno

    // hook para transformar los pagos de una reserva en pagos del formulario y hacer operaciones
    const { totalReservaPagos } = useReservaPayments({
        reserva: location?.state?.reservaSeleccionada as Reserva,
    })

    // Establece los valores del formulario de acuerdo a los valores de la reserva
    const [setFormState] = useSetFormStateFromReserva({
        setValue: methods.setValue,
    })

    // Establece los costos totales de las horas, personas, hospedaje, hospedajes extras, totales y totales menos pagos previos
    const { updateCosts } = useSetCosts({
        setValue: methods.setValue,
    })

    const { Modal } = useAuthOnTarifaNocheSelect({
        tipoHabitacionIdSelected: habitacion?.habitacion.tipo_habitacion_id || "",
        tipoHospedajeSelected: tipoHospedaje,
        setValue: (v) => methods.setValue("type", v),
        disabled: !!location?.state?.reservaSeleccionada,
    })

    const { Modal: ModalAuthCortesia } = useAuthOnCortesiaSelect({
        setValue: (v) => methods.setValue("method", v),
        tipoPago: method as TiposPagos,
    })

    const { Modal: ModalAuthCortesiaFromMixto } = useAuthOnCortesiaFromMixtoSelect({
        setValue: (v) => methods.setValue("extra", v),
        tipoPagoList: pagos,
    })

    const [roomDays, setRoomDays] = useState(1)

    const previousCosts = useRef<{
        extraHours: number
        extraUsers: number
        tarifa?: Tarifa
        totalReservaPagos: number
        roomDays: number
        isEarlyCheckIn: boolean
        totalCostoExperiencias: number
        extraHospedajes: number
    }>({
        extraHours: 0,
        extraUsers: 0,
        tarifa: undefined,
        totalReservaPagos: 0,
        roomDays: 0,
        isEarlyCheckIn: false,
        totalCostoExperiencias: 0,
        extraHospedajes: 0,
    })

    // Reinicia los contadores cuando se modifica la selección del tipo de hospedaje o tarifa
    const { updateResetForm, resetAmount } = useResetForm({ setValue: methods.setValue })

    const {
        isModalMatriculaOpen,
        isModalMatriculaOpenFromState,
        setIsModalMatriculaOpen,
        setIsModalMatriculaOpenFromState,
    } = useModalMatricula({ setValue: methods.setValue, tipoEntrada })

    // mostrar campo de pago si los pagos de reserva son menores a lo que se ha agregado a la renta
    const { isShowingPago, setIsShowingPago } = useShowPago({ isFromReserva: !!location?.state?.reservaSeleccionada })

    // mostrar campo de pago si los pagos de reserva son iguales a lo que se ha agregado a la renta
    const { isShowingPagoReserva, setIsShowingPagoReserva } = useShowPagoReserva({
        isFromReserva: !!location?.state?.reservaSeleccionada,
    })

    const { validationByDate } = useTarifasValidation()

    // Reinicia los pagos (excepto los previos que vienen de una reserva) al realizar cambios que afecten a estos para evitar incongruencias
    const { resetPayment } = useResetPayments({ setValue: methods.setValue, costoGeneral: costoGeneral })

    const [isVentaLoading, setIsVentaLoading] = useState(false)

    useEffect(() => {
        if (methods?.formState?.errors?.date) {
            showSnackbar({
                status: "error",
                title: "Error al vender habitación",
                text: "¡Ups! La fecha seleccionada no es válida. Por favor, elige una fecha correcta e inténtalo de nuevo.",
            })
        }
    }, [methods.formState])

    useEffect(() => {
        const tipoAlojamiento = determineTipoAlojamiento()

        const updatedScheduleTypes = scheduleTypes.map((item) => ({
            ...item,
            disabled:
                (tipoAlojamiento === "motel" && item.value === "hotel") ||
                (tipoAlojamiento === "hotel" && item.value === "motel"),
        }))
        setNewScheduleTypes(updatedScheduleTypes)
        setFormState({ reserva: location?.state?.reservaSeleccionada })
        setTarifaPorDefault()

        if (tipoAlojamiento === "hotel") {
            methods.setValue("type", TiposAlojamientos.Hotel)
        } else {
            methods.setValue("type", TiposAlojamientos.Motel)
        }
    }, [tarifas])

    useEffect(() => {
        if (
            easyRewardsIdReserva !== null &&
            lovePointsAmount?.id !== easyRewardsIdReserva &&
            location?.state?.reservaSeleccionada
        ) {
            setLovePointsAmount({
                id: easyRewardsIdReserva,
                saldo: lovePointsAmount?.saldo || 0,
            })
        }
    }, [easyRewardsIdReserva, lovePointsAmount])

    useEffect(() => {
        setLovePointsAmount(null)
        setLovePointsAmountGlobal(null)
    }, [methods.getValues("method")])

    // Establecer la lista de propinas formateadas
    useEffect(() => {
        const propinasList = getPropinaList(
            pagos.map((e) => ({
                subtotal: e.amount,
                tipo_pago: e.type,
                ultimos_digitos: e.number || "",
                easyrewards_id: "",
            })) || [],
            propinas?.length ? propinas : [{ id: "0", value: Number(montoPropina) || 0 }]
        )
        setpropinasFormatted(propinasList)
    }, [JSON.stringify(propinas), pagos, costos.general, montoPropina])

    // Establecer el monto de propina de un pago único al cambiar el % de la propina con los botones
    useEffect(() => {
        if (porcentajePropina === "Otro") {
            methods.setValue("montoPropina", 0)
            return
        }
        methods.setValue("montoPropina", times(costos.general, Number(porcentajePropina)))
    }, [porcentajePropina])

    // Resetear todo lo relacionado a propinas al cambiar de metodo de pago
    useEffect(() => {
        methods.setValue("propinas", ventaHabitacionDefaultValues.propinas)
        methods.setValue("montoPropina", ventaHabitacionDefaultValues.montoPropina)
        methods.setValue("porcentajePropina", ventaHabitacionDefaultValues.porcentajePropina)
        methods.setValue("colaboradorRecibioPropina", ventaHabitacionDefaultValues.colaboradorRecibioPropina)
    }, [method])

    useEffect(() => {
        if (colaboradores) {
            return setIsLoading({ key: "colaboradores", value: false })
        }
    }, [colaboradores])
    useEffect(() => {
        dispatch(selectTarifa(tarifas.find((t) => t.tarifa_id === tarifa_id)))
    }, [tarifa_id, tipoHospedaje, tarifas, costoEarlyCheckIn])
    useEffect(() => {
        methods.setValue("earlyCheckIn", false)
        if (!dateRange.length) {
            return setRoomDays(1)
        }
        if (tipoHospedaje === "motel") {
            return setRoomDays(1)
        }
        const diasEstancia = diffDays(addCurrentTime(dateRange?.[0]) || new Date(), addCurrentTime(dateRange?.[1]))

        if (isNaN(diasEstancia)) {
            return setRoomDays(1)
        }
        setRoomDays(diasEstancia < 1 ? 1 : diasEstancia)
    }, [dateRange])

    useEffect(() => {
        const totalCostoExperiencias = experienciasSeleccionadas.reduce((acc, exp) => acc + exp.total, 0)
        const newCosts = {
            extraHours,
            extraUsers: extraUsers + extraUsers * extraHospedajes,
            tarifa: tarifaSeleccionada ?? undefined,
            totalReservaPagos,
            roomDays,
            isEarlyCheckIn,
            totalCostoExperiencias,
            extraHospedajes,
        }

        if (JSON.stringify(newCosts) !== JSON.stringify(previousCosts.current)) {
            updateCosts(newCosts)
            previousCosts.current = newCosts
        }
    }, [
        tarifa_id,
        extraHours,
        extraUsers,
        roomDays,
        tarifaSeleccionada,
        isEarlyCheckIn,
        experienciasSeleccionadas,
        extraHospedajes,
    ])

    useEffect(() => {
        updateResetForm({
            reserva: location?.state?.reservaSeleccionada,
            tarifa_id,
            dateRange,
            numero_personas: habitacion?.habitacion.tipo_habitacion?.personas_incluidas,
            isBetween12AMAndCheckOutHour,
        })
    }, [tarifa_id, habitacion, isBetween12AMAndCheckInHour])

    useEffect(() => {
        resetAmount()
        // Reiniciar el día cuando cambia el tipo de hospedaje, esto para que cuando se hayan seleccionado
        if (!location?.state?.reservaSeleccionada) {
            methods.setValue("date", [setHHMMSS({ startDate: new Date(), newHour: "00:00:00", isNewHourInUTC: false })])
        }
        // Seleccionar la primer tarifa por defecto
        setTarifaPorDefault()
    }, [tipoHospedaje])

    useEffect(() => {
        setIsShowingPago({ totalRenta: costos.general })
        setIsShowingPagoReserva({ totalRenta: costos.general })
    }, [costos.general])

    useEffect(() => {
        resetPayment(!isShowingPago)
    }, [tipoHospedaje, tarifa_id, dateRange, extraHours, extraUsers, isEarlyCheckIn, costoGeneral, isShowingPago])

    useEffect(() => {
        const turno = dataListaEspera?.turnos_atencion?.[0]
        if (!turno) return

        if (turnoAtencionId && turno.estado === EstadosTurnosAtencion.EnEspera) {
            updateListaEspera(turnoAtencionId, EstadosTurnosAtencion.EnCurso)
        }
    }, [dataListaEspera, turnoAtencionId])

    const setTarifaPorDefault = () => {
        methods.setValue(
            "amount",
            location?.state?.reservaSeleccionada &&
                location?.state?.reservaSeleccionada?.tarifa?.tipo_alojamiento === tipoHospedaje
                ? location?.state?.reservaSeleccionada?.tarifa?.tarifa_id
                : tarifas.find(
                      (t) =>
                          t.tipo_habitacion_id === habitacion?.habitacion.tipo_habitacion_id &&
                          t.tipo_alojamiento === tipoHospedaje &&
                          validationByDate(t, dateRange?.[0])
                  )?.tarifa_id || ""
        )
    }

    const determineTipoAlojamiento = () => {
        const tipos = new Set(tarifas.map((tarifa) => tarifa.tipo_alojamiento))
        if (tipos.size === 1) {
            return [...tipos][0]
        } else if (tipos.has("hotel" as TiposAlojamientos) && tipos.has("motel" as TiposAlojamientos)) {
            return "all"
        }
    }

    const handleLovePointsChange = (value) => {
        setLovePointsAmountGlobal(value)
        if (value && value !== null) {
            setLovePointsAmount({
                id: value.id,
                saldo: value.saldo,
            })
        }
    }

    const onSubmit = async (data) => {
        let formattedDate = ""
        if (isVentaLoading) {
            return
        }
        setIsVentaLoading(true)
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
                setIsVentaLoading(false)
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
                    setIsVentaLoading(false)
                    return
                }
                if (disccountVerificationSuccess.message !== "El numero de transaccion no es valido") {
                    showSnackbar({
                        title: "Error desconocido",
                        text: "¡Ups! Se ha producido un error inesperado. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                    setIsVentaLoading(false)
                    return
                }
            }
        }

        if (data.type === "hotel") {
            // renta para el mismo día pero con tarifa que termina antes de la fecha y hora actuales
            const endNextDayTarifa =
                setHHMMSS({
                    startDate: data.date[0],
                    newHour: tarifaSeleccionada?.hora_checkout || "",
                    isNewHourInUTC: true,
                }) < new Date()
            const fechaRegistro = localDateToUTCString(data.date[0])
            const horaCheckOut = localDateToUTCString(
                useDateWithUTCHour(data.date[0], tarifaSeleccionada?.hora_checkout || "")
            )
            formattedDate =
                fechaRegistro < horaCheckOut && data.date[0] === data.date[1]
                    ? horaCheckOut
                    : localDateToUTCString(
                        addDays({
                            date: setHHMMSS({
                                startDate: data.date[0],
                                newHour: tarifaSeleccionada?.hora_checkout || "",
                                isNewHourInUTC: true,
                            }),
                            days: data.date[1] || endNextDayTarifa ? 1 : 0,
                        })
                    )
        }
        if (location?.state?.reservaSeleccionada) {
            const estadoPagoReserva = location?.state?.reservaSeleccionada?.estado_pago

            const pagoObject =
                estadoPagoReserva !== "pagado"
                    ? {
                          pago: {
                              detallesPago: [
                                  ...getPaymentList(
                                      data.extra.map((pago) => ({
                                          ...pago,
                                          easyrewards_id: easyRewardsId,
                                      }))
                                  ),
                              ],
                              total: sum([...getPaymentList(data.extra).map((v) => v.subtotal)]),
                              hotel_id,
                              usuario_id,
                          },
                      }
                    : {}
            checkIn({
                variables: {
                    datos_checkIn: {
                        horas_extra_renta: data.extraHours,
                        early_checkin: data.earlyCheckIn,
                        ...(propinasFormatted.length
                            ? {
                                  propina: {
                                      colaborador_id: data.colaboradorRecibioPropina.id,
                                      detalles_pago: propinasFormatted,
                                      turno_id: turno_hotel_id,
                                  },
                              }
                            : {}),
                        hospedajes_extra_renta: areSameDay(
                            UTCStringToLocalDate(location?.state?.reservaSeleccionada?.fecha_salida),
                            data.date[1]
                        )
                            ? 0
                            : diffDays(
                                  UTCStringToLocalDate(location?.state?.reservaSeleccionada?.fecha_salida),
                                  data.date[1]
                              ) - 1,
                        personas_extra_renta: data.extraUsers - location?.state?.reservaSeleccionada?.personas_extras,
                        ...(data.matricula
                            ? {
                                  vehiculo: {
                                      modelo: data.modelo,
                                      matricula: data.matricula,
                                      color: data.color,
                                      marca: data.marca,
                                  },
                              }
                            : {}),
                        fecha_salida: location?.state?.reservaSeleccionada.fecha_salida,
                        tipo_entrada: data.entryType as TiposEntradas,
                        usuario_id,
                        reserva_id: location?.state?.reservaSeleccionada.reserva_id,
                        ...(data?.extra?.length && estadoPagoReserva !== "pagado" ? pagoObject : {}),
                        easyrewards_id: easyRewardsId,
                    },
                },
            })
                .then((res) => {
                    showSnackbar({
                        text: `La habitación **${habitacion?.habitacion.tipo_habitacion?.nombre} ${habitacion?.habitacion.numero_habitacion}** ha sido vendida`,
                        status: "success",
                        title: "Renta de habitación exitosa",
                    })
                    dispatch(toggleRoomDetailsDrawer(false))
                    if (res?.data?.checkIn[0]) {
                        window.location.href = `print://${res?.data?.checkIn[0]}_0/`
                    }
                    navigate("/u")
                })
                .catch((err) => {
                    showSnackbar({
                        title: "Error al rentar habitación",
                        status: "error",
                        text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                    })
                })
                .finally(() => {
                    setIsVentaLoading(false)
                    dispatch(toggleRoomDetailsDrawer(false))
                })
            return
        }

        const fecha_checkin = localDateToUTCString(
            setHHMMSS({ startDate: new Date(), newHour: tarifaSeleccionada?.hora_checkin || "", isNewHourInUTC: true })
        )
        const datos_renta: CreateRentaInput = {
            comentarios: [],
            ...(data.type === "hotel" ? { fecha_fin: formattedDate } : {}),
            habitacion_id,
            early_checkin: data.earlyCheckIn,
            fecha_checkin,

            ...(propinasFormatted.length
                ? {
                      propina: {
                          usuario_id,
                          hotel_id,
                          colaborador_id: data.colaboradorRecibioPropina.id,
                          detalles_pago: propinasFormatted,
                          turno_id: turno_hotel_id,
                      },
                  }
                : {}),
            numero_personas: data.users,
            personas_extra: data.extraUsers,
            tarifa_id: data.amount,
            tipo_entrada: data.entryType,
            usuario_id,
            nombre_huesped: data.name.length ? data.name : null,
            total: data.costs.general,
            tipo_alojamiento: data.type,
            horas_extra: data.extraHours,
            hospedajes_extra:
                data.type === "hotel" && data.date[1]
                    ? diffDays(data.date[0], data.date[1]) - 1 < 0
                        ? 0
                        : diffDays(data.date[0], data.date[1]) - 1
                    : extraHospedajes,
            hotel_id,

            ...(data.matricula
                ? {
                      vehiculo: {
                          modelo: data.modelo,
                          matricula: data.matricula,
                          color: data.color,
                          marca: data.marca,
                      },
                  }
                : {}),
            easyrewards_id: easyRewardsId,
        }
        if (data.paymentType === "pendiente") {
            delete datos_renta.pago
            datos_renta.easyrewards_id = easyRewardsId || data.extra[0]?.easyrewards_id || ""
        } else if (data.paymentType === "parcial") {
            const pagosParciales = data.extra.filter((pago) => pago.type === "love_points")
            const totalAbonoParcial = pagosParciales.reduce((acc, pago) => acc + pago.amount, 0)

            datos_renta.pago = {
                detallesPago: getPaymentList(
                    pagosParciales.map((pago) => ({
                        ...pago,
                        easyrewards_id: easyRewardsId,
                    }))
                ),
                total: totalAbonoParcial,
                hotel_id,
                usuario_id,
            }
        } else if (data.extra.length > 0) {
            datos_renta.pago = {
                detallesPago: getPaymentList(
                    data.extra.map((pago) => ({
                        ...pago,
                        tipo_pago: pago.type,
                        easyrewards_id: easyRewardsId,
                    }))
                ),
                total: sum(data.extra.map((pago) => pago.amount)),
                hotel_id,
                usuario_id,
            }
        }
        crearRenta({
            variables: {
                datos_renta,
            },
        })
            .then((res) => {
                showSnackbar({
                    text: `La habitación **${habitacion?.habitacion.tipo_habitacion?.nombre} ${habitacion?.habitacion.numero_habitacion}** ha sido vendida`,
                    status: "success",
                    title: "Renta de habitación exitosa",
                })
                const generatedTicketId = res?.data?.crear_renta?.ticket?.ticket_id[0] || ""
                const generatedFolioRenta = res?.data?.crear_renta?.renta?.renta_id || ""

                ticketIdRef.current = generatedTicketId

                const hasLovePointsPm = data.extra.filter(
                    (pago: { type: TiposPagos }) => pago.type === TiposPagos.LovePoints
                )

                if (hasLovePointsPm.length > 0) {
                    hasLovePointsPm.forEach(async (pago: { number: string; amount: number }) => {
                        const folioToSend = generatedTicketId || generatedFolioRenta
                        const result = await disccountLovePoints(folioToSend, pago.number, pago.amount)

                        if (result === null) {
                            showSnackbar({
                                title: "Error al descontar puntos",
                                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                                status: "error",
                            })
                            setIsVentaLoading(false)
                        }
                    })
                }
                if (turnoAtencionId) {
                    updateListaEspera(turnoAtencionId, EstadosTurnosAtencion.Finalizado)
                }

                window.location.href = generatedTicketId
                    ? `print://${generatedTicketId}_0/`
                    : `print://${generatedFolioRenta}_4/`
                navigate("/u")
                dispatch(toggleRoomDetailsDrawer(false))
            })
            .catch((err) => {
                console.error(err)
                if (
                    err.message ===
                    "No se puede realizar el cobro por concepto de early-checkin despues de la hora de checkin de la tarifa"
                ) {
                    showSnackbar({
                        title: "Error al rentar habitación",
                        status: "error",
                        text: err.message,
                    })
                }
                showSnackbar({
                    title: "Error al rentar habitación",
                    status: "error",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente",
                })
            })
            .finally(() => {
                setIsVentaLoading(false)
            })
    }
    useEscapeKey({
        onEscape: () => {
            if (isModalMatriculaOpen) {
                setIsModalMatriculaOpen(false)
                methods.setValue("entryType", TiposEntradas.APie)
            }
            if (isModalPagoMixtoOpen) {
                methods.setValue("extra", [])
                methods.setValue("method", "")
                dispatch(toggleModalPagoMixtoOpen(false))
                dispatch(toggleModalPagoMixtoEdited(false))
                return
            }
            navigate("/u")
        },
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
                response.data.descuenta_puntos.saldo
            } else {
                return showSnackbar({
                    title: "Error al descontar puntos",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            }
        } catch {
            return showSnackbar({
                title: "Error al descontar puntos",
                text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                status: "error",
            })
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

    /** función para actualizar el estado del turno en lista de espera */
    const updateListaEspera = async (turno_atencion_id: string, estado: EstadosTurnosAtencion) => {
        try {
            await actualizarListaEspera({
                variables: {
                    input: {
                        turno_atencion_id,
                        estado,
                    },
                },
            })
        } catch (error) {
            showSnackbar({
                title: "Error al atender turno",
                text: `¡Ups! Ocurrió un error al atender el turno  **${folioListaEspera}**`,
                status: "error",
            })
        }
    }

    return (
        <Screen
            title={`Venta habitación ${habitacion?.habitacion?.tipo_habitacion?.nombre || ""} ${
                habitacion?.habitacion.numero_habitacion || ""
            }${folioListaEspera ? ` - Turno ${folioListaEspera}` : ""} `}
            back
            onBack={async () => {
                if (turnoAtencionId) {
                    await updateListaEspera(turnoAtencionId, EstadosTurnosAtencion.EnEspera)
                    navigate(-1)
                } else {
                    navigate("/u")
                }

                dispatch(toggleRoomDetailsDrawer(false))
            }}
            className="venta-habitacion__container"
        >
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="venta-habitacion__sections">
                        <div className="venta-habitacion__sections__form">
                            <div className="venta-habitacion__header-labels">
                                <LabelTitle
                                    icon="openDoor"
                                    text={`Habitación ${habitacion?.habitacion.tipo_habitacion?.nombre || ""}`}
                                />
                                {habitacion?.habitacion.tipo_habitacion?.camas?.map((c) => (
                                    <LabelTitle
                                        key={uuid()}
                                        icon="BedFilled"
                                        text={`${c.numero || ""} cama(s) ${c.tipo}(es)`}
                                    />
                                ))}
                                <LabelTitle
                                    icon="UserParentFill"
                                    text={`${
                                        habitacion?.habitacion.tipo_habitacion?.personas_incluidas || "-"
                                    } personas`}
                                />
                                <LabelTitle
                                    icon="userAdd"
                                    text={`Máximo ${tarifaSeleccionada?.personas_extra_max || "-"} personas extra`}
                                />
                            </div>
                            <FormSection title="">
                                <FormSectionRow>
                                    <Controller
                                        control={methods.control}
                                        name={"type"}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <InputTabs
                                                disabled={isVentaLoading || isDataLoading}
                                                containerClassName="venta-habitacion-input"
                                                label="Tipo"
                                                items={newScheduleTypes}
                                                value={value}
                                                onChange={(e) =>
                                                    location?.state?.reservaSeleccionada ? null : onChange(e)
                                                }
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name={"amount"}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange }, formState: { errors } }) => (
                                            <div className="venta-habitacion-input">
                                                <Dropdown
                                                    disabled={location?.state?.reservaSeleccionada}
                                                    icon={"dollarCircle"}
                                                    iconInOptions={false}
                                                    errorHintText={errors.amount ? "Selecciona una opción" : ""}
                                                    label={"Tipo de tarifa"}
                                                    placeholder={"Selecciona una tarifa"}
                                                    options={tarifas
                                                        .filter(
                                                            (t) =>
                                                                t.tipo_alojamiento === tipoHospedaje &&
                                                                validationByDate(t, dateRange?.[0])
                                                        )
                                                        .map((t) => ({
                                                            label: `${t.nombre} - ${getCurrencyFormat(
                                                                t?.costo_habitacion
                                                            )}`,
                                                            value: t.tarifa_id,
                                                        }))}
                                                    value={value}
                                                    onClick={({ value }) => {
                                                        onChange(value)
                                                        selectTarifa(tarifas?.find?.((t) => t.tarifa_id === value))
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                    {tipoHospedaje === "hotel" && (
                                        <Controller
                                            name="date"
                                            control={methods.control}
                                            rules={{
                                                required: true,
                                                validate: (v) => v.length > 1,
                                            }}
                                            // onChange del Controller le da el nuevo valor al input dentro del estado del formulario y le establece también el valor a este DatePicker
                                            render={({
                                                field: { onChange: onFieldChange, value: fieldValue },
                                                formState: { errors },
                                            }) => (
                                                <InputDate
                                                    modalClosableOnClickOutside
                                                    disabled={location?.state?.reservaSeleccionada}
                                                    selectableOnDblClick={isBetween12AMAndCheckOutHour}
                                                    placeholder="Selecciona una fecha"
                                                    label="Fecha de entrada y salida"
                                                    inputClassName="venta-habitacion-input"
                                                    isRange={true}
                                                    onReset={() => {
                                                        onFieldChange([
                                                            setHHMMSS({
                                                                startDate: new Date(),
                                                                newHour: "00:00:00",
                                                                isNewHourInUTC: false,
                                                            }),
                                                        ])
                                                    }}
                                                    disabledBeforeOrEqualDate={substractDays({
                                                        date: new Date(),
                                                        days: 1,
                                                    })}
                                                    disabledAfterOrEqualDate={
                                                        !fieldValue.length
                                                            ? new Date()
                                                            : fieldValue.length === 2 && fieldValue[1] === fieldValue[2]
                                                            ? fieldValue[1]
                                                            : fieldValue.length === 2
                                                            ? addDays({ date: fieldValue[1], days: 1 })
                                                            : undefined
                                                    }
                                                    onChangeDblClick={(date) => {
                                                        onFieldChange([date, date])
                                                    }}
                                                    onChange={(date) => {
                                                        if (fieldValue.length === 0) {
                                                            onFieldChange([date])
                                                            return
                                                        }
                                                        if (date <= fieldValue[0]) {
                                                            onFieldChange([date])
                                                            return
                                                        }
                                                        if (fieldValue?.length === 2 && areSameDay(new Date(), date)) {
                                                            onFieldChange([date])
                                                            return
                                                        }
                                                        if (fieldValue?.length === 2) {
                                                            onFieldChange([])
                                                            return
                                                        }
                                                        onFieldChange([fieldValue[0], date])
                                                    }}
                                                    value={fieldValue}
                                                    errorHintText={errors.date ? "Selecciona un rango de fechas" : ""}
                                                />
                                            )}
                                        />
                                    )}

                                    {tipoHospedaje === "motel" && (
                                        <Controller
                                            control={methods.control}
                                            name={"extraHospedajes"}
                                            rules={{ required: false, min: 0 }}
                                            render={({ field: { value, onChange } }) => (
                                                <div className="venta-h-screen__count" style={{ columnGap: 20 }}>
                                                    <p className="venta-h-screen__count__label">
                                                        Hospedaje extra
                                                        {tarifaSeleccionada !== null ? (
                                                            <span>{`(${getCurrencyFormat(
                                                                tarifaSeleccionada?.costo_hospedaje_extra
                                                            )} c/u)`}</span>
                                                        ) : null}
                                                    </p>
                                                    <Counter
                                                        stepCount={1}
                                                        title="Horas extra"
                                                        className="venta-h-screen__counter"
                                                        max={undefined}
                                                        disabled={false}
                                                        min={0}
                                                        value={value}
                                                        onClick={onChange}
                                                        disable={false}
                                                    />
                                                </div>
                                            )}
                                        />
                                    )}
                                </FormSectionRow>
                                <FormSectionRow>
                                    {tarifaSeleccionada?.costo_hora_extra !== undefined &&
                                        tarifaSeleccionada?.costo_hora_extra > 0 && (
                                            <Controller
                                                control={methods.control}
                                                name={"extraHours"}
                                                rules={{ required: false, min: 0 }}
                                                render={({ field: { value, onChange } }) => (
                                                    <div
                                                        className="venta-h-screen__count"
                                                        style={{ columnGap: 10, marginTop: 10 }}
                                                    >
                                                        <p className="venta-h-screen__count__label">
                                                            Horas extra
                                                            {tarifaSeleccionada !== null ? (
                                                                <span>{`(${getCurrencyFormat(
                                                                    tarifaSeleccionada?.costo_hora_extra
                                                                )} c/u)`}</span>
                                                            ) : null}
                                                        </p>
                                                        <Counter
                                                            stepCount={2}
                                                            title="Horas extra"
                                                            className="venta-h-screen__counter"
                                                            max={2}
                                                            min={0}
                                                            disabled={false}
                                                            value={value}
                                                            onClick={onChange}
                                                            disable={location?.state?.reservaSeleccionada}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        )}
                                    {tipoHospedaje === TiposAlojamientos.Hotel && (
                                        <Controller
                                            control={methods.control}
                                            name={"earlyCheckIn"}
                                            render={({ field: { value, onChange } }) => (
                                                <div
                                                    className="venta-h-screen__early"
                                                    style={{
                                                        marginTop:
                                                            tarifaSeleccionada?.costo_hora_extra !== undefined &&
                                                            tarifaSeleccionada?.costo_hora_extra > 0
                                                                ? 30
                                                                : 10,
                                                    }}
                                                >
                                                    <Switch
                                                        value={value}
                                                        disabled={
                                                            !!(
                                                                // si no hay costo_early_checkin deshabilitar
                                                                (
                                                                    !tarifaSeleccionada?.costo_early_checkin ||
                                                                    // se corrige deshabilitar el switch de checkin anticipado después de la hora del checkin
                                                                    !isBetween12AMAndCheckInHour ||
                                                                    // Si no hay fecha 1 deshabilitar
                                                                    !dateRange[0] ||
                                                                    // Si no hay fecha 2 deshabilitar
                                                                    !dateRange[1]
                                                                )
                                                                //|| areSameDay(dateRange[0], dateRange[1])
                                                            )
                                                        }
                                                        label={
                                                            <div>
                                                                <span>Check-in anticipado </span>
                                                                {tarifaSeleccionada?.costo_early_checkin ? (
                                                                    <span className="venta-h-screen__check-anticipado__label">
                                                                        +
                                                                        {formatCurrency(
                                                                            tarifaSeleccionada.costo_early_checkin
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <></>
                                                                )}
                                                            </div>
                                                        }
                                                        onChange={onChange}
                                                    />
                                                </div>
                                            )}
                                        />
                                    )}
                                </FormSectionRow>
                            </FormSection>
                            <FormSection title="Huésped">
                                <FormSectionRow>
                                    <Controller
                                        control={methods.control}
                                        name={"name"}
                                        render={({ field: { value, onChange } }) => (
                                            <InputText
                                                icon={Icon}
                                                iconProps={{
                                                    name: "userFilled",
                                                    ...inputIconStyle,
                                                }}
                                                inputWrapperClass="venta-habitacion-input"
                                                label={"Nombre completo (Opcional)"}
                                                type={"text"}
                                                placeholder={"Escribe el nombre"}
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                                onKeyUp={(e) => {
                                                    if (e.key === "Enter") e.preventDefault()
                                                }}
                                                loader={loading}
                                                onBlur={() => {
                                                    getIncidenciasHuesped({
                                                        variables: {
                                                            hotel_id,
                                                            matricula: null,
                                                            huesped: nombreHuesped || null,
                                                        },
                                                    })
                                                }}
                                                error={!!nombreHuesped && !!incidenciasHuesped?.incidencias[0]}
                                                errorhinttext={
                                                    "Huésped con reporte de incidencia. Más detalle en el módulo de incidencias."
                                                }
                                            />
                                        )}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name={"entryType"}
                                        rules={{ required: true }}
                                        render={({ field: { value, onChange } }) => (
                                            <InputTabs
                                                className="venta-habitacion-input"
                                                label={"Tipo de entrada"}
                                                items={entryTypes}
                                                value={value}
                                                onChange={onChange}
                                            />
                                        )}
                                    />
                                    <ModalMatricula
                                        isOpenFromState={isModalMatriculaOpenFromState}
                                        isOpen={isModalMatriculaOpen}
                                        onClose={() => {
                                            setIsModalMatriculaOpen(false)
                                            getIncidenciasMatricula({
                                                variables: {
                                                    hotel_id,
                                                    matricula: matricula || null,
                                                    huesped: null,
                                                },
                                            })
                                        }}
                                        onCancel={() => {
                                            methods.setValue("entryType", entryTypes[0].value as TiposEntradas)
                                            setIsModalMatriculaOpen(false)
                                        }}
                                    />
                                    {!!matricula && (
                                        <div>
                                            <div className="venta-h-screen__edit-matricula__wrapper">
                                                <span
                                                    onClick={() => {
                                                        setIsModalMatriculaOpen(true)
                                                        setIsModalMatriculaOpenFromState("toEdit")
                                                    }}
                                                    className="venta-h-screen__edit-matricula"
                                                >
                                                    {modeloAuto} {matricula}
                                                </span>
                                                <Icon name="pencil" color="var(--primary)" width={20} height={20} />
                                            </div>
                                            <p className="venta-h-screen__edit-matricula--error">
                                                {incidenciasMatricula?.incidencias[0]
                                                    ? "Esta matrícula cuenta con reporte de incidencia. Consulta el módulo de incidencias para saber más."
                                                    : null}
                                            </p>
                                        </div>
                                    )}
                                </FormSectionRow>
                                <FormSectionRow>
                                    <Controller
                                        control={methods.control}
                                        name={"users"}
                                        rules={{ required: true, min: 1 }}
                                        render={({ field: { value, onChange } }) => (
                                            <div className="venta-h-screen__count">
                                                <p className="venta-h-screen__count__label">Personas</p>
                                                <Counter
                                                    title="personas"
                                                    style={{ marginRight: "40px" }}
                                                    className="venta-h-screen__counter"
                                                    max={
                                                        habitacion?.habitacion.tipo_habitacion?.personas_incluidas || 0
                                                    }
                                                    disabled={false}
                                                    min={location?.state?.reservaSeleccionada?.numero_personas || 1}
                                                    value={value}
                                                    onClick={(lvalue) => {
                                                        const valueNumPersonasExtra =
                                                            methods.getValues("extraUsers") || 0
                                                        if (valueNumPersonasExtra > 0 && lvalue < value) {
                                                            methods.setValue("extraUsers", valueNumPersonasExtra - 1)
                                                            onChange(value)
                                                        } else {
                                                            onChange(lvalue)
                                                        }
                                                    }}
                                                    disable={
                                                        !habitacion?.habitacion.tipo_habitacion?.personas_incluidas ||
                                                        Number(
                                                            habitacion?.habitacion.tipo_habitacion?.personas_incluidas
                                                        ) === 0
                                                    }
                                                    errorHintText={
                                                        methods.formState?.errors?.users
                                                            ? "*El número de personas es requerido"
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                    <Controller
                                        control={methods.control}
                                        name={"extraUsers"}
                                        rules={{ required: false, min: 0 }}
                                        render={({ field: { value, onChange } }) => (
                                            <div className="venta-h-screen__count">
                                                <p className="venta-h-screen__count__label">
                                                    Personas extra
                                                    {tarifaSeleccionada !== null ? (
                                                        <span>{`(${getCurrencyFormat(
                                                            tarifaSeleccionada?.costo_persona_extra
                                                        )} c/u)`}</span>
                                                    ) : null}
                                                </p>
                                                <Counter
                                                    title="Personas extra"
                                                    className="venta-h-screen__counter"
                                                    longTextLimit={
                                                        tarifaSeleccionada &&
                                                        tarifaSeleccionada.personas_extra_max &&
                                                        extraUsers > tarifaSeleccionada?.personas_extra_max
                                                            ? "Límite de personas extra superado, necesitarás PIN para vender"
                                                            : ""
                                                    }
                                                    //max={tarifaSeleccionada?.personas_extra_max || 0}
                                                    min={location?.state?.reservaSeleccionada?.personas_extras || 0}
                                                    value={value}
                                                    onClick={(lvalue) => {
                                                        const valueNumPersonas = methods.getValues("users") || 0
                                                        const numMaxPersonas =
                                                            habitacion?.habitacion.tipo_habitacion
                                                                ?.personas_incluidas || 0
                                                        if (valueNumPersonas >= numMaxPersonas) {
                                                            onChange(lvalue)
                                                        } else if (lvalue > (value || 0)) {
                                                            methods.setValue("users", valueNumPersonas + lvalue)
                                                        }
                                                    }}
                                                    disable={
                                                        !tarifaSeleccionada?.personas_extra_max ||
                                                        Number(tarifaSeleccionada?.personas_extra_max) === 0 ||
                                                        location?.state?.reservaSeleccionada
                                                    }
                                                />
                                            </div>
                                        )}
                                    />
                                </FormSectionRow>
                            </FormSection>
                            {isShowingPago && (
                                <FormSection title="Pago" style={{ marginBottom: 0 }}>
                                    <FormSectionRow>
                                        {rolName === RoleNames.valet && (
                                            <div
                                                className="venta-habitacion__inputs"
                                                style={{ margin: 0, marginTop: "16px" }}
                                            >
                                                <PaymentTypeField
                                                    setLovePointsAmount={setLovePointsAmount}
                                                    lovePointsAmount={lovePointsAmount}
                                                />
                                                <PaymentMethodField
                                                    setLovePointsAmount={setLovePointsAmount}
                                                    lovePointsAmount={lovePointsAmount}
                                                />
                                                <CardNumber />
                                            </div>
                                        )}
                                        {rolName !== RoleNames.valet && (
                                            <>
                                                <Controller
                                                    control={methods.control}
                                                    name={"method"}
                                                    rules={{ required: true }}
                                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                                        <div className="payment-method-field__wrapper">
                                                            <div className="venta-habitacion-input">
                                                                <Dropdown
                                                                    placement={"top"}
                                                                    icon={"creditCard"}
                                                                    iconInOptions={false}
                                                                    errorHintText={
                                                                        errors?.method ? "Selecciona una opción" : ""
                                                                    }
                                                                    label={"Método de pago"}
                                                                    placeholder={"Selecciona una opción"}
                                                                    options={[...usePaymentOptions()]}
                                                                    value={value || PAYMENT_METHODS.efectivo.value}
                                                                    onClick={({ value }) => {
                                                                        onChange(value)
                                                                        if (value === PAYMENT_TYPES.mixto) {
                                                                            dispatch(toggleModalPagoMixtoOpen(true))
                                                                        } else {
                                                                            const costs = methods.getValues("costs")
                                                                            methods.setValue("extra", [
                                                                                {
                                                                                    amount: costs?.general,
                                                                                    type: value,
                                                                                    number: "",
                                                                                    easyrewards_id:
                                                                                        lovePointsAmount?.id,
                                                                                },
                                                                            ])
                                                                            methods.setValue("costs", {
                                                                                ...costs,
                                                                                total: 0,
                                                                            })
                                                                        }
                                                                    }}
                                                                />
                                                            </div>

                                                            {!isModalPagoMixtoOpen && value === "mixto" ? (
                                                                <span
                                                                    className="payment-method-field__link"
                                                                    style={{ marginTop: 32 }}
                                                                    onClick={() => {
                                                                        dispatch(toggleModalPagoMixtoOpen(true))
                                                                        dispatch(toggleModalPagoMixtoEdited(true))
                                                                    }}
                                                                >
                                                                    {"Editar"}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    )}
                                                />

                                                <ModalMixto
                                                    paymentOptions={[
                                                        PAYMENT_METHODS.efectivo,
                                                        PAYMENT_METHODS.visaOMasterCard,
                                                        PAYMENT_METHODS.amex,
                                                        PAYMENT_METHODS.depositoOTransferencia,
                                                        PAYMENT_METHODS.cortesia,
                                                        PAYMENT_METHODS.consumoInterno,
                                                    ]}
                                                    visible={isModalPagoMixtoOpen}
                                                    edited={isModalPagoMixtoEdited}
                                                    onLovePointsChange={handleLovePointsChange}
                                                    onClose={() => {
                                                        dispatch(toggleModalPagoMixtoOpen(false))
                                                        dispatch(toggleModalPagoMixtoEdited(false))
                                                    }}
                                                />
                                                <div className="payment-method-fields">
                                                    {(methods.getValues("method") ===
                                                        PAYMENT_METHODS.visaOMasterCard.value ||
                                                        methods.getValues("method") === PAYMENT_METHODS.amex.value ||
                                                        methods.getValues("method") ===
                                                            PAYMENT_METHODS.depositoOTransferencia.value) && (
                                                        <>
                                                            <div>
                                                                <CardNumberField
                                                                    setLovePointsAmount={setLovePointsAmount}
                                                                />
                                                            </div>
                                                            <div className="easyrewards-abonar__input-text">
                                                                <AbonarEasyRewardsField
                                                                    setLovePointsAmount={setLovePointsAmount}
                                                                    lovePointsAmount={lovePointsAmount}
                                                                />
                                                            </div>
                                                        </>
                                                    )}

                                                    {methods.getValues("method") === PAYMENT_METHODS.mixto.value && (
                                                        <div className="easyrewards-abonar__input-text">
                                                            <AbonarEasyRewardsField
                                                                setLovePointsAmount={
                                                                    methods.getValues("method") ===
                                                                    PAYMENT_TYPES.LovePoints
                                                                        ? handleLovePointsChange
                                                                        : setLovePointsAmount
                                                                }
                                                                lovePointsAmount={lovePointsAmount}
                                                            />
                                                        </div>
                                                    )}

                                                    {methods.getValues("method") === PAYMENT_METHODS.efectivo.value && (
                                                        <div className="easyrewards-abonar__input-text">
                                                            <AbonarEasyRewardsField
                                                                setLovePointsAmount={setLovePointsAmount}
                                                                lovePointsAmount={lovePointsAmount}
                                                            />
                                                        </div>
                                                    )}

                                                    {methods.getValues("method") ===
                                                        PAYMENT_METHODS.lovePoints.value && (
                                                        <>
                                                            <CardNumberField
                                                                setLovePointsAmount={setLovePointsAmount}
                                                            />
                                                            {withEasyrewards && (
                                                                <div className="venta-habitacion__consultar-saldo">
                                                                    <span
                                                                        className="venta-habitacion__consultar-saldo__link"
                                                                        onClick={() => {
                                                                            const numero = methods
                                                                                .getValues("extra.0.number")
                                                                                ?.trim()
                                                                            if (!numero) return

                                                                            if (!lovePointsAmount?.id) {
                                                                                return
                                                                            } else if (lovePointsAmount?.saldo === 0) {
                                                                                setModalMessage(
                                                                                    "Tu saldo actual de Love Points es insuficiente. Actualmente tienes 0 puntos disponibles. Intenta con otro método de pago."
                                                                                )
                                                                                setModalLovePointsErrorOpen(true)
                                                                                return
                                                                            } else {
                                                                                setModalPagoMixtoLovePointsOpen(true)
                                                                            }
                                                                        }}
                                                                        style={{
                                                                            cursor: methods
                                                                                .getValues("extra.0.number")
                                                                                ?.trim()
                                                                                ? "pointer"
                                                                                : "not-allowed",
                                                                            opacity: methods
                                                                                .getValues("extra.0.number")
                                                                                ?.trim()
                                                                                ? 1
                                                                                : 0.5,
                                                                        }}
                                                                    >
                                                                        Consultar saldo
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </FormSectionRow>
                                </FormSection>
                            )}
                            {isShowingPagoReserva && !isShowingPago && location?.state?.reservaSeleccionada && (
                                <FormSection title="Pago" style={{ marginBottom: 0 }}>
                                    <FormSectionRow>
                                        <div className="easyrewards-abonar__input-text">
                                            <AbonarEasyRewardsField
                                                setLovePointsAmount={setLovePointsAmount}
                                                lovePointsAmount={lovePointsAmount}
                                            />
                                        </div>
                                    </FormSectionRow>
                                </FormSection>
                            )}
                            {rolName !== RoleNames.valet && (
                                <>
                                    {isValidPropina(method) && !location?.state?.reservaSeleccionada && (
                                        <FormSection title="Propina (opcional)" toggable>
                                            <FormSectionRow style={{ alignItems: "center" }}>
                                                <Controller
                                                    name="porcentajePropina"
                                                    control={methods.control}
                                                    render={({ field: { onChange, value } }) => (
                                                        <InputTabs
                                                            className={"registro-incidencia__tabs-place"}
                                                            label={"Monto o porcentaje"}
                                                            items={[
                                                                {
                                                                    bigLabel: "10%",
                                                                    label: `$${times(costos.general, 0.1)}`,
                                                                    value: "0.1",
                                                                },
                                                                {
                                                                    bigLabel: "15%",
                                                                    label: `$${times(costos.general, 0.15)}`,
                                                                    value: "0.15",
                                                                },
                                                                {
                                                                    label: "Otro monto",
                                                                    icon: "dollarCircle",
                                                                    value: "Otro",
                                                                },
                                                            ]}
                                                            withCheckOnSelected
                                                            value={value + ""}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                />
                                                {porcentajePropina === "Otro" && (
                                                    <Controller
                                                        control={methods.control}
                                                        name="montoPropina"
                                                        rules={{ required: true, validate: (v) => (v || 0) > 0 }}
                                                        render={({
                                                            field: { onChange, value },
                                                            fieldState: { error },
                                                        }) => (
                                                            <InputMoney
                                                                value={value}
                                                                onChange={onChange}
                                                                inputWrapperClass="venta-habitacion-input"
                                                                placeholder="Monto de propina"
                                                                label="Monto de propina"
                                                                icon={DollarCircle}
                                                                error={!!error}
                                                                errorhinttext={
                                                                    error?.type === "validate"
                                                                        ? "Ingresa una propina mayor a 0"
                                                                        : ""
                                                                }
                                                            />
                                                        )}
                                                    />
                                                )}
                                            </FormSectionRow>
                                            <FormSectionRow>
                                                <Controller
                                                    control={methods.control}
                                                    name="colaboradorRecibioPropina"
                                                    rules={{
                                                        required: !!propinasFormatted.length,
                                                        validate: (v) =>
                                                            !propinasFormatted.length || (!!v?.id && !!v?.title),
                                                    }}
                                                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                        <InputTextSuggestions
                                                            suggestionsListWidth="255px"
                                                            className="venta-habitacion-input"
                                                            suggestions={
                                                                colaboradores?.colaboradores?.map((c) => ({
                                                                    title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                                    id: c.colaborador_id,
                                                                })) || []
                                                            }
                                                            value={value || ""}
                                                            inputTextConfig={{
                                                                label: "¿Quién recibió la propina?",
                                                                placeholder: "Nombre del personal",
                                                                type: "text",
                                                                icon: accountBoxFill,
                                                                error: !!error,
                                                                errorhinttext:
                                                                    error?.type === "validate" ||
                                                                    error?.type === "required"
                                                                        ? "Escribe el nombre del responsable"
                                                                        : "",
                                                            }}
                                                            onChange={onChange}
                                                        />
                                                    )}
                                                />
                                            </FormSectionRow>
                                        </FormSection>
                                    )}
                                </>
                            )}
                            {method === PAYMENT_TYPES.mixto &&
                                !!propinasFormatted?.length &&
                                !location?.state?.reservaSeleccionada && (
                                    <FormSection title="Propina">
                                        <FormSectionRow>
                                            <Controller
                                                control={methods.control}
                                                name="colaboradorRecibioPropina"
                                                rules={{
                                                    required: true,
                                                    validate: (v) => !!v?.id && !!v?.title,
                                                }}
                                                render={({ field: { value, onChange }, fieldState: { error } }) => (
                                                    <InputTextSuggestions
                                                        suggestionsListWidth="255px"
                                                        suggestions={
                                                            colaboradores?.colaboradores?.map((c) => ({
                                                                title: `${c.nombre} ${c.apellido_paterno} ${c.apellido_materno}`,
                                                                id: c.colaborador_id,
                                                            })) || []
                                                        }
                                                        value={value || ""}
                                                        inputTextConfig={{
                                                            inputWrapperClass: "venta-habitacion-input",
                                                            label: "¿Quién recibió la propina?",
                                                            placeholder: "Nombre del personal",
                                                            type: "text",
                                                            icon: accountBoxFill,
                                                            error: !!error,
                                                            errorhinttext:
                                                                error?.type === "validate"
                                                                    ? "Escribe el nombre del responsable"
                                                                    : "",
                                                        }}
                                                        onChange={onChange}
                                                    />
                                                )}
                                            />
                                        </FormSectionRow>
                                    </FormSection>
                                )}
                        </div>
                        <Resumen
                            disabled={isVentaLoading || isDataLoading}
                            totalPropinas={sum(propinasFormatted.map((p) => p.subtotal))}
                            roomDays={roomDays}
                            lovePointsAmount={lovePointsAmount}
                            hotelId={hotel_id}
                            pagos={[
                                ...pagos.map((pago, index) => {
                                    return {
                                        montoPropina: propinas
                                            ? propinas?.find((p) => Number(p?.id) === index)?.value
                                            : Number(montoPropina) || 0,
                                        amount:
                                            pago.type === PAYMENT_TYPES.LovePoints
                                                ? pago.amount || costos.total
                                                : pago.amount || 0,
                                        type: pago.type,
                                        number: pago.number,
                                        easyrewards_id: lovePointsAmount?.id,
                                    }
                                }),
                                ...(location?.state?.reservaSeleccionada?.pagos?.flatMap(
                                    (p) =>
                                        p.detalles_pago?.flatMap((dp) => ({
                                            amount: dp.subtotal || 0,
                                            type: dp.tipo_pago || "",
                                            number: dp.ultimos_digitos || dp?.numero_referencia || "",
                                            easyrewards_id: lovePointsAmount?.id,
                                        })) || []
                                ) || []),
                            ]}
                            totalAdelantosReserva={sum(
                                location?.state?.reservaSeleccionada?.pagos?.map((p) => p.total) || []
                            )}
                            costs={costos}
                            placas={matricula}
                            modelo={modeloAuto}
                            marca={marcaAuto}
                            color={colorAuto}
                            startDate={dateRange?.[0] ? localDateToUTCString(dateRange?.[0]) : undefined}
                            endDate={dateRange?.[1] ? localDateToUTCString(dateRange?.[1]) : undefined}
                            nombreHuesped={nombreHuesped}
                            personas={personas}
                            personasExtras={extraUsers}
                            personasExtrasMax={tarifaSeleccionada?.personas_extra_max || 0}
                            tipoEntrada={tipoEntrada}
                            tarifa={
                                tarifaSeleccionada
                                    ? `${tarifaSeleccionada?.nombre} - 
                                    ${formatCurrency(tarifaSeleccionada?.costo_habitacion)}`
                                    : ""
                            }
                            tipoTarifa={tipoHospedaje}
                            horasExtras={extraHours}
                            isMixto={method === "mixto"}
                            onSubmit={() => methods.handleSubmit(onSubmit)()}
                            experiencias={experiencias}
                            extraHospedajes={extraHospedajes}
                        />
                    </div>
                </form>
                <LoaderComponent visible={isVentaLoading} />
                {isModalLovePointsErrorOpen && (
                    <ModalLovePointsError
                        isOpen={isModalLovePointsErrorOpen}
                        setIsOpen={setModalLovePointsErrorOpen}
                        description={modalMessage}
                        onCloseDialog={() => setModalLovePointsErrorOpen(false)}
                    />
                )}
                <ModalPagoMixtoLovePoints
                    visible={isModalPagoMixtoLovePointsOpen}
                    onClose={() => setModalPagoMixtoLovePointsOpen(false)}
                    lovePointsAmount={lovePointsAmount}
                    paymentOptions={[
                        PAYMENT_METHODS.efectivo,
                        PAYMENT_METHODS.visaOMasterCard,
                        PAYMENT_METHODS.amex,
                        PAYMENT_METHODS.cortesia,
                        PAYMENT_METHODS.consumoInterno,
                        PAYMENT_METHODS.depositoOTransferencia,
                    ]}
                />
            </FormProvider>
            {Modal}
            {ModalAuthCortesiaFromMixto}
            {ModalAuthCortesia}
        </Screen>
    )
}

export default VentaHabitacion
