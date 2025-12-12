import { DetailedHTMLProps, ImgHTMLAttributes } from "react"
import cx from "classnames"

type Props = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

function Image({ className = "", ...props }: Props): JSX.Element {
    return <img width={"100%"} height={"100%"} className={cx("disp__img", className)} {...props} />
}

export default Image
