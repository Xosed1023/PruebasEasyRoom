import { useState } from "react"
import cx from "classnames"
import Chart from "./Chart"
import About from "../about/About"
import Triangle from "src/shared/icons/Triangle"
import { useCurrentRol } from "../hooks/general"
import "./OcupacionWidget.css"
import { RoleNames } from "src/shared/hooks/useAuth"

type View = "day" | "month"

interface OcupacionWidgetProps {
    percent: number
    monthPercent: number
    expectedPercent: number
    reachedPercent: number
    onChange?: (value: View) => void
}

const options: View[] = ["day", "month"]

const monthTooltip = [
    {
        title: "Ocupacíon mensual",
        description:
            "Se calcula dividiendo el número de habitaciones vendidas por los días transcurridos en un período del mes.",
    },
]

const dayTooltip = [
    {
        title: "Ocupación al momento",
        description: "Porcentaje de habitaciones ocupadas entre el número total de habitaciones.",
    },
    {
        title: "Ocupación alcanzada",
        description:
            "Porcentaje real de habitaciones ocupadas, calculado sumando las habitaciones ocupadas que no han hecho check out hoy, las reservas con check in y las ventas del día en el mostrador",
    },
    {
        title: "Ocupación esperada",
        description:
            "Estimación del porcentaje de habitaciones que se espera estén ocupadas, calculada sumando las habitaciones ocupadas que no harán check out hoy con las reservas esperadas del día.",
    },
]

const OcupacionWidget = ({
    percent = 0,
    reachedPercent = 0,
    expectedPercent = 0,
    monthPercent = 0,
    onChange = undefined,
}: OcupacionWidgetProps) => {
    const rol = useCurrentRol()
    const [view, setView] = useState<View>("day")

    return (
        <div className="ocupacionWitged">
            <div className="ocupacionWitged__title">{view === "day" ? "Ocupación del día" : "Ocupación mensual"}</div>
            <About items={view === "month" ? monthTooltip : dayTooltip} />
            {view === "day" ? (
                <div className="ocupacionWitged__card-main">
                    <Chart
                        id="graficaOcupacionDia"
                        height={145}
                        width={145}
                        color="#6941C6"
                        percent={percent}
                        description="Al momento"
                    />
                    <div
                        className={cx({
                            ocupacionWitged__stat: true,
                            "ocupacionWitged__stat-mg": rol === RoleNames.recepcionista,
                        })}
                    >
                        <div className="ocupacionWitged__stat-item">
                            <p className="ocupacionWitged__stat-item__label">{"Esperada"}</p>
                            <p className="ocupacionWitged__stat-item__value">
                                {expectedPercent} <span>{"%"}</span>
                            </p>
                        </div>
                        <p className="ocupacionWitged__stat-sep">{"Vs"}</p>
                        <div className="ocupacionWitged__stat-item">
                            <p className="ocupacionWitged__stat-item__label">{"Alcanzada"}</p>
                            <div className="ocupacionWitged__stat-item__cover">
                                {reachedPercent > expectedPercent && <Triangle height={7} width={12} />}
                                <p className="ocupacionWitged__stat-item__value">
                                    {reachedPercent} <span>{"%"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="ocupacionWitged__card-main">
                    <Chart
                        className="ocupacionWitged__graph-month"
                        id="graficaOcupacionMes"
                        height={145}
                        width={145}
                        color="#408232"
                        percent={monthPercent}
                    />
                </div>
            )}
            {rol !== RoleNames.recepcionista ? (
                <div className="ocupacionWitged__tab">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={cx(
                                "ocupacionWitged__tab-item",
                                option === view ? "ocupacionWitged__tab-item--active" : ""
                            )}
                            onClick={() => {
                                setView(option)
                                if (onChange) onChange(option)
                            }}
                        ></div>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default OcupacionWidget
