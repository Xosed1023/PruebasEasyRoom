import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const SurveyFill = memo((props: IconProps) => {
    const { color = "#6941C6", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 50 51" fill="none" {...rest}>
            <path
                fill={color}
                d="M12.5 8.833v8.334h25V8.833h4.181a2.07 2.07 0 0 1 2.069 2.07v33.362a2.07 2.07 0 0 1-2.069 2.068H8.32a2.07 2.07 0 0 1-2.069-2.068V10.902a2.07 2.07 0 0 1 2.069-2.069H12.5Zm6.25 27.084h-4.167v4.166h4.167v-4.166Zm0-6.25h-4.167v4.166h4.167v-4.166Zm0-6.25h-4.167v4.166h4.167v-4.166Zm14.583-18.75V13H16.667V4.667h16.666Z"
            />
        </svg>
    )
})

export default SurveyFill
