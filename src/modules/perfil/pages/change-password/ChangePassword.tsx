import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useChangePasswordMutation } from "@/gql/schema"
import { useBiometricNative } from "@/hooks/native/useBiometricNative"
import { useNavigate } from "react-router"
import { useProfile } from "@/hooks/store/useProfile"
import ScreenDetail from "components/core/layout/screen-detail/ScreenDetail"
import InputText from "components/core/forms/input-text/InputText"
import Button from "components/core/forms/button/Button"
import { FormValues } from "./ChangePassword.type"
import styles from "./ChangePassword.module.css"
import useSnackbar from "@/hooks/useSnackbar"

function ChangePasswordForm() {
    const [loading, setLoading] = useState<boolean>(false)
    const { usuario } = useProfile()

    const { control, handleSubmit, getValues } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            password: "",
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
                    email: usuario?.correo || "",
                    new_password: values.new_password,
                    old_password: values.password,
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
                navigate(-1)
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
        <form className={styles["perfil-password__form"]} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles["perfil-password__inputs"]}>
                <Controller
                    control={control}
                    name="password"
                    rules={{ required: true }}
                    render={({ field: { value, onChange }, fieldState: { error } }) => (
                        <InputText
                            type={"password"}
                            label={"Contraseña actual"}
                            icon={"Unlocked"}
                            placeholder={"Ingresa contraseña actual"}
                            value={value}
                            onChange={(value) => onChange(value.trim())}
                            error={!!error}
                            errorHintText={
                                error
                                    ? error?.type === "required"
                                        ? "Ingresa una contraseña"
                                        : "Ingresa una contraseña válida"
                                    : ""
                            }
                        />
                    )}
                />
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
            <p className={styles["perfil-password__link"]} onClick={() => navigate("/u/profile/forgot-password")}>
                {"Olvidé mi contraseña"}
            </p>
            <Button
                disabled={loading}
                className={styles["perfil-password__button"]}
                type={"submit"}
                text={"Confirmar"}
                loading={loading}
            />
        </form>
    )
}

function ChangePassword() {
    return (
        <ScreenDetail title="Cambiar contraseña" className={styles["perfil-password"]}>
            <p className={styles["perfil-password__text"]}>
                {"La nueva contraseña debe tener entre 8 y 16 caracteres, y debe incluir al menos una letra mayúscula."}
            </p>
            <ChangePasswordForm />
        </ScreenDetail>
    )
}

export default ChangePassword
