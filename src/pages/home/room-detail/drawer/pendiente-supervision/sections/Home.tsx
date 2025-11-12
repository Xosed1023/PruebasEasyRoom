import { useMemo } from "react"
import DescriptionDetail from "src/shared/components/data-display/description-detail/DescriptionDetail"
import { HomeView } from "../../../sections/views/Views"
import { Block, PrimaryButton, SecondaryButton } from "../../../sections/elements/Elements"
import { formatTimeAgo } from "src/utils/timeago"
import { SectionProps } from "../../venta/index.type"
import { useRoom } from "../../../hooks"
import { useRoomDarwer } from "../../../hooks/darwer"
import { useCleaningTypes } from "../../../hooks/limpieza"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { toggleRoomDetailsDrawer } from "src/store/navigation/navigationSlice"
import IncidenciasItem from "../../../sections/items/Incidencias"
import DescriptionDetailList from "src/shared/components/data-display/DescriptionDetailList/DescriptionDetailList"
import { useProfile } from "src/shared/hooks/useProfile"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import { ItemTimer } from "../../../sections/items/Items"

const Home = ({ onNavigate }: SectionProps) => {
    const room = useRoom()
    const { visible } = useRoomDarwer()
    const cleanTypes = useCleaningTypes()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { rolName } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()

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
                link: rolName !== "MONITOREO" && rolName !== "MANTENIMIENTO" ? "Mantenimiento" : undefined,
                onLink:
                    rolName !== "MANTENIMIENTO"
                        ? validateIsColabActive(() => onNavigate("mantenance-reason"))
                        : undefined,
            },
        ]
    }, [room?.habitacion_id, visible])

    return (
        <HomeView title={room?.nombre} subtitle={"Pendiente de supervisión"}>
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
                    <ItemTimer
                        label="Tiempo pendiente de supervisión"
                        icon="Stopwatch"
                        dateTimer={room?.fecha_estado ?? undefined}
                    />
                    <IncidenciasItem />
                </Block>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "20px",
                    }}
                >
                    {rolName !== "MANTENIMIENTO" && rolName !== "MONITOREO" &&   (
                        <>
                            <PrimaryButton
                                text={"Supervisar limpieza"}
                                onClick={validateIsColabActive(() => onNavigate("supervisor-staff"))}
                            />
                            <SecondaryButton
                                text={"Liberar habitación"}
                                onClick={validateIsColabActive(() => {
                                    dispatch(toggleRoomDetailsDrawer(false))
                                    navigate(`/u/detalle-habitacion/liberar-pending-supervision/${room?.habitacion_id}`)
                                })}
                            />
                        </>
                    )}
                </div>
            </div>
            {InactiveModal}
        </HomeView>
    )
}

export default Home
