import { gql } from "@apollo/client"

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($changePasswordInput: ChangePasswordInput!) {
        changePassword(changePasswordInput: $changePasswordInput)
    }
`
