import CoreAPI from './CoreAPI'
import { handleDashboardLogout, handleRedirectToLicenseActivation } from './utils'

const dashboardAPI = new CoreAPI({
    handleLogout: handleDashboardLogout,
    timeout: (window as any)?._env_?.GLOBAL_API_TIMEOUT,
    handleRedirectToLicenseActivation,
})

export const { post, put, patch, get, trash } = dashboardAPI
export { default as CoreAPI } from './CoreAPI'
export { QueryClientProvider } from './QueryClientProvider'
export * from './useQueryClient'
export { abortPreviousRequests, getIsRequestAborted, handleRedirectToLicenseActivation } from './utils'
