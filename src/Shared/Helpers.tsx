import { MaterialInfo } from '../Common'
import { GitTriggers, WebhookEventNameType } from './types'
import { ReactComponent as ICPullRequest } from '../Assets/Icon/ic-pull-request.svg'
import { ReactComponent as ICTag } from '../Assets/Icon/ic-tag.svg'
import { ReactComponent as ICWebhook } from '../Assets/Icon/ic-webhook.svg'

interface HighlightSearchTextProps {
    /**
     * The text to be highlighted
     */
    searchText: string
    /**
     * The whole text string
     */
    text: string
    /**
     * The classes to be applied to the highlighted text
     */
    highlightClasses?: string
}

// Disabling default export since this is a helper function and we would have to export a lot of functions in future.
export const highlightSearchText = ({ searchText, text, highlightClasses }: HighlightSearchTextProps): string => {
    if (!searchText) {
        return text
    }

    try {
        const regex = new RegExp(searchText, 'gi')
        return text.replace(regex, (match) => `<span class="${highlightClasses}">${match}</span>`)
    } catch (error) {
        return text
    }
}

export const preventBodyScroll = (lock: boolean): void => {
    if (lock) {
        document.body.style.overflowY = 'hidden'
        document.body.style.height = '100vh'
        document.documentElement.style.overflow = 'initial'
    } else {
        document.body.style.overflowY = null
        document.body.style.height = null
        document.documentElement.style.overflow = null
    }
}

const getIsMaterialInfoValid = (materialInfo: MaterialInfo): boolean =>
    !!(
        materialInfo.webhookData ||
        materialInfo.author ||
        materialInfo.message ||
        materialInfo.modifiedTime ||
        materialInfo.revision
    )

export const getIsMaterialInfoAvailable = (materialInfo: MaterialInfo[]) =>
    !!materialInfo?.every(getIsMaterialInfoValid)

export const getGitCommitInfo = (materialInfo: MaterialInfo): GitTriggers => ({
    Commit: materialInfo.revision,
    Author: materialInfo.author,
    Date: materialInfo.modifiedTime,
    Message: materialInfo.message,
    WebhookData: JSON.parse(materialInfo.webhookData),
    Changes: [],
    GitRepoUrl: '',
    GitRepoName: '',
    CiConfigureSourceType: '',
    CiConfigureSourceValue: '',
})

export const caseInsensitiveStringComparator = (a: string, b: string): number =>
    a.toLowerCase().localeCompare(b.toLowerCase())

export const getWebhookEventIcon = (eventName: WebhookEventNameType) => {
    switch (eventName) {
        case WebhookEventNameType.PULL_REQUEST:
            return <ICPullRequest className="icon-dim-12" />
        case WebhookEventNameType.TAG_CREATION:
            return <ICTag className="icon-dim-12" />
        default:
            return <ICWebhook className="icon-dim-12" />
    }
}

export const isNullOrUndefined = (value: unknown): boolean => value === null || value === undefined
export const handleDisableSubmitOnEnter = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
        event.preventDefault()
    }
}
