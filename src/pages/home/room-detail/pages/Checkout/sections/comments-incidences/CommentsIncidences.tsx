import React, { useState } from "react"
import "./CommentsIncidences.css"
import Comment from "./sections/comment/Comment"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import Empty from "src/shared/components/data-display/empty/Empty"

import { v4 as uuid } from "uuid"
import { formatShortDate } from "src/shared/helpers/formatShortDate"
import { useDate } from "src/shared/hooks/useDate"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { DrawerSection } from "src/pages/incidencias//sections/drawer/Drawer"
import { toggleDrawer } from "src/store/navigation/navigationSlice"

const CommentsIncidences = ({
    comentarios,
    incidencias,
}: {
    comentarios: any[]
    habitacionId: string
    incidencias: any[]
}) => {
    const dispatch = useDispatch()
    const { isDrawerOpen } = useSelector((state: RootState) => state.navigation)

    const toggleDrawerState = (value: boolean) => {
        dispatch(toggleDrawer(value))
    }

    const { UTCStringToLocalDate } = useDate()
    const [incidenciaSelected, setIncidenciaSelected] = useState<string>("")

    return (
        <div style={{ width: "100%" }}>
            <div className="room-detail__page--checkout-comments-header">
                <span className="room-detail__page--checkout-comments-title">Comentarios</span>
                <div className="room-detail__page--checkout-comments__divider"></div>
            </div>
            {!comentarios?.length ? (
                <div className="room-detail__page--checkout-comments--empty">
                    <Empty icon="communication" title="Sin comentarios" />
                </div>
            ) : (
                <div className="room-detail__page--checkout-comments">
                    {comentarios?.map((comentario) => (
                        <Comment comentario={comentario.comentario} date={comentario.fecha} key={uuid()} />
                    ))}
                </div>
            )}
            <div className="room-detail__page--checkout-comments-header">
                <span className="room-detail__page--checkout-comments-title">Incidencias</span>
                <div className="room-detail__page--checkout-comments__divider"></div>
            </div>
            {!incidencias?.length ? (
                <div className="room-detail__page--checkout-comments--empty">
                    <Empty icon="alertFill" title="Sin incidencias" />
                </div>
            ) : (
                <div className="room-detail__page--checkout-incidences">
                    <FlexibleTable
                        sticky={true}
                        tableItems={{
                            headers: [
                                {
                                    value: "Folio",
                                },
                                {
                                    value: "Registro",
                                },
                                {
                                    value: "Estatus",
                                },
                                {
                                    value: "Reportó",
                                },
                                {
                                    value: "Descripción",
                                },
                                {
                                    value: "Detalle",
                                },
                            ],
                            rows:
                                incidencias?.map((incidencia) => ({
                                    value: [
                                        { value: <>{incidencia.folio}</> },
                                        {
                                            value: (
                                                <>{formatShortDate(UTCStringToLocalDate(incidencia?.fecha_registro))}</>
                                            ),
                                        },
                                        { value: <>{incidencia.estado === "activa" ? "abierta" : "cerrada"}</> },
                                        {
                                            value: (
                                                <>{`${incidencia.colaborador_reporta.nombre} ${incidencia.colaborador_reporta.apellido_paterno} ${incidencia.colaborador_reporta.apellido_materno}`}</>
                                            ),
                                        },
                                        { value: <>{incidencia.detalle}</> },
                                        {
                                            value: (
                                                <p
                                                    className="room-detail__page--checkout-comments-link"
                                                    onClick={() => {
                                                        setIncidenciaSelected(incidencia?.incidencia_id)
                                                        toggleDrawerState(true)
                                                    }}
                                                >
                                                    Ver detalle
                                                </p>
                                            ),
                                        },
                                    ],
                                })) || [],
                        }}
                    />
                    {incidenciaSelected && (
                        <DrawerSection
                            incidenciaId={incidenciaSelected}
                            visible={isDrawerOpen}
                            onClose={() => toggleDrawerState(false)}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default CommentsIncidences
