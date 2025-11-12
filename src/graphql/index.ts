import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from, split } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { REACT_APP_GQL_API, REACT_APP_GQL_API_WS } from "src/config/environment"
import { getToken } from "src/utils/session"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({
    uri: REACT_APP_GQL_API,
    //credentials: "include",
})

const authLink = new ApolloLink((operation, forward) => {
    const token = getToken()

    if (token) {
        operation.setContext({
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Client-URL": window.location.origin,
            },
        })
    }

    return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) => {
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`
            )
        })
    }
    if (networkError) console.log(`[Network error]: ${networkError}`)
})

export const wsClient = createClient({
    url: REACT_APP_GQL_API_WS || "",
    retryAttempts: Infinity,
    retryWait: async (_retries) => {
        const retryDelay = 5000
        await new Promise((res) => setTimeout(res, retryDelay))
    },
})

const wsLink = new GraphQLWsLink(wsClient)

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === "OperationDefinition" && definition.operation === "subscription"
    },
    wsLink,
    from([errorLink, authLink, httpLink])
)

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
        },
        query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
        },
    },
})
