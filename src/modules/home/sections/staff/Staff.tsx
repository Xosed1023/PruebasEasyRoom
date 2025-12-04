import Card from "../../components/card/Card"
import SectionTitle from "../../../../components/core/layout/section-title/SectionTitle"
import StaffItem from "../../components/staff-item/StaffItem"
import UserFill from "@/icons/UserFill"
import Check from "@/icons/Check"
import { Badge } from "@/components/ui/Badge/Badge"
import styles from "./Staff.module.css"
import StaffList from "../../components/staff-list/StaffList"
import { useHotel_ColaboradoresLazyQuery } from "@/gql/schema"
import { useEffect, useState } from "react"
import { add } from "@/helpers/calculator"
import { Colab } from "./Staff.type"

const Staff = ({hotel_id}: {hotel_id: string}) => {

    const [getColaboradores] = useHotel_ColaboradoresLazyQuery()
    const [colabs, setcolabs] = useState<{asignados: Colab[], disponibles: Colab[]}>({
        asignados: [],
        disponibles: []
    })

    const formatColaboradores = (colabs: any[]) => {
        const array = Object.values(colabs).flat(1)

        return {
            asignados: array.filter(({ disponible }) => !disponible),
            disponibles: array.filter(({ disponible }) => disponible),
        }
    }

    const fetchColaboradores = async () => {
        try {
            const { data } = await getColaboradores({
                variables: {
                    hotel_id,
                },
            })
            const list: any[] = Array.isArray(data?.colaboradores) ? data?.colaboradores : []
            let clear: Colab[] = []
            if (list.length > 0) {
                clear = list.map((colaborador): Colab => {
                    const item = colaborador?.ultima_tarea
                    const isMesero = colaborador?.puesto?.nombre === "Mesero"

                    const disponible = isMesero
                        ? !colaborador?.mesa_asignada_activa?.has_mesa_activa
                        : item
                        ? !!item?.fecha_termino
                        : true

                    return {
                        name: `${colaborador?.nombre} ${colaborador?.apellido_paterno}`,
                        image: colaborador?.foto || "/webp/profile_default.webp",
                        disponible,
                        puesto: colaborador.puesto.nombre
                    }
                })
                setcolabs(formatColaboradores(clear))
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchColaboradores()
    }, [hotel_id])

    return (
        <StaffList colabs={colabs}>
            <SectionTitle title="Personal en turno">
                <Badge className={styles["staff__badge"]}>{add(colabs.asignados.length, colabs.disponibles.length)}</Badge>
            </SectionTitle>
            <Card className="flex flex-col gap-y-[20px]  mt-[20px]">
                <StaffItem
                    avatars={colabs.asignados.map(c => c.image)}
                    bgIconColor="var(--primary)"
                    title="Asignado"
                    icon={<UserFill width={16} height={16} color="var(--white)" />}
                />
                <StaffItem
                    title="Disponible"
                    avatars={colabs.disponibles.map(c => c.image)}
                    bgIconColor="var(--disponible)"
                    icon={<Check width={16} height={16} color="var(--white)" />}
                />
            </Card>
        </StaffList>
    )
}

export default Staff
