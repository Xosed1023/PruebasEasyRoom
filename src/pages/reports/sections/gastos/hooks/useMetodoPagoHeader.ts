import { TiposPagos } from "src/gql/schema"
import {
    FilterMenuItem,
    FlexibleTableHeaderColumn,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

const useMetodoPagoHeader = <T extends string>({
    headerValue,
    valueToDisplay,
}: HeaderProps<T>): FlexibleTableHeaderColumn => {
    const metodosPago: FilterMenuItem[] = [
        { value: TiposPagos.Amex, valueToDisplay: "Amex" },
        { value: TiposPagos.ConsumoInterno, valueToDisplay: "Consumo interno" },
        { value: TiposPagos.Cortesia, valueToDisplay: "Cortesía" },
        { value: TiposPagos.DepositoOTransferencia, valueToDisplay: "Depósito o transferencia" },
        { value: TiposPagos.Efectivo, valueToDisplay: "Efectivo" },
        { value: TiposPagos.VisaOMastercard, valueToDisplay: "Visa o mastercard" },
    ]

    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: metodosPago,
        isFilterUnique: false,
        filterSuggetions: false,
    }
}

export default useMetodoPagoHeader
