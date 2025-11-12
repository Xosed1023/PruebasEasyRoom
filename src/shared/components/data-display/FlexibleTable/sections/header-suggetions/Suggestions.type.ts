import { FlexibleTableHeaderColumn } from "../../flexible-table-items.interface"

export type Option = {
    value: string
    valueToDisplay?: string
}

export type SuggetionsProps = {
    header: FlexibleTableHeaderColumn
    onChange: (value: string, valueToDisplay: string) => void
    onClose: () => void
    options?: Option[]
    onBottomReached?: () => void
    debounceSearchMSTime?: number
    onInputFilterSuggestionChange?: ({ headerValue, value }: { headerValue: string; value: string }) => void
}
