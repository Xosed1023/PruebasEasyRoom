import { SVGProps } from "react"
import { COLLECTION } from "../Icon"


export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
    color?: string
    name?: keyof typeof COLLECTION | (string & {})
    secondarycolor?: string
    size?: "sm" | "ch" | "lg",
    forButtonIcon?: boolean
}