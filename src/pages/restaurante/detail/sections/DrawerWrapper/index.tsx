import cx from "classnames"
import Icon from "src/shared/icons"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import DrawerSkeleton from "../DrawerSkeleton"
import { usePersonalRoomService } from "src/shared/sections/payment/propina/input-personal/InputPersonal.hooks"
import { Props as DrawerProps } from "src/shared/components/layout/drawer/Drawer.types"
import { useRestaurantDarwer } from "../../hooks/drawer"
import "./index.css"

type Props = Omit<DrawerProps, "visible" | "onClose">

function DrawerWrapper({ className = "", children, ...rest }: Props): JSX.Element {
    const { visible, onClose } = useRestaurantDarwer()
    const { loading, colaboradores } = usePersonalRoomService()

    return (
        <Drawer
            placement={"right"}
            bar={false}
            visible={visible}
            withCloseButton={true}
            onClose={onClose}
            className={cx("drawer-restaurant", className)}
            {...rest}
        >
            {!loading ? (
                colaboradores.length > 0 ? (
                    children
                ) : (
                    <div className="drawer-restaurant__empty">
                        <div className="drawer-restaurant__empty-logo">
                            <Icon name={"userFilled"} height={90} width={95} color={"var(--white)"} />
                        </div>
                        <p className="drawer-restaurant__empty-title">{"Activa un colaborador para continuar."}</p>
                        <p className="drawer-restaurant__empty-description">
                            {
                                "Para crear orden, activa mínimo 1 colaborador (mesero, gerente o recepcionista). Puedes gestionar la activación desde la sección de Personal. "
                            }
                        </p>
                    </div>
                )
            ) : (
                <DrawerSkeleton />
            )}
        </Drawer>
    )
}

export default DrawerWrapper
