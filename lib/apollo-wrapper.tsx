'use client'

import { ApolloLink, HttpLink } from "@apollo/client";
import {
    ApolloClient,
    ApolloNextAppProvider,
    InMemoryCache,
    SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support";
import React from "react";

function makeClient(): ApolloClient<never> {
    const httpLink = new HttpLink({
        uri: "http://localhost:3000/graphql",
    });
    return new ApolloClient<never>({
        cache: new InMemoryCache(),
        link:
            typeof window === "undefined"
                ? ApolloLink.from([
                    new SSRMultipartLink({
                        stripDefer: true,
                    }),
                    httpLink,
                ])
                : httpLink,
    });
}
export default function ApolloWrapper({ children }: React.PropsWithChildren) {
    return (
        <ApolloNextAppProvider makeClient={() => makeClient() as never}>
    {children}
    </ApolloNextAppProvider>
);
}