import { useMemo, useState } from "react"
import { useCambiarMesaAsignadaMutation } from "src/gql/schema"
import { useRestaurantDarwer } from "src/pages/restaurante/detail/hooks/drawer"
import { useMesa } from "src/pages/restaurante/detail/hooks/mesa"
import { Button } from "src/shared/components/forms/button/Button"
import useSnackbar from "src/shared/hooks/useSnackbar"
import Icon from "src/shared/icons"
import { useProfile } from "src/shared/hooks/useProfile"
import { MesaState } from "../index.type"
import useRestaurantAuth from "src/pages/restaurante/detail/hooks/useRestaurantAuth"

type ConfirmProps = {
    value?: MesaState
    preparacion: number
    entrgadas: number
    porEntregar: number
}

function Confirm({ value, preparacion = 0, porEntregar = 0, entrgadas = 0 }: ConfirmProps): JSX.Element {
    const [loading, setLoad] = useState<boolean>(false)

    const { nombre, mesa_id, cantidad_personas, asignacion_actual } = useMesa()
    const { showSnackbar } = useSnackbar()
    const { usuario_id } = useProfile()

    const { onClose } = useRestaurantDarwer()

    const [cambiarMesaAsignada] = useCambiarMesaAsignadaMutation()

    const colaborador_asignado_id = asignacion_actual?.colaborador_asignado_id || ""
    const mesa_asignada_id = asignacion_actual?.mesa_asignada_id || ""
    const {auth, setAuthValue} = useRestaurantAuth()

    const values = useMemo(
        () => [
            { label: "Personas", value: cantidad_personas || "0" },
            { label: "Ordenes en preparación", value: preparacion || "0" },
            { label: "Ordenes por entregar", value: porEntregar || "0" },
            { label: "Ordenes entregadas", value: entrgadas || "0" },
        ],
        [mesa_id, value]
    )

    const onConfirm = () => {
        if (!value?.mesa_id || !colaborador_asignado_id || !mesa_asignada_id) return

        setLoad(true)
        cambiarMesaAsignada({
            variables: {
                codigo: auth?.codigo,
                template_sample: auth?.template_sample,
                input: {
                    colaborador_asignado_id,
                    mesa_asignada_id,
                    mesa_id: value?.mesa_id || "",
                    usuario_modifico_id: usuario_id,
                },
            },
        })
            .then(() => {
                showSnackbar({
                    title: "Cambio de área",
                    text: `Se realizó el cambio de **${nombre}** a **${value?.nombre}**. `,
                    status: "success",
                })
            })
            .catch(() => {
                showSnackbar({
                    title: "Error al cambiar de área ",
                    text: "¡Ups! Se ha producido un error. Por favor, inténtalo nuevamente.",
                    status: "error",
                })
            })
            .finally(() => {
                onClose()
                setAuthValue(null)
                setLoad(false)
            })
    }

    return (
        <section className="detalle-m__c-a">
            <div className="detalle-m__c-a__box">
                <div className="detalle-m__c-a__circle">
                    <Icon name={"Table"} height={45} width={50} color={"var(--white)"} />
                </div>
                <p className="detalle-m__c-a__title">{"Cambio de área"}</p>
                <div className="detalle-m__c-a__row">
                    <div className="detalle-m__c-a__current">
                        <span className="detalle-m__c-a__current-label">{"Área actual"}</span>
                        <p className="detalle-m__c-a__current-value">{nombre}</p>
                    </div>
                    <Icon name={"arrow04"} width={45} height={20} color={"var(--white)"} />
                    <div className="detalle-m__c-a__current">
                        <span className="detalle-m__c-a__current-label">{"Área nueva"}</span>
                        <p className="detalle-m__c-a__current-value">{value?.nombre}</p>
                    </div>
                </div>
            </div>
            <div className="detalle-m__c-a__detail">
                {values.map(({ label = "", value = "" }, index) => (
                    <div key={index}>
                        <p className="detalle-m__c-a__des-label">{label}</p>
                        <p className="detalle-m__c-a__des-value">{value}</p>
                    </div>
                ))}
            </div>
            <Button
                className="detalle-m__c-a__button"
                onClick={onConfirm}
                type={"button"}
                text={"Cambiar área"}
                disabled={loading}
            />
        </section>
    )
}

export default Confirm
