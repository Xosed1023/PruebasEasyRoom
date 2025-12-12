import { useEffect } from "react"
import "./IngresoTotalWithdhet.css"
import * as echarts from "echarts"
import { getCurrencyFormat } from "src/utils/string"

interface IngresoTotalWithdhetProps {
    total?: number
    data?: {
        title: string
        total: number
        matutino: number
        vespertino: number
        nocturno: number
    }[]
}

const IngresoTotalWithdhet = ({ total = 0, data }: IngresoTotalWithdhetProps) => {
    useEffect(() => {
        if (data) {
            data.forEach(({ matutino = 0, vespertino = 0, nocturno = 0, total = 0 }, index) => {
                const stateCero = total === 0 ? 1 : 0

                // Obtén el elemento del DOM donde se renderizará el gráfico
                const chartContainer = document.getElementById(`graficaIngresos${index}`)

                // Inicializa el gráfico
                const myChart = echarts.init(chartContainer)

                // Configura los datos y opciones del gráfico
                const options = {
                    tooltip: {
                        show: false,
                    },
                    legend: {
                        show: false,
                    },

                    series: [
                        {
                            name: "Access From",
                            type: "pie",
                            radius: ["70%", "95%"],
                            avoidLabelOverlap: false,
                            itemStyle: {
                                borderRadius: 10,
                            },
                            label: {
                                show: false,
                                position: "left",
                            },
                            height: "70px",
                            width: "70px",
                            emphasis: {
                                scaleSize: 2,
                                label: {
                                    show: false,
                                },
                            },

                            data: [
                                {
                                    value: matutino,
                                    name: "Matutino",
                                    itemStyle: {
                                        color: "#6941C6",
                                    },
                                },
                                {
                                    value: vespertino,
                                    name: "Vespertino",
                                    itemStyle: {
                                        color: "#ffc907",
                                    },
                                },
                                {
                                    value: nocturno,
                                    name: "Nocturno",
                                    itemStyle: {
                                        color: "#f23c3c",
                                    },
                                },
                                {
                                    value: stateCero,
                                    name: "ASD",
                                    itemStyle: {
                                        color: "#262626",
                                    },
                                },
                            ],
                        },
                    ],
                }

                // Aplica las opciones al gráfico
                myChart.setOption(options)
            })
        }
    }, [data])

    return (
        <div className="ingresoTotalWithdhet">
            <div className="ingresoTotalWithdhet__header">
                <div className="ingresoTotalWithdhet__header__title">Ingreso total del día</div>
                <div className="ingresoTotalWithdhet__header__total">{getCurrencyFormat(total)}</div>
            </div>
            <div className="ingresoTotalWithdhet__content">
                {data?.map(({ title = "", matutino = 0, vespertino = 0, nocturno = 0, total = 0 }, index) => (
                    <div className="ingresoTotalWithdhet__item" key={index}>
                        <div className="ingresoTotalWithdhet__graph__title">{title}</div>
                        <div className="ingresoTotalWithdhet__graph">
                            <div id={`graficaIngresos${index}`} style={{ width: "70px", height: "70px" }}></div>
                            <div className="ingresoTotalWithdhet__graph__table">
                                <div className="ingresoTotalWithdhet__info">
                                    <div className="ingresoTotalWithdhet__info__table colorwithe">
                                        <div className="ingresoTotalWithdhet__info__table__item colorwithe">
                                            <div className="ingresoTotalWithdhet__info__table-container">
                                                <span
                                                    className="ventasDehab_point"
                                                    style={{ backgroundColor: "#6941C6" }}
                                                ></span>
                                                Matutino
                                            </div>
                                            {getCurrencyFormat(matutino)}
                                        </div>
                                        <div className="ingresoTotalWithdhet__info__table__item colorwithe">
                                            <div className="ingresoTotalWithdhet__info__table-container">
                                                <span
                                                    className="ventasDehab_point"
                                                    style={{ backgroundColor: "#FFC907" }}
                                                ></span>
                                                Vespertino
                                            </div>
                                            {getCurrencyFormat(vespertino)}
                                        </div>
                                        <div className="ingresoTotalWithdhet__info__table__item colorwithe">
                                            <div className="ingresoTotalWithdhet__info__table-container">
                                                <span
                                                    className="ventasDehab_point"
                                                    style={{ backgroundColor: "#DC3737" }}
                                                ></span>
                                                Nocturno
                                            </div>
                                            {getCurrencyFormat(nocturno)}
                                        </div>
                                        <div className="ingresoTotalWithdhet__info__table__header colorwithe">
                                            <div className="ingresoTotalWithdhet__info__table-container">Total</div>
                                            {getCurrencyFormat(total)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IngresoTotalWithdhet
