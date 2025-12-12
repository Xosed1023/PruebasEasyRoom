import RoomCards from "./components/RoomCards/RoomCards"
import Screen from "src/shared/components/layout/screen/Screen"
import "./Home.css"
import DrawerNavigator from "./room-detail/drawer"
import SkeletonCards from "./components/SkeletonCards/SkeletonCards"
import { useSelector } from "react-redux"
import { RootState } from "src/store/store"
import HeaderTimer from "./sections/HeaderTimer/HeaderTimer"
import { CurrentdateProvider } from "src/shared/providers/CurrentdateProvider"

function Home(): JSX.Element {
    const { rooms } = useSelector((root: RootState) => root.rooms)

    return (
        <CurrentdateProvider>
            <Screen className="home-screen" staticWidth={false}>
                <div className="home-screen__header__wrapper">
                    <div className="home-screen__header">
                        <h2 className="screen__head__title">Habitaciones</h2>
                        <HeaderTimer />
                    </div>
                </div>
                {!rooms.length ? <SkeletonCards /> : <RoomCards />}
                <DrawerNavigator />
            </Screen>
        </CurrentdateProvider>
    )
}

export default Home
