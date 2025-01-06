import { APIOptions, CDMaterialType } from '@Common/Types'

export const getAPIOptionsWithTriggerTimeout = (options?: APIOptions): APIOptions => {
    const _options: APIOptions = options ? JSON.parse(JSON.stringify(options)) : {}

    if (window._env_.TRIGGER_API_TIMEOUT) {
        _options.timeout = window._env_.TRIGGER_API_TIMEOUT
    }

    return _options
}

/**
 * This check is used to find the image that is currently deployed on the environment
 * from the image list fetched from genericCDMaterialsService for a given environment
 *
 * @param material CDMaterialType
 * @returns if image is currently deployed
 */
export const isImageActiveOnEnvironment = (material: CDMaterialType) => material.deployed && material.latest
