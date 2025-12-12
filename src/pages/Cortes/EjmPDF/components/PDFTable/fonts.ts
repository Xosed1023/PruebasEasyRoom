import { Font } from "@react-pdf/renderer"

import RobotoRegular from "../../../../../assets/fonts/Roboto/Roboto-Regular.ttf"
import RobotoMedium from "../../../../../assets/fonts/Roboto/Roboto-Medium.ttf"
import RobotoBold from "../../../../../assets/fonts/Roboto/Roboto-Bold.ttf"

Font.register({
    family: "Roboto",
    fonts: [
        { src: RobotoRegular, fontWeight: "normal" },
        { src: RobotoMedium, fontWeight: "medium" },
        { src: RobotoBold, fontWeight: "bold" },
    ],
})