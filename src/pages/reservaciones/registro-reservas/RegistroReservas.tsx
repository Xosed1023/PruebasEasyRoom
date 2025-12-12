import React, { useEffect, useState } from "react"
import "./RegistroReservas.css"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import MiniRoomTypeCard from "src/shared/components/data-display/tooltip/MiniRoomTypeCard/MiniRoomTypeCard"
import { Button, InputCurrency, InputText } from "src/shared/components/forms"
import { OptionCurrency } from "src/shared/components/forms/input-currency/types/option-currency.interface"
import Counter from "src/shared/components/forms/counter/Counter"
import { useForm, Controller } from "react-hook-form"
import { defaultValues, FormValues, getKey, LimiteReservaModal } from "./registro-reservas"
import { useLocation, useNavigate } from "react-router-dom"
import Screen from "src/shared/components/layout/screen/Screen"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import iconHash from "src/shared/icons/iconHash"
import book2Fill from "src/shared/icons/book2Fill"
import AlertReservas from "./alerta-reservas-max"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import {
    EstatusTarifa,
    OrigenRservas,
    useGetExperienciasLazyQuery,
    useGetTiposHabitacionQuery,
    useTarifasLazyQuery,
} from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import { getCurrencyFormat } from "src/utils/string"
import { getLimiteReserva } from "../helpers/limiteReserva"
import { getExactDate } from "src/utils/date"
import { v4 as uuid } from "uuid"
import DatePicker from "src/shared/components/forms/date-picker/DatePicker"
import { useDate } from "src/shared/hooks/useDate"
import { capitalize } from "src/shared/helpers/capitalize"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useTarifasValidation } from "./hooks/useTarifasValidation"
import MultipleSelectDropdown from "src/shared/components/forms/MultipleSelectDropdown/MultipleSelectDropdown"
import useGetCurrentDate from "src/shared/hooks/useGetCurrentDate"
import { addDays } from "src/shared/helpers/addDays"

const RegistroReservas = () => {
    const { hotel_id, zona_horaria } = useProfile()
    const [origenReserva] = useState(
        Object.keys(OrigenRservas).map((key) => {
            return key === "Telefono" ? "Teléfono" : key === "Recepcion" ? "Recepción" : key
        })
    )
    const location = useLocation()
    const [numMaxPersonas, setNumMaxPersonas] = useState<number>(0)
    const [alerta, setAlerta] = useState<LimiteReservaModal>({ visible: false, date: "" })
    const [calendarLoad, setCalendarLoad] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(false)

    const navigate = useNavigate()
    const { areSameDay } = useDate(zona_horaria)
    const goBackState = location.state
    const { currentDate: dateHotel } = useGetCurrentDate()

    const reserva = goBackState?.reservaEdit !== undefined ? goBackState?.reservaEdit : goBackState

    const {
        control,
        watch,
        handleSubmit,
        unregister,
        getValues,
        reset,
        setValue,
        formState: { errors, isDirty },
        setError,
    } = useForm<FormValues>({
        defaultValues,
    })

    const tipoDeHabitacion = watch("tipoDeHabitacion")
    const tipoTarifaSelected = watch("tipoTarifa")

    const otros = watch("tipoTarifa")?.nombre === "Otros"
    const valueNumPersonas = watch("cantidadPersonas")
    const valueNumPersonasExtra: number = watch("cantidadPersonasExtra") || 0
    const totalPersonas = valueNumPersonas + valueNumPersonasExtra
    const origen = watch("origenReserva")
    const fechaReserva = watch("fechaReserva")
    const reservaIdSaved = watch("reservaIdSaved")
    const folioSaved: number = watch("folioSaved") || 0
    const experienciasSaved = watch("experienciasSaved") || []
    const valueMinNumPersonasExtra = reserva?.reservaIdSaved ? reserva?.cantidadPersonasExtra || 0 : 0

    const [origenFiltroVisual, setOrigenFiltroVisual] = useState<boolean>(true)

    const [getExperiencias, { data }] = useGetExperienciasLazyQuery({
        variables: { hotel_id: hotel_id },
    })

    const [getTarifas] = useTarifasLazyQuery()

    const [tiposTarifaDisplayed, setTiposTarifaDisplayed] = useState<any[]>([])
    const [tarifasList, setTarifasList] = useState<any[]>([])

    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<any[]>([])

    const { data: tiposHabitacion } = useGetTiposHabitacionQuery({
        variables: { hotel_id: hotel_id },
    })

    const { validationByDate } = useTarifasValidation()

    useEffect(() => {
        if (tiposHabitacion?.tipo_habitaciones?.length) {
            tiposHabitacion.tipo_habitaciones.forEach((tipo) => {
                getTarifas({ variables: { tipo_habitacion_id: tipo.tipo_habitacion_id, hotel_id } }).then((d) => {
                    const tarifas = d?.data?.tarifas || []
                    const habitacionesConReserva = tarifas.filter(
                        (t) => !t.eliminado && t.estatus === EstatusTarifa.Activa && t.tipo_tarifa.includes("reserva")
                    )
                    const desactivarHabitacion = tarifas.every(
                        (tarifa) => tarifa.costo_habitacion < reserva?.costoTarifa
                    )

                    if (habitacionesConReserva.length > 0) {
                        setHabitacionesFiltradas((prev) => [
                            ...prev,
                            { ...tipo, desactivar: reserva?.reservaIdSaved ? desactivarHabitacion : false },
                        ])
                    }
                })
            })
        }
    }, [tiposHabitacion])

    useEffect(() => {
        if (getValues("tipoDeHabitacion").id === "" && hotel_id === "515e9f84-35f7-4d80-b4b7-b49c4bff4739") {
            setValue(
                "tipoDeHabitacion.id",
                tiposHabitacion?.tipo_habitaciones[0].tipo_habitacion_id || "19d9c96e-9689-4198-9a6e-67358663c8b0"
            )
            setValue("tipoDeHabitacion.nombre", tiposHabitacion?.tipo_habitaciones[0].nombre || "Sencilla")
            setValue("cantidadPersonas", tiposHabitacion?.tipo_habitaciones[0].personas_incluidas || 2)
            setNumMaxPersonas(tiposHabitacion?.tipo_habitaciones[0].personas_incluidas || 2)
        }

        if (tipoDeHabitacion.id) {
            getTarifas({ variables: { tipo_habitacion_id: tipoDeHabitacion?.id, hotel_id } }).then((d) => {
                const list: any[] =
                    d?.data?.tarifas.filter((t) => !t.eliminado && t.estatus === EstatusTarifa.Activa) || []

                // filtrar tarifas que contengan la palabra reserva en tipo_tarifa
                const tarifasList = list.filter(({ tipo_tarifa = "" }) => tipo_tarifa.includes("reserva"))

                setTarifasList(tarifasList)
            })
        }
    }, [tipoDeHabitacion])

    const [personasExtraMax, setPersonasExtraMax] = useState(0)

    useEffect(() => {
        setPersonasExtraMax(tarifasList.find((t) => t.tarifa_id === tipoTarifaSelected?.id)?.personas_extra_max || 0)
    }, [tipoTarifaSelected])

    useEffect(() => {
        setValue("cantidadPersonasExtra", valueMinNumPersonasExtra)
    }, [tipoDeHabitacion])

    useEffect(() => {
        const newTarifasDisplayed: any[] = [
            ...(tarifasList
                ?.filter(
                    (t) => t?.tipo_habitacion_id === tipoDeHabitacion?.id && validationByDate(t, fechaReserva?.[0])
                )
                .map((t) => ({
                    label: `${t?.nombre} - ${getCurrencyFormat(t?.costo_habitacion)}`,
                    value: t?.tarifa_id,
                })) || []),
            // TODO: Otras tarifas: saldrá hasta el 1.2
            // {
            //     label: "Otros",
            //     value: "Otros",
            // },
        ]
        setTiposTarifaDisplayed(newTarifasDisplayed)
        setValue("tipoTarifa", defaultValues.tipoTarifa)
    }, [tarifasList, fechaReserva])

    const maxPersonas = (num?) => {
        if (num) {
            setNumMaxPersonas(num)
        }
    }

    useEffect(() => {
        if (!reserva && !origen) {
            setValue("origenReserva", "Checkfront")
            setOrigenFiltroVisual(false)
        }
    }, [reserva, origen, origenFiltroVisual, setValue])

    useEffect(() => {
        if (!reserva || isDirty) {
            return
        }

        const tipoHabitacionFromBackState = tiposHabitacion?.tipo_habitaciones.find(
            (th) => th.tipo_habitacion_id === reserva?.tipoHabitacionId
        )

        const tipoHabitacionFromBackStateToField = {
            id: tipoHabitacionFromBackState?.tipo_habitacion_id || "",
            nombre: tipoHabitacionFromBackState?.nombre || "",
        }

        setValue("cantidadPersonas", reserva?.cantidadPersonas)
        setNumMaxPersonas(tipoHabitacionFromBackState?.personas_incluidas || 0)
        setValue("codigoReserva", reserva?.codigoReserva)
        setValue("costoPersonaExtra", reserva?.costoPersonaExtra)
        setValue("costoTarifa", reserva?.costoTarifa)
        setValue("fechaReserva", reserva?.fechaReserva)
        setValue("tipoDeHabitacion", tipoHabitacionFromBackStateToField)
        setValue("origenReserva", capitalize(reserva?.origenReserva))
        setValue(
            "experiencias",
            Array.from(
                new Set([...(reserva?.experiencias || []), ...(reserva?.experienciasSaved || [])].filter((id) => id))
            )
        )
        setValue("reservaIdSaved", reserva?.reservaIdSaved)
        setValue("folioSaved", reserva?.folioSaved)
        setValue("experienciasSaved", reserva?.experienciasSaved)
        setValue("nombreHuespedSaved", reserva?.nombreHuespedSaved)
        setValue("telefonoHuespedSaved", reserva?.telefonoHuespedSaved)
        setValue("emailHuespedSaved", reserva?.emailHuespedSaved)
        setValue("totalSaved", reserva?.totalSaved)
        setValue("pagosSaved", reserva?.pagosSaved)
        setValue("totalSaved", reserva?.totalSaved)
        setValue("comentarioSaved", reserva?.comentarioSaved)
    }, [tiposHabitacion, reserva, data?.experiencias, isDirty])

    useEffect(() => {
        if (isDirty) {
            return
        }
        const tarifa = tarifasList.find((t) => t?.tarifa_id === reserva?.tipoTarifa.id)

        const tarifaToField = reserva ? { id: tarifa?.tarifa_id, nombre: tarifa?.nombre } : undefined
        setValue("tipoTarifa", tarifaToField)
        setValue("cantidadPersonasExtra", reserva?.cantidadPersonasExtra || 0)
    }, [tarifasList])

    const [codigoReservaRequired, setCodigoReservaRequired] = useState(false)

    useEffect(() => {
        setCodigoReservaRequired(
            !(
                origen?.toLowerCase()?.trim() === OrigenRservas.Email ||
                origen?.toLowerCase()?.trim().slice(0, 3) === "tel" ||
                origen?.toLowerCase()?.trim().slice(0, 5) === "recep"
            )
        )
    }, [origen])

    useEffect(() => {
        reset({ ...getValues(), codigoReserva: "" })
    }, [codigoReservaRequired])

    useEffect(() => {
        getExperiencias()
    }, [])

    const getDays = (dates: Date[]) => {
        const fechaRegistro = dates[0]
        const fechaSalida = dates[1]

        const diferenciaTiempo = fechaSalida.getTime() - fechaRegistro.getTime()

        return Math.ceil(diferenciaTiempo / (1000 * 3600 * 24))
    }

    const onSubmit = (data: FormValues) => {
        const dias_reserva_original = Number(reserva?.diasReserva || 0)
        const dias_reserva_editada =
            data.fechaReserva.length === 1 ? 1 : data.fechaReserva.length > 0 ? getDays(data.fechaReserva) : 0

        //Validación para mostrar una alerta cuando la reserva a editar tenga el estado de check-in
        const error_check_in = reserva && reserva?.estadoReserva && reserva?.estadoReserva === "check_in"
        const error_fecha = dias_reserva_editada < dias_reserva_original

        if (error_check_in || error_fecha) {
            setError("fechaReserva", {
                type: "custom",
                message: "La estancia de la nueva reserva debe ser igual o mayor a la original",
            })
            return
        }

        const datesValidate =
            data.fechaReserva.length > 1
                ? {
                    fecha_inicial: data.fechaReserva?.[0]?.toISOString(),
                    fecha_final: data.fechaReserva?.[1]?.toISOString(),
                }
                : {
                    fecha_inicial: data.fechaReserva?.[0]?.toISOString(),
                    fecha_final: addDays({ date: data.fechaReserva?.[0], days: 1 })?.toISOString(),
                }

        setLoader(true)
        getLimiteReserva({
            fechas_reserva: datesValidate,
            hotel_id: hotel_id,
            tipo_habitacion_id: data.tipoDeHabitacion.id,
        })
            .then(({ data }) => {
                const res = data?.verificar_limite_reservas
                if (res?.alerta_por_limite_reservas) {
                    setAlerta({ visible: true, date: getExactDate(res?.fecha_conflicto).toISOString() })
                } else {
                    onSuccess(data)
                }
            })
            .catch(() => onSuccess(data))
            .finally(() => setLoader(false))
    }

    const onSuccess = (data: FormValues) => {
        const tarifa = tarifasList?.find(({ tarifa_id }) => tarifa_id === data?.tipoTarifa?.id)
        const sendData = {
            fechaReserva: data.fechaReserva,
            tipoHabitacion: data.tipoDeHabitacion,
            cantidadPersonas: data?.cantidadPersonas,
            cantidadPersonasExtra: data.cantidadPersonasExtra,
            codigoReserva: data.codigoReserva,
            origenReserva: getKey(data.origenReserva),
            tipoTarifa: data.tipoTarifa,
            totalPersonas: data?.cantidadPersonas,
            tipoHabitacionId: data.tipoDeHabitacion?.id,
            numMaxPersonas: numMaxPersonas,
            horaCheckIn: tarifa.hora_checkin,
            horaCheckOut: tarifa.hora_checkout,
            numPersonas: data?.cantidadPersonas,
            costoPersonaExtra: data.tipoTarifa?.id === "Otros" ? data?.costoPersonaExtra : tarifa?.costo_persona_extra,
            costoTarifa: data.tipoTarifa?.id === "Otros" ? data?.costoTarifa : tarifa?.costo_habitacion,
            experiencias: data?.experiencias,
            reservaIdSaved: data?.reservaIdSaved,
            folioSaved: data?.folioSaved,
            nombreHuespedSaved: data?.nombreHuespedSaved,
            telefonoHuespedSaved: data?.telefonoHuespedSaved,
            emailHuespedSaved: data?.emailHuespedSaved,
            experienciasSaved: data?.experienciasSaved,
            totalSaved: data?.totalSaved,
            pagosSaved: data?.pagosSaved,
            comentarioSaved: data?.comentarioSaved,
        }
        navigate(
            reservaIdSaved ? `/u/registro-reserva/huesped/${reserva?.reservaIdSaved}` : `/u/registro-reserva/huesped`,
            { state: { ...sendData } }
        )
    }

    useEscapeKey({
        onEscape: () => {
            navigate("/u/reservaciones/table")
        },
    })

    const getYesterday = () => {
        const today = dateHotel
        const yesterday = new Date(today)
        yesterday.setDate(today.getDate() - 1)
        return yesterday
    }

    return (
        <Screen
            title={reservaIdSaved ? `Edición de reservación - ${folioSaved}` : "Registro de reserva"}
            className="registro-reserva-screen"
            contentClassName="guest-screen"
            back={false}
            close={true}
        >
            <section className="registro-reservas">
                <form className="registro-reservas__form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="registro-reservas__formDate">
                        <Controller
                            name="fechaReserva"
                            control={control}
                            rules={{
                                required: true,
                                validate: (v) => v.length > 1 || (areSameDay(v[0], dateHotel) && v.length > 0),
                            }}
                            render={({
                                field: { onChange: onFieldChange, value: fieldValue },
                                formState: { errors },
                            }) => (
                                <DatePicker
                                    loading={calendarLoad}
                                    placeholder="Selecciona un periodo en el calendario"
                                    label="Fecha de reservación"
                                    inputClassName="add-gasto-input-fecha"
                                    isRange
                                    onReset={() => {
                                        onFieldChange([])
                                    }}
                                    disabledBeforeOrEqualDate={getYesterday()}
                                    onChange={(date) => {
                                        if (fieldValue.length === 0) {
                                            onFieldChange([date])
                                            return
                                        }
                                        if (date <= fieldValue[0]) {
                                            onFieldChange([date])
                                            return
                                        }
                                        if (fieldValue?.length === 2 && areSameDay(dateHotel, date)) {
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
                                    errorHintText={
                                        errors.fechaReserva
                                            ? errors.fechaReserva?.message || "Selecciona un periodo en el calendario"
                                            : ""
                                    }
                                />
                            )}
                        />
                    </div>
                    <div className="registro-reservas__form__room">
                        <div className="registro-reservas__form__room__dropdown">
                            <Controller
                                name="origenReserva"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="340px"
                                        suggestions={origenReserva}
                                        value={value}
                                        inputTextConfig={{
                                            label: "Origen de reserva",
                                            placeholder: "Selecciona el origen de reserva",
                                            type: "text",
                                            icon: book2Fill,
                                            error: !!errors.origenReserva,
                                            errorhinttext: errors.origenReserva
                                                ? "Selecciona un origen de reserva"
                                                : "",
                                        }}
                                        onChange={(data) => {
                                            onChange(data)
                                        }}
                                        displaySuggestions={origenFiltroVisual}
                                    />
                                )}
                            />

                            <Controller
                                name="codigoReserva"
                                control={control}
                                rules={{ required: codigoReservaRequired }}
                                render={({ field: { onChange, value } }) => (
                                    <InputText
                                        value={value}
                                        toolTipInfo={true}
                                        icon={iconHash}
                                        tooltipInput={{
                                            title: "¿Dónde lo encuentro?",
                                            theme: "dark",
                                            description:
                                                "Es el código de confirmación generado desde otras plataformas de reserva (Ej. Expedia, etc).",
                                        }}
                                        placeholder="Ingresa el código de reserva"
                                        onChange={(value) => onChange(value)}
                                        label={"Código de reserva"}
                                        type={"text"}
                                        error={!!errors.codigoReserva}
                                        errorhinttext={"El código de reserva es requerido"}
                                    />
                                )}
                            />
                        </div>
                        <div className="registro-reservas__form__room__tipeRoom">
                            <p className="registro-reservas__form__room__tipeRoom__title">Tipo de habitación</p>
                            <div className="registro-reservas__form__room__tipeRoom__item">
                                <Controller
                                    control={control}
                                    rules={{ required: true }}
                                    name="tipoDeHabitacion"
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            {habitacionesFiltradas.map((tipo) => (
                                                <MiniRoomTypeCard
                                                    key={uuid()}
                                                    people={Number(tipo.personas_incluidas)}
                                                    extra={2}
                                                    selected={value.id === String(tipo.tipo_habitacion_id)}
                                                    roomTypeName={tipo.nombre}
                                                    setSelected={() => {
                                                        if (!tipo.desactivar) {
                                                            maxPersonas(tipo.personas_incluidas)
                                                            setValue(
                                                                "cantidadPersonas",
                                                                Number(tipo.personas_incluidas)
                                                            )
                                                            onChange({
                                                                id: tipo.tipo_habitacion_id,
                                                                nombre: tipo.nombre,
                                                            })
                                                        }
                                                    }}
                                                    disabled={tipo.desactivar}
                                                />
                                            ))}
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="registro-reservas__form__room__tarifa__column1">
                            <Controller
                                name="tipoTarifa"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, value } }) => (
                                    <Dropdown
                                        options={tiposTarifaDisplayed}
                                        placeholder="Selecciona tipo de tarifa"
                                        icon={"dollarCircle"}
                                        value={value?.id}
                                        onClick={(value) => {
                                            onChange({ id: value.value, nombre: value.label })
                                            if (!otros) {
                                                unregister("costoTarifa")
                                                unregister("costoPersonaExtra")
                                            }
                                            getValues("tipoTarifa")
                                        }}
                                        label={"Tipo de tarifa"}
                                        disabled={!tipoDeHabitacion?.id}
                                        errorHintText={
                                            tipoDeHabitacion?.id && tiposTarifaDisplayed.length === 0
                                                ? "Tipo de habitación no disponible en las fechas elegidas"
                                                : errors.tipoTarifa
                                                ? "Selecciona un tipo de tarifa"
                                                : ""
                                        }
                                    />
                                )}
                            />
                            <Controller
                                name="experiencias"
                                control={control}
                                render={({ field: { value = [], onChange } }) => {
                                    const opcionesModificadas =
                                        data?.experiencias?.map((exp) => {
                                            const precioLabel =
                                                exp.precio >= 0 ? (
                                                    <span style={{ fontWeight: 600, color: "black" }}>
                                                        ${exp.precio}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontWeight: 600, color: "red" }}>
                                                        -${Math.abs(exp.precio)}
                                                    </span>
                                                )
                                            return {
                                                value: exp.experiencia_id,
                                                label: `${exp.nombre} ${exp.precio}`,
                                                precio: <>{exp.nombre} {precioLabel}</>,
                                                withCheckbox: true,
                                                checked: value.includes(exp.experiencia_id),
                                                available: !experienciasSaved.includes(exp.experiencia_id),
                                                showInLabelOnSelected: true,
                                            }
                                        }) || []
                                    return (
                                        <MultipleSelectDropdown
                                            label={"Experiencias (Opcional)"}
                                            placeholder={"Selecciona una opción"}
                                            icon={"giftFill"}
                                            onChange={(selectedValues) => {
                                                const nuevasExperiencias = selectedValues.filter(
                                                    (id) => !experienciasSaved.includes(id)
                                                )
                                                onChange([...experienciasSaved, ...nuevasExperiencias])
                                            }}
                                            value={value || []}
                                            options={opcionesModificadas}
                                            editReserva={true}
                                            allowDeselectWhenMax={true}
                                        />
                                    )
                                }}
                            />
                        </div>
                        <div className="registro-reservas__form__room__tarifa">
                            {otros && (
                                <div className="registro-reservas__form__room__tarifa__column2">
                                    <Controller
                                        name="costoTarifa"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, value } }) => (
                                            <InputCurrency
                                                error={!!errors.costoTarifa}
                                                errorhinttext={errors.costoTarifa ? "Ingresa un monto" : ""}
                                                style={{ maxWidth: "none" }}
                                                onPrefixChange={(value: OptionCurrency): void => {
                                                    console.log(value)
                                                }}
                                                onInputChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                                                    onChange(parseFloat(e.target.value))
                                                }}
                                                defaultValue={value}
                                                label="Tarifa de habitación"
                                            />
                                        )}
                                    />

                                    <Controller
                                        name="costoPersonaExtra"
                                        rules={{ required: true }}
                                        control={control}
                                        render={({ field: { onChange } }) => (
                                            <InputCurrency
                                                style={{ maxWidth: "none" }}
                                                label={"Tarifa persona extra"}
                                                error={!!errors.costoPersonaExtra}
                                                errorhinttext={errors.costoPersonaExtra ? "Ingresa un monto" : ""}
                                                onPrefixChange={(value: OptionCurrency) => {
                                                    console.log(value)
                                                }}
                                                onInputChange={(e) => {
                                                    onChange(parseFloat(e.target.value))
                                                }}
                                                hinttext="Aplica solo para huéspedes adicionales en la habitación"
                                                className="registro-reservas__form__input-tarifa-extra"
                                            />
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="counter-section-form">
                            <Controller
                                name="cantidadPersonas"
                                control={control}
                                rules={{ required: true, min: 1, max: numMaxPersonas }}
                                render={({ field: { onChange, value } }) => (
                                    <Counter
                                        label="Personas"
                                        max={numMaxPersonas}
                                        onClick={(lvalue) => {
                                            if (valueNumPersonasExtra > 0 && lvalue < value) {
                                                setValue(
                                                    "cantidadPersonasExtra",
                                                    reserva?.reservaIdSaved
                                                        ? reserva?.cantidadPersonasExtra
                                                        : valueNumPersonasExtra - 1
                                                )
                                                onChange(value)
                                            } else {
                                                onChange(lvalue)
                                            }
                                        }}
                                        value={value}
                                        errorHintText={errors.cantidadPersonas ? "El campo es requerido" : ""}
                                        min={0}
                                        className="registro-reservas__form__counter"
                                        disable={
                                            (reserva?.reservaIdSaved || valueNumPersonas === 0) &&
                                            totalPersonas >= numMaxPersonas
                                        }
                                    />
                                )}
                            />
                            {tipoDeHabitacion?.id && (
                                <Controller
                                    name="cantidadPersonasExtra"
                                    control={control}
                                    rules={{ required: true, min: valueMinNumPersonasExtra, max: personasExtraMax }}
                                    render={({ field: { onChange, value } }) => (
                                        <Counter
                                            label="Personas extra"
                                            value={value}
                                            max={personasExtraMax}
                                            textLimit={"Máximo de personas por habitación alcanzado*"}
                                            onClick={(lvalue) => {
                                                if (reserva?.reservaIdSaved) {
                                                    if (lvalue >= valueMinNumPersonasExtra) {
                                                        onChange(lvalue)
                                                    }
                                                } else {
                                                    if (valueNumPersonas >= numMaxPersonas) {
                                                        onChange(lvalue)
                                                    } else if (lvalue > (value || 0)) {
                                                        setValue("cantidadPersonas", valueNumPersonas + lvalue)
                                                    }
                                                }
                                            }}
                                            min={valueMinNumPersonasExtra}
                                            className="registro-reservas__form__counter"
                                            disable={valueNumPersonas === 0 && totalPersonas >= numMaxPersonas}
                                        />
                                    )}
                                />
                            )}
                        </div>
                        <div className="registro-reservas__form__room__button__cont">
                            <Button
                                type={"submit"}
                                text="Continuar"
                                className="registro-reservas__form__room__button__cont__button"
                            />
                        </div>
                    </div>
                    <LoaderComponent visible={loader} />
                    <AlertReservas
                        visible={alerta.visible}
                        date={alerta.date}
                        onClose={() => {
                            setAlerta({ visible: false, date: "" })
                            setValue("fechaReserva", [])
                            setCalendarLoad(true)
                            setTimeout(() => setCalendarLoad(false), 1000)
                        }}
                        onConfirm={() => {
                            setAlerta({ visible: false, date: "" })
                            onSuccess(getValues())
                        }}
                    />
                </form>
            </section>
        </Screen>
    )
}

export default RegistroReservas
