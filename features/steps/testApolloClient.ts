import { setContext } from "apollo-link-context";
import { createHttpLink } from "apollo-link-http";
import { ApolloClient, FetchPolicy, ErrorPolicy } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import fetch from "isomorphic-fetch";


export type GraphQLContext = Map<string, any>;

export const testApolloClient = (port: number) => {
    const context: GraphQLContext = new Map([
        ['accessToken', null],        
      ]);

    const authLink = setContext((_, { headers }) => {
        const accessToken = context.get('accessToken');
        return {
            headers: {
                ...headers,
                authorization: accessToken ? `Bearer ${accessToken}` : '',
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
    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
        defaultOptions
    });

    const getContext = (key: string) => {
        return context.get(key);
      };
    
      const updateContext = (key: string, value: any) => {
        return context.set(key, value);
      };

    return {
        client,
        getContext,
        updateContext,
        mutate: client.mutate,
        query: client.query
    }
}