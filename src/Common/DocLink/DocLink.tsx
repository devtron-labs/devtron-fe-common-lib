import { DOCUMENTATION_HOME_PAGE, DOCUMENTATION_VERSION } from '..'
import { DocLinkProps } from './types'

export const appendUtmToUrl = (docLink: string) => `${docLink}?utm_source=product`

export const getDocumentationUrl = (docLink: string) =>
    `${DOCUMENTATION_HOME_PAGE}${DOCUMENTATION_VERSION}/${appendUtmToUrl(docLink)}`

export const DocLink = ({ docLink, docLinkText = 'Learn more', dataTestId, className = 'dc__link' }: DocLinkProps) => (
    <a
        href={getDocumentationUrl(docLink)}
        target="_blank"
        rel="noreferrer noopener"
        data-testid={dataTestId || ''}
        className={className}
    >
        {docLinkText}
    </a>
)
