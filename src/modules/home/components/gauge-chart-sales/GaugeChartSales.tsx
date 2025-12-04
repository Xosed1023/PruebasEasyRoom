import { Label, PolarRadiusAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart/Chart"
import { GaugeChartSalesProps } from "./GaugeChartSales.type"
import styles from "./GaugeChartSales.module.css"

const GaugeChartSales = ({ mostrador, reserva, total }: GaugeChartSalesProps) => {
    const chartData = [
        {
            mostrador,
            reserva,
            empty: !mostrador && !reserva ? 1 : 0,
        },
    ]

    const chartConfig = {
        mostrador: {
            label: "Desktop",
            color: "var(--error)",
        },
        reserva: {
            label: "Mobile",
            color: "var(--sucia)",
        },
        placeholder: {
            label: "empty",
            color: "var(--fondo-close)",
        },
    } satisfies ChartConfig

    const totalVisitors = total

    return (
        <div className={styles["gauge-chart--sales"]}>
            <ResponsiveContainer>
                <ChartContainer config={chartConfig} className="aspect-square w-full">
                    <RadialBarChart defaultShowTooltip={false} data={chartData} endAngle={180} innerRadius={120} outerRadius={180}>
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 36}
                                                    className={styles.counter}
                                                >
                                                    {totalVisitors.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className={styles.counter__label}
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="empty"
                            stackId="a"
                            cornerRadius={10}
                            fill="var(--fondo-close)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="mostrador"
                            stackId="a"
                            cornerRadius={10}
                            fill="var(--sucia)"
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="reserva"
                            fill="var(--ocupada)"
                            stackId="a"
                            cornerRadius={10}
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </ResponsiveContainer>
        </div>
    )
}

export default GaugeChartSales
