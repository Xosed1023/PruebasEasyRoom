import { useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { startGetMyProfile } from "../../home/store/thunks/profile.thunk"
import Icon from "src/shared/icons"
import { InputPassword } from "./Login.sections"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { Button, InputText } from "src/shared/components/forms"
import { client } from "src/graphql"
import { createSession } from "src/utils/session"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { FormValues } from "./Login.types"
import "./Login.css"
import { useStartGoogleClient } from "../hooks/useStartGoogleClient"
import { useLoginGoogleMutation, useLoginMutation, useRegistrarEventoLoginMutation } from "src/gql/schema"
import { GET_MY_PROFILE } from "src/graphql/queries/users"
import { useState } from "react"
import LoginFingerprint from "./modals/LoginFingerprint/LoginFingerprint"
import ColabInactiveModal from "src/shared/components/modal/ColabInactiveModal/ColabInactiveModal"

export function Form(): JSX.Element {
    const { showSnackbar } = useSnackbar(5000, { top: 30 })
    const [login] = useLoginMutation()

    const [loginGoogle] = useLoginGoogleMutation()
    const [registrarEventoLogin] = useRegistrarEventoLoginMutation()
    const [isModalLoginHuellaOpen, setisModalLoginHuellaOpen] = useState(false)
    const [isModalColabInactiveOpen, setisModalColabInactiveOpen] = useState(false)

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: "",
            password: "",
            session: false,
        },
    })

    const rememberSession = watch("session")

    const handleSession = (token: string, session: boolean, hotel_id: string, usuario_id: string) => {
        const sesion_id = self.crypto.randomUUID()
        sessionStorage.setItem("@sesion_id", sesion_id)
        registrarEventoLogin({
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Client-URL": window.location.origin,
                },
            },
            variables: { input: { hotel_id, usuario_id, sesion_id } },
        })
            .then(() => {
                createSession(token, session)
                dispatch(startGetMyProfile())
                goHome()
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al iniciar sesión",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }

    const handleLoginSuccess = (response: google.accounts.id.CredentialResponse) => {
        loginGoogle({
            variables: {
                loginGoogleInput: {
                    client_id: (response as any).client_id,
                    token: response.credential,
                },
            },
        })
            .then(({ data }) => {
                const res = data?.login_google
                const token = res?.token || ""
                const hotel_id = res?.ultimo_hotel_id || ""
                const usuario_id = res?.usuario_id || ""

                if (token) {
                    handleSession(token, rememberSession, hotel_id, usuario_id)
                }
            })
            .catch((e) => {
                if (e.message === "El usuario no se encuentra registrado") {
                    showSnackbar({
                        text: "El usuario no se encuentra registrado",
                        status: "error",
                        title: "Error al iniciar sesión",
                    })
                    return
                }
                showSnackbar({
                    title: "Error al iniciar sesión",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
    }

    useStartGoogleClient({ googleButtonId: "google-login-button", handleLoginSuccess, text: "signin_with" })

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getEmailError = (): string => {
        const type = errors.email?.type
        return type === "required" ? "Ingresa un correo" : type === "pattern" ? "Ingresa un correo válido" : ""
    }

    const onSubmit = (values: FormValues): void => {
        const { session, ...variables } = values
        login({
            variables: {
                loginInput: variables,
            },
        })
            .then(({ data }) => {
                if (data?.login) {
                    if (!data?.login.colaborador_activo) {
                        setisModalColabInactiveOpen(true)
                        return
                    }
                    const res = data?.login
                    const token = res?.token || ""
                    const hotel_id = res?.ultimo_hotel_id || ""
                    const usuario_id = res?.usuario_id || ""
                    if (token) {
                        handleSession(token, session, hotel_id, usuario_id)
                    } else {
                        showSnackbar({ status: "error", title: "Datos incorrectos" })
                    }
                } else {
                    showSnackbar({ status: "error", title: "Datos incorrectos" })
                }
            })
            .catch((e) => {
                showSnackbar({ status: "error", title: e?.networkError ? "Error de conexiòn" : `${e?.message}` })
            })
    }

    const goHome = async () => {
        const sesion_id = sessionStorage.getItem("@sesion_id") || ""
        const {
            data: { mi_perfil },
        } = await client.query({ query: GET_MY_PROFILE, fetchPolicy: "no-cache", variables: { sesion_id } })
        const roles = mi_perfil?.roles
        if (roles.length > 0) {
            navigate("/u", { replace: true })
        } else {
            navigate("/u/empty-state")
        }
    }

    return (
        <form className="login-screen__form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                render={({ field: { value, onChange } }) => (
                    <div className="login-screen__input">
                        <InputText
                            icon={Icon}
                            iconProps={{ name: "mailFill", width: 24, height: 24 }}
                            label="Email"
                            data-testid="email"
                            type="text"
                            placeholder="Ingresa tu correo"
                            value={value}
                            onChange={(e) => onChange(`${e.target.value}`.trim())}
                            error={!!errors.email}
                            errorhinttext={getEmailError()}
                        />
                    </div>
                )}
            />
            <Controller
                control={control}
                name="password"
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                    <InputPassword
                        type={"text"}
                        value={value}
                        onChange={(e) => onChange(`${e.target.value}`.trim())}
                        error={!!errors.password}
                        errorhinttext={
                            errors.password?.type === "required" ? "Ingresa una contraseña" : "Contraseña incorrecta"
                        }
                    />
                )}
            />
            <div className="login-screen__controls">
                <Controller
                    control={control}
                    name="session"
                    render={({ field: { value, onChange } }) => (
                        <Checkbox
                            className="login-screen__check"
                            label="Recordarme  en este equipo"
                            value={value}
                            onChange={onChange}
                        />
                    )}
                />
                <p className="login-screen__link-forgot" onClick={() => navigate("/auth/forgot-password")}>
                    {"Olvidé mi contraseña"}
                </p>
            </div>
            <Button className="login-screen__button" type={"submit"} text="Ingresar" />
            <p className="login-screen__link-fingerprint" onClick={() => setisModalLoginHuellaOpen(true)}>
                {"Ingresar con huella dactilar"}
            </p>
            <div className="login-screen_divisor">
                <hr className="hrLinea" /> <p className="login-screen_divisor_text">o</p> <hr className="hrLinea" />
            </div>
            <div className="google-login-button" id="google-login-button"></div>
            <p className="login-screen_correo">
                ¿No tienes cuenta?{" "}
                <span className="login-screen_correo_text" onClick={() => navigate("/auth/registry")}>
                    Regístrate
                </span>
            </p>
            <ColabInactiveModal isOpen={isModalColabInactiveOpen} onClose={() => setisModalColabInactiveOpen(false)} />
            <LoginFingerprint onClose={() => setisModalLoginHuellaOpen(false)} isOpen={isModalLoginHuellaOpen} />
        </form>
    )
}

function Login(): JSX.Element {
    return (
        <section className="login-screen">
            <div className="login-screen__content">
                <img
                    className="login-screen__logo"
                    src={require("src/assets/png/logo_md.png")}
                    width={270}
                    height={48}
                    alt="logo"
                />
                <h1 className="login-screen__title">{"Iniciar sesión"}</h1>
                <Form />
            </div>
            <div className="login-screen__media">
                <img
                    className="login-screen__cover"
                    src={"https://articulos.nyc3.cdn.digitaloceanspaces.com/easyroom/cover_login.png"}
                    width={640}
                    height={"auto"}
                    alt="cover"
                />
                <div className="login-screen__text">
                    <h3 className="login-screen__subtitle">
                        {"Descubre lo fácil que es operar tu hotel con Easyroom"}
                    </h3>
                    <p className="login-screen__description">
                        {"Ten el control en tiempo real del estatus de habitaciones, personal, reservas y más."}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default Login
