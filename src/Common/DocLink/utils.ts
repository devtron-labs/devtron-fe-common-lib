import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '@Common/Constants'

import { DOCUMENTATION } from './constants'
import { DocumentationUrlParamsType } from './types'

export const appendUtmToUrl = (docLinkKey: keyof typeof DOCUMENTATION) =>
    `${DOCUMENTATION[docLinkKey]}?utm_source=product`

export const getDocumentationUrl = ({ docLinkKey, hideVersion }: DocumentationUrlParamsType) => {
    if (hideVersion) {
        return DOCUMENTATION[docLinkKey]
    }
    return `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${appendUtmToUrl(docLinkKey)}`
}
