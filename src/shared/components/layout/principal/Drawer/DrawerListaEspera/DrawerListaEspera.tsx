import { useState } from "react"
import { EstadosTurnosAtencion, useGetTurnosAtencionQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import EstatusDeHabitaciones from "src/shared/widgets/estatusDeHabitaciones/EstatusDeHabitaciones"
import AuthRequiredModal from "src/pages/inventario/modals/Auth/AuthRequiredModal/AuthRequiredModal"
import { RoleNames } from "src/shared/hooks/useAuth"
import { Button } from "src/shared/components/forms"
import Empty from "src/shared/components/data-display/empty/Empty"
import Skeleton from "../../../skeleton/Skeleton"
import Icon from "src/shared/icons"
import Timer from "./components/Timer"
import { Turno } from "./DrawerListaEspera.types"
import RegistroTurnoModal from "./modals/Registro/Registro"
import EliminarTurnoModal from "./modals/Eliminar/Eliminar"
import LoaderComponent from "../../../loader/Loader"
import "./DrawerListaEspera.css"

const headers = ["Turno", "Nombre del huésped", "Tipo de habitación", "Tiempo de espera", "Creado por", ""]
const sizes = [30, 150, 95, 90, 60, 0]
const skeletonItems = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function ListaEsperaWidget() {
    const [visible, setVisible] = useState<boolean>(false)
    const [isAuthModalOpen, setisAuthModalOpen] = useState(false)
    const [turnoSelected, setTurno] = useState<{ visible: boolean; value: Turno }>({
        visible: false,
        value: { turno_atencion_id: "", folio_turno: "" },
    })
    const [loader, setLoader] = useState<boolean>(false)

    const { hotel_id } = useProfile()
    const {
        data: res,
        loading: load,
        refetch,
    } = useGetTurnosAtencionQuery({
        variables: { hotel_id, estado: [EstadosTurnosAtencion.EnCurso, EstadosTurnosAtencion.EnEspera] },
    })
    const data =
        res?.turnos_atencion?.sort(
            (a, b) => new Date(b?.fecha_registro).getTime() - new Date(a?.fecha_registro).getTime()
        ) || []

    const handleAdd = () => setVisible(true)
    const handleLoader = (v: boolean) => setLoader(v)

    return (
        <section className="drawerWidget__card-lista">
            <div className="widLista__title">{`Lista de espera${!load ? ` (${data.length})` : ""}`}</div>
            <div className="widLista__content">
                {load ? (
                    <div className="widLista__data-content">
                        <div className="widLista__row">
                            {sizes.map((width, index) => (
                                <div className="widLista__td widLista__th" key={index}>
                                    <Skeleton.Item style={{ width, height: 20 }} drawer={true} />
                                </div>
                            ))}
                        </div>
                        <div className="widLista__list-container">
                            {skeletonItems.map((i) => (
                                <Skeleton.Item className="widLista__td-skeleton" key={i} drawer={true} />
                            ))}
                        </div>
                    </div>
                ) : data.length > 0 ? (
                    <div className="widLista__data-content">
                        <Button
                            text={"Registrar turno"}
                            className="widLista__btn widLista__btn-float"
                            type={"button"}
                            theme={"secondary-gray"}
                            onClick={handleAdd}
                        />
                        <div className="widLista__row">
                            {headers.map((item, index) => (
                                <div className="widLista__td widLista__th" key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                        <div className="widLista__list-container">
                            {data.map((i, index) => (
                                <div key={index} className="widLista__row widLista__item">
                                    <div className="widLista__td">{i?.folio_turno || "-"}</div>
                                    <div className="widLista__td">{i?.nombre_o_matricula || "-"}</div>
                                    <div className="widLista__td">{i?.tipo_habitacion?.nombre || "-"}</div>
                                    <div className="widLista__td widLista__td-timer">
                                        <Timer date={i?.fecha_registro} />
                                    </div>
                                    <div className="widLista__td">{i?.colaborador?.nombre || "-"}</div>
                                    <div className="widLista__td">
                                        <Icon
                                            height={18}
                                            width={18}
                                            name={"trashFilled"}
                                            color={"var(--white)"}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setisAuthModalOpen(true)
                                                setTurno({
                                                    visible: false,
                                                    value: {
                                                        turno_atencion_id: i?.turno_atencion_id,
                                                        folio_turno: i?.folio_turno || "",
                                                    },
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="widLista__empty-container">
                        <Empty
                            className="widLista__empty"
                            theme={"dark"}
                            title={"Sin turnos en la lista de espera"}
                            description={
                                "Registra un turno a la lista de espera para la habitación que tu huésped desea."
                            }
                            icon={"docFill"}
                        />
                        <Button
                            text={"Registrar turno"}
                            className="widLista__btn"
                            type={"button"}
                            theme={"secondary-gray"}
                            onClick={handleAdd}
                        />
                    </div>
                )}
            </div>
            {visible && (
                <RegistroTurnoModal
                    onLoader={handleLoader}
                    onClose={() => setVisible(false)}
                    onConfirm={() => refetch()}
                />
            )}
            {loader && <LoaderComponent visible={true} />}
            {turnoSelected.visible && (
                <EliminarTurnoModal
                    value={turnoSelected.value}
                    onLoader={handleLoader}
                    onClose={() => setTurno({ value: { turno_atencion_id: "", folio_turno: "" }, visible: false })}
                    onConfirm={() => refetch()}
                />
            )}
            {isAuthModalOpen && (
                <AuthRequiredModal
                    isOpen={true}
                    onAuthFilled={(value, sampleData) => {
                        setTurno({ ...turnoSelected, visible: true })
                        setisAuthModalOpen(false)
                    }}
                    onClose={() => {
                        setisAuthModalOpen(false)
                        setTurno({ visible: false, value: { turno_atencion_id: "", folio_turno: "" } })
                    }}
                    authorizedRoles={[
                        RoleNames.superadmin,
                        RoleNames.admin,
                        RoleNames.gerente,
                        RoleNames.recepcionista,
                        RoleNames.valet,
                    ]}
                />
            )}
        </section>
    )
}

function DrawerListaEspera() {
    return (
        <div className="drawerWidget__main-gerente">
            <EstatusDeHabitaciones />
            <ListaEsperaWidget />
        </div>
    )
}

export default DrawerListaEspera
