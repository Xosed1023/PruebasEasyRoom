import { ReactNode, useEffect, useMemo, useState } from "react"
import { useProfile } from "./useProfile"
import UnauthorizedModal from "../components/modal/UnauthorizedModal/UnauthorizedModal"

export enum RoleNames {
    admin = "ADMINISTRADOR",
    recepcionista = "RECEPCIONISTA",
    gerente = "GERENTE",
    cocina = "COCINA",
    bar = "BAR",
    valet = "VALETPARKING",
    superadmin = "SUPERADMIN",
    rrhh = "RRHH",
    roomService = "ROOMSERVICE",
    restaurante = "RESTAURANTE",
    monitoreo = "MONITOREO",
    mantenimiento = "MANTENIMIENTO",
}

const useAuth = ({
    authModal,
    isOpen,
    authorizedRoles,
    onClose,
    noNeedAuthModalRoles = [RoleNames.admin, RoleNames.superadmin],
}: {
    authModal: ReactNode
    isOpen: boolean
    // roles que hacen aparecer el modal de pin
    authorizedRoles: RoleNames[]
    // roles que ponen el skip en true para saltar esta validación
    noNeedAuthModalRoles?: RoleNames[]
    onClose: () => void
}) => {
    const { rolName } = useProfile()

    const [authorized, setauthorized] = useState<boolean>()
    const [skip, setSkip] = useState<boolean | null>(null)

    useEffect(() => {
        const isSkip = noNeedAuthModalRoles.some((r) => r === rolName)
        setSkip(isSkip)
    }, [noNeedAuthModalRoles, rolName])

    useEffect(() => {
        const isAuthorized = authorizedRoles.some((r) => r === rolName)
        setauthorized(isAuthorized)
    }, [authorizedRoles, isOpen])

    const Modal: ReactNode = useMemo(() => {
        if (!isOpen) {
            return <></>
        }
        if (skip || skip === null) {
            return <></>
        }
        return authorized ? authModal : <UnauthorizedModal isOpen={isOpen} onClose={onClose} />
    }, [authModal, authorized, authorizedRoles, isOpen, skip])

    return { Modal, skip }
}

export default useAuth
