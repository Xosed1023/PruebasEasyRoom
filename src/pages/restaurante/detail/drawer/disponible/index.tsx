import { useState, useEffect } from "react"
import { useRestaurantDarwer } from "../../hooks/drawer"
import DrawerWrapper from "../../sections/DrawerWrapper"
import Personal from "./sections/Personal"
import Home from "./sections/Principal"

function Disponible(): JSX.Element {
    const [section, setSection] = useState<string>("home")
    const { visible } = useRestaurantDarwer()

    useEffect(() => {
        if (visible && section !== "home") setSection("home")
    }, [visible])

    const handleNavigate = (value: string) => setSection(value)

    return (
        <>
            <DrawerWrapper
                withMenu={false}
                withBackButton={section !== "home"}
                onBack={() => setSection("home")}
                itemsMenu={[]}
            >
                {section === "home" ? (
                    <Home onNavigate={handleNavigate} />
                ) : section === "personal" ? (
                    <Personal />
                ) : null}
            </DrawerWrapper>
        </>
    )
}
export default Disponible
