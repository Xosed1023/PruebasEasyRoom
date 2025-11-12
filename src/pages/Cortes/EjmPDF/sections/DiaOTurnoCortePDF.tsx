//import axios from "axios"
import { useProfile } from "src/shared/hooks/useProfile"
import { useFetch } from "../../../../shared/hooks/useFetch"
import { useEffect } from "react"
import { PDFViewer, Document, Page, Text, View, Image } from "@react-pdf/renderer"
import LoaderComponent from "src/shared/components/layout/loader/Loader"
import { styles } from "../components/TicketCaratula/TicketCaratulaStyles"
import Footer from "../components/TicketCaratula/sections/footer/Footer"
import { Meses } from "../components/TicketDiaCorte/ticketDiaCorte.data"
import { useGetTurnosQuery } from "src/gql/schema"
import Tarifas from "../components/TicketDiaCorte/sections/Tarifas"
import RoomService from "../components/TicketDiaCorte/sections/RoomService"
import Ingresos from "../components/TicketDiaCorte/sections/Ingresos"
import Efectivo from "../components/TicketDiaCorte/sections/Efectivo"
import Gastos from "../components/TicketDiaCorte/sections/Gastos"
import Totales from "../components/TicketDiaCorte/sections/Totales"
import Cards from "../components/TicketDiaCorte/sections/Inventario/Cards"
import Salidas from "../components/TicketDiaCorte/sections/Inventario/Salidas"
import { useQuery } from "@apollo/client"
import { GET_ALMACEN } from "../components/TicketDiaCorte/sections/Inventario/queryAlmacen"
import Descuentos from "../components/TicketDiaCorte/sections/Descuentos"
import Cancelaciones from "../components/TicketDiaCorte/sections/Cancelaciones"
//import Incidencias from "../components/TicketDiaCorte/sections/Incidencias"
import AnticiposValidos from "../components/TicketDiaCorte/sections/AnticiposValidos"
import useDiaCorteRouteState from "./hooks/useDiaCorteRouteState"
import useGetCorteById from "./hooks/useGetCorteById"
import useDateCorte from "./hooks/useDateCorte"
import { InventarioResponse } from "../components/TicketDiaCorte/sections/Inventario/interfaces"
import FormatUTCDateToApiDate from "./helpers/FormatUTCDateToApiDate"
import Restaurante from "../components/TicketDiaCorte/sections/Restaurante"
import { ReportePropinasPage, useReportePropinasData } from "src/pages/propinas/pago-propinas/pdf/reporte"
import { useDate } from "src/shared/hooks/useDate"
import { ICortes } from "./interfaces/cortes-pdf"
import Propinas from "../components/TicketDiaCorte/sections/Propinas"

function DiaOTurnoCortePDF(): JSX.Element {
    const { hotel_id, turno_hotel_id, logo_hotel, nombre_hotel } = useProfile()
    const { UTCStringToLocalDate } = useDate()

    const { diaCorteState } = useDiaCorteRouteState()

    const { fecha_corte_inicio, fecha_corte_fin, fechas_corte } = useDateCorte()

    const { data: turnos } = useGetTurnosQuery({
        variables: {
            hotel_id,
        },
    })

    const { data: almacen } = useQuery(GET_ALMACEN, {
        variables: {
            hotel_id,
        },
    })

    const {
        data: cortes_pdf,
        load: loadCorte,
        refetch: refetchCaratula,
    } = useFetch<ICortes>("/cortes/cortes_pdf", {
        defaultValue: null,
        startFetch: false,
    })

    const { data: inventario, refetch: refetchInventario } = useFetch<InventarioResponse | undefined>(
        "/cortes/reporte_inventario_cards",
        {
            defaultValue: null,
            startFetch: false,
        }
    )

    const { corte, fechasCorte } = useGetCorteById({
        corte_id: diaCorteState.typeofValue === "id" ? diaCorteState.value : undefined,
    })

    const {
        data: resumen_pagos,
        load,
        refetch: refetchResumenPagos,
    } = useFetch("/cortes/resumen_pagos", {
        defaultValue: [],
        startFetch: false,
    })

    const reportePropinas = useReportePropinasData({
        fecha_inicio: FormatUTCDateToApiDate(fechasCorte?.inicio || "", true),
        fecha_fin: FormatUTCDateToApiDate(fechasCorte?.fin || "", true),
        corte_id: corte?.corte?.corte_id || diaCorteState.value
    })

    useEffect(() => {
        if(!(diaCorteState.typeofValue === "id" && fechasCorte) && !(diaCorteState.typeofValue === "date")) {
            return
        }
        refetchCaratula({
            hotel_id: hotel_id,
            ...(diaCorteState.typeofValue === "id"
                ? {
                    fecha_inicio: fechasCorte?.inicio,
                    fecha_fin: fechasCorte?.fin,
                }
                : {
                    fecha_corte_inicio,
                    fecha_corte_fin
                }),
        })
    }, [fechasCorte])

    useEffect(() => {
        if (turnos && fecha_corte_inicio) {
            refetchResumenPagos({
                hotel_id: hotel_id,
                ...(diaCorteState.typeofValue === "date"
                    ? {
                        fecha_corte_inicio,
                        fecha_corte_fin
                    }
                    : {
                        fecha_inicio: fechasCorte?.inicio,
                        fecha_fin: fechasCorte?.fin,
                    }),
                turno_id: turno_hotel_id,
            })
        } else if (corte && diaCorteState.typeofValue === "id" && fechasCorte) {
            refetchResumenPagos({
                hotel_id: hotel_id,
                fecha_inicio: fechasCorte?.inicio,
                fecha_fin: fechasCorte?.fin,
                turno_id: corte?.corte?.turno_id,
            })
        }
    }, [turnos, corte, fechasCorte])

    useEffect(() => {
        const almacen_id = almacen?.almacenes[0]?.almacen_id
        if ((almacen_id && diaCorteState.typeofValue === "id" && fechasCorte) || diaCorteState.typeofValue === "date") {
            refetchInventario({
                almacen_id,
                hotel_id: hotel_id,
                ...(diaCorteState.typeofValue === "date"
                    ? {
                        fecha_corte_inicio,
                        fecha_corte_fin
                    }
                    : {
                        fecha_inicio: fechasCorte?.inicio,
                        fecha_fin: fechasCorte?.fin,
                    }),
            })
        }
    }, [fechasCorte, almacen])

    useEffect(() => {
        if (cortes_pdf && resumen_pagos && turnos && corte && diaCorteState.withLogoutState) {
            localStorage.setItem("triggerLogout", "withLogout")
        }
    }, [cortes_pdf, resumen_pagos, turnos, corte])
    
    function format12HourTime(date: Date): string {
        const hours24 = date.getHours();
        const minutes = date.getMinutes();
        const period = hours24 >= 12 ? "pm" : "am";
        const hours12 = hours24 % 12 || 12; 

        const minutesFormatted = minutes.toString().padStart(2, "0");

        return `${hours12}:${minutesFormatted}${period}`;
    }

    const getFechaCorte = (value: string): string => {
        const date = UTCStringToLocalDate(value)

        return `${Meses[date.getMonth()]}, ${date.getDate()} ${date.getFullYear()} ${format12HourTime(date)}`                                                                              
    }

    const getFolios = (): string => {
        const array = cortes_pdf?.cortes_pdf?.folios_cortes || []
        const order = array.sort((a, b) => Number(a?.folio) - Number(b?.folio)) || []

        if (order.length > 6) {
            return `${order?.[0]?.folio} al ${order?.[order.length - 1]?.folio}`
        } else {
            let text = ""
            order.forEach((f, index)=>{
                text = `${text}${index > 0 ? ", " : ""}${f?.folio}`
            })
            return text
        }
    } 


    return !load && !loadCorte ? (
        <div style={{ width: "100%", height: "100%" }}>
            <PDFViewer style={{ width: "100%", height: "calc(100dvh - 48px)" }}>
                <Document title="Corte">
                    <Page size="LETTER" style={styles.page}>
                        <View>
                            <View
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    marginBottom: 10,
                                }}
                                fixed
                            >
                                <Image src={logo_hotel || require("src/assets/png/logo_md.png")} style={{ height: "50px", backgroundColor: logo_hotel ? "#0e0e0e" : "" }} />
                                {!fecha_corte_inicio ? (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Usuario</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {`${corte?.corte?.usuario_crea?.nombre} ${corte?.corte?.usuario_crea?.apellido_paterno} ${corte?.corte?.usuario_crea?.apellido_materno}`}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {getFechaCorte(corte?.corte?.fecha_fin_corte || (diaCorteState.typeofValue === "date" ? diaCorteState.value : new Date().toISOString()))}
                                            </Text>
                                        </View>
                                        {corte?.corte?.folio && <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folio</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.folio || ""}
                                            </Text>
                                        </View>}
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Turno</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.turno?.nombre}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {fechas_corte || getFechaCorte(new Date().toISOString())}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folios</Text>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <Text
                                                    style={{
                                                        color: "#5e6470",
                                                        fontWeight: 500,
                                                        fontSize: 9,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    {getFolios()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View style={{ width: "49%" }}>
                                    <Tarifas cortes_pdf={cortes_pdf?.cortes_pdf} ticket_promedio={cortes_pdf?.tickets_promedio} />
                                    <RoomService cortes_pdf={cortes_pdf?.cortes_pdf} ticket_promedio={cortes_pdf?.tickets_promedio} />
                                    <Restaurante cortes_pdf={cortes_pdf?.cortes_pdf} ticket_promedio={cortes_pdf?.tickets_promedio} />
                                    <Ingresos cortes_pdf={cortes_pdf} />
                                    
                                </View>
                                <View style={{ width: "49%" }}>
                                    <Gastos cortes_pdf={cortes_pdf?.cortes_pdf} fajillas={cortes_pdf?.manejo_efectivo?.fajillas} />
                                    <Efectivo
                                        cortes_pdf={cortes_pdf?.manejo_efectivo}
                                    /> 
                                    <Cancelaciones
                                        cancelaciones={cortes_pdf?.cortes_pdf?.cancelaciones_conceptos}
                                    />
                                    <Descuentos descuentos={cortes_pdf?.cortes_pdf?.descuentos}  egresos={cortes_pdf?.resultado_corte}/>
                                    <Totales
                                        resultado_corte={cortes_pdf?.resultado_corte}
                                        corte={corte}
                                        totales={cortes_pdf?.total_corte}
                                        anticipo={cortes_pdf?.resultado_corte?.anticipos_validos}
                                        manejo_efectivo={cortes_pdf?.manejo_efectivo}
                                    />
                                </View>
                            </View>
                        </View>
                        <Footer page={1} totalPages={7} nombre_hotel={nombre_hotel?.toUpperCase() || ""} />
                    </Page>
                    {/*----- Page de información -----*/}
                    <Page size="LETTER" style={styles.page}>
                        <View>
                            <View
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    marginBottom: 10,
                                }}
                                fixed
                            >
                                <Image src={logo_hotel || require("src/assets/png/logo_md.png")} style={{ height: "50px", backgroundColor: logo_hotel ? "#0e0e0e" : "" }} />
                                {!fecha_corte_inicio ? (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Usuario</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {`${corte?.corte?.usuario_crea?.nombre} ${corte?.corte?.usuario_crea?.apellido_paterno} ${corte?.corte?.usuario_crea?.apellido_materno}`}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {getFechaCorte(corte?.corte?.fecha_fin_corte || (diaCorteState.typeofValue === "date" ? diaCorteState.value : new Date().toISOString()))}
                                            </Text>
                                        </View>
                                        {corte?.corte?.folio && <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folio</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.folio || ""}
                                            </Text>
                                        </View>}
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Turno</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.turno?.nombre}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {fechas_corte || getFechaCorte(new Date().toISOString())}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folios</Text>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <Text
                                                    style={{
                                                        color: "#5e6470",
                                                        fontWeight: 500,
                                                        fontSize: 9,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    {getFolios()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 5
                                }}
                            >
                                <View style={{ width: "49%" }}>
                                    <Text style={{ fontWeight: 700, fontSize: 8 }}>Informativo</Text>
                                    <AnticiposValidos cortes_pdf={cortes_pdf} />
                                    
                                </View>
                                <View style={{ width: "49%", marginTop: 4 }}>
                                    <Propinas resumen_propinas={cortes_pdf?.resumen_propinas?.[0]} />
                                </View>
                            </View>
                        </View>
                        <Footer page={1} totalPages={7} nombre_hotel={nombre_hotel?.toUpperCase() || ""} />
                    </Page>
                    <Page size="LETTER" style={{ ...styles.page, paddingBottom: "30px" }}>
                        <View>
                            <View
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    marginBottom: 10,
                                }}
                                fixed
                            >
                                <Image src={logo_hotel || require("src/assets/png/logo_md.png")} style={{ height: "50px", backgroundColor: logo_hotel ? "#0e0e0e" : "" }} />
                                {!fecha_corte_inicio ? (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Usuario</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {`${corte?.corte?.usuario_crea?.nombre} ${corte?.corte?.usuario_crea?.apellido_paterno} ${corte?.corte?.usuario_crea?.apellido_materno}`}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {getFechaCorte(corte?.corte?.fecha_fin_corte || (diaCorteState.typeofValue === "date" ? diaCorteState.value : new Date().toISOString()))}
                                            </Text>
                                        </View>
                                        {corte?.corte?.folio && <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folio</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.folio || ""}
                                            </Text>
                                        </View>}
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Turno</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {corte?.corte?.turno?.nombre}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Fecha</Text>
                                            <Text
                                                style={{
                                                    color: "#5e6470",
                                                    fontWeight: 500,
                                                    fontSize: 9,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {fechas_corte || getFechaCorte(new Date().toISOString())}
                                            </Text>
                                        </View>
                                        <View style={styles.date}>
                                            <Text style={{ fontWeight: 500, fontSize: 9 }}>Folios</Text>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <Text
                                                    style={{
                                                        color: "#5e6470",
                                                        fontWeight: 500,
                                                        fontSize: 9,
                                                        marginTop: 3,
                                                    }}
                                                >
                                                    {getFolios()}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontWeight: 500, fontSize: 11 }}>
                                Reporte de salidas de productos de inventario
                            </Text>
                            <Cards inventario={inventario} />
                            <Salidas data={inventario?.articulos || []} />
                        </View>
                        <Footer page={1} totalPages={7} nombre_hotel={nombre_hotel?.toUpperCase() || ""} />
                    </Page>
                    {
                        diaCorteState.typeofValue === "id" && <ReportePropinasPage {...reportePropinas} />
                    }
                </Document>
            </PDFViewer>
        </div>
    ) : (
        <LoaderComponent visible={true} />
    )
}

export default DiaOTurnoCortePDF