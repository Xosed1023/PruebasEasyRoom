import { useNavigate } from "react-router-dom/dist/index"
import { useDispatch, useSelector } from "react-redux"
import Header from "src/shared/components/navigation/header/Header"
import { useOnLogout } from "src/shared/components/navigation/header/Header.helpers"
import DrawerWidget from "./Drawer/DrawerWidget"
import { RootState } from "src/store/store"
import { useProfile } from "src/shared/hooks/useProfile"
import {
    toggleDrawer,
    toggleDrawerWidget,
    toggleRoomDetailsDrawer,
    toggleSlidePersonal,
} from "src/store/navigation/navigationSlice"
import { setMyProfile } from "src/store/profile/profileSlice"
import { useHideNotch } from "src/shared/hooks/useHideNotch"
import ModalEasyrewards from "src/pages/easyrewards/components/ModalEasyrewards/ModalEasyrewards"
import { useEffect, useState } from "react"
import { togglePersonalDrawer, togglePersonalTurnoDrawer } from "src/store/personal/personal.slice"
import { toggleInventarioDetailDrawer } from "src/store/inventario/inventario.slice"
import { useModulos } from "src/shared/hooks/useModulos"
import { setRooms } from "src/store/rooms/roomsSlice"
import { useMenuItems } from "src/shared/hooks/useMenuItems"
import { CurrentdateProvider } from "src/shared/providers/CurrentdateProvider"
import SlidePersonal from "./Drawer/SlidePersonal"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"

export const HeaderSection = () => {
    const navigate = useNavigate()
    const { myProfile, nombre_hotel, rolName, logo_hotel } = useProfile()
    const { isDrawerWidgetOpen, isSlidePersonalOpen } = useSelector((state: RootState) => state.navigation)
    const { onLogout } = useOnLogout()
    const { hideNotch } = useHideNotch()
    const { easyRewards: withEasyrewards } = useModulos()
    const dispatch = useDispatch()
    const toggleDrawerWidgetState = (value: boolean) => {
        dispatch(toggleDrawerWidget(value))
    }

    const [isModalOpen, setIsModalOpen] = useState(false)
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const openModal = validateIsColabActive(() => {
        setIsModalOpen(true)
    })

    const closeModal = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        dispatch(toggleRoomDetailsDrawer(false))
        dispatch(toggleDrawer(false))
        dispatch(togglePersonalTurnoDrawer(false))
        dispatch(togglePersonalDrawer(false))
        dispatch(toggleInventarioDetailDrawer(false))
    }, [isDrawerWidgetOpen])


    const menuItems = useMenuItems(rolName, withEasyrewards, navigate, openModal)

    return (
        <>
            <Header
                hotel={{
                    name: `${nombre_hotel || ""}`,
                    avatar: logo_hotel,
                }}
                user={{
                    name: `${myProfile?.nombre} ${myProfile?.apellido_paterno || ""}`,
                    email: myProfile?.correo,
                    avatar: "https://randomuser.me/api/portraits/women/75.jpg",
                }}
                items={menuItems}
                showDrawer={isDrawerWidgetOpen || hideNotch}
                onLogout={() => {
                    setMyProfile({})
                    dispatch(setRooms([]))
                    onLogout()
                }}
                onClickNoch={() => toggleDrawerWidgetState(true)}
            />
            <CurrentdateProvider>
                <DrawerWidget onClose={() => toggleDrawerWidgetState(false)} showDrawer={isDrawerWidgetOpen} />
                {isSlidePersonalOpen && <SlidePersonal onClose={() => dispatch(toggleSlidePersonal(null))} />}
            </CurrentdateProvider>
            <ModalEasyrewards
                isOpen={isModalOpen}
                onClose={closeModal}
                titleEasyrewards="Puntos Easyrewards"
                descriptionEasyrewards="Revisa el saldo de puntos Easyrewards acumulados por tus huéspedes."
                buttonTextEasyrewards="Buscar"
            />
            {InactiveModal}
        </>
    )
}
