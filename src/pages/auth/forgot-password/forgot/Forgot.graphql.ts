import { gql } from "@apollo/client"

export const FORGOT = gql`
    mutation SendChangePasswordViaEmail($sendChangePasswordViaEmailInput: sendChangePasswordViaEmailInput!) {
        sendChangePasswordViaEmail(sendChangePasswordViaEmailInput: $sendChangePasswordViaEmailInput)
    }
`
