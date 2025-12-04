import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart/Chart"

import styles from "./ChartMini.module.css"
import Card from "../card/Card"
import { ChartMiniProps } from "./ChartMini.type"

const ChartMini = ({ title, value, limit, color, bgClass, dataKey }: ChartMiniProps) => {
    function mapValueToRange(value: number, limit: number): number {
        const min = 270
        const max = -270

        const proportion = limit > 0 ? value / limit : 0
        const mapped = min + (max - min) * proportion

        return mapped
    }

    function getPercentage(value: number, limit: number): number {
        if (limit === 0) return 0 // evitar división por cero
        return (value / limit) * 100
    }

    const chartData = [{ [dataKey]: 200, fill: color }]
    const chartConfig = {} satisfies ChartConfig
    
    return (
        <Card className="flex-1 h-[199px]">
            <h1 className={styles["chart--mini__title"]}>{title}</h1>
            <ResponsiveContainer>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <RadialBarChart
                        data={chartData}
                        startAngle={270}
                        endAngle={mapValueToRange(value, limit)}
                        innerRadius={50}
                        outerRadius={90}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className={`${bgClass} last:fill-[var(--header)]`}
                            polarRadius={[58, 42]}
                        />
                        <RadialBar dataKey={dataKey} background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 3}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                                className="text-center grid place-items-center"
                                            >
                                                <tspan
                                                    className={styles["chart--mini__label"]}
                                                >
                                                    {getPercentage(value, limit).toFixed(2)}%
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </ResponsiveContainer>
        </Card>
    )
}

export default ChartMini
