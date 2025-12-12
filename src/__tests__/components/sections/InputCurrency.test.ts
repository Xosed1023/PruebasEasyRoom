import { getTax } from "src/shared/sections/payment/Payment.helpers"

const handleChange = (value: string): string => {
    if (value) {
        const current = value.replace(/[^\d.]/g, "")
        if (current.split(".")?.[1]) {
            const [first, second] = current.split(".")
            return `${first}.${second?.slice(0, 2)}`
        } else {
            return current
        }
    } else {
        return ""
    }
}

describe("InputCurrency: Methods", () => {
    it("should render 120.56 when writing: 120.56001", () => {
        expect(handleChange("120.56001")).toEqual("120.56")
    })
    it("should render 1205 when writing: 1205", () => {
        expect(handleChange("1205")).toEqual("1205")
    })
    it("should render 120.5 when writing: 120.5", () => {
        expect(handleChange("120.5")).toEqual("120.5")
    })
})

describe("Tax", () => {
    it("should return 19.2 when writing: 120", () => {
        expect(getTax(120)).toEqual(19.2)
    })
    it("should return 23.2 when writing: 145", () => {
        expect(getTax(145)).toEqual(23.2)
    })
    it("should return 24.1 when writing: 150.62", () => {
        expect(getTax(150.62)).toEqual(24.1)
    })
})
