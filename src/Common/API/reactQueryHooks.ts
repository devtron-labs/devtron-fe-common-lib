import {
    QueryKey,
    useMutation as rqUseMutation,
    UseMutationOptions,
    UseMutationResult,
    useQuery as rqUseQuery,
    useQueryClient,
    UseQueryOptions,
    UseQueryResult,
} from '@tanstack/react-query'

import { ServerErrors } from '@Common/ServerError'
import { ResponseType } from '@Common/Types'

export const useQuery = <TQueryFnData = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    options: UseQueryOptions<ResponseType<TQueryFnData>, ServerErrors, TData, TQueryKey>,
): UseQueryResult<TData, ServerErrors> => rqUseQuery(options)

export const useMutation = <TData = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<ResponseType<TData>, ServerErrors, TVariables, TContext>,
): UseMutationResult<ResponseType<TData>, ServerErrors, TVariables, TContext> => rqUseMutation(options)

export { useQueryClient }
