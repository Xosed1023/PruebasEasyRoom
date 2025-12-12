import { useEffect, useState } from "react"
import Screen from "src/shared/components/layout/screen/Screen"
import { Search } from "./components/Search"
import "./index.css"
import GastosList from "./components/gastos-list/GastosList"
import GastosNotList from "./components/gastos-not-list/GastosNotList"
import { useNavigate } from "react-router-dom"
import Touchable from "src/shared/components/general/touchable/Touchable"
import Icon from "src/shared/icons"
import Dropdown, { Option } from "src/shared/components/forms/selelct-dropdown/Dropdown"
import { useGetGastosQuery, useTotal_Gastos_Por_Dia_RecepcionistaQuery } from "src/gql/schema"
import { useCurrentRol } from "src/shared/widgets/hooks/general"
import ScreenSkeleton from "./components/ScreenSkeleton/ScreenSkeleton"
import { CalendarButtons } from "../reservaciones/inicio/components/CalendarButtons/CalendarButtons"
import { formatCurrency } from "src/shared/hooks/formatCurrency"
import useEscapeKey from "src/shared/hooks/useEscapeKey"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "src/store/store"
import { toggleNuevoGastoModalOpen } from "src/store/gastos/gastosSlice"
import { useCurrentDate } from "src/shared/providers/CurrentdateProvider"
import { RoleNames } from "src/shared/hooks/useAuth"

const options: Option[] = [
    { label: "Enero", value: "0" },
    { label: "Febrero", value: "1" },
    { label: "Marzo", value: "2" },
    { label: "Abril", value: "3" },
    { label: "Mayo", value: "4" },
    { label: "Junio", value: "5" },
    { label: "Julio", value: "6" },
    { label: "Agosto", value: "7" },
    { label: "Septiembre", value: "8" },
    { label: "Octubre", value: "9" },
    { label: "Noviembre", value: "10" },
    { label: "Diciembre", value: "11" },
]

const optionsYears: Option[] = [
    { label: "2015", value: "2015" },
    { label: "2016", value: "2016" },
    { label: "2017", value: "2017" },
    { label: "2018", value: "2018" },
    { label: "2019", value: "2019" },
    { label: "2020", value: "2020" },
    { label: "2021", value: "2021" },
    { label: "2022", value: "2022" },
    { label: "2023", value: "2023" },
    { label: "2024", value: "2024" },
    { label: "2025", value: "2025" },
    { label: "2026", value: "2026" },
    { label: "2027", value: "2027" },
    { label: "2028", value: "2028" },
]

function Gastos() {
    const [currentDate] = useCurrentDate()

    const { data, loading, refetch: refetchDataGastos } = useGetGastosQuery()
    const { isNuevoGastoModalOpen } = useSelector((state: RootState) => state.gastos)
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [date, setDate] = useState(currentDate.getMonth())
    const [year, setYear] = useState(currentDate.getFullYear())
    const [load, setLoad] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoad(false)
        }, 5000)
    }, [])

    const rol = useCurrentRol()

    const { data: gastosDelMesRecepcionista, refetch: refetchTotalRecepcion } =
        useTotal_Gastos_Por_Dia_RecepcionistaQuery()

    useEscapeKey({
        onEscape: () => {
            if (isNuevoGastoModalOpen) {
                return dispatch(toggleNuevoGastoModalOpen(false))
            }
            navigate("/u")
        },
    })

    if (!loading) {
        return (
            <Screen
                title="Gastos"
                contentClassName="gastos-screen"
                close={true}
                onClose={() => navigate("/u")}
                headerRight={
                    (rol === RoleNames.admin || rol === RoleNames.superadmin) && (
                        <div
                            className={
                                data && data?.gastos?.length > 0 ? "gastos-screen-right" : "gastos-screen-right-empty"
                            }
                        >
                            {data && data?.gastos?.length > 0 ? (
                                <Search onChange={(value) => setSearch(value)} onClear={() => setSearch("")} />
                            ) : null}
                            {false && (
                                <>
                                    <Dropdown
                                        className="gastos-month-dropdown"
                                        onClick={(value) => {
                                            setDate(value.value)
                                            setSearch("")
                                        }}
                                        options={options}
                                        value={date}
                                        placeholder="Todos"
                                    />
                                    <Dropdown
                                        className="gastos-year-dropdown"
                                        onClick={(value) => {
                                            setYear(value.value)
                                            setSearch("")
                                        }}
                                        value={year}
                                        options={optionsYears}
                                        placeholder="Todos"
                                    />
                                </>
                            )}
                            {data && data?.gastos?.length > 0 ? (
                                <CalendarButtons
                                    className="gastos-screen-header-controls"
                                    currMonth={date}
                                    setCurrMonth={setDate}
                                    currYear={year}
                                    setCurrYear={setYear}
                                    monthNames={options.map(({ label }) => label)}
                                />
                            ) : null}

                            <Touchable
                                className="cortes-screen-header-icon"
                                style={{ height: 40, alignItems: "center", marginTop: 6 }}
                                onClick={() => navigate("/u/gastos/config")}
                            >
                                <Icon name="Gear" color="#0E0E0E" height={"20px"} width={"20px"} />
                            </Touchable>
                        </div>
                    )
                }
            >
                {rol === RoleNames.recepcionista && data && data.gastos.length > 0 ? (
                    <div className="gastos-search">
                        <p className="gastos-search-title">
                            Gastos de caja del día:{" "}
                            {formatCurrency(
                                gastosDelMesRecepcionista?.total_gastos_por_dia_recepcionista?.total_gasto || 0
                            )}
                        </p>
                        <div className="gastos-search-inputs">
                            <Search onChange={(value) => setSearch(value)} onClear={() => setSearch("")} />
                        </div>
                    </div>
                ) : null}

                <GastosList
                    numFolio={data?.gastos?.length ?? 0}
                    search={search}
                    date={`${date}`}
                    year={`${year}`}
                    reload={refetchTotalRecepcion}
                    refetchGastos={refetchDataGastos}
                />
            </Screen>
        )
    } else {
        return (
            <Screen
                title="Gastos"
                contentClassName="gastos-screen"
                close={true}
                onClose={() => navigate("/u")}
                headerRight={
                    (rol === RoleNames.admin || rol === RoleNames.superadmin) && (
                        <div className={"gastos-screen-right-empty"}>
                            <Touchable
                                className="cortes-screen-header-icon"
                                style={{ height: 44, alignItems: "center", marginTop: 6 }}
                                onClick={() => navigate("/u/gastos/config")}
                            >
                                <Icon name="Gear" color="#0E0E0E" height={"20px"} width={"20px"} />
                            </Touchable>
                        </div>
                    )
                }
            >
                {load ? (
                    <ScreenSkeleton />
                ) : (
                    <GastosNotList reload={refetchTotalRecepcion} refetchGastos={refetchDataGastos} />
                )}
            </Screen>
        )
    }
}

export default Gastos
