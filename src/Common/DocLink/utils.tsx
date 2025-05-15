import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '@Common/Constants'

import { DOCUMENTATION } from './constants'
import { DocumentationUrlParamsType } from './types'

export const getDocumentationUrl = ({ docLinkKey, hideVersion, isEnterprise }: DocumentationUrlParamsType) => {
    if (hideVersion) {
        return DOCUMENTATION[docLinkKey]
    }
    return `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${DOCUMENTATION[docLinkKey]}?utm_source=product_${isEnterprise ? 'ent' : 'oss'})}`
}
