import { useSelector } from "react-redux"
import { RootState } from "src/store/store"

export function useDrawerWidget() {
    const store = useSelector((state: RootState) => state.navigation.isDrawerWidgetOpen)
    return {
        visible: store,
    }
}
