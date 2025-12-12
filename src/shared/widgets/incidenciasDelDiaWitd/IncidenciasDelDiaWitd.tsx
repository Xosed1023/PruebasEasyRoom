import "./IncidenciasDelDiaWitd.css"

interface IncidenciasDelDiaWitdProps {
    abiertas: number
    cerradas?: number
    menu?: {
        label: string
        value: number
    }[]
    title?: string
}

const IncidenciasDelDiaWitd = ({ abiertas = 0, cerradas, menu = [], title = "" }: IncidenciasDelDiaWitdProps) => {
    return (
        <div className="incidenciasDelDiaWitd__content">
            <div className="incidenciasDelDiaWitd__title">{title}</div>
            <div className="incidenciasDelDiaWitd__info">
                <div className="incidenciasDelDiaWitd__info__box">
                    <div
                        className="incidenciasDelDiaWitd__info__box__number"
                        style={{
                            color: "#ffc907",
                        }}
                    >
                        {abiertas}
                    </div>
                    <div className="incidenciasDelDiaWitd__info__subtitle">{"Activas"}</div>
                </div>
                {cerradas !== undefined && (
                    <div className="incidenciasDelDiaWitd__info__box">
                        <div className="incidenciasDelDiaWitd__info__box__number" style={{ color: "#408232" }}>
                            {cerradas}
                        </div>
                        <div className="incidenciasDelDiaWitd__info__subtitle">Cerradas</div>
                    </div>
                )}
            </div>
            <hr className="lineDivicion" />
            <div className="incidenciasDelDiaWitd__infotable">
                {menu.map(({ label = "", value = 0 }, index) => (
                    <div className="incidenciasDelDiaWitd__row" key={index}>
                        <div className="incidenciasDelDiaWitd__infotable__l">{label}</div>
                        <div className="incidenciasDelDiaWitd__infotable__r">{value}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IncidenciasDelDiaWitd
