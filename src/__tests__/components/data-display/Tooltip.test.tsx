import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Tooltip from "src/shared/components/data-display/tooltip/Tooltip"
import { PropsToolTip } from "src/shared/components/data-display/tooltip/Tooltip.type"

const makeSut = (props: Partial<PropsToolTip>) => {
    return render(
        <Tooltip {...props} title="This is a tooltip">
            <span>Content</span>
        </Tooltip>
    )
}

describe("<Tooltip />", () => {
    it("should render component", () => {
        const { container } = makeSut({})

        const element = container.getElementsByClassName("tooltip")[0]
        expect(element).toBeInTheDocument()
    })
    it("should change the style before and after on hover", () => {
        const { container } = makeSut({})

        const element = container.getElementsByTagName("span")[0]
        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        userEvent.hover(element)

        expect(tooltip).toHaveStyle("opacity: 1;")

        userEvent.unhover(element)

        expect(tooltip).toHaveStyle("opacity: 0;")
    })
    it("should render dark theme", () => {
        const { container } = makeSut({ theme: "dark" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_theme_dark")
    })
    it("should render light theme", () => {
        const { container } = makeSut({ theme: "light" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_theme_light")
    })
    it("should change classname when props.description is asigned", () => {
        const { container } = makeSut({ description: "Lorem lorem" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_size_lg")
    })
    it("should change classname when props.placement is 'top'", () => {
        const { container } = makeSut({ placement: "top" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_placement_top")
    })
    it("should change classname when props.placement is 'left'", () => {
        const { container } = makeSut({ placement: "left" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_placement_left")
    })
    it("should change classname when props.placement is 'right'", () => {
        const { container } = makeSut({ placement: "right" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_placement_right")
    })
    it("should change classname when props.placement is 'bottom'", () => {
        const { container } = makeSut({ placement: "bottom" })

        const tooltip = container.getElementsByClassName("tooltip-box")[0]

        expect(tooltip).toHaveClass("tooltip-box_placement_bottom")
    })
})
