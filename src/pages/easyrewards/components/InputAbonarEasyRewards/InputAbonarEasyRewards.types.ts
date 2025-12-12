export type InputAbonarEasyRewardsProps = {
    onChange: (value: string) => void
    value: string
    error?: boolean
    errorhinttext?: string
    label?: string
    icon?: "giftFill" | (string & {})
    className?: string
    inputWrapperClass?: string
    testId?: string
}
export type LovePoint = {
    id: string
    saldo: number
}
