import { ROUTES, post, put, trash } from '../../../Common'

export const saveEnvironment = (request): Promise<any> => {
    const URL = `${ROUTES.ENVIRONMENT}`
    return post(URL, request)
}

export const updateEnvironment = (request): Promise<any> => {
    const URL = `${ROUTES.ENVIRONMENT}`
    return put(URL, request)
}

export function deleteEnvironment(request): Promise<any> {
    return trash(ROUTES.ENVIRONMENT, request)
}
