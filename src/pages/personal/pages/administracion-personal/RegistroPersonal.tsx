/* eslint-disable indent */
import { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button, InputTel, InputText } from "src/shared/components/forms"
import { InputFoto } from "src/shared/components/forms/input-foto/InputFoto"
import Screen from "src/shared/components/layout/screen/Screen"
import "./RegistroPersonal.css"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import {
    Colaborador,
    CreateColaboradorInput,
    CreateColaboradorUsuarioInput,
    Puesto,
    useActualizarColaboradorMutation,
    useColaboradoresIdNumQuery,
    useCrearColaboradorConUsuarioMutation,
    useCrearColaboradorMutation,
    useGetAreasQuery,
    useGetPuestosByHotelIdQuery,
    useGetTurnosQuery,
} from "src/gql/schema"
import Icon from "src/shared/icons"
import accountBoxFill from "src/shared/icons/accountBoxFill"
import UserFilled from "src/shared/icons/UserFilled"
import UserContactsFill from "src/shared/icons/UserContactsFill"
import MailFill from "src/shared/icons/MailFill"
import home3fill from "src/shared/icons/home3fill"
import DollarCircle from "src/shared/icons/DollarCircle"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import { useLocation, useNavigate } from "react-router-dom"
import InputDateText, { validateInputDateText } from "src/shared/components/forms/input-date-text/InputDateText"
import { useDate } from "src/shared/hooks/useDate"
import { swapDayMonth } from "src/shared/helpers/swapDayMonth"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { useDispatch } from "react-redux"
import { togglePersonalDrawer } from "src/store/personal/personal.slice"
import { quitarParentesisYEspacios } from "src/shared/hooks/quitarParentecisySpace"
import InputDate from "src/shared/components/forms/input-date/InputDate"
import { Tooltip } from "src/pages/inventario/producto/form/sections/Tooltip"
import ModalChangeDigitalAuthorization from "src/pages/personal/pages/onboarding-configuracion-digital/components/modal-digital-authorization/ModalChangeDigitalAuthorization"
import ModalConfirmBack from "./components/modal-confirm-back/ModalConfirmBack"
import { uploadFileToBucket } from "src/utils/s3Client"
import { REACT_APP_ARTICULOS_BUCKET, REACT_APP_AVATARS_BUCKET_FOLDER } from "src/config/environment"
import { ModalConfirm } from "src/shared/components/layout/modal-confirm/ModalConfirm"
import isRolWithFingerprintAndPIN from "./helpers/isRolWithFingerprintAndPIN"
import useLoadingState from "src/shared/hooks/useLoadingState"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"

interface DefaultValues {
    nombre: string
    apellido_materno: string
    apellido_paterno: string
    fechaNacimiento: string
    avatar: string
    fechaIng: Date[]
    nmEmpleado: string
    NID: string
    puestoOrol: string
    telefono: string
    telefonoEmergencia: string
    email: string
    address: string
    turno: string
    sueldo: number | null
    area: string
    es_supervisor: boolean
}

const defaultValues = {
    nombre: "",
    apellido_materno: "",
    apellido_paterno: "",
    fechaNacimiento: "",
    avatar: "",
    fechaIng: [new Date()],
    nmEmpleado: "",
    NID: "",
    puestoOrol: "",
    telefono: "",
    telefonoEmergencia: "",
    email: "",
    address: "",
    turno: "",
    sueldo: undefined,
    area: "",
    es_supervisor: false,
}

const RegistroPersonal = () => {
    const { data: puestos } = useGetPuestosByHotelIdQuery()
    const { hotel_id } = useProfile()

    const { data: colabsIDNum } = useColaboradoresIdNumQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: areas } = useGetAreasQuery({ variables: { hotel_id } })

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
    })

    const location = useLocation()
    const navigate = useNavigate()

    const [colaboradorSelected] = useState<Colaborador>(location?.state?.colaboradorSelected)
    const [isShowModalConfirmBack, setIsShowModalConfirmBack] = useState(false)
    const [isModalChangeDigitalAuthorizationOpen, setIsModalChangeDigitalAuthorizationOpen] = useState(false)
    const [crearColaborador] = useCrearColaboradorMutation()
    const [crearColaboradorConUsuario] = useCrearColaboradorConUsuarioMutation()

    const [actualizarColaborador] = useActualizarColaboradorMutation()
    const dispatch = useDispatch()

    const { showSnackbar } = useSnackbar()

    const { localDateToUTCString, UTCStringToLocalDate, setHHMMSS } = useDate()
    const { formatCustomDate } = useFormatDate()

    const [isSaving] = useState(!!colaboradorSelected)

    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
    const [roleMessage, setRoleMessage] = useState<string | JSX.Element>("")
    const [roleType, setRoleType] = useState<"noAuthRequired" | "authRequired" | null>(null)

    const handleRoleSelection = (role) => {
        const roles = (puestos?.puestos as Puesto[]) || []
        const roleFromEdit = colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.puesto_id || ""
        if (!roleFromEdit) {
            return setIsRoleModalOpen(false)
        }
        if (
            isRolWithFingerprintAndPIN({ selectedRol: roleFromEdit, roles }) &&
            !isRolWithFingerprintAndPIN({ selectedRol: role, roles })
        ) {
            setRoleMessage(
                <>
                    El nuevo rol <strong>no requiere autorización digital</strong>, su PIN y huella dactilar serán
                    eliminados.
                </>
            )
            setRoleType("noAuthRequired")
            setIsRoleModalOpen(true)
        } else if (
            isRolWithFingerprintAndPIN({ selectedRol: roleFromEdit, roles }) &&
            isRolWithFingerprintAndPIN({ selectedRol: role, roles })
        ) {
            setRoleType("authRequired")
            setIsRoleModalOpen(false)
        } else if (
            !isRolWithFingerprintAndPIN({ selectedRol: roleFromEdit, roles }) &&
            isRolWithFingerprintAndPIN({ selectedRol: role, roles })
        ) {
            setRoleMessage(
                <>
                    Este cambio de rol <strong>requiere autorización digital</strong>, por lo tanto debe{" "}
                    <strong>registrar su PIN y huella dactilar.</strong>
                </>
            )
            setRoleType("authRequired")
            setIsRoleModalOpen(true)
        }
    }

    const handleSetDigitalAuth = () => {
        sessionStorage.setItem("personalFormFalues", JSON.stringify(getValues()))
        navigate("/u/onboardingConfiguracionDigital")
    }

    const handleOpenModalChangeDigitalAuthorization = () => {
        setIsModalChangeDigitalAuthorizationOpen(true)
    }

    const valuesFromOnboarding = useMemo(() => {
        let values: typeof defaultValues | undefined = undefined
        if (sessionStorage.getItem("personalFormFalues")) {
            values = JSON.parse(sessionStorage.getItem("personalFormFalues") || "{}")
            if (values?.fechaIng) {
                values.fechaIng = values?.fechaIng?.map?.((d) => new Date(d))
            }
            sessionStorage.removeItem("personalFormFalues")
        }

        return values
    }, [])

    const [fingerprintsToRegister, setFingerprintsToRegister] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        let values: string[] | undefined = undefined
        if (sessionStorage.getItem("fingerprintData")) {
            values = JSON.parse(sessionStorage.getItem("fingerprintData") || "{}")
            sessionStorage.removeItem("fingerprintData")
        }
        setFingerprintsToRegister(values)
    }, [])

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty, isSubmitted },
        getValues,
        setValue,
        watch,
    } = useForm<DefaultValues>({
        defaultValues: {
            ...(valuesFromOnboarding
                ? valuesFromOnboarding
                : colaboradorSelected
                ? {
                      nombre: colaboradorSelected.nombre,
                      apellido_materno: colaboradorSelected.apellido_materno,
                      apellido_paterno: colaboradorSelected.apellido_paterno,
                      fechaNacimiento: formatShortDate(
                          UTCStringToLocalDate(colaboradorSelected.fecha_cumpleanios || ""),
                          true
                      ),
                      avatar: colaboradorSelected.foto || "",
                      fechaIng: [new Date(UTCStringToLocalDate(colaboradorSelected.fecha_ingreso || ""))],
                      nmEmpleado: colaboradorSelected.numero_colaborador,
                      NID: colaboradorSelected.numero_id,
                      puestoOrol: colaboradorSelected.colaborador_in_hotel?.[0]?.puesto?.puesto_id || "",
                      telefono: colaboradorSelected.telefono_personal,
                      telefonoEmergencia: colaboradorSelected.telefono_emergencia || "",
                      email: colaboradorSelected.correo || "",
                      address: colaboradorSelected.direccion || "",
                      turno: colaboradorSelected.turno.turno_id,
                      sueldo: colaboradorSelected?.sueldo || null,
                      area: colaboradorSelected.colaborador_in_hotel?.[0]?.area_id || "",
                      es_supervisor: colaboradorSelected?.es_supervisor || false,
                  }
                : defaultValues),
        },
    })

    const rolSelected = watch("puestoOrol")
    const isRolSelectedWithFingerprintAndPIN = useMemo(
        () => isRolWithFingerprintAndPIN({ selectedRol: rolSelected || "", roles: puestos?.puestos as Puesto[] }),
        [rolSelected, puestos]
    )

    const nombre = watch("nombre")
    const apellidoPaterno = watch("apellido_paterno")
    const colaboradorName = useMemo(() => `${nombre} ${apellidoPaterno}`, [nombre, apellidoPaterno])

    const isSupervisor = puestos?.puestos?.find((f) => f?.puesto_id === rolSelected)?.nombre === "Supervisor"

    const { isLoading, isLoadingDelayed, toggleIsLoading } = useLoadingState()

    const onSubmit = async (data, puestos: Puesto[], turnos, areas) => {
        const generatedPin: string | null = sessionStorage.getItem("PINData")

        if (
            (!isSaving && isRolSelectedWithFingerprintAndPIN && !fingerprintsToRegister && !generatedPin) ||
            isLoading
        ) {
            return
        }
        toggleIsLoading({ value: true })
        const turno = turnos?.find((t) => t.turno_id === data.turno)
        const area = areas?.find((a) => a.area_id === data.area)
        const avatar = data.avatar || ""

        const avatarUrl = avatar ? typeof avatar === "string" ? avatar : await uploadFileToBucket({
            bucket: REACT_APP_ARTICULOS_BUCKET ?? "",
            folder: REACT_APP_AVATARS_BUCKET_FOLDER ?? "",
            resourceName: `${colaboradorSelected?.colaborador_id}`.toLowerCase(),
            file: avatar,
        }) : ""

        const values = {
            nombre: data.nombre,
            apellido_materno: data.apellido_materno,
            apellido_paterno: data.apellido_paterno,
            fecha_cumpleanios: localDateToUTCString(new Date(swapDayMonth(data.fechaNacimiento))),
            fecha_ingreso: localDateToUTCString(data.fechaIng?.[0] || new Date()),
            ...(colaboradorSelected ? {} : { hotel_id }),
            foto: avatarUrl || "",
            sueldo: Number(data.sueldo),
            ...(colaboradorSelected?.numero_colaborador === data.nmEmpleado
                ? {}
                : { numero_colaborador: data.nmEmpleado }),
            ...(colaboradorSelected?.numero_id === data.NID ? {} : { numero_id: data.NID }),
            puesto_id: data.puestoOrol,
            telefono_personal: quitarParentesisYEspacios(data.telefono),
            telefono_emergencia: data.telefonoEmergencia ? quitarParentesisYEspacios(data.telefonoEmergencia) : "",
            correo: data.email,
            direccion: data.address,
            ...(colaboradorSelected?.turno_id === data.turno ? {} : { turno_id: data.turno }),
            hotel_id,
            area_id: area?.area_id,
            ...(generatedPin ? { codigo: generatedPin } : {}),
            es_supervisor: data?.es_supervisor || false,
        }

        if (colaboradorSelected) {
            actualizarColaborador({
                variables: {
                    datos_colaborador: {
                        ...values,
                        colaborador_id: colaboradorSelected.colaborador_id,
                        ...(isRolWithFingerprintAndPIN({
                            selectedRol: data.puestoOrol,
                            roles: puestos as Puesto[],
                        })
                            ? fingerprintsToRegister
                                ? { template_sample: fingerprintsToRegister }
                                : {}
                            : { template_sample: [] }),
                    },
                },
            })
                .then(() => {
                    showSnackbar({
                        status: "success",
                        title: "Actualización de datos",
                        text: `Se actualizaron los datos de **${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}**`,
                    })
                    navigate("/u/tablePerson")
                })
                .catch((e) => {
                    showSnackbar({
                        title: "Errror al editar datos",
                        text: e.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .finally(() => {
                    dispatch(togglePersonalDrawer(false))
                    toggleIsLoading({ value: false })
                })
            return
        }
        if (isRolSelectedWithFingerprintAndPIN) {
            crearColaboradorConUsuario({
                variables: {
                    ColaboradorInput: {
                        ...values,
                        ...(fingerprintsToRegister
                            ? { template_sample: fingerprintsToRegister }
                            : { template_sample: [] }),
                    } as CreateColaboradorUsuarioInput,
                },
            })
                .then(() => {
                    showSnackbar({
                        status: "success",
                        title: "Personal registrado",
                        text: `**${data.nombre} ${data.apellido_paterno} ${
                            data.apellido_materno
                        }** ya está registrada exitosamente en tu personal como **${
                            puestos.find((p) => p.puesto_id === data.puestoOrol)?.nombre
                        }** para el **turno ${turno?.nombre} de ${formatCustomDate(
                            turno?.hora_entrada || "", "hh:mm A"
                        )} a ${formatCustomDate(turno?.hora_salida || "", "hh:mm A")}.**`,
                    })
                    dispatch(togglePersonalDrawer(false))
                    navigate("/u/tablePerson")
                })
                .catch((e) => {
                    showSnackbar({
                        title: "Errror al registrar personal",
                        text: e.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                        status: "error",
                    })
                })
                .finally(() => {
                    dispatch(togglePersonalDrawer(false))
                    toggleIsLoading({ value: false })
                })
            return
        }
        crearColaborador({
            variables: {
                ColaboradorInput: {
                    ...values,
                } as CreateColaboradorInput,
            },
        })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Personal registrado",
                    text: `**${data.nombre} ${data.apellido_paterno} ${
                        data.apellido_materno
                    }** ya está registrada exitosamente en tu personal como **${
                        puestos.find((p) => p.puesto_id === data.puestoOrol)?.nombre
                    }** para el **turno ${turno?.nombre} de ${formatCustomDate(
                        turno?.hora_entrada || "", "hh:mm A"
                    )} a ${formatCustomDate(turno?.hora_salida || "", "hh:mm A")}.**`,
                })
                dispatch(togglePersonalDrawer(false))
                navigate("/u/tablePerson")
            })
            .catch((e) => {
                showSnackbar({
                    title: "Errror al registrar personal",
                    text: e.message || "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => dispatch(togglePersonalDrawer(false)))
    }

    return (
        <Screen
            title={colaboradorSelected ? "Edición del personal" : "Registro de personal"}
            back={true}
            onBack={() => {
                if (colaboradorSelected && !isDirty) {
                    navigate(-1)
                    dispatch(togglePersonalDrawer(false))
                    return
                }
                setIsShowModalConfirmBack(true)
            }}
        >
            <form
                className="addPerson"
                onSubmit={handleSubmit((data) =>
                    onSubmit(data, puestos?.puestos as Puesto[], turnos?.turnos, areas?.areas)
                )}
            >
                <div className="addPerson__photo">
                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <InputFoto
                                pictureSrc={value}
                                onPictureChange={(value) => onChange(value)}
                                modalTitle="Foto del personal"
                                modalSubtitle="Ajusta la imagen del personal en el centro del círculo"
                            />
                        )}
                    />
                </div>
                <div className="addPerson__form">
                    <div className="addPerson__formcontainer">                       
                        <div className="addPerson__form__title">Información personal</div>
                        <div className="addPerson__form__inputs-group">
                            <div className="addPerson__form__inputs-group__fill">
                                <Controller
                                    name="nombre"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            icon={UserFilled}
                                            value={value}
                                            placeholder="Nombre del Personal"
                                            onChange={(data) => onChange(data)}
                                            label={"Nombre"}
                                            type={"text"}
                                            className="addPerson__form__title__input"
                                            error={errors.nombre && true}
                                            errorhinttext={"El nombre es requerido"}
                                        />
                                    )}
                                />
                                <Controller
                                    name="apellido_paterno"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            icon={UserContactsFill}
                                            value={value}
                                            className="addPerson__form__title__input"
                                            placeholder="Apellido paterno del personal"
                                            onChange={(data) => onChange(data)}
                                            label={"Apellido paterno"}
                                            type={"text"}
                                            error={errors.apellido_paterno && true}
                                            errorhinttext={"El apellido paterno es requerido"}
                                        />
                                    )}
                                />
                                <Controller
                                    name="apellido_materno"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            icon={UserContactsFill}
                                            value={value}
                                            className="addPerson__form__title__input"
                                            placeholder="Apellido materno del personal"
                                            onChange={(data) => onChange(data)}
                                            label={"Apellido materno"}
                                            type={"text"}
                                            error={errors.apellido_materno && true}
                                            errorhinttext={"El apellido materno es requerido"}
                                        />
                                    )}
                                />
                                <Controller
                                    name="fechaNacimiento"
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (v) =>
                                            validateInputDateText(v, "La fecha de nacimiento es requerida"),
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputDateText
                                            placeholder="DD/MM/AAAA"
                                            type="text"
                                            value={value}
                                            error={!!errors.fechaNacimiento}
                                            errorhinttext={
                                                errors.fechaNacimiento
                                                    ? errors.fechaNacimiento?.type === "validate"
                                                        ? "La fecha ingresada no es válida"
                                                        : "La fecha de nacimiento es requerida"
                                                    : ""
                                            }
                                            className="addPerson__form__title__input"
                                            label="Fecha de nacimiento"
                                            onChange={(value) => onChange(value)}
                                        />
                                    )}
                                />
                                <Controller
                                    name="NID"
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (v) =>
                                            !colabsIDNum?.colaboradores
                                                ?.filter(
                                                    (c) => c.colaborador_id !== colaboradorSelected?.colaborador_id
                                                )
                                                ?.find((c) => c.numero_id === v),
                                    }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <InputText
                                            icon={accountBoxFill}
                                            value={value}
                                            placeholder="Numero ID"
                                            className="addPerson__form__title__input"
                                            onChange={(data) => {
                                                onChange(data)
                                            }}
                                            label={"ID del personal"}
                                            type={"text"}
                                            error={!!error}
                                            errorhinttext={
                                                error?.type === "validate"
                                                    ? `Número ID en uso`
                                                    : error?.type === "required"
                                                    ? "El ID es requerido"
                                                    : ""
                                            }
                                            tooltipInput={{
                                                title: "Número de ID",
                                                description:
                                                    "Escribe el número de identificación oficial de tu personal. Ej. Número de seguro social",
                                                theme: "dark",
                                            }}
                                            toolTipInfo={true}
                                        />
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            value={value}
                                            icon={MailFill}
                                            placeholder="ejemplo@correo.com"
                                            className="addPerson__form__title__input"
                                            label="Correo electrónico"
                                            onChange={(data) => onChange(data)}
                                            style={{ widows: "33%" }}
                                            error={!!errors?.email}
                                            type="text"
                                            errorhinttext={"El email es requerido"}
                                        />
                                    )}
                                />
                            </div>
                            <div className="addPerson__form__inputs-group__fill">
                                <div className="addPerson__form__tel">
                                    <Controller
                                        name="telefono"
                                        control={control}
                                        rules={{ required: true, validate: (v) => /^[^_]*$/.test(v) }}
                                        render={({ field: { onChange, value } }) => (
                                            <InputTel
                                                placeholder="(55) 5555 5555"
                                                className="addPerson__form__title__input"
                                                label={"Teléfono personal"}
                                                error={!!errors?.telefono}
                                                errorhinttext={"El teléfono es requerido"}
                                                telValue={value}
                                                prefixValue={"MX +52"}
                                                onPrefixChange={(e) => console.log(e.value)}
                                                onInputChange={(e) => onChange(e)}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="addPerson__form__tel">
                                    <Controller
                                        name="telefonoEmergencia"
                                        control={control}
                                        rules={{ required: true, validate: (v) => /^[^_]*$/.test(v) }}
                                        render={({ field: { onChange, value } }) => (
                                            <InputTel
                                                placeholder="(55) 5555 5555"
                                                className="addPerson__form__title__input"
                                                label={"Teléfono emergencia"}
                                                error={!!errors?.telefonoEmergencia}
                                                errorhinttext={"El teléfono es requerido"}
                                                telValue={value}
                                                prefixValue={"MX +52"}
                                                onPrefixChange={(e) => console.log(e.value)}
                                                onInputChange={(e) => onChange(e)}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="addPerson__form__inputs-group__row">
                                <Controller
                                    name="address"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            value={value}
                                            placeholder="Calle/Colonia/Delegación o municipio, Ciudad, C.P."
                                            className="addPerson__form__title__input addPerson__form__address__input"
                                            label="Domicilio"
                                            icon={home3fill}
                                            onChange={(data) => onChange(data)}
                                            type="text"
                                            error={!!errors?.address}
                                            errorhinttext={"La direccion es requerida"}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="addPerson__formcontainer">
                        <div className="addPerson__form__title">Información laboral</div>
                        <div className="addPerson__form__inputs-group">
                            <div className="addPerson__form__inputs-group__fill">
                                <Controller
                                    name="nmEmpleado"
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (v) =>
                                            !colabsIDNum?.colaboradores
                                                ?.filter(
                                                    (c) => c.colaborador_id !== colaboradorSelected?.colaborador_id
                                                )
                                                ?.find((c) => c.numero_colaborador === v),
                                    }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <InputText
                                            icon={UserFilled}
                                            value={value}
                                            className="addPerson__form__title__input"
                                            placeholder="Escribe un número"
                                            onChange={(data) => onChange(data)}
                                            label={"Número de empleado"}
                                            type={"text"}
                                            error={!!error}
                                            errorhinttext={
                                                error?.type === "validate"
                                                    ? `Número de empleado en uso`
                                                    : error?.type === "required"
                                                    ? "La el número de empleado es requerido"
                                                    : ""
                                            }
                                            tooltipInput={{
                                                title: "Número de empleado",
                                                description:
                                                    "Escribe una clave de empleado de tu preferencia para identificar más rápido a tu personal",
                                                theme: "dark",
                                            }}
                                            toolTipInfo={true}
                                        />
                                    )}
                                />
                                <Controller
                                    name="area"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                                        <Dropdown
                                            value={value}
                                            icon="buildingTwo"
                                            placeholder="Selecciona una opción"
                                            className="addPerson__form__title__input"
                                            onClick={(data) => onChange(data.value)}
                                            label={"Área"}
                                            errorHintText={error ? "El área es requerida" : ""}
                                            options={
                                                areas?.areas.map((p) => ({
                                                    label: p.nombre,
                                                    value: p.area_id,
                                                })) || []
                                            }
                                            iconInOptions={false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="puestoOrol"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <Dropdown
                                            value={value}
                                            icon="SuitcaseFill"
                                            placeholder="Puesto o rol del personal"
                                            className="addPerson__form__title__input"
                                            onClick={(data) => {
                                                onChange(data.value)
                                                handleRoleSelection(data.value)
                                            }}
                                            label={"Puesto o rol"}
                                            errorHintText={errors.puestoOrol ? "El puesto es requerido" : ""}
                                            options={
                                                puestos?.puestos.map((p) => ({
                                                    label: p.nombre,
                                                    value: p.puesto_id,
                                                })) || []
                                            }
                                            iconInOptions={false}
                                        />
                                    )}
                                />
                            </div>
                            {isRoleModalOpen && (
                                <ModalConfirm
                                    isOpen={isRoleModalOpen}
                                    icon={
                                        <Icon
                                            name="ExclamationFilled"
                                            color="var(--pink-ocupado)"
                                            height={24}
                                            width={24}
                                        />
                                    }
                                    iconTheme="danger"
                                    title="Cambio de rol"
                                    description={roleMessage}
                                    cancelButtonText="Cancelar"
                                    confirmButtonText={
                                        roleType === "authRequired" ? "Registrar PIN y/o huella" : undefined
                                    } // Solo lo cambia si se pasa
                                    onCloseDialog={({ confirmed }) => {
                                        setIsRoleModalOpen(false)
                                        if (!confirmed) {
                                            setValue(
                                                "puestoOrol",
                                                colaboradorSelected?.colaborador_in_hotel?.[0]?.puesto?.puesto_id || ""
                                            )
                                            return
                                        }
                                        if (
                                            isRolWithFingerprintAndPIN({
                                                selectedRol: rolSelected,
                                                roles: puestos?.puestos as Puesto[],
                                            })
                                        ) {
                                            sessionStorage.setItem("personalFormFalues", JSON.stringify(getValues()))
                                            navigate("/u/onboardingConfiguracionDigital")
                                        } else {
                                            showSnackbar({
                                                status: "success",
                                                title: "Eliminación de PIN y huella de autorización",
                                                text: `Se eliminó PIN y huella para ${colaboradorSelected?.nombre} ${colaboradorSelected?.apellido_paterno} ${colaboradorSelected?.apellido_materno} exitosamente.`,
                                            })
                                        }
                                    }}
                                />
                            )}

                            <div className="addPerson__form__inputs-group__fill">
                                <Controller
                                    name="turno"
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value } }) => (
                                        <Dropdown
                                            value={value}
                                            icon="Stopwatch"
                                            placeholder="Turno del personal"
                                            className="addPerson__form__title__input"
                                            errorHintText={errors.turno ? "El turno es requerido" : ""}
                                            onClick={(data) => onChange(data.value)}
                                            label={"Turno"}
                                            options={
                                                turnos?.turnos.map((t) => ({
                                                    label: t.nombre,
                                                    value: t.turno_id,
                                                })) || []
                                            }
                                            iconInOptions={false}
                                        />
                                    )}
                                />
                                <Controller
                                    name="fechaIng"
                                    control={control}
                                    rules={{
                                        required: true,
                                    }}
                                    // onChange del Controller le da el nuevo valor al input dentro del estado del formulario y le establece también el valor a este DatePicker
                                    render={({
                                        field: { onChange: onFieldChange, value: fieldValue },
                                        formState: { errors },
                                    }) => (
                                        <InputDate
                                            placeholder="Selecciona una fecha"
                                            label="Fecha de ingreso"
                                            inputClassName="addPerson__form__title__input"
                                            isRange={false}
                                            onReset={() => {
                                                onFieldChange([
                                                    setHHMMSS({
                                                        startDate: new Date(),
                                                        newHour: "00:00:00",
                                                        isNewHourInUTC: false,
                                                    }),
                                                ])
                                            }}
                                            onChange={(date) => {
                                                onFieldChange([date])
                                            }}
                                            value={fieldValue}
                                            errorHintText={errors.fechaIng ? "La fecha de ingreso es requerida" : ""}
                                        />
                                    )}
                                />
                                <Controller
                                    name="sueldo"
                                    control={control}
                                    rules={{ required: false }}
                                    render={({ field: { onChange, value } }) => (
                                        <InputText
                                            icon={DollarCircle}
                                            value={value + ""}
                                            placeholder="Sueldo del personal"
                                            className="addPerson__form__title__input"
                                            onChange={(data) => onChange(data)}
                                            label={"Sueldo (opcional)"}
                                            type={"number"}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="addPersonFingerprint__buttonSubm">
                            {isRolSelectedWithFingerprintAndPIN && (
                                <div className="addPersonFingerprint__link__container">
                                    <div
                                        onClick={() => {
                                            if (isSaving) {
                                                handleOpenModalChangeDigitalAuthorization()
                                            } else {
                                                handleSetDigitalAuth()
                                            }
                                        }}
                                        className="addPersonFingerprint__link__action"
                                    >
                                        <Icon color="var(--primary)" name={isSaving ? "editFill" : "plusCircle"} />
                                        <span className="addPersonFingerprint__link__texto">
                                            <span className="addPersonFingerprint__link__bold-text">
                                                {isSaving
                                                    ? "Cambiar PIN y huella de autorización"
                                                    : "Agregar PIN y huella"}
                                            </span>
                                        </span>
                                    </div>
                                    {!isSaving && (
                                        <div className="addPersonFingerprint__link__tooltip">
                                            <Tooltip
                                                placement={"right"}
                                                title="Huella Dactilar y/o PIN"
                                                description="Esta opción facilita el trabajo de tus colaboradores en tareas cotidianas y te brinda seguridad en tus operaciones críticas"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            <div
                                className="buttonSubm"
                                style={{ justifyContent: isSupervisor ? "flex-end" : "space-between" }}
                            >
                                {!isSupervisor && (
                                    <div className="addPerson__supervisor">
                                        <Controller
                                            name={"es_supervisor"}
                                            control={control}
                                            rules={{ required: false }}
                                            render={({ field: { onChange, value } }) => (
                                                <Checkbox
                                                    className="addPerson__supervisor-check"
                                                    iconColorWhenChecked="var(--white)"
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                        <div className="addPerson__supervisor-contain">
                                            <p className="addPerson__supervisor-title">
                                                {"Habilitar funciones de supervisión"}
                                            </p>
                                            <p className="addPerson__supervisor-description">
                                                {
                                                    "Al activar esta opción, el perfil podrá validar habitaciones en estado de supervisión,\nademás de las funciones de su rol principal."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                                <Button
                                    disabled={isLoadingDelayed}
                                    text={colaboradorSelected ? "Guardar cambios" : "Registrar personal"}
                                    type="submit"
                                    style={{ width: "305px" }}
                                />
                            </div>
                        </div>
                        {!isRolSelectedWithFingerprintAndPIN && <div className="addPersonFingerprint__error"></div>}
                        {!isSaving &&
                            isRolSelectedWithFingerprintAndPIN &&
                            isSubmitted &&
                            !fingerprintsToRegister &&
                            !sessionStorage.getItem("PINData") && (
                                <div className="addPersonFingerprint__error">
                                    <span>Por favor ingresa PIN y huella dactilar para continuar</span>
                                </div>
                            )}
                    </div>
                    <ModalChangeDigitalAuthorization
                        colaboradorName={colaboradorName}
                        isOpen={isModalChangeDigitalAuthorizationOpen}
                        onClose={() => setIsModalChangeDigitalAuthorizationOpen(false)}
                        onAuthorizationSave={(d) => setFingerprintsToRegister(d)}
                    />
                </div>
            </form>
            <ModalConfirmBack isOpen={isShowModalConfirmBack} setIsOpen={setIsShowModalConfirmBack} />
        </Screen>
    )
}

export default RegistroPersonal
