export async function urlToFile({ url, fileName }: { url: string; fileName: string }) {
    // Realizar la solicitud para obtener el archivo
    const response = await fetch(url)
    const blob = await response.blob() // Convertir la respuesta en un Blob

    // Crear el objeto File
    const file = new File([blob], fileName, { type: blob.type })
    return file
}
