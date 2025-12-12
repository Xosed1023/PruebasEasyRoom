import Drawer from "../../drawer/Drawer"
import "./DrawerWidget.css"
import DrawerGerente from "./DrawerGerente/DrawerGerente"
import DrawerRecepcionista from "./DrawerRecepcionista/DrawerRecepcionista"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import { RoleNames } from "src/shared/hooks/useAuth"
import { useCurrentRol, useCurrentTurno } from "src/shared/widgets/hooks/general"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { useEffect, useState } from "react"
import DrawerListaEspera from "./DrawerListaEspera/DrawerListaEspera"

type View = "estatus" | "lista"

interface DrawerWidgetProps {
    onClose: () => void
    showDrawer: boolean
}

const roles_lista = [RoleNames.valet, RoleNames.restaurante]

function DrawerWidgetContent({ view }: { view: View }) {
    const rol = useCurrentRol()
    return roles_lista.includes(rol) ? (
        <DrawerListaEspera />
    ) : (
        <>
            {rol === RoleNames.gerente || rol === RoleNames.admin || rol === RoleNames.superadmin ? (
                <>{view === "estatus" ? <DrawerGerente /> : <DrawerListaEspera />}</>
            ) : (
                <>{view === "estatus" ? <DrawerRecepcionista /> : <DrawerListaEspera />}</>
            )}
        </>
    )
}

const DrawerWidget = ({ onClose, showDrawer }: DrawerWidgetProps) => {
    const [view, setView] = useState<View>("estatus")
    const rol = useCurrentRol()
    const turno = useCurrentTurno()
    const { formatCustomDate } = useFormatDate()

    useEffect(() => {
        if (showDrawer) setView("estatus")
    }, [showDrawer])

    return (
        <Drawer
            onClose={onClose}
            visible={showDrawer}
            style={{ background: "rgba(14, 14, 14, 0.80)", transform: "translate3d(0px, -710px, 0px)", height: 640 }}
            config={{ top: "-710px" }}
        >
            <div className="drawerWidget">
                <div className="drawerWidget__title">
                    {!roles_lista.includes(rol) ? (
                        <TabMenu
                            className="drawerWidget__tabs"
                            darkMode={true}
                            value={view}
                            tabList={[
                                { label: "Estatus de hotel", path: "estatus" },
                                { label: "Lista de espera", path: "lista" },
                            ]}
                            onChange={(v) => setView(v as View)}
                        />
                    ) : (
                        <p className="drawerWidget__title__label">{"Dashboard"}</p>
                    )}
                    <div className="drawerWidget__title__turno">
                        Turno {turno} <span>{formatCustomDate(new Date(), "MMM DD, YYYY, hh:mm A")}</span>
                    </div>
                </div>
                <DrawerWidgetContent view={view} />
                <div className="header__notch" onClick={onClose}>
                    <div className="header__notch__bar"></div>
                </div>
            </div>
        </Drawer>
    )
}

export default DrawerWidget