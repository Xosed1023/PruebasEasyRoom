import { Label, Pie, PieChart } from "recharts"

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart/Chart"
import { formatAmount } from "@/utils/formatAmount"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import Card from "@/modules/home/components/card/Card"
import { PieChartIncomeProps } from "./PieChart.type"

import styles from "./PieChart.module.css"
import { sum } from "@/helpers/calculator"

const PieChartIncome = ({ data, title }: PieChartIncomeProps) => {
    const totalVisitors = sum(data.map((d) => d.value))

    const chartData = [
        ...data.map((d) => ({
            turn: d.id,
            amount: d.value,
            fill: `var(--color-${d.id})`,
        })),
        ...(totalVisitors <= 0 ? [{ turn: "No hay ingresos", amount: 1, fill: "var(--fondo-close)" }] : []),
    ]

    const chartConfig = data.reduce(
        (acc, curr) => ({
            ...acc,
            ...(totalVisitors <= 0
                ? {
                      placeholder: {
                          label: "",
                          color: "var(--fondo-close)",
                      },
                  }
                : {}),
            [curr.id]: {
                label: curr.label,
                color: `${curr.color}`,
            },
        }),
        {}
    ) satisfies ChartConfig

    return (
        <>
            <SectionTitle title={title} />
            <Card>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel showValue={false} />} />
                        <Pie
                            data={chartData}
                            dataKey="amount"
                            nameKey="turn"
                            innerRadius={"85%"}
                            radius={"100%"}
                            outerRadius={"100%"}
                            strokeWidth={5}
                            cornerRadius={50}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className={styles["pie-chart-total-income__value"]}
                                                >
                                                    {totalVisitors > 0
                                                        ? formatAmount(totalVisitors, { decimals: true })
                                                        : "$0.00"}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className={styles["pie-chart-total-income__label"]}
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
                {data.map((d) => (
                    <div className="flex justify-between" key={d.id}>
                        <div className="flex gap-x-[13px] items-center">
                            <div
                                className={`${styles["pie-chart-total-income__dot"]}`}
                                style={{
                                    backgroundColor: d.color,
                                }}
                            ></div>
                            <span className={styles["pie-chart-item-label"]}>{d.label}</span>
                        </div>
                        <span className={styles["pie-chart-item-value"]}>
                            {d.value > 0 ? formatAmount(d.value, { decimals: true }) : "$0.00"}
                        </span>
                    </div>
                ))}
            </Card>
        </>
    )
}

export default PieChartIncome
