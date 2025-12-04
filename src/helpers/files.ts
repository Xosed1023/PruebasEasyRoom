export const base64ToFile = (base64: string, fileName: string, mimeType: string): File => {
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }
    return new File([bytes], fileName, { type: mimeType })
}

export const fileToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        if (!file) {
            return
        }

        const reader = new FileReader()

        reader.onloadend = () => {
            if (reader?.result && typeof reader?.result === "string") {
                const base64String = reader?.result?.split?.(",")?.[1]

                resolve(`data:image/png;base64,${base64String}`)
            }
        }

        reader.onerror = () => {
            reject(null)
        }

        reader.readAsDataURL(file)
    })
}
