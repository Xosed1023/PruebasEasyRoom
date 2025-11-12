import Screen from "src/shared/components/layout/screen/Screen"
import "./Restaurante.css"
import { Button } from "src/shared/components/forms"
import Touchable from "src/shared/components/general/touchable/Touchable"
import Icon from "src/shared/icons"
import { useNavigate } from "react-router-dom"
import TablesCards from "./components/TablesCards/TablesCards"
import DrawerNavigator from "./detail/drawer"
import { useEffect } from "react"
import { useRestaurantDarwer } from "./detail/hooks/drawer"
import useRestaurantAuth from "./detail/hooks/useRestaurantAuth"

function Restaurante(): JSX.Element {
    const navigate = useNavigate()
    const {setAuthValue} = useRestaurantAuth()

    const { onClose } = useRestaurantDarwer()
    useEffect(() => {
        return () => {
            onClose()
            setAuthValue(null)
        }
    }, [])

    return (
        <Screen
            title={"Restaurante"}
            contentClassName="restaurante-screen"
            headerRight={
                <div className="restaurante-screen__header">
                    <Button
                        type="button"
                        text="Estatus de órdenes"
                        theme={"secondary"}
                        className="restaurante-screen-btn"
                        onClick={() => navigate("/u/room-service/ordenes")}
                        icon="draft"
                    />
                    <Touchable
                        className="restaurante-screen__header__icon"
                        style={{
                            height: 40,
                            width: 48,
                            alignItems: "center",
                            justifyContent: "middle",
                        }}
                        onClick={() => navigate("/u/cocina")}
                    >
                        <Icon name="RecipeHistory" color="#0E0E0E" height={"20px"} width={"20px"} />
                    </Touchable>
                    <Touchable
                        className="restaurante-screen__header__time__icon"
                        style={{
                            height: 40,
                            width: 48,
                            alignItems: "center",
                            justifyContent: "middle",
                        }}
                        onClick={() => navigate("/u/room-service/historial")}
                    >
                        <Icon name="ExtraTimeIcon" color="#0E0E0E" height={"20px"} width={"20px"} />
                    </Touchable>
                </div>
            }
        >
            <TablesCards />
            <DrawerNavigator />
        </Screen>
    )
}

export default Restaurante
