import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    name: string
    description: string
    cost: number
    conenido: string
    image: string
    size: number
    value: number
    load?: boolean
    negative?: boolean
    type: string
    onChange: (value: number) => void
    onPreventDecrement?: () => void
}
