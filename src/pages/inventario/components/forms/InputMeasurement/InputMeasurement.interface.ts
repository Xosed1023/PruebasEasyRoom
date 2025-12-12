import { InputHTMLAttributes } from "react"
import { UnidadMedidasArticulo } from "src/gql/schema"

export interface InputMeasurementProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
    label?: string
    hinttext?: string
    errorhinttext?: string
    error?: boolean
    tooltip?: string
    options?: OptionMeasurement[]
    triggerOnChangeOnBlur?: boolean
    disabledPrefix?: boolean
    onChange: (value: MaesurementValue | undefined) => void
    value: MaesurementValue | null
    limitLength?: number
    width?: number
    // TODO
    dropdownPosition?: "top" | "bottom"
    dropwownHeight?: string
    allowDecimals?: boolean
}

export interface MaesurementValue {
    value?: string
    type: string
}

export interface OptionMeasurement {
    value: UnidadMedidasArticulo
    disabled?: boolean
}
