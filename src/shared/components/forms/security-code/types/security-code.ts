import { CSSProperties, DialogHTMLAttributes, LegacyRef } from "react"

export interface SecurityCodeProps extends DialogHTMLAttributes<HTMLDialogElement> {
    ref?: LegacyRef<HTMLDialogElement>
    title: string
    disabled?: boolean
    password?: boolean
    // para el fondo redondo del ícono
    cancelButtonTheme?: "primary" | "secondary" | "secondary-gray" | "tertiary" | "tertiary-gray"
    cancelButtonStyle?: CSSProperties
    onCloseDialog?: ({ confirmed }: { confirmed: boolean }) => void
    onConfirm?: ({ passcode }: { passcode: boolean }) => void
    returnValue?: (value: number) => void
}
