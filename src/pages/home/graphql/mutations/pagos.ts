import { gql } from "@apollo/client"

export const PAGAR_EXTRAS = gql`
    mutation PagarExtras($pagar_renta_input: PayRentaInput!) {
        pagar_renta(PayRentaInput: $pagar_renta_input) 
    }
`
