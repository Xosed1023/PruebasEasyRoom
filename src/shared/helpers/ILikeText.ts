export const iLikeText = ({ searchText, fullText }: { searchText: string; fullText: string }) => {
    const fullTextFormatted = fullText.toLowerCase().trim()
    const searchTextFormatted = searchText.toLowerCase().trim()

    // Verificar si el texto completo contiene el texto a buscar
    return fullTextFormatted.includes(searchTextFormatted)
}
