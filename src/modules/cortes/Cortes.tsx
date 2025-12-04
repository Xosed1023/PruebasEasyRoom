import Screen from "@/components/core/layout/screen/Screen"
import Header from "../../components/core/layout/header/Header"
import NavbarNavigator from "@/components/core/navigation/navbar"
import SectionTitle from "@/components/core/layout/section-title/SectionTitle"
import Card from "./components/card/Card"
import ChevronRight from "@/icons/ChevronRight"
import MoneyBag from "@/icons/MoneyBag"

import styles from "./Cortes.module.css"
import AccountingDocument from "@/icons/AccountingDocument"
import { ChevronLeft, FolderCheck } from "lucide-react"
import { useNavigate } from "react-router"
import DatePickerSheet from "@/components/core/forms/date-picker-sheet/DatePickerSheet"
import { useEffect, useState } from "react"
import { dateHelpers } from "@/helpers/dateHelpers"
import DatePickerHeader from "./pages/components/date-picker-header/DatePickerHeader"
import { cn } from "@/lib/utils"

const Cortes = () => {
    const navigate = useNavigate()
    const { localDateToUTCString } = dateHelpers()

    const [dates, setdates] = useState<Date[]>([])
    const [drawerState, setdrawerState] = useState<"start" | "end" | "close">("close")

    useEffect(() => {
        if (dates.length >= 2) {
            navigate("range", {
                state: {
                    start: localDateToUTCString(dates[0]),
                    end: localDateToUTCString(dates[2]),
                },
            })
        }
    }, [dates])

    return (
        <Screen className="gap-y-[20px] flex flex-col pt-[24px]" header={<Header />} footer={<NavbarNavigator />}>
            <SectionTitle title="Cortes" semiBold />
            <p className={styles.corte__description}>
                Consulta o descarga los cortes y reportes según el periodo que necesites
            </p>
            <Card className={`flex items-center p-[20px] justify-between`} onClick={() => navigate("turn")}>
                <div className="flex gap-x-[12px]">
                    <MoneyBag color="var(--primary)" />
                    <span className={styles.corte__card}>Cortes por turno</span>
                </div>
                <ChevronRight color="var(--primary)" />
            </Card>
            <Card className={`flex items-center p-[20px] justify-between`} onClick={() => navigate("day")}>
                <div className="flex gap-x-[12px]">
                    <AccountingDocument color="var(--primary)" />
                    <span className={styles.corte__card}>Cortes por día</span>
                </div>
                <ChevronRight color="var(--primary)" />
            </Card>
            {/* <Card className={`flex items-center p-[20px] justify-between`} onClick={() => setdrawerState("start")}>
                <div className="flex gap-x-[12px]">
                    <AccountingDocument color="var(--primary)" />
                    <span className={styles.corte__card}>Cortes por rango de fechas</span>
                </div>
                <ChevronRight color="var(--primary)" />
            </Card> */}
            <Card className={`flex items-center p-[20px] justify-between`} onClick={() => navigate("month")}>
                <div className="flex gap-x-[12px]">
                    <FolderCheck color="var(--primary)" />
                    <span className={styles.corte__card}>Reportes mensuales</span>
                </div>
                <ChevronRight color="var(--primary)" />
            </Card>
            <DatePickerSheet
                header={(onAccept) => (
                    <DatePickerHeader
                        title="Fecha de inicio"
                        next={
                            <div
                                className="flex flex-1 justify-end items-center"
                                onClick={() => {
                                    onAccept()
                                    setdrawerState("end")
                                }}
                            >
                                <ChevronRight color="var(--primary)" />
                            </div>
                        }
                    />
                )}
                onClose={() => {
                    setdrawerState("close")
                    setdates([])
                }}
                onSelectDate={(d) => setdates([d])}
                open={drawerState === "start"}
                withDays={true}
            />
            <DatePickerSheet
                header={(onAccept) => (
                    <DatePickerHeader
                        title="Fecha de término"
                        next={
                            <div
                                className={cn("flex flex-1 justify-end items-center")}
                                onClick={() => {
                                    onAccept()
                                }}
                            >
                                <button className={styles["range-filter__confirm"]}>Aceptar</button>
                            </div>
                        }
                        back={
                            <div
                                className="flex flex-1 justify-start items-center"
                                onClick={() => {
                                    setdrawerState("start")
                                }}
                            >
                                <ChevronLeft color="var(--primary)" />
                            </div>
                        }
                    />
                )}
                onClose={() => {
                    setdrawerState("close")
                    setdates([])
                }}
                onSelectDate={(d) => setdates((v) => [...v, d])}
                open={drawerState === "end"}
                withDays={true}
            />
        </Screen>
    )
}

export default Cortes
