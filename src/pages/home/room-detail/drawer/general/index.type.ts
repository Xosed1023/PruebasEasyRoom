export type Section =
    | "home"
    | "clean-staff"
    | "clean-tyoe"
    | "mantenance-staff"
    | "mantenance-reason"
    | "booking"
    | "supervisor-staff"
    | "finish-clean"
    | "tipoLimpieza"
    | "change-clean-type"
    | "change-supervisor-staff"

export type SectionProps = {
    state?: any
    onNavigate: (value: Section, state?: any) => void
    onConfirmItem?: (item: any) => void
}

export type Navigate = {
    path: string
    state: any
}

export type State = {
    label: string
    value: string
    extra?: string
}
