import Touchable from "src/shared/components/general/touchable/Touchable"
import Screen from "src/shared/components/layout/screen/Screen"
import Icon from "src/shared/icons"
import "./Consulta.css"
import Impresion from "../../Components/Modals/Impresión/Impresion"
import Card from "src/shared/components/data-display/card/Card"
import { useNavigate } from "react-router-dom"
import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { tableItems } from "../../cortes.data"
import { useEffect, useState } from "react"
import useSortTable from "src/shared/hooks/useSortTable"

const Movimientos = () => {
    const navigate = useNavigate()
    const [openImpresion, setOpenImpresion] = useState<boolean>(false)
    const [sortedData, setsortedDataCortes] = useState(tableItems.rows) // Almacena los datos ordenados
    const [onSortData, setSortedData] = useState<{
        sort: "up" | "down" | null
        fromHeader: string
        idx: number
    } | null>(null) // Almacena los datos ordenados

    // Función para ordenar los datos
    useEffect(() => {
        const sortData = useSortTable({ sortState: onSortData?.sort || null, sortedData, i: onSortData?.idx || 0 })
        setsortedDataCortes(sortData)
    }, [onSortData])

    const onFilterTable = (value) => {
        console.log(value)
    }
    const DATA_CARDS_ADMIN = [
        {
            title: "Total",
            number: "$37,200",
        },
        {
            title: "Efectivo en caja",
            number: "$10,000",
        },
        {
            title: " Visa y mastercard",
            number: "$11,200",
        },
        {
            title: " AMEX",
            number: "$1,000",
        },
        {
            title: "Fajillas",
            number: "5",
            link: "Ver detalle",
            onLink: () => navigate("/u/cortes/fajillas"),
            label: "2 pendientes",
        },
    ]

    return (
        <Screen
            title=""
            back
            className="movimientos-container"
            headerRight={
                <Touchable className="cortes-screen-header-icon" onClick={() => setOpenImpresion(true)}>
                    <Icon name="printer" color="#0E0E0E" height={"20px"} width={"20px"} />
                </Touchable>
            }
        >
            <p className="cortes-movimiento-title">Corte - 3456</p>
            <div className="cortes-subtitle-container">
                <p className="cortes-subtitle-label">Turno vespertino: </p>
                <p className="cortes-subtitle-value">Sep, 22 2023</p>
            </div>
            <div className="gastos-cards animante__select ">
                {DATA_CARDS_ADMIN.map((data, index) => (
                    <Card
                        key={index}
                        title={data.title}
                        number={data.number}
                        containerClassName="cortes-cards__container-cards"
                        link={data.number === "0" ? "" : data.link}
                        onLink={data.onLink}
                    />
                ))}
            </div>
            <div className="screen__table animante__opacity">
                <FlexibleTable
                    onSelectedFilters={(value) => onFilterTable(value)}
                    onSort={(value) => {
                        setSortedData(value) // Cambia el estado de orden descendente
                    }}
                    tableItems={{
                        ...{
                            headers: tableItems.headers,
                            rows: sortedData.map((row) => ({
                                value: row.value.map(({ value }, index, arr) => ({
                                    // la última columna es la que va a tener este estilo
                                    value:
                                        index === arr.length - 1 ? (
                                            <div
                                                className="reservas-screen__table-cell__pago"
                                                onClick={() => setOpenImpresion(true)}
                                            >
                                                <Icon
                                                    name="printer"
                                                    color="var(--primary)"
                                                    height={"20px"}
                                                    width={"20px"}
                                                />
                                            </div>
                                        ) : (
                                            value
                                        ),
                                })),
                            })),
                        },
                    }}
                ></FlexibleTable>
            </div>
            <Impresion openImpresion={openImpresion} setOpenImpresion={setOpenImpresion} />
        </Screen>
    )
}

export default Movimientos
