import { useEffect, useRef, useState } from 'react'
import { MaterialInfo, shallowEqual } from '../Common'
import { GitTriggers, IntersectionChangeHandler, IntersectionOptions, WebhookEventNameType } from './types'
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

export const useIntersection = (
    target: React.RefObject<Element> | Element | null,
    // eslint-disable-next-line default-param-last
    options: IntersectionOptions = {},
    callback?: IntersectionChangeHandler,
) => {
    const { defaultIntersecting, once, ...opts } = options
    const optsRef = useRef(opts)
    const [intersecting, setIntersecting] = useState(defaultIntersecting === true)
    const intersectedRef = useRef(false)

    useEffect(() => {
        if (!shallowEqual(optsRef.current, opts)) {
            optsRef.current = opts
        }
    })

    useEffect(() => {
        if (target == null) {
            return
        }

        const element = target instanceof Element ? target : target.current
        if (element == null) {
            return
        }

        if (once && intersectedRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIntersecting(entry.isIntersecting)

                if (callback != null) {
                    callback(entry)
                }

                if (entry.isIntersecting) {
                    intersectedRef.current = true
                }

                if (once && entry.isIntersecting && element != null) {
                    observer.unobserve(element)
                }
            },
            {
                ...optsRef.current,
                root: optsRef.current.root != null ? optsRef.current.root.current : null,
            },
        )

        observer.observe(element)

        // eslint-disable-next-line consistent-return
        return () => {
            if (once && intersectedRef.current) {
                return
            }

            if (element != null) {
                observer.unobserve(element)
            }
        }
    }, [optsRef.current, target])

    return intersecting
}
