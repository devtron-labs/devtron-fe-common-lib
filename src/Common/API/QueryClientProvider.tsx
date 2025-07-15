import { PropsWithChildren } from 'react'
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider as RQQueryClientProvider,
} from '@tanstack/react-query'

import { showError } from '@Common/Helper'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 0,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: false,
            meta: { showToastError: true },
        },
        mutations: {
            cacheTime: 0,
            retry: false,
            meta: { showToastError: true },
        },
    },
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.meta.showToastError) {
                showError(error)
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (mutation.meta.showToastError) {
                showError(error)
            }
        },
    }),
})

export const QueryClientProvider = ({ children }: PropsWithChildren<{}>) => (
    <RQQueryClientProvider client={queryClient}>{children}</RQQueryClientProvider>
)
