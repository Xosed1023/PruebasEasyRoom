import React from "react"
import CardUser from "src/shared/components/data-display/cart-user/CartUser"
import Icon from "src/shared/icons"
import "./PersonalActivoWidget.css"

interface PersonalActivoEnTUrnoWitProps {
    mantenimiento?: {
        name: string
        image: string
        description: string
        disponible: boolean
    }[]
    camarista?: {
        name: string
        image: string
        description: string
        disponible: boolean
    }[]
    meseros: any[]
}

const camaristaLIst = (camarista: any[]) => {
    return camarista.length > 0 ? (
        <div className="personalActivoWit__list">
            {camarista.map((user, i) => (
                <CardUser
                    className="personalActivoWit__list__item"
                    textColor="#fff"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.10",
                        borderRadius: "10px",
                        padding: "6px 10px",
                    }}
                    key={user.name + i}
                    name={user.name}
                    picture={user.image}
                    description={user.description}
                    size={"lg"}
                    status={user.disponible ? "online" : "clean"}
                />
            ))}
        </div>
    ) : (
        <NotData />
    )
}

const mantenimientoList = (mantenimiento: any[]) => {
    return mantenimiento.length > 0 ? (
        <div className="personalActivoWit__list">
            {mantenimiento.map((user, i) => (
                <CardUser
                    className="personalActivoWit__list__item"
                    textColor="#fff"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.10",
                        borderRadius: "10px",
                        padding: "6px 10px",
                    }}
                    key={user.name + i}
                    name={user.name}
                    picture={user.image}
                    description={user.description}
                    size={"lg"}
                    status={user.disponible ? "online" : "maintenance"}
                />
            ))}
        </div>
    ) : (
        <NotData />
    )
}

const meserosList = (meseros: any[]) => {
    return meseros.length > 0 ? (
        <div className="personalActivoWit__list">
            {meseros.map((user, i) => (
                <CardUser
                    className="personalActivoWit__list__item"
                    textColor="#fff"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.10",
                        borderRadius: "10px",
                        padding: "6px 10px",
                    }}
                    key={user.name + i}
                    name={user.name}
                    picture={user.image}
                    description={user?.descripcion_mesero}
                    size={"lg"}
                    status={user.disponible ? "online" : "orden"}
                />
            ))}
        </div>
    ) : (
        <NotData />
    )
}

const PersonalActivoWidget = ({ mantenimiento = [], camarista = [], meseros = [] }: PersonalActivoEnTUrnoWitProps) => {
    const [stateTab, setStateTab] = React.useState("Camarista")

    const tabs = [
        {
            label: `Camaristas  (${camarista.length})`,
            value: "Camarista",
        },
        {
            label: `Meseros (${meseros.length})`,
            value: "Mesero",
        },
        {
            label: `Mantenimiento (${mantenimiento.length})`,
            value: "Mantenimiento",
        },
    ]

    return (
        <div className="personalActivoWit">
            <div className="personalActivoWit__title">Personal activo en turno</div>
            <div className="personalActivoWit__tabs">
                {tabs.map(({ label = "", value = "" }, index) => (
                    <div
                        key={index}
                        className={`personalActivoWit__tabs__item ${stateTab === value ? "select" : ""}`}
                        onClick={() => setStateTab(value)}
                    >
                        {label}
                    </div>
                ))}
            </div>
            {stateTab === "Camarista"
                ? camaristaLIst(camarista)
                : stateTab === "Mesero"
                ? meserosList(meseros)
                : mantenimientoList(mantenimiento)}
        </div>
    )
}

const NotData = () => {
    return (
        <div className="personalActivoWit__notData">
            <div className="personalActivoWit__notData__icon">
                <Icon name={"accountBoxFill"} height={"96px"} width={"96px"} color="#fff" />
            </div>
            <div className="personalActivoWit__notData__subtitles">No hay personal activo en turno</div>
        </div>
    )
}

export default PersonalActivoWidget
