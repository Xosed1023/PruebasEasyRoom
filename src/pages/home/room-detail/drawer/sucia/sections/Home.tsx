import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../sections/views/Views"
import { ItemTimer, ItemLastOccupation } from "../../../sections/items/Items"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../general/index.type"
import { useRoom } from "../../../hooks"
import { useRoomDarwer } from "../../../hooks/darwer"
import { useCleaningTypes } from "../../../hooks/limpieza"
import IncidenciasItem from "../../../sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { RoleNames } from "src/shared/hooks/useAuth"

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const navigate = useNavigate()
    const { visible } = useRoomDarwer()
    const cleanTypes = useCleaningTypes()
    const { rolName } = useProfile()
    const {InactiveModal, validateIsColabActive} = useIsColaboradorActive()

    const getCleanType = () => {
        const tipoLimpieza = room?.ultimos_datos?.ultima_limpieza?.[0]?.tipo_limpieza
        return cleanTypes.find(({ value }) => value === tipoLimpieza)
    }

    const data = useMemo(() => {
        const mant = room?.ultimos_datos?.ultimo_mantenimiento
        const colabMant = mant?.colaborador

        return [
            {
                icon: "businessStar",
                label: "Tipo de limpieza",
                value: getCleanType()?.label || "-",
            },
            {
                icon: "tools",
                label: "Último mantenimiento",
                value: `${
                    mant
                        ? colabMant
                            ? `${colabMant?.nombre} ${colabMant?.apellido_paterno} ${colabMant?.apellido_materno}`
                            : "Sin colaborador asignado"
                        : "-"
                }`,
                date: `${mant?.fecha_termino ? formatTimeAgo(mant?.fecha_termino) : "-"}`,
                ...(rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && {
                    link: "Mantenimiento",
                    onLink: () => onNavigate("mantenance-reason"),
                }),
            },
        ]
    }, [room?.habitacion_id, visible, rolName])

    return (
        <HomeView title={room?.nombre}>
            <div
                style={{
                    height: "calc(100% - 77px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Block style={{ rowGap: 24 }} list>
                    {!!room?.ultimos_datos?.ultima_limpieza.length && (
                        <DescriptionDetailList
                            iconName="broom"
                            title="Última limpieza"
                            subtitle={formatTimeAgo(room?.ultimos_datos?.ultima_limpieza?.[0]?.fecha_termino)}
                            values={room?.ultimos_datos?.ultima_limpieza?.map(
                                (c) =>
                                    `${c.colaborador?.nombre} ${c.colaborador?.apellido_paterno} ${c.colaborador?.apellido_materno}`
                            )}
                        />
                    )}
                    {data.map((item, index) => (
                        <DescriptionDetail key={index} {...item} />
                    ))}
                    <ItemLastOccupation value={room?.renta_pasada?.fecha_salida} />
                    <ItemTimer label="Tiempo Sucia" icon="Stopwatch" dateTimer={room?.fecha_estado || ""} />
                    {!!room?.ultimos_datos?.ultima_limpieza.length && (() => {
                        const ultimaLimpieza = room.ultimos_datos.ultima_limpieza.reduce((a, b) =>
                            new Date(a.fecha_termino) > new Date(b.fecha_termino) ? a : b
                        )
                        const ultimoComentario = ultimaLimpieza.comentarios?.length
                            ? ultimaLimpieza.comentarios.at(-1).comentario.trim() || "-"
                            : "-"
                        return (
                            <DescriptionDetailList
                                iconName="communication"
                                title="Comentarios"
                                subtitle=""
                                values={[ultimoComentario]}
                            />
                        )
                    })()}
                    <IncidenciasItem />
                </Block>

                {rolName !== RoleNames.mantenimiento && rolName !== RoleNames.monitoreo && (
                    <div>
                        <PrimaryButton
                            text={"Limpiar habitación"}
                            style={{ marginBottom: 12 }}
                            onClick={() => onNavigate("clean-staff")}
                        />
                        <SecondaryButton
                            text={"Liberar habitación"}
                            onClick={validateIsColabActive(() => {
                                navigate(`/u/detalle-habitacion/liberar-sucia/${room?.habitacion_id}`)
                            })}
                        />
                    </div>
                )}
            </div>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
