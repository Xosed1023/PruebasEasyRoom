import { ReactNode, useState } from "react"
import { useMyColaborador } from "src/shared/providers/ColaboradorProvider"
import ColabInactiveModal from "../components/modal/ColabInactiveModal/ColabInactiveModal"
import { RoleNames } from "./useAuth"
import { useProfile } from "./useProfile"

const useIsColaboradorActive = () => {
    const colab = useMyColaborador()
    const { rolName } = useProfile()

    const [isShowingUnauthorizedModal, setshowUnauthorizedModal] = useState(false)

    const validateIsColabActive = <T = unknown, N = void>(cb: (...args: T[]) => N): ((...args: T[]) => void) => {
        if (colab?.en_turno || [RoleNames.admin].includes(rolName as RoleNames)) {
            return cb
        }
        return () => setshowUnauthorizedModal(true)
    }

    const InactiveModal: ReactNode = isShowingUnauthorizedModal ? (
        <ColabInactiveModal isOpen onClose={() => setshowUnauthorizedModal(false)} />
    ) : null

    return { validateIsColabActive, InactiveModal }
}

export default useIsColaboradorActive
