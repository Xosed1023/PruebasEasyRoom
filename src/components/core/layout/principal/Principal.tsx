import NavbarNavigator from "components/core/navigation/navbar"
import Screen from "../screen/Screen"
import { Outlet } from "react-router"
import Header from "../header/Header"

function Principal() {
    return (
        <Screen className="gap-y-[20px] flex flex-col" header={<Header />} footer={<NavbarNavigator />}>
            <Outlet />
        </Screen>
    )
}

export default Principal
