export const handleErrorMessage = (e: any) => {
    console.log(e)
    if (e?.networkError) {
        alert("Error de conexiòn")
    } else {
        alert(`${e?.message}`)
    }
}
