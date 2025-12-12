import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    value?: string
    onChange: (value: string) => void
    onCompleteChange?: (value: string) => void
    error?: boolean
    hintText?: string
    label?: string
    hintAlignment?: "left" | "center";
}
