import { fireEvent, render } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import TabMenu from "src/shared/components/navigation/tab-menu/TabMenu"
import { TabsWithRouter, TabsWithState, props } from "src/stories/components/navigation/tab-menu/Utils"

const max = props.tabList.length

describe("<TabMenu/>", () => {
    const { container } = render(<TabMenu {...props} />)

    const element = container.getElementsByClassName("tab-menu")[0]

    it("should render component", () => {
        expect(element).toBeInTheDocument()
    })

    it(`should render ${max} items in the component`, () => {
        expect(element.children.length).toBe(max)
    })

    it("should render badge in first item", () => {
        expect(element.children[0].children[1]).toHaveClass("tab-menu__item__badge")
    })

    it("should not render badge in latest item", () => {
        expect(element.children[max - 1].children[1]).toBeUndefined()
    })
})

describe("<TabMenu/> : WithState", () => {
    const getElement = () => {
        const { container } = render(<TabsWithState {...props} />)
        return container.getElementsByClassName("tab-menu")[0]
    }

    it("should render the first active item", () => {
        const element = getElement()
        expect(element.children[0]).toHaveClass("tab-menu__item--active")
    })

    it("should render second active item, after click tab", () => {
        const element = getElement()
        fireEvent.click(element.children[1])

        expect(element.children[1]).toHaveClass("tab-menu__item--active")
    })
})

describe("<TabMenu/> : WithReactRouter", () => {
    const getElement = () => {
        const { container } = render(<TabsWithRouter {...props} />, { wrapper: BrowserRouter })
        return container.getElementsByClassName("tab-menu")[0]
    }

    it("should render the first active item", () => {
        const element = getElement()
        fireEvent.click(element.children[0])

        expect(element.children[0]).toHaveClass("tab-menu__item--active")
    })

    it("should render second active item, after click tab", () => {
        const element = getElement()
        fireEvent.click(element.children[1])

        expect(element.children[1]).toHaveClass("tab-menu__item--active")
    })
})
