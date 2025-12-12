export interface Props {
    visible: boolean
    onClose: () => void
    onSub?: (value: { texto: string; success: boolean }) => void
}
