export type PropinasPDFProps = {
    data: {
        section: string
        values: {
            value: string[]
        }[]
    }[]
    totals: string[]
    dates: {
        label: string
        value: string
    }[]
}
