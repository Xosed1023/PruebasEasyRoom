import { useEffect } from "react"
import * as echarts from "echarts"

type ChartProps = {
    height?: number
    width?: number
    percent: number
    color: string
    description?: string
    id: string
    className?: string
}

function Chart({
    height = 0,
    width = 0,
    percent = 0,
    color = "#6941C6",
    description = "",
    id = "",
    className = "",
}: ChartProps): JSX.Element {
    useEffect(() => {
        // Obtén el elemento del DOM donde se renderizará el gráfico
        const chartContainer = document.getElementById(id)

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
                    height: `${height}px`,
                    width: `${width}px`,
                    avoidLabelOverlap: false,

                    startAngle: 290,

                    color: [color, "#232323"],

                    itemStyle: {
                        borderRadius: 18,
                    },
                    data: [
                        {
                            value: percent,
                            name: "Huespedes",
                        },
                        {
                            value: 100 - percent,
                        },
                    ],
                },
            ],
        }

        // Aplica las opciones al gráfico
        myChart.setOption(options)
    }, [percent])

    return (
        <div className="ocupacionWitged__graph">
            <div className={className} id={id} style={{ width, height }}></div>
            <div className="ocupacionWitged__graph__info">
                <div className="ocupacionWitged__graph__info__number">
                    {percent}
                    <span className="ocupacionWitged__porcentaje" style={{ fontSize: 9 }}>
                        %
                    </span>
                </div>
                {description && <div className="ocupacionWitged__graph__info__title">{description}</div>}
            </div>
        </div>
    )
}

export default Chart
