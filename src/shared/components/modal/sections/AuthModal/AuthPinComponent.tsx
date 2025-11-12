import { useEffect, useState } from "react"

import "./AuthModal.css"
import InputVerification from "src/shared/components/forms/input-verification/InputVerification"
import { useValidar_Codigo_AutorizacionMutation } from "src/gql/schema"
import useSnackbar from "src/shared/hooks/useSnackbar"
import useFingerprint from "src/shared/hooks/useFingerprint"
import { UareUFingerprintSample } from "src/shared/classes/fingerprint/UareU/interfaces/UareU.interface"
import { RoleNames } from "src/shared/hooks/useAuth"

const AuthPinComponent = ({
    onAuthFilled,
    onLoading,
    authorizedRoles = [RoleNames.admin],
    authorizedPins,
    isOpen,
}: {
    onAuthFilled: (value?: string, sampleData?: string, usuario_autorizo_id?: string) => void
    onLoading: (value: boolean) => void
    isOpen: boolean
    // Roles que hacen que se muestre el modal de auth, si !authorizedPins entonces también estos roles autorizan el modal
    authorizedRoles?: RoleNames[]
    // Roles que autorizan el modal
    authorizedPins?: RoleNames[]
}) => {
    const [validateUser] = useValidar_Codigo_AutorizacionMutation()
    const [pinValue, setpinValue] = useState("")

    const onAcquisition = (fingerprint: UareUFingerprintSample) => {
        setpinValue("")
        onLoading(true)
        validateUser({
            variables: {
                huella: JSON.parse(fingerprint.samples)[0]?.Data,
            },
        })
            .then((d) => {
                if (
                    d.data?.validar_codigo_huella_autorizacion.usuario_autorizado && authorizedPins
                        ? !authorizedPins.find((r) => d.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre === r)
                        : !authorizedRoles.find((r) => d.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre === r)
                ) {
                    return showSnackbar({
                        status: "error",
                        title: "Huella inválida",
                        text: "¡Ups! No pudimos reconocer tu huella. Inténtalo de nuevo y, si el problema persiste, verifica el estado de tu lector.",
                    })
                }
                onAuthFilled(
                    undefined,
                    JSON.parse(fingerprint.samples)[0]?.Data,
                    d.data?.validar_codigo_huella_autorizacion.usuario?.usuario_id || ""
                )
            })
            .catch(() => {
                showSnackbar({
                    status: "error",
                    title: "Error al autenticar",
                })
            })
            .finally(() => {
                onLoading(false)
            })
    }

    const { startAcquisition, stopAcquisition } = useFingerprint({
        client: "UareU",
        onAcquisition,
    })

    useEffect(() => {
        if (isOpen) {
            return startAcquisition()
        }
        return () => {
            stopAcquisition()
        }
    }, [isOpen])

    const { showSnackbar } = useSnackbar()
    const [isWrongCode, setisWrongCode] = useState(false)

    const onChange = (value: string) => {
        setpinValue(value)
    }

    useEffect(() => {
        if (pinValue.length === 4) {
            onLoading(true)
            validateUser({
                variables: {
                    codigo: pinValue,
                },
            })
                .then((res) => {
                    if (
                        res.data?.validar_codigo_huella_autorizacion.usuario_autorizado && authorizedPins
                            ? authorizedPins.find( (r) => res.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre === r)
                            : authorizedRoles.find((r) => res.data?.validar_codigo_huella_autorizacion.usuario?.roles?.[0].nombre === r)
                    ) {
                        onAuthFilled(
                            pinValue,
                            "",
                            res.data?.validar_codigo_huella_autorizacion.usuario?.usuario_id || ""
                        )
                        return
                    }
                    setisWrongCode(true)
                    return showSnackbar({ status: "error", title: "Código inválido", text: "Intente de nuevo" })
                })
                .catch(() => {
                    return showSnackbar({ status: "error", title: "Código inválido", text: "Intente de nuevo" })
                })
                .finally(() => {
                    onLoading(false)
                })
            return
        }
        setisWrongCode(false)
    }, [pinValue])

    return (
        <InputVerification
            label=""
            value={pinValue}
            onChange={onChange}
            error={isWrongCode}
            hintText={isWrongCode ? "PIN o huella incorrecta. Intenta de nuevo." : ""}
            hintAlignment={isWrongCode ? "center" : "left"}
        />
    )
}

export default AuthPinComponent
