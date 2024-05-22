import { ROUTES, post, put, trash } from '../../../Common'

export function saveClusters(payload) {
    const URL = `${ROUTES.SAVE_CLUSTER}`
    return post(URL, payload)
}

export function validateCluster(payload) {
    const URL = `${ROUTES.VALIDATE}`
    return post(URL, payload)
}

export function saveCluster(request) {
    const URL = `${ROUTES.CLUSTER}`
    return post(URL, request)
}

export function updateCluster(request) {
    const URL = `${ROUTES.CLUSTER}`
    return put(URL, request)
}

export function deleteCluster(request): Promise<any> {
    return trash(ROUTES.CLUSTER, request)
}
