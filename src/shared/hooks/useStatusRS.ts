import { useDispatch, useSelector } from "react-redux"
import { togglePromptRS, toggleRSDirty } from "src/store/navigation/navigationSlice"
import { RootState } from "src/store/store"

export function useStatusRS() {
    const nav = useSelector((state: RootState) => state.navigation)
    const dispatch = useDispatch()

    const setDirty = (value: boolean) => dispatch(toggleRSDirty(value))

    const setVisiblePrompt = (value: string) => {
        if (value && nav.isRSDirty) {
            dispatch(togglePromptRS(value))
        } else {
            dispatch(togglePromptRS(""))
        }
    }

    return {
        isDirty: nav.isRSDirty,
        visiblePrompt: nav.isPromptRS,
        setDirty,
        setVisiblePrompt,
    }
}
