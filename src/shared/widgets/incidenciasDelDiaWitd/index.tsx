import { useState } from "react"
import cx from "classnames"
import IncidenciasDelDiaWitd from "./IncidenciasDelDiaWitd"
import "./IncidenciasDelDiaWitd.css"

type Page = "day" | "total"

type IncidenciasCardProps = {
    totalAbiertas: number
    abiertas: number
    cerradas: number
    matutino: number
    vespertino: number
    nocturno: number
    altas: number
    medias: number
    bajas: number
}

const options: Page[] = ["day", "total"]

function IncidenciasCard({
    totalAbiertas = 0,
    abiertas = 0,
    cerradas = 0,
    matutino = 0,
    vespertino = 0,
    nocturno = 0,
    altas = 0,
    medias = 0,
    bajas = 0,
}: IncidenciasCardProps): JSX.Element {
    const [page, setPage] = useState<Page>("day")
    const dayMenu = [
        { label: "Matutino", value: matutino },
        { label: "Vespertino", value: vespertino },
        { label: "Nocturno", value: nocturno },
    ]

    const totalMenu = [
        { label: "Altas", value: altas },
        { label: "Medias", value: medias },
        { label: "Bajas", value: bajas },
    ]

    return (
        <div className="incidenciasDelDiaWitd">
            <IncidenciasDelDiaWitd
                abiertas={page === "day" ? abiertas : totalAbiertas}
                cerradas={page === "day" ? cerradas : undefined}
                title={page === "day" ? "Incidencias del día" : "Total de incidencias"}
                menu={page === "day" ? dayMenu : totalMenu}
            />
            <div className="incidenciasDelDiaWitd__tab">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className={cx(
                            "incidenciasDelDiaWitd__tab-item",
                            option === page ? "incidenciasDelDiaWitd__tab-item--active" : ""
                        )}
                        onClick={() => setPage(option)}
                    ></div>
                ))}
            </div>
        </div>
    )
}

export default IncidenciasCard
