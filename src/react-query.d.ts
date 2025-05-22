import '@tanstack/react-query'

declare module '@tanstack/react-query' {
    export interface QueryMeta {
        /**
         * Optional flag indicating whether to display a toast notification for errors.
         * @default true
         */
        showError?: boolean
    }
    export interface MutationMeta {
        /**
         * Optional flag indicating whether to display a toast notification for errors.
         * @default true
         */
        showError?: boolean
    }

    interface Register {
        queryMeta: {
            /**
             * Optional flag indicating whether to display a toast notification for errors.
             * @default true
             */
            showError?: boolean
        }
        mutationMeta: {
            /**
             * Optional flag indicating whether to display a toast notification for errors.
             * @default true
             */
            showError?: boolean
        }
    }
}
