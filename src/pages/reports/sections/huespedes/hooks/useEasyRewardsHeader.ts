import { FlexibleTableHeaderColumn } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { HeaderProps } from "../../hooks/useHeaderProps"

interface EasyRewardsHeaderProps<T extends string> extends HeaderProps<T> {
    easyRewards?: string[]
}

const useEasyRewardsHeader = <T extends string>({
    headerValue,
    valueToDisplay,
    easyRewards = []
}: EasyRewardsHeaderProps<T>): FlexibleTableHeaderColumn => {
    return {
        value: headerValue,
        valueToDisplay,
        filterMenu: easyRewards.map(m => ({value: m, valueToDisplay: m})),
        isFilterUnique: false,
        filterSuggetions: true,
    }
}

export default useEasyRewardsHeader
