import "./Registry.css"
import "../login/Login.css"
import { Controller, useForm } from "react-hook-form"
import { Button, InputText } from "src/shared/components/forms"
import Icon from "src/shared/icons"
import { InputPassword } from "../login/Login.sections"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Modal } from "src/shared/components/layout/modal/Modal"
import { termsConditions } from "./Registry.data"
import { useStartGoogleClient } from "../hooks/useStartGoogleClient"
import { client } from "src/graphql"
import { GET_USER_GOOGLE } from "./Registry.graphql"

type FormValues = {
    name: string
    email: string
    password: string
    terms: boolean
}

function Registry(): JSX.Element {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            terms: false,
        },
    })

    const handleGoogleRegisterSuccess = async (response) => {
        console.log("response, ", response)
        if (response) {
            const dataMutation = {
                client_id: response?.client_id,
                token: response?.credential,
            }

            try {
                const { data: res } = await client.mutate({
                    mutation: GET_USER_GOOGLE,
                    variables: {
                        getGoogleUserInput: dataMutation,
                    },
                })
                if (res) {
                    const google_values = {
                        name: res.obtener_usuario_google.given_name + " " + res.obtener_usuario_google.family_name,
                        email: res.obtener_usuario_google.email,
                        password: "",
                    }
                    console.log("google_values, ", google_values)
                    navigate(`/auth/registry/data`, { state: { ...google_values } })
                }
            } catch (e) {
                console.log("errooor, ", e)
            }
        }
    }

    const navigate = useNavigate()
    const [pwrd, setPwrd] = useState<string>("")
    const [termsModal, setTermsModal] = useState<boolean>(false)
    const [pwdVerif, setPwdVerif] = useState<boolean>(false)
    useStartGoogleClient({ googleButtonId: "google-login-button", handleGoogleRegisterSuccess, text: "signin_with" })

    const getEmailError = (): string => {
        const type = errors.email?.type
        return type === "required" ? "Ingresa un correo" : type === "pattern" ? "Ingresa un correo válido" : ""
    }

    const onSubmit = (values: FormValues): void => {
        console.log("sendData, ", values)
        navigate(`/auth/registry/data`, { state: { ...values } })
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
                        name="name"
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <div className="login-screen__input">
                                <InputText
                                    icon={Icon}
                                    iconProps={{ name: "userFilled", width: 24, height: 24 }}
                                    label="Nombre"
                                    data-testid="name"
                                    type="text"
                                    placeholder="Escribe tu nombre completo"
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    error={!!errors.name}
                                    errorhinttext={"Escribe tu nombre"}
                                />
                            </div>
                        )}
                    />
                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                        render={({ field: { value, onChange } }) => (
                            <div className="login-screen__input">
                                <InputText
                                    icon={Icon}
                                    iconProps={{ name: "mailFill", width: 24, height: 24 }}
                                    label="Correo electrónico"
                                    data-testid="email"
                                    type="text"
                                    placeholder="ejemplo@correo.com"
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
                        rules={{ required: true, minLength: 8, maxLength: 16, pattern: /(?=.*?[A-Z])/ }}
                        render={({ field: { value, onChange } }) => (
                            <InputPassword
                                label="Contraseña"
                                type={"text"}
                                value={value}
                                onChange={(e) => {
                                    onChange(`${e.target.value}`.trim())
                                    setPwrd(`${e.target.value}`.trim())
                                    setPwdVerif(true)
                                }}
                                error={!!errors.password}
                            />
                        )}
                    />
                    <div className="registry-screen_error_password">
                        <p
                            style={{
                                display:
                                    pwdVerif && (pwrd.length < 8 || pwrd.length > 16)
                                        ? "flex"
                                        : errors.password?.type === "required"
                                        ? "flex"
                                        : "none",
                            }}
                        >
                            Escribe una contraseña de 8 a 16 caracteres.
                        </p>
                        <p
                            style={{
                                display:
                                    pwdVerif && /(?=.*?[A-Z])/.test(pwrd) === false
                                        ? "flex"
                                        : errors.password?.type === "required"
                                        ? "flex"
                                        : "none",
                            }}
                        >
                            Escribe una contraseña con una mayúscula.
                        </p>
                    </div>
                    <Controller
                        control={control}
                        name="terms"
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                            <Checkbox
                                className={
                                    errors.terms?.type === "required"
                                        ? "login-screen__check_error"
                                        : "login-screen__check"
                                }
                                label="He leído y acepto los "
                                altDescription="Términos y Condiciones."
                                value={value}
                                onChange={onChange}
                                onClick={() => setTermsModal(true)}
                            />
                        )}
                    />
                    <div className="registry-screen_error_password">
                        <p
                            style={{
                                display: errors.terms?.type === "required" ? "flex" : "none",
                            }}
                        >
                            Marca la casilla para continuar
                        </p>
                    </div>
                    <Button
                        className="login-screen__button"
                        style={{ marginTop: errors.terms?.type === "required" ? 0 : 24 }}
                        type={"submit"}
                        text="Siguiente"
                    />
                    <div className="login-screen_divisor">
                        <hr className="hrLinea" /> <p className="login-screen_divisor_text">o</p>{" "}
                        <hr className="hrLinea" />
                    </div>
                    <div className="google-login-button" id="google-login-button"></div>
                    <p className="login-screen_correo">
                        ¿Ya tienes cuenta?{" "}
                        <span className="login-screen_correo_text" onClick={() => navigate("/")}>
                            Inicia sesión
                        </span>
                    </p>
                </form>
            </div>
            <Modal
                isOpen={termsModal}
                withCloseButton
                onClose={() => setTermsModal(false)}
                className="terms-conditions-modal"
            >
                <div className="terms-conditions-modal_content">
                    <p className="terms-conditions-modal_title">Términos y condiciones</p>
                    <p className="terms-conditions-modal_text">
                        Por favor, revisa detenidamente los siguientes términos y condiciones antes de utilizar
                        <span className="terms-conditions-modal_easyroom"> easyroom:</span>
                    </p>
                    {termsConditions.map(({ subtitle, text }, index) => (
                        <div className="terms-conditions-modal_list" key={index}>
                            <p className="terms-conditions-modal_subtitle">{subtitle}</p>
                            <p className="terms-conditions-modal_text">{text}</p>
                        </div>
                    ))}
                    <p className="terms-conditions-modal_text">
                        Al utilizar<span className="terms-conditions-modal_easyroom"> easyroom</span>, aceptas cumplir
                        con estos términos y condiciones. Si tienes alguna pregunta o inquietud sobre estos términos, no
                        dudes en contactarnos.
                    </p>
                    <p className="terms-conditions-modal_text">
                        Gracias por confiar en<span className="terms-conditions-modal_easyroom"> easyroom.</span>
                    </p>
                </div>
                <div className="terms-conditions-modal_button_container">
                    <Button
                        className="terms-conditions-modal_button"
                        text="Aceptar"
                        onClick={() => {
                            setValue("terms", true)
                            setTermsModal(false)
                        }}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default Registry
