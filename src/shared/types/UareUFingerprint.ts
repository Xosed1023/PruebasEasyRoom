declare global {
    interface Window {
        Fingerprint: Fingerprint
    }
}

declare interface Fingerprint {
    WebApi: () => void
}

// Exporta un valor vacío para que el archivo se considere un módulo
export {}
