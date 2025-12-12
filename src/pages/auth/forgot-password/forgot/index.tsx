import { useNavigate } from "react-router-dom"
import { Controller, FieldError, useForm } from "react-hook-form"
import { client } from "src/graphql"
import Icon from "src/shared/icons"
import AuthFormLayout from "../layout"
import useSnackbar from "src/shared/hooks/useSnackbar"
import { InputText } from "src/shared/components/forms/input-text/InputText"
import { Button } from "src/shared/components/forms/button/Button"
import { getStringEncrypt } from "./Fortgot.helpers"
import { FORGOT } from "./Forgot.graphql"
import "./Forgot.css"

type FormValues = {
    email: string
}

function Form(): JSX.Element {
    const navigate = useNavigate()
    const { control, handleSubmit, clearErrors, setError } = useForm<FormValues>()
    const { showSnackbar } = useSnackbar(5000, { top: 30 })

    const getEmailError = (error?: FieldError): string => {
        const type = error?.type
        return type === "required"
            ? "Escribe un correo electrónico"
            : type === "pattern"
            ? "Escribe un correo electrónico valido"
            : type === "validate"
            ? "No existe una cuenta con este correo electrónico. Verifica de nuevo"
            : ""
    }

    const onSubmit = (values: FormValues) => {
        const path = window.location.origin
        const date = new Date()
        date.setDate(date.getDate() + 1)

        const params = `?code=${getStringEncrypt({
            email: values.email,
            expired_at: date.getTime(),
        })}`

        client
            .mutate({
                mutation: FORGOT,
                variables: {
                    sendChangePasswordViaEmailInput: {
                        email: values.email,
                        link: `${path}/auth/change-password${params}`,
                    },
                },
            })
            .then(({ data, errors }) => {
                if (data) {
                    showSnackbar({
                        title: "Se envió correo de recuperación de contraseña.",
                        text: `Enviamos un correo a su cuenta. Siga las instrucciones en ese correo para restablecer su contraseña. Revisa su carpeta de **spam o correo no deseado** si no recibe nada.`,
                        status: "success",
                    })
                } else {
                    showSnackbar({ status: "error", title: `${JSON.stringify(errors)}` })
                }
            })
            .catch((e) => {
                if (e?.networkError) {
                    showSnackbar({
                        status: "error",
                        title: e?.networkError ? "Error de conexiòn" : `${e?.message}`,
                    })
                } else {
                    setError("email", { type: "validate" })
                }
            })
    }

    return (
        <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <div className="auth-form__input">
                        <InputText
                            icon={Icon}
                            iconProps={{ name: "mailFill", width: 24, height: 24 }}
                            label="Correo electrónico"
                            type="text"
                            placeholder="Ingresa tu correo electrónico"
                            value={value}
                            onChange={(e) => {
                                onChange(`${e.target.value}`.trim())
                                if (error) clearErrors()
                            }}
                            error={!!error}
                            errorhinttext={getEmailError(error)}
                        />
                    </div>
                )}
            />
            <Button className="auth-form__button forgot__button" type={"submit"} text={"Restablecer contraseña"} />
            <div className="forgot__link" onClick={() => navigate(-1)}>
                <Icon className="forgot__link-icon" name="chevronleft" color={"var(--primary)"} />
                <p className="forgot__link-text">{"Regresar a inicio de sesión"}</p>
            </div>
        </form>
    )
}

function Forgot(): JSX.Element {
    return (
        <AuthFormLayout
            title={"Recupera tu contraseña"}
            subtitle={"Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecerla."}
            icon={"lockOpen"}
        >
            <Form />
        </AuthFormLayout>
    )
}

export default Forgot
