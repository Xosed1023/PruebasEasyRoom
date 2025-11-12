import { Section } from "src/store/roomDetails/constants/sections.type"

export type SectionProps = {
    state?: any
    onNavigate: (value: Section, state?: any) => void
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
