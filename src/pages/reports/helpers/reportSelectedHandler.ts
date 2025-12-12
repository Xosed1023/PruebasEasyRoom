const reportSelectedHandler = () => {
    const setSelectedSection = (v: { title: string; value: string }) => {
        sessionStorage.setItem("report_selected_section", JSON.stringify(v))
    }
    const getSelectedSection = (): { title: string; value: string } | null => {
        return sessionStorage.getItem("report_selected_section")
            ? JSON.parse(sessionStorage.getItem("report_selected_section") || "{}")
            : null
    }

    return { setSelectedSection, getSelectedSection }
}

export default reportSelectedHandler
