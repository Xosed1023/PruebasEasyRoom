import { useState } from "react"
import { SecondaryButton } from "src/pages/home/room-detail/sections/elements/Elements"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import useAuth, { RoleNames } from "src/shared/hooks/useAuth"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import Icon from "src/shared/icons"
import { getCurrencyFormat } from "src/utils/string"

function Ingredients({
    data = [],
    costo = 0,
    cantidad = "",
    onClick,
}: {
    data: any[]
    costo: number
    cantidad: string
    onClick: () => void
}): JSX.Element {
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()
    const { Modal, skip } = useAuth({
        authModal: (
            <AuthRequiredModal
                title="Autorización de proceso"
                isOpen={isAuthModalOpen}
                onAuthFilled={(v) => {
                    setisAuthModalOpen(false)
                    onClick()
                }}
                onClose={() => setisAuthModalOpen(false)}
            />
        ),
        authorizedRoles: [RoleNames.admin, RoleNames.recepcionista, RoleNames.cocina, RoleNames.bar],
        noNeedAuthModalRoles: [RoleNames.admin, RoleNames.cocina, RoleNames.bar],
        isOpen: isAuthModalOpen,
        onClose: () => setisAuthModalOpen(false),
    })

    return (
        <div className="detalle-receta__content">
            <div className="detalle-receta__content detalle-receta__box">
                <div>
                    <div className="detalle-receta__ingredients__contain">
                        {data.map(({ label = "", value = "" }, index) => (
                            <div className="detalle-receta__ingredients__item" key={index}>
                                <p className="detalle-receta__ingredients__item-label">{`${index + 1}.- ${label}`}</p>
                                <p className="detalle-receta__ingredients__item-value">{value}</p>
                            </div>
                        ))}
                    </div>
                    {cantidad && (
                        <div className="detalle-receta__ingredients__item" style={{ marginBottom: 15 }}>
                            <div className="detalle-receta__ingredients__costo">
                                <Icon name="RecipeHistory" height={16} width={16} color="var(--white)" />
                                <p className="detalle-receta__ingredients__item-label">{"Cantidad a producir"}</p>
                            </div>
                            <p className="detalle-receta__ingredients__item-value">{cantidad}</p>
                        </div>
                    )}
                    <div className="detalle-receta__ingredients__item">
                        <div className="detalle-receta__ingredients__costo">
                            <Icon name="CoinsFill" height={16} width={16} color="var(--white)" />
                            <p className="detalle-receta__ingredients__item-label">{"Costo por producción"}</p>
                        </div>
                        <p className="detalle-receta__ingredients__item-value">{getCurrencyFormat(costo)}</p>
                    </div>
                </div>
            </div>
            {Modal}
            {InactiveModal}
            <SecondaryButton text="Editar receta" onClick={validateIsColabActive(() => (skip ? onClick() : setisAuthModalOpen(true)))} />
        </div>
    )
}

export default Ingredients
