import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import { Form } from "src/pages/auth/login"

jest.mock("src/shared/hooks/useSnackbar", () => ({
    useSnackbar: () => ({
        showSnackbar: jest.fn(),
    }),
}))

describe("Login Form", () => {
    render(<Form />, { wrapper: BrowserRouter })

    const emailField = screen.getByTestId("email")
    const passwordField = screen.getByTestId("password")
    const submitButton = screen.getByText("Entrar")

    it("should have an email and a password field, also a submit button.", () => {
        expect(emailField).toBeInTheDocument()
        expect(passwordField).toBeInTheDocument()
        expect(submitButton).toBeInTheDocument()
    })

    it("should not call onSubmit without field values", () => {
        const spy = jest.spyOn(console, "log")
        userEvent.click(submitButton)

        expect(spy).not.toBeCalled()
    })

    it("should not call onSubmit without password field", () => {
        const spy = jest.spyOn(console, "log")
        userEvent.type(emailField, "hola@mail.com")
        userEvent.click(submitButton)

        expect(spy).not.toBeCalled()
    })

    it("should call onSubmit when it has all field values", () => {
        const spy = jest.spyOn(console, "log")
        userEvent.type(emailField, "hola@mail.com")
        userEvent.type(passwordField, "holaa123")
        userEvent.click(submitButton)

        expect(spy).not.toBeCalled()
    })
})

/*
it("Should have an email and a password field, also a submit button.", () => {
    render(<Form />)

    const emailField = screen.getByTestId("email")
    const passwordField = screen.getByTestId("password")
    const submitButton = screen.getByText("Entrar")

    expect(emailField).toBeInTheDocument()
    expect(passwordField).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
})
*/
