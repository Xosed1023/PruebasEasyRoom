import PropinasPDF from "./../PropinasPDF"
import { useData } from "./data"

export const headers = [
    "Personal",
    "Propina \nrecolectada",
    "Aportación \na fondo",
    "Subtotal propina \npor ventas",
    "Comisión bancaria \nsobre propina por venta",
    "Neto propina \npor ventas",
    "Fondo de\npropina",
    "Comisión bancaria\nsobre fondo",
    "Pago \ncorrespondiente",
]

export const widths = [75, 48, 45, 70, 90, 55, 40, 80, 65]

function DetallePropinas(): JSX.Element {
    const { data, dates, totals, loading } = useData()
    return (
        <PropinasPDF
            title={"Detalle de pago de propinas"}
            data={data}
            dates={dates}
            totals={totals}
            loading={loading}
            headers={headers}
            widths={widths}
        />
    )
}

export default DetallePropinas
