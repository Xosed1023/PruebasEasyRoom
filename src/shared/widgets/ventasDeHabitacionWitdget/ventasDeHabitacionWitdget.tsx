import { useEffect } from "react"
import "./ventasDeHabitacionWitdget.css"
import * as echarts from "echarts"
import About from "../about/About"
import Triangle from "src/shared/icons/Triangle"

interface VentasDeHabitacionWidgetProps {
    rooms: number
    reserva: {
        aPie: number
        coche: number
        percent: number
    }
    mostrador: {
        aPie: number
        coche: number
        percent: number
    }
    acumulada?: number
}

const VentasDeHabitacionWidget = ({ reserva, mostrador, rooms = 0, acumulada = 0 }: VentasDeHabitacionWidgetProps) => {
    useEffect(() => {
        const total = reserva.percent + mostrador.percent
        // Obtén el elemento del DOM donde se renderizará el gráfico
        const chartContainer = document.getElementById("graficaVentasHabitacion")

        // Inicializa el gráfico
        const myChart = echarts.init(chartContainer)

        // Configura los datos y opciones del gráfico
        const options = {
            tooltip: {
                trigger: "none",
            },
            legend: {
                show: false,
                top: "5%",
                left: "center",
                // doesn't perfectly work with our tricks, disable it
                selectedMode: false,
            },

            textStyle: {
                fontFamily: "Montserrat",
            },
            series: [
                {
                    name: "Access From",
                    type: "pie",
                    radius: ["75%", "95%"],

                    // adjust the start angle

                    label: {
                        show: false,
                    },
                    height: "152px",
                    width: "152px",
                    avoidLabelOverlap: true,

                    startAngle: 180,

                    color: ["#ED695E", "#e8c23d"],

                    itemStyle: {
                        borderRadius: 18,
                    },
                    data: [
                        {
                            value: reserva.percent,
                            name: "Reserva",
                            itemStyle: {
                                color: "#ED695E",
                            },
                        },
                        {
                            value: mostrador.percent,
                            name: "Mostrador",
                            itemStyle: {
                                color: "#e8c23d",
                            },
                        },
                        {
                            value: total !== 0 ? 0 : 1,
                            name: "null",
                            itemStyle: {
                                color: "#262626",
                            },
                        },
                        {
                            value: total !== 0 ? total : 1,
                            itemStyle: {
                                // stop the chart from rendering this piece
                                color: "none",
                                decal: {
                                    symbol: "none",
                                },
                            },
                            label: {
                                show: false,
                            },
                        },
                        {
                            label: {
                                show: false,
                            },
                        },
                    ],
                },
            ],
        }

        // Aplica las opciones al gráfico
        myChart.setOption(options)
    }, [reserva.percent, mostrador.percent])

    return (
        <div className="ventasDeHAbitacionWit">
            <div className="ventasDeHAbitacionWit__title">Venta de habitaciones</div>
            <About
                items={[
                    {
                        title: "Venta de habitaciones",
                        description:
                            "Es la suma de todas las ventas realizadas en un hotel, incluyendo las ventas por reservas anticipadas y las ventas en el mostrador, teniendo en cuenta el tipo de entrada, ya sea peatonal o vehicular.",
                    },
                    {
                        title: "Venta acumulada",
                        description:
                            "Se calcula con la venta de habitaciones respecto a el número de habitaciones que cuenta el hotel",
                    },
                ]}
            />
            <div className="ventasDeHAbitacionWit__graph">
                <div id="graficaVentasHabitacion" style={{ width: "152px", height: "86px" }}></div>
                <div className="ventasDeHAbitacionWit__graph__info">
                    <div className="ventasDeHAbitacionWit__graph__info__number">{rooms}</div>
                    <div className="ventasDeHAbitacionWit__graph__info__title">{"Total de ventas"}</div>
                </div>
            </div>
            <div className="ventasDeHAbitacionWit__info">
                <div className="ventasDeHAbitacionWit__info__table colorwithe">
                    <div className="ventasDeHAbitacionWit__info__table__header colorwithe">
                        <div className="ventasDeHAbitacionWit__info__table-container">
                            <span
                                className="ventasDehab_point"
                                style={{ backgroundColor: "#ED695E", marginRight: 18 }}
                            ></span>
                            Reserva
                        </div>
                        <div className="ventasDeHAbitacionWit__info__table__header__total-percent">
                            {reserva.percent}
                            <span className="ventasDeHAbitacionWit__info__table__header__percent">%</span>
                        </div>
                    </div>
                    <div className="ventasDeHAbitacionWit__info__table__item colorwithe">
                        <div className="colorwithe">A pie</div>
                        {reserva.aPie}
                    </div>
                    <div className="ventasDeHAbitacionWit__info__table__item colorwithe">
                        <div className="colorwithe">Coche</div>
                        {reserva.coche}
                    </div>
                </div>
                <div className="ventasDeHAbitacionWit__info__table">
                    <div className="ventasDeHAbitacionWit__info__table__header colorwithe">
                        <div className="ventasDeHAbitacionWit__info__table-container">
                            <span
                                className="ventasDehab_point"
                                style={{ backgroundColor: "#ffd543", marginRight: 18 }}
                            ></span>
                            Mostrador
                        </div>
                        <div className="ventasDeHAbitacionWit__info__table__header__total-percent">
                            {mostrador.percent}
                            <span className="ventasDeHAbitacionWit__info__table__header__percent">%</span>
                        </div>
                    </div>
                    <div className="ventasDeHAbitacionWit__info__table__item colorwithe">
                        <div className="colorwithe">A pie</div>
                        {mostrador.aPie}
                    </div>
                    <div className="ventasDeHAbitacionWit__info__table__item colorwithe">
                        <div className="colorwithe">Coche</div>
                        {mostrador.coche}
                    </div>
                    <div className="ventasDeHAbitacionWit__info__table__item colorwithe"></div>
                </div>
            </div>
            <div className="ventasDeHAbitacionWit__bottom">
                <p className="ventasDeHAbitacionWit__bottom__label">{"Venta acumulada"}</p>
                <div className="ventasDeHAbitacionWit__bottom-percent">
                    {acumulada > 100 && <Triangle height={7} width={12} />}
                    <p className="ventasDeHAbitacionWit__bottom-percent__label">{`${acumulada}%`}</p>
                </div>
            </div>
        </div>
    )
}

export default VentasDeHabitacionWidget
