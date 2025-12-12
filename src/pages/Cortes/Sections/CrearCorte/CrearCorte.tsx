import { useEffect, useState } from "react"
import "./CrearCorte.css"
import Screen from "src/shared/components/layout/screen/Screen"
import { useNavigate } from "react-router-dom"
import Icon from "src/shared/icons"
import { useFormatDate } from "src/shared/hooks/useFormatDate"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { incidenciasTable } from "../../cortes.data"
import { Button } from "src/shared/components/forms"
import CerrarIncidencia from "../../Components/Modals/CerrarIncidencia/CerrarIncidencia"
import { TableSkeleton } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { IncidenciaRow } from "src/pages/incidencias/Incidencia.types"
import { capitalizeString } from "src/shared/hooks/capitalizeString"
import { useDispatch } from "react-redux"
import { setIncidencias } from "src/store/cortes/cortesSlice"

type CrearCorteProps = {
    incidencias: any[]
    onRefresh: () => void
    onConfirm: () => void
    turno: string
}

const CrearCorte = ({ incidencias = [], onRefresh, onConfirm, turno = "" }: CrearCorteProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { formatCustomDate } = useFormatDate()

    const [visible, setVisible] = useState(false)
    const [updIncidencia, setUpdIncidencias] = useState<any>(null)
    const [rowsIncidencias, setRowsIncidencias] = useState<IncidenciaRow[]>([])

    const [load, setLoad] = useState(true)

    useEffect(() => {
        if (incidencias?.length > 0) {
            buildTable(incidencias)
            setLoad(false)
        } else {
            buildTable(incidencias)
            setLoad(false)
        }
    }, [incidencias])

    function buildTable(data) {
        const array: IncidenciaRow[] = []
        data?.map((incidencia) => {
            array.push({
                goTo: incidencia.incidencia_id,
                value: [
                    { value: incidencia.folio },
                    { value: capitalizeString(incidencia.estado) },
                    { value: incidencia.detalle },
                    { value: capitalizeString(incidencia.severidad) },
                    { value: capitalizeString(incidencia.area) },
                    { value: incidencia.habitacion?.numero_habitacion || "N/A" },
                    { value: incidencia.estado === "activa" ? incidencia.incidencia_id : "" },
                ],
            })
        })
        setRowsIncidencias(array)
    }

    useEffect(() => {
        if (rowsIncidencias?.length > 0) {
            dispatch(setIncidencias(rowsIncidencias?.length))
        }
    }, [rowsIncidencias])

    return (
        <Screen title={""} close={true} onClose={() => navigate(-1)}>
            <section className="corte-turno animante__select">
                <div className="corte-turno__header">
                    <h2 className="corte-turno__tittle">Corte de turno con incidencias abiertas</h2>
                    <div className="corte-turno__subTitle">
                        <div className="corte-turno__subTitle__item">
                            <Icon color="var(--header)" name="calendarFill" style={{ marginRight: "10px" }} />{" "}
                            {formatCustomDate(new Date(), "MMM DD, YYYY")}{" "}
                        </div>
                        <div className="corte-turno__subTitle__item">
                            <Icon color="var(--header)" name="timerFill" style={{ marginRight: "10px" }} />{" "}
                            {`Turno ${turno}`}
                        </div>
                    </div>
                </div>
                <div className="corte-turno__body">
                    <div className="corte-turno__title-table">Incidencias abiertas</div>
                    <div className="corte-turno__table screen__table ">
                        {!load ? (
                            <FlexibleTable
                                style={{ overflow: "auto", height: "60%" }}
                                tableItems={{
                                    ...{
                                        headers: incidenciasTable.headers,
                                        rows: rowsIncidencias.map((row) => ({
                                            value: row.value.map(({ value }, index, arr) => ({
                                                value:
                                                    index === arr.length - 1 ? (
                                                        <div
                                                            className="crear-corte-table-link"
                                                            onClick={() => {
                                                                setUpdIncidencias(
                                                                    incidencias.find(
                                                                        ({ incidencia_id }) => incidencia_id === value
                                                                    )
                                                                )
                                                                setVisible(true)
                                                            }}
                                                        >
                                                            {value ? "Cerrar incidencia" : ""}
                                                        </div>
                                                    ) : (
                                                        value
                                                    ),
                                            })),
                                        })),
                                    },
                                }}
                            ></FlexibleTable>
                        ) : (
                            <TableSkeleton headers={incidenciasTable.headers} />
                        )}
                    </div>
                    <div
                        onClick={() => navigate("/u/cortes/crear-incidencia")}
                        className="card-content-line-edit-subcategoria"
                    >
                        <Icon color="var(--primary)" name={"plusCircle"} />
                        Agregar incidencia
                    </div>
                    <div className="crear-corte-button-container">
                        <Button
                            text="Hacer corte con incidencias abiertas"
                            className="crear-corte-button"
                            onClick={onConfirm}
                        />
                    </div>
                </div>
            </section>
            <CerrarIncidencia
                incident={updIncidencia}
                visible={visible}
                onClose={() => setVisible(false)}
                onConfirm={onRefresh}
            />
        </Screen>
    )
}

export default CrearCorte
