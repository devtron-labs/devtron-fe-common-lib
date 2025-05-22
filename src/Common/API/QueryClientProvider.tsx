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
        },
    },
    queryCache: new QueryCache({
        onError: (error, query) => {
            const showToastError = query.meta?.showError ?? true
            if (showToastError) {
                showError(error)
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            const showToastError = mutation.meta?.showError ?? true
            if (showToastError) {
                showError(error)
            }
        },
    }),
})

export const QueryClientProvider = ({ children }: PropsWithChildren<{}>) => (
    <RQQueryClientProvider client={queryClient} contextSharing>
        {children}
    </RQQueryClientProvider>
)
