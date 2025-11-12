import { fireEvent, render } from "@testing-library/react"
import Drawer from "src/shared/components/layout/drawer/Drawer"
import { Props } from "src/shared/components/layout/drawer/Drawer.types"

const makeSut = (props: Partial<Props>) => {
    return render(<Drawer {...props} visible={!!props.visible} />)
}

describe("<Drawer />", () => {
    it("should render component", () => {
        const { container } = makeSut({})

        expect(container.getElementsByClassName("drawer")[0]).toBeInTheDocument()
    })

    it("should render drawer (not visible)", () => {
        const { container } = makeSut({ visible: false })
        const drawer = container.getElementsByClassName("drawer--state--close")[0]
        const sheet = container.getElementsByClassName("drawer__content")[0]

        expect(drawer).toBeInTheDocument()
        expect(sheet).toHaveStyle("transform: translate3d(0, -115%, 0)")
    })

    it("should render drawer (visible)", () => {
        const { container } = makeSut({ visible: true })
        const drawer = container.getElementsByClassName("drawer--state--open")[0]
        const sheet = container.getElementsByClassName("drawer__content")[0]

        expect(drawer).toBeInTheDocument()
        expect(sheet).toHaveStyle("transform: translate3d(0, 0%, 0)")
    })

    it("should close drawer when the shadow section is clicked", () => {
        const mockHandleClick = jest.fn()
        const { container } = makeSut({ visible: true, onClose: mockHandleClick })
        const drawer = container.getElementsByClassName("drawer")[0]

        fireEvent.click(drawer)

        expect(mockHandleClick).toHaveBeenCalled()
    })
})
