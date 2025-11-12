import Screen from "src/shared/components/layout/screen/Screen"
import "./ConfigPropinas.css"
import InputTabs from "src/shared/components/forms/input-tabs/InputTabs"
import { useState } from "react"
import Comisiones from "./components/comisiones/Comisiones"
import Pagos from "./components/pagos/Pagos"

const ConfigPropinas = () => {
    const [tab, setTab] = useState<string>("comisiones")
    const tabs = [
        { label: "Comisiones", value: "comisiones" },
        { label: "Pagos a colaboradores", value: "pagos" },
    ]

    return (
        <Screen className="config-propinas__layout" title="Configuración de propinas" close>
            <InputTabs
                containerClassName="config-propinas__tabs"
                label={""}
                items={tabs}
                value={tab}
                onChange={(value) => {
                    setTab(value)
                }}
            />
            {tab === "comisiones" ? <Comisiones /> : <Pagos />}
        </Screen>
    )
}

export default ConfigPropinas
