import { CSSProperties } from "react"
import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { ComponentProps } from "src/types/component"

export interface Props extends ComponentProps {
    headers: FlexibleTableHeaderColumn[]
    wrapperClassName?: string
    wrapperStyle?: CSSProperties
}
