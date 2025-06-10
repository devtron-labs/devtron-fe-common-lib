import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '@Common/Constants'

import { DOCUMENTATION } from './constants'
import { BaseDocLink } from './types'

export const getDocumentationUrl = <T extends boolean = false>({
    docLinkKey,
    isEnterprise = false,
    isExternalLink,
    isLicenseDashboard = false,
}: BaseDocLink<T>) => {
    if (isExternalLink) {
        return docLinkKey
    }

    const docPath = DOCUMENTATION[docLinkKey as keyof typeof DOCUMENTATION]

    if (docPath?.startsWith('http')) {
        return docPath
    }

    const utmPath = !isLicenseDashboard ? `?utm-source=product_${isEnterprise ? 'ent' : 'oss'}` : ''

    return `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${docPath || ''}${utmPath}`
}
