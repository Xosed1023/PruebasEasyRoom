import { useEffect, useState } from "react"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import useCountColabs from "../../hooks/useCountColabs"
import { AreasName, tabs } from "src/pages/personal/inicio.constants"
import { Area } from "src/gql/schema"

const TabMenuPersonal = ({
    areas,
    onChange,
    value,
}: {
    areas: Area[]
    onChange: (value: AreasName) => void
    value: AreasName
}) => {
    const { getCounts } = useCountColabs({ areas })

    const [tabsValue, setTabsValue] = useState<
        {
            label: string
            number: number
            path: string
        }[]
    >([])

    useEffect(() => {
        const tabsList: {
            label: string
            number: number
            path: string
        }[] = []
        getCounts().then((v) => {
            tabs.forEach((tab) => {
                if (tab.path === "Recepción") {
                    tabsList.push({
                        label: tab.label,
                        path: tab.path,
                        number: v.recepcion || 0,
                    })
                }
                if (tab.path === "Hospedaje") {
                    tabsList.push({
                        label: tab.label,
                        path: tab.path,
                        number: v.hospedaje || 0,
                    })
                }
                if (tab.path === "Alimentos y Bebidas") {
                    tabsList.push({
                        label: tab.label,
                        path: tab.path,
                        number: v.alimentosBebidas || 0,
                    })
                }
            })
            setTabsValue(tabsList)
        })
    }, [tabs, areas])

    return (
        <TabMenu
            className="reservas-screen__table__tabs"
            tabList={tabsValue}
            value={value}
            showNumerOnNoItems
            onChange={(value) => {
                onChange(value as AreasName)
            }}
            style={{ marginTop: 20 }}
        />
    )
}

export default TabMenuPersonal
