import { Incidence } from "../../pages/incidence-list/IncidenceList.type"
export type Props = {
    open: boolean
    onClose: () => void
    incidence: Incidence | null
    isLoading?: boolean
}