import { SVGProps } from "react"

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
    color?: string
    secondarycolor?: string
    size?: "sm" | "ch" | "lg",
    forButtonIcon?: boolean
}