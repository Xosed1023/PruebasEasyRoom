import React, { useEffect, useState } from "react"

import "./PagoPropinas.css"
import Screen from "src/shared/components/layout/screen/Screen"
import PagoPropinasMain from "./sections/PagoPropinasMain/PagoPropinasMain"
import Resumen from "./sections/Resumen/Resumen"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import {
    ColaboradorToPayPropina,
    setColaboradoresToPayPropina,
    setFechasPagoPropinas,
    setMontoAcumulado,
    setTotalPagoPropinas,
    setLimiteDisponible,
} from "src/store/propinas/pagoPropinasSlice"
import ModalConfirmarPagoPropina from "./sections/ModalConfirmarPagoPropina/ModalConfirmarPagoPropina"
import { useCalcular_Pagos_PropinasQuery } from "src/gql/schema"
import { useProfile } from "src/shared/hooks/useProfile"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { useNavigate, useParams } from "react-router-dom"
import { useDate } from "src/shared/hooks/useDate"
import InfoButton from "./sections/buttons/InfoButton"
import { add } from "src/shared/helpers/calculator"
import ModalClose from "./modals/close"
import { useFormatDate } from "src/shared/hooks/useFormatDate"

const PagoPropinas = () => {
    const [modalClose, setModalClose] = useState<"close" | "back" | "">("")
    const { colaboradoresToPayPropinas, isModalConfirmarPagoPropinaOpen, montoAcumulado } = useSelector(
        (state: RootState) => state.propinas.pagoPropinas
    )
    const { localDateToUTCString } = useDate()
    const dispatch = useDispatch()
    const params = useParams()
    const { formatCustomDate } = useFormatDate()
    const navigate = useNavigate()

    useEffect(() => {
        const dates = params?.date?.split("&") || []
        dispatch(setFechasPagoPropinas(dates?.map((item) => localDateToUTCString(new Date(item)))))
    }, [params?.date])

    const { hotel_id } = useProfile()

    const { data, loading } = useCalcular_Pagos_PropinasQuery({
        variables: {
            hotel_id,
        },
    })

    const dispatchStore = (reparto_propinas: any[], monto_recaudado = 0, limite_disponible = 0) => {
        const formattedColaboradores: ColaboradorToPayPropina[] =
            reparto_propinas?.map((pp) => ({
                porVentas: pp?.propina_por_ventas || 0,
                fondo: pp?.fondo_de_propinas || 0,
                comision: pp?.comision_bancaria_sobre_fondo || 0,
                comisionPorVentas: pp?.comision_bancaria_sobre_fondo || 0,
                pago: add(pp?.pago_correspondiente || 0, 0),
                photoUrl: pp.colaborador?.foto || "",
                name: `${pp.colaborador?.nombre} ${pp.colaborador?.apellido_paterno} ${pp.colaborador?.apellido_materno}`,
                id: pp.colaborador?.colaborador_id || "",
                rolName: pp.colaborador?.puesto?.nombre || "",
                selected: false,
                montoAPagar: 0,
                puesto_id: pp.colaborador?.puesto?.puesto_id || "",
                asignacion_propina_id: pp?.asignacion_propina_id || "",
                asignacion_propina: pp?.asignacion_propina,
            })) || []

        dispatch(setLimiteDisponible(add(limite_disponible, 0)))
        dispatch(setColaboradoresToPayPropina(formattedColaboradores))
        dispatch(setMontoAcumulado(add(monto_recaudado, 0)))
    }

    useEffect(() => {
        dispatchStore(
            data?.calcular_reparto_propinas?.reparto_propinas || [],
            data?.calcular_reparto_propinas?.monto_recaudado || 0,
            data?.calcular_reparto_propinas?.limite_disponible || 0
        )
    }, [data])

    return (
        <Screen
            className="pago-propinas__screen"
            title={`Pago de propinas - ${params?.date
                ?.split("&")
                ?.map((cur) => formatCustomDate(cur.substring(0, 10), "MMM, DD YYYY"))
                .join(" ")}`}
            back
            close
            onClose={() => setModalClose("close")}
            onBack={() => setModalClose("back")}
            headerRight={<InfoButton />}
        >
            <div className="pago-propinas__wrapper">
                <PagoPropinasMain
                    colaboradores={colaboradoresToPayPropinas}
                    montoAcumulado={montoAcumulado || 0}
                    onChangeAjuste={dispatchStore}
                    repartoPropinas={data?.calcular_reparto_propinas?.reparto_propinas || []}
                />
                <Resumen colaboradores={colaboradoresToPayPropinas.filter((cpp) => cpp.selected)} />
            </div>
            {isModalConfirmarPagoPropinaOpen && <ModalConfirmarPagoPropina />}
            <ModalClose
                visible={!!modalClose}
                onClose={() => setModalClose("")}
                onConfirm={() => {
                    setModalClose("")
                    dispatch(setTotalPagoPropinas(0))
                    dispatch(setMontoAcumulado(0))
                    if (modalClose === "close") {
                        navigate("/u")
                    } else {
                        navigate(-1)
                    }
                }}
            />
            <LoaderComponent visible={loading} />
        </Screen>
    )
}

export default PagoPropinas
