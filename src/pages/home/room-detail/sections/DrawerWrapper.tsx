import cx from "classnames"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { Props as DrawerProps } from "src/shared/components/layout/drawer/Drawer.types"
import { useRoomDarwer } from "../hooks/darwer"
import "./DrawerWrapper.css"

type Props = Omit<DrawerProps, "visible" | "onClose">

function DrawerWrapper({ className = "", ...rest }: Props): JSX.Element {
    const { visible, onClose } = useRoomDarwer()

    return (
        <Drawer
            placement={"right"}
            bar={false}
            visible={visible}
            withCloseButton={true}
            onClose={onClose}
            className={cx("drawer-wrapper", className)}
            {...rest}
        />
    )
}

export default DrawerWrapper
