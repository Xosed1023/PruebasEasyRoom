import { useEffect, useState } from "react"
import { Controller, useForm, FormProvider } from "react-hook-form"
import Screen from "src/shared/components/layout/screen/Screen"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { Button, InputText, TextBox } from "src/shared/components/forms"
import { FormValues } from "./RegistroIncidencia.types"
import "./RegistroIncidencia.css"
import { defaultValues, placeTypes, severityTypes, types, typesHabitacion } from "./RegistroIncidencia.constants"
import { DateField } from "src/pages/venta-habitacion/sections/Fields"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import userFilled from "src/shared/icons/UserFilled"
import InputTextSuggestions from "src/shared/components/forms/input-text-suggestions/InputTextSuggestions"
import BedFilled from "src/shared/icons/BedFilled"
import { useQuery } from "@apollo/client"
import { GET_TURNOS } from "../incidencias-graphql/queries/turnos"
import { GET_HABITACIONES } from "../incidencias-graphql/queries/habitaciones"
import { useNavigate } from "react-router-dom"
import { CREAR_INCIDENCIA } from "../incidencias-graphql/mutations/incidencia"
import { client } from "src/graphql"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useProfile } from "src/shared/hooks/useProfile"
import { GET_COLABORADORES } from "../incidencias-graphql/queries/hotel-colaboradores"
import DatePicker from "src/shared/components/forms/date-picker/DatePicker"
import { useRegistroIncienciaConfig } from "./RegistroIncidencia.hooks"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { Estados_Habitaciones } from "src/gql/schema"
import LockRoom from "./modal/LockRoom/LockRoom"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import Icon from "src/shared/icons"
import useMaskMatricula from "src/shared/masks/mask-matricula/mask-matricula"
import { RoleNames } from "src/shared/hooks/useAuth"

function RegistroIncidencia(): JSX.Element {
    const navigate = useNavigate()
    const { showSnackbar } = useSnackbar()
    const { hotel_id, rolName } = useProfile()
    const { value: formattedMatriculaValue, maskChange } = useMaskMatricula()

    const [loader, setLoader] = useState<boolean>(false)

    const methods = useForm<FormValues>({
        defaultValues,
    })
    const { control, handleSubmit, setValue, watch } = methods
    const dataForm = watch()

    const [isModalLockOpen, setLockModal] = useState<boolean>(false)

    const [turns, setTurns] = useState<Array<any>>([])
    const [names, setNames] = useState<Array<any>>([])
    const [rooms, setRooms] = useState<Array<any>>([])
    const [habitacion, setHabitacion] = useState<any>({})

    const { data: turnos, error: errorTurn } = useQuery(GET_TURNOS, {
        variables: {
            hotel_id,
        },
    })
    const { data: colaboradores, error: errorNames } = useQuery(GET_COLABORADORES, {
        variables: {
            hotel_id,
        },
    })
    const { data: habitaciones, error: errorRooms } = useQuery(GET_HABITACIONES)

    useEffect(() => {
        //obtiene todos los turnos, colaboradores y habitaciones disponibles
        const optionsTurn = turnos?.turnos.map((turno: any) => ({
            value: turno.turno_id,
            label: turno.nombre,
        }))
        const optionsNames = colaboradores?.hotel_colaboradores.map(
            ({ colaborador }: any) =>
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
        )
        const optionsRooms = habitaciones?.habitaciones
            .filter((habitacion: any) => habitacion.hotel_id === hotel_id)
            .map(
                (habitacion: any) => habitacion.tipo_habitacion.nombre + " - " + habitacion.numero_habitacion
            )

        if (!errorTurn) setTurns(optionsTurn)
        if (!errorNames) setNames(optionsNames?.sort())
        if (!errorRooms) setRooms(optionsRooms)
    }, [turnos, colaboradores, habitaciones])

    //Hook para limitar y condicionar el campo: fecha_registro. Una posible solución al rango de fechas exactas para cortes.
    const { getRegisterDate, fromCortes } = useRegistroIncienciaConfig(turnos?.turnos || [], methods.reset)

    const onSubmit = async () => {
        //muestra la modal de bloqueo
        if (
            dataForm.severity === "alta" &&
            dataForm.bloquear &&
            dataForm.place === "habitación" &&
            habitacion?.estado !== Estados_Habitaciones.Ocupada &&
            habitacion?.estado !== Estados_Habitaciones.Bloqueada
        ) {
            setLockModal(true)
        } else {
            createIncidencia()
        }
    }

    const createIncidencia = async () => {
        setLoader(true)
        const fecha_registro = await getRegisterDate(dataForm.date[0], dataForm.turn)

        const dataMutation = {
            colaborador_id_reporta: searchColaboradorSelected()[0].colaborador_id,
            detalle: dataForm.detail,
            habitacion_id: dataForm.room ? searchHabitacionSelected()[0].habitacion_id : null,
            severidad: dataForm.severity,
            turno_id: dataForm.turn,
            fecha_registro,
            area: dataForm.place,
            hotel_id,
            huesped: dataForm.huesped,
            matricula: dataForm.matricula,
            tipo_incidencia: dataForm.type,
        }
        try {
            const { data } = await client.mutate({
                mutation: CREAR_INCIDENCIA,
                variables: {
                    createIncidenciaInput: dataMutation,
                },
            })
            const folio = data.crear_incidencia?.folio
            const bloquear = dataForm.bloquear && dataForm.severity === "alta" && dataForm.place !== "instalaciones"
            const numero_habitacion = dataForm.room
            const estado_habitacion = habitacion?.estado
            let text = `Se creó una incidencia con el **folio ${folio}** exitosamente.`

            if (estado_habitacion === Estados_Habitaciones.Reservada && bloquear && numero_habitacion) {
                text = `La habitación **${numero_habitacion}** ha sido bloqueada exitosamente. La asignación de reserva fue eliminada, asigna otra habitación desde el módulo de reservas.`
            } else if (bloquear && numero_habitacion && estado_habitacion !== Estados_Habitaciones.Ocupada) {
                text = `Se creó una incidencia con el **folio ${folio}.** La  **habitación ${numero_habitacion}** ha sido bloqueada exitosamente.`
            }

            showSnackbar({
                title: "Incidencia creada",
                text,
                status: "success",
            })

            if (fromCortes) {
                navigate(-1)
            } else {
                navigate("/u/incidencias")
            }
        } catch (e) {
            showSnackbar({
                title: "Error al crear incidencia",
                text: "¡Ups! Ocurrió un **error** al registrar la incidencia.",
                status: "error",
            })
            setLoader(false)
        } finally {
            setLoader(false)
        }
    }

    const searchColaboradorSelected = () => {
        const colaborador = colaboradores?.hotel_colaboradores?.filter(({ colaborador }: any) => {
            const nameArray =
                colaborador.nombre + " " + colaborador.apellido_paterno + " " + colaborador.apellido_materno
            if (nameArray === dataForm.name) return colaborador
        })
        return colaborador
    }

    const searchHabitacionSelected = () => {
        const habitacion = habitaciones?.habitaciones?.filter((habitacion: any) => {
            const habitacionArray = habitacion.numero_habitacion
            dataForm.room.split(" - ")[0]
            if (habitacionArray === dataForm.room.split(" - ")[1]) {
                setHabitacion(habitacion[0])
                return habitacion
            }
        })
        if (habitacion) setHabitacion(habitacion[0])
        return habitacion
    }
    useEffect(() => {
        searchHabitacionSelected()
    }, [dataForm.room])

    useEscapeKey({
        onEscape: () => {
            navigate(-1)
        },
    })

    const filteredPlaceTypes =
    rolName === RoleNames.valet || rolName === RoleNames.restaurante
        ? placeTypes.filter((type) => type.value !== "habitación")
        : placeTypes;

    return (
        <Screen
            className="registro-incidencia"
            contentClassName="registro-incidencia__main"
            title={rolName === RoleNames.valet || rolName === RoleNames.restaurante ? "Reporte de incidencia" : "Registro de incidencia"}
            close={true}
        >
            <FormProvider {...methods}>
                <form className="registro-incidencia__container" onSubmit={handleSubmit(onSubmit)}>
                    <section className="registro-incidencia__left">
                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: true }}
                            render={({
                                field: { onChange: onFieldChange, value: fieldValue },
                                formState: { errors },
                            }) => (
                                <DatePicker
                                    disabledBeforeOrEqualDate={fromCortes ? new Date() : undefined}
                                    placeholder="Selecciona una fecha en el calendario"
                                    label="Fecha de incidencia"
                                    inputClassName="add-gasto-input-fecha"
                                    onReset={() => {
                                        onFieldChange([])
                                    }}
                                    onChange={(date) => {
                                        onFieldChange([date])
                                    }}
                                    value={fieldValue}
                                    errorHintText={errors.date ? "Selecciona una fecha en el calendario" : ""}
                                    disabledAfterOrEqualDate={new Date()}
                                />
                            )}
                        />
                    </section>
                    <section className="registro-incidencia__right">
                        <div className="registro-incidencia__right-top">
                            <Controller
                                control={control}
                                name={"turn"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, formState: { errors } }) => (
                                    <Dropdown
                                        label={"Turno"}
                                        type={"text"}
                                        disabled={fromCortes}
                                        placeholder={"Selecciona una opción"}
                                        value={value}
                                        onClick={({ label, value }) => {
                                            onChange(label)
                                            setValue("turn", value)
                                        }}
                                        options={turns || [{ label: "-", value: "-1" }]}
                                        errorHintText={errors.turn ? "Selecciona una opción" : ""}
                                        icon={"timerFill"}
                                        iconInOptions={false}
                                        className={value ? "dropdown-registro-indicencia-no-border" : ""}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"name"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, formState: { errors } }) => (
                                    <InputTextSuggestions
                                        suggestionsListWidth="342px"
                                        suggestions={names || ["-"]}
                                        value={value}
                                        inputTextConfig={{
                                            label: "Nombre de quien reportó",
                                            placeholder: "Agrega el nombre del personal",
                                            type: "text",
                                            icon: userFilled,
                                            errorhinttext: errors.name ? "Escribe un nombre" : "",
                                            error: errors.name ? true : false,
                                            className: "registro-incidencia__input-text",
                                        }}
                                        onChange={(data) => {
                                            onChange(data)
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <DateField />
                        <div className="registro-incidencia__tabs-container-place">
                            <Controller
                                control={control}
                                name={"place"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputTabs
                                        className={"registro-incidencia__tabs-place"}
                                        label={"Lugar o responsable de la incidencia"}
                                        items={filteredPlaceTypes}
                                        value={value}
                                        onChange={(value) => {
                                            onChange(value)
                                            setValue("huesped", "")
                                            setValue("room", "")
                                            setValue("matricula", "")
                                            setValue("type", "")
                                        }}
                                    />
                                )}
                            />
                            <Controller
                                control={control}
                                name={"type"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange }, formState: { errors } }) => (
                                    <Dropdown
                                        label={"Tipo de incidencia"}
                                        type={"text"}
                                        placeholder={"Selecciona una opción"}
                                        value={value}
                                        onClick={({ label, value }) => {
                                            onChange(label)
                                            setValue("type", value)
                                        }}
                                        containerClassName={
                                            rolName === RoleNames.valet || rolName === RoleNames.restaurante
                                                ? "registro-incidencia__input-valet"
                                                : ""
                                        }
                                        options={
                                            dataForm.place === placeTypes[2].value
                                                ? types || [{ label: "-", value: "-1" }]
                                                : typesHabitacion || [{ label: "-", value: "-1" }]
                                        }
                                        errorHintText={errors.type ? "Selecciona una opción" : ""}
                                        icon={"surveyFill"}
                                        iconInOptions={false}
                                        className={value ? "dropdown-registro-indicencia-no-border" : ""}
                                    />
                                )}
                            />
                        </div>
                        {dataForm.place === placeTypes[1].value || (dataForm.place === placeTypes[2].value && (rolName === RoleNames.valet || rolName === RoleNames.restaurante) && dataForm.type === "Objeto olvidado") ? (
                            <div className="registro-incidencia__tabs-container-huesped">
                                <Controller
                                    control={control}
                                    name={"room"}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputTextSuggestions
                                            suggestionsListWidth="342px"
                                            suggestions={rooms || ["-"]}
                                            value={value}
                                            inputTextConfig={{
                                                style: { width: "100%" },
                                                label: "Habitación",
                                                placeholder: "Escribe una habitación",
                                                type: "text",
                                                icon: BedFilled,
                                                error: !!errors.room,
                                                errorhinttext: errors.room ? "Selecciona una opción" : "",
                                                className: "registro-incidencia__input-text",
                                            }}
                                            onChange={(data) => {
                                                onChange(data)
                                            }}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={"huesped"}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputText
                                            icon={Icon}
                                            iconProps={{
                                                name: "userFilled",
                                            }}
                                            inputWrapperClass="registro-incidencia__input"
                                            label={"Nombre del huésped o responsable (opcional)"}
                                            type={"text"}
                                            hinttext="Opcional"
                                            placeholder={"Nombre del huésped o colaborador"}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") e.preventDefault()
                                            }}
                                        />
                                    )}
                                />
                            </div>
                        ) : (
                            dataForm.place === placeTypes[2].value && (
                                <div className="registro-incidencia__tabs-container-huesped">
                                    <Controller
                                        control={control}
                                        name={"huesped"}
                                        render={({ field: { value, onChange }, formState: { errors } }) => (
                                            <InputText
                                                icon={Icon}
                                                iconProps={{
                                                    name: "userFilled",
                                                }}
                                                inputWrapperClass={dataForm.type === types[0].value ? "registro-incidencia__input" : "registro-incidencia__input-huesped"}
                                                label={"Nombre del responsable"}
                                                type={"text"}
                                                hinttext="Opcional"
                                                placeholder={"Nombre del huésped"}
                                                value={value}
                                                onChange={(e) => onChange(e.target.value)}
                                                onKeyUp={(e) => {
                                                    if (e.key === "Enter") e.preventDefault()
                                                }}
                                            />
                                        )}
                                    />
                                    {dataForm.type === types[0].value && (
                                        <Controller
                                            control={control}
                                            name={"matricula"}
                                            render={({ field: { value, onChange }, formState: { errors } }) => (
                                                <InputText
                                                    icon={Icon}
                                                    iconProps={{
                                                        name: "iconHash",
                                                    }}
                                                    inputWrapperClass="registro-incidencia__input"
                                                    label={"Matrícula"}
                                                    type={"text"}
                                                    hinttext="Opcional"
                                                    placeholder={"Escribe la matrícula"}
                                                    value={value}
                                                    onKeyDown={maskChange}
                                                    onChange={(e) => onChange(formattedMatriculaValue)}
                                                    onKeyUp={(e) => {
                                                        if (e.key === "Enter") e.preventDefault()
                                                    }}
                                                />
                                            )}
                                        />
                                    )}
                                </div>
                            )
                        )}
                        <div className="registro-incidencia__tabs-container-severity">
                            <Controller
                                control={control}
                                name={"severity"}
                                rules={{ required: true }}
                                render={({ field: { value, onChange } }) => (
                                    <InputTabs
                                        className={"registro-incidencia__tabs-severity"}
                                        label={"Urgencia"}
                                        items={severityTypes}
                                        value={value}
                                        onChange={(value) => {
                                            onChange(value)
                                            if (!(rolName === RoleNames.valet || rolName === RoleNames.roomService || rolName === RoleNames.restaurante) && value === "alta" && dataForm.room) setValue("bloquear", true)
                                        }}
                                    />
                                )}
                            />
                            {dataForm.place === placeTypes[0].value &&
                                <Controller
                                    control={control}
                                    name={"huesped"}
                                    render={({ field: { value, onChange }, formState: { errors } }) => (
                                        <InputText
                                            icon={Icon}
                                            iconProps={{
                                                name: "userFilled",
                                            }}
                                            inputWrapperClass="registro-incidencia__guest-name"
                                            label={"Nombre del huésped o responsable (opcional)"}
                                            type={"text"}
                                            hinttext="Opcional"
                                            placeholder={"Nombre del huésped o colaborador"}
                                            value={value}
                                            onChange={(e) => onChange(e.target.value)}
                                            onKeyUp={(e) => {
                                                if (e.key === "Enter") e.preventDefault()
                                            }}
                                        />
                                    )}
                                />
                            }
                            {dataForm.severity === "alta" &&
                            habitacion?.estado !== Estados_Habitaciones.Ocupada &&
                            habitacion?.estado !== Estados_Habitaciones.Bloqueada &&
                            dataForm.place === "habitación" &&
                            !(rolName === RoleNames.valet || rolName === RoleNames.roomService || rolName === RoleNames.restaurante) ? (
                                <Controller
                                    control={control}
                                    name={"bloquear"}
                                    render={({ field: { value, onChange } }) => (
                                        <Checkbox
                                            className="registro-incidencia__check"
                                            label="Bloquear habitación"
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                            ) : null}
                        </div>

                        <Controller
                            control={control}
                            name={"detail"}
                            rules={{ required: true }}
                            render={({ field: { value, onChange }, formState: { errors } }) => (
                                <TextBox
                                    className="registro-incidencia__textarea"
                                    placeholder={"Escribe el detalle de la incidencia..."}
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    description={"Detalle de incidencia"}
                                    error={!!errors.detail}
                                    errorHintText={errors.detail ? "Escribe el detalle de la incidencia" : ""}
                                />
                            )}
                        />
                        <Button type={"submit"} text={rolName === RoleNames.valet || rolName === RoleNames.restaurante ? "Continuar" : "Crear incidencia"} className="registro-incidencia__button" />
                    </section>
                </form>
            </FormProvider>
            <LoaderComponent visible={loader} />
            <LockRoom
                isOpen={isModalLockOpen}
                onClose={() => setLockModal(false)}
                onConfirmed={() => createIncidencia()}
                habitacion={habitacion}
            />
        </Screen>
    )
}

export default RegistroIncidencia
