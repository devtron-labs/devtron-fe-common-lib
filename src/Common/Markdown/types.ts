export interface MarkdownProps {
    setExpandableIcon?: (showExpandedIcon: boolean) => void
    markdown: string
    className?: string
    breaks?: boolean
    disableEscapedText?: boolean
}
