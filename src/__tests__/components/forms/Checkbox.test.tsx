import { useState } from "react"
import { fireEvent, render } from "@testing-library/react"
import Checkbox from "src/shared/components/forms/checkbox/Checkbox"
import { Props } from "src/shared/components/forms/checkbox/Checkbox.type"

const Component = (props: Props) => {
    const [value, setValue] = useState<boolean>(false)
    return <Checkbox {...props} value={value} onChange={(value) => setValue(value)} />
}

describe("<Checkbox />", () => {
    it("should render component", () => {
        const { container } = render(<Component value={false} />)

        expect(container.getElementsByClassName("checkbox__container")[0]).toBeInTheDocument()
    })
    it("should change the classname after click", () => {
        const { container } = render(<Component value={false} />)
        const element = container.getElementsByClassName("checkbox")[0]

        expect(element).not.toHaveClass("checkbox--state--active")

        fireEvent.click(element)

        expect(element).toHaveClass("checkbox--state--active")
    })
    it("should not change the classname when props.disable is true", () => {
        const { container } = render(<Component value={false} disabled={true} />)
        const element = container.getElementsByClassName("checkbox")[0]

        fireEvent.click(element)

        expect(element).not.toHaveClass("checkbox--state--active")
    })
})
