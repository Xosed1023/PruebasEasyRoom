import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    children: string
    boldClassName?: string
    color?: string
    boldColor?: string
}
