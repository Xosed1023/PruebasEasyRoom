import "./Registry.css"
import "../login/Login.css"
import { Controller, useForm } from "react-hook-form"
import { Button, InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { countrys, roles } from "./Registry.data"
import Dropdown from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { CreateUsuarioInput, PuestoRol, useCrearUsuarioMutation } from "src/gql/schema"
import { UsuarioIput } from "./Registry.constants"
import useSnackbar from "src/shared/hooks/useSnackbar"

type FormValues = {
    country: string
    hotel: string
    rol: string
}

enum Origen {
    Google = "google",
    Email = "email",
}

const getParams = (params: any) => {
    return {
        name: params?.name || "",
        email: params?.email || "",
        password: params?.password || "",
    }
}

function RegistryData(): JSX.Element {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            country: "",
            hotel: "",
            rol: "",
        },
    })

    const navigate = useNavigate()
    const location = useLocation()
    const { name, email, password } = getParams(location.state)
    const { showSnackbar } = useSnackbar()
    const [crearUsuario] = useCrearUsuarioMutation()

    const onSubmit = async (values: FormValues): Promise<void> => {
        const fullName = name.split(" ")
        const names = fullName.length > 3 ? fullName[0] + " " + fullName[1] : fullName[0]
        const patName = fullName.length > 3 ? fullName[2] : fullName[1]
        const matNameArray = fullName.length > 3 ? fullName.slice(3) : [fullName[2]]
        let matName = ""
        matNameArray.map((name) => {
            matName = matName + name + " "
        })
        let dataMutation: CreateUsuarioInput = UsuarioIput
        if (password) {
            dataMutation = {
                nombre: names,
                apellido_paterno: fullName.length > 1 ? patName : "",
                apellido_materno: fullName.length > 2 ? matName : "",
                correo: email,
                empresa_hotel: values.hotel,
                password: password,
                puesto_rol: PuestoRol[values.rol],
                pais: values.country,
                origen: Origen.Email,
            }
        } else {
            dataMutation = {
                nombre: names,
                apellido_paterno: fullName.length > 1 ? patName : "",
                apellido_materno: fullName.length > 2 ? matName : "",
                correo: email,
                empresa_hotel: values.hotel,
                puesto_rol: PuestoRol[values.rol],
                pais: values.country,
                origen: Origen.Google,
            }
        }
        crearUsuario({
            variables: {
                createUsuarioInput: dataMutation,
            },
        })
            .then(({ data }) => {
                if (data) {
                    navigate(`/auth/registry/verification`, { state: { email } })
                }
            })
            .catch((e) => {
                showSnackbar({
                    status: "error",
                    title: "Error al crear una cuenta",
                    text: `${e?.message}`,
                })
            })
    }

    return (
        <div className="registry-screen">
            <img
                className="registry-screen_logo"
                src={require("src/assets/png/logo_md.png")}
                width={220}
                height={38}
                alt="logo"
            />
            <div className="registry-screen_content">
                <p className="registry-screen_title">Creación de cuenta</p>
                <form className="login-screen__form" onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name={"country"}
                        rules={{ required: true }}
                        render={({ field: { value, onChange }, formState: { errors } }) => (
                            <Dropdown
                                icon={"country"}
                                iconInOptions={false}
                                className={"registry-screen__select"}
                                label={"País"}
                                placeholder={"Selecciona una opción"}
                                errorHintText={errors.country ? "Selecciona una opción" : ""}
                                options={countrys}
                                value={value}
                                onClick={({ value }) => {
                                    onChange(value)
                                }}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="hotel"
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <div className="login-screen__input">
                                <InputText
                                    icon={Icon}
                                    iconProps={{ name: "HotelFilled", width: 24, height: 24 }}
                                    label="Nombre de empresa / hotel "
                                    data-testid="hotel"
                                    type="text"
                                    placeholder="Escribe el nombre de tu empresa"
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    error={!!errors.hotel}
                                    errorhinttext={errors.country ? "Escribe el nombre de tu empresa" : ""}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="rol"
                        rules={{ required: false }}
                        render={({ field: { value, onChange } }) => (
                            <Dropdown
                                icon={"SuitcaseFill"}
                                iconInOptions={false}
                                className={"registry-screen__select"}
                                label={"Puesto o rol que desempeñas"}
                                placeholder={"Selecciona una opción"}
                                options={roles}
                                value={value}
                                onClick={({ value }) => {
                                    onChange(value)
                                }}
                            />
                        )}
                    />
                    <Button className="login-screen__button_submit" type={"submit"} text="Crear cuenta" />
                    <Button
                        className="login-screen__button_secondary"
                        theme="secondary"
                        text="Regresar"
                        onClick={() => navigate("/auth/registry")}
                    />
                </form>
            </div>
        </div>
    )
}

export default RegistryData
