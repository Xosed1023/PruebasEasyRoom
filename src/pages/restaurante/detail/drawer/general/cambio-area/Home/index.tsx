import { useState, useMemo } from "react"
import { EstadoMesa } from "src/gql/schema"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { Button } from "src/shared/components/forms/button/Button"
import { MesaState } from "../index.type"
import { useMesa } from "src/pages/restaurante/detail/hooks/mesa"
import { getTimeElements } from "src/pages/restaurante/helpers/time"
import { useDate } from "src/shared/hooks/useDate"

type HomeProps = {
    onChange: (value: MesaState) => void
}

function Home({ onChange }: HomeProps): JSX.Element {
    const [mesa, setMesa] = useState<MesaState>({ nombre: "", mesa_id: "" })

    const { nombre, fecha_modificacion } = useMesa()
    const { UTCStringToLocalDate } = useDate()

    const { hours, minutes, seconds } = getTimeElements(UTCStringToLocalDate(fecha_modificacion))

    const mesas = useSelector((root: RootState) => root.restaurant.mesas)
    const mesasDisponibles = useMemo(
        () =>
            mesas
                ?.filter((m) => m?.estado === EstadoMesa.Disponible && !m?.asignacion_actual)
                ?.sort((a, b) => Number(a?.numero_mesa || 0) - Number(b?.numero_mesa || 0)),
        [mesas]
    )

    const onSubmit = () => {
        if (!mesa.mesa_id) return

        onChange(mesa)
    }

    return (
        <section className="detalle-m__c-a">
            <p className="detalle-m__c-a__title">{"Cambio de área"}</p>
            <div className="detalle-m__c-a__labels">
                <DescriptionDetail icon={"Table"} label={"Área actual"} value={nombre} />
                <DescriptionDetail
                    icon={"Clock"}
                    label={"Tiempo de ocupación "}
                    value={`${hours}:${minutes}:${seconds} hrs`}
                />
            </div>
            <p className="detalle-m__c-a__subtitle">{"Elige una de las siguientes áreas"}</p>
            <div className="detalle-m__c-a__head">
                <span>{"Mesas disponibles"}</span>
                <span>{"Último servicio"}</span>
            </div>
            {mesasDisponibles.length > 0 && (
                <div className="detalle-m__c-a__content">
                    <div className="detalle-m__c-a__scroll">
                        <div className="detalle-m__c-a__grid">
                            {mesasDisponibles.map(({ numero_mesa = "", mesa_id = "", fecha_modificacion = "" }) => {
                                const nombre = `Mesa ${numero_mesa}`
                                const { hours, minutes, seconds } = getTimeElements(
                                    UTCStringToLocalDate(fecha_modificacion)
                                )
                                return (
                                    <div
                                        key={mesa_id}
                                        className="detalle-m__c-a__item"
                                        style={{
                                            backgroundColor:
                                                mesa.mesa_id === mesa_id
                                                    ? "rgba(105, 65, 198, 0.50)"
                                                    : "rgba(255, 255, 255, 0.10)",
                                        }}
                                        onClick={() => setMesa({ nombre, mesa_id })}
                                    >
                                        <p className="detalle-m__c-a__item__title">{nombre}</p>
                                        <p className="detalle-m__c-a__item__label">
                                            {Number(hours)
                                                ? `${hours} horas`
                                                : Number(minutes)
                                                ? `${minutes} minutos`
                                                : Number(seconds)
                                                ? `${seconds} segundos`
                                                : ""}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Button
                        className="detalle-m__c-a__button"
                        disabled={mesa.mesa_id === ""}
                        onClick={onSubmit}
                        type={"button"}
                        text={"Cambiar"}
                    />
                </div>
            )}
        </section>
    )
}

export default Home
