import { useEffect, useState } from "react"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import DetalleIncidencia from "../detail/DetalleIncidencia"
import Comments from "../comments/Comments"
import { tabsDrawer } from "./Drawer.constants"
import "./Drawer.css"

type DrawerSectionProps = {
    visible: boolean
    folio?: string
    incidenciaId: string
    onClose: () => void
    onConfirm?: () => void
}

export function DrawerSection({
    visible = false,
    onClose,
    folio = "",
    incidenciaId = "",
    onConfirm,
}: DrawerSectionProps): JSX.Element {
    const [path, setPath] = useState<string>(tabsDrawer[0].path)
    const [tipoIncidencia, setTipoIncidencia] = useState("")

    useEffect(() => {
        setTipoIncidencia("")
    }, [incidenciaId])

    return (
        <Drawer
            className="incidencia__drawer"
            placement={"right"}
            bar={false}
            visible={visible}
            withCloseButton={true}
            onClose={onClose}
        >
            <div>
                <h5 className="incidencia__drawer__title">{"Detalle de incidencia"}</h5>
                <p className="incidencia__drawer__subtitle">{folio}</p>
                <TabMenu
                    className="reservas-screen__tabs__navigation"
                    darkMode={true}
                    value={path || tabsDrawer[0].path}
                    tabList={tabsDrawer}
                    onChange={(value) => setPath(value)}
                />
                {path === "detail" ? (
                    <DetalleIncidencia
                        incidenciaId={incidenciaId}
                        onConfirm={onConfirm ? onConfirm : () => null}
                        onTipoIncidenciaChange={(tipo) => setTipoIncidencia(tipo)}
                    />
                ) : (
                    <Comments incidenciaId={incidenciaId} tipoIncidencia={tipoIncidencia} />
                )}
            </div>
        </Drawer>
    )
}
