import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '@Common/Constants'

import { DOCUMENTATION } from './constants'

export const appendUtmToUrl = (docLinkKey: keyof typeof DOCUMENTATION) =>
    `${DOCUMENTATION[docLinkKey]}?utm_source=product`

export const getDocumentationUrl = (docLinkKey: keyof typeof DOCUMENTATION) =>
    `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${appendUtmToUrl(docLinkKey)}`
