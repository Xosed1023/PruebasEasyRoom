import { useState } from "react"
import { useNavigate } from "react-router"
import { Controller, useForm } from "react-hook-form"
import cx from "classnames"
import { useSendChangePasswordViaEmailMutation } from "@/gql/schema"
import { VITE_APP_WEB_URL } from "@/config/environment"
import Screen from "@/components/core/layout/screen/Screen"
import InputText from "components/core/forms/input-text/InputText"
import Button from "components/core/forms/button/Button"
import useSnackbar from "@/hooks/useSnackbar"
import ArrowLeft from "@/icons/ArrowLeft"
import Logo from "assets/png/logo.png"
import { getStringEncrypt } from "./Forgot.helpers"
import { FormValues } from "./Forgot.type"
import styles from "./Forgot.module.css"

function ForgotPasswordForm() {
    const [loading, setLoading] = useState<boolean>(false)
    const { showSnackbar } = useSnackbar()

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            email: "",
        },
    })

    const [sendChangePasswordViaEmail] = useSendChangePasswordViaEmailMutation()

    const onSubmit = (values: FormValues) => {
        const { email } = values
        const date = new Date()
        date.setDate(date.getDate() + 1)

        const params = `?code=${getStringEncrypt({
            email: values.email,
            expired_at: date.getTime(),
        })}`

        setLoading(true)

        sendChangePasswordViaEmail({
            variables: {
                sendChangePasswordViaEmailInput: { email, link: `${VITE_APP_WEB_URL}/auth/change-password${params}` },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Correo enviado",
                    text: `Enviamos el correo con el enlace de recuperación de contraseña a **${email}**`,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al enviar el correo",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => setLoading(false))
    }

    const getEmailError = (type: string): string => {
        return type === "required" ? "Ingresa un correo" : type === "pattern" ? "Ingresa un correo válido" : ""
    }

    return (
        <form className={styles["forgot__form"]} onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="email"
                rules={{ required: true, pattern: /^[A-Z0-9.__%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <InputText
                        id={"email"}
                        type={"email"}
                        name={"email"}
                        icon={"Mail"}
                        value={value}
                        onChange={(value) => onChange(value.trim())}
                        label={"Email"}
                        placeholder={"ejemplo@correo.com"}
                        error={!!error}
                        errorHintText={error ? getEmailError(error.type) : ""}
                    />
                )}
            />
            <Button
                disabled={loading}
                className={styles["forgot__button"]}
                type={"submit"}
                text={"Restablecer contraseña"}
            />
        </form>
    )
}

function ForgotPassword({ withSession = false }) {
    const navigate = useNavigate()
    return (
        <Screen
            className={cx(
                styles["forgot__container"],
                "s:px-[35px] xs:px-[20px]",
                withSession ? styles["forgot__container-short"] : styles["forgot__container-large"]
            )}
            header={
                withSession ? (
                    <div className="flex gap-x-[20px] items-center h-full s:px-[35px] xs:px-[20px]">
                        <ArrowLeft width={28} height={28} onClick={() => navigate(-1)} />
                        <span className={styles["forgot__screen-title"]}>{"Recupera tu contraseña"}</span>
                    </div>
                ) : undefined
            }
        >
            <div className={styles["forgot__logo"]}>
                <img height={44} src={Logo} alt={"logo"} />
            </div>
            {!withSession && <p className={styles["forgot__title"]}>{"Recupera tu contraseña"}</p>}
            <p className={styles["forgot__description"]}>
                {"Ingresa tu correo electrónico y te enviaremos un enlace seguro para establecerla."}
            </p>
            <ForgotPasswordForm />
            {!withSession && (
                <p className={styles["forgot__link"]} onClick={() => navigate(-1)}>
                    {"Regresar a inicio de sesión"}
                </p>
            )}
        </Screen>
    )
}

export default ForgotPassword
