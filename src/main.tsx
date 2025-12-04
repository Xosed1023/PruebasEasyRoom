import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import App from "./App.tsx"
import { BrowserRouter } from "react-router"
import { ApolloProvider } from "@apollo/client"
import { store } from "./store"
import { client } from "./gql"
import "./index.css"
import {Buffer} from 'buffer'

// react-pdf-renderer
globalThis.Buffer = Buffer

import { pdfjs } from "react-pdf";

// Necesario en Vite para que el worker cargue bien
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();
// Call the element loader before the render call
defineCustomElements(window);

createRoot(document.getElementById("root")!).render(
    // <StrictMode>
        <Provider store={store}>
            <ApolloProvider client={client}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ApolloProvider>
        </Provider>
    // </StrictMode>
)
