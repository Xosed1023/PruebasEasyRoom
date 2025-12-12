import { useState } from "react"
import { fireEvent, render, cleanup } from "@testing-library/react"
import Switch from "src/shared/components/forms/switch/Switch"
import { Props } from "src/shared/components/forms/switch/Switch.type"

const Component = (props: Props) => {
    const [value, setValue] = useState<boolean>(false)
    return <Switch {...props} value={value} onChange={(value) => setValue(value)} />
}

afterEach(cleanup)

describe("<Switch />", () => {
    it("should render component", () => {
        const { container } = render(<Component value={false} />)

        expect(container.getElementsByClassName("switch__container")[0]).toBeInTheDocument()
    })
    it("should change the classname after click", () => {
        const { container } = render(<Component value={false} />)
        const element = container.getElementsByClassName("switch")[0]

        expect(element).not.toHaveClass("switch--state--active")

        fireEvent.click(element)

        expect(element).toHaveClass("switch--state--active")
    })
    it("should not change the classname when props.disable is true", () => {
        const { container } = render(<Component value={false} disabled={true} />)
        const element = container.getElementsByClassName("switch")[0]

        fireEvent.click(element)

        expect(element).not.toHaveClass("switch--state--active")
    })
})
