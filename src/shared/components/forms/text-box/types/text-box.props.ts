import { TextareaHTMLAttributes } from "react"

export interface TextBoxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    description?: string
    hinttext?: string
    error?: boolean
    characterLimit?: number
    errorHintText?: string
}
