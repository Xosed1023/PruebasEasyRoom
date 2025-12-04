import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useChangePasswordMutation } from "@/gql/schema"
import { useParams } from "./ChangePassword.hooks"
import { useBiometricNative } from "@/hooks/native/useBiometricNative"
import Screen from "../../../components/core/layout/screen/Screen"
import InputText from "components/core/forms/input-text/InputText"
import Button from "components/core/forms/button/Button"
import useSnackbar from "@/hooks/useSnackbar"
import Logo from "assets/png/logo.png"
import EmptyImg from "assets/png/empty-expiracion.png"
import Close from "@/icons/Close"
import styles from "./ChangePassword.module.css"


type FormValues = {
    new_password: string
    repeat_password: string
}

function ChangePasswordForm({ email = "" }: { email: string }) {
    const [loading, setLoading] = useState<boolean>(false)
    const { control, handleSubmit, getValues } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            new_password: "",
            repeat_password: "",
        },
    })
    const navigate = useNavigate()
    const { removeRegisterBiometric } = useBiometricNative()

    const { showSnackbar } = useSnackbar()

    const [changePassword] = useChangePasswordMutation()

    const onSubmit = (values: FormValues) => {
        setLoading(true)
        changePassword({
            variables: {
                changePasswordInput: {
                    email,
                    new_password: values.new_password,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    status: "success",
                    title: "Contraseña actualizada",
                    text: `Tu contraseña ha sido actualizada con éxito. **Ahora puedes iniciar sesión con tu nueva contraseña** y acceder a tu cuenta.`,
                })
                removeRegisterBiometric()
                navigate("/", { replace: true })
            })
            .catch(() => {
                showSnackbar({
                    status: "error",
                    title: "Error de cambio de contraseña",
                    text: "No se pudo hacer el cambio de contraseña. Inténtalo de nuevo.",
                })
            })
            .finally(() => setLoading(false))
    }

    return (
        <form className={styles["change-password__form"]} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["change-password__inputs"]}>
                <Controller
                    control={control}
                    name={"new_password"}
                    rules={{ required: true, minLength: 8, maxLength: 16, pattern: /[A-Z]/ }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <InputText
                            type={"password"}
                            label={"Contraseña nueva"}
                            icon={"Lock"}
                            placeholder={"Ingresa nueva contraseña"}
                            value={value}
                            onChange={(value) => onChange(value.trim())}
                            error={!!error}
                            errorHintText={
                                error
                                    ? error?.type === "required"
                                        ? "Ingresa una contraseña"
                                        : "Escribe una contraseña de 8 a 16 caracteres que incluya al menos una letra mayúscula"
                                    : ""
                            }
                        />
                    )}
                />
                <Controller
                    control={control}
                    name={"repeat_password"}
                    rules={{ required: true, validate: (value) => value === getValues("new_password") }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <InputText
                            type={"password"}
                            label={"Repetir contraseña nueva"}
                            icon={"Lock"}
                            placeholder={"Ingresa nueva contraseña"}
                            value={value}
                            onChange={(value) => onChange(value.trim())}
                            error={!!error}
                            errorHintText={
                                error
                                    ? error?.type === "required"
                                        ? "Ingresa una contraseña"
                                        : "Las contraseñas no coinciden"
                                    : ""
                            }
                        />
                    )}
                />
            </div>
            <Button
                disabled={loading}
                className={styles["change-password__button"]}
                type={"submit"}
                text={"Restablecer contraseña"}
            />
        </form>
    )
}

function ChangePassword() {
    const navigate = useNavigate()
    const { email, load, validLink } = useParams()

    return (
        <Screen
            className={styles["change-password"]}
            header={
                <div className="flex gap-x-[20px] items-center h-full px-[35px] justify-between">
                    <div className={styles["change-password__logo"]}>
                        <img height={26} src={Logo} alt={"logo"} />
                    </div>
                    <Close
                        onClick={() => navigate("/", { replace: true })}
                        className={styles["change-password__close"]}
                        height={24}
                        width={24}
                    />
                </div>
            }
        >
            {!load ? (
                email && validLink ? (
                    <>
                        <p className={styles["change-password__title"]}>{"Crea una nueva contraseña"}</p>
                        <p className={styles["change-password__text"]}>
                            {
                                "Crea una contraseña única, segura y distinta a las anteriores para mantener protegida tu cuenta."
                            }
                        </p>
                        <ChangePasswordForm email={email || ""} />
                    </>
                ) : (
                    <div className={styles["change-password__empty"]}>
                        <div className={styles["change-password__empty-img"]}>
                            <img height={200} src={EmptyImg} alt={"logo"} />
                        </div>
                        <p className={styles["change-password__empty-title"]}>{"Este enlace ha caducado"}</p>
                        <p
                            className={styles["change-password__link"]}
                            onClick={() => navigate("/auth/forgot-password")}
                        >
                            {"Solicita uno nuevo aquí"}
                        </p>
                    </div>
                )
            ) : null}
        </Screen>
    )
}

export default ChangePassword
