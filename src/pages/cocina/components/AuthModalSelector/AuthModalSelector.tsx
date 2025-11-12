import AuthCocinaModal from "../modals/AuthCocinaModal/AuthCocinaModal"
import { RoleNames } from "src/shared/hooks/useAuth"
import { RequestState } from "../../helpers/getRequestState"

const AuthModalSelector = ({
    estadoOrdenOArticulo = RequestState.en_preperacion,
    isOpen,
    onAuthFilled,
    onClose,
    title,
    authorizedPins
}: {
    estadoOrdenOArticulo?: RequestState
    isOpen: boolean
    onAuthFilled: (usuario_autorizo_id?: string) => void
    onClose: () => void
    title: string
    authorizedPins?: RoleNames[]
}) => {
    const authorizedRoles = [RoleNames.admin, RoleNames.cocina, RoleNames.bar, RoleNames.restaurante]
    return estadoOrdenOArticulo === RequestState.en_preperacion ? (
        <AuthCocinaModal
            authorizedPins={authorizedPins}
            authorizedRoles={authorizedRoles}
            iconFrom="RecipeHistory"
            iconTo="Order"
            isOpen={isOpen}
            onAuthFilled={(value, sample, usuario_autorizo_id)=>onAuthFilled(usuario_autorizo_id || "")}
            onClose={onClose}
            subtitle="Ingresa el código de autorización o coloca tu huella en el lector para autorizar el cambio de estatus."
            title={title}
        />
    ) : estadoOrdenOArticulo === RequestState.por_entregar ? (
        <AuthCocinaModal
            authorizedPins={authorizedPins}
            iconFrom="Order"
            authorizedRoles={authorizedRoles}
            iconTo="IconPendingPaymentFill"
            isOpen={isOpen}
            onAuthFilled={(value, sample, usuario_autorizo_id)=>onAuthFilled(usuario_autorizo_id || "")}
            onClose={onClose}
            subtitle="Ingresa el código de autorización o coloca tu huella en el lector para autorizar el cambio de estatus."
            title={title}
        />
    ) : (
        <></>
    )
}

export default AuthModalSelector
