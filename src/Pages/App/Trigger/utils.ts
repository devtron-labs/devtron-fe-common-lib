import { APIOptions } from '@Common/Types'

export const getAPIOptionsWithTriggerTimeout = (options?: APIOptions): APIOptions => {
    const _options: APIOptions = options ? JSON.parse(JSON.stringify(options)) : {}

    if (window._env_.TRIGGER_API_TIMEOUT) {
        _options.timeout = window._env_.TRIGGER_API_TIMEOUT
    }

    return _options
}
