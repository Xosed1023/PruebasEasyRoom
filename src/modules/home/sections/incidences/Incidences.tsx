import { useIncidenciasLazyQuery } from "@/gql/schema"
import SectionTitle from "../../../../components/core/layout/section-title/SectionTitle"
import IncidenceItem from "../../components/incidence-item/IncidenceItem"
import { getLimitDate } from "../occupation/helpers/getLimitDate"
import { useEffect, useState } from "react"
import { Incidencias } from "./incidences.type"

const Incidences = ({ hotel_id }: { hotel_id: string }) => {
    const [getIncidencias] = useIncidenciasLazyQuery()

    const getValue = (key: string, value: string, count: number) => (key === value ? count + 1 : count)
    const [incidencias, setIncidencias] = useState<Incidencias>({
        totalAbiertas: 0,
        abiertas: 0,
        cerradas: 0,
        matutino: 0,
        vespertino: 0,
        nocturno: 0,
        altas: 0,
        medias: 0,
        bajas: 0,
    })

    const fetchIncidencias = () => {
        getIncidencias({
            variables: {
                fecha_registro: null,
                hotel_id,
                turno_id: null,
            },
        })
            .then(({ data }) => {
                const list: any[] = data?.incidencias || []
                if (list.length > 0) {
                    const obj = {
                        totalAbiertas: 0,
                        abiertas: 0,
                        cerradas: 0,
                        matutino: 0,
                        vespertino: 0,
                        nocturno: 0,
                        altas: 0,
                        medias: 0,
                        bajas: 0,
                    }
                    list.forEach(({ estado = "", turno, severidad = "", fecha_registro = "" }) => {
                        const { max, min, current } = getLimitDate(fecha_registro)
                        if (current >= min && current <= max) {
                            obj.abiertas = getValue(estado, "activa", obj.abiertas)
                            obj.cerradas = getValue(estado, "cerrada", obj.cerradas)
                            obj.matutino = getValue(turno?.nombre, "Matutino", obj.matutino)
                            obj.vespertino = getValue(turno?.nombre, "Vespertino", obj.vespertino)
                            obj.nocturno = getValue(turno?.nombre, "Nocturno", obj.nocturno)
                        }

                        if (estado === "activa") {
                            obj.totalAbiertas = getValue(estado, "activa", obj.totalAbiertas)
                            obj.altas = getValue(severidad, "alta", obj.altas)
                            obj.medias = getValue(severidad, "media", obj.medias)
                            obj.bajas = getValue(severidad, "baja", obj.bajas)
                        }
                    })
                    setIncidencias(obj)
                }
            })
            .catch(console.log)
    }

    useEffect(() => {
        fetchIncidencias()
    }, [hotel_id])

    return (
        <>
            <SectionTitle title="Incidencias" />
            <div className="flex  gap-x-[20px]">
                <IncidenceItem
                    title="Del día"
                    counter={incidencias.abiertas}
                    subtitle="Activas"
                    items={[
                        { name: "Matutino", value: incidencias.matutino },
                        { name: "Vespertino", value: incidencias.vespertino },
                        { name: "Nocturno", value: incidencias.nocturno },
                    ]}
                />
                <IncidenceItem
                    title="Total"
                    counter={incidencias.totalAbiertas}
                    subtitle="Abiertas"
                    items={[
                        { name: "Altas", value: incidencias.altas },
                        { name: "Medias", value: incidencias.medias },
                        { name: "Bajas", value: incidencias.bajas },
                    ]}
                />
            </div>
        </>
    )
}

export default Incidences
