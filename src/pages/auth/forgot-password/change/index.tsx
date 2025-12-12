import { useNavigate } from "react-router-dom"
import { Controller, FieldError, useForm } from "react-hook-form"
import { client } from "src/graphql"
import { useParams } from "./Change.hooks"
import AuthFormLayout from "../layout"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Empty from "./empty/Empty"
import { InputPassword } from "./Change.sections"
import { Button } from "src/shared/components/forms/button/Button"
import { CHANGE_PASSWORD } from "./Change.graphql"
import { handleFormat } from "./Change.helpers"
import "./Change.css"

type FormValues = {
    password: string
    confirmPassword: string
}

function Form({ email = "" }): JSX.Element {
    const navigate = useNavigate()
    const {
        control,
        handleSubmit,
        getValues,
        formState: { isSubmitted, errors },
        clearErrors,
        setError,
    } = useForm<FormValues>({
        mode: "onChange",
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const { showSnackbar } = useSnackbar(5000, { top: 30 })

    const getPasswordError = (error?: FieldError): string => {
        const type = error?.type
        const multiple = !`${getValues("password")}`.match(/[A-Z]/)
            ? "Escribe una contraseña de 8 a 16 caracteres. \n Escribe una contraseña con una mayúscula."
            : "Escribe una contraseña de 8 a 16 caracteres."

        return type === "minLength" || type === "maxLength"
            ? multiple
            : type === "pattern"
            ? "Escribe una contraseña con una mayúscula."
            : ""
    }

    const onSubmit = (data: FormValues) => {
        client
            .mutate({
                mutation: CHANGE_PASSWORD,
                variables: {
                    changePasswordInput: {
                        email,
                        new_password: data.confirmPassword,
                    },
                },
            })
            .then(({ data, errors }) => {
                if (data) {
                    navigate("/", { replace: true })
                    showSnackbar({
                        title: "Contraseña actualizada",
                        text: `Tu contraseña ha sido actualizada con éxito. Desde ahora, puedes iniciar sesión con tu **nueva contraseña** y **acceder a tu cuenta.**`,
                        status: "success",
                    })
                } else {
                    showSnackbar({ status: "error", title: `${JSON.stringify(errors)}` })
                }
            })
            .catch((e) => {
                showSnackbar({
                    status: "error",
                    title: e?.networkError ? "Error de conexiòn" : `${e?.message}`,
                })
            })
    }

    return (
        <form className="auth-form__form" onSubmit={handleSubmit(onSubmit)}>
            <Controller
                control={control}
                name="password"
                rules={{ required: true, minLength: 8, maxLength: 16, pattern: /[A-Z]/ }}
                render={({ field: { value, onChange }, fieldState: { error } }) => {
                    const localError = errors.confirmPassword?.type === "validate" || !!error
                    return (
                        <InputPassword
                            className={
                                value
                                    ? `change-screen__password__stroke-${isSubmitted && localError ? "error" : "base"}`
                                    : ""
                            }
                            label={"Nueva contraseña"}
                            placeholder={"Ingresa tu nueva contraseña"}
                            type={"text"}
                            value={value}
                            onChange={(e) => {
                                onChange(handleFormat(`${e.target.value}`))
                                if (isSubmitted && !!errors.confirmPassword) clearErrors("confirmPassword")
                            }}
                            error={isSubmitted ? !!error : value?.length > 0 && !!error}
                            errorhinttext={
                                error?.type === "required" ? "Escribe una nueva contraseña." : getPasswordError(error)
                            }
                        />
                    )
                }}
            />
            <Controller
                control={control}
                name="confirmPassword"
                rules={{ required: true, validate: (value) => value === getValues("password") }}
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                    <InputPassword
                        label={"Confirmar contraseña"}
                        placeholder={"Confirma tu contraseña"}
                        className={`change-screen__password-space${
                            value ? ` change-screen__password__stroke-${isSubmitted && !!error ? "error" : "base"}` : ""
                        }`}
                        type={"text"}
                        value={value}
                        onChange={(e) => {
                            onChange(handleFormat(`${e.target.value}`))
                        }}
                        error={isSubmitted ? !!error : value?.length > 0 && !!error}
                        errorhinttext={
                            error?.type === "required"
                                ? "Reescribe la contraseña nueva."
                                : error?.type === "validate"
                                ? "Las contraseñas no coinciden."
                                : ""
                        }
                    />
                )}
            />
            <Button
                className="auth-form__button"
                type={"submit"}
                text={"Actualizar contraseña"}
                onClick={() => {
                    if (isSubmitted && errors.password?.type === "validate") setError("password", { type: "validate" })
                }}
            />
        </form>
    )
}

function Change(): JSX.Element {
    const { email, load, validLink } = useParams()

    return !load ? (
        email && validLink ? (
            <AuthFormLayout
                className="change-screen"
                title={"Crear contraseña nueva"}
                subtitle={
                    "Crea una contraseña única, segura y distinta a las anteriores para mantener protegida tu cuenta."
                }
                icon={"lockCheck"}
                iconStyle={{
                    height: 96,
                    width: 96,
                }}
            >
                <Form email={email} />
            </AuthFormLayout>
        ) : (
            <Empty />
        )
    ) : (
        <></>
    )
}

export default Change
