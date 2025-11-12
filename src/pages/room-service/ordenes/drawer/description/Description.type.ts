import { COLLECTION } from "src/shared/icons/Icon"
import { ComponentProps } from "src/types/component"

export interface DescriptionProps extends ComponentProps {
    containerClassName?: string
    label1: string
    value1?: string
    label2?: string
    value2?: string
    value3?: string
    icon?: keyof typeof COLLECTION | (string & {})
}
