import { getUrlWithSearchParams } from '../../Common'
import { GetResourceApiUrlProps } from './types'

export const getResourceApiUrl = <T>({ baseUrl, kind, version, queryParams }: GetResourceApiUrlProps<T>) =>
    getUrlWithSearchParams(`${baseUrl}/${kind}/${version}`, queryParams)
