import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient, FetchPolicy, ErrorPolicy } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";

export const testApolloClient = (token: string, port: number): ApolloClient<any> => {
    const authLink = setContext((_, { headers }) => {
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            }
        }
    });
    const httpLink = createHttpLink({
        uri: `http://localhost:${port}/graphql`,
        fetch
    });
    // Disable cache for all requests
    const defaultOptions = {        
        query: {
            fetchPolicy: 'network-only' as FetchPolicy,
            errorPolicy: 'all' as ErrorPolicy,
        }
    };
    return new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions
    });
}