import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useGetPerfilLazyQuery, useLoginGoogleMutation, useLoginMutation } from "@/gql/schema"
import { useBiometricNative } from "@/hooks/native/useBiometricNative"
import { useSimpleAuthn } from "@/hooks/native/useSimpleAuthn"
import { useProfile } from "@/hooks/store/useProfile"
import Logo from "assets/png/logo.png"
import InputText from "components/core/forms/input-text/InputText"
import Checkbox from "components/core/forms/checkbox/Checkbox"
import Button from "components/core/forms/button/Button"
import useSnackbar from "@/hooks/useSnackbar"
import { AuthGoogleParams, FormValues, StartSessionParams } from "./Login.type"
import { onClearSession, onCreateSession } from "@/utils/session"
import styles from "./Login.module.css"
import EntryAuthGoogle from "./components/EntryAuthGoogle"

//Flag provisional que indica que se ejecute el métedo de autentticación "auth", al cambiar su valor en "false" se ejecuta el modo "local"
const authnMode = false

function Login() {
    const [login] = useLoginMutation()
    const [loginWithGoogle] = useLoginGoogleMutation()
    const [getPerfil] = useGetPerfilLazyQuery()
    const [isLoading, setIsLoading] = useState(false);


    const navigate = useNavigate()

    const { handleProfile, handleHotel } = useProfile()
    const { showSnackbar } = useSnackbar()

    const { isRegisteredBiometric, getVerifyBiometric, setRegisterBiometric } = useBiometricNative()
    const { getAuthnToken, setRegisterUser } = useSimpleAuthn()

    //useStartGoogleClient({ googleButtonId: "google-login-button", handleGoogleLoginSuccess, text: "signin_with" })
    const remember = localStorage.getItem("@remember-user") || ""

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            email: remember,
            password: "",
            session: remember !== "",
        },
    })

    useEffect(() => {
        onClearSession()
    }, [])

    // NOTE: Se cambio a any ya que hay que adaptar la API de google al que nos provee Capacitor

    function handleGoogleLoginSuccess(response: AuthGoogleParams) {
        loginWithGoogle({
            variables: {
                loginGoogleInput: {
                    client_id: response.client_id,
                    token: response.credential,
                },
            },
        })
            .then(({ data }) => {
                const token = data?.login_google?.token
                if (token) {
                    onStartSession({ token, session: false })
                } else {
                    showSnackbar({
                        status: "error",
                        title: "Error al iniciar sesión",
                        text: "¡Ups! no pudimos reconocer tu huella. Por favor, inténtalo nuevamente.",
                    })
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

    const onSumitBiometrics = async () => {
        try {
            const key = await getVerifyBiometric()
            if (key) {
                const { data } = await login({ variables: { loginInput: key } })
                const token = data?.login?.token
                if (token) {
                    onStartSession({ token, session: false })
                } else {
                    showSnackbar({ status: "error", title: "Datos incorrectos" })
                }
            } else {
                showSnackbar({ status: "error", title: "Error al iniciar sesión con huella" })
            }
        } catch (e: any) {
            console.log(e)
            const message = e?.message || ""
            showSnackbar({ status: "error", title: message || "Error al iniciar sesión con huella" })
        }
    }

    const onSumitAuthn = async () => {
        try {
            const token = await getAuthnToken()
            if (token) {
                onStartSession({ token, session: false })
            } else {
                showSnackbar({ status: "error", title: "Datos incorrectos" })
            }
        } catch (e: any) {
            showSnackbar({ status: "error", title: e?.message || "Error al iniciar sesión con huella" })
            console.log(e)
        }
    }

    const onSubmit = (values: FormValues): void => {
        setIsLoading(true);
        const { session, ...variables } = values
        login({ variables: { loginInput: variables } })
            .then(({ data }) => {
                if (data?.login) {
                    const token = `${data?.login?.token}`
                    if (token) {
                        onStartSession({
                            token,
                            session,
                            user: {
                                ...variables,
                            },
                        })
                    } else {
                        showSnackbar({ status: "error", title: "Datos incorrectos" })
                    }
                } else {
                    showSnackbar({ status: "error", title: "Datos incorrectos" })
                }
            })
            .catch((e) => {
                showSnackbar({
                    status: "error",
                    title: e?.networkError ? "Error de conexión" : "El usuario o la contraseña son incorrectos",
                })
            })
             .finally(() => {
            setIsLoading(false); 
        });
    }
    

    const onStartSession = ({ token, session, user }: StartSessionParams) => {
        getPerfil({
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Client-URL": window.location.origin,
                },
            },
        })
            .then(({ data }) => {
                const usuario = data?.mi_perfil
                const usuario_id = usuario?.usuario_id || ""
                if (usuario) {
                    const rolSuperAdmin = usuario.roles?.some((role) => role.nombre === "SUPERADMIN") ?? false
                    if (!rolSuperAdmin) {
                        showSnackbar({
                            status: "error",
                            title: "Acceso denegado",
                            text: "No tienes los permisos necesarios para acceder a esta aplicación. Por favor, contacta al administrador.",
                        })
                        return
                    }
                    onCreateSession(token, session, user?.email || "")
                    const profile = {
                        usuario,
                        usuario_id,
                        hotel: {
                            hotel_id: "",
                            nombre_hotel: "",
                            zona_horaria: "",
                            logo_hotel: "",
                        },
                        nombre: `${usuario?.nombre || ""} ${usuario?.apellido_paterno || ""} ${
                            usuario?.apellido_materno || ""
                        }`.trim(),
                        turno_id: usuario?.turno?.turno_id || "",
                        rol: usuario.roles?.[0]?.nombre || "",
                        estatus: usuario?.estatus,
                        foto: usuario?.colaborador?.foto || "",
                        hoteles: usuario?.hotel || [],
                    }
                    handleProfile(profile)
                    localStorage.setItem("@profile", JSON.stringify(profile))
                    if (profile.hoteles && profile.hoteles.length === 1) {
                        const h = profile.hoteles[0]
                        handleHotel({
                            hotel_id: h?.hotel_id || "",
                            nombre_hotel: h?.nombre_hotel || "",
                            zona_horaria: h?.zona_horaria || "",
                            logo_hotel: h?.logo_hotel || "",
                        })
                        navigate(`/u/home/${h.hotel_id}`)
                    } else {
                        navigate("/u/hotels")
                    }
                    if (user) {
                        const key = { ...user, user_id: usuario_id }
                        authnMode ? setRegisterUser(key) : setRegisterBiometric(key)
                    }
                } else {
                    showSnackbar({
                        status: "error",
                        title: "Usuario no encontrado",
                    })
                }
            })
            .catch((e) => {
                console.log(e)
                showSnackbar({
                    status: "error",
                    title: e?.networkError ? "Error de conexión" : "El usuario o la contraseña son incorrectos",
                })
            })
    }

    const getEmailError = (): string => {
        const type = errors.email?.type
        return type === "required" ? "Ingresa un correo" : type === "pattern" ? "Ingresa un correo válido" : ""
    }

    return (
        <div className={`${styles["login__container"]} s:px-[35px] xs:px-[20px]`}>
            <div className={styles["login__logo"]}>
                <img height={44} src={Logo} alt={"logo"} />
            </div>
            <p className={styles["login__title"]}>{"¡Hola de nuevo!"}</p>
            <form className={styles["login__form"]} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles["login__inputs"]}>
                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: true, pattern: /^[A-Z0-9.__%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                        render={({ field: { value, onChange } }) => (
                            <InputText
                                id={"email"}
                                name={"email"}
                                icon={"Mail"}
                                type={"email"}
                                value={value}
                                onChange={(value) => onChange(value.trim())}
                                label={"Email"}
                                placeholder={"ejemplo@correo.com"}
                                error={!!errors.email}
                                errorHintText={getEmailError()}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <InputText
                                name={"password"}
                                type={"password"}
                                label={"Password"}
                                icon={"Lock"}
                                placeholder={"Ingresa contraseña"}
                                value={value}
                                onChange={(value) => onChange(value.trim())}
                                error={!!errors.password}
                                errorHintText={
                                    errors.password
                                        ? errors.password?.type === "required"
                                            ? "Ingresa una contraseña"
                                            : "Contraseña incorrecta"
                                        : ""
                                }
                            />
                        )}
                    />
                </div>
                <div className={styles["login__controls"]}>
                    <Controller
                        control={control}
                        name="session"
                        render={({ field: { value, onChange } }) => (
                            <Checkbox label="Recordarme" value={value} onChange={onChange} />
                        )}
                    />
                    <p className={styles["login__forgot"]} onClick={() => navigate("/auth/forgot-password")}>
                        {"Olvidé mi contraseña"}
                    </p>
                </div>
                <div className={styles["login__buttons"]} style={{ marginBottom: !isRegisteredBiometric ? 30 : 0 }}>
                    <Button className={styles["login__button"]} type={"submit"} text={"Iniciar sesión"}  loading={isLoading}/>
                    {isRegisteredBiometric && (
                        <Button
                            className={styles["login__button"]}
                            theme={"secondary"}
                            type={"button"}
                            text={"Ingresa con huella o rostro"}
                            onClick={authnMode ? onSumitAuthn : onSumitBiometrics}
                        />
                    )}
                </div>
            </form>
            {/* Se comenta código para que pase revisión de ios */}
            {false && (
                <>
                    <div className={styles["login__divider"]}>
                        <div className={styles["login__divider-line"]}></div>
                        <div className={styles["login__divider-text"]}>{"o"}</div>
                    </div>

                    <EntryAuthGoogle
                        className={styles["login__google-entry"]}
                        onAuth={(res) => handleGoogleLoginSuccess(res)}
                    />
                </>
            )}
        </div>
    )
}

export default Login
