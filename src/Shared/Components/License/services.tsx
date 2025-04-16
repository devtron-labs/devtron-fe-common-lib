import { post } from '@Common/API'
import { ROUTES } from '@Common/Constants'

export const activateLicense = async (license: string) => {
    await post<never, { license: string }>(ROUTES.LICENSE_DATA, { license }, { preventLicenseRedirect: true })
}
