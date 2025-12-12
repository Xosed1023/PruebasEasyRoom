import { memo } from "react"
import { AreasName } from "src/pages/personal/inicio.constants"
import Switch from "src/shared/components/forms/switch/Switch"

const Picture = memo(({ foto = "" }: any) => (
    <div className="tabla-personal__cell-name__foto">
        <img src={foto || require("src/assets/webp/profile_default.webp")} height={"100%"} width={"100%"} alt="foto" />
    </div>
))

export function CellName({ foto = "", name = "" }): JSX.Element {
    return (
        <div className="tabla-personal__cell-name">
            <Picture foto={foto} />
            <p className="tabla-personal__cell-name__label">{name}</p>
        </div>
    )
}

export function CellDetail({ room = "", date = "" }): JSX.Element {
    return (
        <div className="tabla-personal__cell-detail">
            <span>{room}</span>
            {date && <span>{date}</span>}
        </div>
    )
}

export function CellUltimoTurno({ ultimo_turno = "", date = "" }): JSX.Element {
    return (
        <div className="tabla-personal__cell-detail">
            <span>{ultimo_turno}</span>
            {date && <span>{date}</span>}
        </div>
    )
}

export function CellPuesto({ puesto = "", es_supervisor }): JSX.Element {
    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{puesto}</span>
            {es_supervisor && puesto !== "Supervisor" ? <span>{"Supervisor"}</span> : null}
        </div>
    )
}

export const CellSelector = ({
    path,
    value,
    index,
    onChange,
    loadId,
}: {
    path: AreasName
    value: any
    index: number
    onChange: (v: boolean) => void
    loadId: string
}) => {
    
    if (path === "Recepción") {
        switch (index) {
            case 0:
                return <CellName {...value} />
            case 1:
                return <CellPuesto {...value} />
            case 2:
                return <CellUltimoTurno {...value} />
            case 3:
                return (
                    <Switch
                        enabled={!loadId}
                        disabled={value?.colaborador_id === loadId}
                        value={value?.en_turno}
                        onClick={(e) => e.stopPropagation()}
                        onChange={onChange}
                    />
                )
            default:
                return value
        }
    }
    if (path === "Hospedaje") {
        switch (index) {
            case 0:
                return <CellName {...value} />
            case 1:
                return <CellPuesto {...value} />
            case 4:
                return <CellUltimoTurno {...value} />
            case 5:
                return <CellDetail {...value} />
            case 6:
                return (
                    <Switch
                        enabled={!loadId}
                        disabled={value?.colaborador_id === loadId}
                        value={value?.en_turno}
                        onClick={(e) => e.stopPropagation()}
                        onChange={onChange}
                    />
                )
            default:
                return value
        }
    }
    if (path === "Alimentos y Bebidas") {
        switch (index) {
            case 0:
                return <CellName {...value} />
            case 1:
                return <CellPuesto {...value} />
            case 3:
                return <CellUltimoTurno {...value} />
            case 4:
                return <CellDetail {...value} />
            case 5:
                return (
                    <Switch
                        enabled={!loadId}
                        disabled={value?.colaborador_id === loadId}
                        value={value?.en_turno}
                        onClick={(e) => e.stopPropagation()}
                        onChange={onChange}
                    />
                )
            default:
                return value
        }
    }
    return value
}
